<template>
  <q-card class="text-white no-shadow bg-primary" style="border-radius: 10px">
    <q-card-section>
      <div class="text-h6 text-center">
        {{ currentMonth }}
        {{ currentYear }}
      </div>
    </q-card-section>
    <q-separator color="white" />
    <q-card-section horizontal>
      <q-card-section class="col-6">
        <q-item class="text-h3 text-weight-bolder text-center">
          <q-item-section> Prospección </q-item-section>
        </q-item>
        <q-item class="text-h6 text-weight-bolder text-center">
          <q-item-section>
            <q-item-label>Unidades</q-item-label>
            <q-item-label>{{ prospeccion.quantity }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>Cantidad $</q-item-label>
            <q-item-label>{{ formatCurrency(prospeccion.value) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator vertical color="white"></q-separator>
      <q-card-section class="col-6">
        <q-item class="text-h3 text-weight-bolder text-center">
          <q-item-section> Venta </q-item-section>
        </q-item>
        <q-item class="text-h6 text-weight-bolder text-center">
          <q-item-section>
            <q-item-label>Unidades</q-item-label>
            <q-item-label>{{ venta.quantity }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>Cantidad $</q-item-label>
            <q-item-label>{{ formatCurrency(venta.value) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatCurrency } from "src/boot/format";

const { employee } = defineProps(["employee"]);

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const items = ref([]);
const currentYear = ref(new Date().getFullYear());
const currentMonthIndex = new Date().getMonth();
const currentMonth = ref(meses[currentMonthIndex]);

const prospeccion = ref({ quantity: 0, value: 0 });
const venta = ref({ quantity: 0, value: 0 });

const getItems = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/target/employee/" + employee.id,
    ""
  );
  items.value = res;

  // Filtra y agrupa los datos
  prospeccion.value = res.find((item) => item.type.name === "Prospeccion") || {
    quantity: 0,
    value: 0,
  };
  venta.value = res.find((item) => item.type.name === "Venta") || {
    quantity: 0,
    value: 0,
  };
};

onMounted(() => {
  getItems();
});
</script>
