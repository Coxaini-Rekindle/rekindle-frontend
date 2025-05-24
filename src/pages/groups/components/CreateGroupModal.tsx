import { useState, KeyboardEvent, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { useTranslation } from "react-i18next";
import { MdGroup, MdDescription, MdEmail } from "react-icons/md";

import { useCreateGroup } from "@/hooks/useGroups";

interface CreateGroupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function CreateGroupModal({
  isOpen,
  onOpenChange,
}: CreateGroupModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const emailInputRef = useRef<HTMLInputElement>(null);
  const createGroupMutation = useCreateGroup();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    if (!currentEmail) return;

    if (!validateEmail(currentEmail)) {
      setErrors({
        ...errors,
        email: t("groups.modal.validation.emailInvalid"),
      });

      return;
    }

    if (!emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail]);
    }

    setCurrentEmail("");
    setErrors({ ...errors, email: undefined });
    emailInputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleSubmit = () => {
    // Reset errors
    const newErrors: { name?: string; email?: string } = {};

    // Validate form
    if (!name.trim()) {
      newErrors.name = t("groups.modal.validation.nameRequired");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      createGroupMutation.mutate(
        {
          name,
          description,
          invitationEmails: emails,
        },
        {
          onSuccess: () => {
            // Reset form
            setName("");
            setDescription("");
            setEmails([]);
            setCurrentEmail("");

            // Close modal
            onOpenChange(false);
          },
        },
      );
    }
  };

  const handleClose = () => {
    // Reset form and errors when modal is closed
    setName("");
    setDescription("");
    setEmails([]);
    setCurrentEmail("");
    setErrors({});
  };

  return (
    <Modal
      isDismissable={true}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
        onOpenChange(open);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t("groups.modal.title")}
            </ModalHeader>
            <ModalBody>
              <Form
                className="w-full justify-center items-center space-y-5"
                validationErrors={errors}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    isRequired
                    className="rounded-md"
                    endContent={
                      <MdGroup className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    errorMessage={errors.name}
                    isInvalid={!!errors.name}
                    label={t("groups.modal.nameLabel")}
                    labelPlacement="outside"
                    placeholder={t("groups.modal.namePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Input
                    className="rounded-md"
                    endContent={
                      <MdDescription className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label={t("groups.modal.descriptionLabel")}
                    labelPlacement="outside"
                    placeholder={t("groups.modal.descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div>
                    <Input
                      ref={emailInputRef}
                      className="rounded-md"
                      endContent={
                        <MdEmail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      errorMessage={errors.email}
                      isInvalid={!!errors.email}
                      label={t("groups.modal.inviteLabel")}
                      labelPlacement="outside"
                      placeholder={t("groups.modal.invitePlaceholder")}
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {emails.map((email) => (
                        <Chip
                          key={email}
                          color="primary"
                          variant="flat"
                          onClose={() => handleRemoveEmail(email)}
                        >
                          {email}
                        </Chip>
                      ))}
                    </div>
                    {emails.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        {emails.length}{" "}
                        {emails.length !== 1
                          ? t("groups.modal.emailsAddedPlural")
                          : t("groups.modal.emailsAdded")}
                      </p>
                    )}
                  </div>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                {t("groups.modal.cancelButton")}
              </Button>
              <Button
                color="primary"
                isLoading={createGroupMutation.isPending}
                onPress={handleSubmit}
              >
                {t("groups.modal.createButton")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
