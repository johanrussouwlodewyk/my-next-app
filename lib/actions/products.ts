"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  const user = await getCurrentUser();
  await prisma.product.deleteMany({
    where: {
      id: productId,
      userId: user.id,
    },
  });
}

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku"),
    lowStockAt: formData.get("lowStockAt"),
  });

  if (!parsed.success) {
    throw new Error("Invalid product data");
  }

  try {
    await prisma.product.create({
      data: { ...parsed.data, userId: user.id },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
  
  // Redirect after successful creation, outside try/catch
  redirect("/inventory");
}
