import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Product } from "@/types/products";
import { ApiError, handleApiError } from "@/services/api/error-handler";
import { specialPriceRepository } from "@/services/repositories/special-price-repository";
import { productsRepository } from "../repositories/product";
import {
  CreateSpecialPrice,
  SpecialPrice,
  SpecialPriceProduct,
  UpdateSpecialPrice,
} from "@/types/special-price";

// Hook genérico para peticiones GET con manejo de nulidad
export function useApiGet<T>(
  key: () => string | null,
  fetcher: (id: string) => Promise<T>,
  options?: {
    revalidateOnFocus?: boolean;
    refreshInterval?: number;
  }
) {
  const swrKey = key();
  const { data, error, mutate, isValidating } = useSWR<T, ApiError>(
    swrKey,
    swrKey ? () => fetcher(swrKey) : null,
    {
      revalidateOnFocus: options?.revalidateOnFocus ?? false,
      refreshInterval: options?.refreshInterval ?? 0,
    }
  );

  // Función de refetch manual
  const refetch = () => {
    return mutate();
  };

  return {
    data,
    isLoading: swrKey && !error && !data,
    isError: error,
    isValidating,
    refetch,
    mutate,
  };
}

// Hooks para Products con refetch
export function useProducts(options?: {
  revalidateOnFocus?: boolean;
  refreshInterval?: number;
}) {
  return useApiGet<Product[]>(
    () => "products",
    () => productsRepository.getAll(),
    options
  );
}

export function useProductById(
  id: string | null,
  options?: {
    revalidateOnFocus?: boolean;
    refreshInterval?: number;
  }
) {
  return useApiGet<Product>(
    () => (id ? `products/${id}` : null),
    (validId) => productsRepository.getById(validId),
    options
  );
}

// Hooks para Special Prices - GET
export function useSpecialPrices(options?: {
  revalidateOnFocus?: boolean;
  refreshInterval?: number;
}) {
  return useApiGet<SpecialPrice[]>(
    () => "special-prices",
    () => specialPriceRepository.getAll(),
    options
  );
}

export function useSpecialPriceById(
  id: string | null,
  options?: {
    revalidateOnFocus?: boolean;
    refreshInterval?: number;
  }
) {
  return useApiGet<SpecialPrice>(
    () => (id ? `special-prices/${id}` : null),
    (validId) => specialPriceRepository.getById(validId),
    options
  );
}

// Hooks de mutación para Special Prices
export function useSpecialPriceMutations() {
  // Crear precio especial
  const { trigger: createSpecialPrice, isMutating: isCreating } =
    useSWRMutation(
      "special-prices/create",
      async (_, { arg }: { arg: CreateSpecialPrice }) => {
        try {
          return await specialPriceRepository.create(arg);
        } catch (error) {
          throw handleApiError(error);
        }
      }
    );

  // Actualizar precio especial
  const { trigger: updateSpecialPrice, isMutating: isUpdating } =
    useSWRMutation(
      "special-prices/update",
      async (
        _,
        { arg }: { arg: { id: string; data: Omit<SpecialPriceProduct, "_id"> } }
      ) => {
        try {
          return await specialPriceRepository.update(arg.id, arg.data);
        } catch (error) {
          throw handleApiError(error);
        }
      }
    );

  // Agregar producto a precio especial
  const { trigger: addProductToSpecialPrice, isMutating: isAddingProduct } =
    useSWRMutation(
      "special-prices/add-product",
      async (_, { arg }: { arg: UpdateSpecialPrice }) => {
        try {
          return await specialPriceRepository.addProductSpecialPrice(arg);
        } catch (error) {
          throw handleApiError(error);
        }
      }
    );

  // Eliminar precio especial
  const { trigger: deleteSpecialPrice, isMutating: isDeleting } =
    useSWRMutation(
      "special-prices/delete",
      async (_, { arg }: { arg: string }) => {
        try {
          await specialPriceRepository.deleteSpecialPrice(arg);
        } catch (error) {
          throw handleApiError(error);
        }
      }
    );

  // Eliminar producto de precio especial
  const {
    trigger: deleteProductFromSpecialPrice,
    isMutating: isDeletingProduct,
  } = useSWRMutation(
    "special-prices/delete-product",
    async (
      _,
      {
        arg,
      }: {
        arg: { id: string; productId: string };
      }
    ) => {
      try {
        return await specialPriceRepository.deleteProductSpecialPrice(
          arg.id,
          arg.productId
        );
      } catch (error) {
        throw handleApiError(error);
      }
    }
  );

  return {
    createSpecialPrice,
    updateSpecialPrice,
    addProductToSpecialPrice,
    deleteSpecialPrice,
    deleteProductFromSpecialPrice,
    isCreating,
    isUpdating,
    isAddingProduct,
    isDeleting,
    isDeletingProduct,
  };
}
