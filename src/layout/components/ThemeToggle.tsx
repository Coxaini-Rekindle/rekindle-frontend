import React from "react";
import { Button } from "@heroui/button";
import { useTheme } from "@heroui/use-theme";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      isIconOnly
      className="text-foreground-600 hover:text-foreground-900"
      variant="light"
      onPress={toggleTheme}
    >
      {theme === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
    </Button>
  );
};

export default ThemeToggle;
