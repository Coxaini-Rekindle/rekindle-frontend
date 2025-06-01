import type { MemoryActivityDto } from "@/types/activity";
import type { AppDispatch, RootState } from "@/store";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardFooter } from "@heroui/card";

import ActivityHeader from "./ActivityHeader";
import ActivityContent from "./ActivityContent";
import ActivityImages from "./ActivityImages";
import ActivityFooter from "./ActivityFooter";
import ActivityReplyForm from "./ActivityReplyForm";

import {
  addReaction,
  removeReaction,
  deleteComment,
} from "@/store/slices/activitiesSlice";
import { ReactionTypeDto } from "@/types/memory";

interface ActivityItemProps {
  activity: MemoryActivityDto;
  memoryId: string;
}

export default function ActivityItem({
  activity,
  memoryId,
}: ActivityItemProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user);
  const groupMembers = useSelector(
    (state: RootState) => state.groups.currentGroupMembers,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Find the creator's information
  const creator = groupMembers.find(
    (member) => member.userId === activity.creatorUserId,
  );

  // Check if the current user is the creator
  const isOwner = currentUser?.currentUserId === activity.creatorUserId;

  // Handle reactions
  const handleReactionClick = async (reactionType: ReactionTypeDto) => {
    // Check if user already has this reaction type
    const hasThisReaction =
      activity.reactionSummary.userReactions.includes(reactionType);

    if (hasThisReaction) {
      // Remove existing reaction
      await dispatch(
        removeReaction({
          activityId: activity.id,
          isComment: activity.type === "Comment",
        }),
      );
    } else {
      // Add new reaction (will replace existing one if any)
      await dispatch(
        addReaction({
          activityId: activity.id,
          isComment: activity.type === "Comment",
          reactionData: { type: reactionType },
        }),
      );
    }
  };

  // Handle comment deletion
  const handleDelete = async () => {
    if (
      activity.type === "Comment" &&
      window.confirm(t("common.confirmDelete"))
    ) {
      await dispatch(deleteComment(activity.id));
    }
  };

  return (
    <Card>
      <CardBody className="py-3">
        <ActivityHeader
          activity={activity}
          creator={creator || null}
          isOwner={isOwner}
          onDelete={handleDelete}
          onEdit={() => setIsEditing(true)}
        />

        <ActivityContent
          activity={activity}
          isEditing={isEditing}
          onEditCancel={() => setIsEditing(false)}
          onEditSuccess={() => setIsEditing(false)}
        />

        {activity.images && activity.images.length > 0 && (
          <ActivityImages activity={activity} />
        )}
      </CardBody>

      <CardFooter className="py-2 px-4 flex items-center justify-between">
        <ActivityFooter
          activity={activity}
          onReactionClick={handleReactionClick}
          onReplyClick={() => setIsReplying(!isReplying)}
        />

        {/* Activity type indicator */}
        <div className="text-small text-foreground-500">
          {activity.type === "Post"
            ? t("activities.post")
            : t("activities.comment")}
        </div>
      </CardFooter>

      {/* Reply form */}
      {isReplying && (
        <div className="px-4 pb-4">
          <ActivityReplyForm
            memoryId={memoryId}
            replyToCommentId={activity.type === "Comment" ? activity.id : null}
            replyToPostId={activity.type === "Post" ? activity.id : null}
            onCancel={() => setIsReplying(false)}
            onSuccess={() => setIsReplying(false)}
          />
        </div>
      )}
    </Card>
  );
}
