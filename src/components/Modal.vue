<script setup>
import { defineProps, defineEmits} from "vue";
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ""
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  confirmLabel: {
    type: String,
    default: "Confirmar"
  },
  cancelLabel: {
    type: String,
    default: "Cancelar"
  },
  size: {
    type: String,
    default: ""
  },
  closeOnConfirm: {
    type: Boolean,
    default: true
  }

});

const emits = defineEmits(["confirm", "cancel"]);

function onConfirm() {
  emits("confirm");
  if (props.closeOnConfirm) {
    closeModal();
  }
}

function onCancel() {
  emits("cancel");
}

function closeModal() {
  const modalEl = document.getElementById(props.id);
  if (!modalEl) return;
  const instance = window.bootstrap.Modal.getInstance(modalEl);
  if (instance) {
    instance.hide();
  }
}


</script>

<template>

<div
    class="modal fade"
    :id="id"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered"
      :class="[size]"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div v-if="showFooter" class="modal-footer">
          <!-- Cancelar -->
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="onCancel"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="onConfirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>

</template>