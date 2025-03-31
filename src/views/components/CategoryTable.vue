<script setup>
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import Modal from "../../components/Modal.vue";
import { computed, ref } from "vue";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory
} from "@/services/categoryService";
import baseURLImg from "../../url";

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["category-created","category-deleted","category-updated"]);

const categoryForm = ref({
  code: "",
  name: "",
  description: "",
  photo: null,
  parent_id: null,
});

const selectedCategory = ref({
  id: null,
  code: "",
  name: "",
  description: "",
  photo: null,
  parent_id: null,
});

const errors = ref({
  code: "",
  name: "",
  description: "",
  photo: "",
  parentId: "",
});

const showModal = ref(false);
const deleteId = ref(null);

function flattenCategories(categories, level = 0) {
  const result = [];
  const stack = categories.map(cat => ({ ...cat, level }));

  while (stack.length) {
    const current = stack.pop();
    result.push(current);
    if (current.children && current.children.length) {
      for (let i = current.children.length - 1; i >= 0; i--) {
        stack.push({ ...current.children[i], level: current.level + 1 });
      }
    }
  }

  return result;
}
const flatCategories = computed(() => flattenCategories(props.categories));


function buildCategoryOptions(categories, level = 0) {
  const options = [];

  categories.forEach(cat => {
    options.push({
      value: cat.id,
      label: `${'—'.repeat(level * 2)} ${cat.name}`,
    });

    if (cat.children && cat.children.length > 0) {
      options.push(...buildCategoryOptions(cat.children, level + 1));
    }
  });

  return options;
}


const options = computed(() => buildCategoryOptions(props.categories));



// =============== CREAR CATEGORIA ===============

function handleFile(e) {
  categoryForm.value.photo = e.target.files[0];
}

function resetCreateForm() {
  categoryForm.value = {
    code: "",
    name: "",
    description: "",
    photo: null,
    parent_id: null,
  };
}


async function onSaveCategory(){

  errors.value.code = categoryForm.value.code ? "" : "Falta el código";
  errors.value.name = categoryForm.value.name ? "" : "Falta el nombre";
  errors.value.description = categoryForm.value.description ? "" : "Falta la descripción";
  errors.value.photo = categoryForm.value.photo ? "" : "Falta la foto";
  errors.value.parentId = categoryForm.value.parentId ? "" : "Falta el id padre";



  if (errors.value.code || errors.value.name || errors.value.description|| errors.value.photo || errors.value.parentId) {
    return; 
  }

  try{
    showModal.value = true;

    const formData = new FormData();

    formData.append("code", categoryForm.value.code);
    formData.append("name", categoryForm.value.name);
    formData.append("description", categoryForm.value.description);
    if (categoryForm.value.photo) {
      formData.append("photo", categoryForm.value.photo);
    }
    if (categoryForm.value.parent_id) {
      formData.append("parent_id", categoryForm.value.parent_id);
    }

    const created = await createCategory(formData);
    emit("category-created", created);

    const modalEl = document.getElementById("modal-form");
    if (!modalEl) return;
    const instance = showModal.value;
    if (instance === true) {
      showModal.value = false;
      location.reload();
    }
    resetCreateForm();

  }catch(error){
    console.error("Error creando una categoria:", error);
  }
}

// =============== ACTUALIZAR CATEGORIA ===============
function handleEditFile(e) {
  selectedCategory.value.photo = e.target.files[0];
}

function openEditModal(category) {
  selectedCategory.value = {
    id: category.id,
    code: category.code,
    name: category.name,
    description: category.description || "",
    photo: null,
    parent_id: category.parent_id || null,
  };
}

async function onUpdateCategory() {
  if (!selectedCategory.value.id) return;

  try {
    showModal.value = true;

    const formData = new FormData();
    formData.append("code", selectedCategory.value.code);
    formData.append("name", selectedCategory.value.name);
    formData.append("description", selectedCategory.value.description);
    if (selectedCategory.value.photo) {
      formData.append("photo", selectedCategory.value.photo);
    }
    if (selectedCategory.value.parent_id) {
      formData.append("parent_id", selectedCategory.value.parent_id);
    } else {
      formData.append("parent_id", "");
    }
    formData.append("_method", "PUT");

    const updated = await updateCategory(selectedCategory.value.id, formData);

    emit("category-updated", updated);

    const modalEl = document.getElementById("modal-form-edit");
    if (!modalEl) return;
    const instance = showModal.value;
    if (instance === true) {
      showModal.value = false;
      location.reload();
    }

  } catch (error) {
    console.error("Error editando category:", error);
  }
}

function getParentCategoryName(parentId) {
  if (!parentId) {
    return "(Sin padre)";
  }
  const found = props.categories.find((cat) => cat.id === parentId);
  return found ? found.name : `Categoria #${parentId}`;
}


// =============== VER CATEGORIA ===============

async function onShowCategory(category) {
  try {
    showModal.value = true; 
    const viewed = await  getCategory(category.id);
    selectedCategory.value = {
      id: viewed.id,
      code: viewed.code,
      name: viewed.name,
      description: viewed.description || "",
      photo: viewed.photo || null,
      parent_id: viewed.parent_id || null,
    };
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
  }
}


// =============== ELIMINAR CATEGORIA ===============

function openDeleteModal(category){
  deleteId.value  = category.id;
}

async function onDeleteCategory(){
  if(!deleteId.value) return;
    showModal.value =  true;
  try{
    await deleteCategory(deleteId.value);
    emit("category-deleted", deleteId.value);

    const modalEl = document.getElementById("modal-delete");
    if (!modalEl) return;
    const instance = showModal.value;
    if (instance === true) {
      showModal.value =false;
      location.reload();
    }

    deleteId.value = null;

  }catch(error){
    console.error("Error eliminando categoria:", error);
  }
  
}

</script>


<template>
  <div class="card mt-4">
    <div class="d-flex card-header pb-0 justify-content-between align-items-center">
      <h6>Categorias</h6>
      <div class="m-3">
      
        <argon-button
          color="dark"
          data-bs-toggle="modal"
          data-bs-target="#modal-form"
          >Agregar Categorias</argon-button
        >
      </div>
    </div>

    <!-- Modal  Agregar Categoria -->   

    <Modal
      id="modal-form"
      title="Agregar Categoria"
      :showFooter="false">
      <template #body>
        <div class="card-body">
          <form @submit.prevent="onSaveCategory" enctype='multipart/form-data'>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label>Código</label>
                <argon-input
                  v-model="categoryForm.code"
                  type="text"
                  placeholder="Código de la categoria"
                />
                <p v-if="errors.code" class="text-danger">{{ errors.code }}</p>

              </div>
              <div class="col-md-6 mb-3">
                <label>Nombre</label>
                <argon-input
                  v-model="categoryForm.name"
                  type="text"
                  placeholder="Nombre de la categoria"
                />
                <p v-if="errors.name" class="text-danger">{{ errors.name }}</p>

              </div>
              <div class="col-md-6 mb-3">
                <label>Photo</label>
                <argon-input
                  @change="handleFile"
                  type="file"
                  placeholder="URL de la foto"
                />
                <p v-if="errors.photo" class="text-danger">{{ errors.photo }}</p>

              </div>
              <div class="col-md-6 mb-3">
                <label>Categoría Padre</label>
                <select v-model="categoryForm.parentId" class="form-select">
                  <option :value="null" disabled>Selecciona una categoría padre</option>
                  <option
                    v-for="opt in options"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <p v-if="errors.parentId" class="text-danger">{{ errors.parentId }}</p>

              </div>
              <div class="col-md-12 mb-3">
                <label>Descripción</label>
                <div class="form-floating">
                  <textarea
                    class="form-control"
                    placeholder="Descripción"
                    style="height: 100px"
                    v-model="categoryForm.description"
                  ></textarea>
                  <p v-if="errors.description" class="text-danger">{{ errors.description }}</p>

                  <label>Descripción</label>
                </div>
              </div>
            </div>
            <div class="text-center">
              <argon-button
                color="success"
                size="lg"
                class="mt-4 ms-auto"
                type="submit"
              >
                Guardar
              </argon-button>
            </div>
          </form>
        </div>
      </template>


    </Modal>

    <!--- Modal Editar Categoria -->
    <Modal
      id="modal-form-edit"
      title="Editar Categoria"
      :showFooter="false"
      >

      <template #body>
        <div class="card-body">
          <form @submit.prevent="onUpdateCategory">
            <div class="row">
              <div class="col-md-6">
                <label>Código</label>
                <argon-input
                  v-model="selectedCategory.code"
                  type="text"
                />
              </div>
              <div class="col-md-6">
                <label>Nombre</label>
                <argon-input
                  v-model="selectedCategory.name"
                  type="text"
                />
              </div>
              <div class="col-md-6">
                <label>Foto</label>
                <argon-input
                  type="file"
                  @change="handleEditFile"
                />
              </div>
              <div class="col-md-6">
                <label>Categoría Padre</label>
                <select v-model="selectedCategory.parent_id" class="form-select">
                  <option :value="null">(Sin padre)</option>
                  <option
                    v-for="opt in options"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="col-md-12">
                <label>Descripción</label>
                <div class="form-floating">
                  <textarea
                    class="form-control"
                    style="height: 100px"
                    v-model="selectedCategory.description"
                  ></textarea>
                  <label>Descripción</label>
                </div>
              </div>
            </div>

            <div class="text-center">
              <argon-button
                color="success"
                size="lg"
                class="mt-4 ms-auto"
                type="submit"
              >
                Guardar Cambios
              </argon-button>
            </div>
          </form>
        </div>
      </template>

    </Modal>

    <!--- Modal Ver Categoria -->

    <Modal
        class="modal fade"
        id="modal-form-view"
        title="Categoria"
        :showFooter="false"
    >
    <template #body>
      <div class="card-body">
          <form>
            <div class="row">
              <div class="col-md-6">
                <label>Código</label>
                <argon-input
                  v-model="selectedCategory.code"
                  type="text"
                  disabled="true"
                />
              </div>
              <div class="col-md-6">
                <label>Nombre</label>
                <argon-input
                  v-model="selectedCategory.name"
                  type="text"
                  disabled="true"
                />
              </div>

              <div class="col-md-12">
                <label>Descripción</label>
                <div class="form-floating">
                  <textarea
                    class="form-control"
                    style="height: 100px"
                    v-model="selectedCategory.description"
                    disabled="true"
                  ></textarea>
                  <label>Descripción</label>
                </div>
              </div>
              <div class="col-md-12 mt-3">
              <label>Categoría Padre</label>
              <p class="text-secondary">
                {{ getParentCategoryName(selectedCategory.parent_id) }}
              </p>
            </div>

            </div>

          </form>
        </div>
    </template>
    </Modal>


    <!--- Modal Eliminar Categoria -->

    <Modal
      id="modal-delete"
      title="Confirmar Eliminación"
      :showFooter="false"
    >
      <template #body>
        <div class="card-body text-center">
          <p>¿Estás seguro de eliminar esta categoria?</p>
          <ArgonButton
            color="danger"
            class="mx-2"
            @click="onDeleteCategory"
          >
            Eliminar
          </ArgonButton>
          <ArgonButton
            color="secondary"
            data-bs-dismiss="modal"
          >
            Cancelar
          </ArgonButton>
        </div>
      </template>
    </Modal>

    <!-- Tabla de Categorias -->

    <div class="card-body px-0 pt-0 pb-2">
  <div class="table-responsive p-0">
    <table class="table align-items-center mb-0">
      <thead>
        <tr>
          <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
            Código
          </th>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
            Nombre
          </th>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
            Descripción
          </th>
          <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
            Photo
          </th>
          <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
            Fecha de Creación
          </th>
          <th class="text-secondary opacity-7"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in flatCategories" :key="category.id">
          <td>
            <div class="d-flex px-2 py-1">
              <div></div>
              <div class="d-flex flex-column justify-content-center">
                <p class="text-xs text-secondary mb-0">{{ category.code }}</p>
              </div>
            </div>
          </td>
          <td>
            <p class="text-xs font-weight-bold mb-0">
              <span v-if="category.level > 0" :style="{ marginLeft: (category.level * 20) + 'px' }"></span>
              {{ category.name }}
            </p>
          </td>
          <td class="align-middle text-center text-sm">
            <span class="badge badge-sm bg-gradient-success">{{ category.description }}</span>
          </td>
          <td class="align-middle text-center">
            <img class="avatar avatar-sm me-3" v-if="category.photo" :src="`${baseURLImg}/storage/${category.photo}`" alt="foto de la categoría" />
          </td>
          <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold">
              {{ new Date(category.created_at).toLocaleDateString('es-ES') }}
            </span>
          </td>
          <td class="align-middle">
            <ArgonButton color="" href="javascript:;" class="btn btn-link text-blue px-3 mb-0"
              data-bs-toggle="modal" data-bs-target="#modal-form-edit"
              @click="openEditModal(category)">
              <i class="fas fa-pencil-alt me-2" aria-hidden="true"></i>
            </ArgonButton>
            <ArgonButton href="javascript:;" class="btn btn-link text-danger text-gradient px-3 mb-0"
              data-bs-toggle="modal" data-bs-target="#modal-delete"
              @click="openDeleteModal(category)">
              <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
            </ArgonButton>
            <ArgonButton href="javascript:;" class="btn btn-link text-dark text-gradient px-3 mb-0"
              data-bs-toggle="modal" data-bs-target="#modal-form-view"
              @click="onShowCategory(category)">
              <i class="far fa-eye me-2" aria-hidden="true"></i>
            </ArgonButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

  </div>
</template>
