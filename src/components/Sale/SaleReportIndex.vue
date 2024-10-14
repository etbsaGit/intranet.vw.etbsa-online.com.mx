<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formReport.agency_id"
          :options="agencies"
          label="Agencia"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formReport.month"
          :options="meses"
          label="Mes"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formReport.year"
          :options="years"
          label="Año"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:after>
            <q-btn label="Obtener" @click="submitForm" />
          </template>
        </q-select>
      </q-item-section>
    </q-item>
  </q-form>

  <q-item v-if="agency_summary">
    <q-item-section>
      <sale-report-agency-card :data="agency_summary" :key="agency_summary" />
    </q-item-section>
  </q-item>

  <q-separator></q-separator>

  <q-item>
    <q-item-section>
      <q-item-label caption align="center">
        <div class="text-h6">-Por vendedor-</div>
      </q-item-label>
    </q-item-section>
  </q-item>

  <q-item v-for="(employee, index) in employees" :key="index">
    <q-item-section>
      <sale-report-employee-card :employee="employee" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

import SaleReportEmployeeCard from "src/components/Sale/SaleReportEmployeeCard.vue";
import SaleReportAgencyCard from "src/components/Sale/SaleReportAgencyCard.vue";

const myForm = ref(null);
const agencies = ref([]);
const employees = ref(null);
const agency_summary = ref(null);
const meses = [
  { id: 1, name: "Enero" },
  { id: 2, name: "Febrero" },
  { id: 3, name: "Marzo" },
  { id: 4, name: "Abril" },
  { id: 5, name: "Mayo" },
  { id: 6, name: "Junio" },
  { id: 7, name: "Julio" },
  { id: 8, name: "Agosto" },
  { id: 9, name: "Septiembre" },
  { id: 10, name: "Octubre" },
  { id: 11, name: "Noviembre" },
  { id: 12, name: "Diciembre" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 9 + i).map(
  (year) => ({ id: year, name: year })
);

const formReport = ref({
  month: meses[new Date().getMonth()], // Solo el id del mes actual
  year: currentYear,
  agency_id: null,
});

const getOptions = async () => {
  const res = await sendRequest("GET", null, "/api/intranet/agency", "");
  agencies.value = res;
};

const submitForm = async () => {
  const isValid = await myForm.value.validate();
  if (isValid) {
    let res = await sendRequest(
      "POST",
      formReport.value,
      "/api/intranet/sales/report/agency/all",
      ""
    );
    employees.value = res.employees;
    agency_summary.value = res.agency_summary;
  }
};

onMounted(() => {
  getOptions();
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(400px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 10px;
}
</style>
