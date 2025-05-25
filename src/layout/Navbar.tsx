import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Navbar as HeroNavbar,
  NavbarContent,
  NavbarMenuToggle,
} from "@heroui/navbar";

import {
  NavbarBrand,
  NavbarDesktopNav,
  NavbarUserProfile,
  NavbarMobileMenu,
  ThemeToggle,
} from "./components";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <NavbarBrand />
        </NavbarContent>

        {/* Desktop Navigation */}
        <NavbarDesktopNav />

        {/* Right side actions */}
        <NavbarContent as="div" className="items-center" justify="end">
          <ThemeToggle />
          <NavbarUserProfile />
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMobileMenu setIsMenuOpen={setIsMenuOpen} />
      </HeroNavbar>
    </>
  );
};

export default Navbar;
