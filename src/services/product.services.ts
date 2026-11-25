import type { Product, ProductApiResponse } from "@/types/product";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseName(value: unknown): { name: string } | undefined {
  if (!isRecord(value) || typeof value.name !== "string") {
    return undefined;
  }

  return { name: value.name };
}

function parseProductBrand(
  value: unknown,
): { id?: string; name: string } | undefined {
  if (!isRecord(value) || typeof value.name !== "string") {
    return undefined;
  }

  return {
    id: typeof value._id === "string" ? value._id : undefined,
    name: value.name,
  };
}

function parseProductResponse(value: unknown): ProductApiResponse {
  if (
    !isRecord(value) ||
    !Array.isArray(value.data) ||
    !isRecord(value.metadata) ||
    typeof value.metadata.currentPage !== "number" ||
    typeof value.metadata.numberOfPages !== "number" ||
    !Number.isInteger(value.metadata.currentPage) ||
    !Number.isInteger(value.metadata.numberOfPages) ||
    value.metadata.currentPage < 1 ||
    value.metadata.numberOfPages < 1
  ) {
    throw new Error("The products API returned an invalid response.");
  }

  const products = value.data.map((item): Product => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      typeof item.description !== "string" ||
      typeof item.price !== "number" ||
      typeof item.imageCover !== "string" ||
      !Array.isArray(item.images) ||
      !item.images.every((image) => typeof image === "string")
    ) {
      throw new Error("The products API returned an invalid product.");
    }

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      imageCover: item.imageCover,
      images: item.images.filter(
        (image): image is string => typeof image === "string",
      ),
      category: parseName(item.category),
      brand: parseProductBrand(item.brand),
      ratingsAverage:
        typeof item.ratingsAverage === "number"
          ? item.ratingsAverage
          : undefined,
      ratingsQuantity:
        typeof item.ratingsQuantity === "number"
          ? item.ratingsQuantity
          : undefined,
    };
  });

  return {
    data: products,
    metadata: {
      currentPage: value.metadata.currentPage,
      numberOfPages: value.metadata.numberOfPages,
    },
  };
}

export async function getProductById(productId: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/api/v1/products/${encodeURIComponent(productId)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
  } catch {
    throw new Error("Unable to connect to the products API.");
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `The product API request failed with status ${response.status}.`,
    );
  }

  const result: unknown = await response.json();
  if (!isRecord(result) || !isRecord(result.data)) {
    throw new Error("The products API returned an invalid product.");
  }

  const item = result.data;
  if (
    typeof item.id !== "string" ||
    typeof item.title !== "string" ||
    typeof item.description !== "string" ||
    typeof item.price !== "number" ||
    typeof item.imageCover !== "string" ||
    !Array.isArray(item.images) ||
    !item.images.every((image) => typeof image === "string")
  ) {
    throw new Error("The products API returned an invalid product.");
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    imageCover: item.imageCover,
    images: item.images.filter(
      (image): image is string => typeof image === "string",
    ),
    category: parseName(item.category),
    brand: parseProductBrand(item.brand),
    ratingsAverage:
      typeof item.ratingsAverage === "number"
        ? item.ratingsAverage
        : undefined,
    ratingsQuantity:
      typeof item.ratingsQuantity === "number"
        ? item.ratingsQuantity
        : undefined,
  };
}

export default async function getAllProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const products: Product[] = [];
  let page = 1;
  let numberOfPages = 1;

  do {
    const response = await fetch(
      `${normalizedBaseUrl}/api/v1/products?page=${page}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `The products API request failed with status ${response.status}.`,
      );
    }

    const result = parseProductResponse(await response.json());

    if (result.metadata.currentPage !== page) {
      throw new Error("The products API returned an unexpected page.");
    }

    products.push(...result.data);
    numberOfPages = result.metadata.numberOfPages;
    page += 1;
  } while (page <= numberOfPages);

  return products;
}

export async function getProductsByBrandId(brandId: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.brand?.id === brandId);
}
