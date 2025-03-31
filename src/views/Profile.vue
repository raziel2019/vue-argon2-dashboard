<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
});
onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});
onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
</script>
<template>
  <main>

    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <h3 class="mb-0">Agregar Producto</h3>

              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm fw-bold">Información del Producto</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Codigo</label
                  >
                  <argon-input type="text" value="lucky.jesse" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Nombre</label
                  >
                  <argon-input type="text" value="lucky.jesse" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Photo</label
                  >
                  <argon-input type="file" value="lucky.jesse" />
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Categoria</label
                  >
                    <select class="form-select" aria-label="Default select example">
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  </div>
           
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label"
                    >Descripción</label
                  >
                  <div class="form-floating">
                  <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                  <label for="floatingTextarea2">Agregar descripción</label>
                </div> 
                
                </div>

              </div>
              <hr class="horizontal dark" />
              
              <div class="d-flex">
                <argon-button color="success" size="sm" class="ms-auto"
                  >Guardar</argon-button
                >
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
