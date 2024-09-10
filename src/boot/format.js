import { date } from "quasar";

const daysOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

// Array de meses en español
const monthsOfYear = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function formatPhoneNumber(phoneNumber) {
  // Eliminar cualquier carácter que no sea un dígito
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Aplicar el formato (###)-###-####
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]})-${match[2]}-${match[3]}`;
  }

  // Si no coincide con el patrón esperado, devolver el número sin formato
  return cleaned;
}

export function formatDate(currentDay) {
  if (!currentDay) return "Pendiente";
  const nextDay = date.addToDate(currentDay, { days: 1 });
  return date.formatDate(nextDay, "D/MM/YYYY");
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function formatDateLong(currentDay) {
  // const nextDay = date.addToDate(currentDay, { days: 1 });
  return date.formatDate(currentDay, "dddd D [de] MMMM [del] YYYY");
}

export function formatDateplusone(currentDay) {
  if (!currentDay) return "no disponible";

  // Crear un objeto Date con la fecha proporcionada
  const date = new Date(currentDay);

  // Añadir un día a la fecha
  date.setDate(date.getDate() + 1);

  // Obtener el día de la semana y el mes en español
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthOfYear = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();

  // Formatear la fecha en español
  return `${dayOfWeek} ${dayOfMonth} de ${monthOfYear} del ${year}`;
}

export function formatDateAt(currentDay) {
  if (!currentDay) return "no disponible";

  // Crear un objeto Date con la fecha proporcionada
  const date = new Date(currentDay);

  // Obtener el día de la semana y el mes en español
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthOfYear = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();

  // Formatear la fecha en español
  return `${dayOfWeek} ${dayOfMonth} de ${monthOfYear} del ${year}`;
}
