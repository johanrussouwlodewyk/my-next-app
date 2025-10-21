import Pagination from "@/components/pagination";
import Sidebar from "@/components/sidebar";
import { deleteProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export default async function Inventory({ searchParams, }:
    { searchParams: Promise<{ q?: string, page?: string }> }
) {

    const user = await getCurrentUser()
    const userId = user.id

    const params = await searchParams
    const q = (params.q ?? "").trim()
    
    const where = {
        userId,
        ...(q ? { name: { contains: q, mode: "insensitive" } as const } : {}),
    }


    const pageSize = 5;
     const totalCount = await prisma.product.count({ where   });

    const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
   
    const page = Math.max(1, isNaN(parseInt(params.page ?? "1")) ? 1 : parseInt(params.page ?? "1"));

    const totalProducts = await prisma.product.findMany({ where,
         orderBy: { createdAt: "desc"},
        skip: (page -1) * pageSize,
        take: pageSize
     });
   


    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/inventory" />
            <main className="ml-64 p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                            <p className="text-sm text-gray-500">Manage your products and track inventory levels here.</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    {/* Search */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <form className="flex gap-2" action="/inventory" method="GET">
                            <input name="q"
                                placeholder="Search products..."
                                className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:border-transparent" />
                            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Search</button>
                        </form>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs fontmedium text-graay-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs fontmedium text-graay-500 uppercase">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs fontmedium text-graay-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs fontmedium text-graay-500 uppercase">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs fontmedium text-graay-500 uppercase">Low Stock At</th>
                                    <th className="px-6 py-3 text-left text-xs fontmedium text-graay-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {totalProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.lowStockAt || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                                            <form action={async (formData: FormData) => {
                                                "use server";
                                                await deleteProduct(formData);
                                            }
                                            }>
                                                <input type="hidden" name="productId" value={product.id} />
                                                <button className="text-red-600 hover:text-red-900">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 ">
                            <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            baseUrl="/inventory" 
                            searchParams={{
                                q,
                                pageSize: String(pageSize)}}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}