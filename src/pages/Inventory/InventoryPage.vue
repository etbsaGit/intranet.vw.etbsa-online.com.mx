<template>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Inventario"
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
                label="Agregar vehiculo al inventario"
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
        <template v-slot:body-cell-vehicle="props">
          <q-td :props="props">
            {{ props.row.vehicle.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            {{ props.row.status.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            {{ props.row.type?.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-agency="props">
          <q-td :props="props">
            {{ props.row.agency.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-vehicle_body="props">
          <q-td :props="props">
            <q-item>
              <q-item-section>
                <q-item-label>
                  {{ props.row.vehicle_body?.configuration }}
                </q-item-label>
                <q-item-label caption>
                  {{ props.row.vehicle_body?.type.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-invoice_date="props">
          <q-td v-if="props.row.days_in_inventory" :props="props">
            {{ props.row.days_in_inventory }} dias
          </q-td>
          <q-td v-else :props="props">No disponible</q-td>
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
    <q-card>
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
          <inventory-form ref="add" />
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
            label="Buscar por # de serie, # economico, # inventario o factura"
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.vehicle_id"
            :options="vehicles"
            label="Modelo"
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
            v-model="filterForm.type_id"
            :options="types"
            label="Tipo"
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
          <q-item-label class="text-h6">{{
            selectedItem.serial_number
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup @click="getRows" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <inventory-all-form ref="edit" :inventory="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import InventoryForm from "src/components/Inventory/InventoryForm.vue";
import InventoryAllForm from "src/components/Inventory/InventoryAllForm.vue";

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
  status_id: null,
  type_id: null,
  agency_id: null,
  vehicle_id: null,
});

const statuses = ref([]);
const types = ref([]);
const agencies = ref([]);
const vehicles = ref([]);

const columns = [
  {
    name: "editar",
    field: "editar",
    align: "left",
    label: "detalle",
  },
  {
    name: "priority",
    label: "Prioridad",
    align: "left",
    field: "priority",
    sortable: true,
  },
  {
    name: "vehicle",
    label: "Modelo",
    align: "left",
    field: "vehicle",
    sortable: true,
  },
  {
    name: "serial_number",
    label: "Numero de serie",
    align: "left",
    field: "serial_number",
    sortable: true,
  },
  {
    name: "m_y",
    label: "m_y",
    align: "left",
    field: "m_y",
    sortable: true,
  },
  // {
  //   name: "economical_number",
  //   label: "Numero economico",
  //   align: "left",
  //   field: "economical_number",
  //   sortable: true,
  // },
  // {
  //   name: "inventory_number",
  //   label: "Numero de inventario",
  //   align: "left",
  //   field: "inventory_number",
  //   sortable: true,
  // },
  // {
  //   name: "invoice",
  //   label: "Factura",
  //   align: "left",
  //   field: "invoice",
  //   sortable: true,
  // },
  {
    name: "invoice_date",
    label: "Antigüedad",
    align: "left",
    field: "invoice_date",
    sortable: true,
  },
  {
    name: "year",
    label: "Año",
    align: "left",
    field: "year",
    sortable: true,
  },
  {
    name: "status",
    label: "Estatus",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "type",
    label: "Tipo",
    align: "left",
    field: "type",
    sortable: true,
  },
  {
    name: "agency",
    label: "Agencia",
    align: "left",
    field: "agency",
    sortable: true,
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const clearFilters = () => {
  filterForm.value.search = null;
  filterForm.value.status_id = null;
  filterForm.value.type_id = null;
  filterForm.value.agency_id = null;
  filterForm.value.vehicle_id = null;
  filterForm.value.vehicle_body_id = null;
  current_page.value = 1;
  getRows();
};

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/inventories/options",
    ""
  );
  statuses.value = res.statuses;
  types.value = res.types;
  agencies.value = res.agencies;
  vehicles.value = res.vehicles;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/intranet/inventories", "");
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
    ...add.value.formInventory,
  };
  let res = await sendRequest("POST", final, "/api/intranet/inventory", "");
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
