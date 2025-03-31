<script setup>

import { ref, onMounted } from 'vue';
import CategoryTable from '../components/CategoryTable.vue';
import { getAllCategories } from '@/services/categoryService';
const categories = ref([]);

onMounted(async () => {
    const catResult = await getAllCategories();
    categories.value = catResult;
})

function onCategoryUpdated(updatedCategory) {
  const index = categories.value.findIndex(p => p.id === updatedCategory.id);
  if (index !== -1) {
    categories.value[index] = updatedCategory;
  }
}

function onCategoryCreated(newCategory){
    categories.value.push(newCategory);
}

</script>

<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <CategoryTable 
                :categories="categories"
                @category-created="onCategoryCreated"
                @category-updated="onCategoryUpdated"
               />
                </div>
            </div>
        </div>
</template>