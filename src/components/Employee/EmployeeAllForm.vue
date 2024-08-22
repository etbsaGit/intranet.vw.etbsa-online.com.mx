<template>
  <q-tabs
    v-model="tab"
    class="text-black"
    active-color="primary"
    indicator-color="primary"
    dense
    align="justify"
    narrow-indicator
  >
    <q-tab name="info" icon="face" label="Informacion" />
    <q-tab name="municipality" icon="public" label="Zonas asignadas" />
    <q-tab name="targets" icon="flag" label="Metas" />
  </q-tabs>
  <q-separator />
  <q-tab-panels
    v-model="tab"
    animated
    swipeable
    vertical
    transition-prev="jump-up"
    transition-next="jump-up"
  >
    <q-tab-panel name="info">
      <q-card class="q-pa-sm">
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-h6"> Informacion general </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn label="Guardar" color="blue" @click="putItem" />
          </q-item-section>
        </q-item>
        <employee-form ref="edit" :employee="currentItem" :key="currentItem" />
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="municipality">
      <q-card class="q-pa-sm">
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-h6"> Zonas asignadas </q-item-label>
          </q-item-section>
        </q-item>
        <employee-municipality-index
          :employee="currentItem"
          :key="currentItem"
        />
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="targets">
      <q-card class="q-pa-sm">
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-h6"> Metas asignadas </q-item-label>
          </q-item-section>
        </q-item>
        <target-index :employee="currentItem" :key="currentItem" />
      </q-card>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, notifyIncomplete } from "src/boot/functions";

import EmployeeForm from "src/components/Employee/EmployeeForm.vue";
import EmployeeMunicipalityIndex from "src/components/EmployeeMunicipality/EmployeeMunicipalityIndex.vue";
import TargetIndex from "src/components/Target/TargetIndex.vue";

const { employee } = defineProps(["employee"]);

const tab = ref("info");
const currentItem = ref(null);
const edit = ref(null);

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...edit.value.formEmployee,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/employee/" + final.id,
    ""
  );
  currentItem.value = res;
};

onMounted(() => {
  currentItem.value = employee;
});
</script>
