<template>
  <q-card flat bordered>
    <q-item>
      <q-item-section class="text-h6">
        <q-item-label caption>
          Modelos de interes o nombre del proyecto
        </q-item-label>
        <q-item-label>{{ followUp.title }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          v-if="checkRole('Admin')"
          dense
          outline
          label="Borrar seguimiento"
          color="red-10"
          icon="fas fa-trash"
          @click="deleteFollow"
        />
      </q-item-section>
      <!-- <q-item-section avatar>
        <q-item-label>
          <q-icon name="far fa-pen-to-square" size="2em" color="blue-6" />
        </q-item-label>
      </q-item-section> -->
    </q-item>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6">
            <strong>Origen:</strong>
            {{ followUp.origin.name }}
          </q-item-label>
          <q-item-label>
            <strong>% de certeza actual:</strong>
            <q-chip
              outline
              :color="getNumber(followUp.lastPercentage.name).color"
            >
              {{ followUp.lastPercentage.name }}
              {{ getNumber(followUp.lastPercentage.name).label }}
            </q-chip>
          </q-item-label>
          <q-item-label>
            <strong>Status:</strong>
            <q-chip outline :color="getStatus(followUp.status.name).color">
              {{ followUp.status.name }}
            </q-chip>
          </q-item-label>
          <q-item-label class="text-h6">
            <strong>Unidad de interes:</strong>
            {{ followUp.lastVehicle?.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { inject } from "vue";
const { followUp } = defineProps(["followUp"]);
import { checkRole } from "src/boot/checks";
import { getNumber, getStatus } from "src/boot/followUp";
import { sendRequest } from "src/boot/functions";

const bus = inject("bus");

const deleteFollow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/followUp/" + followUp.id,
    ""
  );
  bus.emit("follow-delete");
};
</script>
