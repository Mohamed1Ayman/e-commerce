"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartItemQuantity({
  productId,
  title,
  quantity,
}: {
  productId: string;
  title: string;
  quantity: number;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [confirmRemoval, setConfirmRemoval] = useState(false);

  async function updateQuantity(count: number) {
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `/api/cart/${encodeURIComponent(productId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count }),
        },
      );

      if (!response.ok) {
        setError("Could not update quantity. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeItem() {
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `/api/cart/${encodeURIComponent(productId)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        setError("Could not remove this item. Please try again.");
        return;
      }

      setConfirmRemoval(false);
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <div
        className="mt-2 inline-flex items-center gap-2"
        aria-label={`Quantity for ${title}`}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Decrease quantity of ${title}`}
          disabled={isUpdating || quantity <= 1}
          onClick={() => updateQuantity(quantity - 1)}
        >
          −
        </Button>
        <span className="min-w-6 text-center text-sm text-[#425047]" aria-live="polite">
          {isUpdating ? "..." : quantity}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Increase quantity of ${title}`}
          disabled={isUpdating}
          onClick={() => updateQuantity(quantity + 1)}
        >
          +
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
          aria-label={`Remove ${title} from cart`}
          disabled={isUpdating}
          onClick={() => setConfirmRemoval(true)}
        >
          <Trash2 aria-hidden="true" />
          Remove
        </Button>
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {confirmRemoval ? (
        <div
          className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-[#e7ece8] bg-white p-4 shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm font-medium text-[#26382d]">
            Are you sure you want to remove {title} from your cart?
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUpdating}
              onClick={() => setConfirmRemoval(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isUpdating}
              onClick={removeItem}
            >
              {isUpdating ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
