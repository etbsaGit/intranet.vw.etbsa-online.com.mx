<template>
  <employee-all-form :employee="employee" :key="employee" />
</template>

<script setup>
import { useAuthStore } from "src/stores/auth";
import EmployeeAllForm from "src/components/Employee/EmployeeAllForm.vue";
const authStore = useAuthStore();
const user = authStore.authUser;

const employee = user.employee;
</script>
