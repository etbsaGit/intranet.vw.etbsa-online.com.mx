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
  <q-page class="flex flex-center">
    <div class="fullscreen-img-container">
      <q-img
        src="~src\assets\index.jpg"
        alt="Descripción de la imagen"
        class="fullscreen-img"
      />
    </div>
  </q-page>
</template>

<script setup>
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
