<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
defineProps({
  card: {
    type: Object,
    required: true,
    title: String,
    description: String,
    links: {
      type: Array,
      label: String,
      route: String,
      color: String,
    },
  },
});
</script>
<template>
  <div
    v-show="layout !== 'landing'"
    class="card card-plain shadow-none"
    id="sidenavCard"
  >
    <div class="p-3 card-body text-center w-100 pt-0">


    </div>

    <a
      v-if="isRTL"
      href="https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/"
      target="_blank"
      class="mb-3 btn btn-dark btn-sm w-100"
    >
      توثيق
    </a>



    
  </div>
</template>
