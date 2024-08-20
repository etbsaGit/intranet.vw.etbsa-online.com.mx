<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAgency.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAgency.address"
          filled
          dense
          label="Calle y numero"
          lazy-rules
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formAgency.district"
          filled
          dense
          label="Colonia"
          lazy-rules
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formAgency.zip_code"
          filled
          dense
          label="Codigo postal"
          lazy-rules
          mask="#####"
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formAgency.state_id"
          :options="states"
          label="Estado"
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
          hint
          @update:model-value="updateMunicipalities(formAgency.state_id)"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formAgency.municipality_id"
          :options="municipalities"
          label="Ciudad"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
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

const { agency } = defineProps(["agency"]);

const states = ref([]);
const municipalities = ref([]);

const myForm = ref(null);

const formAgency = ref({
  id: agency ? agency.id : null,
  name: agency ? agency.name : null,
  address: agency ? agency.address : null,
  district: agency ? agency.district : null,
  zip_code: agency ? agency.zip_code : null,
  municipality_id: agency ? agency.municipality_id : null,
  state_id: agency ? agency.state_id : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/state", "");
  states.value = res;
};

const updateMunicipalities = (id) => {
  formAgency.value.municipality_id = null;
  municipalities.value = [];
  getMunicipalities(id);
};

const getMunicipalities = async (id) => {
  if (id == null) {
    return;
  }
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/municipality/state/" + id,
    ""
  );
  municipalities.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  if (agency && formAgency.value.state_id) {
    getMunicipalities(formAgency.value.state_id);
  }
  getOptions();
});

defineExpose({
  formAgency,
  validate,
});
</script>
