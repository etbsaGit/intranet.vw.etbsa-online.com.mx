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
          <q-item-section side>
            <q-btn label="Guardar" color="blue" @click="putItem" />
          </q-item-section>
        </q-item>
        <inventory-form ref="edit" :inventory="current" :key="current" />
      </q-card>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import InventoryForm from "src/components/Inventory/InventoryForm.vue";

const { inventory } = defineProps(["inventory"]);

const tab = ref("info");
const current = ref(null);
const edit = ref(null);

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formInventory,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/inventory/" + final.id,
    ""
  );
  current.value = res;
};

onMounted(() => {
  current.value = inventory;
});
</script>
