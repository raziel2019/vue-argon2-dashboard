import apiClient from "../api";

export async function getOrders() {
  try {
    const response = await apiClient.get(`/orders`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    throw error;
  }
}


export async function createOrder(data){
    try {
        const response = await apiClient.post(`/orders`, data);
        return response.data;
      } catch (error) {
        console.error("Error al guardar el pedido:", error);
        throw error;
      }
  }