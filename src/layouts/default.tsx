import { FC, ReactNode } from "react";

import Navbar from "@/components/navbar";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="gradient-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl w-full mx-auto">{children}</div>
      </main>
      <footer className="py-6 px-4 md:px-8 border-t border-gray-200 dark:border-gray-800 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Rekindle
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Reignite connections, rediscover relationships
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-2">
              <a
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                href="#"
              >
                About
              </a>
              <a
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                href="#"
              >
                Privacy
              </a>
              <a
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                href="#"
              >
                Terms
              </a>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Rekindle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DefaultLayout;
