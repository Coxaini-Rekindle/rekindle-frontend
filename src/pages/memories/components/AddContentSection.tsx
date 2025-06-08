import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { MdSend, MdPhoto, MdClose } from "react-icons/md";

interface AddContentSectionProps {
  isSubmitting: boolean;
  onSubmitComment: (content: string) => Promise<void>;
  onSubmitPost: (
    content: string,
    title: string,
    images: File[],
  ) => Promise<void>;
}

export default function AddContentSection({
  isSubmitting,
  onSubmitComment,
  onSubmitPost,
}: AddContentSectionProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);

    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      if (images.length > 0) {
        // Has images, so it's a post
        await onSubmitPost(content.trim(), title.trim(), images);
      } else {
        // No images, so it's a comment
        await onSubmitComment(content.trim());
      }

      // Clear form after successful submission
      setContent("");
      setTitle("");
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // Handle error silently - parent component should handle error display
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isPost = images.length > 0;

  return (
    <Card>
      <CardBody>
        <div className="flex gap-3">
          <Avatar name="You" size="sm" />
          <div className="flex-1 space-y-3">
            {/* Title input - only shown when there are images (post) */}
            {isPost && (
              <Input
                placeholder={t("memories.createModal.titlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            )}
            {/* Content input */}
            <div className="flex gap-2">
              <Textarea
                className="flex-1"
                disabled={isSubmitting}
                maxRows={isPost ? 6 : 4}
                minRows={1}
                placeholder={
                  isPost
                    ? t("memories.createModal.contentPlaceholder")
                    : t("memories.addComment")
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex flex-col gap-2">
                {/* Image upload button */}
                <input
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleImageUpload}
                />
                <Button
                  isIconOnly
                  color={isPost ? "primary" : "default"}
                  variant={isPost ? "solid" : "flat"}
                  onPress={() => fileInputRef.current?.click()}
                >
                  <MdPhoto size={16} />
                </Button>

                {/* Submit button */}
                <Button
                  isIconOnly
                  color="primary"
                  isDisabled={!content.trim()}
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                >
                  <MdSend size={16} />{" "}
                </Button>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-foreground-600">
                  {t("memories.createModal.imagesLabel")} -{" "}
                  {t("memories.postMode")}
                </p>{" "}
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg bg-content2 overflow-hidden"
                    >
                      <Image
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-auto object-cover rounded-lg"
                        src={URL.createObjectURL(image)}
                      />
                      <Button
                        isIconOnly
                        className="absolute top-1 right-1 min-w-5 h-5 z-10 bg-danger/90 hover:bg-danger"
                        color="danger"
                        size="sm"
                        variant="solid"
                        onPress={() => handleRemoveImage(index)}
                      >
                        <MdClose size={10} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Mode indicator */}
            <div className="flex justify-between items-center text-xs text-foreground-400">
              <span>
                {isPost ? t("memories.postMode") : t("memories.commentMode")}
              </span>
              <span>{t("memories.enterToSubmit")}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
