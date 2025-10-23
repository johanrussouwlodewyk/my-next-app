import { getCurrentUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

export async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await getCurrentUser();
    const userId = user.id;

    // Create sample products
    await prisma.product.createMany({
      data: Array.from({ length: 49 }).map((_, i) => ({
        userId: userId,
        name: `Product ${i + 1}`,
        price: (Math.random() * 90 + 10).toFixed(2),
        quantity: Math.floor(Math.random() * 20),
        lowStockAt: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
      })),
    });

    console.log("Seed data created successfully!");
    console.log(`Created 25 products for user ID: ${userId}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Exported for manual invocation from server code or scripts.
export default main;

// Note: do NOT auto-run main() in this module. Import and call it from
// server-side code (for example an API route) so the database client lifecycle
// can be managed by the caller.
