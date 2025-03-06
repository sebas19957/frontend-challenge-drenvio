import axios from "axios";
import { handleApiError } from "./error-handler";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de respuesta global
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const apiError = handleApiError(error);

    switch (apiError.status) {
      case 404:
        console.error("Recurso no encontrado");
        break;
      case 500:
        console.error("Error interno del servidor");
        break;
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
