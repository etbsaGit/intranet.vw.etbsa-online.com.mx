<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section class="col-2">
        <q-input
          v-model="formVehicle.sku"
          filled
          :readonly="!checkPosition('Gerente')"
          dense
          label="# unico"
          lazy-rules
          hint
        />
        <!-- :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" -->
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formVehicle.name"
          filled
          :readonly="!checkPosition('Gerente')"
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formVehicle.description"
          filled
          :readonly="!checkPosition('Gerente')"
          dense
          label="Descripcion"
          lazy-rules
          hint
        />
        <!-- :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" -->
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          v-model="formVehicle.brand_id"
          :options="brands"
          label="Marca"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          :readonly="!checkPosition('Gerente')"
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formVehicle.type_id"
          :options="types"
          label="Tipo de vehiculo"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          :readonly="!checkPosition('Gerente')"
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-toggle
          dense
          label="Activo"
          v-model="formVehicle.active"
          color="primary"
          :false-value="0"
          :true-value="1"
          :disable="!checkPosition('Gerente')"
        />
      </q-item-section>
      <q-item-section>
        <q-toggle
          dense
          label="Destacado"
          v-model="formVehicle.featured"
          color="primary"
          :false-value="0"
          :true-value="1"
          :disable="!checkPosition('Gerente')"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { checkPosition } from "src/boot/checks";

const { vehicle } = defineProps(["vehicle"]);

const types = ref([]);
const brands = ref([]);

const myForm = ref(null);

const formVehicle = ref({
  id: vehicle ? vehicle.id : null,
  sku: vehicle ? vehicle.sku : null,
  name: vehicle ? vehicle.name : null,
  description: vehicle ? vehicle.description : null,
  active: vehicle ? vehicle.active : false,
  featured: vehicle ? vehicle.featured : false,
  type_id: vehicle ? vehicle.type_id : null,
  brand_id: vehicle ? vehicle.brand_id : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/vehicle/options", "");
  types.value = res.types;
  brands.value = res.brands;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formVehicle,
  validate,
});
</script>
