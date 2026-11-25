"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddToWishlistButton({
  productId,
  compact = false,
}: {
  productId: string;
  compact?: boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  async function addToWishlist() {
    setIsAdding(true);
    setMessage("");
    setHasError(false);

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
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
            ? "Please sign in to save items."
            : serverMessage ?? "Could not add this item. Please try again.",
        );
        return;
      }

      setIsAdded(true);
      setMessage("Added to wishlist.");
    } catch {
      setHasError(true);
      setMessage("Unable to connect. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className={compact ? "absolute right-3 top-3 z-10" : undefined}>
      <Button
        type="button"
        variant={compact ? "ghost" : "outline"}
        className={
          compact
            ? "size-10 rounded-full bg-white text-[#198754] shadow-sm hover:bg-[#f1f6f2]"
            : "w-full border-[#198754] text-[#198754] hover:bg-[#f1f6f2]"
        }
        aria-label={
          compact
            ? isAdding
              ? "Adding to wishlist"
              : isAdded
                ? "Added to wishlist"
                : "Add to wishlist"
            : undefined
        }
        onClick={addToWishlist}
        disabled={isAdding || isAdded}
      >
        <Heart
          aria-hidden="true"
          className={isAdded ? "fill-current" : undefined}
        />
        {compact
          ? null
          : isAdding
            ? "Adding..."
            : isAdded
              ? "Added to wishlist"
              : "Add to wishlist"}
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
