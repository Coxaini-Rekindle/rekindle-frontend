import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { MdGroup, MdHome, MdPhotoLibrary } from "react-icons/md";

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
    { label: t("navbar.memories"), path: "/memories", icon: MdPhotoLibrary },
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
            <p className="text-sm font-semibold text-foreground-500 px-2 py-1">
              Recent Groups
            </p>
          </NavbarMenuItem>
          {recentGroups.map((group) => (
            <NavbarMenuItem key={group.id}>
              <Button
                className="w-full justify-start"
                startContent={<MdGroup size={16} />}
                variant="light"
                onPress={() => {
                  navigate(`/groups`); // TODO: Navigate to specific group
                  setIsMenuOpen(false);
                }}
              >
                <div className="flex flex-col items-start">
                  <span>{group.name}</span>
                  <span className="text-xs text-foreground-500">
                    {group.memberCount} member
                    {group.memberCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </Button>
            </NavbarMenuItem>
          ))}
        </>
      )}
    </NavbarMenu>
  );
};

export default NavbarMobileMenu;
