export interface SpecialPriceProduct {
  _id: string;
  productId: string;
  specialPrice: number;
}

export interface SpecialPrice {
  _id: string;
  name: string;
  email: string;
  products: SpecialPriceProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSpecialPrice {
  name: string;
  email: string;
  productId: string;
  specialPrice: number;
}

export type UpdateSpecialPrice = Omit<SpecialPriceProduct, "_id"> & {
  id: string;
};
