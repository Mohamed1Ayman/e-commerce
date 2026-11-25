import { notFound } from "next/navigation";
import BrandProducts from "@/components/brands/brand-products";
import { getBrandById } from "@/services/brand.services";
import { getProductsByBrandId } from "@/services/product.services";

export default async function BrandPage({
  params,
}: PageProps<"/brands/[id]">) {
  const { id } = await params;
  const [brand, products] = await Promise.all([
    getBrandById(id),
    getProductsByBrandId(id),
  ]);

  if (!brand) {
    notFound();
  }

  return <BrandProducts brand={brand} products={products} />;
}
