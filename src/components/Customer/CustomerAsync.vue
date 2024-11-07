<template>
  <q-form greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="selectedEmployee"
          :options="employees"
          label="Vendedor"
          option-value="id"
          option-label="fullName"
          option-disable="inactive"
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
  </q-form>
  <q-item class="custom-item" align="center">
    <q-item-section>
      <q-item-label class="custom-label">-Clientes-</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        v-if="selectedEmployee != null"
        outline
        label="Asignar clientes"
        color="blue"
        @click="postCustomers"
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar por nombre, rfc, email o telefono"
        v-model="filterForm.search"
        @update:model-value="onInputChange"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>
  </q-item>
  <q-item dense>
    <q-item-section>
      <q-list bordered separator style="border-radius: 10px">
        <q-item align="center" dense>
          <q-item-section avatar>
            <q-item-label><strong>Detalle</strong></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Nombre</strong></q-item-label>
          </q-item-section>
          <q-item-section class="col-1">
            <q-item-label><strong>Telefono</strong></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Email</strong></q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-item-label><strong>Asignar</strong></q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          dense
          align="center"
          v-for="(customer, index) in customers"
          :key="index"
        >
          <q-item-section avatar>
            <q-btn
              dense
              color="primary"
              flat
              icon="info"
              @click="openCustomer(customer)"
            />
          </q-item-section>
          <q-item-section>
            {{ customer.name }}
          </q-item-section>
          <q-item-section class="col-1">
            {{ formatPhoneNumber(customer.phone) }}
          </q-item-section>
          <q-item-section>
            {{ customer.email }}
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              :disable="selectedEmployee == null"
              v-model="selectedCustomers"
              :val="customer.id"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section class="q-pa-lg flex flex-center">
      <q-pagination
        color="primary"
        v-model="current_page"
        :max="last_page"
        :max-pages="6"
        direction-links
        boundary-links
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
      />
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showCustomer"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Detalle</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <customer-card :customer="selectedCustomer" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format";

import CustomerCard from "src/components/Customer/CustomerCard.vue";

const employees = ref([]);
const customers = ref([]);
const selectedCustomers = ref([]);
const selectedEmployee = ref(null);
const showCustomer = ref(false);
const selectedCustomer = ref(null);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
});

const openCustomer = (item) => {
  selectedCustomer.value = item;
  showCustomer.value = true;
};

const getEmployees = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/customer/employees",
    ""
  );
  employees.value = res.employees;
};

const getCustomers = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/intranet/customers", "");
  customers.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

watch(current_page, (newPage) => {
  getCustomers(newPage);
});

watch(selectedEmployee, (newEmployee) => {
  if (newEmployee && newEmployee.customers) {
    // Extraemos los ids de los clientes del nuevo empleado seleccionado
    selectedCustomers.value = newEmployee.customers.map(
      (customer) => customer.id
    );
  } else {
    // Si no hay clientes, vaciamos el array
    selectedCustomers.value = [];
  }
});

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getCustomers();
  }, 2000);
};

const postCustomers = async () => {
  const final = {
    employee_id: selectedEmployee.value?.id,
    customersAsync: selectedCustomers.value,
  };
  let res = await sendRequest(
    "POST",
    final,
    "/api/intranet/customers/employee",
    ""
  );
  selectedEmployee.value = null;
  getEmployees();
};

onMounted(() => {
  getEmployees();
  getCustomers();
});
</script>

<style scoped>
.custom-item {
  border-radius: 8px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
}

.custom-label {
  font-size: 1.2em; /* Tamaño de fuente aumentado */
  font-weight: bold; /* Negrita */
}
</style>
