import type { MemoryDto, MemoryCommentDto } from "@/types/memory";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { mockMemories } from "./mockData";
import {
  MemoryHeader,
  MemoryContent,
  AddPostSection,
  CommentsSection,
} from "./components";

export default function MemoryDetail() {
  const { t } = useTranslation();
  const { memoryId } = useParams<{ memoryId: string }>();
  const navigate = useNavigate();

  const [memory, setMemory] = useState<MemoryDto | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newPost, setNewPost] = useState("");
  const [isAddingPost, setIsAddingPost] = useState(false);

  useEffect(() => {
    // Find memory by ID from mock data
    const foundMemory = mockMemories.find((m) => m.id === memoryId);

    if (foundMemory) {
      setMemory(foundMemory);
    } else {
      // Memory not found, redirect back
      navigate("/memories");
    }
  }, [memoryId, navigate]);

  const handleBack = () => {
    navigate("/memories");
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !memory) return;

    const comment: MemoryCommentDto = {
      id: `comment-${Date.now()}`,
      authorId: "current-user",
      authorName: "You",
      authorAvatar: "",
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setMemory({
      ...memory,
      comments: [...memory.comments, comment],
    });

    setNewComment("");
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;

    // For now, we'll add this as a comment since we don't have a separate posts system
    const post: MemoryCommentDto = {
      id: `post-${Date.now()}`,
      authorId: "current-user",
      authorName: "You",
      authorAvatar: "",
      content: newPost.trim(),
      createdAt: new Date().toISOString(),
    };

    if (memory) {
      setMemory({
        ...memory,
        comments: [...memory.comments, post],
      });
    }

    setNewPost("");
    setIsAddingPost(false);
  };

  if (!memory) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground-400">{t("memories.loading")}</p>
        </div>
      </div>
    );
  }

  const getAllLocations = () => {
    const locations = new Set<string>();

    // Add memory-level locations
    memory.locations.forEach((location) => {
      if (location.name) {
        locations.add(location.name);
      }
    });

    // Add image-level locations
    memory.images.forEach((image) => {
      if (image.location?.name) {
        locations.add(image.location.name);
      }
    });

    return Array.from(locations);
  };

  const locations = getAllLocations();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <MemoryHeader onBack={handleBack} />

      <MemoryContent locations={locations} memory={memory} />

      <AddPostSection
        isAddingPost={isAddingPost}
        newPost={newPost}
        onPostChange={setNewPost}
        onSubmitPost={handleAddPost}
        onToggleAddingPost={setIsAddingPost}
      />

      <CommentsSection
        memory={memory}
        newComment={newComment}
        onCommentChange={setNewComment}
        onSubmitComment={handleAddComment}
      />
    </div>
  );
}
