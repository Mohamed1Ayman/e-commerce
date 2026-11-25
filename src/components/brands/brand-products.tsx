import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/products/product-card";
import type { Brand } from "@/types/brand";
import type { Product } from "@/types/product";

export default function BrandProducts({
  brand,
  products,
}: {
  brand: Brand;
  products: Product[];
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/brands"
        className="text-sm font-medium text-[#198754] hover:underline"
      >
        Back to all brands
      </Link>

      <header className="my-8 flex items-center gap-5 rounded-xl border border-[#e7ece8] bg-white p-5 sm:p-7">
        <div className="relative size-24 shrink-0 rounded-lg bg-[#f7f9f7] sm:size-32">
          <Image
            src={brand.image}
            alt={`${brand.name} logo`}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-contain p-3"
            priority
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-[#198754]">
            FreshCart shop
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#26382d] sm:text-3xl">
            {brand.name} products
          </h1>
          <p className="mt-2 text-sm text-[#7b887e]">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </header>

      {products.length > 0 ? (
        <section
          aria-label={`${brand.name} products`}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <p className="rounded-lg border border-dashed border-[#dfe5e0] p-8 text-center text-[#68756c]">
          No products are currently available for {brand.name}.
        </p>
      )}
    </main>
  );
}
