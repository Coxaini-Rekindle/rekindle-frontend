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
  memory,
  newComment,
  onCommentChange,
  onSubmitComment,
}: CommentsSectionProps) {
  const { t } = useTranslation();

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t("memories.justNow");
    if (diffMins < 60) return t("memories.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("memories.hoursAgo", { count: diffHours });
    if (diffDays < 7) return t("memories.daysAgo", { count: diffDays });

    return date.toLocaleDateString();
  };

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
        {/* Comments List */}
        <div className="space-y-4">
          {memory.comments.map((comment, index) => (
            <div key={comment.id}>
              <div className="flex gap-3">
                <Avatar
                  name={comment.authorName}
                  size="sm"
                  src={comment.authorAvatar}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {comment.authorName}
                    </span>
                    <span className="text-small text-foreground-400">
                      {formatCommentDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-foreground-700">{comment.content}</p>
                </div>
              </div>
              {index < memory.comments.length - 1 && (
                <Divider className="mt-4" />
              )}
            </div>
          ))}

          {memory.comments.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-foreground-400">{t("memories.noComments")}</p>
            </div>
          )}
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
