import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { MdGroup, MdHome } from "react-icons/md";

import { useUserGroups } from "@/hooks/useGroups";

interface NavbarMobileMenuProps {
  setIsMenuOpen: (open: boolean) => void;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  setIsMenuOpen,
}) => {
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
    <NavbarMenu>
      {menuItems.map((item) => (
        <NavbarMenuItem key={item.path}>
          <Button
            className="w-full justify-start"
            color={isActivePath(item.path) ? "primary" : "default"}
            startContent={<item.icon size={18} />}
            variant={isActivePath(item.path) ? "flat" : "light"}
            onPress={() => {
              navigate(item.path);
              setIsMenuOpen(false);
            }}
          >
            {item.label}
          </Button>
        </NavbarMenuItem>
      ))}

      {/* Mobile Groups */}
      {groups.length > 0 && (
        <>
          <NavbarMenuItem>
            <div className="flex items-center justify-between w-full px-2 py-2">
              <p className="text-sm font-semibold text-foreground-500">
                {t("navbar.myGroups")}
              </p>
              <span className="text-xs text-foreground-400 bg-primary/10 px-2 py-1 rounded-full">
                {groups.length}
              </span>
            </div>
          </NavbarMenuItem>
          {recentGroups.map((group) => (
            <NavbarMenuItem key={group.id}>
              <Button
                className="w-full justify-start pl-4"
                startContent={
                  <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
                    <MdGroup className="text-primary" size={14} />
                  </div>
                }
                variant="light"
                onPress={() => {
                  navigate(`/groups/${group.id}/memories`);
                  setIsMenuOpen(false);
                }}
              >
                <div className="flex flex-col items-start flex-1">
                  <span className="font-medium">{group.name}</span>
                  <span className="text-xs text-foreground-500">
                    {group.memberCount} member
                    {group.memberCount !== 1 ? "s" : ""} • View Memories
                  </span>
                </div>
              </Button>
            </NavbarMenuItem>
          ))}
          {groups.length > 5 && (
            <NavbarMenuItem>
              <Button
                className="w-full justify-center text-sm"
                variant="bordered"
                onPress={() => {
                  navigate("/groups");
                  setIsMenuOpen(false);
                }}
              >
                View All {groups.length} Groups
              </Button>
            </NavbarMenuItem>
          )}
        </>
      )}
    </NavbarMenu>
  );
};

export default NavbarMobileMenu;
