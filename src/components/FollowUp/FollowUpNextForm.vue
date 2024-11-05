<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formFollowUp.date"
          dense
          outlined
          label="Proximo contacto"
          mask="date"
          hint
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="formFollowUp.date"
                  minimal
                  :options="dateOptions"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formFollowUp.percentage_id"
          :options="percentages"
          label="Certeza"
          option-value="id"
          options-dense
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip outline :color="getNumber(scope.opt.name).color">
                  {{ getNumber(scope.opt.name).label }}
                </q-chip>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formFollowUp.vehicle_id"
          :options="vehicles"
          label="Modelo de interes"
          option-value="id"
          options-dense
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          clearable
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formFollowUp.comments"
          outlined
          dense
          label="Comentarios"
          lazy-rules
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { date } from "quasar";
import { sendRequest } from "src/boot/functions";
import { getNumber } from "src/boot/followUp";

const { followUp } = defineProps(["followUp"]);

const percentages = ref([]);
const vehicles = ref([]);

const timeStamp = Date.now();
const today = date.formatDate(timeStamp, "YYYY/MM/DD");

function dateOptions(date) {
  return date >= today;
}

const myForm = ref(null);

const formFollowUp = ref({
  date: null,
  percentage_id: followUp.lastPercentage.id,
  vehicle_id: followUp.vehicle_id,
  comments: null,
  follow_up_id: followUp.id,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/followUp/options",
    ""
  );
  percentages.value = res.percentages;
  vehicles.value = res.vehicles;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formFollowUp,
  validate,
});
</script>
