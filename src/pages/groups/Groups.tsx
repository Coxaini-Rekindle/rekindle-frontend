import type { GroupDto } from "@/types/group";

import { useState } from "react";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useTranslation } from "react-i18next";

import CreateGroupModal from "./components/CreateGroupModal";
import GroupCard from "./components/GroupCard";
import InviteUsersModal from "./components/InviteUsersModal";
import UpdateGroupModal from "./components/UpdateGroupModal";

import { useUserGroups } from "@/hooks/useGroups";

export default function Groups() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedGroup, setSelectedGroup] = useState<GroupDto | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Fetch groups from API
  const { data: groups = [], isLoading, error } = useUserGroups();

  const handleViewGroup = (groupId: string) => {
    // TODO: Navigate to group details page
    // eslint-disable-next-line no-console
    console.log("View group:", groupId);
  };

  const handleEditGroup = (group: GroupDto) => {
    setSelectedGroup(group);
    setUpdateModalOpen(true);
  };

  const handleInviteUsers = (group: GroupDto) => {
    setSelectedGroup(group);
    setInviteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-content1 border border-divider rounded-lg">
        <p className="text-danger mb-4">{t("groups.errorLoading")}</p>
        <Button color="primary" onPress={() => window.location.reload()}>
          {t("groups.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t("groups.title")}</h1>
        <Button color="primary" onPress={onOpen}>
          {t("groups.createNew")}
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12 bg-content1 border border-divider rounded-lg">
          <p className="text-foreground-500 mb-4">{t("groups.emptyState")}</p>
          <Button color="primary" onPress={onOpen}>
            {t("groups.createFirst")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEditGroup={handleEditGroup}
              onInviteUsers={handleInviteUsers}
              onViewGroup={handleViewGroup}
            />
          ))}
        </div>
      )}

      <CreateGroupModal isOpen={isOpen} onOpenChange={onOpenChange} />

      <UpdateGroupModal
        group={selectedGroup}
        isOpen={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
      />

      <InviteUsersModal
        group={selectedGroup}
        isOpen={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </div>
  );
}
