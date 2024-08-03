<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section class="col-2">
        <q-input
          v-model="formCustomer.id_customer"
          filled
          dense
          label="# Cliente"
          lazy-rules
          hint
          mask="#######"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCustomer.name"
          filled
          dense
          label="Nombre / Razon social"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          v-model="formCustomer.type_id"
          :options="types"
          label="Tipo de persona"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCustomer.rfc"
          filled
          dense
          label="RFC"
          lazy-rules
          hint
        />
        <!-- :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) =>
              (val && val.length === 13) ||
              'El RFC debe tener exactamente 13 caracteres',
          ]" -->
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCustomer.curp"
          filled
          dense
          label="CURP"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label caption align="center">-Datos de contacto-</q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formCustomer.phone"
          label="Telefono"
          mask="(###) ### - ####"
          unmasked-value
          hint
        />
        <!-- :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" -->
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formCustomer.landline"
          label="Telefono de casa"
          mask="(###) ### - ####"
          unmasked-value
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input filled dense v-model="formCustomer.email" label="Email" hint />
        <!-- :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) =>
              !val ||
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
              'Formato de correo inválido',
          ]" -->
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formCustomer.state_id"
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
          @update:model-value="updateMunicipalities(formCustomer.state_id)"
        />
        <!-- :rules="[(val) => val !== null || 'Obligatorio']" -->
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCustomer.municipality_id"
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
        />
        <!-- :rules="[(val) => val !== null || 'Obligatorio']" -->
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCustomer.district"
          filled
          dense
          label="Colonia"
          lazy-rules
          hint
        />
        <!-- :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" -->
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCustomer.street"
          filled
          dense
          label="Calle"
          lazy-rules
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCustomer.zip_code"
          filled
          dense
          label="Codigo postal"
          lazy-rules
          mask="#####"
        />
        <!-- :rules="[(val) => val !== null || 'Obligatorio']" -->
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { customer } = defineProps(["customer"]);

const states = ref([]);
const municipalities = ref([]);
const types = ref([]);

const myForm = ref(null);

const formCustomer = ref({
  id: customer ? customer.id : null,
  id_customer: customer ? customer.id_customer : null,
  name: customer ? customer.name : null,
  rfc: customer ? customer.rfc : null,
  curp: customer ? customer.curp : null,
  phone: customer ? customer.phone : null,
  landline: customer ? customer.landline : null,
  email: customer ? customer.email : null,
  street: customer ? customer.street : null,
  district: customer ? customer.district : null,
  zip_code: customer ? customer.zip_code : null,
  municipality_id: customer ? customer.municipality_id : null,
  state_id: customer ? customer.state_id : null,
  type_id: customer ? customer.type_id : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/customer/options",
    ""
  );
  states.value = res.states;
  types.value = res.types;
};

const updateMunicipalities = (id) => {
  formCustomer.value.municipality_id = null;
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
  if (customer && formCustomer.value.state_id) {
    getMunicipalities(formCustomer.value.state_id);
  }
  getOptions();
});

defineExpose({
  formCustomer,
  validate,
});
</script>
