import type { AppDispatch } from "@/store";
import type { MemoryDto } from "@/types/memory";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { MdArrowBack } from "react-icons/md";

import CommentsSection from "./components/CommentsSection";

import { memoriesApi } from "@/api/memoriesApi";
import {
  fetchGroupMembers,
  selectCurrentGroupMembers,
  selectGroupsLoading,
} from "@/store/slices/groupsSlice";

export default function MemoryDetail() {
  const { t } = useTranslation();
  const { memoryId } = useParams<{ memoryId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const currentGroupMembers = useSelector(selectCurrentGroupMembers);
  const groupsLoading = useSelector(selectGroupsLoading);
  const [memory, setMemory] = useState<MemoryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      if (!memoryId) {
        navigate("/groups");

        return;
      }

      try {
        setLoading(true);
        setError(null);
        const memoryData = await memoriesApi.getMemoryById(memoryId);

        setMemory(memoryData);
      } catch {
        setError(t("memories.error"));
        setTimeout(() => navigate("/groups"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [memoryId, navigate, t]);

  // Fetch group members if they're not present and we have memory data
  useEffect(() => {
    if (
      memory &&
      memory.groupId &&
      currentGroupMembers.length === 0 &&
      !groupsLoading
    ) {
      dispatch(fetchGroupMembers(memory.groupId));
    }
  }, [memory, currentGroupMembers.length, groupsLoading, dispatch]);

  const handleBack = () => {
    // Try to extract group id from memory if available
    if (memory && memory.groupId) {
      navigate(`/groups/${memory.groupId}/memories`);
    } else {
      // If no group id is available, go to groups page
      navigate("/groups");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
        <span className="ml-2">{t("memories.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger mb-4">{error}</p>
        <Button variant="bordered" onPress={handleBack}>
          {t("common.goBack")}
        </Button>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground-500 mb-4">
          {t("memories.noMemories.title")}
        </p>
        <Button variant="bordered" onPress={handleBack}>
          {t("common.goBack")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header with back button */}
      <div className="sticky top-2.5 z-50">
        <div className="mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              isIconOnly
              aria-label={t("common.goBack")}
              variant="light"
              onPress={handleBack}
            >
              <MdArrowBack className="text-xl" />
            </Button>
            <h1 className="text-2xl font-bold">{t("memories.memoryDetail")}</h1>
          </div>
        </div>
      </div>

      {/* Memory content */}
      <div className="space-y-6">
        {/* Comments/Posts section */}
        <CommentsSection memory={memory} />
      </div>
    </div>
  );
}
