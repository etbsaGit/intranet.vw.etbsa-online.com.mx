<template>
  <q-splitter v-if="currentItem" v-model="splitterModel" style="height: 93vh">
    <template v-slot:before>
      <q-item>
        <q-item-section>
          <follow-up-card :followUp="currentItem" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <customer-card
            :customer="currentItem.customer"
            :reference="currentItem.reference"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <employee-card :employee="currentItem.employee" />
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:after>
      <q-item
        v-if="
          currentItem.status.name != 'Venta perdida' || checkPosition('Gerente')
        "
      >
        <q-item-section v-if="checkPosition('Gerente')">
          <q-btn
            v-if="currentItem.status.name != 'Activo'"
            dense
            outline
            label="Activar"
            color="blue-10"
            icon="fas fa-person-walking-arrow-right"
            @click="saleActive"
          />
        </q-item-section>
        <!-- <q-item-section v-if="currentItem.children.length >= 3">
          <q-btn
            v-if="
              hasNullFeedback(currentItem.children) &&
              currentItem.status.name == 'Activo'
            "
            dense
            outline
            label="Venta ganada"
            color="green-10"
            icon="fas fa-circle-dollar-to-slot"
            @click="saleWin"
          />
        </q-item-section> -->
        <q-item-section>
          <q-btn
            v-if="
              hasNullFeedback(currentItem.children) &&
              currentItem.status.name == 'Activo'
            "
            dense
            outline
            label="Venta perdida"
            color="red-10"
            icon="far fa-thumbs-down"
            @click="openFailedSale"
          />
        </q-item-section>
        <q-item-section>
          <q-btn
            v-if="hasNullFeedback(currentItem.children)"
            dense
            outline
            label="Agregar"
            color="primary"
            icon="add_circle"
            @click="addFollowUp = true"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <follow-up-menu :followUp="currentItem" />
        </q-item-section>
      </q-item>
    </template>
  </q-splitter>

  <q-dialog
    v-model="addFeedback"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar retroalimentacion</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="putFeedBack" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <feedback-form ref="add" :followUp="children" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="addFollowUp"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Agregar proximo seguimiento
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postNext" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <follow-up-next-form ref="next" :followUp="currentItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="addFailedSales"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6"> Venta perdida </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Guardar" color="blue" @click="saleLost" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <failed-sale-form
            ref="fail"
            :followUp="currentItem"
            :failedSale="currentItem.failed_sale"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { checkPosition } from "src/boot/checks";

import CustomerCard from "src/components/FollowUp/CustomerCard.vue";
import EmployeeCard from "src/components/FollowUp/EmployeeCard.vue";
import FollowUpMenu from "src/components/FollowUp/FollowUpMenu.vue";
import FollowUpCard from "src/components/FollowUp/FollowUpCard.vue";
import FollowUpNextForm from "src/components/FollowUp/FollowUpNextForm.vue";
import FeedbackForm from "src/components/FollowUp/FeedbackForm.vue";
import FailedSaleForm from "src/components/FollowUp/FailedSaleForm.vue";

const { followUp } = defineProps(["followUp"]);

const bus = inject("bus");

const splitterModel = ref(50);
const currentItem = ref(null);
const addFeedback = ref(false);
const add = ref(null);
const addFollowUp = ref(false);
const next = ref(null);
const children = ref(null);
const addFailedSales = ref(null);
const fail = ref(null);

bus.on("open-feedback", (item) => {
  children.value = item;
  addFeedback.value = true;
});

bus.on("venta-ganada", () => {
  getItem(followUp.follow_up_id ? followUp.follow_up_id : followUp.id);
});

const getItem = async (id) => {
  let res = await sendRequest("GET", null, "/api/intranet/followUp/" + id, "");
  currentItem.value = res;
};

const putFeedBack = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...add.value.formFeedback,
  };

  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/followUp/" + final.id,
    ""
  );
  addFeedback.value = false;
  getItem(followUp.id);
};

const postNext = async () => {
  const next_valid = await next.value.validate();
  if (!next_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...next.value.formFollowUp,
  };

  let res = await sendRequest(
    "POST",
    final,
    "/api/intranet/followUp/next/" + currentItem.value.id,
    ""
  );
  addFollowUp.value = false;
  getItem(currentItem.value.id);
};

const openFailedSale = () => {
  addFailedSales.value = true;
};

const saleLost = async () => {
  const fail_valid = await fail.value.validate();
  if (!fail_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...fail.value.formFailedSale,
  };
  if (final.id) {
    let res = await sendRequest(
      "PUT",
      final,
      "/api/intranet/failedSale/" + final.id,
      ""
    );
  } else {
    let res = await sendRequest("POST", final, "/api/intranet/failedSale", "");
  }
  addFailedSales.value = false;
  getItem(currentItem.value.id);
  bus.emit("venta-activada");
};

const saleWin = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/followUp/win/" + currentItem.value.id,
    ""
  );
  getItem(currentItem.value.id);
};

const saleActive = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/followUp/active/" + currentItem.value.id,
    ""
  );
  getItem(currentItem.value.id);
  bus.emit("venta-activada");
};

function hasNullFeedback(array) {
  // Verifica si alguno de los objetos en el array tiene feedback nulo
  return !array.some((item) => item.feedback === null);
}

onMounted(() => {
  getItem(followUp.follow_up_id ? followUp.follow_up_id : followUp.id);
});
</script>
