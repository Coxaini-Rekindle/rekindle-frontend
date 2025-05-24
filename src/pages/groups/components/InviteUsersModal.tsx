import type { GroupDto } from "@/types/group";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { useTranslation } from "react-i18next";
import { MdEmail, MdAdd, MdClose, MdLink } from "react-icons/md";

import { useInviteToGroup, useCreateInvitationLink } from "@/hooks/useGroups";

interface InviteUsersModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  group: GroupDto | null;
}

export default function InviteUsersModal({
  isOpen,
  onOpenChange,
  group,
}: InviteUsersModalProps) {
  const { t } = useTranslation();
  const [currentEmail, setCurrentEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [invitationLink, setInvitationLink] = useState<string>("");

  const emailInputRef = useRef<HTMLInputElement>(null);

  const inviteToGroupMutation = useInviteToGroup();
  const createInvitationLinkMutation = useCreateInvitationLink();

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

  const handleSendInvitations = () => {
    if (!group || emails.length === 0) return;

    // Send invitations for each email
    const promises = emails.map((email) =>
      inviteToGroupMutation.mutateAsync({
        groupId: group.id,
        inviteData: { email },
      }),
    );

    Promise.all(promises)
      .then(() => {
        setEmails([]);
        setCurrentEmail("");
        onOpenChange(false);
      })
      .catch(() => {
        // Error handling is done in the mutation
      });
  };

  const handleCreateInvitationLink = () => {
    if (!group) return;

    createInvitationLinkMutation.mutate(
      {
        groupId: group.id,
        linkData: {
          maxUses: 10,
          expirationDays: 30,
        },
      },
      {
        onSuccess: (response) => {
          setInvitationLink(response.invitationLink);
        },
      },
    );
  };

  const handleCopyLink = async () => {
    if (invitationLink) {
      try {
        await navigator.clipboard.writeText(invitationLink);
        // Could add a toast here for successful copy
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleClose = () => {
    setEmails([]);
    setCurrentEmail("");
    setErrors({});
    setInvitationLink("");
  };

  return (
    <Modal
      isDismissable={true}
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
            <ModalHeader className="flex flex-col gap-1 text-foreground">
              {t("groups.inviteModal.title")} {group?.name}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                {/* Email Invitations Section */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-lg font-semibold">
                    {t("groups.inviteModal.emailInvitations")}
                  </h4>

                  <div className="flex gap-2">
                    <Input
                      ref={emailInputRef}
                      className="flex-1"
                      endContent={
                        <MdEmail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      errorMessage={errors.email}
                      isInvalid={!!errors.email}
                      placeholder={t("groups.inviteModal.emailPlaceholder")}
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button isIconOnly color="primary" onPress={handleAddEmail}>
                      <MdAdd />
                    </Button>
                  </div>

                  {/* Email chips */}
                  {emails.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {emails.map((email) => (
                        <Chip
                          key={email}
                          color="primary"
                          endContent={
                            <MdClose
                              className="cursor-pointer"
                              onClick={() => handleRemoveEmail(email)}
                            />
                          }
                          variant="flat"
                        >
                          {email}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>

                {/* Invitation Link Section */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-lg font-semibold">
                    {t("groups.inviteModal.invitationLink")}
                  </h4>

                  <div className="flex gap-2">
                    <Button
                      color="secondary"
                      isLoading={createInvitationLinkMutation.isPending}
                      startContent={<MdLink />}
                      onPress={handleCreateInvitationLink}
                    >
                      {t("groups.inviteModal.createLink")}
                    </Button>
                  </div>

                  {invitationLink && (
                    <div className="flex gap-2">
                      <Input
                        isReadOnly
                        className="flex-1"
                        value={invitationLink}
                      />
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={handleCopyLink}
                      >
                        {t("groups.inviteModal.copyLink")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                {t("groups.modal.cancelButton")}
              </Button>
              <Button
                color="primary"
                isDisabled={emails.length === 0}
                isLoading={inviteToGroupMutation.isPending}
                onPress={handleSendInvitations}
              >
                {t("groups.inviteModal.sendInvitations")} ({emails.length})
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
