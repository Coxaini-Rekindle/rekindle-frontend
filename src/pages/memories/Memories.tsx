import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { MdAdd, MdSearch, MdArrowBack } from "react-icons/md";

import MemoryCard from "./components/MemoryCard";
import CreateMemoryModal from "./components/CreateMemoryModal";

import { SearchResults } from "@/pages/search";
import { useMemories } from "@/hooks/useMemories";
import { useSearch } from "@/hooks/useSearch";
import { useGroupDetails, useGroupMembers } from "@/hooks/useGroups";

export default function Memories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Get search results
  const {
    searchResults,
    isSearching,
    searchError,
    searchMemories,
    clearSearch,
  } = useSearch();

  // Get memories using the new hook
  const {
    memories,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    fetchMemories,
    loadMoreMemories,
  } = useMemories(groupId);

  // Get group details if we're in a group context
  const { data: groupData } = useGroupDetails(groupId || "", !!groupId);
  const { data: groupMembers, isLoading: isLoadingGroupMembers } =
    useGroupMembers(groupId || "", !!groupId);

  // Load memories on component mount or when groupId changes
  useEffect(() => {
    if (groupId) {
      fetchMemories(groupId, 20, true);
    }
  }, [groupId, fetchMemories]);

  // Handle search when query changes
  useEffect(() => {
    if (searchQuery.trim() && groupId) {
      // Debounce search to avoid too many API calls
      const searchTimeout = setTimeout(() => {
        searchMemories({
          groupId,
          searchTerm: searchQuery.trim(),
          limit: 20,
          offset: 0,
        });
      }, 500);

      return () => clearTimeout(searchTimeout);
    } else {
      clearSearch();
    }
  }, [searchQuery, groupId, searchMemories, clearSearch]);

  // Filter memories based on search query
  const filteredMemories = memories.filter((memory) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();

    return (
      memory.description?.toLowerCase().includes(searchLower) ||
      memory.title?.toLowerCase().includes(searchLower) ||
      memory.mainPost?.content?.toLowerCase().includes(searchLower)
    );
  });

  const handleLoadMore = () => {
    if (groupId && hasMore && !isLoadingMore) {
      loadMoreMemories(groupId);
    }
  };

  const handleBackToGroups = () => {
    navigate("/groups");
  };

  const handleCreateMemory = () => {
    setIsCreateModalOpen(true);
  };

  // Loading state - ensure both memories and group members are loaded before rendering
  if (
    (isLoading && memories.length === 0) ||
    (groupId && isLoadingGroupMembers)
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 bg-content1 border border-divider rounded-lg">
        <p className="text-danger mb-4">{error}</p>
        <Button
          color="primary"
          onPress={() =>
            groupId
              ? fetchMemories(groupId, 20, true)
              : window.location.reload()
          }
        >
          {t("memories.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {groupId && (
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={handleBackToGroups}
              >
                <MdArrowBack size={20} />
              </Button>
            )}
            <h1 className="text-3xl font-bold text-foreground">
              {groupId
                ? t("memories.groupMemories", {
                    groupName: groupData?.name || "Group",
                  })
                : t("memories.title")}
            </h1>
          </div>
          <p className="mt-1 text-foreground-500">
            {groupId ? t("memories.groupSubtitle") : t("memories.subtitle")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="hidden sm:flex"
            color="primary"
            startContent={<MdAdd size={20} />}
            onPress={handleCreateMemory}
          >
            {t("memories.createMemory")}
          </Button>
        </div>
      </div>
      {/* Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            classNames={{
              base: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder={t("memories.searchPlaceholder")}
            startContent={
              <MdSearch className="text-foreground-400" size={18} />
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Button
        className="mb-6 w-full sm:hidden"
        color="primary"
        startContent={<MdAdd size={20} />}
        onPress={handleCreateMemory}
      >
        {t("memories.createMemory")}
      </Button>
      {/* Stats */}
      {groupId && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-content1 p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {memories.length}
            </div>
            <div className="text-small text-foreground-500">
              {t("memories.stats.totalMemories")}
            </div>
          </div>

          <div className="rounded-lg bg-content1 p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {groupMembers?.length || 0}
            </div>
            <div className="text-small text-foreground-500">
              {t("memories.stats.totalPeople")}
            </div>
          </div>

          <div className="rounded-lg bg-content1 p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {memories.reduce(
                (total, memory) =>
                  total + (memory.mainPost?.reactionSummary?.totalCount || 0),
                0,
              )}
            </div>
            <div className="text-small text-foreground-500">
              {t("memories.stats.totalReactions")}
            </div>
          </div>
        </div>
      )}{" "}
      {/* Memory Feed or Search Results */}
      {searchQuery.trim() ? (
        <SearchResults
          error={searchError}
          groupId={groupId || ""}
          isLoading={isSearching}
          results={searchResults}
          searchQuery={searchQuery}
        />
      ) : filteredMemories.length > 0 ? (
        <div className="space-y-6">
          {filteredMemories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <Button
                isLoading={isLoadingMore}
                variant="flat"
                onPress={handleLoadMore}
              >
                {isLoadingMore
                  ? t("memories.loadingMore")
                  : t("memories.loadMore")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-2 text-lg text-foreground-400">
            {searchQuery
              ? t("memories.noSearchResults")
              : t("memories.noMemories.title")}
          </div>
          <p className="mb-6 text-foreground-500">
            {searchQuery
              ? t("memories.noMemories.searchSubtitle")
              : t("memories.noMemories.subtitle")}
          </p>
          {!searchQuery && groupId && (
            <Button
              color="primary"
              startContent={<MdAdd size={20} />}
              onPress={handleCreateMemory}
            >
              {t("memories.createFirstMemory")}
            </Button>
          )}
        </div>
      )}
      {/* Create Memory Modal */}
      {groupId && (
        <CreateMemoryModal
          groupId={groupId}
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />
      )}
    </div>
  );
}
