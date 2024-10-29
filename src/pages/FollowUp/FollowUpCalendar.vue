<template>
  <q-item class="year-navigator">
    <q-btn @click="prevMonth" round dense flat icon="arrow_left" />
    <span class="year-display">{{ currentMonthYear }}</span>
    <q-btn @click="nextMonth" round dense flat icon="arrow_right" />
  </q-item>
  <q-item>
    <q-item-section>
      <q-calendar-month
        :weekdays="[0, 1, 2, 3, 4, 5, 6]"
        ref="calendar"
        v-model="selectedDate"
        locale="es"
        animated
        bordered
        focusable
        hoverable
        no-active-date
        :day-min-height="100"
        :day-height="0"
        class="custom-calendar-month"
      >
        <template v-if="events != null" #day="{ scope: { timestamp } }">
          <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
            <div
              @click="onClickDay(event)"
              class="my-event rounded-border text-black"
            >
              <q-item
                class="event-item"
                :class="{ 'bg-red-3': event.feedback === null }"
              >
                <q-item-section>
                  <q-item-label class="event-label customer-name">
                    {{ event.customer.name }}
                  </q-item-label>
                  <q-item-label class="event-label vehicle-name">
                    {{ event.vehicle?.name }}
                  </q-item-label>
                  <q-item-label class="event-label comments">
                    {{ event.comments }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </template>
        </template>
      </q-calendar-month>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showEdit"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">{{ selectedItem.title }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup @click="getEvents" />
        </q-item-section>
      </q-item>
      <q-separator />

      <follow-up-all-form
        ref="edit"
        :followUp="selectedItem"
        :key="selectedItem"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QCalendarMonth, parseDate, today } from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";

import FollowUpAllForm from "src/components/FollowUp/FollowUpAllForm.vue";

import { ref, watch, onMounted, computed } from "vue";
import { date, useQuasar } from "quasar";

import { sendRequest } from "src/boot/functions";

const selectedDate = ref(today());
const events = ref(null);
const showEdit = ref(false);
const selectedItem = ref(null);

const getMonthYear = (dateString) => {
  const dateObject = new Date(dateString);
  const month = dateObject.toLocaleString("default", { month: "long" });
  const year = dateObject.getFullYear();
  return `${month} ${year}`;
};

const currentMonthYear = ref(getMonthYear(selectedDate.value));

const prevMonth = () => {
  const current = new Date(selectedDate.value);
  current.setMonth(current.getMonth() - 1);
  selectedDate.value = date.formatDate(current, "YYYY-MM-DD");
  currentMonthYear.value = getMonthYear(selectedDate.value);
};

const nextMonth = () => {
  const current = new Date(selectedDate.value);
  current.setMonth(current.getMonth() + 1);
  selectedDate.value = date.formatDate(current, "YYYY-MM-DD");
  currentMonthYear.value = getMonthYear(selectedDate.value);
};

watch(selectedDate, (newDate) => {
  currentMonthYear.value = getMonthYear(newDate);
});

const onClickDay = (data) => {
  selectedItem.value = data;
  showEdit.value = true;
};

const eventsMap = computed(() => {
  const map = {};
  if (events.value.length > 0) {
    events.value.forEach((event) => {
      (map[event.date] = map[event.date] || []).push(event);
    });
  }
  return map;
});

const getEvents = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/followUp/all", "");
  events.value = res;
};

onMounted(() => {
  getEvents();
});
</script>

<style scope>
.year-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
}

.year-display {
  font-size: 24px;
  margin: 0 16px;
}

.my-event {
  position: relative;
  font-size: 11px;
  width: 100%;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

/* Estilo para el contenedor del evento */
.event-item {
  background-color: #f9f9f9; /* Fondo suave */
  border: 1px solid #e0e0e0; /* Borde ligero */
  border-radius: 8px; /* Bordes redondeados */
  padding: 15px; /* Espaciado interno */
  margin: 10px 0; /* Espaciado externo */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra ligera */
  font-family: Arial, sans-serif; /* Fuente moderna */
  color: #333; /* Color de texto */
}

/* Estilo para las etiquetas dentro del contenedor del evento */
.event-item .event-label {
  display: block;
  font-size: 11px; /* Tamaño de fuente */
  margin-bottom: 5px; /* Espaciado entre etiquetas */
  color: #555; /* Color del texto */
}

/* Estilo para el nombre del cliente */
.event-item .customer-name {
  font-weight: bold; /* Negrita para el nombre del cliente */
  font-size: 12px; /* Tamaño de fuente más grande */
  color: #007bff; /* Color azul para destacar el nombre */
}

/* Estilo para el nombre del vehículo y comentarios */
.event-item .vehicle-name,
.event-item .comments {
  font-style: italic; /* Estilo en cursiva */
}
</style>
