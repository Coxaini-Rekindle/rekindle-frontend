import type { ImageDto } from "@/types/memory";

import MemoryImage from "@/components/MemoryImage";

interface MemoryImageGridProps {
  images: ImageDto[];
  postId: string;
}

export default function MemoryImageGrid({
  images,
  postId,
}: MemoryImageGridProps) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div key={image.fileId} className="relative">
          <MemoryImage
            alt="Memory image"
            className="aspect-square w-full rounded-lg object-cover"
            fileId={image.fileId}
            postId={postId}
          />
        </div>
      ))}
    </div>
  );
}
