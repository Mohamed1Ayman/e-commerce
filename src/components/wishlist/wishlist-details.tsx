import Link from "next/link";
import type { Product } from "@/types/product";
import ProductCard from "@/components/products/product-card";

export default function WishlistDetails({ products }: { products: Product[] }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#198754]">FreshCart shop</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#26382d]">
          Your wishlist
        </h1>
        <p className="mt-2 text-sm text-[#7b887e]">
          {products.length} {products.length === 1 ? "saved item" : "saved items"}
        </p>
      </div>

      {products.length > 0 ? (
        <section
          aria-label="Wishlist products"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-[#dfe5e0] bg-white p-8 text-center">
          <p className="font-medium text-[#26382d]">Your wishlist is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-md bg-[#198754] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#157347]"
          >
            Browse products
          </Link>
        </section>
      )}
    </main>
  );
}
