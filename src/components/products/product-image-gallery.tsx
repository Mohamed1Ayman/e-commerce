"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <section aria-label="Product images">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f9f7]">
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-8"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => {
            const isSelected = image === selectedImage;

            return (
              <button
                key={image}
                type="button"
                aria-label={`Show image ${index + 1} of ${title}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square overflow-hidden rounded-lg border bg-[#f7f9f7] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#198754] ${
                  isSelected
                    ? "border-[#198754] ring-2 ring-[#198754]/20"
                    : "border-[#e7ece8] hover:border-[#9ab9a4]"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="100px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
