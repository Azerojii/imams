"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface MosqueGalleryLightboxProps {
  images: string[];
}

export default function MosqueGalleryLightbox({
  images,
}: MosqueGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const goNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length,
    );
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, goNext, goPrev]);

  return (
    <>
      <div className="grid grid-cols-2 gap-1 p-2">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="relative overflow-hidden rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`عرض الصورة ${idx + 1} بحجم كبير`}
          >
            <img
              src={src}
              alt={`صورة ${idx + 1}`}
              className="h-24 w-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 rounded bg-black/50 p-2 text-white hover:bg-black/70"
            aria-label="إغلاق المعرض"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-black/50 p-2 text-white hover:bg-black/70"
                aria-label="الصورة السابقة"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-black/50 p-2 text-white hover:bg-black/70"
                aria-label="الصورة التالية"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="flex h-full items-center justify-center">
            <img
              src={images[activeIndex]}
              alt={`صورة ${activeIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/50 px-3 py-1 text-sm text-white">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
