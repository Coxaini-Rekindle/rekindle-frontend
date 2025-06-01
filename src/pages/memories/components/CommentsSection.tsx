import type { AppDispatch } from "@/store";
import type { MemoryDto } from "@/types/memory";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { MdSend } from "react-icons/md";

import ActivityItem from "./ActivityItem";

import { createComment } from "@/store/slices/activitiesSlice";
import { useActivities } from "@/hooks/useActivities";

interface CommentsSectionProps {
  memory: MemoryDto;
}

export default function CommentsSection({ memory }: CommentsSectionProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const {
    activities,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMoreActivities,
  } = useActivities(memory.id);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle submit new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !memory.id) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createComment({
          memoryId: memory.id,
          commentData: {
            content: newComment.trim(),
            replyToPostId: null,
            replyToCommentId: null,
          },
        }),
      );

      setNewComment("");
    } catch {
      // Failed to create comment
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{t("memories.commentsTitle")}</h3>
      </CardHeader>
      <Divider />
      <CardBody>
        {isLoading && activities.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <Spinner size="sm" />
            <span className="ml-2">{t("activities.loading")}</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-danger mb-4">{error}</p>
            <Button variant="bordered" onPress={() => window.location.reload()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-foreground-400">{t("memories.noComments")}</p>
            <p className="text-xs text-foreground-300 mt-2">
              {t("activities.beFirstToComment")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                memoryId={memory.id}
              />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  isLoading={isLoadingMore}
                  variant="flat"
                  onPress={() => loadMoreActivities(memory.id)}
                >
                  {t("activities.loadMore")}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add Comment */}
        <Divider className="my-4" />
        <div className="flex gap-3">
          <Avatar name="You" size="sm" />
          <div className="flex flex-1 gap-2">
            <Textarea
              className="flex-1"
              disabled={isSubmitting}
              maxRows={4}
              minRows={1}
              placeholder={t("memories.addComment")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              isIconOnly
              color="primary"
              isDisabled={!newComment.trim()}
              isLoading={isSubmitting}
              onPress={handleSubmitComment}
            >
              <MdSend size={16} />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
