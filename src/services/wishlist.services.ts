import type { Product } from "@/types/product";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseWishlistProduct(value: unknown): Product {
  if (!isRecord(value)) {
    throw new Error("The wishlist service returned an invalid product.");
  }

  const id = typeof value.id === "string" ? value.id : value._id;
  if (
    typeof id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.price !== "number" ||
    typeof value.imageCover !== "string"
  ) {
    throw new Error("The wishlist service returned an invalid product.");
  }

  const images = Array.isArray(value.images)
    ? value.images.filter((image): image is string => typeof image === "string")
    : [];
  const category = isRecord(value.category) &&
    typeof value.category.name === "string"
    ? { name: value.category.name }
    : undefined;
  const brand = isRecord(value.brand) && typeof value.brand.name === "string"
    ? {
        id:
          typeof value.brand._id === "string" ? value.brand._id : undefined,
        name: value.brand.name,
      }
    : undefined;

  return {
    id,
    title: value.title,
    description:
      typeof value.description === "string" ? value.description : "",
    price: value.price,
    imageCover: value.imageCover,
    images,
    category,
    brand,
    ratingsAverage:
      typeof value.ratingsAverage === "number"
        ? value.ratingsAverage
        : undefined,
    ratingsQuantity:
      typeof value.ratingsQuantity === "number"
        ? value.ratingsQuantity
        : undefined,
  };
}

export default async function getWishlistProducts(
  accessToken: string,
): Promise<Product[]> {
  let response: Response;
  try {
    response = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: {
        Accept: "application/json",
        token: accessToken,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to connect to the wishlist service. Please try again.");
  }

  if (!response.ok) {
    throw new Error(
      `Could not load your wishlist (status ${response.status}). Please try again.`,
    );
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("The wishlist service returned an invalid response.");
  }

  if (!isRecord(result) || !Array.isArray(result.data)) {
    throw new Error("The wishlist service returned an invalid response.");
  }

  return result.data.map(parseWishlistProduct);
}
