import axios from "axios";
import { defineStore } from "pinia";
import { LocalStorage, Notify } from "quasar";

export const useAuthStore = defineStore("auth", {
  state: () => ({ authUser: null, authToken: null }),
  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken,
  },
  actions: {
    async getToken() {
      await axios.get("/sanctum/csrf-cookie");
    },
    async login(form) {
      await this.getToken();
      await axios
        .post("/api/auth/login", form)
        .then((res) => {
          this.authToken = res.data.token;
          this.authUser = res.data.user;
          Notify.create({
            color: "green",
            position: "top",
            message: "Bienvenido",
            icon: "check",
          });
          this.router.push("/");
        })
        .catch((errors) => {
          Notify.create({
            color: "negative",
            position: "top",
            message: "Usuario y/o contraseña invalidos",
            icon: "report_problem",
          });
        });
    },
    async logout() {
      // Primero, elimina los datos del almacenamiento local
      LocalStorage.remove("auth");
      localStorage.clear();

      // Configura el encabezado de autorización para la solicitud de cierre de sesión
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.authToken}`;

      // Opcionalmente, limpia los datos de autenticación en la aplicación
      this.authToken = null;
      this.authUser = null;

      try {
        // Realiza la solicitud de cierre de sesión
        await axios.post("/api/auth/logout");
      } catch (error) {
      } finally {
        // Recarga la página independientemente del resultado de la solicitud
        location.reload();
      }
    },
  },
  persist: true,
});
