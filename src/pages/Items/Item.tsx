"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useProducts, useSpecialPrices } from "@/services/hooks/api-hooks";
import { SpecialPrice } from "@/types/special-price";
import { Product } from "@/types/products";

export default function ItemPage() {
  const {
    data: dataProducts,
    isError: errorProducts,
    isLoading: loadingProducts,
  } = useProducts();
  const {
    data: dataSpecialPrices,
    isError: errorSpecialPrices,
    isLoading: loadingSpecialPrices,
  } = useSpecialPrices();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<SpecialPrice | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (dataSpecialPrices && dataSpecialPrices.length > 0) {
      setCurrentUser(dataSpecialPrices[0]);
    }
  }, [dataSpecialPrices]);

  useEffect(() => {
    if (dataProducts) {
      setFilteredProducts(
        dataProducts.filter(
          (product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false ||
            product.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            false
        )
      );
    }
  }, [dataProducts, searchTerm]);

  const calculateDiscount = (normalPrice: number, specialPrice: number) => {
    return Math.round(((normalPrice - specialPrice) / normalPrice) * 100);
  };

  const handleUserChange = (userId: string) => {
    const selectedUser = dataSpecialPrices?.find((user) => user._id === userId);
    if (selectedUser) {
      setCurrentUser(selectedUser);
    }
  };

  const getSpecialPrice = (productId: string): number | null => {
    if (!currentUser) return null;
    const specialPriceProduct = currentUser.products.find(
      (p) => p.productId === productId
    );
    return specialPriceProduct ? specialPriceProduct.specialPrice : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="size-4 text-primary" />
              </div>
              Usuario Activo
            </CardTitle>
            <CardDescription>Información del usuario actual</CardDescription>
          </CardHeader>
          <CardContent>
            {errorSpecialPrices ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  No se pudieron cargar los datos de precios especiales.
                </AlertDescription>
              </Alert>
            ) : loadingSpecialPrices ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : currentUser ? (
              <div className="flex flex-col gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <Select
                    onValueChange={handleUserChange}
                    defaultValue={currentUser._id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSpecialPrices?.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {currentUser._id}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {currentUser.products.length > 0
                    ? `Este usuario tiene ${currentUser.products.length} precio(s) especial(es)`
                    : "Este usuario no tiene precios especiales"}
                </div>
              </div>
            ) : (
              <p>No hay usuarios con precios especiales disponibles.</p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold">Estadísticas</CardTitle>
            <CardDescription>Resumen de productos y precios</CardDescription>
          </CardHeader>
          <CardContent>
            {errorProducts || errorSpecialPrices ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  No se pudieron cargar las estadísticas.
                </AlertDescription>
              </Alert>
            ) : loadingProducts || loadingSpecialPrices ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-primary">
                    Total Productos
                  </p>
                  <p className="text-3xl font-bold">
                    {dataProducts?.length || 0}
                  </p>
                </div>
                <div className="bg-success/10 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-success">
                    Con Precio Especial
                  </p>
                  <p className="text-3xl font-bold">
                    {dataSpecialPrices?.reduce(
                      (acc, user) => acc + user.products.length,
                      0
                    ) || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">
                Listado de Artículos
              </CardTitle>
              <CardDescription>
                Productos disponibles en la tienda
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {errorProducts ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudieron cargar los datos de productos.
              </AlertDescription>
            </Alert>
          ) : loadingProducts ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">ID</TableHead>
                    <TableHead className="font-medium">Nombre</TableHead>
                    <TableHead className="font-medium hidden md:table-cell">
                      Descripción
                    </TableHead>
                    <TableHead className="font-medium">Precio Normal</TableHead>
                    <TableHead className="font-medium">
                      Precio Especial
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const specialPrice = getSpecialPrice(product._id);
                      return (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">
                            {product._id}
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.description}
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {specialPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="price-tag">
                                  ${specialPrice.toFixed(2)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="bg-success/10 text-success border-success/20"
                                >
                                  {calculateDiscount(
                                    product.price,
                                    specialPrice
                                  )}
                                  % OFF
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                No disponible
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron productos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
