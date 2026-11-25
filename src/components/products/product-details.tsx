import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import type { Product } from "@/types/product";
import CreateProductReview from "@/components/products/create-product-review";
import ProductPurchaseActions from "@/components/products/product-purchase-actions";
import ProductImageGallery from "@/components/products/product-image-gallery";

const priceFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

export default function ProductDetails({ product }: { product: Product }) {
  const images = Array.from(new Set([product.imageCover, ...product.images]));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#68756c] transition-colors hover:text-[#198754]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to products
      </Link>

      <article className="grid gap-8 rounded-2xl border border-[#e7ece8] bg-white p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">
        <ProductImageGallery title={product.title} images={images} />

        <section className="flex flex-col">
          <p className="text-sm font-medium text-[#198754]">
            {product.category?.name ?? "FreshCart"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#26382d] sm:text-4xl">
            {product.title}
          </h1>
          {product.brand ? (
            <p className="mt-2 text-sm text-[#68756c]">
              Brand: <span className="font-medium">{product.brand.name}</span>
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-bold text-[#198754]">
              {priceFormatter.format(product.price)}
            </p>
            {typeof product.ratingsAverage === "number" ? (
              <p
                className="inline-flex items-center gap-1 text-sm text-[#68756c]"
                aria-label={`Rated ${product.ratingsAverage} out of 5`}
              >
                <Star
                  className="size-4 fill-[#e7a82b] text-[#e7a82b]"
                  aria-hidden="true"
                />
                {product.ratingsAverage.toFixed(1)}
                {typeof product.ratingsQuantity === "number"
                  ? ` (${product.ratingsQuantity} reviews)`
                  : ""}
              </p>
            ) : null}
          </div>

          <div className="my-6 border-t border-[#edf0ed]" />
          <h2 className="text-lg font-semibold text-[#26382d]">
            Product details
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#68756c]">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductPurchaseActions productId={product.id} />
          </div>

          <div className="mt-8">
            <CreateProductReview productId={product.id} />
          </div>
        </section>
      </article>
    </main>
  );
}
