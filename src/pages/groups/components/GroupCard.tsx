import type { GroupDto } from "@/types/group";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useTranslation } from "react-i18next";
import { MdAdd, MdMoreVert, MdEdit, MdPersonAdd } from "react-icons/md";

interface GroupCardProps {
  group: GroupDto;
  members?: { id: string; name: string; email: string; avatar?: string }[];
  onViewGroup?: (groupId: string) => void;
  onEditGroup?: (group: GroupDto) => void;
  onInviteUsers?: (group: GroupDto) => void;
}

export default function GroupCard({
  group,
  members = [],
  onViewGroup,
  onEditGroup,
  onInviteUsers,
}: GroupCardProps) {
  const { t } = useTranslation();

  const handleViewGroup = () => {
    if (onViewGroup) {
      onViewGroup(group.id);
    }
  };

  const handleEditGroup = () => {
    if (onEditGroup) {
      onEditGroup(group);
    }
  };

  const handleInviteUsers = () => {
    if (onInviteUsers) {
      onInviteUsers(group);
    }
  };

  const displayMemberCount = group.memberCount || members.length;

  return (
    <Card className="w-full hover:scale-105 transition-all duration-300">
      <CardBody>
        {/* Group Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-xl font-semibold text-foreground">
              {group.name}
            </h3>
            {group.description && (
              <p className="text-sm text-foreground-500 line-clamp-2">
                {group.description}
              </p>
            )}
          </div>

          {/* Actions dropdown - only show if user is owner */}
          {group.isCurrentUserOwner && (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MdMoreVert />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Group actions"
                className="min-w-[160px]"
                variant="flat"
              >
                <DropdownItem
                  key="edit"
                  className="text-foreground data-[hover=true]:bg-default-100"
                  startContent={<MdEdit className="text-foreground" />}
                  onPress={handleEditGroup}
                >
                  {t("groups.editGroup")}
                </DropdownItem>
                <DropdownItem
                  key="invite"
                  className="text-foreground data-[hover=true]:bg-default-100"
                  startContent={<MdPersonAdd className="text-foreground" />}
                  onPress={handleInviteUsers}
                >
                  {t("groups.inviteUsers")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        {/* Members Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-500">
              {displayMemberCount}{" "}
              {displayMemberCount !== 1
                ? t("groups.membersPlural")
                : t("groups.members")}
            </span>

            {/* Add member button for non-owners */}
            {!group.isCurrentUserOwner && group.isCurrentUserMember && (
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="flat"
                onPress={handleInviteUsers}
              >
                <MdAdd />
              </Button>
            )}
          </div>

          {/* Avatar Group */}
          {members.length > 0 ? (
            <div className="flex items-center gap-3">
              <AvatarGroup isBordered max={4} size="sm">
                {members.map((member) => (
                  <Avatar
                    key={member.id}
                    className="w-8 h-8"
                    name={member.name}
                    src={
                      member.avatar ||
                      `https://i.pravatar.cc/150?u=${member.email}`
                    }
                  />
                ))}
              </AvatarGroup>
              {members.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-600 font-medium">
                    {members[0].name}
                  </span>
                  {members.length > 1 && (
                    <span className="text-xs text-foreground-500">
                      +{members.length - 1} {t("groups.others")}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : displayMemberCount > 0 ? (
            <div className="flex items-center gap-2">
              <Avatar
                showFallback
                className="w-8 h-8 bg-default-100"
                name="?"
              />
              <span className="text-xs text-foreground-500">
                {displayMemberCount} {t("groups.members")}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar
                showFallback
                className="w-8 h-8 bg-default-100"
                name="?"
              />
              <span className="text-xs text-foreground-500">
                {t("groups.noMembers")}
              </span>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex justify-end pt-2">
          <Button
            className="font-medium"
            color="primary"
            size="sm"
            variant="flat"
            onPress={handleViewGroup}
          >
            {t("groups.viewGroup")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
