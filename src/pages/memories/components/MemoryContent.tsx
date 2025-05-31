import type { MemoryDto } from "@/types/memory";

import { Card, CardHeader, CardBody } from "@heroui/card";

import MemoryMetadata from "./MemoryMetadata";
import MemoryImageGrid from "./MemoryImageGrid";
import MemoryStats from "./MemoryStats";

interface MemoryContentProps {
  memory: MemoryDto;
  locations: string[];
}

export default function MemoryContent({
  memory,
  locations,
}: MemoryContentProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex gap-3 pb-3">
        <MemoryMetadata locations={locations} memory={memory} />
      </CardHeader>

      <CardBody className="pt-0">
        {/* Images Grid */}
        <MemoryImageGrid
          images={memory.mainPost?.images || []}
          postId={memory.mainPostId}
        />

        {/* Description */}
        {memory.description && (
          <div className="mb-4">
            <p className="text-foreground-700">{memory.description}</p>
          </div>
        )}

        {/* Interaction Stats */}
        <MemoryStats memory={memory} />
      </CardBody>
    </Card>
  );
}
