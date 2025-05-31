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
import { Chip } from "@heroui/chip";
import { useTranslation } from "react-i18next";
import {
  MdTitle,
  MdDescription,
  MdPhoto,
  MdPerson,
  MdAdd,
} from "react-icons/md";

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
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    participant?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddParticipant = () => {
    if (!currentParticipant.trim()) return;

    if (!participantIds.includes(currentParticipant)) {
      setParticipantIds([...participantIds, currentParticipant]);
    }

    setCurrentParticipant("");
    setErrors({ ...errors, participant: undefined });
  };

  const handleRemoveParticipant = (participantToRemove: string) => {
    setParticipantIds(
      participantIds.filter((id) => id !== participantToRemove),
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleSubmit = async () => {
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
      try {
        await createMemory(groupId, {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          images,
          participantIds: participantIds.join(","),
          // existingFileIds can be added later if needed
        });

        // Reset form and close modal
        handleClose();
        onOpenChange(false);
      } catch {
        // Handle error - could set an error state here
      }
    }
  };

  const handleClose = () => {
    // Reset form and errors when modal is closed
    setTitle("");
    setDescription("");
    setContent("");
    setImages([]);
    setParticipantIds([]);
    setCurrentParticipant("");
    setErrors({});

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
            <ModalHeader className="flex flex-col gap-1">
              {t("memories.createModal.title")}
            </ModalHeader>
            <ModalBody>
              <Form
                className="w-full space-y-4"
                validationErrors={errors}
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Title */}
                <Input
                  isRequired
                  errorMessage={errors.title}
                  isInvalid={!!errors.title}
                  label={t("memories.createModal.titleLabel")}
                  labelPlacement="outside"
                  placeholder={t("memories.createModal.titlePlaceholder")}
                  startContent={<MdTitle className="text-default-400" />}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {/* Description */}
                <Input
                  label={t("memories.createModal.descriptionLabel")}
                  labelPlacement="outside"
                  placeholder={t("memories.createModal.descriptionPlaceholder")}
                  startContent={<MdDescription className="text-default-400" />}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Main Post Content */}
                <Textarea
                  isRequired
                  errorMessage={errors.content}
                  isInvalid={!!errors.content}
                  label={t("memories.createModal.contentLabel")}
                  labelPlacement="outside"
                  minRows={3}
                  placeholder={t("memories.createModal.contentPlaceholder")}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                      startContent={<MdPhoto className="text-default-400" />}
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-foreground-500">
                        {images.length}{" "}
                        {images.length === 1 ? "image" : "images"} selected
                      </p>
                    </div>
                  )}
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("memories.createModal.participantsLabel")}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      className="flex-1"
                      errorMessage={errors.participant}
                      isInvalid={!!errors.participant}
                      placeholder={t(
                        "memories.createModal.participantsPlaceholder",
                      )}
                      startContent={<MdPerson className="text-default-400" />}
                      value={currentParticipant}
                      onChange={(e) => setCurrentParticipant(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddParticipant();
                        }
                      }}
                    />
                    <Button
                      isIconOnly
                      color="primary"
                      onPress={handleAddParticipant}
                    >
                      <MdAdd />
                    </Button>
                  </div>

                  {/* Participant chips */}
                  {participantIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {participantIds.map((participantId) => (
                        <Chip
                          key={participantId}
                          color="primary"
                          variant="flat"
                          onClose={() => handleRemoveParticipant(participantId)}
                        >
                          {participantId}
                        </Chip>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-foreground-400 mt-1">
                    {t("memories.createModal.participantsHint")}
                  </p>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("memories.createModal.cancelButton")}
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {t("memories.createModal.createButton")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
