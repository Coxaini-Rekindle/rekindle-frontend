import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { FaBook, FaSearch, FaUsers, FaLock, FaHistory } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface RegisterSideBarProps {
  className?: string;
}

const RegisterSideBar: React.FC<RegisterSideBarProps> = ({
  className = "",
}) => {
  const { t } = useTranslation();

  const cardsData = [
    {
      icon: <FaUsers className="text-indigo-500" />,
      title: t("register.sidebar.features.memoryCicles.title"),
      description: t("register.sidebar.features.memoryCicles.description"),
    },
    {
      icon: <FaBook className="text-indigo-500" />,
      title: t("register.sidebar.features.livingMemories.title"),
      description: t("register.sidebar.features.livingMemories.description"),
    },
    {
      icon: <FaSearch className="text-indigo-500" />,
      title: t("register.sidebar.features.aiSearch.title"),
      description: t("register.sidebar.features.aiSearch.description"),
    },
    {
      icon: <FaLock className="text-indigo-500" />,
      title: t("register.sidebar.features.privacy.title"),
      description: t("register.sidebar.features.privacy.description"),
    },
    {
      icon: <FaHistory className="text-indigo-500" />,
      title: t("register.sidebar.features.timeline.title"),
      description: t("register.sidebar.features.timeline.description"),
    },
  ];

  return (
    <div className={`p-6 overflow-y-auto ${className}`}>
      <div className="lg:sticky lg:top-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {t("register.sidebar.title")}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("register.sidebar.subtitle")}
        </p>

        <div className="space-y-4">
          {cardsData.map((card, index) => (
            <Card
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-400/50 dark:border-gray-700/50"
            >
              <CardHeader className="text-md font-semibold text-indigo-600 dark:text-indigo-400 pb-1 flex items-center gap-2">
                {card.icon}
                {card.title}
              </CardHeader>
              <Divider />
              <CardBody className="py-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {card.description}
                </p>
              </CardBody>
            </Card>
          ))}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            {t("register.sidebar.footer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSideBar;
