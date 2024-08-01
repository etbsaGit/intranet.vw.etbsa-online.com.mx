import { guest, auth } from "./middleware";

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
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [auth],
    },
    children: [
      { path: "", component: () => import("pages/HomePage.vue") },
      {
        path: "/catalogos",
        component: () => import("src/pages/Catalogos/IndexPage.vue"),
      },
      {
        path: "/vehicle",
        component: () => import("src/pages/Vehicle/VehiclePage.vue"),
      },
      {
        path: "/customer",
        component: () => import("src/pages/Customer/CustomerPage.vue"),
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
