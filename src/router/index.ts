import { createRouter, createWebHistory } from "vue-router";
import AppRouter from "@/modules/App/AppRouter.vue";
import HomeView from "@/modules/Home/HomeView.vue";
import AppMenu from "@/modules/App/AppMenu.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      components: {
        default: AppRouter,
        menu: AppMenu,
      },
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "about",
          name: "about",
          component: () => import("@/modules/Home/AboutView.vue"),
        },
      ],
    },
  ],
});

export default router;
