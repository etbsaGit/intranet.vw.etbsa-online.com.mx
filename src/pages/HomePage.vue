<!-- <template>
  <q-page class="flex flex-center">
    <q-img alt="Quasar logo" src="~src\assets\index.jpg" />
  </q-page>
</template>

<script setup>
defineOptions({
  name: "HomePage",
});
</script> -->
<template>
  <!-- <q-page class="flex flex-center">
    <div class="fullscreen-img-container">
      <q-img
        src="~src\assets\index.jpg"
        alt="Descripción de la imagen"
        class="fullscreen-img"
      />
    </div>
  </q-page> -->
  <q-carousel
    animated
    v-model="slide"
    navigation
    infinite
    :autoplay="autoplay"
    arrows
    transition-prev="fade"
    transition-next="fade"
    @mouseenter="autoplay = true"
    @mouseleave="autoplay = true"
    style="height: 93vh"
  >
    <q-carousel-slide :name="1" img-src="~src\assets\index3.jpg" />
    <q-carousel-slide :name="2" img-src="~src\assets\index.jpg" />
  </q-carousel>
  <q-page-sticky position="bottom-right" :offset="[30, 30]">
    <q-btn dense flat>
      <q-avatar size="200px" square>
        <img src="~src\assets\SU.png" />
      </q-avatar>
    </q-btn>
  </q-page-sticky>
</template>

<script setup>
import { ref } from "vue";
const slide = ref(1);
const autoplay = ref(2000);
defineOptions({
  name: "HomePage",
});
</script>

<style>
.fullscreen-img-container {
  position: relative;
  width: 100%;
  height: 93vh; /* Altura igual al viewport height */
  overflow: hidden; /* Oculta cualquier parte de la imagen que se extienda más allá del contenedor */
}

.fullscreen-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  max-height: 100%; /* Altura máxima igual al viewport height */
  object-fit: contain; /* Ajusta la imagen dentro del contenedor manteniendo su relación de aspecto */
}
</style>
