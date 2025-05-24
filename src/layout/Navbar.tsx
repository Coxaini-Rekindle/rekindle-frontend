import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useTheme } from "@heroui/use-theme";
import {
  MdAdd,
  MdDarkMode,
  MdGroup,
  MdHome,
  MdLightMode,
  MdLogout,
  MdPerson,
  MdSettings,
} from "react-icons/md";

import { useLogout } from "@/hooks/useAuth";
import { useUserGroups } from "@/hooks/useGroups";
import { useUserProfile } from "@/hooks/useUserProfile";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const { data: groups = [] } = useUserGroups();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, getAvatarUrl } = useUserProfile();

  // Use profile data or fallback to default values
  const user = {
    name: profile?.name || "User",
    email: profile?.email || "",
    avatar: profile?.avatarFileId
      ? getAvatarUrl(profile.avatarFileId)
      : undefined,
  };

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const recentGroups = groups.slice(0, 5); // Show only first 5 groups

  const menuItems = [
    { label: t("navbar.home"), path: "/", icon: MdHome },
    { label: t("navbar.groups"), path: "/groups", icon: MdGroup },
  ];

  return (
    <>
      <HeroNavbar
        className="border-b border-divider bg-background/60 backdrop-blur-md"
        maxWidth="full"
        position="sticky"
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Brand */}
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={
              isMenuOpen ? t("navbar.closeMenu") : t("navbar.openMenu")
            }
            className="sm:hidden"
          />
          <NavbarBrand>
            <Button
              className="text-xl font-bold text-primary p-0 h-auto"
              variant="light"
              onClick={() => navigate("/")}
            >
              Rekindle
            </Button>
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop Navigation */}
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
                      onPress={() => navigate("/groups")}
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

        {/* Right side actions */}
        <NavbarContent as="div" className="items-center" justify="end">
          {/* Theme Toggle */}
          <Button
            isIconOnly
            className="text-foreground-600 hover:text-foreground-900"
            variant="light"
            onPress={toggleTheme}
          >
            {theme === "dark" ? (
              <MdLightMode size={20} />
            ) : (
              <MdDarkMode size={20} />
            )}
          </Button>

          {/* User Profile Dropdown */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-105"
                color="primary"
                name={user.name}
                size="sm"
                src={user.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label={t("navbar.userActions")}>
              <DropdownSection showDivider title={t("navbar.myAccount")}>
                <DropdownItem
                  key="profile"
                  description={user.email}
                  startContent={<MdPerson size={16} />}
                  textValue={t("navbar.profile")}
                  onPress={() => navigate("/profile")}
                >
                  {user.name}
                </DropdownItem>
              </DropdownSection>

              <DropdownSection showDivider title={t("navbar.settings")}>
                <DropdownItem
                  key="theme"
                  isReadOnly
                  endContent={
                    <button type="button" onClick={toggleTheme}>
                      {theme === "dark" ? (
                        <MdLightMode size={22} />
                      ) : (
                        <MdDarkMode size={22} />
                      )}
                    </button>
                  }
                  startContent={
                    theme === "dark" ? (
                      <MdDarkMode size={16} />
                    ) : (
                      <MdLightMode size={16} />
                    )
                  }
                  textValue={t("navbar.theme")}
                >
                  {t("navbar.theme")}
                </DropdownItem>
                <DropdownItem
                  key="system-settings"
                  startContent={<MdSettings size={16} />}
                  textValue={t("navbar.systemSettings")}
                  onPress={() => navigate("/settings")}
                >
                  {t("navbar.systemSettings")}
                </DropdownItem>
              </DropdownSection>

              <DropdownSection title={t("navbar.dangerZone")}>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  description={t("navbar.logoutDescription")}
                  startContent={<MdLogout size={16} />}
                  textValue={t("navbar.logout")}
                  onPress={handleLogout}
                >
                  {t("navbar.logout")}
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        {/* Mobile Menu */}
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
      </HeroNavbar>
    </>
  );
};

export default Navbar;
