import type { MemoryDto } from "@/types/memory";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { MdAdd, MdSearch } from "react-icons/md";

import MemoryCard from "./components/MemoryCard";
import { mockMemories } from "./mockData";

export default function Memories() {
  const { t } = useTranslation();
  const [memories] = useState<MemoryDto[]>(mockMemories);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMemories = memories.filter((memory) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();

    return (
      memory.description?.toLowerCase().includes(searchLower) ||
      memory.locations.some((location) =>
        location.name?.toLowerCase().includes(searchLower),
      ) ||
      memory.people.some((person) =>
        person.name.toLowerCase().includes(searchLower),
      ) ||
      memory.images.some(
        (image) =>
          image.caption?.toLowerCase().includes(searchLower) ||
          image.location?.name?.toLowerCase().includes(searchLower),
      )
    );
  });

  const sortedMemories = filteredMemories.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("memories.title")}
          </h1>
          <p className="mt-1 text-foreground-500">{t("memories.subtitle")}</p>
        </div>

        <div className="flex gap-2">
          <Button
            className="hidden sm:flex"
            color="primary"
            startContent={<MdAdd size={20} />}
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
      >
        {t("memories.createMemory")}
      </Button>

      {/* Stats */}
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
            {
              new Set(
                memories.flatMap((memory) => memory.people.map((p) => p.id)),
              ).size
            }
          </div>
          <div className="text-small text-foreground-500">
            {t("memories.stats.totalPeople")}
          </div>
        </div>

        <div className="rounded-lg bg-content1 p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {
              new Set(
                memories.flatMap((memory) => {
                  const locations: string[] = [];

                  memory.locations.forEach((location) => {
                    if (location.name) locations.push(location.name);
                  });

                  memory.images.forEach((img) => {
                    if (img.location?.name) locations.push(img.location.name);
                  });

                  return locations;
                }),
              ).size
            }
          </div>
          <div className="text-small text-foreground-500">
            {t("memories.stats.totalLocations")}
          </div>
        </div>
      </div>

      {/* Memory Feed */}
      {sortedMemories.length > 0 ? (
        <div className="space-y-6">
          {sortedMemories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
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
          {!searchQuery && (
            <Button color="primary" startContent={<MdAdd size={20} />}>
              {t("memories.createFirstMemory")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
