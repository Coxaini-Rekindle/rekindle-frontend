import type { MemoryDto } from "@/types/memory";

import { useTranslation } from "react-i18next";
import { MdFavorite } from "react-icons/md";

interface MemoryStatsProps {
  memory: MemoryDto;
}

export default function MemoryStats({ memory }: MemoryStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 text-foreground-500">
      <div className="flex items-center gap-1">
        <MdFavorite size={16} />
        <span className="text-small">{memory.reactions?.length || 0}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-small">
          {t("memories.comments", { count: memory.comments.length })}
        </span>
      </div>
    </div>
  );
}
