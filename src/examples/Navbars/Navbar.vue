<script setup>
/* eslint-disable no-unused-vars */

import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Breadcrumbs from "../Breadcrumbs.vue";
import { logout } from "../../services/authService";
import ArgonButton from '@/components/ArgonButton.vue';

const showMenu = ref(false);
const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const route = useRoute();


const currentRouteName = computed(() => {
  return route.name;
});
const currentDirectory = computed(() => {
  let dir = route.path.split("/")[1];
  return dir.charAt(0).toUpperCase() + dir.slice(1);
});

const minimizeSidebar = () => store.commit("sidebarMinimize");
const toggleConfigurator = () => store.commit("toggleConfigurator");

const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};
</script>
<template>
  <nav
    class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs
        :current-page="currentRouteName"
        :current-directory="currentDirectory"
      />

      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >

        </div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <router-link
              :to="{ name: 'Signin' }"
              class="px-0 nav-link font-weight-bold text-white"
              target="_blank"
            >
          </router-link>

              <ArgonButton
              color="white"
              @click="logout()">
            Cerrar sesión
            </ArgonButton>
            
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
