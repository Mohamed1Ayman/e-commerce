import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/product-details";
import { getProductById } from "@/services/product.services";

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
