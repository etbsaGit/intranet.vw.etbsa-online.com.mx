<template>
  <q-item class="card-doc">
    <q-item-section class="items-center">
      <q-avatar square size="100px">
        <q-img :src="imgSrc" @error="noImage" />
      </q-avatar>
      {{ doc.name }}
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, computed } from "vue";

const { doc } = defineProps(["doc"]);

// Ruta de la imagen por defecto
const defaultImage =
  "https://test-vwbajio-bucket.s3.us-west-1.amazonaws.com/noimage.jpg";

// La imagen que se mostrará en la vista
const imgSrc = ref(doc.realpath);

// Función que se llama cuando ocurre un error en la carga de la imagen
const noImage = () => {
  imgSrc.value = defaultImage;
};
</script>

<style>
.card-doc {
  height: 100%; /* Para asegurar que todas las tarjetas tengan la misma altura */
  box-sizing: border-box;
  border: 1px solid black;
}
</style>
