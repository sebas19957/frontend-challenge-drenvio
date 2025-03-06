export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  sku: string;
  stock: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
