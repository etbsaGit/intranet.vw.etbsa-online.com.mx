<template>
  <q-form ref="myForm" greedy>
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
      <q-item-section class="col-3">
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
                    <q-btn v-close-popup label="Close" color="primary" flat />
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
        <q-input
          v-model="formQuote.additional"
          outlined
          dense
          label="Adicionales"
          lazy-rules
          hint
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

const formQuote = ref({
  id: quote ? quote.id : null,
  expiration_date: quote ? quote.expiration_date : null,
  lead_time: quote ? quote.lead_time : null,
  comments: quote ? quote.comments : null,
  additional: quote ? quote.additional : null,
  amount: quote ? quote.amount : null,
  follow_up_id: quote ? quote.follow_up_id : followUp.id,
  inventory_id: quote ? quote.inventory_id : null,
  employee_id: quote ? quote.employee_id : followUp.employee.id,
  customer_id: quote ? quote.customer_id : followUp.customer.id,
  status_id: quote ? quote.status_id : null,
  type_id: quote ? quote.type_id : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/quotes/options", "");
  inventories.value = res.inventories;
  statuses.value = res.statuses;
  types.value = res.types;
};

watch(
  () => formQuote.value.inventory_id,
  (newInventoryId) => {
    const selectedInventory = inventories.value.find(
      (inventory) => inventory.id === newInventoryId
    );
    formQuote.value.amount = selectedInventory
      ? selectedInventory.lineaPrice
      : null; // Ajusta según cómo esté estructurado tu inventario
  }
);

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
