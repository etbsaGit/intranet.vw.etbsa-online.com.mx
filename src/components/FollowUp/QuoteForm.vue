<template>
  <q-form ref="myForm" greedy>
    <q-tabs
      v-model="tab"
      dense
      class="text-accent"
      active-color="secondary"
      indicator-color="secondary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="General" label="General" />
      <q-tab name="Imagenes" label="Imagenes" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="General">
        <q-item>
          <q-item-section>
            <q-select
              v-model="formQuote.inventory_id"
              :options="inventories"
              label="Camion a cotizar"
              option-value="id"
              options-dense
              option-label="model"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              clearable
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formQuote.amount"
              outlined
              dense
              label="Precio"
              lazy-rules
              hint
              readonly
              prefix="$"
              filled
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formQuote.bono"
              outlined
              dense
              label="Bono"
              lazy-rules
              hint
              readonly
              prefix="$"
              filled
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formQuote.percentage"
              outlined
              dense
              label="Porcentaje de aplicación"
              lazy-rules
              hint
              prefix="%"
              mask="###"
              :rules="[
                (val) =>
                  (val >= 0 && val <= 100) ||
                  'El porcentaje debe ser entre 0 y 100',
              ]"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formQuote.expiration_date"
              dense
              outlined
              label="Fecha expiracion"
              mask="date"
              hint
              :rules="[(val) => val !== null || 'Obligatorio']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formQuote.expiration_date" minimal>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formQuote.lead_time"
              outlined
              dense
              mask="##"
              label="Semanas aproximadas de llegada"
              lazy-rules
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="formQuote.status_id"
              :options="statuses"
              label="Estatus"
              option-value="id"
              options-dense
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              clearable
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formQuote.type_id"
              :options="types"
              label="Condicion de pago"
              option-value="id"
              options-dense
              option-label="name"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              outlined
              dense
              clearable
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formQuote.comments"
              outlined
              dense
              label="Comentarios"
              lazy-rules
              hint
            />
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
        <q-item>
          <q-item-section>
            <q-item-label caption align="center">-Equipo aliado-</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="(adicional, index) in formQuote.additionals"
          :key="index"
        >
          <q-item-section>
            <q-input
              v-model="adicional.name"
              outlined
              dense
              label="Nombre"
              lazy-rules
              :rules="[(val) => val !== null || 'Obligatorio']"
            >
              <template v-slot:before>
                <q-btn
                  @click="deleteAdditionals(index)"
                  icon="delete"
                  color="red"
                  filled
                  dense
                />
              </template>
            </q-input>
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="adicional.description"
              outlined
              dense
              label="Descripcion"
              lazy-rules
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="adicional.cost"
              outlined
              dense
              label="Costo"
              lazy-rules
              hint
              prefix="$"
              filled
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="adicional.price"
              outlined
              dense
              label="Precio"
              lazy-rules
              hint
              prefix="$"
              filled
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-btn
              color="primary"
              icon="add"
              label="Agregar adicional"
              @click="addAdditionals"
            />
          </q-item-section>
        </q-item>
      </q-tab-panel>

      <q-tab-panel name="Imagenes">
        <q-item>
          <q-item-section>
            <q-file
              dense
              outlined
              clearable
              lazy-rules
              color="secondary"
              v-model="formQuote.file"
              label="Imagenes del equipo"
              hint="Una imagen a la vez"
              @input="convertirFile($event)"
              @clear="formQuote.images = []"
              accept=".jpg, .jpeg, .png, .jfif"
            />
          </q-item-section>
        </q-item>
        <q-item v-if="formQuote.images && formQuote.images.length > 0">
          <q-item-section v-for="image in formQuote.images" :key="image.id">
            <q-img :src="image" />
          </q-item-section>
        </q-item>
      </q-tab-panel>
    </q-tab-panels>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";

const { quote, followUp } = defineProps(["quote", "followUp"]);

const inventories = ref([]);
const statuses = ref([]);
const types = ref([]);

const myForm = ref(null);
const tab = ref("General");

const images = [];

const formQuote = ref({
  id: quote ? quote.id : null,
  expiration_date: quote ? quote.expiration_date : null,
  lead_time: quote ? quote.lead_time : null,
  comments: quote ? quote.comments : null,
  amount: quote ? quote.amount : null,
  bono: quote ? quote.bono : null,
  percentage: quote ? quote.percentage : null,
  follow_up_id: quote ? quote.follow_up_id : followUp.id,
  inventory_id: quote ? quote.inventory_id : null,
  employee_id: quote ? quote.employee_id : followUp.employee.id,
  customer_id: quote ? quote.customer_id : followUp.customer.id,
  status_id: quote ? quote.status_id : null,
  type_id: quote ? quote.type_id : null,
  additionals: quote ? quote.additionals : [],
  images: [],
  file: [],
});

// Obtener opciones de inventario
const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/quotes/options", "");
  inventories.value = res.inventories;
  statuses.value = res.statuses;
  types.value = res.types;
};

// Observador para el cambio de inventory_id
watch(
  () => formQuote.value.inventory_id,
  (newInventoryId) => {
    const selectedInventory = inventories.value.find(
      (inventory) => inventory.id === newInventoryId
    );
    if (selectedInventory) {
      formQuote.value.bono = selectedInventory.bono; // Actualiza el bono
      calculateAmount(selectedInventory.lineaPrice); // Calcula el amount con lineaPrice
    } else {
      formQuote.value.bono = null; // Resetea el bono si no hay inventario seleccionado
      formQuote.value.amount = null; // Resetea el amount si no hay inventario
    }
  }
);

// Observador para el cambio de bono
watch(
  () => formQuote.value.bono,
  () => {
    const selectedInventory = inventories.value.find(
      (inventory) => inventory.id === formQuote.value.inventory_id
    );
    if (selectedInventory) {
      calculateAmount(selectedInventory.lineaPrice); // Recalcula el amount al cambiar bono
    }
  }
);

// Observador para el cambio de porcentaje
watch(
  () => formQuote.value.percentage,
  () => {
    const selectedInventory = inventories.value.find(
      (inventory) => inventory.id === formQuote.value.inventory_id
    );
    if (selectedInventory) {
      calculateAmount(selectedInventory.lineaPrice); // Recalcula el amount al cambiar porcentaje
    }
  }
);

watch(
  () => formQuote.value.additionals.map((adicional) => adicional.price), // Observa los precios
  () => {
    const selectedInventory = inventories.value.find(
      (inventory) => inventory.id === formQuote.value.inventory_id
    );
    if (selectedInventory) {
      calculateAmount(selectedInventory.lineaPrice); // Recalcula el amount al cambiar porcentaje
    }
  },
  { deep: true } // Permite la observación profunda
);

// Función para calcular el amount final
const calculateAmount = (lineaPrice) => {
  if (lineaPrice) {
    // Asigna el valor del precio de línea con dos decimales
    formQuote.value.amount = parseFloat(lineaPrice).toFixed(2);

    // Verifica si existen adicionales y calcula el total
    const totalAdditionalPrice = formQuote.value.additionals
      ? formQuote.value.additionals.reduce((total, adicional) => {
          return total + (parseFloat(adicional.price) || 0);
        }, 0)
      : 0;

    // Suma el total de precios adicionales al precio de línea
    formQuote.value.amount = (
      parseFloat(formQuote.value.amount) + totalAdditionalPrice
    ).toFixed(2);

    if (formQuote.value.bono) {
      if (formQuote.value.percentage > 0) {
        const bonoDiscount =
          (formQuote.value.bono * formQuote.value.percentage) / 100; // Calcula el porcentaje del bono
        formQuote.value.amount = (
          parseFloat(formQuote.value.amount) - bonoDiscount
        ).toFixed(2); // Aplica el descuento del bono
      }
    }
  }
};

const addAdditionals = () => {
  formQuote.value.additionals.push({
    name: null,
    description: null,
    price: null, // Asegúrate de que esto esté en null inicialmente
    cost: null,
  });
};

const deleteAdditionals = (index) => {
  formQuote.value.additionals.splice(index, 1);
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  if (archivos) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        formQuote.value.images.push(base64Data);
      };
      reader.readAsDataURL(archivo);
    });
  } else {
    formQuote.value.images = [];
  }
};

const delImage = async (image) => {
  const index = images.indexOf(image);

  if (index !== -1) {
    images.splice(index, 1);
  }
};

// Validación del formulario
const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formQuote,
  validate,
});
</script>
