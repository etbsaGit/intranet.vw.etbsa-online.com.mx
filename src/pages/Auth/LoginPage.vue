<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-sm shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <q-img
          src="../../assets/Logo.svg"
          alt="Logo"
          style="width: 200px; height: 200px"
        />
        <div class="text-grey-9 text-h5 text-weight-bold">VW Bajio</div>
      </q-card-section>
      <!-- <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
        <div class="text-grey-8">Sign in below to access your account</div>
      </q-card-section> -->
      <q-form
        @submit.prevent="login(form)"
        class="q-gutter-md"
        ref="myForm"
        greedy
      >
        <q-card-section>
          <q-input
            dense
            outlined
            v-model="form.email"
            label="Email Address"
            :rules="[(val) => (val && val.length > 0) || 'Ingrese su correo']"
          />
          <q-input
            dense
            outlined
            class="q-mt-md"
            v-model="form.password"
            type="password"
            label="Password"
            :rules="[(val) => (val && val.length > 0) || 'Ingrese contraseña']"
          />
        </q-card-section>
        <q-card-section>
          <q-btn
            style="border-radius: 8px"
            color="primary"
            rounded
            size="md"
            label="Sign in"
            no-caps
            class="full-width"
            type="submit"
          />
        </q-card-section>
      </q-form>
      <!-- <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Don't have an account yet?
          <q-btn to="/register" class="text-dark text-weight-bold">
            Sign up.
          </q-btn>
        </div>
      </q-card-section> -->
    </q-card>
  </q-page>
</template>
<script setup>
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";

const myForm = ref(null);

const { login } = useAuthStore();
const form = ref({ email: "", password: "" });
</script>
<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
