import type { AppDispatch } from "@/store";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

import { createComment } from "@/store/slices/activitiesSlice";

interface ActivityReplyFormProps {
  memoryId: string;
  replyToPostId: string | null;
  replyToCommentId: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ActivityReplyForm({
  memoryId,
  replyToPostId,
  replyToCommentId,
  onCancel,
  onSuccess,
}: ActivityReplyFormProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createComment({
          memoryId,
          commentData: {
            content: content.trim(),
            replyToPostId,
            replyToCommentId,
          },
        }),
      );

      setContent("");
      onSuccess();
    } catch {
      // Failed to create comment
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Textarea
        disabled={isSubmitting}
        minRows={2}
        placeholder={t("activities.replyPlaceholder")}
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
          isDisabled={!content.trim()}
          isLoading={isSubmitting}
          size="sm"
          onPress={handleSubmit}
        >
          {t("activities.submitReply")}
        </Button>
      </div>
    </div>
  );
}
