import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Search, Tag, Trash2, UserPlus, Users } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import {
  useProducts,
  useSpecialPriceMutations,
  useSpecialPrices,
} from "@/services/hooks/api-hooks";
import {
  CreateSpecialPrice,
  SpecialPrice,
  UpdateSpecialPrice,
} from "@/types/special-price";
import {
  existingUserFormSchema,
  newUserFormSchema,
} from "@/lib/validation/special-price-validation";
import { DeletePriceModal } from "@/components/modals/DeletePriceModal";
import { UpdatePriceModal } from "@/components/modals/UpdatePriceModal";

export default function SpecialPricesPage() {
  const { toast } = useToast();
  const {
    data: products,
    isError: errorProducts,
    isLoading: loadingProducts,
  } = useProducts();
  const {
    data: specialPrices,
    isError: errorSpecialPrices,
    isLoading: loadingSpecialPrices,
    refetch: refetchSpecialPrices,
  } = useSpecialPrices();
  const { createSpecialPrice, isCreating } = useSpecialPriceMutations();
  const { addProductToSpecialPrice, isAddingProduct } =
    useSpecialPriceMutations();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSpecialPrices, setFilteredSpecialPrices] = useState<
    SpecialPrice[]
  >([]);

  const [selectedPriceUpdate, setSelectedPriceUpdate] = useState<{
    open: boolean;
    specialPrice: SpecialPrice | null;
    productId: string;
  }>({
    open: false,
    specialPrice: null,
    productId: "",
  });

  const [selectedPriceDelete, setSelectedPriceDelete] = useState<{
    open: boolean;
    specialPrice: SpecialPrice | null;
    productId: string;
  }>({
    open: false,
    specialPrice: null,
    productId: "",
  });

  const [activeTab, setActiveTab] = useState<string>("existing");

  const newUserForm = useForm<z.infer<typeof newUserFormSchema>>({
    resolver: zodResolver(newUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      productId: "",
      price: undefined,
    },
  });

  const existingUserForm = useForm<z.infer<typeof existingUserFormSchema>>({
    resolver: zodResolver(existingUserFormSchema),
    defaultValues: {
      userId: "",
      productId: "",
      price: undefined,
    },
  });

  useEffect(() => {
    if (specialPrices) {
      setFilteredSpecialPrices(
        specialPrices.filter(
          (sp) =>
            sp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sp.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [specialPrices, searchTerm]);

  const handleOpenUpdateSP = (
    specialPrice: SpecialPrice,
    productId: string
  ) => {
    setSelectedPriceUpdate({
      open: true,
      specialPrice,
      productId,
    });
  };

  const handleCloseUpdateSP = () => {
    setSelectedPriceUpdate({
      open: false,
      specialPrice: null,
      productId: "",
    });
  };

  const handleOpenDeleteSP = (
    specialPrice: SpecialPrice,
    productId: string
  ) => {
    setSelectedPriceDelete({
      open: true,
      specialPrice,
      productId,
    });
  };

  const handleCloseDeleteSP = () => {
    setSelectedPriceDelete({
      open: false,
      specialPrice: null,
      productId: "",
    });
  };

  const getProductName = (productId: string) => {
    return (
      products?.find((p) => p._id === productId)?.name ||
      "Producto no encontrado"
    );
  };

  const calculateDiscount = (productId: string, specialPrice: number) => {
    const product = products?.find((p) => p._id === productId);
    if (product) {
      return Math.round(((product.price - specialPrice) / product.price) * 100);
    }
    return 0;
  };

  const onSubmitNewUser = async (values: z.infer<typeof newUserFormSchema>) => {
    try {
      const newSpecialPrice: CreateSpecialPrice = {
        name: values.name,
        email: values.email,
        productId: values.productId,
        specialPrice: values.price,
      };
      const result = await createSpecialPrice(newSpecialPrice);
      if (result.success) {
        toast({
          variant: "success",
          title: result.message,
        });
        newUserForm.reset();
        refetchSpecialPrices();
      } else {
        throw new Error("Failed to create special price");
      }
    } catch (error) {
      console.error("Error al crear precio especial:", error);

      toast({
        variant: "destructive",
        title: "Error al crear precio especial",
      });
    }
  };

  const onSubmitExistingUser = async (
    values: z.infer<typeof existingUserFormSchema>
  ) => {
    try {
      const newSpecialPrice: UpdateSpecialPrice = {
        id: values.userId,
        productId: values.productId,
        specialPrice: values.price,
      };
      const result = await addProductToSpecialPrice(newSpecialPrice);
      if (result.success) {
        toast({
          variant: "success",
          title: result.message,
        });
        existingUserForm.reset();
        refetchSpecialPrices();
      } else {
        throw new Error("Failed to create special price");
      }
    } catch (error) {
      console.error("Error al crear precio especial:", error);

      toast({
        variant: "destructive",
        title: "Error al crear precio especial",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Gestión de Precios Especiales
            </CardTitle>
            <CardDescription>
              Asigna precios especiales a usuarios nuevos o existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="existing"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Usuario Existente</span>
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Usuario Nuevo</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing">
                <Form {...existingUserForm}>
                  <form
                    onSubmit={existingUserForm.handleSubmit(
                      onSubmitExistingUser
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={existingUserForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuario</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar usuario" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specialPrices?.map((user) => (
                                <SelectItem key={user._id} value={user._id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={existingUserForm.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Producto</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar producto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products?.map((product) => (
                                <SelectItem
                                  key={product._id}
                                  value={product._id}
                                >
                                  {product.name} - ${product.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={existingUserForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio Especial</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Ej. 99.99"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isAddingProduct}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {isAddingProduct
                        ? "Guardando..."
                        : "Asignar Precio Especia"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="new">
                <Form {...newUserForm}>
                  <form
                    onSubmit={newUserForm.handleSubmit(onSubmitNewUser)}
                    className="space-y-4"
                  >
                    <FormField
                      control={newUserForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre del usuario"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newUserForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="correo@ejemplo.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newUserForm.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Producto</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar producto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products?.map((product) => (
                                <SelectItem
                                  key={product._id}
                                  value={product._id}
                                >
                                  {product.name} - ${product.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newUserForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio Especial</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Ej. 99.99"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isCreating}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {isCreating
                        ? "Creando..."
                        : "Crear Usuario y Asignar Precio"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Resumen</CardTitle>
            <CardDescription>
              Estadísticas de precios especiales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-primary">
                  Total Precios Especiales
                </p>
                <p className="text-3xl font-bold">
                  {specialPrices?.reduce(
                    (acc, sp) => acc + sp.products.length,
                    0
                  ) || 0}
                </p>
              </div>
              <div className="bg-success/10 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-success">
                  Usuarios con Precios Especiales
                </p>
                <p className="text-3xl font-bold">
                  {specialPrices?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">
                Precios Especiales Asignados
              </CardTitle>
              <CardDescription>
                Listado de todos los precios especiales activos
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre o email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {errorSpecialPrices || errorProducts ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudieron cargar los datos de precios especiales o
                productos.
              </AlertDescription>
            </Alert>
          ) : loadingSpecialPrices || loadingProducts ? (
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
                    <TableHead className="font-medium">Usuario</TableHead>
                    <TableHead className="font-medium">Producto</TableHead>
                    <TableHead className="font-medium">
                      Precio Especial
                    </TableHead>
                    <TableHead className="font-medium">Descuento</TableHead>
                    <TableHead className="font-medium">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSpecialPrices.map((sp) =>
                    sp.products.map((product) => (
                      <TableRow key={`${sp._id}-${product._id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sp.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {sp.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getProductName(product.productId)}
                        </TableCell>
                        <TableCell>
                          <span className="price-tag">
                            ${product.specialPrice.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {calculateDiscount(
                            product.productId,
                            product.specialPrice
                          ) > 0 ? (
                            <Badge
                              variant="outline"
                              className="bg-success/10 text-success border-success/20"
                            >
                              {calculateDiscount(
                                product.productId,
                                product.specialPrice
                              )}
                              % OFF
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-destructive/10 text-destructive border-destructive/20"
                            >
                              {calculateDiscount(
                                product.productId,
                                product.specialPrice
                              )}
                              % MORE
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleOpenUpdateSP(sp, product.productId)
                              }
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleOpenDeleteSP(sp, product.productId)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {filteredSpecialPrices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron precios especiales.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPriceUpdate.specialPrice && (
        <>
          <UpdatePriceModal
            isOpen={selectedPriceUpdate.open}
            specialPrice={selectedPriceUpdate.specialPrice!}
            onClose={handleCloseUpdateSP}
            productId={selectedPriceUpdate.productId}
            refetchSpecialPrices={refetchSpecialPrices}
          />
        </>
      )}

      {selectedPriceDelete.specialPrice && (
        <>
          <DeletePriceModal
            isOpen={selectedPriceDelete.open}
            specialPrice={selectedPriceDelete.specialPrice!}
            onClose={handleCloseDeleteSP}
            productId={selectedPriceDelete.productId}
            refetchSpecialPrices={refetchSpecialPrices}
          />
        </>
      )}
    </div>
  );
}
