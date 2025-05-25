import type { GroupDto, GroupMemberDto } from "@/types/group";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { useTranslation } from "react-i18next";
import {
  MdGroup,
  MdDescription,
  MdPeople,
  MdSettings,
  MdPersonRemove,
  MdDelete,
  MdWarning,
} from "react-icons/md";

import {
  useUpdateGroup,
  useGroupMembers,
  useRemoveUserFromGroup,
  useDeleteGroup,
} from "@/hooks/useGroups";
import { useUserProfile } from "@/hooks/useUser";

interface UpdateGroupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  group: GroupDto | null;
}

export default function UpdateGroupModal({
  isOpen,
  onOpenChange,
  group,
}: UpdateGroupModalProps) {
  const { t } = useTranslation();
  const { getAvatarUrl } = useUserProfile();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [selectedTab, setSelectedTab] = useState("settings");
  const [memberToRemove, setMemberToRemove] = useState<GroupMemberDto | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();
  const removeUserMutation = useRemoveUserFromGroup();

  // Fetch group members when modal opens and group is available
  const { data: members = [], isLoading: membersLoading } = useGroupMembers(
    group?.id || "",
    isOpen && !!group?.id,
  );

  // Update form when group changes
  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
    }
  }, [group]);

  const handleSubmit = () => {
    // Reset errors
    const newErrors: { name?: string } = {};

    // Validate form
    if (!name.trim()) {
      newErrors.name = t("groups.modal.validation.nameRequired");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && group) {
      updateGroupMutation.mutate(
        {
          groupId: group.id,
          groupData: {
            name,
            description,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    }
  };

  const handleRemoveMember = (member: GroupMemberDto) => {
    if (!group) return;

    removeUserMutation.mutate(
      {
        groupId: group.id,
        userIdToRemove: member.userId,
      },
      {
        onSuccess: () => {
          setMemberToRemove(null);
        },
      },
    );
  };

  const handleDeleteGroup = () => {
    if (!group) return;

    deleteGroupMutation.mutate(group.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    // Reset form and errors when modal is closed
    if (group) {
      setName(group.name);
      setDescription(group.description);
    }
    setErrors({});
    setSelectedTab("settings");
    setMemberToRemove(null);
    setShowDeleteConfirm(false);
  };

  const renderSettingsTab = () => (
    <div className="space-y-4">
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
        </div>
      </Form>

      {/* Danger Zone - Only show for group owners */}
      {group?.isCurrentUserOwner && (
        <>
          <Divider className="my-6" />
          <Card className="border-danger-200 bg-danger-50">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-2">
                <MdWarning className="text-danger text-xl" />
                <h4 className="text-lg font-semibold text-danger">
                  {t("groups.updateModal.dangerZone")}
                </h4>
              </div>
              <p className="text-sm text-danger-600">
                {t("groups.updateModal.dangerZoneDescription")}
              </p>
              <Button
                color="danger"
                startContent={<MdDelete />}
                variant="flat"
                onPress={() => setShowDeleteConfirm(true)}
              >
                {t("groups.updateModal.deleteGroup")}
              </Button>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">
          {t("groups.updateModal.membersList")}
        </h4>
        <Chip color="primary" variant="flat">
          {t("groups.updateModal.membersCount", { count: members.length })}
        </Chip>
      </div>

      {membersLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <Card key={member.userId} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="flex-shrink-0"
                    name={member.name.charAt(0).toUpperCase()}
                    size="sm"
                    src={
                      member.avatarFileId
                        ? getAvatarUrl(member.avatarFileId)
                        : undefined
                    }
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-foreground-500">
                      @{member.username}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Chip
                    color={member.role === "Owner" ? "warning" : "default"}
                    size="sm"
                    variant="flat"
                  >
                    {t(`groups.updateModal.${member.role.toLowerCase()}`)}
                  </Chip>

                  {/* Only show remove option for members (not owners) and only if current user is owner */}
                  {group?.isCurrentUserOwner && member.role !== "Owner" && (
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => setMemberToRemove(member)}
                    >
                      <MdPersonRemove />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Modal
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
              <ModalHeader className="flex flex-col gap-1 text-primary-foreground">
                {t("groups.updateModal.title")}
              </ModalHeader>
              <ModalBody>
                <Tabs
                  aria-label="Group management tabs"
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                >
                  <Tab
                    key="settings"
                    title={
                      <div className="flex items-center gap-2">
                        <MdSettings />
                        <span>{t("groups.updateModal.settingsTab")}</span>
                      </div>
                    }
                  >
                    {renderSettingsTab()}
                  </Tab>
                  <Tab
                    key="members"
                    title={
                      <div className="flex items-center gap-2">
                        <MdPeople />
                        <span>{t("groups.updateModal.membersTab")}</span>
                      </div>
                    }
                  >
                    {renderMembersTab()}
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  {t("groups.modal.cancelButton")}
                </Button>
                {selectedTab === "settings" && (
                  <Button
                    color="primary"
                    isLoading={updateGroupMutation.isPending}
                    onPress={handleSubmit}
                  >
                    {t("groups.updateModal.updateButton")}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Remove Member Confirmation Modal */}
      <Modal
        isOpen={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-foreground">
                {t("groups.updateModal.removeMember")}
              </ModalHeader>
              <ModalBody>
                <p className="text-foreground">
                  {t("groups.updateModal.removeConfirm", {
                    name: memberToRemove?.name,
                  })}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  {t("groups.modal.cancelButton")}
                </Button>
                <Button
                  color="danger"
                  isLoading={removeUserMutation.isPending}
                  onPress={() =>
                    memberToRemove && handleRemoveMember(memberToRemove)
                  }
                >
                  {t("groups.updateModal.removeMember")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Group Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MdWarning className="text-danger text-xl" />
                  <span className="text-danger font-semibold">
                    {t("groups.updateModal.deleteGroup")}
                  </span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  <p className="text-foreground">
                    {t("groups.updateModal.deleteGroupConfirm")}
                  </p>
                  {group && (
                    <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                      <p className="text-sm text-danger-700">
                        <strong>Group:</strong> {group.name}
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  {t("groups.modal.cancelButton")}
                </Button>
                <Button
                  color="danger"
                  isLoading={deleteGroupMutation.isPending}
                  startContent={<MdDelete />}
                  onPress={handleDeleteGroup}
                >
                  {t("groups.updateModal.deleteGroupButton")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
