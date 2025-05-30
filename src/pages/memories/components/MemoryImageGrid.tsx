import type { MemoryDto } from "@/types/memory";

import { Image } from "@heroui/image";

interface MemoryImageGridProps {
  images: MemoryDto["images"];
}

export default function MemoryImageGrid({ images }: MemoryImageGridProps) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div key={image.id} className="relative">
          <Image
            alt={image.caption || "Memory image"}
            className="aspect-square w-full rounded-lg object-cover"
            src={image.url}
          />
          {image.caption && (
            <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-small text-white">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
