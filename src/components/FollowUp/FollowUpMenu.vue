<template>
  <q-card flat bordered>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey-10"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="timeLine" label="Historico" />
      <q-tab
        name="failedSale"
        label="Venta perdida"
        v-if="followUp.failed_sale"
        class="bg-red-11"
        style="border-radius: 10px"
      />
      <q-tab name="quote" label="Cotizaciones" />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="timeLine">
        <follow-up-time-line :followUp="followUp" />
      </q-tab-panel>

      <q-tab-panel name="failedSale">
        <failed-sale-card :followUp="followUp" />
      </q-tab-panel>

      <q-tab-panel name="quote" class="q-pa-none">
        <quote-index :followUp="followUp" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import FollowUpTimeLine from "src/components/FollowUp/FollowUpTimeLine.vue";
import FailedSaleCard from "src/components/FollowUp/FailedSaleCard.vue";
import QuoteIndex from "src/components/FollowUp/QuoteIndex.vue";
const tab = ref("timeLine");
const { followUp } = defineProps(["followUp"]);
</script>
