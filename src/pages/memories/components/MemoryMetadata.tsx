import type { MemoryDto } from "@/types/memory";

import { Chip } from "@heroui/chip";
import { MdCalendarToday, MdLocationOn, MdPeople } from "react-icons/md";

interface MemoryMetadataProps {
  memory: MemoryDto;
  locations: string[];
}

export default function MemoryMetadata({
  memory,
  locations,
}: MemoryMetadataProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-2 flex items-center gap-2 text-small text-foreground-500">
        <MdCalendarToday size={16} />
        <span>{formatDate(memory.createdAt)}</span>
      </div>

      {locations.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-small text-foreground-500">
          <MdLocationOn size={16} />
          <div className="flex flex-wrap gap-1">
            {locations.map((location, index) => (
              <Chip key={index} size="sm" variant="flat">
                {location}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {memory.people.length > 0 && (
        <div className="flex items-center gap-2">
          <MdPeople className="text-foreground-500" size={16} />
          <div className="flex flex-wrap gap-2">
            {memory.people.map((person) => (
              <Chip key={person.id} color="secondary" size="sm" variant="flat">
                {person.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
