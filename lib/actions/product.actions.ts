"use server";

import {prisma} from "@/db/prisma";
import {convertToPlainObject, formatError} from "../utils";
import {LATEST_PRODUCTS_LIMIT, PAGE_SIZE} from "../constants";
import {revalidatePath} from "next/cache";
import {insertProductSchema, updateProductSchema} from "../validators";
import {z} from "zod";

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {slug: slug},
  });
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  // Get product data
  const data = await prisma.product.findMany({
    orderBy: {createdAt: "desc"},
    skip: (page - 1) * limit,
    take: limit,
  });

  const productCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(productCount) / limit,
  };
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    // Get product from the database
    const product = await prisma.product.findFirst({
      where: {id},
    });

    if (!product) throw new Error("Product not found.");

    // Delete product from the database
    await prisma.product.delete({
      where: {id},
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    // Create product into the database
    await prisma.product.create({data: product});

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    // Get product in the database
    const productExists = await prisma.product.findFirst({
      where: {id: product.id},
    });

    if (!productExists) throw new Error("Product not found.");

    // Update product in the database
    await prisma.product.update({
      where: {id: product.id},
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
