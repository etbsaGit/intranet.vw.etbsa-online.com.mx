<template>
  <q-form ref="myForm" greedy>
    <q-item v-for="(employee, index) in employees" :key="employee.id">
      <q-item-section>
        <strong>{{ employee.fullName }}</strong>
      </q-item-section>

      <!-- Formulario de Prospección -->
      <q-item-section>
        <q-input
          v-model="formularios[index * 2].value"
          label="Cantidad Prospección"
          filled
          dense
          lazy-rules
          mask="#.##"
          prefix="$"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formularios[index * 2].quantity"
          label="Unidades Prospección"
          filled
          dense
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>

      <!-- Formulario de Venta -->
      <q-item-section>
        <q-input
          v-model="formularios[index * 2 + 1].value"
          label="Cantidad Venta"
          filled
          dense
          lazy-rules
          mask="#.##"
          prefix="$"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formularios[index * 2 + 1].quantity"
          label="Unidades Venta"
          filled
          dense
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>

  <q-item>
    <q-item-section></q-item-section>
    <q-item-section>
      <strong>
        Total Cantidad Prospección: {{ totalProspeccionCantidad }}
      </strong>
    </q-item-section>
    <q-item-section>
      <strong>
        Total Unidades Prospección: {{ totalProspeccionUnidades }}
      </strong>
    </q-item-section>
    <q-item-section>
      <strong>Total Cantidad Venta: {{ totalVentaCantidad }}</strong>
    </q-item-section>
    <q-item-section>
      <strong>Total Unidades Venta: {{ totalVentaUnidades }}</strong>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatCurrency } from "src/boot/format";

const { month, year, agency } = defineProps(["month", "year", "agency"]);

const employees = ref([]);
const types = ref([]);
const formularios = ref([]);
const myForm = ref(null);

// Obtener el type_id por nombre
const getTypeIdByName = (name) => {
  const type = types.value.find((type) => type.name === name);
  return type ? type.id : null;
};

const getEmployees = async (month, year, agency) => {
  let res = await sendRequest(
    "GET",
    null,
    `/api/intranet/targets/${month}/${year}/${agency}`,
    ""
  );
  employees.value = res.employees;
  types.value = res.types;
};

// Actualiza formularios cuando employees cambia
watch(
  employees,
  (newEmployees) => {
    formularios.value = newEmployees.flatMap((employee) => {
      const prospeccionTypeId = getTypeIdByName("Prospeccion");
      const ventaTypeId = getTypeIdByName("Venta");

      const prospeccionTarget = employee.targets.find(
        (target) => target.type.id === prospeccionTypeId
      ) || { value: null, quantity: null };
      const ventaTarget = employee.targets.find(
        (target) => target.type.id === ventaTypeId
      ) || { value: null, quantity: null };

      return [
        {
          value: prospeccionTarget.value,
          quantity: prospeccionTarget.quantity,
          month: month,
          year: year,
          type_id: prospeccionTypeId,
          employee_id: employee.id,
        },
        {
          value: ventaTarget.value,
          quantity: ventaTarget.quantity,
          month: month,
          year: year,
          type_id: ventaTypeId,
          employee_id: employee.id,
        },
      ];
    });
  },
  { immediate: true }
);

const totalProspeccionCantidad = computed(() => {
  const total = employees.value.reduce((total, employee, index) => {
    const cantidad = formularios.value[index * 2]?.value || 0;
    return total + parseFloat(cantidad) || 0;
  }, 0);
  return formatCurrency(total);
});

const totalProspeccionUnidades = computed(() => {
  return employees.value.reduce((total, employee, index) => {
    const unidades = formularios.value[index * 2]?.quantity || 0;
    return total + parseInt(unidades) || 0;
  }, 0);
});

const totalVentaCantidad = computed(() => {
  const total = employees.value.reduce((total, employee, index) => {
    const cantidad = formularios.value[index * 2 + 1]?.value || 0;
    return total + parseFloat(cantidad) || 0;
  }, 0);
  return formatCurrency(total);
});

const totalVentaUnidades = computed(() => {
  return employees.value.reduce((total, employee, index) => {
    const unidades = formularios.value[index * 2 + 1]?.quantity || 0;
    return total + parseInt(unidades) || 0;
  }, 0);
});

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getEmployees(month, year, agency);
});

defineExpose({
  formularios,
  validate,
});
</script>
