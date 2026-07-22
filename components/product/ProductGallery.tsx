"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

type ProductGalleryProps = {
  images?: string[];
  productName: string;
  className?: string;
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80",
  "https://images.unsplash.com/photo-1579621970563-e3c3b2b6b0a0?w=1200&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
];

export function ProductGallery({ images = DEFAULT_IMAGES, productName, className }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "Escape") {
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const currentImage = images[selectedIndex];

  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-100">
        <div
          className="relative h-full w-full cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
          onMouseMove={handleMouseMove}
          role="button"
          tabIndex={0}
          aria-label={`Agrandir ${productName}`}
        >
          <Image
            src={currentImage}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            className={`object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"}`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 h-9 w-9 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
              onClick={goToPrevious}
              aria-label="Image précédente"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 h-9 w-9 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
              onClick={goToNext}
              aria-label="Image suivante"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-white/90 backdrop-blur-sm"
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label={isZoomed ? "Réduire" : "Agrandir"}
          >
            {isZoomed ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
          </Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              setIsZoomed(false);
            }}
            className={`relative aspect-[4/3] h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
              index === selectedIndex ? "border-accent-600" : "border-transparent"
            }`}
            aria-label={`Voir l'image ${index + 1}`}
            aria-pressed={index === selectedIndex}
          >
            <Image src={image} alt={`${productName} - miniature ${index + 1}`} fill className="object-cover" sizes="112px" />
          </button>
        ))}
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsZoomed(false)}
          role="button"
          tabIndex={0}
          aria-label="Fermer le zoom"
        >
          <div className="relative h-[80vh] w-[80vw]">
            <Image src={currentImage} alt={productName} fill className="object-contain" sizes="80vw" />
          </div>
          <p className="absolute bottom-6 text-sm text-white/80">Appuyez sur Echap ou cliquez pour fermer</p>
        </div>
      )}
    </div>
  );
}
