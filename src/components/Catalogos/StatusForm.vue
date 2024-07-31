<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formStatus.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formStatus.status_key"
          filled
          dense
          label="Clave"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { status } = defineProps(["status"]);

const myForm = ref(null);

const formStatus = ref({
  id: status ? status.id : null,
  name: status ? status.name : null,
  status_key: status ? status.status_key : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formStatus,
  validate,
});
</script>
