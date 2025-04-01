import apiClient from "../api";

export async function getAllProducts() {
  try{
    const response = await apiClient.get("/products");
    return response.data;
  }catch(error){
    console.error("Error al consultar los productos:",error);
    throw error;
  }
  
}

export async function getProduct(id) {
  try{
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  }catch(error){
    console.error("Error al obtener un producto",error);
    throw error;
  }
  
}

export async function createProduct(data) {
  try{
    return apiClient.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }catch(error){
    console.error("Error al crear un producto: ", error);
    throw error;
  }
  
}


export async function updateProduct(id, data) {
  try{
    const response = await apiClient.post(`/products/${id}`, data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
 catch(error){
    console.error("Error al actualizar un producto: ",error);
    throw error;
 }

}

export async function deleteProduct(id) {
  try{
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  }catch(error){
    console.error("Error al eliminar un producto: ",error);
    throw error;
  }

}
