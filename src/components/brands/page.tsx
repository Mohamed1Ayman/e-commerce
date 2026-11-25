import Image from "next/image";
import Link from "next/link";
import getAllBrands from "@/services/brand.services";

export default async function Brands() {
  const brands = await getAllBrands();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#198754]">
          FreshCart shop
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#26382d]">
          Shop by brand
        </h1>
        <p className="mt-2 text-sm text-[#7b887e]">
          Discover {brands.length} trusted brands
        </p>
      </div>

      {brands.length > 0 ? (
        <section
          aria-label="All brands"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5"
        >
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="group overflow-hidden rounded-xl border border-[#e7ece8] bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f7f9f7] p-5">
                <Image
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="p-4 text-center text-sm font-semibold text-[#26382d]">
                {brand.name}
              </h2>
            </Link>
          ))}
        </section>
      ) : (
        <p className="rounded-lg border border-dashed border-[#dfe5e0] p-8 text-center text-[#68756c]">
          No brands are available right now.
        </p>
      )}
    </main>
  );
}
