import type { MemoryActivityDto } from "@/types/activity";

import MemoryCardImageGrid from "./MemoryCardImageGrid";

interface ActivityImagesProps {
  activity: MemoryActivityDto;
}

export default function ActivityImages({ activity }: ActivityImagesProps) {
  if (!activity.images || activity.images.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 mb-2">
      <MemoryCardImageGrid images={activity.images} postId={activity.id} />
      <div className="text-small text-foreground-500">
        {activity.images.length}{" "}
        {activity.images.length === 1 ? "image" : "images"}
      </div>
    </div>
  );
}
