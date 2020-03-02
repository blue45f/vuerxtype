import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Main",
    component: (): any =>
      import(/* webpackChunkName: "Main" */ "@/views/Main.vue")
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: (): any =>
      import(/* webpackChunkName: "Accounts" */ "@/views/Accounts.vue")
  },
  {
    path: "/confirmation",
    name: "Confirmation",
    component: (): any =>
      import(/* webpackChunkName: "Confirmation" */ "@/views/Confirmation.vue")
  }
];

export const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
});

export default router;
