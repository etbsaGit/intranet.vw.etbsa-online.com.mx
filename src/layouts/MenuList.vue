<template>
  <q-list bordered padding class="rounded-borders text-primary">
    <q-item
      clickable
      v-ripple
      to="/customer"
      :active="link === 'customer'"
      @click="link = 'customer'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="group" />
      </q-item-section>

      <q-item-section>Clientes</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      to="/vehicle"
      :active="link === 'vehicle'"
      @click="link = 'vehicle'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="local_shipping" />
      </q-item-section>

      <q-item-section>Vehiculos</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      to="/catalogos"
      :active="link === 'catalogos'"
      @click="link = 'catalogos'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="list" />
      </q-item-section>

      <q-item-section>Catalogos</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from "vue";

const link = ref("inbox");
</script>

<style lang="sass">
.my-menu-link
  color: black
  background: gray
</style>
