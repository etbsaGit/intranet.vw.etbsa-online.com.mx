<template>
  <q-item v-if="checkPosition('Gerente')">
    <q-btn
      dense
      label="Agregar o quitar zonas"
      color="primary"
      @click="showDialog = true"
      icon="add_circle"
    />
  </q-item>

  <q-item>
    <q-item-section>
      <employee-municipality-maps
        :zonas="municipalities"
        :key="municipalities"
      />
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showDialog"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Guardar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <employee-municipality-form :zonas="municipalities" ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

import EmployeeMunicipalityForm from "src/components/EmployeeMunicipality/EmployeeMunicipalityForm.vue";
import EmployeeMunicipalityMaps from "src/components/EmployeeMunicipality/EmployeeMunicipalityMaps.vue";
import { checkPosition } from "src/boot/checks";

const { employee } = defineProps(["employee"]);

const empleado = ref(employee);
const add = ref(null);
const municipalities = ref([]);

const showDialog = ref(false);

const getRows = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/employee/zone/" + employee.id,
    ""
  );
  municipalities.value = res;
};

const postItem = async () => {
  const final = { municipalities: add.value.selectedMunicipalities };
  let res = await sendRequest(
    "POST",
    final,
    "/api/intranet/employee/zone/" + employee.id,
    ""
  );
  showDialog.value = false;
  getRows();
};

onMounted(() => {
  getRows();
});
</script>
