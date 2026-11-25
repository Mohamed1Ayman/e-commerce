import Image from "next/image";
import Link from "next/link";
import type { CartDetails as CartDetailsType } from "@/types/cart";
import CartItemQuantity from "@/components/cart/cart-item-quantity";

const priceFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

export default function CartDetails({
  cart,
}: {
  cart: CartDetailsType;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#198754]">FreshCart shop</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#26382d]">
          Your cart
        </h1>
        <p className="mt-2 text-sm text-[#7b887e]">
          {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {cart.items.length === 0 ? (
        <section className="rounded-xl border border-dashed border-[#dfe5e0] bg-white p-8 text-center">
          <p className="font-medium text-[#26382d]">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-md bg-[#198754] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#157347]"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <section aria-label="Cart items" className="space-y-3">
            {cart.items.map((item) => (
              <article
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-[#e7ece8] bg-white p-4"
              >
                {item.imageCover ? (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-[#f7f9f7]">
                    <Image
                      src={item.imageCover}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 text-sm font-semibold text-[#26382d]">
                    {item.title}
                  </h2>
                  <CartItemQuantity
                    productId={item.productId}
                    title={item.title}
                    quantity={item.quantity}
                  />
                  <p className="mt-1 text-sm font-semibold text-[#198754]">
                    {priceFormatter.format(item.price)} each
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-[#26382d]">
                  {priceFormatter.format(item.price * item.quantity)}
                </p>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-xl border border-[#e7ece8] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#26382d]">
              Order summary
            </h2>
            <div className="mt-4 flex justify-between border-t border-[#edf0ed] pt-4 text-sm">
              <span className="text-[#68756c]">Total</span>
              <span className="font-bold text-[#198754]">
                {priceFormatter.format(cart.total)}
              </span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
