"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type ImageType = {
  url: string;
  alt: string;
};

type Props = {
  mainImage: ImageType;
  galleryImages: ImageType[];
  discount: number;
};

export default function ProductGallery({ mainImage, galleryImages, discount }: Props) {
  const [activeImage, setActiveImage] = useState(mainImage.url);

  useEffect(() => {
    setActiveImage(mainImage.url);
  }, [mainImage.url]);

  // Collect all images including main image as the first one, removing duplicates just in case
  const allImages = [mainImage, ...galleryImages].filter(
    (img, index, self) => index === self.findIndex((t) => t.url === img.url)
  );

  const activeIndex = allImages.findIndex((img) => img.url === activeImage);

  const goToPrevious = () => {
    const isFirstSlide = activeIndex === 0;
    const newIndex = isFirstSlide ? allImages.length - 1 : activeIndex - 1;
    setActiveImage(allImages[newIndex].url);
  };

  const goToNext = () => {
    const isLastSlide = activeIndex === allImages.length - 1;
    const newIndex = isLastSlide ? 0 : activeIndex + 1;
    setActiveImage(allImages[newIndex].url);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image */}
      <div 
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-parchment/40 group" 
        style={{ border: "1px solid rgba(92,107,46,0.1)", boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={mainImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover animate-in fade-in duration-300"
          quality={90}
          priority
        />
        {discount > 0 && (
          <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider bg-olive/90 z-10 shadow-md">
            {discount}% OFF
          </span>
        )}

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-olive flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 shadow-sm border border-olive/10 cursor-pointer"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-olive flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 shadow-sm border border-olive/10 cursor-pointer"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img.url)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                activeImage === img.url
                  ? "ring-2 ring-olive border-none scale-95 opacity-100"
                  : "border border-olive/10 opacity-60 hover:opacity-100 hover:scale-95"
              }`}
            >
              <Image
                src={img.url}
                alt={`${mainImage.alt} - thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
