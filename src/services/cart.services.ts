import type { CartDetails, CartItem } from "@/types/cart";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getId(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (typeof value._id === "string") {
    return value._id;
  }

  return typeof value.id === "string" ? value.id : undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function parseCart(value: unknown): CartDetails {
  if (
    !isRecord(value) ||
    !isRecord(value.data) ||
    !Array.isArray(value.data.products)
  ) {
    throw new Error("The cart service returned an invalid response.");
  }

  const items = value.data.products.map((entry): CartItem => {
    if (!isRecord(entry)) {
      throw new Error("The cart service returned an invalid item.");
    }

    const rawProduct = entry.product ?? entry.productId;
    const product = isRecord(rawProduct)
      ? rawProduct
      : isRecord(entry)
        ? entry
        : undefined;
    const productId =
      (product ? getId(product) : undefined) ??
      (typeof rawProduct === "string" ? rawProduct : undefined) ??
      (typeof entry.productId === "string" ? entry.productId : undefined);
    if (!product || !productId) {
      throw new Error("The cart service returned an item without product details.");
    }

    const title =
      typeof product.title === "string"
        ? product.title
        : typeof product.name === "string"
          ? product.name
          : `Product ${productId.slice(0, 8)}`;
    const price = parseNumber(product.price) ?? parseNumber(entry.price);
    const quantity =
      parseNumber(entry.count) ?? parseNumber(entry.quantity);
    const imageCover =
      typeof product.imageCover === "string"
        ? product.imageCover
        : typeof product.image === "string"
          ? product.image
          : undefined;

    if (
      !productId ||
      typeof title !== "string" ||
      price === undefined ||
      quantity === undefined ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      (imageCover !== undefined && typeof imageCover !== "string")
    ) {
      throw new Error("The cart service returned an invalid item.");
    }

    return {
      id: getId(entry) ?? productId,
      productId,
      title,
      price,
      quantity,
      imageCover,
    };
  });

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const totalFromApi = parseNumber(value.data.totalCartPrice);
  const total =
    totalFromApi !== undefined
      ? totalFromApi
      : items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, itemCount, total };
}

async function fetchCart(accessToken: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        token: accessToken,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to connect to the cart service. Please try again.");
  }

  if (!response.ok) {
    throw new Error(
      `Could not load your cart (status ${response.status}). Please try again.`,
    );
  }

  let result: unknown;
  try {
    return await response.json();
  } catch {
    throw new Error("The cart service returned an invalid response.");
  }
}

export async function getCartItemCount(accessToken: string): Promise<number> {
  const result = await fetchCart(accessToken);

  if (!isRecord(result)) {
    throw new Error("The cart service returned an invalid response.");
  }

  const topLevelCount = parseNumber(result.numOfCartItems);
  if (topLevelCount !== undefined && topLevelCount >= 0) {
    return topLevelCount;
  }

  if (!isRecord(result.data)) {
    throw new Error("The cart service returned an invalid response.");
  }

  const dataCount = parseNumber(result.data.numOfCartItems);
  if (dataCount !== undefined && dataCount >= 0) {
    return dataCount;
  }

  if (Array.isArray(result.data.products)) {
    return result.data.products.reduce((count, item) => {
      if (!isRecord(item)) {
        return count;
      }

      const quantity = parseNumber(item.count) ?? parseNumber(item.quantity);
      return quantity !== undefined && quantity > 0
        ? count + quantity
        : count;
    }, 0);
  }

  throw new Error("The cart service did not include a cart item count.");
}

export default async function getCartDetails(
  accessToken: string,
): Promise<CartDetails> {
  return parseCart(await fetchCart(accessToken));
}
