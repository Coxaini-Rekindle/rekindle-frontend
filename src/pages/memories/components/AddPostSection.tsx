import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { MdAdd } from "react-icons/md";

interface AddPostSectionProps {
  isAddingPost: boolean;
  newPost: string;
  onToggleAddingPost: (isAdding: boolean) => void;
  onPostChange: (post: string) => void;
  onSubmitPost: () => void;
}

export default function AddPostSection({
  isAddingPost,
  newPost,
  onToggleAddingPost,
  onPostChange,
  onSubmitPost,
}: AddPostSectionProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <CardBody>
        <div className="flex items-center gap-3">
          <Avatar name="You" size="sm" />
          <div className="flex-1">
            {!isAddingPost ? (
              <Button
                className="w-full justify-start"
                startContent={<MdAdd size={16} />}
                variant="flat"
                onPress={() => onToggleAddingPost(true)}
              >
                {t("memories.addPost")}
              </Button>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder={t("memories.postPlaceholder")}
                  value={newPost}
                  onChange={(e) => onPostChange(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="flat"
                    onPress={() => onToggleAddingPost(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={!newPost.trim()}
                    onPress={onSubmitPost}
                  >
                    {t("common.post")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
