import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import AppRouter from "@/modules/App/AppRouter.vue";
import HomeView from "@/modules/Home/HomeView.vue";
import AppMenu from "@/modules/App/AppMenu.vue";
import CreateUser from "@/modules/Forms/CreateUser.vue";
import UserList from "@/modules/UserPosts/UserList.vue";
import UserPosts from "@/modules/UserPosts/UserPosts.vue";

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
          path: "create-user",
          name: "createUser",
          component: CreateUser,
        },
        {
          path: "users",
          name: "users",
          component: UserList,
          meta: {
            store: async () => {
              const store = useUserStore();
              if (!store.users.length) {
                await store.getUsers();
              }
            },
          },
        },
        {
          path: "users/:userId",
          name: "user",
          component: UserPosts,
          meta: {
            store: async ({ userId }) => {
              const id = Number(userId);
              const store = useUserStore();
              await Promise.all([store.getUser(id), store.getPosts(id)]);
            },
          },
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

router.beforeEach(async (to, from, next) => {
  if (to.meta.store) {
    await to.meta.store(to.params);
  }
  next();
});

export default router;
