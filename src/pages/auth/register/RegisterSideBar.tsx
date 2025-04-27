import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { FaBook, FaSearch, FaUsers, FaLock, FaHistory } from "react-icons/fa";

interface RegisterSideBarProps {
  className?: string;
}

const RegisterSideBar: React.FC<RegisterSideBarProps> = ({
  className = "",
}) => {
  const cardsData = [
    {
      icon: <FaUsers className="text-indigo-500" />,
      title: "Create Memory Circles",
      description:
        "Form intimate groups with the people who matter most. Share stories and experiences that only those who were there can truly appreciate.",
    },
    {
      icon: <FaBook className="text-indigo-500" />,
      title: "Build Living Memories",
      description:
        "Create rich, interactive memories that evolve over time. Group members can add comments, perspectives, and forgotten details.",
    },
    {
      icon: <FaSearch className="text-indigo-500" />,
      title: "AI-Powered Search",
      description:
        "Our revolutionary search understands natural language and analyzes images, text, and comments to find exactly what you're looking for.",
    },
    {
      icon: <FaLock className="text-indigo-500" />,
      title: "Privacy-First Approach",
      description:
        "Your memories stay private within your circles. We don't mine your data or share it with third parties - your memories belong to you.",
    },
    {
      icon: <FaHistory className="text-indigo-500" />,
      title: "Timeline Journeys",
      description:
        "Explore your shared history through interactive timelines, rediscovering moments and connections that shaped your relationships.",
    },
  ];

  return (
    <div className={`p-6 overflow-y-auto ${className}`}>
      <div className="lg:sticky lg:top-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Why Join Rekindle?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your personal time capsule of shared experiences
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
            Join thousands of others preserving their meaningful connections.
            <br />
            Start your memory journey today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSideBar;
