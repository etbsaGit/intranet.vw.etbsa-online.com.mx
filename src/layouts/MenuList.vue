<template>
  <q-list bordered padding class="rounded-borders text-primary">
    <q-item
      clickable
      v-ripple
      to="/profile"
      :active="link === 'profile'"
      @click="link = 'profile'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="account_circle" />
      </q-item-section>

      <q-item-section>Perfil</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      @click="openNewTab"
      active-class="my-menu-link"
      v-if="checkPosition('Gerente')"
    >
      <q-item-section avatar>
        <q-icon name="shopping_bag" />
      </q-item-section>

      <q-item-section>Historico de ventas</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      to="/sale"
      :active="link === 'sale'"
      @click="link = 'sale'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="request_quote" />
      </q-item-section>

      <q-item-section>Ventas</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      to="/customer"
      :active="link === 'customer'"
      @click="link = 'customer'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="group" />
      </q-item-section>

      <q-item-section>Clientes</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      to="/vehicle"
      :active="link === 'vehicle'"
      @click="link = 'vehicle'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="local_shipping" />
      </q-item-section>

      <q-item-section>Vehiculos</q-item-section>
    </q-item>
    <q-item
      v-if="checkPosition('Gerente')"
      clickable
      v-ripple
      to="/employee"
      :active="link === 'employee'"
      @click="link = 'employee'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="face" />
      </q-item-section>

      <q-item-section>Empleados</q-item-section>
    </q-item>
    <q-item
      v-if="checkPosition('Gerente')"
      clickable
      v-ripple
      to="/target"
      :active="link === 'tarjet'"
      @click="link = 'tarjet'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="flag" />
      </q-item-section>

      <q-item-section>Metas</q-item-section>
    </q-item>
    <q-item
      v-if="checkRole('Admin')"
      clickable
      v-ripple
      to="/catalogos"
      :active="link === 'catalogos'"
      @click="link = 'catalogos'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="list" />
      </q-item-section>

      <q-item-section>Catalogos</q-item-section>
    </q-item>
    <q-item
      v-if="checkRole('Admin')"
      clickable
      v-ripple
      to="/admin"
      :active="link === 'admin'"
      @click="link = 'admin'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="admin_panel_settings" />
      </q-item-section>

      <q-item-section>Administracion</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from "vue";

import { checkRole, checkPosition } from "src/boot/checks";

const link = ref("inbox");

const openNewTab = () => {
  // Aquí pones la URL que quieres abrir
  const url =
    "https://docs.google.com/spreadsheets/d/1QtsTk2NHQGDlIPl1n9GUMTd6-MZgGGFu_GposORPbyg/edit?usp=sharing";
  // Abre la URL en una nueva pestaña
  window.open(url, "_blank");
};
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: #2b6ad0
</style>
