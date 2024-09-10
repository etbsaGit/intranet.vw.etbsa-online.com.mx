<template>
  <q-timeline color="secondary">
    <q-timeline-entry
      v-for="(follow, index) in followUp.children"
      :key="index"
      :title="follow.comments"
      :subtitle="formatDateplusone(follow.date)"
      :color="getColor(follow.feedback)"
      @click="!follow.feedback ? openAddFeedBack(follow) : null"
    >
      <q-tooltip class="text-h6 bg-primary" v-if="!follow.feedback">
        Haz click para agregar retroalimentacion
      </q-tooltip>
      <q-item dense>
        <q-item-section>
          <strong>Retroalimentacion:</strong>
          {{ follow.feedback }}
        </q-item-section>
        <q-item-section side>
          <q-chip outline :color="getNumber(follow.percentage.name).color">
            {{ follow.percentage.name }}
            {{ getNumber(follow.percentage.name).label }}
          </q-chip>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section>
          <q-item-label>
            <strong> Ultima actualizacion:</strong>
            {{ formatDateAt(follow.updated_at) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-timeline-entry>
    <q-timeline-entry
      :title="followUp.comments"
      :subtitle="formatDateplusone(followUp.date)"
    >
      <q-item dense>
        <q-item-section>
          <strong>Primer contacto</strong>
        </q-item-section>
        <q-item-section side>
          <q-chip outline :color="getNumber(followUp.percentage.name).color">
            {{ followUp.percentage.name }}
            {{ getNumber(followUp.percentage.name).label }}
          </q-chip>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section>
          <q-item-label>
            <strong> Ultima actualizacion:</strong>
            {{ formatDateAt(followUp.updated_at) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-timeline-entry>
  </q-timeline>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import {
  formatDateLong,
  formatDateplusone,
  formatDateAt,
} from "src/boot/format";
import { getNumber } from "src/boot/followUp";

const { followUp } = defineProps(["followUp"]);

const bus = inject("bus");

const openAddFeedBack = (item) => {
  bus.emit("open-feedback", item);
};

const getColor = (feedback) => {
  if (!feedback) {
    return "red";
  }
};
</script>
