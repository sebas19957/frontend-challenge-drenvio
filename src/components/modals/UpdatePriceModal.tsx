"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSpecialPriceMutations } from "@/services/hooks/api-hooks";
import { AlertTriangle, Percent, Tag, User } from "lucide-react";
import { SpecialPrice } from "@/types/special-price";

interface UpdatePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialPrice: SpecialPrice | null;
  productId: string;
  refetchSpecialPrices: () => void;
}

export function UpdatePriceModal({
  isOpen,
  onClose,
  specialPrice,
  productId,
  refetchSpecialPrices,
}: UpdatePriceModalProps) {
  const { toast } = useToast();
  const { updateSpecialPrice, isUpdating } = useSpecialPriceMutations();

  const specialPriceProduct = useMemo(() => {
    if (!specialPrice || !specialPrice.products) return null;
    return specialPrice.products.find((p) => p.productId === productId);
  }, [specialPrice, productId]);

  const [newPrice, setNewPrice] = useState<string>(
    specialPriceProduct ? specialPriceProduct.specialPrice.toString() : ""
  );

  useEffect(() => {
    if (!isOpen && specialPriceProduct) {
      setNewPrice(specialPriceProduct.specialPrice.toString()); // Reset input when modal closes
    }
  }, [isOpen, specialPriceProduct]);

  if (!specialPrice || !productId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No se pudo cargar la información del precio especial. Por favor,
              inténtelo de nuevo.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!specialPriceProduct) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No se encontró el precio especial para el producto seleccionado.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => {
    return value.replace(/\./g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Solo números
    setNewPrice(formatNumber(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateSpecialPrice({
        id: specialPrice._id,
        data: {
          productId: specialPriceProduct.productId,
          specialPrice: Number(parseNumber(newPrice)), // Enviar número limpio
        },
      });
      if (result.success) {
        toast({
          variant: "success",
          title: result.message,
        });
        refetchSpecialPrices();
        onClose();
      } else {
        throw new Error("Failed to update special price");
      }
    } catch (error) {
      console.error("Error updating special price:", error);
      toast({
        variant: "destructive",
        title: "Error al actualizar el precio especial",
      });
    }
  };

  const oldPrice = specialPriceProduct.specialPrice;
  const newPriceValue = Number(parseNumber(newPrice));

  // Calcula el porcentaje de cambio
  const discount =
    newPriceValue > 0 && oldPrice > 0
      ? ((oldPrice - newPriceValue) / oldPrice) * 100
      : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Precio Especial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">
                Usuario
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{specialPrice.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {specialPrice.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPrice" className="text-right">
                Precio Actual
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Tag className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-sm font-medium">
                  ${specialPriceProduct.specialPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPrice" className="text-right">
                Nuevo Precio
              </Label>
              <Input
                id="newPrice"
                type="text"
                value={newPrice}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            {discount !== null && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${
                      Number(discount) < 0 ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    <Percent
                      className={`h-4 w-4 ${
                        Number(discount) < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-sm ${
                      Number(discount) < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {Number(discount) < 0
                      ? `${Math.abs(Number(discount)).toFixed(2)}% MORE `
                      : `${Number(discount).toFixed(2)}% OFF`}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating || newPriceValue <= 0}>
              {isUpdating ? "Actualizando..." : "Actualizar Precio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
