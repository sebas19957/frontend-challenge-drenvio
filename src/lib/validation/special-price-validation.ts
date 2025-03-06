import { z } from "zod";

export const newUserFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  productId: z.string().min(1, { message: "Seleccione un producto" }),
  price: z.coerce
    .number()
    .positive({ message: "El precio debe ser mayor a 0" }),
});

export const existingUserFormSchema = z.object({
  userId: z.string().min(1, { message: "Seleccione un usuario" }),
  productId: z.string().min(1, { message: "Seleccione un producto" }),
  price: z.coerce
    .number()
    .positive({ message: "El precio debe ser mayor a 0" }),
});
