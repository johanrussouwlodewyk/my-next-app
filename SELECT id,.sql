SELECT id,
       "userId",
       name,
       sku,
       price,
       quantity,
       "lowStockAt",
       "createdAt",
       "updatedAt"
FROM public."Product"
LIMIT 1000;