<template>
  <q-card bordered class="no-shadow">
    <q-item>
      <q-item-section avatar>
        <q-avatar
          size="5em"
          class="shadow-10"
          color="white"
          text-color="white"
          v-if="employee.pic && employee.picture"
        >
          <img :src="employee.pic" alt="Foto de la marca" />
        </q-avatar>
        <q-avatar
          v-else
          color="primary"
          text-color="white"
          size="5em"
          class="shadow-10"
        >
          {{ employee.first_name.charAt(0).toUpperCase()
          }}{{ employee.paternal_surname.charAt(0).toUpperCase() }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-bold">
          {{ employee.fullName }}
        </q-item-label>
        <q-item-label>
          {{ formatPhoneNumber(employee.phone) }}
        </q-item-label>
        <q-item-label>
          {{ employee.user.email }}
        </q-item-label>
      </q-item-section>

      <!-- <q-item-section side>
        <q-item-label>
          <q-icon name="fab fa-whatsapp" size="3em" color="green-6" />
        </q-item-label>
      </q-item-section> -->
    </q-item>

    <q-separator />
    <q-card-section horizontal>
      <q-card-section class="col-6">
        <q-item>
          <q-item-section>
            <q-item-label>
              <strong>Tipo:</strong>
              {{ employee.type.name }}
            </q-item-label>
            <q-item-label>
              <strong>Agencia:</strong>
              {{ employee.agency.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator vertical></q-separator>
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label>
              <strong>Puesto:</strong>
              {{ employee.position?.name }}
            </q-item-label>
            <q-item-label>
              <strong>Departamento:</strong>
              {{ employee.department?.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
const { employee } = defineProps(["employee"]);
import { formatPhoneNumber } from "src/boot/format";
</script>
