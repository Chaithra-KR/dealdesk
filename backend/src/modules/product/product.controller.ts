
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
} from "./product.service";

const validId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Get all products
export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProducts();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new product
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, sku, price } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof sku !== "string" ||
      !sku.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name, SKU and non-negative price are required",
      });
    }

    const product = await createProduct({
      name: name.trim(),
      sku: sku.trim(),
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product details
export const editProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const { name, sku, price, isActive } = req.body;

    if (
      (name !== undefined &&
        (typeof name !== "string" || !name.trim())) ||
      (sku !== undefined &&
        (typeof sku !== "string" || !sku.trim())) ||
      (price !== undefined &&
        (typeof price !== "number" ||
          !Number.isFinite(price) ||
          price < 0)) ||
      (isActive !== undefined && typeof isActive !== "boolean")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product details",
      });
    }

    if (
      name === undefined &&
      sku === undefined &&
      price === undefined &&
      isActive === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide product details to update",
      });
    }

    const product = await updateProduct(id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(sku !== undefined && { sku: sku.trim() }),
      price,
      isActive,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate product
export const disableProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await deactivateProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
