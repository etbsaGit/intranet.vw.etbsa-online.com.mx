<template>
  <q-item>
    <q-btn
      dense
      label="Agregar agencia"
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
        title="Agencias"
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
        <template v-slot:body-cell-municipality="props">
          <q-td>
            {{ props.row.municipality.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-state="props">
          <q-td>
            {{ props.row.state.name }}
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
          <agency-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
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
          <agency-form ref="edit" :agency="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import AgencyForm from "src/components/Catalogos/AgencyForm.vue";

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
    name: "name",
    align: "left",
    field: "name",
    label: "Nombre",
  },
  {
    name: "address",
    align: "left",
    field: "address",
    label: "Calle y numero",
  },
  {
    name: "district",
    align: "left",
    field: "district",
    label: "Colonia",
  },
  {
    name: "municipality",
    align: "left",
    field: "municipality",
    label: "Municipio",
  },
  {
    name: "state",
    align: "left",
    field: "state",
    label: "Estado",
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const getRows = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/agency", "");
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...add.value.formAgency,
  };
  let res = await sendRequest("POST", final, "/api/intranet/agency", "");
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
    ...edit.value.formAgency,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/agency/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows();
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/agency/" + selectedItem.value.id,
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
