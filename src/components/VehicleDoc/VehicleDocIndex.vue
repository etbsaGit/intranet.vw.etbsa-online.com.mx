<template>
  <q-item v-if="checkPosition('Gerente')">
    <q-btn
      dense
      label="Agregar archivo"
      color="primary"
      icon="add_circle"
      @click="showAdd = true"
    />
  </q-item>

  <q-item class="grid-container">
    <q-item-section v-for="(doc, index) in rows" :key="index">
      <q-card @click="openEdit(doc)" class="no-shadow">
        <vehicle-doc-card :doc="doc" :key="doc" />
        <q-tooltip class="text-h6 bg-primary">
          Haz click para editar
        </q-tooltip>
      </q-card>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-card-section class="d-flex q-pa-none">
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
      </q-card-section>
      <q-separator />
      <div class="q-pa-none">
        <vehicle-doc-form ref="add" :vehicle="vehicle" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-card-section class="d-flex q-pa-none">
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
          <q-item-section side>
            <q-btn
              :href="selectedItem.realpath"
              target="_blank"
              icon="download"
              no-caps
              color="teal"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <div class="q-pa-none">
        <vehicle-doc-form ref="edit" :doc="selectedItem" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { checkPosition } from "src/boot/checks";

import VehicleDocForm from "src/components/VehicleDoc/VehicleDocForm.vue";
import VehicleDocCard from "src/components/VehicleDoc/VehicleDocCard.vue";

const { vehicle } = defineProps(["vehicle"]);

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

const openEdit = (item) => {
  if (checkPosition("Gerente")) {
    selectedItem.value = item;
    showEdit.value = true;
  } else {
    window.open(item.realpath, "_blank");
  }
};

const getRows = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/vehicleDoc/vehicle/" + id,
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
    ...add.value.formDoc,
  };
  let res = await sendRequest("POST", final, "/api/intranet/vehicleDoc", "");
  showAdd.value = false;
  getRows(vehicle.id);
  console.log(final);
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formDoc,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/vehicleDoc/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(vehicle.id);
};

const destroyItem = async () => {
  const id = selectedItem.value.id;
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/vehicleDoc/" + id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows(vehicle.id);
};

onMounted(() => {
  getRows(vehicle.id);
});
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(400px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 10px;
  max-width: auto;
}
</style>
