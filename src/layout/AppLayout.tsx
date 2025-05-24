import React, { useEffect } from "react";

import Navbar from "./Navbar";

import { useUserProfile } from "@/hooks/useUserProfile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { getProfile } = useUserProfile();

  // Load user profile data when app initializes
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center"> {children}</div>
    </div>
  );
};

export default AppLayout;
