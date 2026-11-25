import type {
  Brand,
  BrandApiResponse,
  BrandDetailsApiResponse,
} from "@/types/brand";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseBrandPage(value: unknown): BrandApiResponse {
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
    throw new Error("The brands API returned an invalid response.");
  }

  const brands = value.data.map((item): Brand => {
    if (
      !isRecord(item) ||
      typeof item._id !== "string" ||
      typeof item.name !== "string" ||
      typeof item.slug !== "string" ||
      typeof item.image !== "string"
    ) {
      throw new Error("The brands API returned an invalid brand.");
    }

    return {
      id: item._id,
      name: item.name,
      slug: item.slug,
      image: item.image,
    };
  });

  return {
    data: brands,
    metadata: {
      currentPage: value.metadata.currentPage,
      numberOfPages: value.metadata.numberOfPages,
    },
  };
}

function parseBrandDetails(value: unknown): Brand {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The brand API returned an invalid response.");
  }

  const brand = value.data;
  if (
    typeof brand._id !== "string" ||
    typeof brand.name !== "string" ||
    typeof brand.slug !== "string" ||
    typeof brand.image !== "string"
  ) {
    throw new Error("The brand API returned invalid brand details.");
  }

  const result: BrandDetailsApiResponse = {
    data: {
      _id: brand._id,
      name: brand.name,
      slug: brand.slug,
      image: brand.image,
    },
  };

  return {
    id: result.data._id,
    name: result.data.name,
    slug: result.data.slug,
    image: result.data.image,
  };
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/brands/${encodeURIComponent(id)}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `The brand API request failed with status ${response.status}.`,
    );
  }

  return parseBrandDetails(await response.json());
}

export default async function getAllBrands(): Promise<Brand[]> {
  const brands: Brand[] = [];
  let page = 1;
  let numberOfPages = 1;

  do {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands?page=${page}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `The brands API request failed with status ${response.status}.`,
      );
    }

    const result = parseBrandPage(await response.json());

    if (result.metadata.currentPage !== page) {
      throw new Error("The brands API returned an unexpected page.");
    }

    brands.push(...result.data);
    numberOfPages = result.metadata.numberOfPages;
    page += 1;
  } while (page <= numberOfPages);

  return brands;
}
