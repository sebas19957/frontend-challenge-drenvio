"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Package, Tag, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSpecialPriceMutations } from "@/services/hooks/api-hooks";
import { SpecialPrice } from "@/types/special-price";
import { useToast } from "@/hooks/use-toast";

interface DeletePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialPrice: SpecialPrice | null;
  productId: string;
  refetchSpecialPrices: () => void;
}

export function DeletePriceModal({
  isOpen,
  onClose,
  specialPrice,
  productId,
  refetchSpecialPrices,
}: DeletePriceModalProps) {
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deleteProductFromSpecialPrice, isDeletingProduct } =
    useSpecialPriceMutations();

  const specialPriceProduct = specialPrice?.products.find(
    (p) => p.productId === productId
  );

  if (!specialPrice || !productId || !specialPriceProduct) {
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

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        const result = await deleteProductFromSpecialPrice({
          id: specialPrice._id,
          productId: specialPriceProduct.productId,
        });
        if (result.success) {
          toast({
            variant: "success",
            title: result.message,
          });
          refetchSpecialPrices();
          onClose();
        } else {
          throw new Error("Failed to delete special price");
        }
      } catch (error) {
        console.error("Error deleting special price:", error);
        toast({
          variant: "destructive",
          title: "Error al actualizar el precio especial",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Precio Especial</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Usuario</Label>
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
            <Label className="text-right">Producto</Label>
            <div className="col-span-3 flex items-center gap-2">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {specialPriceProduct.productId}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {specialPriceProduct.productId}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Precio Especial</Label>
            <div className="col-span-3 flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-full">
                <Tag className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-sm font-medium">
                ${specialPriceProduct.specialPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm-delete"
              checked={confirmDelete}
              onCheckedChange={(checked) =>
                setConfirmDelete(checked as boolean)
              }
              className="border-red-500 text-red-500 focus:ring-red-500"
            />
            <Label
              htmlFor="confirm-delete"
              className="text-sm text-red-500 font-medium"
            >
              Confirmo que quiero eliminar este precio especial
            </Label>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!confirmDelete || isDeletingProduct}
          >
            {isDeletingProduct ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
