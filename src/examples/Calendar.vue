<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "../components/Modal.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { getAllProducts } from "@/services/productService";
import { createOrder, getOrders } from "../services/orderService";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';

const props = defineProps({
  id: {
    type: String,
    default: "widget-calendar",
  },
  title: {
    type: String,
    default: "",
  },
  day: {
    type: String,
    default: "",
  },
  year: {
    type: String,
    default: "",
  },
  initialView: {
    type: String,
    default: "dayGridMonth",
  },
  events: {
    type: Array,
    default: () => [{}],
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

let calendar;

const showModal = ref(false);
const dateCalendar = ref();
const selectedProducts = ref([]);
const allProducts = ref([]);
const units = ref(1);
const viewProducts = ref();
const showModalInfo = ref(false);
const total = ref();
const localEvents = ref([...props.events]);

function handleDateClick(info) {
  showModal.value = true;
  dateCalendar.value = info.dateStr;
}

function handleClickInfo(info) {
  showModalInfo.value = true;
  dateCalendar.value = info.event.startStr; 
  viewProducts.value = info.event.title;
  units.value = info.event.extendedProps.units;
  total.value = info.event.extendedProps.total;
}

function closeModal() {
  showModal.value = false;
  showModalInfo.value = false;
  selectedProducts.value = [];
  units.value = 1;
}

function flattenProducts(products, level = 0) {
  let flat = [];
  products.forEach((cat) => {
    flat.push({ ...cat, level });
    if (cat.children && cat.children.length > 0) {
      flat = flat.concat(flattenProducts(cat.children, level + 1));
    }
  });
  return flat;
}

const flattenedProducts = computed(() => flattenProducts(allProducts.value));

const totalCost = computed(() => {
  if (!dateCalendar.value) return "0.00";
  const orderDate = new Date(dateCalendar.value);
  let total = 0;
  selectedProducts.value.forEach((productId) => {
    const product = flattenedProducts.value.find((p) => p.id === productId);
    if (product && product.tariffs && product.tariffs.length > 0) {
      const applicableTariff = product.tariffs.find((tariff) => {
        const start = new Date(tariff.start_date);
        const end = new Date(tariff.end_date);
        return start <= orderDate && orderDate <= end;
      });
      if (applicableTariff) {
        total += units.value * applicableTariff.price;
      }
    }
  });
  return total.toFixed(2);
});

async function onSaveOrder() {
  const productNames = selectedProducts.value
    .map((productId) => {
      const prod = flattenedProducts.value.find((p) => p.id === productId);
      return prod ? prod.name : "";
    })
    .join(", ");

  const newEvent = {
    title: productNames ? `Pedido: ${productNames}` : "Nuevo Pedido",
    start: dateCalendar.value,
    extendedProps: {
      products: selectedProducts.value,
      units: units.value,
      total: totalCost.value,
    },
  };

  const orderData = {
    order_date: dateCalendar.value,
    products: selectedProducts.value,
    units: units.value,
    total: totalCost.value,
  };

  try {
    await createOrder(orderData);
    calendar.addEvent(newEvent);

    closeModal();
  } catch (error) {
    console.error("Error al guardar el pedido:", error);
  }
}

onMounted(async () => {
  try {
    const products = await getAllProducts();
    const orders = await getOrders();
    allProducts.value = products;
    localEvents.value = orders.map(order => {
    const totalUnits = order.products.reduce((acc, p) => {
      return acc + (p.pivot?.units || 0);
    }, 0);


    const productNames = order.products.map(p => p.name).join(", ");

    return {
      title: `Pedido: ${productNames}`,
      start: order.order_date,
      extendedProps: {
        products: order.products,
        units: totalUnits,
        total: order.total
      }
    };
  });

  } catch (error) {
    console.error("Error al obtener Productos:", error);
  }
  calendar = new Calendar(document.getElementById(props.id), {
    contentHeight: "auto",
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: props.initialView,
    dateClick: handleDateClick,
    eventClick: handleClickInfo,
    selectable: props.selectable,
    editable: props.editable,
    events: localEvents.value,
    initialDate: props.initialDate,
    headerToolbar: {
      start: "title",
      center: "",
      end: "today prev,next",
    },
    views: {
      month: {
        titleFormat: {
          month: "long",
          year: "numeric",
        },
      },
      agendaWeek: {
        titleFormat: {
          month: "long",
          year: "numeric",
          day: "numeric",
        },
      },
      agendaDay: {
        titleFormat: {
          month: "short",
          year: "numeric",
          day: "numeric",
        },
      },
    },
  });

  calendar.render();
});

onBeforeUnmount(() => {
  if (calendar) {
    calendar.destroy();
  }
});

function downloadPDF() {
  const doc = new jsPDF();
  doc.text("Información PDF", 10, 20);

  localEvents.value.forEach((evento, index) => {
    doc.text(
    `${evento.title} - ${evento.start} - Unidades: ${evento.extendedProps.units} - Precio: $${evento.extendedProps.total}`,
    10,
    30 + index * 10
  );
   });

  doc.save("informacion.pdf");
}

function downloadExcel() {
  const data = localEvents.value.map(evento => ({
    "Título": evento.title,
    "Fecha": evento.start,
    "Unidades": evento.extendedProps.units,
    "Precio": evento.extendedProps.total
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "informacion.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


</script>
<template>
  <div class="py-4 container-fluid">
  <div class="d-flex card-header pb-0 justify-content-between"  style="    
    border: 0 solid rgba(0, 0, 0, 0.125);
    border-radius: 1rem;">
    <h6 class="mt-3">Calendario</h6>

    <div class="d-flex align-items-end" >
      <div class="m-3">
        <argon-button color="danger" @click="downloadPDF">Descargar Información PDF  <i class="mr-3 fas fa-file-pdf"></i></argon-button>
      </div>
      <div class="m-3 align-items-end" @click="downloadExcel">
        <argon-button color="success">Descargar Información XLS <i class="fas fa-file-excel"></i></argon-button>
      </div>
    </div>
  </div>
  <div style="margin-top: -8px !important;
  padding-right: 1.5rem !important;
    padding-left: 1.5rem !important;
    margin-right: auto;
    margin-left: auto;" id="calendar"></div>
</div>
  <!-- Modal Agregar Pedido-->
  <Modal
    id="modal-form"
    :class="{ show: showModal }"
    :style="{
      'background-color': 'rgba(0, 0, 0, .5)',
      display: showModal ? 'block' : 'none',
    }"
    title="Agregar Pedido"
    :showFooter="false"
    @click.self="closeModal"
  >
    <template #body>
      <div class="card-body">
        <form @submit.prevent="onSaveOrder">
          <div class="row">
            <div class="col-md-12 mb-3">
              <label>Fecha del pedido</label>
              <argon-input v-model="dateCalendar" type="date" disabled="true" />
            </div>
            <div class="col-md-12 mb-3">
              <label>Producto a comprar</label>

              <select class="form-select" v-model="selectedProducts" multiple>
                <option :value="cat.id" v-for="cat in flattenedProducts" :key="cat.id">
                  {{ cat.level > 0 ? "—".repeat(cat.level * 2) + " " : "" }}{{ cat.name }}
                </option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label>Unidades a comprar</label>
              <argon-input type="number" v-model.number="units" />
            </div>
            <div class="col-md-6 mb-3">
              <label>Total</label>
              <argon-input type="text"   v-model="totalCost" disabled="true"> </argon-input>
            </div>
          </div>
          <div class="text-center">
            <ArgonButton color="success" size="lg" class="mt-4 ms-auto" type="submit">
              Guardar
            </ArgonButton>
          </div>
        </form>
      </div>
    </template>
  </Modal>

  <!-- Ver Pedido -->
  <Modal
    id="modal-form"
    :class="{ show: showModalInfo }"
    :style="{
      'background-color': 'rgba(0, 0, 0, .5)',
      display: showModalInfo ? 'block' : 'none',
    }"
    title="Pedido"
    :showFooter="false"
    @click.self="closeModal"
  >
    <template #body>
      <div class="card-body">
        <form>
          <div class="row">
            <div class="col-md-12 mb-3">
              <label>Fecha del pedido</label>
              <argon-input v-model="dateCalendar" type="text" disabled="true" />
            </div>
            <div class="col-md-12 mb-3">
              <label>Producto a comprar</label>
              <textarea
                class="form-control col-md-12 mb-3"
                v-model="viewProducts"
                disabled="true"
              ></textarea>
            </div>
            <div class="col-md-6 mb-3">
              <label>Unidades a comprar</label>
              <argon-input type="number" v-model.number="units" disabled="true" />
            </div>
            <div class="col-md-6 mb-3">
              <label>Total</label>
              <argon-input type="text" v-model="total" disabled="true"> </argon-input>
            </div>
          </div>
          <div class="text-center">
            <ArgonButton
              color="danger"
              size="lg"
              class="mt-4 ms-auto"
              type="submit"
              @click="closeModal"
            >
              Cerrar
            </ArgonButton>
          </div>
        </form>
      </div>
    </template>
  </Modal>

  <div class="card widget-calendar">
    <div class="p-3 pb-0 card-header">
      <h6 class="mb-0">{{ props.title }}</h6>
      <div class="d-flex">
        <div class="mb-0 text-sm p font-weight-bold widget-calendar-day">
          {{ props.day }}
        </div>
        <div class="mb-1 text-sm p font-weight-bold widget-calendar-year">
          {{ props.year }}
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <div :id="props.id" data-toggle="widget-calendar"></div>
    </div>
  </div>
</template>
