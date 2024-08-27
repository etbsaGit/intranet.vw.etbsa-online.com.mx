<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formVehicleBody.type_id"
          :options="types"
          label="Tipo de carroseria"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formVehicleBody.configuration"
          filled
          dense
          label="Configuracion de la carroceria"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { vehicleBody } = defineProps(["vehicleBody"]);

const myForm = ref(null);
const types = ref([]);

const formVehicleBody = ref({
  id: vehicleBody ? vehicleBody.id : null,
  type_id: vehicleBody ? vehicleBody.type_id : null,
  configuration: vehicleBody ? vehicleBody.configuration : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/type/key/vehicleBody",
    ""
  );
  types.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formVehicleBody,
  validate,
});
</script>
