<template>
  <q-item>
    <q-btn
      dense
      label="Agregar caracteristica"
      color="primary"
      icon="add_circle"
      @click="showAdd = true"
    />
  </q-item>

  <q-item>
    <q-item-section>
      <q-list separator>
        <q-expansion-item
          v-for="(type, index) in rows"
          :key="index"
          :label="type.name"
          expand-separator
          default-opened
          class="shadow-1 overflow-hidden"
          header-class="bg-secondary text-white"
          style="border-radius: 10px; border-color: black"
        >
          <q-item align="center">
            <q-item-section avatar>
              <q-item-label><strong>Editar</strong></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Caracteristica</strong></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Valor</strong></q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="(feature, index) in type.features"
            :key="index"
            align="center"
          >
            <q-item-section avatar>
              <q-btn
                dense
                color="primary"
                flat
                icon="edit_square"
                @click="openEdit(feature)"
              />
            </q-item-section>
            <q-item-section>
              {{ feature.name }}
            </q-item-section>
            <q-item-section>
              {{ feature.vehicles.value }}
            </q-item-section>
          </q-item>
        </q-expansion-item>
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
          <vehicle-feature-form ref="add" :vehicle="vehicle" />
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
          <vehicle-feature-form ref="edit" :feature="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import VehicleFeatureForm from "./VehicleFeatureForm.vue";

const { vehicle } = defineProps(["vehicle"]);

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
    "/api/intranet/vehicleFeature/vehicle/" + id,
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
    ...add.value.formFeatures,
  };
  let res = await sendRequest(
    "POST",
    final,
    "/api/intranet/vehicleFeature",
    ""
  );
  showAdd.value = false;
  getRows(vehicle.id);
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formFeatures,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/vehicleFeature/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(vehicle.id);
};

const destroyItem = async () => {
  const id = selectedItem.value.vehicles.id;
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/vehicleFeature/" + id,
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
