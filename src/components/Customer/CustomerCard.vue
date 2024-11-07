<template>
  <q-card class="my-card shadow-2">
    <q-card-section class="card-header">
      <div class="text-h6 font-weight-bold">{{ customer.name }}</div>
      <div class="text-subtitle2">
        <div><strong>RFC:</strong> {{ customer.rfc || "N/A" }}</div>
        <div><strong>CURP:</strong> {{ customer.curp || "N/A" }}</div>
        <div>
          <strong>Teléfono celular:</strong>
          {{ formatPhoneNumber(customer.phone) }}
        </div>
        <div>
          <strong>Teléfono fijo:</strong>
          {{ formatPhoneNumber(customer.landline) }}
        </div>
        <div>
          <strong>Correo Electrónico:</strong>
          {{ customer.email || "No disponible" }}
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="card-section">
      <div class="text-h6 font-weight-bold">Dirección</div>
      <div>
        <div><strong>Calle:</strong> {{ customer.street }}</div>
        <div><strong>Municipio:</strong> {{ customer.municipality?.name }}</div>
        <div><strong>Estado:</strong> {{ customer.state?.name }}</div>
        <div><strong>Tipo de Cliente:</strong> {{ customer.type?.name }}</div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="card-section">
      <div class="text-h6 font-weight-bold">Contactos</div>
      <div
        v-for="reference in customer.references"
        :key="reference.id"
        class="contact-item"
      >
        <q-item>
          <q-item-section class="q-pa-none" side>
            <q-icon name="contact_phone" size="20px" color="primary" />
          </q-item-section>
          <q-item-section>
            <div class="text-bold">{{ reference.name }}</div>
            <div>
              <strong>Teléfono:</strong>
              {{ formatPhoneNumber(reference.phone) }}
            </div>
            <div><strong>Email:</strong> {{ reference.mail }}</div>
          </q-item-section>
        </q-item>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="card-section">
      <div class="text-h6 font-weight-bold">Empleados Responsables</div>
      <div
        v-for="employee in customer.employees"
        :key="employee.id"
        class="employee-item"
      >
        <q-item>
          <q-item-section class="q-pa-none" side>
            <q-icon name="work" size="20px" color="primary" />
          </q-item-section>
          <q-item-section>
            <div class="text-bold">{{ employee.fullName }}</div>
            <div>
              <strong>Teléfono:</strong> {{ formatPhoneNumber(employee.phone) }}
            </div>
            <div><strong>Agencia:</strong> {{ employee.agency?.name }}</div>
          </q-item-section>
        </q-item>
      </div>
    </q-card-section>

    <q-separator />
  </q-card>
</template>

<script setup>
import { formatPhoneNumber } from "src/boot/format";
const { customer } = defineProps(["customer"]);
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f0f3f5;
  padding: 20px;
  border-radius: 8px;
}

.card-section {
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.text-h6 {
  font-size: 18px;
  font-weight: 600;
}

.text-subtitle2 {
  font-size: 14px;
  color: #6c757d;
  margin-top: 10px;
}

.text-bold {
  font-weight: 600;
}

.contact-item,
.employee-item {
  margin-bottom: 15px;
}

.q-item {
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.q-item-section {
  font-size: 14px;
  color: #333;
}

.q-item-section > div {
  margin-bottom: 5px;
}

.q-separator {
  margin: 10px 0;
  border-color: #e0e0e0;
}

.q-icon {
  margin-right: 10px;
}

strong {
  color: #212529;
}

.q-item-section > strong {
  color: #007bff;
}

.q-pa-none {
  padding: 0;
}

.q-item-label {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
