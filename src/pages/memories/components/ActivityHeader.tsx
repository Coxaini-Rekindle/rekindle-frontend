import type { MemoryActivityDto } from "@/types/activity";
import type { GroupMemberDto } from "@/types/group";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { MdMoreVert, MdEdit, MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { userApi } from "@/api/userApi";

interface ActivityHeaderProps {
  activity: MemoryActivityDto;
  creator: GroupMemberDto | null;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActivityHeader({
  activity,
  creator,
  isOwner,
  onEdit,
  onDelete,
}: ActivityHeaderProps) {
  const { t } = useTranslation();

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-start gap-3 mb-3">
      <Avatar
        name={creator?.name || "U"}
        size="sm"
        src={
          creator?.avatarFileId
            ? userApi.getAvatarUrl(creator.avatarFileId)
            : undefined
        }
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{creator?.name || "Unknown User"}</p>
            <p className="text-small text-foreground-500">
              {formatDate(activity.createdAt)}
            </p>
          </div>

          {/* Actions dropdown (for owners only) */}
          {isOwner && (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MdMoreVert />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Activity actions">
                <DropdownItem
                  key="edit"
                  startContent={<MdEdit />}
                  onPress={onEdit}
                >
                  {t("activities.edit")}
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  startContent={<MdDelete />}
                  onPress={onDelete}
                >
                  {t("activities.delete")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}
