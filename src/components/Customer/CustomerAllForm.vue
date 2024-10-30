<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="info" icon="person" label="Informacion" />
    <q-tab name="sales" icon="request_quote" label="Ventas" />
    <q-tab name="docs" icon="folder" label="Documentos" />
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="info">
      <q-card class="q-pa-sm">
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-h6"> Informacion personal </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn label="Guardar" color="blue" @click="putItem" />
          </q-item-section>
        </q-item>
        <customer-form
          ref="edit"
          :customer="currentCustomer"
          :key="currentCustomer"
        />
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="sales">
      <sale-page :customer="currentCustomer" :key="currentCustomer" />
    </q-tab-panel>
    <q-tab-panel name="docs">
      <customer-docs-index :customer="currentCustomer" :key="currentCustomer" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import CustomerForm from "src/components/Customer/CustomerForm.vue";
import SalePage from "src/pages/Sale/SalePage.vue";
import CustomerDocsIndex from "../CustomerDocs/CustomerDocsIndex.vue";

const { customer } = defineProps(["customer"]);

const tab = ref("info");
const currentCustomer = ref(null);
const edit = ref(null);

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formCustomer,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/customer/" + final.id,
    ""
  );
  currentCustomer.value = res;
};

onMounted(() => {
  currentCustomer.value = customer;
});
</script>
