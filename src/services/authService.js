import apiClient from "@/api";
import router from "../router";

export const login = async (data) => {
  try {
    const response = await apiClient.post('/login', data);
    sessionStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }catch(error){
    console.error("Error al hacer login: ", error);
    throw error;
  }

};

export const register = async (data) => {
  try{
    const response = await apiClient.post('/register', data);
    return response.data;
  }catch(error){
    console.error("Error en el registro: ",error);
    throw error;
  }

};

export async function logout(){
  try{
    const response = await apiClient.post('/logout');
    sessionStorage.removeItem('user');
    router.push({ name: "Signin" });

    return response.data;
  }catch(error){
    console.error("Error al hacer logout", error);
  }

}
