import type { MemoryActivityDto } from "@/types/activity";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { MdFavorite, MdReply } from "react-icons/md";

import { ReactionTypeDto } from "@/types/memory";

interface ActivityFooterProps {
  activity: MemoryActivityDto;
  onReactionClick: (reactionType: ReactionTypeDto) => void;
  onReplyClick: () => void;
}

export default function ActivityFooter({
  activity,
  onReactionClick,
  onReplyClick,
}: ActivityFooterProps) {
  const { t } = useTranslation();
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleReactionClick = (reactionType: ReactionTypeDto) => {
    onReactionClick(reactionType);
    setShowReactionPicker(false);
  };

  return (
    <div className="py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Reaction button with dropdown */}
        <Dropdown
          isOpen={showReactionPicker}
          onOpenChange={(open) => setShowReactionPicker(open)}
        >
          <DropdownTrigger>
            <Button
              color={
                activity.reactionSummary.userReactions.length > 0
                  ? "primary"
                  : "default"
              }
              size="sm"
              startContent={<MdFavorite size={16} />}
              variant={
                activity.reactionSummary.userReactions.length > 0
                  ? "solid"
                  : "light"
              }
            >
              {activity.reactionSummary.totalCount > 0 &&
                activity.reactionSummary.totalCount}
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Reaction options"
            className="min-w-80 max-h-96 overflow-y-auto"
          >
            <DropdownSection title="Quick Reactions">
              <DropdownItem
                key="reactions-grid"
                className="p-0"
                textValue="Reaction grid"
              >
                <div className="grid grid-cols-6 gap-2 p-3">
                  {[
                    {
                      type: ReactionTypeDto.Love,
                      emoji: "❤️",
                      label: "Love",
                    },
                    {
                      type: ReactionTypeDto.Celebrate,
                      emoji: "🎉",
                      label: "Celebrate",
                    },
                    {
                      type: ReactionTypeDto.Support,
                      emoji: "👍",
                      label: "Support",
                    },
                    {
                      type: ReactionTypeDto.Laugh,
                      emoji: "😄",
                      label: "Laugh",
                    },
                    {
                      type: ReactionTypeDto.Wow,
                      emoji: "😮",
                      label: "Wow",
                    },
                    {
                      type: ReactionTypeDto.Grateful,
                      emoji: "🙏",
                      label: "Grateful",
                    },
                    {
                      type: ReactionTypeDto.Warm,
                      emoji: "☀️",
                      label: "Warm",
                    },
                    {
                      type: ReactionTypeDto.Nostalgic,
                      emoji: "🕰️",
                      label: "Nostalgic",
                    },
                    {
                      type: ReactionTypeDto.Peaceful,
                      emoji: "☮️",
                      label: "Peaceful",
                    },
                    {
                      type: ReactionTypeDto.Memories,
                      emoji: "📸",
                      label: "Memories",
                    },
                    {
                      type: ReactionTypeDto.Family,
                      emoji: "👪",
                      label: "Family",
                    },
                    {
                      type: ReactionTypeDto.Friendship,
                      emoji: "🤝",
                      label: "Friendship",
                    },
                    {
                      type: ReactionTypeDto.Journey,
                      emoji: "🛤️",
                      label: "Journey",
                    },
                    {
                      type: ReactionTypeDto.Milestone,
                      emoji: "🏆",
                      label: "Milestone",
                    },
                    {
                      type: ReactionTypeDto.Adventure,
                      emoji: "🏕️",
                      label: "Adventure",
                    },
                  ].map((reaction) => (
                    <button
                      key={reaction.type}
                      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-default-100 transition-colors group"
                      title={reaction.label}
                      onClick={() => handleReactionClick(reaction.type)}
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                        {reaction.emoji}
                      </span>
                      <span className="text-xs text-default-600 leading-tight">
                        {reaction.label}
                      </span>
                    </button>
                  ))}
                </div>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        {/* Reply button */}
        <Button
          size="sm"
          startContent={<MdReply size={16} />}
          variant="light"
          onPress={onReplyClick}
        >
          {t("activities.reply")}
        </Button>
      </div>
    </div>
  );
}
