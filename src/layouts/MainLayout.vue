<template>
  <q-layout view="hHh LpR lFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <router-link to="/">
            <q-img
              src="..\assets\logo.svg"
              style="
                max-width: 7%;
                background-color: white;
                border-radius: 50px;
              "
            />
          </router-link>
          VW Camiones y autobuses Bajio
          <router-link to="/">
            <q-img
              src="..\assets\SU.png"
              style="
                max-width: 7%;
                background-color: #061e47;
                border-radius: 50px;
              "
            />
          </router-link>
        </q-toolbar-title>
        <q-space />

        <div v-if="user">
          {{ user.name }}
        </div>

        <q-btn
          label="Logout"
          class="q-ml-md"
          size="sm"
          color="red"
          @click="logout()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      elevated
      :width="250"
      :breakpoint="250"
    >
      <q-item class="avatar-container" v-if="user.employee">
        <q-avatar
          size="150px"
          color="white"
          text-color="white"
          v-if="user.employee.pic && user.employee.picture"
        >
          <img :src="user.employee.pic" alt="Foto de la marca" />
        </q-avatar>
        <q-avatar v-else size="150px" color="primary" text-color="white">
          {{ user.employee.first_name.charAt(0).toUpperCase()
          }}{{ user.employee.paternal_surname.charAt(0).toUpperCase() }}
        </q-avatar>
      </q-item>
      <q-item class="avatar-container" v-else>
        <q-avatar
          size="150px"
          color="primary"
          text-color="white"
          icon="fas fa-user-shield"
        />
      </q-item>
      <q-expansion-item
        expand-separator
        icon="perm_identity"
        :label="user.name"
        caption="Opciones de usuario"
        class="text-primary"
      >
        <q-card>
          <q-card-section>
            <q-item-label caption>
              <strong>user:</strong>
              {{ user.name }}
            </q-item-label>
            <q-item-label caption>
              <strong>email:</strong>
              {{ user.email }}
            </q-item-label>
            <q-item-section>
              <q-btn
                label="Cambiar password"
                size="xs"
                color="secondary"
                @click="openPassword"
              />
            </q-item-section>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <menu-list />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-dialog
    v-model="showChangePassword"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-h6">
            Cambiar contraseña de {{ user.name }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="negative" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="positive" @click="changePassword" />
        </q-item-section>
      </q-item>
      <password-form ref="password" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

import PasswordForm from "src/components/User/PasswordForm.vue";
import MenuList from "./MenuList.vue";

const auth = useAuthStore();
const { logout } = auth;
const { user } = storeToRefs(auth);

const leftDrawerOpen = ref(false);

const showChangePassword = ref(false);
const authUser = ref(null);
const password = ref(null);

const openPassword = () => {
  authUser.value = user;
  showChangePassword.value = true;
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const changePassword = async () => {
  const password_valid = await password.value.validate();
  if (!password_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...password.value.formUser,
  };
  let res = await sendRequest("POST", final, "/api/auth/change", "");
  showChangePassword.value == false;
  logout();
};
</script>

<style>
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
