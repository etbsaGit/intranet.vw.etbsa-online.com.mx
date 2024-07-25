<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="selectedType"
          :options="types"
          label="Tipo"
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
          @update:model-value="updateFeatures(selectedType)"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formFeatures.feature_id"
          :options="features"
          label="Caracteristica"
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
          filled
          dense
          v-model="formFeatures.value"
          label="Valor"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { feature, vehicle } = defineProps(["feature", "vehicle"]);

const myForm = ref(null);
const types = ref([]);
const selectedType = ref(null);
const features = ref([]);

const formFeatures = ref({
  id: feature ? feature.vehicles.id : null,
  vehicle_id: feature ? feature.vehicles.vehicle_id : vehicle.id,
  feature_id: feature ? feature.vehicles.feature_id : null,
  value: feature ? feature.vehicles.value : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/type/key/features",
    ""
  );
  types.value = res;
};

const updateFeatures = (id) => {
  formFeatures.value.feature_id = null;
  features.value = [];
  getFeatures(id);
};

const getFeatures = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/feature/type/" + id,
    ""
  );
  features.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  if (feature) {
    selectedType.value = feature.type_id;
    getFeatures(feature.type_id);
  }
  getOptions();
});

defineExpose({
  formFeatures,
  validate,
});
</script>
