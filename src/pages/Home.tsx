import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RootState } from "@/store";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="home-container p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {t("home.welcome")}
        </h1>
      </div>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
        {t("home.subtitle")}
      </p>

      {!auth.isAuthenticated && (
        <div className="action-buttons flex space-x-4 mb-12">
          <Link
            className="btn-primary px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            to="/login"
          >
            {t("home.actions.login")}
          </Link>
          <Link
            className="btn-secondary px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            to="/register"
          >
            {t("home.actions.register")}
          </Link>
        </div>
      )}

      <div className="features-section bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t("home.features.title")}
        </h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-center">
            <span className="mr-2">•</span>
            {t("home.features.connect")}
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            {t("home.features.share")}
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            {t("home.features.stayUpdated")}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
