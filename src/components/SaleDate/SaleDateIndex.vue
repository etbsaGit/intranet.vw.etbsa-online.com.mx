<template>
  <q-item>
    <q-btn
      dense
      label="Agregar fecha"
      color="primary"
      icon="add_circle"
      @click="showAdd = true"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-list separator>
        <q-item align="center">
          <q-item-section avatar>
            <q-item-label><strong>Editar</strong></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Fecha</strong></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Concepto de fecha</strong></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label><strong>Comentarios</strong></q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-for="(date, index) in rows" :key="index" align="center">
          <q-item-section avatar>
            <q-btn
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(date)"
            />
          </q-item-section>
          <q-item-section>
            {{ date.date }}
          </q-item-section>
          <q-item-section>
            {{ date.type.name }}
          </q-item-section>
          <q-item-section>
            {{ date.comments }}
          </q-item-section>
        </q-item>
      </q-list>
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
          <sale-date-form ref="add" :sale="sale" />
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
          <sale-date-form ref="edit" :date="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { formatDate } from "src/boot/format";

import SaleDateForm from "./SaleDateForm.vue";

const { sale } = defineProps(["sale"]);

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const getRows = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/saleDate/sale/" + id,
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
    ...add.value.formDate,
  };
  let res = await sendRequest("POST", final, "/api/intranet/saleDate", "");
  showAdd.value = false;
  getRows(sale.id);
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formDate,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/saleDate/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(sale.id);
};

const destroyItem = async () => {
  const id = selectedItem.value.id;
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/saleDate/" + id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows(sale.id);
};

onMounted(() => {
  getRows(sale.id);
});
</script>
