import type { MemoryDto } from "@/types/memory";
import type { GroupMemberDto } from "@/types/group";
import type { RootState, AppDispatch } from "@/store";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdCalendarToday, MdPeople, MdImage } from "react-icons/md";

import MemoryCardImageGrid from "./MemoryCardImageGrid";
import MemoryReactionBar from "./MemoryReactionBar";

import { userApi } from "@/api/userApi";
import {
  addMemoryMainPostReaction,
  removeMemoryMainPostReaction,
} from "@/store/slices/activitiesSlice";
import { updateMemoryMainPostReactions } from "@/store/slices/memoriesSlice";
import { ReactionTypeDto } from "@/types/memory";

interface MemoryCardProps {
  memory: MemoryDto;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get group members to display participant names
  const currentGroupMembers = useSelector(
    (state: RootState) => state.groups.currentGroupMembers,
  );

  // Get participant users
  const getParticipants = (): GroupMemberDto[] => {
    const participants: GroupMemberDto[] = [];

    memory.participantsIds.forEach((participantId) => {
      const member = currentGroupMembers.find(
        (m) => m.userId === participantId,
      );

      if (member) {
        participants.push(member);
      }
    });

    return participants;
  };

  // Get creator user
  const getCreator = (): GroupMemberDto | null => {
    const creatorMember = currentGroupMembers.find(
      (m) => m.userId === memory.creatorUserId,
    );

    return creatorMember || null;
  };

  const participants = getParticipants();
  const creator = getCreator();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageCount = () => {
    return memory.mainPost?.images?.length || 0;
  };
  const handleOpenMemory = () => {
    navigate(`/memories/${memory.id}`);
  };

  // Handle reactions on memory main post
  const handleReactionClick = async (reactionType: ReactionTypeDto) => {
    if (!memory.mainPost) return;

    // Check if user already has this reaction type
    const hasThisReaction =
      memory.mainPost.reactionSummary.userReactions.includes(reactionType);

    try {
      if (hasThisReaction) {
        // Remove existing reaction
        const result = await dispatch(
          removeMemoryMainPostReaction({
            postId: memory.mainPost.id,
          }),
        );

        if (removeMemoryMainPostReaction.fulfilled.match(result)) {
          // Update memory in the memories store
          dispatch(
            updateMemoryMainPostReactions({
              memoryId: memory.id,
              reactionSummary: result.payload.reactionSummary,
            }),
          );
        }
      } else {
        // Add new reaction (will replace existing one if any)
        const result = await dispatch(
          addMemoryMainPostReaction({
            postId: memory.mainPost.id,
            reactionData: { type: reactionType },
          }),
        );

        if (addMemoryMainPostReaction.fulfilled.match(result)) {
          // Update memory in the memories store
          dispatch(
            updateMemoryMainPostReactions({
              memoryId: memory.id,
              reactionSummary: result.payload.reactionSummary,
            }),
          );
        }
      }
    } catch {
      // Silently handle error - could be logged to error service in production
    }
  };

  return (
    <Card className="w-full mb-6 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex gap-3 pb-3">
        <div className="flex items-center gap-3 w-full">
          {creator && (
            <Avatar
              name={creator.name}
              size="md"
              src={
                creator.avatarFileId
                  ? userApi.getAvatarUrl(creator.avatarFileId)
                  : undefined
              }
            />
          )}

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground">
                {memory.title}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-small text-foreground-500">
              <div className="flex items-center gap-1">
                <MdCalendarToday size={14} />
                <span>{formatDate(memory.createdAt)}</span>
              </div>

              {creator && <span>by {creator.name}</span>}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        {/* Description */}
        {memory.description && (
          <p className="text-foreground-700 mb-4 line-clamp-3">
            {memory.description}
          </p>
        )}
        {/* Main Post Content Preview */}
        {memory.mainPost && (
          <div className="bg-content2 rounded-lg p-3 mb-4">
            <p className="text-foreground-600 line-clamp-2">
              {memory.mainPost.content}
            </p>

            {/* Display images using MemoryCardImageGrid if images exist */}
            {memory.mainPost.images && memory.mainPost.images.length > 0 && (
              <MemoryCardImageGrid
                images={memory.mainPost.images}
                postId={memory.mainPost.id}
              />
            )}

            {getImageCount() > 0 && (
              <div className="flex items-center gap-1 mt-2 text-small text-foreground-500">
                <MdImage size={14} />
                <span>
                  {getImageCount()} {getImageCount() === 1 ? "image" : "images"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Participants */}
        {participants.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <MdPeople className="text-foreground-500" size={16} />
            <AvatarGroup max={5} size="sm">
              {participants.map((participant) => (
                <Avatar
                  key={participant.userId}
                  name={participant.name}
                  size="sm"
                  src={
                    participant.avatarFileId
                      ? userApi.getAvatarUrl(participant.avatarFileId)
                      : undefined
                  }
                />
              ))}
            </AvatarGroup>
            {participants.length > 5 && (
              <span className="text-small text-foreground-500">
                +{participants.length - 5} others
              </span>
            )}{" "}
          </div>
        )}

        {/* Interaction Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-divider">
          <div className="flex items-center gap-4">
            {/* Interactive reaction bar for memory main post */}
            {memory.mainPost && (
              <MemoryReactionBar
                mainPost={memory.mainPost}
                onReactionClick={handleReactionClick}
              />
            )}
            {getImageCount() > 0 && (
              <div className="flex items-center gap-1 text-foreground-500">
                <MdImage size={16} />
                <span className="text-small">{getImageCount()}</span>
              </div>
            )}
          </div>

          <Button size="sm" variant="flat" onPress={handleOpenMemory}>
            {t("memories.viewMemory")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
