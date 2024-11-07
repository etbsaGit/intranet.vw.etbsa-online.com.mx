<template>
  <q-card flat bordered>
    <q-item>
      <q-item-section class="text-h6">
        <q-item-label>{{ customer.name }}</q-item-label>
        <q-item-label class="justificado-flex" caption v-if="reference">
          <div class="item">
            <strong>Contacto: </strong>{{ reference?.name }}
          </div>
          <div class="item"><strong>Email: </strong>{{ reference?.mail }}</div>
          <div class="item">
            <strong>Telefono: </strong>{{ formatPhoneNumber(reference?.phone) }}
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section avatar v-if="reference">
        <q-item-label>
          <q-icon
            name="fab fa-whatsapp"
            size="3em"
            color="green-6"
            @click="sendMessage(reference)"
            class="pointer-cursor"
          />
        </q-item-label>
        <q-tooltip
          anchor="center left"
          self="center right"
          class="text-h6 bg-green-6"
        >
          Abrir WhatsApp
        </q-tooltip>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section horizontal>
      <q-card-section class="col-6">
        <q-item>
          <q-item-section>
            <q-item-label>
              <strong>RFC:</strong>
              {{ customer.rfc }}
            </q-item-label>
            <q-item-label>
              <strong>CURP:</strong>
              {{ customer.curp }}
            </q-item-label>
            <q-item-label>
              <strong>Telefono celular:</strong>
              {{ formatPhoneNumber(customer.phone) }}
              <q-icon
                name="fab fa-whatsapp"
                size="2em"
                color="green-6"
                @click="sendMessage(customer)"
                class="pointer-cursor"
              />
              <q-tooltip
                anchor="center left"
                self="center right"
                class="text-h6 bg-green-6"
              >
                Abrir WhatsApp
              </q-tooltip>
            </q-item-label>
            <q-item-label>
              <strong>Telefono fijo:</strong>
              {{ formatPhoneNumber(customer.landline) }}
            </q-item-label>
            <q-item-label>
              <strong>Email:</strong>
              {{ customer.email }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="col-6">
        <q-item>
          <q-item-section>
            <q-item-label>
              <strong>Calle:</strong>
              {{ customer.street }}
            </q-item-label>
            <q-item-label>
              <strong>Colonia:</strong>
              {{ customer.district }}
            </q-item-label>
            <q-item-label>
              <strong>Codigo postal:</strong>
              {{ customer.zip_code }}
            </q-item-label>
            <q-item-label>
              <strong>Municipio:</strong>
              {{ customer.municipality?.name }}
            </q-item-label>
            <q-item-label>
              <strong>Estado:</strong>
              {{ customer.state?.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { formatPhoneNumber } from "src/boot/format";
import { useQuasar } from "quasar";

const { customer, reference } = defineProps(["customer", "reference"]);

const $q = useQuasar();

const sendMessage = (item) => {
  const phone = item?.phone;
  if (!phone) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "No tiene numero telefonico asingnado",
    });
    return;
  }
  const countryCode = "+52";
  const formattedPhoneNumber = countryCode + phone.trim();

  const whatsappLink = `https://wa.me/${encodeURIComponent(
    formattedPhoneNumber
  )}`;

  //Abrir enlace en una nueva ventana
  const newWindow = window.open(whatsappLink, "_blank");

  //Verificar si se abrió la nueva ventana correctamente
  if (!newWindow) {
    alert(
      "No se pudo abrir la ventana de WhatsApp. Asegúrate de tener permitido abrir ventanas emergentes en tu navegador."
    );
  }
};
</script>

<style scoped>
.pointer-cursor {
  cursor: pointer; /* Cambia el cursor a una manita cuando el ratón está sobre el elemento */
}

.justificado-flex {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.justificado-flex .item {
  display: flex;
  align-items: center;
}
</style>
