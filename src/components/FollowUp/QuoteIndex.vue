<template>
  <q-item>
    <q-btn
      dense
      label="Generar cotizacion"
      color="primary"
      @click="showAdd = true"
      icon="add_circle"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td>
            <q-btn
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td>
            {{ props.row.status.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-inventory="props">
          <q-td>
            {{ props.row.inventory.vehicle.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td>
            {{ props.row.type.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td>
            {{ formatCurrency(props.row.amount) }}
          </q-td>
        </template>
        <template v-slot:body-cell-file="props">
          <q-td>
            <q-icon
              v-if="props.row.realpath"
              name="fas fa-eye"
              @click="openPDF(props.row.realpath)"
            />
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
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
      <q-item class="q-pa-none">
        <q-item-section>
          <quote-form ref="add" :followUp="followUp" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putItem" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="destroyItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <quote-form ref="edit" :quote="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { formatCurrency } from "src/boot/format";

import QuoteForm from "src/components/FollowUp/QuoteForm.vue";

const { followUp } = defineProps(["followUp"]);

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
    label: "Editar",
  },
  {
    name: "amount",
    align: "left",
    field: "amount",
    label: "Monto",
  },
  {
    name: "inventory",
    align: "left",
    field: "inventory",
    label: "Inventario",
  },
  {
    name: "expiration_date",
    align: "left",
    field: "expiration_date",
    label: "Vencimiento",
  },
  {
    name: "status",
    align: "left",
    field: "status",
    label: "Estatus",
  },
  {
    name: "type",
    align: "left",
    field: "type",
    label: "Condicion de pago",
  },
  {
    name: "file",
    align: "left",
    field: "file",
    label: "Ver",
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const openPDF = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};

const getRows = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/quotes/followUp/" + followUp.id,
    ""
  );
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...add.value.formQuote,
  };
  let res = await sendRequest("POST", final, "/api/intranet/quote", "");
  window.open(res.realpath, "_blank");
  showAdd.value = false;
  getRows();
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formQuote,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/quote/" + final.id,
    ""
  );
  window.open(res.realpath, "_blank");
  showEdit.value = false;
  getRows();
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/quote/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows();
};

onMounted(() => {
  getRows();
});
</script>
