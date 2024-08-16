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
    <q-tab name="info" icon="request_quote" label="Informacion" />
    <q-tab name="dates" icon="event" label="Fechas" />
  </q-tabs>
  <q-separator />
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
        <sale-form ref="edit" :sale="currentItem" :key="currentItem" />
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="dates">
      <q-card class="q-pa-sm">
        <sale-date-index ref="edit" :sale="currentItem" :key="currentItem" />
      </q-card>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import SaleForm from "src/components/Sale/SaleForm.vue";
import SaleDateIndex from "src/components/SaleDate/SaleDateIndex.vue";

const { sale } = defineProps(["sale"]);

const tab = ref("info");
const currentItem = ref(null);
const edit = ref(null);

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formSale,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/sale/" + final.id,
    ""
  );
  currentItem.value = res;
};

onMounted(() => {
  currentItem.value = sale;
});
</script>
