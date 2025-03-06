// Interfaz genérica para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Ejemplo de tipo de error de API
export interface ApiError {
  code: string;
  message: string;
}
