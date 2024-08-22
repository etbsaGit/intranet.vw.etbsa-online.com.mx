<template>
  <q-item class="year-navigator">
    <q-btn @click="prevYear" round dense flat icon="arrow_left" />
    <span class="year-display">{{ currentYear }}</span>
    <q-btn @click="nextYear" round dense flat icon="arrow_right" />
  </q-item>

  <q-list bordered separator class="rounded-borders">
    <q-expansion-item
      class="bg-primary text-white text-center q-mb-sm"
      v-for="(agency, index) in items"
      :key="index"
      expand-separator
      :label="agency.name"
      default-opened
    >
      <q-item class="month-cards text-black">
        <q-card
          v-for="(month, index) in months"
          :key="index"
          @click="openForm(month, agency)"
          :class="{
            'card-month': true,
          }"
        >
          <q-item dense align="center">
            <q-item-section>
              <q-item-label class="text-h6">
                {{ month.name }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            dense
            v-if="getItemForMonth(month.id, agency.employees).Prospeccion"
          >
            <q-item-section>
              <q-item-label>
                <strong>Meta de prospeccion</strong>
              </q-item-label>
              <q-item-label>
                Valor:
                {{
                  formatCurrency(
                    getItemForMonth(month.id, agency.employees).Prospeccion
                      .totalValue
                  )
                }}
                Unidades:
                {{
                  getItemForMonth(month.id, agency.employees).Prospeccion
                    .totalQuantity
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            dense
            v-if="getItemForMonth(month.id, agency.employees).Venta"
          >
            <q-item-section>
              <q-item-label>
                <strong>Meta de venta</strong>
              </q-item-label>
              <q-item-label>
                Valor:
                {{
                  formatCurrency(
                    getItemForMonth(month.id, agency.employees).Venta.totalValue
                  )
                }}
                Unidades:
                {{
                  getItemForMonth(month.id, agency.employees).Venta
                    .totalQuantity
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="
              getItemForMonth(month.id, agency.employees).empleadosSinMeta
                .length
            "
          >
            <q-item-section>
              <q-item-label>
                <strong> Empleados sin metas asignadas </strong>
              </q-item-label>
              <q-item-label
                v-for="employee in getItemForMonth(month.id, agency.employees)
                  .empleadosSinMeta"
                :key="employee.id"
              >
                {{ employee }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </q-item>
    </q-expansion-item>
  </q-list>

  <q-dialog
    v-model="addForm"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    full-width
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">{{ selectedMonth.name }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Guardar" color="green" @click="postTargets" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <target-form
            ref="add"
            :month="selectedMonth.id"
            :year="currentYear"
            :agency="selectedAgency.id"
            :key="selectedMonth"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { formatCurrency } from "src/boot/format";

import TargetForm from "src/components/Target/TargetForm.vue";

const items = ref(null);
const selectedMonth = ref(null);
const currentYear = ref(new Date().getFullYear());
const selectedAgency = ref(null);
const addForm = ref(false);
const add = ref(null);
const months = [
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

const openForm = (month, agency) => {
  addForm.value = true;
  selectedMonth.value = month;
  selectedAgency.value = agency;
};

const prevYear = () => {
  currentYear.value -= 1;
};

const nextYear = () => {
  currentYear.value += 1;
};

const getItemForMonth = (monthId, agency) => {
  const result = {};
  const empleadosSinMeta = [];

  // Iterar sobre cada empleado en la agencia
  agency.forEach((employee) => {
    // Flag para verificar si el empleado tiene objetivos en el mes
    let hasTargets = false;

    // Iterar sobre los objetivos del empleado
    employee.targets.forEach((target) => {
      // Verificar si el mes del objetivo coincide con el mesId proporcionado
      if (target.month === monthId) {
        hasTargets = true;
        const typeName = target.type.name; // Obtener el nombre del tipo

        // Verificar si el nombre del tipo ya está en el resultado, si no lo está, inicializarlo
        if (!result[typeName]) {
          result[typeName] = { totalValue: 0, totalQuantity: 0 };
        }
        // Sumar los valores de `value` y `quantity` para el nombre del tipo correspondiente
        result[typeName].totalValue += parseFloat(target.value);
        result[typeName].totalQuantity += target.quantity;
      }
    });

    // Si el empleado no tiene objetivos en el mes especificado, agregar su nombre completo
    if (!hasTargets) {
      empleadosSinMeta.push(employee.fullName);
    }
  });

  // Incluir los nombres completos de los empleados sin objetivos en el resultado
  result.empleadosSinMeta = empleadosSinMeta;

  // Devolver el resultado final
  return result;
};

const getTargets = async (anio) => {
  let res = await sendRequest("GET", null, `/api/intranet/targets/${anio}`, "");
  items.value = res;
};

const postTargets = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    targets: add.value.formularios,
  };
  let res = await sendRequest("POST", final, "/api/intranet/target", "");
  addForm.value = false;
  getTargets(currentYear.value);
};

onMounted(() => {
  getTargets(currentYear.value);
});

watch(currentYear, (newYear) => {
  getTargets(newYear);
});
</script>

<style scoped>
.year-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
}

.year-display {
  font-size: 24px;
  margin: 0 16px;
}

.month-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas */
  grid-auto-rows: minmax(
    145px,
    auto
  ); /* Ajusta la altura mínima de las filas */
  gap: 15px;
}

.card-month {
  box-sizing: border-box;
  font-size: 0.9em; /* Tamaño de fuente ajustado */
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Asegura que los elementos se distribuyan bien */
  padding: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Suaviza la transición de escala y sombra */
}

.card-month-blue {
  background-color: #e3f2fd; /* Azul claro */
}

.card-month-red {
  background-color: #ffcdd2; /* Rojo claro */
}

.card-month:hover {
  transform: scale(1.03); /* Aumenta el tamaño de la tarjeta al 105% */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Agrega una sombra para mayor profundidad */
}
</style>
