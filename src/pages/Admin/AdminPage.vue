<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="users" label="Usuarios" />
    <q-tab name="roles" label="Roles" />
    <q-tab name="permissions" label="Permisos" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="users" class="q-pa-none">
      <user-index />
    </q-tab-panel>
    <q-tab-panel name="roles" class="q-pa-none">
      <role-index />
    </q-tab-panel>
    <q-tab-panel name="permissions" class="q-pa-none">
      <permission-index />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import UserIndex from "src/components/User/UserIndex.vue";
import RoleIndex from "src/components/Role/RoleIndex.vue";
import PermissionIndex from "src/components/Permission/PermissionIndex.vue";

const tab = ref("users");
</script>
