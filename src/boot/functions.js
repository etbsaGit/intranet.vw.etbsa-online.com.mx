import axios from "axios";
import { useAuthStore } from "src/stores/auth";
import { Loading, QSpinnerGears, Notify } from "quasar";

export function show_notify(msj, icon, color, focus = "") {
  if (focus !== "") {
    nextTick(() => focus.focus());
  }
  Notify.create({
    message: msj,
    icon: icon,
    color: color,
    position: "bottom-right",
  });
}

export function notifyIncomplete() {
  Notify.create({
    color: "red-5",
    textColor: "white",
    icon: "warning",
    message: "Por favor completa todos los campos obligatorios",
  });
}

const sleep = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
};

export async function sendRequest(method, params, url, redirect = "") {
  const authStore = useAuthStore();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authStore.authToken}`;
  //axios.defaults.headers.common["Content-Type"] = "multipart/form-data"
  try {
    Loading.show({
      spinner: QSpinnerGears,
    });
    const response = await axios({ method: method, url: url, data: params });
    const data = response.data;
    if (method == "POST" || method == "PUT") {
      show_notify("Registro cargado", "publish", "blue", "");
    }
    if (method == "GET") {
      show_notify("Informacion cargada del servidor", "download", "green", "");
    }
    if (method == "DELETE") {
      show_notify("Registro borrado", "delete", "orange", "");
    }
    if (!!redirect) {
      await sleep(2000);
      window.location.href = redirect;
    }
    Loading.hide();
    return data;
  } catch (err) {
    Loading.hide();
    const errorMessage = err.response.data;
    if (err.response.status === 401 || errorMessage === "Unauthorized") {
      localStorage.clear();
      location.reload();
      await sleep(2000);
    }
    if (typeof errorMessage === "object" && errorMessage !== null) {
      let errorMessages = [];
      for (const key in errorMessage) {
        if (Object.hasOwnProperty.call(errorMessage, key)) {
          const error = errorMessage[key];
          errorMessages.push(`Error en ${key}: ${error}`);
        }
      }
      show_notify(errorMessages.join("\n"), "error", "red", "");
    } else {
      show_notify("Error desconocido: " + errorMessage, "check", "red", "");
    }
    throw err;
  }
}
