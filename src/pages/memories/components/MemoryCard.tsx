import type { MemoryDto } from "@/types/memory";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  MdCalendarToday,
  MdLocationOn,
  MdMessage,
  MdFavorite,
  MdPeople,
} from "react-icons/md";

import MemoryCardImageGrid from "./MemoryCardImageGrid";

interface MemoryCardProps {
  memory: MemoryDto;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get unique locations from all images and memory locations
  const getAllLocations = () => {
    const locations = new Set<string>();

    // Add memory-level locations
    memory.locations.forEach((location) => {
      if (location.name) {
        locations.add(location.name);
      }
    });

    // Add image-level locations
    memory.images.forEach((image) => {
      if (image.location?.name) {
        locations.add(image.location.name);
      }
    });

    return Array.from(locations);
  };

  const locations = getAllLocations();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReactionCount = () => {
    return memory.reactions?.length || 0;
  };

  const getCommentCount = () => {
    return memory.comments?.length || 0;
  };

  const handleOpenMemory = () => {
    navigate(`/memories/${memory.id}`);
  };

  return (
    <Card className="w-full mb-6 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex gap-3 pb-3">
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 text-small text-foreground-500 mb-2">
            <MdCalendarToday size={16} />
            <span>{formatDate(memory.createdAt)}</span>
          </div>

          {locations.length > 0 && (
            <div className="flex items-center gap-2 text-small text-foreground-500 mb-2">
              <MdLocationOn size={16} />
              <div className="flex flex-wrap gap-1">
                {locations.slice(0, 2).map((location, index) => (
                  <Chip key={index} size="sm" variant="flat">
                    {location}
                  </Chip>
                ))}
                {locations.length > 2 && (
                  <Chip size="sm" variant="flat">
                    +{locations.length - 2} more
                  </Chip>
                )}
              </div>
            </div>
          )}

          {memory.people.length > 0 && (
            <div className="flex items-center gap-2">
              <MdPeople className="text-foreground-500" size={16} />
              <AvatarGroup max={5} size="sm">
                {memory.people.map((person) => (
                  <Avatar
                    key={person.id}
                    name={person.name}
                    size="sm"
                    src={person.avatarUrl}
                  />
                ))}
              </AvatarGroup>
              {memory.people.length > 5 && (
                <span className="text-small text-foreground-500">
                  +{memory.people.length - 5} others
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        {/* Image Grid */}
        <MemoryCardImageGrid images={memory.images} />

        {/* Caption/Description */}
        {memory.description && (
          <p className="text-foreground-700 mb-4 line-clamp-3">
            {memory.description}
          </p>
        )}

        {/* Interaction Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-divider">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-foreground-500">
              <MdFavorite size={16} />
              <span className="text-small">{getReactionCount()}</span>
            </div>
            <div className="flex items-center gap-1 text-foreground-500">
              <MdMessage size={16} />
              <span className="text-small">{getCommentCount()}</span>
            </div>
          </div>

          <Button size="sm" variant="flat" onPress={handleOpenMemory}>
            {t("memories.viewThread")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
