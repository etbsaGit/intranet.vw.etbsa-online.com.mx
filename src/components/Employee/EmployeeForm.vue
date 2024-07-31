<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.first_name"
          filled
          dense
          label="Primer nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.middle_name"
          filled
          dense
          label="Segundo nombre"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.paternal_surname"
          filled
          dense
          label="Apellido paterno"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEmployee.maternal_surname"
          filled
          dense
          label="Apellido materno"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEmployee.rfc"
          filled
          dense
          label="RFC"
          lazy-rules
          :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) =>
              (val && val.length === 13) ||
              'El RFC debe tener exactamente 13 caracteres',
          ]"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formEmployee.agency_id"
          :options="agencies"
          label="Agencia"
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
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { employee } = defineProps(["employee"]);

const agencies = ref([]);

const myForm = ref(null);

const formEmployee = ref({
  id: employee ? employee.id : null,
  first_name: employee ? employee.first_name : null,
  middle_name: employee ? employee.middle_name : null,
  paternal_surname: employee ? employee.paternal_surname : null,
  maternal_surname: employee ? employee.maternal_surname : null,
  rfc: employee ? employee.rfc : null,
  agency_id: employee ? employee.agency_id : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/employee/options",
    ""
  );
  agencies.value = res.agencies;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formEmployee,
  validate,
});
</script>
