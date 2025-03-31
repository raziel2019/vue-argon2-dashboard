import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import ProductList from "../views/products/ProductList.vue";
import CategoryList from "../views/categories/CategoryList.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
  },
  {
    path: "/products",
    name: "ProductList",
    component: ProductList,
  },
  {
    path: "/calendar",
    name: "calendar",
    component: Dashboard,
  },

  {
    path: "/categories",
    name: "CategoryList",
    component: CategoryList,
  },
  
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const publicPaths = ["/signin", "/signup"];
  const authRequired = !publicPaths.includes(to.path);
  const loggedIn = sessionStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/signin");
  }
  next();
});

export default router;
