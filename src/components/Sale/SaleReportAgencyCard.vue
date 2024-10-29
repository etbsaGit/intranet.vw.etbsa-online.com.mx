<template>
  <q-card>
    <q-card-section align="center">
      <div class="text-h6">Resultados Sucursal</div>
    </q-card-section>
    <q-separator />
    <q-card-section align="center">
      <q-item>
        <q-item-section>
          <q-item-label>
            <strong> Meta de ventas por monto: </strong>
            ${{ data.sales.total_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            ${{ data.sales.total_sales }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            ${{ data.sales.difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="convertToNumber(data.sales.percentage_difference)"
              :color="
                convertToNumber(data.sales.percentage_difference) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="data.sales.percentage_difference + '%'"
                />
              </div>
            </q-linear-progress>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong> Meta de ventas por unidad: </strong>
            {{ data.sales.total_quantity_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            {{ data.sales.total_quantity_sold }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            {{ data.sales.quantity_difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="
                convertToNumber(data.sales.quantity_percentage_difference)
              "
              :color="
                convertToNumber(data.sales.quantity_percentage_difference) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="data.sales.quantity_percentage_difference + '%'"
                />
              </div>
            </q-linear-progress>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong>Meta de cotizacion por monto:</strong>
            ${{ data.quotes.total_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            ${{ data.quotes.total_quotes }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            ${{ data.quotes.difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="convertToNumber(data.quotes.percentage_difference)"
              :color="
                convertToNumber(data.quotes.percentage_difference) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="data.quotes.percentage_difference + '%'"
                />
              </div>
            </q-linear-progress>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong> Meta de cotizaciones por unidad: </strong>
            {{ data.quotes.total_quantity_targets }}
          </q-item-label>
          <q-item-label>
            <strong> Logrado: </strong>
            {{ data.quotes.total_quantity_quotes }}
          </q-item-label>
          <q-item-label>
            <strong> Diferencia: </strong>
            {{ data.quotes.quantity_difference }}
          </q-item-label>
          <q-item-label>
            <q-linear-progress
              rounded
              size="25px"
              :value="
                convertToNumber(data.quotes.quantity_percentage_difference)
              "
              :color="
                convertToNumber(data.quotes.quantity_percentage_difference) >= 1
                  ? 'green-10'
                  : 'red-10'
              "
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  text-color="white"
                  color="primary"
                  :label="data.quotes.quantity_percentage_difference + '%'"
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
const { data } = defineProps(["data"]);

const convertToNumber = (value) => {
  const numberValue = parseFloat(value) || 0; // Convierte a número
  return numberValue / 100; // Divide entre 100 para el rango 0-1
};
</script>
