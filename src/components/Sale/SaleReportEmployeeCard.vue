<template>
  <q-card class="card-tec">
    <q-card-section align="center">
      <q-item>
        <q-item-section class="col-1">
          <q-item-label>
            <q-avatar
              size="6em"
              color="white"
              text-color="primary"
              v-if="employee.pic"
            >
              <img :src="employee.pic" alt="Foto del empleado" />
            </q-avatar>
            <q-avatar size="6em" v-else color="primary" text-color="white">
              {{ employee.first_name.charAt(0).toUpperCase()
              }}{{ employee.paternal_surname.charAt(0).toUpperCase() }}
            </q-avatar>
          </q-item-label>
          <q-item-label caption>
            {{ employee.shortName }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong> Meta de ventas por monto: </strong>
            ${{ employee.sales_summary.sales.total_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            ${{ employee.sales_summary.sales.total_sales }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            ${{ employee.sales_summary.sales.difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="
                convertToNumber(
                  employee.sales_summary.sales.percentage_difference
                )
              "
              :color="
                convertToNumber(
                  employee.sales_summary.sales.percentage_difference
                ) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="
                    employee.sales_summary.sales.percentage_difference + '%'
                  "
                />
              </div>
            </q-linear-progress>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong> Meta de ventas por unidad: </strong>
            {{ employee.sales_summary.sales.total_quantity_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            {{ employee.sales_summary.sales.total_quantity_sold }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            {{ employee.sales_summary.sales.quantity_difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="
                convertToNumber(
                  employee.sales_summary.sales.quantity_percentage_difference
                )
              "
              :color="
                convertToNumber(
                  employee.sales_summary.sales.quantity_percentage_difference
                ) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="
                    employee.sales_summary.sales
                      .quantity_percentage_difference + '%'
                  "
                />
              </div>
            </q-linear-progress>
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <strong>Meta de cotizacion por monto:</strong>
            ${{ employee.sales_summary.quotes.total_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            ${{ employee.sales_summary.quotes.total_quotes }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            ${{ employee.sales_summary.quotes.difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="
                convertToNumber(
                  employee.sales_summary.quotes.percentage_difference
                )
              "
              :color="
                convertToNumber(
                  employee.sales_summary.quotes.percentage_difference
                ) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="
                    employee.sales_summary.quotes.percentage_difference + '%'
                  "
                />
              </div>
            </q-linear-progress>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong> Meta de cotizaciones por unidad: </strong>
            {{ employee.sales_summary.quotes.total_quantity_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            {{ employee.sales_summary.quotes.total_quantity_quotes }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            {{ employee.sales_summary.quotes.quantity_difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="
                convertToNumber(
                  employee.sales_summary.quotes.quantity_percentage_difference
                )
              "
              :color="
                convertToNumber(
                  employee.sales_summary.quotes.quantity_percentage_difference
                ) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="
                    employee.sales_summary.quotes
                      .quantity_percentage_difference + '%'
                  "
                />
              </div>
            </q-linear-progress>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup>
const { employee } = defineProps(["employee"]);

const convertToNumber = (value) => {
  const numberValue = parseFloat(value) || 0; // Convierte a número
  return numberValue / 100; // Divide entre 100 para el rango 0-1
};
</script>

<!-- <style scoped>
.card-tec {
  background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}

.card-tec:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.q-item-section {
  border-bottom: 1px solid #e5e7eb;
  padding: 15px;
}

.q-item-section:last-child {
  border-bottom: none;
}

.q-item-label {
  font-weight: 600; /* Texto más grueso para mayor énfasis */
  color: #333; /* Color de texto más oscuro para mejor legibilidad */
  margin-bottom: 5px; /* Espacio entre las líneas de texto */
}

.q-badge {
  font-weight: bold;
}

.q-linear-progress {
  border-radius: 5px;
}

.q-linear-progress .q-badge {
  font-size: 0.9em;
}

.q-avatar {
  transition: transform 0.3s;
}

.q-avatar:hover {
  transform: scale(1.1);
}
</style> -->
