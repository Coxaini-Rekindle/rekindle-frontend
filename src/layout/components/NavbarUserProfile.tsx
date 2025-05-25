import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { useTheme } from "@heroui/use-theme";
import {
  MdDarkMode,
  MdLightMode,
  MdLogout,
  MdPerson,
  MdSettings,
} from "react-icons/md";

import { useLogout } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUser";

const NavbarUserProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useLogout();
  const { theme, setTheme } = useTheme();
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

  return (
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
  );
};

export default NavbarUserProfile;
