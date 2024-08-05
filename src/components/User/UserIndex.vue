<template>
  <q-item>
    <q-btn
      dense
      label="Agregar usuario"
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
        title="Usuarios"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td>
            <q-item dense>
              <q-btn
                dense
                color="primary"
                flat
                icon="edit_square"
                @click="openEdit(props.row)"
              />
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-roles="props">
          <q-td>
            <q-item dense>
              <q-item-section>
                <q-item-label
                  v-for="(role, index) in props.row.roles"
                  :key="index"
                >
                  <q-badge color="blue">{{ role.name }}</q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-permissions="props">
          <q-td>
            <q-item dense>
              <q-item-section>
                <q-item-label
                  v-for="(permission, index) in props.row.permissions"
                  :key="index"
                >
                  <q-badge color="purple">{{ permission.name }}</q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
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
          <user-form ref="add" />
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
          <user-form ref="edit" :user="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import UserForm from "src/components/User/UserForm.vue";

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
  },
  {
    name: "name",
    align: "left",
    field: "name",
    label: "Nombre",
  },
  {
    name: "email",
    align: "left",
    field: "email",
    label: "Email",
  },
  {
    name: "roles",
    align: "left",
    field: "roles",
    label: "Roles",
  },
  {
    name: "permissions",
    align: "left",
    field: "permissions",
    label: "Permisos",
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const getRows = async () => {
  let res = await sendRequest("GET", null, "/api/user", "");
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...add.value.formUser,
  };
  let res = await sendRequest("POST", final, "/api/user", "");
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
    ...edit.value.formUser,
  };
  let res = await sendRequest("PUT", final, "/api/user/" + final.id, "");
  showEdit.value = false;
  getRows();
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/user/" + selectedItem.value.id,
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
