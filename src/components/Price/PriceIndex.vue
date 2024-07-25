<template>
  <q-item>
    <q-btn
      dense
      label="Agregar precio"
      color="primary"
      icon="add_circle"
      @click="showAdd = true"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-list separator>
        <q-item align="center">
          <q-item-section avatar>
            <q-item-label><strong>Editar</strong></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Tipo de precio</strong></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Precio</strong></q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-for="(price, index) in rows" :key="index" align="center">
          <q-item-section avatar>
            <q-btn
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(price)"
            />
          </q-item-section>
          <q-item-section>
            {{ price.type.name }}
          </q-item-section>
          <q-item-section> ${{ price.price }} </q-item-section>
        </q-item>
      </q-list>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <price-form ref="add" :vehicle="vehicle" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putItem" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="destroyItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <price-form ref="edit" :price="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import PriceForm from "src/components/Price/PriceForm.vue";

const { vehicle } = defineProps(["vehicle"]);

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const getRows = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/price/vehicle/" + id,
    ""
  );
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...add.value.formPrice,
  };
  let res = await sendRequest("POST", final, "/api/intranet/price", "");
  showAdd.value = false;
  getRows(vehicle.id);
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formPrice,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/price/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(vehicle.id);
};

const destroyItem = async () => {
  const id = selectedItem.value.id;
  let res = await sendRequest("DELETE", null, "/api/intranet/price/" + id, "");
  selectedItem.value = null;
  showEdit.value = false;
  getRows(vehicle.id);
};

onMounted(() => {
  getRows(vehicle.id);
});
</script>
