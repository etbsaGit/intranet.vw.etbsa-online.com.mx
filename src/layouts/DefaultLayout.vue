<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-img
            src="../assets/logo.png"
            spinner-color="white"
            style="max-width: 10%"
          /> -->
          VW Bajio
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

const auth = useAuthStore();
const { login } = auth;
const { user } = storeToRefs(auth);
</script>
