import { useAuthStore } from "src/stores/auth";

export function checkRole(role) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  return usuario.roles.some((usuarioRol) => usuarioRol.name === role);
}

export function checkPosition(position) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  const isAdmin = usuario.roles.some(
    (usuarioRol) => usuarioRol.name === "Admin"
  );
  const hasPosition = usuario.employee?.position.name === position;
  return isAdmin || hasPosition;
}
