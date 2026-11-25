import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import AddToCartButton from "@/components/products/add-to-cart-button";
import AddToWishlistButton from "@/components/products/add-to-wishlist-button";

const priceFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#e7ece8] bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-[#f7f9f7] p-5">
        <Link
          href={`/products/${encodeURIComponent(product.id)}`}
          aria-label={`View details for ${product.title}`}
          className="absolute inset-0 block"
        >
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <AddToWishlistButton productId={product.id} compact />
      </div>
      <div className="space-y-2 p-4">
        <p className="truncate text-xs text-[#7b887e]">
          {product.category?.name ?? product.brand?.name ?? "FreshCart"}
        </p>
        <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-[#26382d]">
          <Link
            href={`/products/${encodeURIComponent(product.id)}`}
            className="hover:text-[#198754]"
          >
            {product.title}
          </Link>
        </h2>
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-[#198754]">
            {priceFormatter.format(product.price)}
          </p>
          {typeof product.ratingsAverage === "number" ? (
            <p
              className="shrink-0 text-xs text-[#7b887e]"
              aria-label={`Rating ${product.ratingsAverage} out of 5`}
            >
              <span className="text-[#e7a82b]" aria-hidden="true">
                ★
              </span>{" "}
              {product.ratingsAverage.toFixed(1)}
            </p>
          ) : null}
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}
