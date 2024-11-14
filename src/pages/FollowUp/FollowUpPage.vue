<template>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Seguimientos"
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
                label="Agregar seguimiento"
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
        <template v-slot:body-cell-editar="props">
          <q-td>
            <q-btn
              dense
              color="primary"
              flat
              icon="loupe"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-customer="props">
          <q-td>
            {{ props.row.customer.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-employee="props">
          <q-td>
            {{ props.row.employee.shortName }}
          </q-td>
        </template>
        <template v-slot:body-cell-vehicle="props">
          <q-td>
            {{ props.row.lastVehicle?.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td>
            {{ props.row.status.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-origin="props">
          <q-td>
            {{ props.row.origin.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-percentage="props">
          <q-td>
            <q-linear-progress
              size="25px"
              :value="getNumber(props.row.lastPercentage.name).number"
              :color="getNumber(props.row.lastPercentage.name).color"
              style="border-radius: 10px"
            >
              <q-tooltip class="bg-primary text-h6">
                {{ props.row.lastPercentage.name }}
              </q-tooltip>
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="accent"
                  :label="getNumber(props.row.lastPercentage.name).label"
                />
              </div>
            </q-linear-progress>
          </q-td>
        </template>
        <template v-slot:body-cell-date="props">
          <q-td>
            <q-chip
              text-color="white"
              :color="getColor(props.row.daysRemaining).color"
            >
              {{ getColor(props.row.daysRemaining).label }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Crear seguimiento</q-item-label>
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
          <follow-up-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showFilters" position="top" full-width>
    <q-card>
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
            label="Buscar por titulo"
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
            :options="filterCustomers"
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
            options-dense
            use-input
            @filter="filterFn"
            input-debounce="0"
            behavior="menu"
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
            v-model="filterForm.employee_id"
            :options="employees"
            label="Empleado"
            option-value="id"
            options-dense
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
            v-model="filterForm.status_id"
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
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.vehicle_id"
            :options="vehicles"
            label="Vehiculos"
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
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.origin_id"
            :options="origins"
            label="Origen"
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
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">{{ selectedItem.title }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Cerrar"
            color="red"
            v-close-popup
            @click="getRows(current_page)"
          />
        </q-item-section>
      </q-item>
      <q-separator />

      <follow-up-all-form ref="edit" :followUp="selectedItem" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { getNumber } from "src/boot/followUp";
import { formatDate } from "src/boot/format";

import FollowUpForm from "src/components/FollowUp/FollowUpForm.vue";
import FollowUpAllForm from "src/components/FollowUp/FollowUpAllForm.vue";

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showFilters = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  customer_id: null,
  employee_id: null,
  vehicle_id: null,
  status_id: null,
  origin_id: null,
});

const customers = ref([]);
const employees = ref([]);
const vehicles = ref([]);
const statuses = ref([]);
const origins = ref([]);
const percentages = ref([]);

const columns = [
  {
    name: "editar",
    field: "editar",
    align: "left",
    label: "detalle",
  },
  {
    name: "title",
    label: "Modelos o nombre del protecto",
    align: "left",
    field: "title",
    sortable: true,
  },
  {
    name: "date",
    label: "Proximo contacto en:",
    align: "left",
    field: "date",
    sortable: true,
  },
  {
    name: "customer",
    label: "Cliente",
    align: "left",
    field: "customer",
    sortable: true,
  },
  {
    name: "employee",
    label: "Empleado",
    align: "left",
    field: "employee",
    sortable: true,
  },
  {
    name: "vehicle",
    label: "Vehiculo",
    align: "left",
    field: "vehicle",
    sortable: true,
  },
  {
    name: "status",
    label: "Estatus",
    align: "left",
    field: "status",
    sortable: true,
  },
  // {
  //   name: "origin",
  //   label: "Origen",
  //   align: "left",
  //   field: "origin",
  //   sortable: true,
  // },
  {
    name: "percentage",
    label: "Porcentaje de certeza",
    align: "left",
    field: "percentage",
    sortable: true,
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const clearFilters = () => {
  filterForm.value.search = null;
  filterForm.value.customer_id = null;
  filterForm.value.employee_id = null;
  filterForm.value.inventory_id = null;
  filterForm.value.status_id = null;
  filterForm.value.origin_id = null;
  current_page.value = 1;
  getRows();
};

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/followUp/options",
    ""
  );
  customers.value = res.customers;
  employees.value = res.employees;
  vehicles.value = res.vehicles;
  statuses.value = res.statuses;
  origins.value = res.origins;
  percentages.value = res.percentages;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/intranet/followUps", "");
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
    ...add.value.formFollowUp,
  };

  let res = await sendRequest("POST", final, "/api/intranet/followUp", "");
  showAdd.value = false;
  selectedItem.value = res;
  showEdit.value = true;
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

let timeout = null;

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

const filterCustomers = ref(null);

function filterFn(val, update) {
  if (val == "") {
    update(() => {
      filterCustomers.value = customers.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterCustomers.value = customers.value.filter(
      (customer) => customer.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

function getColor(daysRemaining) {
  let label;
  let color;

  if (daysRemaining < 0) {
    label = daysRemaining + " días";
    color = "red-10";
  } else if (daysRemaining === 0) {
    label = "Hoy";
    color = "orange-10";
  } else if (daysRemaining > 0) {
    label = daysRemaining + " días";
    color = "green-10";
  } else {
    // Aunque no debería llegar aquí con las condiciones anteriores, se incluye para cubrir todos los casos posibles.
    label = "Finalizado";
    color = "grey-7";
  }

  return { label, color };
}
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
