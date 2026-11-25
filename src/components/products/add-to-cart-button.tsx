"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({
  productId,
  quantity = 1,
  buyNow = false,
}: {
  productId: string;
  quantity?: number;
  buyNow?: boolean;
}) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  async function addToCart() {
    setIsAdding(true);
    setMessage("");
    setHasError(false);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, count: quantity }),
      });

      if (!response.ok) {
        const errorBody: unknown = await response.json().catch(() => null);
        const serverMessage =
          typeof errorBody === "object" &&
          errorBody !== null &&
          "message" in errorBody &&
          typeof errorBody.message === "string"
            ? errorBody.message
            : undefined;
        setHasError(true);
        setMessage(
          response.status === 401
            ? "Please sign in to add items."
            : serverMessage ?? "Could not add this item. Please try again.",
        );
        return;
      }

      if (buyNow) {
        router.push("/cart");
      } else {
        setMessage("Added to cart.");
        router.refresh();
      }
    } catch {
      setHasError(true);
      setMessage("Unable to connect. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        className="w-full rounded-md bg-[#198754] text-white hover:bg-[#157347]"
        onClick={addToCart}
        disabled={isAdding}
      >
        <ShoppingCart aria-hidden="true" />
        {isAdding ? "Adding..." : buyNow ? "Buy now" : "Add to cart"}
      </Button>
      {message ? (
        <p
          className={`mt-2 text-xs ${hasError ? "text-red-600" : "text-[#198754]"}`}
          role={hasError ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
