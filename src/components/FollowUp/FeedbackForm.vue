<template>
  <q-form ref="myForm" greedy class="card-container">
    <q-item>
      <q-item-section>
        <q-input
          v-model="formFeedback.feedback"
          outlined
          dense
          label="Retroalimentacion"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formFeedback.vehicle_id"
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
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { followUp } = defineProps(["followUp"]);

const vehicles = ref([]);

const myForm = ref(null);

const formFeedback = ref({
  id: followUp.id,
  vehicle_id: followUp ? followUp.vehicle_id : null,
  feedback: null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/followUp/options",
    ""
  );
  vehicles.value = res.vehicles;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formFeedback,
  validate,
});
</script>
