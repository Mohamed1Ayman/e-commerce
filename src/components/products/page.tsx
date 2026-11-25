import ProductCard from "@/components/products/product-card";
import getAllProducts from "@/services/product.services";

export default async function Products() {
  const products = await getAllProducts();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#198754]">FreshCart shop</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#26382d]">
          All products
        </h1>
        <p className="mt-2 text-sm text-[#7b887e]">
          Showing {products.length} products
        </p>
      </div>

      {products.length > 0 ? (
        <section
          aria-label="All products"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <p className="rounded-lg border border-dashed border-[#dfe5e0] p-8 text-center text-[#68756c]">
          No products are available right now.
        </p>
      )}
    </main>
  );
}
