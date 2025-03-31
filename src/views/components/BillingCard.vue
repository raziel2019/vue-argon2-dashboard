<script setup>
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
</script>
<template>
  <div class="card mt-4">
    <div class="d-flex card-header pb-0 justify-content-between align-items-center">
      <h6>Categorias</h6>
      <div class="m-3">
        <argon-button
          to="/products/add"
          color="dark"
          data-bs-toggle="modal"
          data-bs-target="#modal-form"
          >Agregar Categoria</argon-button
        >
      </div>
    </div>

    <!-- Modal  Agregar Categoria -->
    <div class="col-md-4">
      <div
        class="modal fade"
        id="modal-form"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modal-form"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
            <div class="modal-body p-0">
              <div class="card card-plain">
                <div class="card-header d-flex align-items-center justify-content-between pb-0">
                  <h3 class="font-weight-bolder">Agregar Categoria</h3>
                  <ArgonButton style="box-shadow:none" color="none" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times me-2" aria-hidden="true"></i>
                  </ArgonButton> 
                </div>
                  <p class="container-fluid mb-0">
                    Introduzca su correo electrónico y contraseña para iniciar sesión
                  </p>
               
                <div class="card-body">
                  <form role="form text-left">
                    <div class="row">
                      <div class="col-md-6">
                        <label for="example-text-input" class="form-control-label"
                          >Codigo</label
                        >
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
                          <textarea
                            class="form-control"
                            placeholder="Leave a comment here"
                            id="floatingTextarea2"
                            style="height: 100px"
                          ></textarea>
                          <label for="floatingTextarea2">Agregar descripción</label>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <argon-button color="success" size="lg" class="mt-4 ms-auto"
                        >Guardar</argon-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--- Modal Editar Categoria -->
    <div class="col-md-4">
      <div
        class="modal fade"
        id="modal-form-edit"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modal-form-edit"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
            <div class="modal-body p-0">
              <div class="card card-plain">
                <div
                  class="card-header d-flex align-items-center justify-content-between pb-0"
                >
                  <h3 class="font-weight-bolder">Editar Categoria</h3>
                  <ArgonButton style="box-shadow:none" color="none" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times me-2" aria-hidden="true"></i>
                  </ArgonButton> 
                </div>
                <p class="container-fluid body mb-0">
                  Formulario para editar Categorias existentes
                </p>

                <div class="card-body">
                  <form role="form text-left">
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
                          <textarea
                            class="form-control"
                            placeholder="Leave a comment here"
                            id="floatingTextarea2"
                            style="height: 100px"
                          ></textarea>
                          <label for="floatingTextarea2">Agregar descripción</label>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <argon-button color="success" size="lg" class="mt-4 ms-auto"
                        >Guardar</argon-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--- Modal Ver Categoria -->
    <div class="col-md-4">
      <div
        class="modal fade"
        id="modal-form-view"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modal-form-view"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
            <div class="modal-body p-0">
              <div class="card card-plain">
                <div
                  class="card-header d-flex align-items-center justify-content-between pb-0"
                >
                  <h3 class="font-weight-bolder">Vista Categoria</h3>
                  <ArgonButton style="box-shadow:none" color="none" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times me-2" aria-hidden="true"></i>
                  </ArgonButton> 
                </div>

                <div class="card-body">
                  <form role="form text-left">
                    <div class="row">
                      <div class="col-md-6">
                        <label for="example-text-input" class="form-control-label"
                          >Codigo</label
                        >
                      </div>
                      <div class="col-md-6">
                        <label for="example-text-input" class="form-control-label"
                          >Nombre</label
                        >
                      </div>
                      <div class="col-md-6">
                        <label for="example-text-input" class="form-control-label"
                          >Photo</label
                        >
                      </div>
                      <div class="col-md-6">
                        <label for="example-text-input" class="form-control-label"
                          >Categoria</label
                        >
                      </div>

                      <div class="col-md-12">
                        <label for="example-text-input" class="form-control-label"
                          >Descripción</label
                        >
                        <div class="form-floating"></div>
                      </div>
                    </div>
                    <div class="text-center">
                      <argon-button color="success" size="lg" class="mt-4 ms-auto"
                        >Cerrar</argon-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--- Modal Eliminar Categoria -->
    <div class="col-md-4">
      <div
        class="modal fade"
        id="modal-delete"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modal-delete"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-danger modal-dialog-centered modal-"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
              <h6 class="modal-title" id="modal-title-notification">
                Tu atención es requerida
              </h6>
             <ArgonButton style="box-shadow:none" color="none" data-bs-dismiss="modal" aria-label="Close">
             <i class="fas fa-times me-2" aria-hidden="true"></i>
             </ArgonButton> 
            </div>
            <div class="modal-body">
              <div class="py-3 text-center">

                <h4 class="text-gradient text-danger mt-4">¿Estas de acuerdo con eliminar este Categoria?</h4>
                
              </div>
            </div>
            <div class="modal-footer">
              <ArgonButton type="button" class="btn btn-danger text-white">Eliminar</ArgonButton>
              <ArgonButton
                type="button"
                class="btn btn-white text-dark ml-auto"
                data-bs-dismiss="modal"
              >
                Cerrar
              </ArgonButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Codigo
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Nombre
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                Descripcion
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Photo
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Fecha de Creación
              </th>

              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div></div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">John Michael</h6>
                    <p class="text-xs text-secondary mb-0">john@creative-tim.com</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">Manager</p>
                <p class="text-xs text-secondary mb-0">Organization</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">Online</span>
              </td>
              <td class="align-middle text-center">
                <img
                  src="../../assets/img/team-2.jpg"
                  class="avatar avatar-sm me-3"
                  alt="user1"
                />
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">23/04/18</span>
              </td>
              <td class="align-middle">
                <ArgonButton
                  color=""
                  href="javascript:;"
                  class="btn btn-link text-blue px-3 mb-0"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-form-edit"
                  ><i class="fas fa-pencil-alt me-2" aria-hidden="true"></i>
                </ArgonButton>
                <ArgonButton
                  href="javascript:;"
                  class="btn btn-link text-danger text-gradient px-3 mb-0"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-delete"
                  ><i class="far fa-trash-alt me-2" aria-hidden="true"></i
                ></ArgonButton>
                <ArgonButton
                  href="javascript:;"
                  class="btn btn-link text-dark text-gradient px-3 mb-0"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-form-view"
                  ><i class="far fa-eye me-2" aria-hidden="true"></i
                ></ArgonButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
