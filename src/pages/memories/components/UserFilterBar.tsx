import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { MdMerge, MdPerson, MdPersonOff } from "react-icons/md";

import {
  useRecognizedUsers,
  useUserFaceImageUrl,
  useMergeUsers,
  useGroupMembers,
} from "@/hooks/useGroups";

interface UserFilterBarProps {
  groupId: string;
  onUserFilter?: (userIds: string[]) => void;
  selectedUserIds?: string[];
}

interface UserAvatarProps {
  groupId: string;
  userId: string;
  isTemp: boolean;
  lastFaceFileId: string | null;
  memberName?: string;
  onMergeClick?: () => void;
  isSelected?: boolean;
  onClick?: () => void;
  colorIndex?: number;
}

function UserAvatar({
  groupId,
  userId,
  isTemp,
  lastFaceFileId,
  memberName,
  onMergeClick,
  isSelected,
  onClick,
  colorIndex,
}: UserAvatarProps) {
  const { t } = useTranslation();
  const { data: imageUrl, isLoading } = useUserFaceImageUrl(
    groupId,
    userId,
    !!lastFaceFileId,
  );
  // Define color options for selected avatars
  const colors = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
  ] as const;
  const avatarColor = isSelected
    ? colors[colorIndex! % colors.length]
    : "default";
  return (
    <div className="flex flex-col items-center gap-2 relative">
      <div
        className={`relative cursor-pointer transition-all duration-200 ${
          onClick ? "hover:scale-105" : ""
        }`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && onClick) {
            onClick();
          }
        }}
      >
        {isLoading ? (
          <div className="w-12 h-12 rounded-full bg-content2 flex items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="relative">
            <Avatar
              className="w-12 h-12"
              color={avatarColor}
              fallback={<MdPerson size={24} />}
              isBordered={isSelected}
              size="lg"
              src={imageUrl}
            />
            {/* Temp user indicator - subtle overlay */}
            {isTemp && (
              <div className="absolute inset-0 rounded-full bg-warning/10 border-2 border-warning-300 flex items-center justify-center">                <MdPersonOff
                  className="text-warning-600 opacity-25"
                  size={16}
                />
              </div>
            )}
          </div>
        )}
      </div>{" "}
      {/* User name or merge button */}
      {isTemp ? (
        <Button
          className="text-xs h-6"
          color="primary"
          size="sm"
          startContent={<MdMerge size={14} />}
          variant="flat"
          onPress={onMergeClick}
        >
          {t("memories.userFilter.merge")}
        </Button>
      ) : (
        <span className="text-xs text-foreground-600 text-center max-w-16 truncate">
          {memberName || t("memories.userFilter.unknown")}
        </span>
      )}
    </div>
  );
}

interface MergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  sourceUserId: string;
}

function MergeModal({
  isOpen,
  onClose,
  groupId,
  sourceUserId,
}: MergeModalProps) {
  const { t } = useTranslation();
  const [targetUserId, setTargetUserId] = useState<string>("");
  const { data: members = [] } = useGroupMembers(groupId);
  const { mutate: mergeUsers, isPending } = useMergeUsers();

  const handleMerge = () => {
    if (!targetUserId) return;

    mergeUsers(
      {
        groupId,
        mergeData: {
          sourceUserId,
          targetUserId,
        },
      },
      {
        onSuccess: () => {
          onClose();
          setTargetUserId("");
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">
            {t("memories.userFilter.mergeModal.title")}
          </h3>
        </ModalHeader>
        <ModalBody>
          <p className="mb-4 text-foreground-600">
            {t("memories.userFilter.mergeModal.description")}
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t("memories.userFilter.mergeModal.selectUser")}
            </p>{" "}
            <div className="grid grid-cols-1 gap-2">
              {members.map((member) => (
                <Button
                  key={member.userId}
                  className="justify-start"
                  color={targetUserId === member.userId ? "primary" : "default"}
                  variant={targetUserId === member.userId ? "solid" : "flat"}
                  onPress={() => setTargetUserId(member.userId)}
                >
                  {member.name ||
                    member.username ||
                    t("memories.userFilter.unknownUser")}
                </Button>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            color="primary"
            isDisabled={!targetUserId}
            isLoading={isPending}
            onPress={handleMerge}
          >
            {t("memories.userFilter.mergeModal.merge")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function UserFilterBar({
  groupId,
  onUserFilter,
  selectedUserIds = [],
}: UserFilterBarProps) {
  const { t } = useTranslation();
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [userToMerge, setUserToMerge] = useState<string>("");

  const { data: recognizedUsers = [], isLoading } = useRecognizedUsers(groupId);
  const { data: members = [] } = useGroupMembers(groupId);

  // Create a map of user IDs to member names for quick lookup
  const memberMap = new Map(
    members.map((member) => [
      member.userId,
      member.name || member.username || t("userFilter.unknown"),
    ]),
  );

  const handleUserClick = (userId: string) => {
    const currentSelected = [...selectedUserIds];
    const userIndex = currentSelected.indexOf(userId);

    if (userIndex > -1) {
      // User is already selected, remove them
      currentSelected.splice(userIndex, 1);
    } else {
      // User is not selected, add them
      currentSelected.push(userId);
    }

    onUserFilter?.(currentSelected);
  };

  const handleClearFilter = () => {
    onUserFilter?.([]);
  };

  const handleMergeClick = (userId: string) => {
    setUserToMerge(userId);
    setMergeModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner size="sm" />
        <span className="ml-2 text-foreground-600">
          {t("memories.userFilter.loading")}
        </span>
      </div>
    );
  }

  if (recognizedUsers.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-6 p-4 bg-content1 rounded-lg border border-divider">
        {" "}
        <div className="flex items-center gap-3 mb-3">
          <MdPerson className="text-foreground-600" size={20} />
          <h3 className="text-sm font-medium text-foreground-600">
            {t("memories.userFilter.title")}
          </h3>
          {selectedUserIds.length > 0 && (
            <Chip color="primary" size="sm" variant="flat">
              {t("memories.userFilter.selectedCount", {
                count: selectedUserIds.length,
              })}
            </Chip>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {recognizedUsers.map((user) => {
            const isSelected = selectedUserIds.includes(user.userId);
            const colorIndex = selectedUserIds.indexOf(user.userId);

            return (
              <UserAvatar
                key={user.userId}
                colorIndex={colorIndex}
                groupId={groupId}
                isSelected={isSelected}
                isTemp={user.isTemp}
                lastFaceFileId={user.lastFaceFileId}
                memberName={memberMap.get(user.userId)}
                userId={user.userId}
                onClick={() => handleUserClick(user.userId)}
                onMergeClick={() => handleMergeClick(user.userId)}
              />
            );
          })}
        </div>
        {selectedUserIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-divider">
            <Button size="sm" variant="flat" onPress={handleClearFilter}>
              {t("memories.userFilter.clearFilter")}
            </Button>
          </div>
        )}
      </div>

      <MergeModal
        groupId={groupId}
        isOpen={mergeModalOpen}
        sourceUserId={userToMerge}
        onClose={() => {
          setMergeModalOpen(false);
          setUserToMerge("");
        }}
      />
    </>
  );
}
