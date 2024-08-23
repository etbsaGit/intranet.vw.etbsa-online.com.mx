import { guest, auth, admin, gerente } from "./middleware";

const routes = [
  {
    path: "/login",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      { path: "", component: () => import("pages/Auth/LoginPage.vue") },
    ],
  },
  {
    path: "/admin",
    component: () => import("/src/layouts/MainLayout.vue"),
    meta: {
      middlewares: [admin],
    },
    children: [
      {
        path: "",
        component: () => import("src/pages/Admin/AdminPage.vue"),
      },
      {
        path: "/catalogos",
        component: () => import("src/pages/Catalogos/IndexPage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [auth],
    },
    children: [
      { path: "", component: () => import("pages/HomePage.vue") },
      {
        path: "/vehicle",
        component: () => import("src/pages/Vehicle/VehiclePage.vue"),
      },
      {
        path: "/customer",
        component: () => import("src/pages/Customer/CustomerPage.vue"),
      },
      {
        path: "/profile",
        component: () => import("src/pages/Employee/ProfilePage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [gerente],
    },
    children: [
      {
        path: "/target",
        component: () => import("src/pages/Target/TargetPage.vue"),
      },
      {
        path: "/employee",
        component: () => import("src/pages/Employee/EmployeePage.vue"),
      },
      {
        path: "/sale",
        component: () => import("src/pages/Sale/SalePage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
