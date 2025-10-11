import { PrismaClient } from "@prisma/client";

export async function main() {
  const prisma = new PrismaClient();
  try {
    const demoUserId = "f2ea82f2-4177-48b7-a0a8-359920bb9987";

    // Create sample products
    await prisma.product.createMany({
      data: Array.from({ length: 25 }).map((_, i) => ({
        userId: demoUserId,
        name: `Product ${i + 1}`,
        price: (Math.random() * 90 + 10).toFixed(2),
        quantity: Math.floor(Math.random() * 20),
        lowStockAt: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
      })),
    });

    console.log("Seed data created successfully!");
    console.log(`Created 25 products for user ID: ${demoUserId}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Exported for manual invocation from server code or scripts.
export default main;

// Note: do NOT auto-run main() in this module. Import and call it from
// server-side code (for example an API route) so the database client lifecycle
// can be managed by the caller.
