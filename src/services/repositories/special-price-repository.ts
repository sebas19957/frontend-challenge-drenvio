import apiClient from "@/services/api/axios-instance";
import {
  CreateSpecialPrice,
  SpecialPrice,
  SpecialPriceProduct,
  UpdateSpecialPrice,
} from "@/types/special-price";
import { ApiResponse } from "@/services/types/api-responses";

export const specialPriceRepository = {
  // Obtener todos los precios especiales
  async getAll(): Promise<SpecialPrice[]> {
    const response = await apiClient.get<ApiResponse<SpecialPrice[]>>(
      "/special-prices"
    );
    return response.data.data;
  },

  // Obtener un precio especial por ID
  async getById(id: string): Promise<SpecialPrice> {
    const response = await apiClient.get<ApiResponse<SpecialPrice>>(
      `/special-prices/${id}`
    );
    return response.data.data;
  },

  // Crear un nuevo precio especial
  async create(data: CreateSpecialPrice): Promise<ApiResponse<SpecialPrice>> {
    const response = await apiClient.post<ApiResponse<SpecialPrice>>(
      "/special-prices",
      data
    );
    return response.data;
  },

  // Agregar producto a un precio especial creado
  async addProductSpecialPrice(
    data: UpdateSpecialPrice
  ): Promise<ApiResponse<SpecialPrice>> {
    const response = await apiClient.put<ApiResponse<SpecialPrice>>(
      `/special-prices/add-special-price`,
      data
    );
    return response.data;
  },

  // Actualizar un precio especial
  async update(
    id: string,
    data: Omit<SpecialPriceProduct, "_id">
  ): Promise<ApiResponse<SpecialPrice>> {
    const response = await apiClient.put<ApiResponse<SpecialPrice>>(
      `/special-prices/${id}`,
      data
    );
    return response.data;
  },

  // Eliminar un precio especial
  async deleteSpecialPrice(id: string): Promise<void> {
    await apiClient.delete(`/special-prices/${id}`);
  },

  // Eliminar un precio especial
  async deleteProductSpecialPrice(
    id: string,
    productId: string
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(
      `/special-prices/delete-product-special-price/${id}?productId=${productId}`,
      { data: { productId } }
    );
    return response.data;
  },
};
