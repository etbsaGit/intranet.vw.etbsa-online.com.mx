<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="vehicles" label="Vehiculos" />
    <q-tab name="vehicleBodies" label="Carroserias" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="vehicles" class="q-pa-none">
      <vehicle-page />
    </q-tab-panel>
    <q-tab-panel name="vehicleBodies" class="q-pa-none">
      <vehicle-body-page />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import VehiclePage from "src/pages/Vehicle/VehiclePage.vue";
import VehicleBodyPage from "src/pages/Vehicle/VehicleBodyPage.vue";

const tab = ref("vehicles");
</script>
