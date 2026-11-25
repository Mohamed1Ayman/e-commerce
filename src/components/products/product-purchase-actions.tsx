"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AddToCartButton from "@/components/products/add-to-cart-button";
import AddToWishlistButton from "@/components/products/add-to-wishlist-button";
import { Button } from "@/components/ui/button";

export default function ProductPurchaseActions({
  productId,
}: {
  productId: string;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-[#425047]">Quantity</p>
        <div className="inline-flex items-center gap-3 rounded-lg border border-[#dfe5e0] p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            <Minus aria-hidden="true" />
          </Button>
          <span className="min-w-8 text-center font-semibold text-[#26382d]" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            disabled={quantity >= 99}
            onClick={() => setQuantity((current) => Math.min(99, current + 1))}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton productId={productId} quantity={quantity} />
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          buyNow
        />
      </div>
      <AddToWishlistButton productId={productId} />
    </div>
  );
}
