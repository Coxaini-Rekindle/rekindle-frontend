import type { AppDispatch } from "@/store";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

import { updateComment } from "@/store/slices/activitiesSlice";

interface ActivityEditFormProps {
  activityId: string;
  initialContent: string;
  isComment: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ActivityEditForm({
  activityId,
  initialContent,
  isComment,
  onCancel,
  onSuccess,
}: ActivityEditFormProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !isComment) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateComment({
          commentId: activityId,
          commentData: {
            content: content.trim(),
          },
        }),
      );

      onSuccess();
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Textarea
        disabled={isSubmitting}
        minRows={3}
        placeholder={t("activities.contentPlaceholder")}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button
          disabled={isSubmitting}
          size="sm"
          variant="flat"
          onPress={onCancel}
        >
          {t("common.cancel")}
        </Button>
        <Button
          color="primary"
          isDisabled={!content.trim() || content === initialContent}
          isLoading={isSubmitting}
          size="sm"
          onPress={handleSubmit}
        >
          {t("activities.update")}
        </Button>
      </div>
    </div>
  );
}
