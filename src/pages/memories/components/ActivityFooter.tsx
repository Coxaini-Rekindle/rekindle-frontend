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

  // Get reaction metadata
  const getReactionEmoji = (type: ReactionTypeDto): string => {
    const emojiMap = {
      [ReactionTypeDto.Love]: "❤️",
      [ReactionTypeDto.Celebrate]: "🎉",
      [ReactionTypeDto.Support]: "👍",
      [ReactionTypeDto.Laugh]: "😄",
      [ReactionTypeDto.Wow]: "😮",
      [ReactionTypeDto.Grateful]: "🙏",
      [ReactionTypeDto.Warm]: "☀️",
      [ReactionTypeDto.Nostalgic]: "🕰️",
      [ReactionTypeDto.Peaceful]: "☮️",
      [ReactionTypeDto.Memories]: "📸",
      [ReactionTypeDto.Family]: "👪",
      [ReactionTypeDto.Friendship]: "🤝",
      [ReactionTypeDto.Journey]: "🛤️",
      [ReactionTypeDto.Milestone]: "🏆",
      [ReactionTypeDto.Adventure]: "🏕️",
    };

    return emojiMap[type] || "👍";
  };

  // Get reactions that have been used (have counts > 0)
  const usedReactions = Object.entries(activity.reactionSummary.reactionCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: type as ReactionTypeDto,
      count,
      emoji: getReactionEmoji(type as ReactionTypeDto),
      isUserReaction: activity.reactionSummary.userReactions.includes(
        type as ReactionTypeDto,
      ),
    }));

  // Handle clicking on an existing reaction
  const handleExistingReactionClick = (reactionType: ReactionTypeDto) => {
    onReactionClick(reactionType);
  };

  return (
    <div className="py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Existing reactions list */}
        <div className="flex items-center gap-1">
          {usedReactions.map((reaction) => (
            <button
              key={reaction.type}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors hover:bg-default-100 ${
                reaction.isUserReaction
                  ? "bg-primary-100 text-primary-700 border border-primary-200"
                  : "bg-default-50 text-default-700 border border-default-200"
              }`}
              title={`${reaction.count} ${reaction.type}${
                reaction.count !== 1 ? "s" : ""
              }`}
              onClick={() => handleExistingReactionClick(reaction.type)}
            >
              <span className="text-base">{reaction.emoji}</span>
              <span className="font-medium">{reaction.count}</span>
            </button>
          ))}
        </div>

        {/* Add reaction dropdown */}
        <Dropdown
          isOpen={showReactionPicker}
          onOpenChange={(open) => setShowReactionPicker(open)}
        >
          <DropdownTrigger>
            <Button className="min-w-unit-8 px-2" size="sm" variant="light">
              <MdFavorite size={16} />
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Reaction options"
            className="min-w-80 max-h-96 overflow-y-auto"
          >
            <DropdownSection title="Add Reaction">
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
