<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formDoc.type_id"
          :options="types"
          label="Tipo de documento"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          @clear="clearForm"
          :rules="[(val) => val !== null || 'Obligatorio']"
          @update:model-value="updateAccept"
        />
      </q-item-section>
      <q-item-section>
        <q-file
          clearable
          filled
          dense
          v-model="model"
          hint
          label="Buscar aqui tu documento"
          @input="convertirFile($event)"
          @clear="clearForm"
          :accept="accept"
          :disable="formDoc.type_id == null"
          :rules="[(val) => !!val || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="formDoc.base64">
      <q-item-section v-if="isBase64Image(formDoc.base64)">
        <q-img :src="formDoc.base64 ? formDoc.base64 : path" />
      </q-item-section>
      <q-item-section v-else class="items-center">
        <q-avatar icon="description" size="100px" />
        <q-item-label>{{ formDoc.name }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-else-if="path">
      <q-item-section>
        <q-item-section class="items-center">
          <q-avatar square size="100px">
            <q-img :src="imgSrc" @error="noImage" />
          </q-avatar>
          {{ doc.name }}
        </q-item-section>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { doc, vehicle } = defineProps(["doc", "vehicle"]);

const myForm = ref(null);
const types = ref([]);
const model = ref(null);

const accept = ref(null);
const path = ref(doc ? doc.realpath : null);

// Ruta de la imagen por defecto
const defaultImage = "src/assets/noimage.jpg";

// La imagen que se mostrará en la vista
const imgSrc = ref(doc ? doc.realpath : null);

// Función que se llama cuando ocurre un error en la carga de la imagen
const noImage = () => {
  imgSrc.value = defaultImage;
};

const formDoc = ref({
  id: doc ? doc.id : null,
  vehicle_id: doc ? doc.vehicle_id : vehicle.id,
  type_id: doc ? doc.type_id : null,
  name: doc ? doc.name : null,
  extension: doc ? doc.extension : null,
  base64: null,
});

const clearForm = () => {
  formDoc.value.id = null;
  formDoc.value.type_id = null;
  formDoc.value.name = null;
  formDoc.value.extension = null;
  formDoc.value.base64 = null;
  model.value = null;
  path.value = null;
};

const updateAccept = (value) => {
  const selectedOption = types.value.find((option) => option.id === value);
  if (selectedOption) {
    switch (selectedOption.name) {
      case "Imagen":
        accept.value = ".jpg, image/*"; // Acepta todos los tipos de imagen
        break;
      case "Archivo":
        accept.value = ".pdf, .doc, .docx,"; // Acepta PDF, Word y Excel
        break;
      default:
        accept.value = ""; // Ningún tipo por defecto
        break;
    }
  }
};

const isBase64Image = (base64) => {
  if (!base64) return false;
  // Verifica el encabezado de base64 para determinar el tipo de archivo
  const mime = base64.split(";")[0].split(":")[1];
  return mime.startsWith("image/");
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  if (archivos) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        formDoc.value.name = archivo.name;
        formDoc.value.extension = archivo.name.split(".").pop();
        formDoc.value.base64 = base64Data;
      };
      reader.readAsDataURL(archivo);
    });
  }
};

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/type/key/docs", "");
  types.value = res;
  updateAccept(formDoc.value.type_id);
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formDoc,
  validate,
});
</script>
