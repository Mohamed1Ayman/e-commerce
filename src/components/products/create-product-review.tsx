"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductReview = {
  id: string;
  review: string;
  rating: number;
  userName: string;
  createdAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseReviews(value: unknown): ProductReview[] {
  if (!isRecord(value)) {
    throw new Error("The review service returned an invalid response.");
  }

  const data = isRecord(value.data) ? value.data : undefined;
  const rows = Array.isArray(value.data)
    ? value.data
    : Array.isArray(value.reviews)
      ? value.reviews
      : data && Array.isArray(data.reviews)
        ? data.reviews
        : undefined;

  if (!rows) {
    throw new Error("The review service returned an invalid response.");
  }

  return rows.map((row, index) => {
    if (!isRecord(row)) {
      throw new Error("The review service returned an invalid review.");
    }

    const review =
      typeof row.review === "string"
        ? row.review
        : typeof row.comment === "string"
          ? row.comment
          : undefined;
    const rating = Number(row.rating);
    const user = isRecord(row.user)
      ? row.user
      : isRecord(row.userId)
        ? row.userId
        : undefined;
    const userName =
      typeof row.userName === "string"
        ? row.userName
        : user && typeof user.name === "string"
          ? user.name
          : "Customer";

    if (!review?.trim() || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new Error("The review service returned an invalid review.");
    }

    return {
      id:
        typeof row._id === "string"
          ? row._id
          : typeof row.id === "string"
            ? row.id
            : `${index}-${rating}`,
      review,
      rating,
      userName,
      createdAt:
        typeof row.createdAt === "string" ? row.createdAt : undefined,
    };
  });
}

export default function CreateProductReview({
  productId,
}: {
  productId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [rating, setRating] = useState(5);

  const loadReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    setReviewsError("");

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(productId)}/reviews`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error("Could not load reviews. Please try again.");
      }

      const result: unknown = await response.json();
      setReviews(parseReviews(result));
      setReviewsLoaded(true);
    } catch (error) {
      setReviewsError(
        error instanceof Error
          ? error.message
          : "Could not load reviews. Please try again.",
      );
    } finally {
      setIsLoadingReviews(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setHasError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const review = String(formData.get("review") ?? "");

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(productId)}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review, rating }),
        },
      );

      if (!response.ok) {
        setHasError(true);
        setMessage(
          response.status === 401
            ? "Please sign in to leave a review."
            : "Could not submit your review. Please try again.",
        );
        return;
      }

      form.reset();
      setRating(5);
      setMessage("Your review was submitted.");
      await loadReviews();
    } catch {
      setHasError(true);
      setMessage("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
      : 0;

  return (
    <section
      aria-labelledby={`reviews-heading-${productId}`}
      className="rounded-xl border border-[#e7ece8] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#edf0ed] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#198754]">
            Customer feedback
          </p>
          <h2
            id={`reviews-heading-${productId}`}
            className="mt-1 text-xl font-bold text-[#26382d]"
          >
            Reviews &amp; ratings
          </h2>
        </div>
        {reviewsLoaded && reviews.length > 0 ? (
          <div className="text-right">
            <p className="inline-flex items-center gap-1 font-semibold text-[#26382d]">
              <Star
                className="size-4 fill-[#e7a82b] text-[#e7a82b]"
                aria-hidden="true"
              />
              {averageRating.toFixed(1)}
            </p>
            <p className="text-xs text-[#7b887e]">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 py-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section aria-label="Customer reviews">
          {isLoadingReviews ? (
            <p className="rounded-lg bg-[#f7f9f7] p-4 text-sm text-[#7b887e]" role="status">
              Loading customer reviews...
            </p>
          ) : null}
          {reviewsError ? (
            <div className="rounded-lg border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-700" role="alert">
                {reviewsError}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => void loadReviews()}
              >
                Try again
              </Button>
            </div>
          ) : null}
          {reviewsLoaded && reviews.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#dfe5e0] bg-[#fbfcfb] p-5 text-center">
              <Star
                className="mx-auto size-6 text-[#b8c2bb]"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-medium text-[#425047]">
                No reviews yet
              </p>
              <p className="mt-1 text-xs text-[#7b887e]">
                Be the first to share your experience.
              </p>
            </div>
          ) : null}
          {reviews.length > 0 ? (
            <ul className="space-y-3">
              {reviews.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-[#edf0ed] bg-[#fbfcfb] p-4"
                >
                  <article>
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8f3ec] text-sm font-bold text-[#198754]"
                      >
                        {item.userName.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[#26382d]">
                            {item.userName}
                          </p>
                          <div
                            className="flex items-center gap-0.5"
                            aria-label={`Rated ${item.rating} out of 5`}
                          >
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star
                                key={index}
                                className={`size-3.5 ${
                                  index < Math.round(item.rating)
                                    ? "fill-[#e7a82b] text-[#e7a82b]"
                                    : "text-[#d5ddd7]"
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                            <span className="sr-only">
                              {item.rating} out of 5
                            </span>
                          </div>
                        </div>
                        {item.createdAt ? (
                          <time
                            className="mt-0.5 block text-xs text-[#7b887e]"
                            dateTime={item.createdAt}
                          >
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              { timeZone: "UTC" },
                            )}
                          </time>
                        ) : null}
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#526057]">
                          {item.review}
                        </p>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <form
          className="h-fit rounded-lg bg-[#f7f9f7] p-4 sm:p-5"
          onSubmit={submitReview}
        >
          <h3 className="text-base font-semibold text-[#26382d]">
            Write a review
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#7b887e]">
            Tell other shoppers what you think about this product.
          </p>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-[#425047]">
              Your rating
            </legend>
            <input type="hidden" name="rating" value={rating} />
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const selected = value <= rating;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                    className="rounded p-1 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#198754]"
                  >
                    <Star
                      className={`size-6 ${
                        selected
                          ? "fill-[#e7a82b] text-[#e7a82b]"
                          : "text-[#cbd5ce]"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs text-[#68756c]">
                {rating} out of 5
              </span>
            </div>
          </fieldset>

          <div className="mt-4">
            <label
              htmlFor={`review-text-${productId}`}
              className="block text-sm font-medium text-[#425047]"
            >
              Your review
            </label>
            <textarea
              id={`review-text-${productId}`}
              name="review"
              required
              minLength={3}
              maxLength={2000}
              rows={5}
              placeholder="What did you like or dislike? How was the quality?"
              className="mt-2 w-full resize-y rounded-md border border-[#dfe5e0] bg-white px-3 py-2.5 text-sm leading-6 text-[#26382d] outline-none placeholder:text-[#929c95] focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/20"
            />
            <p className="mt-1 text-right text-xs text-[#929c95]">
              Up to 2,000 characters
            </p>
          </div>
          <Button
            type="submit"
            className="mt-3 w-full bg-[#198754] text-white hover:bg-[#157347]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting review..." : "Submit review"}
          </Button>
          {message ? (
            <p
              className={`mt-3 text-sm ${hasError ? "text-red-600" : "text-[#198754]"}`}
              role={hasError ? "alert" : "status"}
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
