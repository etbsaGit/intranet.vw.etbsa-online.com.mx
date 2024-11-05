<template>
  <q-form ref="myForm" greedy class="card-container">
    <q-card class="card">
      <q-item>
        <q-item-section>
          <q-item-label align="center" class="text-h6 text-grey-7">
            Con atencion a:
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="formFollowUp.customer_id"
            :options="filterCustomers"
            label="Cliente"
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
            :rules="[(val) => val !== null || 'Obligatorio']"
            use-input
            @filter="filterFn"
            input-debounce="0"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
            <template v-slot:after>
              <q-btn
                outline
                label="Agregar cliente"
                color="primary"
                @click="showAdd = true"
                icon="add_circle"
              />
            </template>
          </q-select>
        </q-item-section>
      </q-item>
    </q-card>
    <q-card class="card">
      <q-item>
        <q-item-section>
          <q-item-label align="center" class="text-h6 text-grey-7">
            -Datos del seguimiento-
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="formFollowUp.title"
            outlined
            dense
            label="Modelos de interes o nombre del proyecto"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="formFollowUp.vehicle_id"
            :options="vehicles"
            label="Modelo de interes"
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
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="formFollowUp.origin_id"
            :options="origins"
            label="Origen"
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
            :rules="[(val) => val !== null || 'Obligatorio']"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="formFollowUp.percentage_id"
            :options="percentages"
            label="Certeza"
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
            :rules="[(val) => val !== null || 'Obligatorio']"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip outline :color="getNumber(scope.opt.name).color">
                    {{ getNumber(scope.opt.name).label }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            v-model="formFollowUp.comments"
            outlined
            dense
            label="Comentarios"
            lazy-rules
            :rules="[(val) => val !== null || 'Obligatorio']"
          />
        </q-item-section>
      </q-item>
    </q-card>
    <q-card class="card" v-if="!followUp">
      <q-card-section horizontal>
        <q-card-section class="col-6">
          <q-item>
            <q-item-section>
              <q-item-label align="center" class="text-h6 text-grey-7">
                -Vendedor-
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-select
                v-model="formFollowUp.employee_id"
                :options="employees"
                label="Selecciona un vendedor"
                option-value="id"
                options-dense
                option-label="fullName"
                option-disable="inactive"
                emit-value
                map-options
                transition-show="jump-up"
                transition-hide="jump-up"
                outlined
                dense
                clearable
                :disable="!checkPosition('Gerente')"
                :rules="[(val) => val !== null || 'Obligatorio']"
              />
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator vertical color="primary"></q-separator>
        <q-card-section class="col-6">
          <q-item>
            <q-item-section>
              <q-item-label align="center" class="text-h6 text-grey-7">
                -Proximo contacto-
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                v-model="formFollowUp.next_follow.date"
                dense
                outlined
                label="Proximo contacto"
                mask="date"
                hint
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
                        v-model="formFollowUp.next_follow.date"
                        minimal
                        :options="dateOptions"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item-section>
            <q-item-section>
              <q-select
                v-model="formFollowUp.next_follow.percentage_id"
                :options="percentages"
                label="Certeza"
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
                :rules="[(val) => val !== null || 'Obligatorio']"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip outline :color="getNumber(scope.opt.name).color">
                        {{ getNumber(scope.opt.name).label }}
                      </q-chip>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                v-model="formFollowUp.next_follow.comments"
                outlined
                dense
                label="Comentarios"
                lazy-rules
                :rules="[(val) => val !== null || 'Obligatorio']"
              />
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-form>

  <q-dialog
    v-model="showAdd"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <customer-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { date } from "quasar";
import { sendRequest, notifyIncomplete } from "src/boot/functions";
import { useAuthStore } from "src/stores/auth";
import { checkPosition } from "src/boot/checks";
import { getNumber } from "src/boot/followUp";

import CustomerForm from "src/components/Customer/CustomerForm.vue";

const authStore = useAuthStore();
const usuario = authStore.authUser;

const timeStamp = Date.now();
const today = date.formatDate(timeStamp, "YYYY/MM/DD");

function dateOptions(date) {
  return date >= today;
}

const showAdd = ref(false);
const add = ref(null);

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    notifyIncomplete();
    return;
  }
  const final = {
    ...add.value.formCustomer,
  };
  let res = await sendRequest("POST", final, "/api/intranet/customer", "");
  showAdd.value = false;
  formFollowUp.value.customer_id = res.id;
  getOptions();
};

const { followUp } = defineProps(["followUp"]);

const customers = ref([]);
const employees = ref([]);
const vehicles = ref([]);
const origins = ref([]);
const percentages = ref([]);

const myForm = ref(null);

const formFollowUp = ref({
  title: followUp ? followUp.title : null,
  date: followUp ? followUp.date : today,
  comments: followUp ? followUp.comments : null,
  customer_id: followUp ? followUp.customer_id : null,
  employee_id: followUp ? followUp.employee_id : usuario.employee?.id,
  vehicle_id: followUp ? followUp.vehicle_id : null,
  origin_id: followUp ? followUp.origin_id : null,
  percentage_id: followUp ? followUp.percentage_id : null,
  follow_up_id: followUp ? followUp.follow_up_id : null,
  next_follow: {
    date: followUp ? followUp.next_follow?.date : null,
    percentage_id: followUp ? followUp.next_follow?.percentage_id : null,
    comments: followUp ? followUp.next_follow?.comments : null,
  },
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/followUp/options",
    ""
  );
  customers.value = res.customers;
  employees.value = res.employees;
  vehicles.value = res.vehicles;
  origins.value = res.origins;
  percentages.value = res.percentages;
};

const filterCustomers = ref(null);

function filterFn(val, update) {
  if (val == "") {
    update(() => {
      filterCustomers.value = customers.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterCustomers.value = customers.value.filter(
      (customer) => customer.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formFollowUp,
  validate,
});
</script>

<style>
.card-container {
  display: flex;
  flex-direction: column; /* O row si quieres las tarjetas en una fila */
  gap: 16px; /* Ajusta este valor según necesites */
}

.card {
  border-radius: 20px;
  border: 2px solid #061e4778;
}
</style>
