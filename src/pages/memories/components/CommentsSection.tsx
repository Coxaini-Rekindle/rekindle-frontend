import type { MemoryDto } from "@/types/memory";

import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { MdSend } from "react-icons/md";

interface CommentsSectionProps {
  memory: MemoryDto;
  newComment: string;
  onCommentChange: (comment: string) => void;
  onSubmitComment: () => void;
}

export default function CommentsSection({
  memory: _memory,
  newComment,
  onCommentChange,
  onSubmitComment,
}: CommentsSectionProps) {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitComment();
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{t("memories.commentsTitle")}</h3>
      </CardHeader>
      <Divider />
      <CardBody>
        {/* Comments List - Legacy component, comments now handled differently in new API */}
        <div className="space-y-4">
          <div className="py-8 text-center">
            <p className="text-foreground-400">{t("memories.noComments")}</p>
            <p className="text-xs text-foreground-300 mt-2">
              {t("memories.commentsComingSoon", "Comments feature coming soon")}
            </p>
          </div>
        </div>

        {/* Add Comment */}
        <Divider className="my-4" />
        <div className="flex gap-3">
          <Avatar name="You" size="sm" />
          <div className="flex flex-1 gap-2">
            <Input
              className="flex-1"
              placeholder={t("memories.addComment")}
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button isIconOnly color="primary" onPress={onSubmitComment}>
              <MdSend size={16} />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
