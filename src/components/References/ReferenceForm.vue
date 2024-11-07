<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formReference.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formReference.phone"
          label="Telefono movil"
          mask="(###) ### - ####"
          unmasked-value
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:prepend>
            <q-icon name="fa-brands fa-whatsapp" />
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formReference.mail"
          label="Email"
          :rules="[
            (val) =>
              !val ||
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
              'Formato de correo inválido',
          ]"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { reference, customer } = defineProps(["reference", "customer"]);

const myForm = ref(null);

const formReference = ref({
  id: reference ? reference.id : null,
  name: reference ? reference.name : null,
  phone: reference ? reference.phone : null,
  mail: reference ? reference.mail : null,
  customer_id: reference ? reference.customer_id : customer.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formReference,
  validate,
});
</script>
