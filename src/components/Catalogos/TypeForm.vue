<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formType.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formType.type_key"
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

const { type } = defineProps(["type"]);

const myForm = ref(null);

const formType = ref({
  id: type ? type.id : null,
  name: type ? type.name : null,
  type_key: type ? type.type_key : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formType,
  validate,
});
</script>
