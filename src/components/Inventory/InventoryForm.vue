<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formInventory.serial_number"
          filled
          dense
          label="# de serie"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInventory.economical_number"
          filled
          dense
          label="# Economico"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInventory.inventory_number"
          filled
          dense
          label="# Inventario"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInventory.invoice"
          filled
          dense
          label="# de factura"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          dense
          filled
          v-model="formInventory.invoice_date"
          label="Fecha de factura"
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  minimal
                  v-model="formInventory.invoice_date"
                  mask="YYYY-MM-DD"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formInventory.vehicle_id"
          :options="vehicles"
          label="Modelo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formInventory.vehicle_body_id"
          :options="vehicleBodies"
          label="Carroceria"
          option-value="id"
          option-label="configuration"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInventory.year"
          filled
          dense
          label="Año del vehiculo"
          lazy-rules
          mask="####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInventory.p_r"
          filled
          dense
          label="p/r"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formInventory.status_id"
          :options="statuses"
          label="Estatus"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formInventory.type_id"
          :options="types"
          label="Tipo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formInventory.agency_id"
          :options="agencies"
          label="Agencia"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formInventory.comments"
          filled
          dense
          label="Comentarios"
          lazy-rules
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { inventory } = defineProps(["inventory"]);

const statuses = ref([]);
const types = ref([]);
const agencies = ref([]);
const vehicles = ref([]);
const vehicleBodies = ref([]);

const myForm = ref(null);

const formInventory = ref({
  id: inventory ? inventory.id : null,
  serial_number: inventory ? inventory.serial_number : null,
  economical_number: inventory ? inventory.economical_number : null,
  inventory_number: inventory ? inventory.inventory_number : null,
  invoice: inventory ? inventory.invoice : null,
  invoice_date: inventory ? inventory.invoice_date : null,
  year: inventory ? inventory.year : null,
  p_r: inventory ? inventory.p_r : null,
  comments: inventory ? inventory.comments : null,
  status_id: inventory ? inventory.status_id : null,
  type_id: inventory ? inventory.type_id : null,
  agency_id: inventory ? inventory.agency_id : null,
  vehicle_id: inventory ? inventory.vehicle_id : null,
  vehicle_body_id: inventory ? inventory.vehicle_body_id : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/inventories/options",
    ""
  );
  statuses.value = res.statuses;
  types.value = res.types;
  agencies.value = res.agencies;
  vehicles.value = res.vehicles;
  vehicleBodies.value = res.vehicleBodies;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formInventory,
  validate,
});
</script>
