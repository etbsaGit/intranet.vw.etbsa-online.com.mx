<template>
  <q-tabs
    v-model="tab"
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    dense
    align="justify"
    narrow-indicator
  >
    <q-tab name="info" icon="local_shipping" label="Informacion" />
    <q-tab name="features" icon="featured_play_list" label="Caracteristicas" />
    <q-tab name="docs" icon="folder" label="Documentos" />
  </q-tabs>
  <q-separator></q-separator>
  <q-tab-panels
    v-model="tab"
    animated
    swipeable
    vertical
    transition-prev="jump-up"
    transition-next="jump-up"
  >
    <q-tab-panel name="info">
      <q-card class="q-pa-sm">
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-h6"> Informacion general </q-item-label>
          </q-item-section>
          <q-item-section side v-if="checkPosition('Gerente')">
            <q-btn label="Guardar" color="blue" @click="putItem" />
          </q-item-section>
        </q-item>
        <vehicle-form
          ref="edit"
          :vehicle="currentVehicle"
          :key="currentVehicle"
        />
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="features">
      <q-card class="q-pa-sm">
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-h6"> Caracteristicas </q-item-label>
          </q-item-section>
        </q-item>
        <vehicle-feature-index
          :vehicle="currentVehicle"
          :key="currentVehicle"
        />
      </q-card>
    </q-tab-panel>

    <q-tab-panel name="docs">
      <q-card class="q-pa-sm">
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-h6"> Documentos </q-item-label>
          </q-item-section>
        </q-item>
        <vehicle-doc-index :vehicle="currentVehicle" :key="currentVehicle" />
      </q-card>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { checkPosition } from "src/boot/checks";

import VehicleForm from "src/components/Vehicle/VehicleForm.vue";
import VehicleFeatureIndex from "src/components/VehicleFeature/VehicleFeatureIndex.vue";
import VehicleDocIndex from "src/components/VehicleDoc/VehicleDocIndex.vue";

const { vehicle } = defineProps(["vehicle"]);

const tab = ref("info");
const currentVehicle = ref(null);
const edit = ref(null);

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formVehicle,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/vehicle/" + final.id,
    ""
  );
  currentVehicle.value = res;
};

onMounted(() => {
  currentVehicle.value = vehicle;
});
</script>
