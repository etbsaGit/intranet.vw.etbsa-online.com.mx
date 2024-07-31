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
      <q-item-section>
        <q-input
          v-model="formAgency.address"
          filled
          dense
          label="Domicilio"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { agency } = defineProps(["agency"]);

const myForm = ref(null);

const formAgency = ref({
  id: agency ? agency.id : null,
  name: agency ? agency.name : null,
  address: agency ? agency.address : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formAgency,
  validate,
});
</script>
