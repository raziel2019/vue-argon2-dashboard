import apiClient from "../api";

export async function  getAllCategories(){
  try{
    const response = await apiClient.get("/categories");
    return response.data;
  }catch(error){
    console.error("Error al obtener las categorias: ",error);
    throw error;
  }
}

export async function getCategory(id){
  try{
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  }catch(error){
    console.error("Error al obtener la categoria: ", error);
    throw error;
  }

}

export async function createCategory(data) {
  try{
    return apiClient.post("/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });   
  }catch(error){
    console.error("Error al crear una categoria: ",error);
    throw error;
    }
  }

export async function updateCategory(id,data){
  try {
    const response = await apiClient.post(`/categories/${id}`,data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });   
    return response.data;
  }catch(error){
    console.error("Error al editar una categoria: ", error);
    throw error;
  }
}

export async function deleteCategory(id){
  try{
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }catch(error){
    console.error("Error al crear una categoria: ",error);
    throw error;
  }
    
}