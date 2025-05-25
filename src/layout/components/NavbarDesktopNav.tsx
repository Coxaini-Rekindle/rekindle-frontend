import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarContent, NavbarItem } from "@heroui/navbar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { MdAdd, MdGroup, MdHome } from "react-icons/md";

import { useUserGroups } from "@/hooks/useGroups";

const NavbarDesktopNav: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: groups = [] } = useUserGroups();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const recentGroups = groups.slice(0, 5); // Show only first 5 groups

  const menuItems = [
    { label: t("navbar.home"), path: "/", icon: MdHome },
    { label: t("navbar.groups"), path: "/groups", icon: MdGroup },
  ];

  return (
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      {menuItems.map((item) => (
        <NavbarItem key={item.path} isActive={isActivePath(item.path)}>
          <Button
            className="font-medium"
            color={isActivePath(item.path) ? "primary" : "default"}
            startContent={<item.icon size={18} />}
            variant={isActivePath(item.path) ? "flat" : "light"}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        </NavbarItem>
      ))}

      {/* Groups Dropdown */}
      {groups.length > 0 && (
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="font-medium"
                endContent={
                  <Chip size="sm" variant="flat">
                    {groups.length}
                  </Chip>
                }
                variant="light"
              >
                Quick Groups
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label={t("navbar.groupShortcuts")}>
              <DropdownSection showDivider title={t("navbar.recentGroups")}>
                {recentGroups.map((group) => (
                  <DropdownItem
                    key={group.id}
                    startContent={<MdGroup size={16} />}
                    onPress={() => navigate(`/groups`)} // TODO: Navigate to specific group
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{group.name}</span>
                      <span className="text-xs text-foreground-500">
                        {group.memberCount}
                        {t("navbar.member", { count: group.memberCount })}
                      </span>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownSection>
              <DropdownSection>
                <DropdownItem
                  key="create-group"
                  startContent={<MdAdd size={16} />}
                  onPress={() => navigate("/groups?create=true")}
                >
                  {t("navbar.createNewGroup")}
                </DropdownItem>
                <DropdownItem
                  key="view-all-groups"
                  startContent={<MdGroup size={16} />}
                  onPress={() => navigate("/groups")}
                >
                  {t("navbar.viewAllGroups")}
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      )}
    </NavbarContent>
  );
};

export default NavbarDesktopNav;
