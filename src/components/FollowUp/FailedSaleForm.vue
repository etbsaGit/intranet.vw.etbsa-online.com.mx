<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formFailedSale.comments"
          outlined
          dense
          label="Comentarios"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formFailedSale.type_id"
          :options="types"
          label="Motivo"
          option-value="id"
          options-dense
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          outlined
          dense
          clearable
          hint
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { followUp, failedSale } = defineProps(["followUp", "failedSale"]);

const types = ref([]);

const myForm = ref(null);

const formFailedSale = ref({
  id: failedSale ? failedSale.id : null,
  type_id: failedSale ? failedSale.type_id : null,
  follow_up_id: failedSale ? failedSale.follow_up_id : followUp.id,
  comments: failedSale ? failedSale.comments : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/type/key/failedSale",
    ""
  );
  types.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formFailedSale,
  validate,
});
</script>
