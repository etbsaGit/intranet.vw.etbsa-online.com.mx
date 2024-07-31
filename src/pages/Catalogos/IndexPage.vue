<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="types" label="Tipos" />
    <q-tab name="statuses" label="Estatus" />
    <q-tab name="brands" label="Marcas" />
    <q-tab name="features" label="Caracteristicas" />
    <q-tab name="agencies" label="Agencias" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="types" class="q-pa-none">
      <type-page />
    </q-tab-panel>
    <q-tab-panel name="statuses" class="q-pa-none">
      <status-page />
    </q-tab-panel>
    <q-tab-panel name="brands" class="q-pa-none">
      <brand-page />
    </q-tab-panel>
    <q-tab-panel name="features" class="q-pa-none">
      <feature-page />
    </q-tab-panel>
    <q-tab-panel name="agencies" class="q-pa-none">
      <agency-page />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import TypePage from "src/pages/Catalogos/TypePage.vue";
import BrandPage from "src/pages/Catalogos/BrandPage.vue";
import FeaturePage from "src/pages/Catalogos/FeaturePage.vue";
import StatusPage from "src/pages/Catalogos/StatusPage.vue";
import AgencyPage from "src/pages/Catalogos/AgencyPage.vue";

const tab = ref("types");
</script>
