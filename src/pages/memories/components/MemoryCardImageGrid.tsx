import type { ImageDto } from "@/types/memory";

import MemoryImage from "@/components/MemoryImage";

interface MemoryCardImageGridProps {
  images: ImageDto[];
  postId: string;
}

// Reusable caption overlay component
interface ImageWithCaptionProps {
  image: ImageDto;
  postId: string;
  alt: string;
  className?: string;
  captionSize?: "sm" | "xs";
}

function ImageWithCaption({
  image,
  alt,
  className = "",
  captionSize = "sm",
  postId,
}: ImageWithCaptionProps) {
  const captionTextClass = captionSize === "sm" ? "text-sm" : "text-xs";
  const captionPadding = captionSize === "sm" ? "p-3" : "p-2";

  return (
    <div className={className}>
      <div className="group relative inline-block overflow-hidden rounded-lg">
        <MemoryImage
          alt={alt}
          className="block transition-transform duration-300 group-hover:scale-105"
          fileId={image.fileId}
          postId={postId}
        />
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent ${captionPadding} opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10`}
        >
          <p className={`${captionTextClass} text-white`}>{alt}</p>
        </div>
      </div>
    </div>
  );
}

export default function MemoryCardImageGrid({
  images,
  postId,
}: MemoryCardImageGridProps) {
  if (images.length === 0) {
    return null;
  }

  // Handle single image case
  if (images.length === 1) {
    return (
      <div className="mb-4">
        <ImageWithCaption
          alt="Memory image"
          className="aspect-video"
          image={images[0]}
          postId={postId}
        />
      </div>
    );
  }

  // Handle multiple images with main image spanning multiple columns/rows
  const [mainImage, ...additionalImages] = images;
  const totalImages = images.length;

  // Adaptive grid based on number of images and screen size
  return (
    <div className="mb-4">
      {/* Mobile layout - vertical stack */}
      <div className="md:hidden space-y-3">
        {/* Main image on mobile */}
        <ImageWithCaption
          alt="Main memory image"
          className="aspect-video"
          image={mainImage}
          postId={postId}
        />

        {/* Additional images in 2-column grid on mobile */}
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {additionalImages.slice(0, 5).map((image, index) => (
              <ImageWithCaption
                key={image.fileId}
                alt={`Memory image ${index + 2}`}
                captionSize="xs"
                className="aspect-square"
                image={image}
                postId={postId}
              />
            ))}

            {/* Remaining count indicator on mobile */}
            {additionalImages.length > 5 && (
              <div className="relative aspect-square overflow-hidden rounded-lg bg-black/20 flex items-center justify-center">
                <div className="text-white text-center">
                  <span className="text-lg font-semibold">
                    +{additionalImages.length - 5}
                  </span>
                  <p className="text-xs opacity-80">more</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop layout - adaptive grid */}
      <div className="hidden md:block">
        {totalImages === 2 ? (
          // 2 images: side by side, larger
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <ImageWithCaption
                key={image.fileId}
                alt={`Memory image ${index + 1}`}
                className="aspect-video"
                image={image}
                postId={postId}
              />
            ))}
          </div>
        ) : totalImages === 3 ? (
          // 3 images: main large + 2 smaller on the side
          <div className="grid grid-cols-3 gap-3 auto-rows-[200px]">
            <ImageWithCaption
              alt="Main memory image"
              className="col-span-2 row-span-2"
              image={mainImage}
              postId={postId}
            />
            {additionalImages.slice(0, 2).map((image, index) => (
              <ImageWithCaption
                key={image.fileId}
                alt={`Memory image ${index + 2}`}
                captionSize="xs"
                className="aspect-square"
                image={image}
                postId={postId}
              />
            ))}
          </div>
        ) : (
          // 4+ images: main large + grid on the side
          <div className="grid grid-cols-4 gap-4 auto-rows-[140px]">
            <ImageWithCaption
              alt="Main memory image"
              className="col-span-2 row-span-2"
              image={mainImage}
              postId={postId}
            />

            {additionalImages.slice(0, 4).map((image, index) => (
              <ImageWithCaption
                key={image.fileId}
                alt={`Memory image ${index + 2}`}
                captionSize="xs"
                className="aspect-square"
                image={image}
                postId={postId}
              />
            ))}

            {additionalImages.length > 4 && (
              <div className="relative aspect-square overflow-hidden rounded-lg bg-black/20 flex items-center justify-center">
                <div className="text-white text-center">
                  <span className="text-lg font-semibold">
                    +{additionalImages.length - 4}
                  </span>
                  <p className="text-xs opacity-80">more</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
