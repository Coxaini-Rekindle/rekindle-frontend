import { useState, useEffect } from "react";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";

import { memoriesApi } from "@/api/memoriesApi";

interface MemoryImageProps {
  fileId: string;
  postId: string;
  alt: string;
  className?: string;
}

export default function MemoryImage({
  fileId,
  postId,
  alt,
  className = "",
}: MemoryImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Function to load the image
    const loadImage = async () => {
      try {
        setLoading(true);
        // Use the new fetchImage method to get an authenticated blob URL
        const url = await memoriesApi.fetchImage(fileId, postId);

        setImageUrl(url);
        setError(false);
      } catch (err) {
        console.error("Failed to load image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    // Clean up blob URLs on unmount to prevent memory leaks
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [fileId, postId]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-content3 ${className}`}
      >
        <Spinner size="sm" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <Image
        alt={alt}
        className={className}
        src="/images/placeholder-image.svg"
      />
    );
  }

  return <Image alt={alt} className={className} src={imageUrl} />;
}
