"use server"

import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";

export async function deleteProduct(formData: FormData) {
    const productId = formData.get("productId") as string;
    const user = await getCurrentUser()
    await prisma.product.deleteMany({
        where: {
            id: productId,
            userId: user.id
        }
    });
}