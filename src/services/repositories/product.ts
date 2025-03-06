import apiClient from "@/services/api/axios-instance";
import { Product } from "@/types/products";
import { ApiResponse } from "@/services/types/api-responses";

export const productsRepository = {
  // Obtener todos los precios especiales
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>("/products");
    return response.data.data;
  },

  // Obtener un precio especial por ID
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return response.data.data;
  },
};
