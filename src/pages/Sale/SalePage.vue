<template>
  <q-item class="custom-item" align="center">
    <q-item-section>
      <q-item-label class="custom-label">-Ventas-</q-item-label>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Ventas"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :dense="$q.screen.lt.md"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top-left>
          <q-item>
            <q-item-section>
              <q-btn
                dense
                outline
                label="Agregar venta"
                color="primary"
                @click="showAdd = true"
                icon="add_circle"
              />
            </q-item-section>
            <q-item-section side>
              <q-btn
                outline
                dense
                color="primary"
                icon="filter_alt"
                label="Filtros"
                @click="showFilters = true"
              />
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:bottom>
          <q-space />
          <td>
            <q-pagination
              color="primary"
              v-model="current_page"
              :max="last_page"
              :max-pages="6"
              direction-links
              boundary-links
              gutter="10px"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </td>
          <q-space />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" @click="toggleExpand(props.row)">
            <q-tooltip class="text-h6 bg-primary">
              Haz click para ver detalle
            </q-tooltip>
            <q-td key="editar" :props="props">
              <q-btn
                dense
                color="primary"
                flat
                icon="loupe"
                @click="openEdit(props.row)"
              />
            </q-td>
            <q-td key="id_sale">
              {{ props.row.id_sale }}
            </q-td>

            <q-td key="agency">
              {{ props.row.agency.name }}
            </q-td>
            <q-td key="vehicle">
              {{ props.row.vehicle.name }}
            </q-td>

            <q-td key="customer">
              {{ props.row.customer.name }}
            </q-td>
            <q-td key="employee">
              {{ props.row.employee.fullName }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.row._expand" :props="props">
            <q-td colspan="100%" class="bg-secondary">
              <q-item class="text-center">
                <q-item-section>
                  <div><strong>Serie del vehiculo:</strong></div>
                  <div>{{ props.row.series_vehicle }}</div>
                </q-item-section>
                <q-item-section>
                  <div><strong>Año del vehiculo:</strong></div>
                  <div>{{ props.row.year_vehicle }}</div>
                </q-item-section>
                <q-item-section>
                  <div><strong>Estatus:</strong></div>
                  <div>{{ props.row.status.name }}</div>
                </q-item-section>
                <q-item-section>
                  <div><strong>Canal de venta:</strong></div>
                  <div>{{ props.row.sales_channel.name }}</div>
                </q-item-section>
                <q-item-section>
                  <div><strong>Tipo de venta:</strong></div>
                  <div>{{ props.row.type.name }}</div>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>

              <q-item class="text-center">
                <q-item-section>
                  <div><strong>Comentarios:</strong></div>
                  <div>{{ props.row.comments }}</div>
                </q-item-section>
              </q-item>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    full-width
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <sale-form ref="add" :customer="currentCustomer" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showFilters" position="top" full-width>
    <q-card style="width: 900px">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Filtros</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" icon="close" dense color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Buscar"
            icon="search"
            dense
            color="blue"
            @click="getRows"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            label="limpiar"
            color="orange"
            @click="clearFilters"
            icon="filter_alt_off"
          />
        </q-item-section>
      </q-item>
      <q-separator />

      <q-item>
        <q-item-section>
          <q-input
            outlined
            dense
            label="Buscar por factura o numero de serie"
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.customer_id"
            :options="customers"
            label="Cliente"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
            :readonly="customer != null"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.employee_id"
            :options="employees"
            label="Quien realizo la venta"
            option-value="id"
            option-label="fullName"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.agency_id"
            :options="agencies"
            label="Agencia"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.vehicle_id"
            :options="vehicles"
            label="Vehiculo"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.status_id"
            :options="statuses"
            label="Estatus"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.sales_channel_id"
            :options="sales_channels"
            label="Canal de venta"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.type_id"
            :options="types"
            label="Tipo de venta"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            {{ selectedItem.id_sale }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup @click="getRows" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <sale-all-form ref="edit" :sale="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import SaleForm from "src/components/Sale/SaleForm.vue";
import SaleAllForm from "src/components/Sale/SaleAllForm.vue";

const { customer } = defineProps(["customer"]);

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showFilters = ref(false);

const currentCustomer = ref(customer ? customer : null);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  agency_id: null,
  status_id: null,
  sales_channel_id: null,
  type_id: null,
  vehicle_id: null,
  customer_id: customer ? customer.id : null,
  employee_id: null,
});

const agencies = ref([]);
const statuses = ref([]);
const sales_channels = ref([]);
const types = ref([]);
const vehicles = ref([]);
const customers = ref([]);
const employees = ref({});

const columns = [
  {
    name: "expand",
    field: "expand",
    align: "left",
  },
  {
    name: "editar",
    field: "editar",
    align: "left",
    label: "detalle",
  },
  {
    name: "id_sale",
    field: "id_sale",
    align: "left",
    label: "# de factura",
  },
  // {
  //   name: "status",
  //   field: "status",
  //   align: "left",
  //   label: "Estatus",
  // },
  // {
  //   name: "sale_channel",
  //   field: "sale_channel",
  //   align: "left",
  //   label: "Canal de venta",
  // },
  // {
  //   name: "type",
  //   field: "type",
  //   align: "left",
  //   label: "Tipo de venta",
  // },
  {
    name: "agency",
    field: "agency",
    align: "left",
    label: "Agencia",
  },
  {
    name: "vehicle",
    field: "vehicle",
    align: "left",
    label: "Vehiculo",
  },
  // {
  //   name: "series_vehicle",
  //   field: "series_vehicle",
  //   align: "left",
  //   label: "Serie vehiculo",
  // },
  // {
  //   name: "year_vehicle",
  //   field: "year_vehicle",
  //   align: "left",
  //   label: "Año del vehiculo",
  // },
  {
    name: "customer",
    field: "customer",
    align: "left",
    label: "Cliente",
  },
  {
    name: "employee",
    field: "employee",
    align: "left",
    label: "Empleado",
  },
  // {
  //   name: "date",
  //   field: "date",
  //   align: "left",
  //   label: "Fecha de creacion",
  // },
];

const toggleExpand = (row) => {
  // Toggle expand state for the clicked row
  row._expand = !row._expand;
};

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const clearFilters = () => {
  filterForm.value.search = null;
  filterForm.value.agency_id = null;
  filterForm.value.status_id = null;
  filterForm.value.sales_channel_id = null;
  filterForm.value.type_id = null;
  filterForm.value.vehicle_id = null;
  filterForm.value.customer_id = null;
  filterForm.value.employee_id = null;
  current_page.value = 1;
  getRows();
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

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/intranet/sales", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...add.value.formSale,
  };
  let res = await sendRequest("POST", final, "/api/intranet/sale", "");
  showAdd.value = false;
  selectedItem.value = res;
  showEdit.value = true;
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 2000);
};

onMounted(() => {
  getRows();
  getOptions();
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
