<script setup>
import { ref, onMounted } from "vue";
import AuthorsTable from "../components/AuthorsTable.vue";
import { getAllProducts } from "@/services/productService";
const products = ref([]);

onMounted(async () => {
  products.value = await getAllProducts();
});

function onProductCreated(newProduct) {
    products.value.push(newProduct);
}

function onProductUpdated(updatedProduct) {
  const index = products.value.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products.value[index] = updatedProduct;
  }
}

</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <authors-table 
        :products="products"
        @product-created="onProductCreated"
        @product-updated="onProductUpdated" />
      </div>
    </div>

  </div>
</template>
