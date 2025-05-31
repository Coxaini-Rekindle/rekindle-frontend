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

  const menuItems = [{ label: t("navbar.home"), path: "/", icon: MdHome }];

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

      {/* Groups Dropdown - Enhanced */}
      {groups.length > 0 && (
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="font-medium text-foreground"
                endContent={
                  <Chip color="primary" size="sm" variant="flat">
                    {groups.length}
                  </Chip>
                }
                startContent={<MdGroup size={18} />}
                variant="light"
              >
                {t("navbar.myGroups")}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label={t("navbar.groupShortcuts")}
              className="w-64"
            >
              <DropdownSection showDivider title={t("navbar.recentGroups")}>
                {recentGroups.map((group) => (
                  <DropdownItem
                    key={group.id}
                    className="py-2"
                    startContent={
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <MdGroup className="text-primary" size={16} />
                      </div>
                    }
                    onPress={() => navigate(`/groups/${group.id}/memories`)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {group.name}
                      </span>
                      <span className="text-xs text-foreground-500">
                        {group.memberCount}
                        {t("navbar.member", {
                          count: group.memberCount,
                        })}{" "}
                        • View Memories
                      </span>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownSection>
              <DropdownSection title={t("navbar.actions")}>
                <DropdownItem
                  key="create-group"
                  className="py-2"
                  startContent={
                    <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-full">
                      <MdAdd className="text-success" size={16} />
                    </div>
                  }
                  onPress={() => navigate("/groups?create=true")}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {t("navbar.createNewGroup")}
                    </span>
                    <span className="text-xs text-foreground-500">
                      Start a new memory group
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="view-all-groups"
                  className="py-2"
                  startContent={
                    <div className="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-full">
                      <MdGroup className="text-secondary" size={16} />
                    </div>
                  }
                  onPress={() => navigate("/groups")}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {t("navbar.viewAllGroups")}
                    </span>
                    <span className="text-xs text-foreground-500">
                      Manage all your groups
                    </span>
                  </div>
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
