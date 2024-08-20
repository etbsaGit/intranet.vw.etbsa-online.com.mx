<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formPosition.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formPosition.description"
          filled
          dense
          label="Descripcion"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { position } = defineProps(["position"]);

const myForm = ref(null);

const formPosition = ref({
  id: position ? position.id : null,
  name: position ? position.name : null,
  description: position ? position.description : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formPosition,
  validate,
});
</script>
