<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";

import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { useRouter } from "vue-router";
import { register as registerRequest } from "../services/authService";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();


async function registerUser() {
  errorMessage.value = "";
  try {
   await registerRequest({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    router.push({ name: "Signin" });
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Error de registro. Inténtalo nuevamente.";
    }
  }
}

</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg&quot;);
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Welcome!</h1>
            <p class="text-lead text-white">
              Use these awesome forms to login or create new account in your
              project for free.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>Register with</h5>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="registerUser">
                <argon-input
                  v-model="name"
                  id="name"
                  type="text"
                  placeholder="Name"
                  aria-label="Name"
                />
                <argon-input
                  v-model="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                />
                <argon-input
                  v-model="password"
                  id="password"
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                />

                <div v-if="errorMessage" class="text-danger mt-2">
                  {{ errorMessage }}
                </div>

                <div class="text-center">
                  <argon-button
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                    >Sign up</argon-button
                  >
                </div>
                <p class="text-sm mt-3 mb-0">
                  Already have an account?
                  <router-link to="/signin" class="text-dark font-weight-bolder">
                  </router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
