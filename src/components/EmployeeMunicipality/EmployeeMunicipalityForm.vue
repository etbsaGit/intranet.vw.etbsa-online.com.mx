<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="selectedState"
        :options="states"
        label="Estado"
        option-value="id"
        option-label="name"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
        @update:model-value="updateMunicipalities(selectedState)"
      />
      <!-- :rules="[(val) => val !== null || 'Obligatorio']" -->
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-item-label caption align="center">-Municipios-</q-item-label>
    </q-item-section>
  </q-item>
  <div class="row items-start">
    <q-item
      v-for="municipality in municipalities"
      :key="municipality.id"
      class="col-2"
    >
      <q-item-section>
        <q-toggle
          v-model="selectedMunicipalities"
          :label="municipality.name"
          color="blue"
          dense
          :val="municipality.id"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { zonas } = defineProps(["zonas"]);

const states = ref([]);
const municipalities = ref([]);
const selectedState = ref(null);
const selectedMunicipalities = ref([]);

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/state", "");
  states.value = res;
};

const updateMunicipalities = (id) => {
  municipalities.value = [];
  getMunicipalities(id);
};

const getMunicipalities = async (id) => {
  if (id == null) {
    return;
  }
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/municipality/state/" + id,
    ""
  );
  municipalities.value = res;
};

const marcarToogle = () => {
  if (zonas) {
    for (const zona of zonas) {
      selectedMunicipalities.value.push(zona.id);
    }
  }
};

onMounted(() => {
  getOptions();
  marcarToogle();
});

defineExpose({
  selectedMunicipalities,
});
</script>
