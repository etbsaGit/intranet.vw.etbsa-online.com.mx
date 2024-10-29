<template>
  <q-form ref="myForm" greedy>
    <q-item dense>
      <q-item-section class="items-center" avatar>
        <q-avatar size="180px" v-if="formEmployee.base64 || path">
          <q-img :src="formEmployee.base64 ? formEmployee.base64 : path" />
        </q-avatar>
        <q-avatar v-else size="180px">
          <q-img src="~src/assets/nonimageuser.png" />
        </q-avatar>
        <q-space />
        <q-file
          clearable
          color="secondary"
          dense
          filled
          :readonly="!checkPosition('Gerente')"
          v-model="formEmployee.file"
          label="Subir foto"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif"
          @clear="formEmployee.base64 = null"
          @input="convertirFile($event)"
        />
      </q-item-section>
      <q-item-section class="items-center" avatar>
        <q-avatar size="180px" v-if="formEmployee.base64qr || pathqr" square>
          <q-img
            :src="formEmployee.base64qr ? formEmployee.base64qr : pathqr"
          />
        </q-avatar>
        <q-avatar v-else size="180px">
          <q-icon name="fas fa-qrcode" />
        </q-avatar>
        <q-space />
        <q-file
          clearable
          color="secondary"
          dense
          filled
          :readonly="!checkPosition('Gerente')"
          v-model="formEmployee.fileqr"
          label="Subir QR"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif"
          @clear="formEmployee.base64qr = null"
          @input="convertirFileQr($event)"
        />
      </q-item-section>
      <q-item-section>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formEmployee.first_name"
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              label="Primer nombre"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.middle_name"
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              label="Segundo nombre"
              lazy-rules
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.paternal_surname"
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              label="Apellido paterno"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.maternal_surname"
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              label="Apellido materno"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              v-model="formEmployee.phone"
              label="Telefono"
              mask="(###) ### - ####"
              unmasked-value
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              v-model="formEmployee.email"
              label="Email"
              :rules="[
                (val) => !!val || 'Este campo es obligatorio',
                (val) =>
                  !val ||
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                  'Formato de correo inválido',
              ]"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formEmployee.rfc"
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              label="RFC"
              lazy-rules
              :rules="[
                (val) =>
                  val === null ||
                  val === '' ||
                  val.length === 13 ||
                  'El RFC debe tener exactamente 13 caracteres',
              ]"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              v-model="formEmployee.sales_key"
              filled
              :readonly="!checkPosition('Gerente')"
              dense
              label="Clave de vendedor"
              lazy-rules
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formEmployee.agency_id"
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
              :readonly="!checkPosition('Gerente')"
              dense
              clearable
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="formEmployee.position_id"
              :options="positions"
              label="Puesto"
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
              v-model="formEmployee.department_id"
              :options="departments"
              label="Departamento"
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
              v-model="formEmployee.type_id"
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
              :readonly="!checkPosition('Gerente')"
              dense
              clearable
              :rules="[(val) => val !== null || 'Obligatorio']"
            />
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { checkPosition } from "src/boot/checks";

const { employee } = defineProps(["employee"]);

const path = employee ? employee.pic : null;
const pathqr = employee ? employee.qr : null;

const agencies = ref([]);
const types = ref([]);
const positions = ref([]);
const departments = ref([]);

const myForm = ref(null);

const formEmployee = ref({
  id: employee ? employee.id : null,
  sales_key: employee ? employee.sales_key : null,
  first_name: employee ? employee.first_name : null,
  middle_name: employee ? employee.middle_name : null,
  paternal_surname: employee ? employee.paternal_surname : null,
  maternal_surname: employee ? employee.maternal_surname : null,
  rfc: employee ? employee.rfc : null,
  phone: employee ? employee.phone : null,
  agency_id: employee ? employee.agency_id : null,
  type_id: employee ? employee.type_id : null,
  position_id: employee ? employee.position_id : null,
  department_id: employee ? employee.department_id : null,
  email: employee?.user?.email ?? null,
  base64: null,
  base64qr: null,
  file: [],
  fileqr: [],
});

const convertirFile = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formEmployee.value.base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formEmployee.value.base64.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const convertirFileQr = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      formEmployee.value.base64qr = base64Data;
    };
    reader.readAsDataURL(archivo);
  } else {
    formEmployee.value.base64qr.value = null; // Limpiar base64 cuando no hay archivo seleccionado
  }
};

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/employee/options",
    ""
  );
  agencies.value = res.agencies;
  types.value = res.types;
  positions.value = res.positions;
  departments.value = res.departments;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formEmployee,
  validate,
});
</script>
