<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formDepartment.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { department } = defineProps(["department"]);

const myForm = ref(null);

const formDepartment = ref({
  id: department ? department.id : null,
  name: department ? department.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formDepartment,
  validate,
});
</script>
