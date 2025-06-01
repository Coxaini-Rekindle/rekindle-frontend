import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { MdAdd, MdPhoto, MdClose } from "react-icons/md";

interface AddPostSectionProps {
  isAddingPost: boolean;
  newPost: string;
  postTitle: string;
  postImages: File[];
  onToggleAddingPost: (isAdding: boolean) => void;
  onPostChange: (post: string) => void;
  onPostTitleChange: (title: string) => void;
  onPostImagesChange: (images: File[]) => void;
  onSubmitPost: () => void;
}

export default function AddPostSection({
  isAddingPost,
  newPost,
  postTitle,
  postImages,
  onToggleAddingPost,
  onPostChange,
  onPostTitleChange,
  onPostImagesChange,
  onSubmitPost,
}: AddPostSectionProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      onPostImagesChange(Array.from(files));
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = postImages.filter(
      (_, index) => index !== indexToRemove,
    );

    onPostImagesChange(updatedImages);
  };

  const handleCancel = () => {
    onToggleAddingPost(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
                {/* Title Input */}
                <Input
                  placeholder={t("memories.createModal.titlePlaceholder")}
                  value={postTitle}
                  onChange={(e) => onPostTitleChange(e.target.value)}
                />

                {/* Content Textarea */}
                <Textarea
                  placeholder={t("memories.createModal.contentPlaceholder")}
                  value={newPost}
                  onChange={(e) => onPostChange(e.target.value)}
                />

                {/* Image Upload */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      className="hidden"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <Button
                      startContent={<MdPhoto size={16} />}
                      variant="flat"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      {t("memories.createModal.imagesLabel")}
                    </Button>
                  </div>

                  {/* Image Previews */}
                  {postImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {postImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            src={URL.createObjectURL(image)}
                          />
                          <Button
                            isIconOnly
                            className="absolute top-1 right-1 min-w-6 h-6"
                            color="danger"
                            size="sm"
                            variant="solid"
                            onPress={() => handleRemoveImage(index)}
                          >
                            <MdClose size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="flat" onPress={handleCancel}>
                    {t("memories.createModal.cancelButton")}
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={!newPost.trim()}
                    onPress={onSubmitPost}
                  >
                    {t("memories.post")}
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
