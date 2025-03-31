<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import Modal from "../../components/Modal.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import baseURLImg from "../../url";

const { products } = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "product-created",
  "product-updated",
  "product-deleted",
  "product-view",
]);

const productForm = ref({
  code: "",
  name: "",
  description: "",
  photo: null,
  categories: [],
  tariffs: [],
});

const selectedProduct = ref({
  id: null,
  code: "",
  name: "",
  description: "",
  photo: null,
  categories: [],
  tariffs: [],
});

const showModal = ref(false);
const allCategories = ref([]);

const errors = ref({
  code: "",
  name: "",
});

onMounted(async () => {
  try {
    const categories = await getAllCategories();
    allCategories.value = categories;
    addTariff(productForm.value.tariffs);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
});

function addTariff(tariffsArray) {
  tariffsArray.push({
    start_date: "",
    end_date: "",
    price: "",
  });
}

function removeTariff(tariffsArray, index) {
  tariffsArray.splice(index, 1);
}

function flattenCategories(categories, level = 0) {
  let flat = [];
  categories.forEach((cat) => {
    flat.push({ ...cat, level });
    if (cat.children && cat.children.length > 0) {
      flat = flat.concat(flattenCategories(cat.children, level + 1));
    }
  });
  return flat;
}
const flattenedCategories = computed(() => flattenCategories(allCategories.value));

// =============== CREAR PRODUCTO ===============

function handleFile(e) {
  productForm.value.photo = e.target.files[0];
}

async function onSaveProduct() {
  errors.value.code = productForm.value.code ? "" : "Falta el código";
  errors.value.name = productForm.value.name ? "" : "Falta el nombre";

  if (errors.value.code || errors.value.name) return;

  try {
    showModal.value = true;

    const formData = new FormData();
    formData.append("code", productForm.value.code);
    formData.append("name", productForm.value.name);
    formData.append("description", productForm.value.description);
    formData.append("photo", productForm.value.photo);
    productForm.value.categories.forEach((catId) => {
      formData.append("category_ids[]", catId);
      productForm.value.tariffs.forEach((tariff, index) => {
        formData.append(`tariffs[${index}][start_date]`, tariff.start_date);
        formData.append(`tariffs[${index}][end_date]`, tariff.end_date);
        formData.append(`tariffs[${index}][price]`, tariff.price);
      });
    });

    const created = await createProduct(formData);
    emit("product-created", created);

    const modalEl = document.getElementById("modal-form");
    if (!modalEl) return;
    const instance = showModal.value;
    if (instance === true) {
      showModal.value = false;
      location.reload();
    }

    productForm.value = {
      code: "",
      name: "",
      description: "",
      photo: null,
      categories: [],
      tariffs: [],
    };

    addTariff(productForm.value.tariffs);
  } catch (error) {
    console.error("Error creando producto:", error);
  }
}

// =============== EDITAR PRODUCTO ===============

function handleEditFile(e) {
  selectedProduct.value.photo = e.target.files[0];
}

function openEditModal(product) {
  selectedProduct.value = {
    id: product.id,
    code: product.code,
    name: product.name,
    description: product.description || "",
    photo: null,
    categories: product.categories ? product.categories.map((c) => c.id) : [],
    tariffs: product.tariffs ? [...product.tariffs] : [],
  };
}

async function onUpdateProduct() {
  if (!selectedProduct.value.id) return;

  try {
    showModal.value = true;
    const formData = new FormData();
    formData.append("code", selectedProduct.value.code);
    formData.append("name", selectedProduct.value.name);
    formData.append("description", selectedProduct.value.description);
    if (selectedProduct.value.photo) {
      formData.append("photo", selectedProduct.value.photo);
    }
    selectedProduct.value.categories.forEach((catId) => {
      formData.append("category_ids[]", catId);
    });
    selectedProduct.value.tariffs.forEach((tariff, index) => {
      formData.append(`tariffs[${index}][start_date]`, tariff.start_date);
      formData.append(`tariffs[${index}][end_date]`, tariff.end_date);
      formData.append(`tariffs[${index}][price]`, tariff.price);
    });

    const updated = await updateProduct(selectedProduct.value.id, formData);

    emit("product-updated", updated);

    const modalEl = document.getElementById("modal-form-edit");
    if (!modalEl) return;
    const instance = showModal.value;
    if (instance === true) {
      showModal.value = false;
      location.reload();
    }
  } catch (error) {
    console.error("Error editando producto:", error);
  }
}

// ============ ELIMINAR PRODUCTO ============
const deleteId = ref(null);

function openDeleteModal(product) {
  deleteId.value = product.id;
}

async function onDeleteProduct() {
  if (!deleteId.value) return;

  try {
    showModal.value = true;
    await deleteProduct(deleteId.value);
    emit("product-deleted", deleteId.value);

    const modalEl = document.getElementById("modal-delete");
    if (!modalEl) return;
    const instance = showModal.value;
    if (instance === true) {
      showModal.value = false;
      location.reload();
    }

    deleteId.value = null;
  } catch (error) {
    console.error("Error eliminando producto:", error);
  }
}

// ============ VER PRODUCTO ============

async function openShowModal(product) {
  try {
    showModal.value = true;
    const viewed = await getProduct(product.id);
    selectedProduct.value = {
      ...viewed,
      categories: viewed.categories,
      tariffs: viewed.tariffs ? [...viewed.tariffs] : [],
      photo: null,
    };
    emit("product-view", product.id);
  } catch (error) {
    console.error("Error al ver un producto:", error);
  }
}
</script>
<template>
  <div class="card">
    <div class="d-flex card-header pb-0 justify-content-between align-items-center">
      <h6>Productos</h6>

      <div class="m-3">
        <argon-button color="dark" data-bs-toggle="modal" data-bs-target="#modal-form"
          >Agregar Producto</argon-button
        >
      </div>
    </div>

    <!-- Modal  Agregar Producto -->

    <Modal id="modal-form" title="Agregar Producto" :showFooter="false">
      <template #body>
        <div class="card-body">
          <form @submit.prevent="onSaveProduct">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label>Código</label>
                <argon-input
                  v-model="productForm.code"
                  type="text"
                  placeholder="Código del producto"
                />
                <p v-if="errors.code" class="text-danger">{{ errors.code }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label>Nombre</label>
                <argon-input
                  v-model="productForm.name"
                  type="text"
                  placeholder="Nombre del producto"
                />
              </div>
              <div class="col-md-12 mb-3">
                <label>Foto</label>
                <argon-input
                  @change="handleFile"
                  type="file"
                  placeholder="URL de la foto"
                />
              </div>
              <div class="col-md-12 mb-3">
                <label>Categoría</label>
                <select class="form-select" v-model="productForm.categories" multiple>
                  <option
                    :value="cat.id"
                    v-for="cat in flattenedCategories"
                    :key="cat.id"
                  >
                    {{ cat.level > 0 ? "—".repeat(cat.level * 2) + " " : ""
                    }}{{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-12 mb-3">
                <label>Tarifas</label>
                <div
                  v-for="(tariff, index) in productForm.tariffs"
                  :key="index"
                  class="row mb-2"
                >
                  <div class="col-md-4">
                    <input
                      type="date"
                      class="form-control"
                      v-model="tariff.start_date"
                      placeholder="Inicio"
                    />
                  </div>
                  <div class="col-md-4">
                    <input
                      type="date"
                      class="form-control"
                      v-model="tariff.end_date"
                      placeholder="Fin"
                    />
                  </div>
                  <div class="col-md-3">
                    <input
                      type="number"
                      step="0.01"
                      class="form-control"
                      v-model="tariff.price"
                      placeholder="Precio"
                    />
                  </div>
                  <div class="col-md-1">
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="removeTariff(productForm.tariffs, index)"
                    >
                      X
                    </button>
                  </div>
                </div>
                <ArgonButton
                  type="button"
                  class="btn btn-secondary"
                  @click="addTariff(productForm.tariffs)"
                  >Agregar Tarifa</ArgonButton
                >
              </div>
              <div class="col-md-12 mb-3">
                <label>Descripción</label>
                <div class="form-floating">
                  <textarea
                    class="form-control"
                    placeholder="Descripción"
                    style="height: 100px"
                    v-model="productForm.description"
                  ></textarea>
                  <label>Descripción</label>
                </div>
              </div>
            </div>
            <div class="text-center">
              <argon-button color="success" size="lg" class="mt-4 ms-auto" type="submit">
                Guardar
              </argon-button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!--- Modal Editar Producto -->
    <Modal id="modal-form-edit" title="Editar Producto" :showFooter="false">
      <template #body>
        <div class="card-body">
          <form @submit.prevent="onUpdateProduct">
            <div class="row">
              <div class="col-md-6">
                <label>Código</label>
                <argon-input v-model="selectedProduct.code" type="text" />
              </div>
              <div class="col-md-6">
                <label>Nombre</label>
                <argon-input v-model="selectedProduct.name" type="text" />
              </div>
              <div class="col-md-12">
                <label>Foto</label>
                <argon-input type="file" @change="handleEditFile" />
              </div>
              <div class="col-md-12 mb-3">
                <label>Categoría</label>
                <select class="form-select" v-model="selectedProduct.categories" multiple>
                  <option
                    :value="cat.id"
                    v-for="cat in flattenedCategories"
                    :key="cat.id"
                  >
                    {{ cat.level > 0 ? "—".repeat(cat.level * 2) + " " : ""
                    }}{{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-12 mb-3">
                <label>Tarifas</label>
                <div
                  v-for="(tariff, index) in selectedProduct.tariffs"
                  :key="index"
                  class="row mb-2"
                >
                  <div class="col-md-4">
                    <input
                      type="date"
                      class="form-control"
                      v-model="tariff.start_date"
                      placeholder="Inicio"
                    />
                  </div>
                  <div class="col-md-4">
                    <input
                      type="date"
                      class="form-control"
                      v-model="tariff.end_date"
                      placeholder="Fin"
                    />
                  </div>
                  <div class="col-md-3">
                    <input
                      type="number"
                      step="0.01"
                      class="form-control"
                      v-model="tariff.price"
                      placeholder="Precio"
                    />
                  </div>
                  <div class="col-md-1">
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="removeTariff(selectedProduct.tariffs, index)"
                    >
                      X
                    </button>
                  </div>
                </div>
                <ArgonButton
                  type="button"
                  class="btn btn-secondary"
                  @click="addTariff(selectedProduct.tariffs)"
                  >Agregar Tarifa</ArgonButton
                >
              </div>
              <div class="col-md-12">
                <label>Descripción</label>
                <div class="form-floating">
                  <textarea
                    class="form-control"
                    style="height: 100px"
                    v-model="selectedProduct.description"
                  ></textarea>
                  <label>Descripción</label>
                </div>
              </div>
            </div>

            <div class="text-center">
              <argon-button color="success" size="lg" class="mt-4 ms-auto" type="submit">
                Guardar Cambios
              </argon-button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!--- Modal Ver Producto -->
    <Modal class="modal fade" id="modal-form-view" title="Producto" :showFooter="false">
      <template #body>
        <div class="card-body">
          <form>
            <div class="row">
              <div class="col-md-6">
                <label>Código</label>
                <argon-input v-model="selectedProduct.code" type="text" disabled="true" />
              </div>
              <div class="col-md-6">
                <label>Nombre</label>
                <argon-input v-model="selectedProduct.name" type="text" disabled="true" />
              </div>

              <div class="col-md-12">
                <label>Descripción</label>
                <div class="form-floating">
                  <textarea
                    class="form-control"
                    style="height: 100px"
                    v-model="selectedProduct.description"
                    disabled="true"
                  ></textarea>
                  <label>Descripción</label>
                </div>
              </div>

              <div class="col-md-12">
                <label>Categorías</label>
                <p class="text-secondary text-sm">
                  <span v-for="cat in selectedProduct.categories" :key="cat.id">
                    #{{ cat.name }}
                  </span>
                </p>
              </div>

              <div class="col-md-12">
                <label>Tarifas</label>
                <div v-if="selectedProduct.tariffs?.length">
                  <ul>
                    <li v-for="(tarrif, i) in selectedProduct.tariffs" :key="i">
                      {{ tarrif.start_date }} - {{ tarrif.end_date }}: {{ tarrif.price }}€
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <small>Sin tarifas</small>
                </div>
              </div>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!--- Modal Eliminar Producto -->
    <Modal id="modal-delete" title="Confirmar Eliminación" :showFooter="false">
      <template #body>
        <div class="card-body text-center">
          <p>¿Estás seguro de eliminar este producto?</p>
          <ArgonButton color="danger" class="mx-2" @click="onDeleteProduct">
            Eliminar
          </ArgonButton>
          <ArgonButton color="secondary" data-bs-dismiss="modal"> Cancelar </ArgonButton>
        </div>
      </template>
    </Modal>

    <!-- Tabla de Productos -->
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
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Categoria
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Tarifas
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
            <tr v-for="product in products" :key="product.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div></div>
                  <div class="d-flex flex-column justify-content-center">
                    <p class="text-xs text-secondary mb-0">{{ product.code }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div></div>
                  <div class="d-flex flex-column justify-content-center">
                    <span
                      v-for="cat in product.categories"
                      :key="cat.id"
                      class="badge badge-info me-1"
                    >
                      {{ cat.name }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="align-middle">
                <div v-if="product.tariffs && product.tariffs.length">
                  <div v-for="tariff in product.tariffs" :key="tariff.id" class="mb-1">
                    <small>
                      <strong>{{ tariff.price }}€</strong><br />
                      <em>{{ tariff.start_date }} - {{ tariff.end_date }}</em>
                    </small>
                  </div>
                </div>
                <div v-else>
                  <small>Sin tarifas</small>
                </div>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">{{ product.name }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">
                  {{ product.description ? product.description.slice(0, 50) : "" }}</span
                >
              </td>
              <td class="align-middle text-center">
                <img
                  :src="`${baseURLImg}/storage/${product.photo}`"
                  class="avatar avatar-sm me-3"
                  alt="user1"
                />
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ new Date(product.created_at).toLocaleDateString("es-ES") }}</span
                >
              </td>
              <td class="align-middle">
                <ArgonButton
                  color=""
                  @click="openEditModal(product)"
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
                  @click="openDeleteModal(product)"
                  ><i class="far fa-trash-alt me-2" aria-hidden="true"></i
                ></ArgonButton>
                <ArgonButton
                  href="javascript:;"
                  class="btn btn-link text-dark text-gradient px-3 mb-0"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-form-view"
                  @click="openShowModal(product)"
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
