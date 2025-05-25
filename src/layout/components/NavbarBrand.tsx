import React from "react";
import { useNavigate } from "react-router-dom";
import { NavbarBrand as HeroNavbarBrand } from "@heroui/navbar";
import { Button } from "@heroui/button";

const NavbarBrand: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroNavbarBrand>
      <Button
        className="text-xl font-bold text-primary p-0 h-auto"
        variant="light"
        onClick={() => navigate("/")}
      >
        Rekindle
      </Button>
    </HeroNavbarBrand>
  );
};

export default NavbarBrand;
