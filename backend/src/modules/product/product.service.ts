
import mongoose from "mongoose";
import Product from "../../models/Product.model";

interface ProductInput {
  name?: string;
  sku?: string;
  price?: number;
  isActive?: boolean;
}

export const getProducts = () =>
  Product.find().sort({ createdAt: -1 });

export const getProductById = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Product.findById(id);
};

export const createProduct = (data: ProductInput) =>
  Product.create({
    name: data.name!.trim(),
    sku: data.sku!.trim().toUpperCase(),
    price: data.price,
  });

export const updateProduct = (
  id: string,
  data: ProductInput
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const update: ProductInput = {};

  if (data.name !== undefined) update.name = data.name.trim();
  if (data.sku !== undefined) update.sku = data.sku.trim().toUpperCase();
  if (data.price !== undefined) update.price = data.price;
  if (data.isActive !== undefined) update.isActive = data.isActive;

  return Product.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  );
};

export const deactivateProduct = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return Product.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );
};
