<template>
  <q-item>
    <q-item-section avatar>
      <q-icon class="pulse-icon" name="warning" size="4rem" color="red-10" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <strong>Motivo:</strong>
        {{ followUp.failed_sale.type.name }}
      </q-item-label>
      <q-item-label>
        <strong>Comentarios:</strong>
        {{ followUp.failed_sale.comments }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const { followUp } = defineProps(["followUp"]);
</script>

<style>
.pulse-icon {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
