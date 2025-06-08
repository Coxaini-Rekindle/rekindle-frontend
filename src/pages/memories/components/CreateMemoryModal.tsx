import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";
import { useTranslation } from "react-i18next";
import { MdTitle, MdDescription, MdPhoto, MdClose } from "react-icons/md";

import { useMemories } from "@/hooks/useMemories";

interface CreateMemoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  groupId: string;
}

export default function CreateMemoryModal({
  isOpen,
  onOpenChange,
  groupId,
}: CreateMemoryModalProps) {
  const { t } = useTranslation();
  const { createMemory } = useMemories(groupId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    participant?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      // Validate file types and sizes
      const validFiles: File[] = [];
      const maxSize = 5 * 1024 * 1024; // 5MB

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          // Could show a toast error here
          return;
        }
        if (file.size > maxSize) {
          // Could show a toast error here
          return;
        }
        validFiles.push(file);
      });

      setImages(validFiles);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);

    setImages(updatedImages);
  };
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Reset errors
    const newErrors: typeof errors = {};

    // Validate form
    if (!title.trim()) {
      newErrors.title = t("memories.createModal.validation.titleRequired");
    }

    if (!content.trim()) {
      newErrors.content = t("memories.createModal.validation.contentRequired");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await createMemory(groupId, {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          images,
        });

        // Reset form and close modal
        handleClose();
        onOpenChange(false);
      } catch {
        // Handle error - could set an error state here
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleButtonSubmit = () => {
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClose = () => {
    // Reset form and errors when modal is closed
    setTitle("");
    setDescription("");
    setContent("");
    setImages([]);
    setErrors({});
    setIsSubmitting(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal
      isDismissable
      isOpen={isOpen}
      size="lg"
      onOpenChange={(open) => {
        if (!open) handleClose();
        onOpenChange(open);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {t("memories.createModal.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Share a special moment with your group
              </p>
            </ModalHeader>
            <ModalBody className="px-6 py-4">
              <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4">
                <Form
                  className="w-full gap-4"
                  validationErrors={errors}
                  onSubmit={handleSubmit}
                >
                  {/* Title */}
                  <Input
                    isRequired
                    className="rounded-md"
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return t(
                          "memories.createModal.validation.titleRequired",
                        );
                      }
                    }}
                    isInvalid={!!errors.title}
                    label={t("memories.createModal.titleLabel")}
                    labelPlacement="outside"
                    name="title"
                    placeholder={t("memories.createModal.titlePlaceholder")}
                    startContent={<MdTitle className="text-default-400" />}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  {/* Description */}
                  <Input
                    className="rounded-md"
                    label={t("memories.createModal.descriptionLabel")}
                    labelPlacement="outside"
                    name="description"
                    placeholder={t(
                      "memories.createModal.descriptionPlaceholder",
                    )}
                    startContent={
                      <MdDescription className="text-default-400" />
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  {/* Main Post Content */}
                  <Textarea
                    isRequired
                    className="rounded-md"
                    errorMessage={({ validationDetails }) => {
                      if (validationDetails.valueMissing) {
                        return t(
                          "memories.createModal.validation.contentRequired",
                        );
                      }
                    }}
                    isInvalid={!!errors.content}
                    label={t("memories.createModal.contentLabel")}
                    labelPlacement="outside"
                    minRows={3}
                    name="content"
                    placeholder={t("memories.createModal.contentPlaceholder")}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("memories.createModal.imagesLabel")}
                    </label>

                    <div className="flex gap-2">
                      <Input
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        className="rounded-md"
                        startContent={<MdPhoto className="text-default-400" />}
                        type="file"
                        onChange={handleImageUpload}
                      />
                    </div>
                    {images.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-foreground-600">
                          {images.length}{" "}
                          {images.length === 1 ? "image" : "images"} selected
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {images.map((image, index) => (
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
                      </div>
                    )}
                  </div>
                </Form>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isSubmitting}
                variant="light"
                onPress={onClose}
              >
                {t("memories.createModal.cancelButton")}
              </Button>
              <Button
                className="transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                color="primary"
                isLoading={isSubmitting}
                type="submit"
                onPress={handleButtonSubmit}
              >
                {t("memories.createModal.createButton")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
