import { useAuthStore } from "src/stores/auth";

export function checkRole(role) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  return usuario.roles.some((usuarioRol) => usuarioRol.name === role);
}
