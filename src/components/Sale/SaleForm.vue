<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSale.id_sale"
          filled
          dense
          label="Numero de factura"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formSale.customer_id"
          :options="filterCustomers"
          label="Cliente"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :rules="[(val) => val !== null || 'Obligatorio']"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          @filter="filterFn"
          :readonly="customer != null"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formSale.agency_id"
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
          v-model="formSale.employee_id"
          :options="employees"
          label="Quien realizo la venta"
          option-value="id"
          option-label="fullName"
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
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formSale.inventory_id"
          :options="vehicles"
          label="Vehiculo"
          option-value="id"
          option-label="serial_number"
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
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formSale.status_id"
          :options="statuses"
          label="Estatus"
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
          v-model="formSale.sales_channel_id"
          :options="sales_channels"
          label="Canal de venta"
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
          v-model="formSale.type_id"
          :options="types"
          label="Tipo de venta"
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
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSale.comments"
          filled
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
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const { sale, customer } = defineProps(["sale", "customer"]);

const myForm = ref(null);

const agencies = ref([]);
const statuses = ref([]);
const sales_channels = ref([]);
const types = ref([]);
const vehicles = ref([]);
const employees = ref([]);
const customers = ref([]);
const filterCustomers = ref(customers);

const formSale = ref({
  id: sale ? sale.id : null,
  id_sale: sale ? sale.id_sale : null,
  status_id: sale ? sale.status_id : null,
  sales_channel_id: sale ? sale.sales_channel_id : null,
  type_id: sale ? sale.type_id : null,
  agency_id: sale ? sale.agency_id : null,
  inventory_id: sale ? sale.inventory_id : null,
  customer_id: sale ? sale.customer_id : customer ? customer.id : null,
  employee_id: sale ? sale.employee_id : null,
  comments: sale ? sale.comments : null,
});

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    filterCustomers.value = customers.value.filter(
      (customer) => customer.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/sale/options", "");
  agencies.value = res.agencies;
  statuses.value = res.statuses;
  sales_channels.value = res.sales_channels;
  types.value = res.types;
  vehicles.value = res.vehicles;
  customers.value = res.customers;
  employees.value = res.employees;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formSale,
  validate,
});
</script>
