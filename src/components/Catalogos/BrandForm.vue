<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          color="secondary"
          dense
          outlined
          v-model="formBrand.name"
          label="Nombre de la marca"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-file
          clearable
          color="secondary"
          dense
          outlined
          v-model="formBrand.file"
          label="imagen de la marca"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif"
          @clear="formBrand.base64 = null"
          @input="convertirFile($event)"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="formBrand.base64 || path">
      <q-item-section>
        <q-img :src="formBrand.base64 ? formBrand.base64 : path" />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { brand } = defineProps(["brand"]);

const myForm = ref(null);

const path = brand ? brand.logopath : null;

const formBrand = ref({
  id: brand ? brand.id : null,
  base64: null,
  file: [],
  name: brand ? brand.name : null,
});

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formBrand.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formBrand.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formBrand,
  validate,
});
</script>
