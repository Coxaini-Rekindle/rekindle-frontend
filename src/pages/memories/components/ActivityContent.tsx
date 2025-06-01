import type { MemoryActivityDto } from "@/types/activity";

import ActivityEditForm from "./ActivityEditForm";

interface ActivityContentProps {
  activity: MemoryActivityDto;
  isEditing: boolean;
  onEditSuccess: () => void;
  onEditCancel: () => void;
}

export default function ActivityContent({
  activity,
  isEditing,
  onEditSuccess,
  onEditCancel,
}: ActivityContentProps) {
  if (isEditing) {
    return (
      <ActivityEditForm
        activityId={activity.id}
        initialContent={activity.content}
        isComment={activity.type === "Comment"}
        onCancel={onEditCancel}
        onSuccess={onEditSuccess}
      />
    );
  }

  return <div className="mb-2 whitespace-pre-line">{activity.content}</div>;
}
