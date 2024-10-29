<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formPrice.type_id"
          :options="types"
          label="Tipo de precio"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formPrice.price"
          outlined
          dense
          label="Precio"
          lazy-rules
          hint
          prefix="$"
          filled
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { price, inventory } = defineProps(["price", "inventory"]);

const myForm = ref(null);
const types = ref([]);

const formPrice = ref({
  id: price ? price.id : null,
  inventory_id: price ? price.inventory_id : inventory.id,
  type_id: price ? price.type_id : null,
  price: price ? price.price : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/type/key/prices", "");
  types.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formPrice,
  validate,
});
</script>
