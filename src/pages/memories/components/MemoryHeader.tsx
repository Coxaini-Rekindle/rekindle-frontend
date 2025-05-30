import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { MdArrowBack } from "react-icons/md";

interface MemoryHeaderProps {
  onBack: () => void;
}

export default function MemoryHeader({ onBack }: MemoryHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex items-center gap-4">
      <Button isIconOnly size="sm" variant="flat" onPress={onBack}>
        <MdArrowBack size={20} />
      </Button>
      <h1 className="text-2xl font-bold text-foreground">
        {t("memories.memoryDetail")}
      </h1>
    </div>
  );
}
