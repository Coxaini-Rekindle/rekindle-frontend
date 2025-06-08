import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useTranslation } from "react-i18next";
import { MdArrowForward, MdCalendarToday, MdFolder } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { SearchMemoryResponse } from "@/types/search";
import MemoryImage from "@/components/MemoryImage";

interface SearchResultCardProps {
  result: SearchMemoryResponse;
  groupId: string;
}

export default function SearchResultCard({
  result,
  groupId,
}: SearchResultCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleViewMemory = () => {
    navigate(`/memories/${result.memoryId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardBody className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            <MdFolder className="text-primary" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {result.title || "Untitled Memory"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MdCalendarToday className="text-foreground-400" size={16} />
              <span className="text-sm text-foreground-500">
                {formatDate(result.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-divider my-3" />

        {/* Image and Content */}
        <div className="space-y-3">
          {" "}
          {/* Image */}
          <div className="relative aspect-video bg-content2 rounded-lg overflow-hidden">
            <MemoryImage
              alt={result.photo.title || "Memory image"}
              className="w-full h-full object-cover"
              fileId={result.photo.photoId}
              postId={result.photo.postId}
            />
          </div>
          {/* Post Content Preview */}
          {result.photo.content && (
            <div className="bg-content1 rounded-lg p-3">
              <p className="text-sm text-foreground-600 line-clamp-2">
                {result.photo.content}
              </p>
            </div>
          )}
          {/* Memory Content Preview */}
          {result.content && (
            <div className="bg-content1 rounded-lg p-3">
              <Chip className="mb-2" size="sm" variant="flat">
                Memory Description
              </Chip>
              <p className="text-sm text-foreground-600 line-clamp-2">
                {result.content}
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-divider my-3" />

        {/* Action */}
        <div className="flex justify-end">
          <Button
            color="primary"
            endContent={<MdArrowForward size={16} />}
            size="sm"
            variant="flat"
            onPress={handleViewMemory}
          >
            {t("search.viewMemory")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
