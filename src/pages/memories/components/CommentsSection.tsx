import type { AppDispatch } from "@/store";
import type { MemoryDto } from "@/types/memory";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody, CardHeader } from "@heroui/card";

import ActivityItem from "./ActivityItem";
import AddContentSection from "./AddContentSection";

import { createComment, createPost } from "@/store/slices/activitiesSlice";
import { useActivities } from "@/hooks/useActivities";

interface CommentsSectionProps {
  memory: MemoryDto;
}

export default function CommentsSection({ memory }: CommentsSectionProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const activitiesContainerRef = useRef<HTMLDivElement>(null);

  const {
    activities,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMoreActivities,
  } = useActivities(memory.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [scrollPositionBeforeLoad, setScrollPositionBeforeLoad] = useState(0);
  const [contentHeightBeforeLoad, setContentHeightBeforeLoad] = useState(0);
  const [previousActivitiesCount, setPreviousActivitiesCount] = useState(0);

  // Improved scroll to bottom function that waits for images to load
  const scrollToBottom = (immediate = false) => {
    const performScroll = () => {
      // Use both document.body and document.documentElement for better compatibility
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );

      window.scrollTo({
        top: scrollHeight,
        behavior: immediate ? "auto" : "smooth",
      });
    };

    // Wait for any images in the activities container to load
    const container = activitiesContainerRef.current;

    if (container) {
      const images = container.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
          // Fallback timeout in case image doesn't load
          setTimeout(resolve, 2000);
        });
      });

      Promise.all(imagePromises).then(() => {
        // Wait a bit more for any layout adjustments
        setTimeout(performScroll, 100);
        // Additional scroll attempt to ensure we're at the bottom
        setTimeout(performScroll, 500);
      });
    } else {
      // Fallback if container ref is not available
      setTimeout(performScroll, 100);
      setTimeout(performScroll, 500);
    }
  };

  // Auto-scroll to bottom only when shouldScrollToBottom is true
  useEffect(() => {
    if (shouldScrollToBottom && activities.length > 0) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom]); // Remove activities.length dependency

  // Handle initial load - scroll to bottom once
  useEffect(() => {
    if (activities.length > 0 && !isLoading && !isLoadingMore) {
      setTimeout(() => scrollToBottom(), 500); // Delay to ensure all content is loaded
    }
  }, [isLoading]); // Only trigger when loading state changes

  // Preserve scroll position when loading more activities
  useEffect(() => {
    if (isLoadingMore) {
      setScrollPositionBeforeLoad(window.scrollY);
      setContentHeightBeforeLoad(
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        ),
      );
      setPreviousActivitiesCount(activities.length);
    }
  }, [isLoadingMore]);

  // Restore scroll position after loading more
  useEffect(() => {
    if (
      !isLoadingMore &&
      contentHeightBeforeLoad > 0 && // Ensures 'before' state was captured
      activities.length > previousActivitiesCount
    ) {
      // Wait for DOM updates and images to load
      const restoreScrollPosition = () => {
        const newContentHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );
        const heightDifference = newContentHeight - contentHeightBeforeLoad;

        let targetScrollPosition = scrollPositionBeforeLoad + heightDifference;

        // Cap scrolling at the bottom of the content
        const maxScrollY = newContentHeight - window.innerHeight;

        targetScrollPosition = Math.min(
          targetScrollPosition,
          maxScrollY > 0 ? maxScrollY : 0,
        );

        // Ensure scroll position is not negative
        targetScrollPosition = Math.max(0, targetScrollPosition);

        window.scrollTo({
          top: targetScrollPosition,
          behavior: "auto",
        });

        // Reset values
        setScrollPositionBeforeLoad(0);
        setContentHeightBeforeLoad(0);
        setPreviousActivitiesCount(0);
      };

      // Wait for images to load in the new activities
      const container = activitiesContainerRef.current;

      if (container) {
        const images = container.querySelectorAll("img");
        const imagePromises = Array.from(images).map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
            // Fallback timeout in case image doesn't load
            setTimeout(resolve, 1000);
          });
        });

        Promise.all(imagePromises).then(() => {
          // Short delay for layout reflow after images are loaded
          setTimeout(restoreScrollPosition, 100);
        });
      } else {
        // Fallback if container ref is not available
        setTimeout(restoreScrollPosition, 200);
      }
    }
  }, [
    isLoadingMore,
    activities.length,
    scrollPositionBeforeLoad,
    contentHeightBeforeLoad,
    previousActivitiesCount,
  ]);

  // Handle submit new comment
  const handleSubmitComment = async (content: string) => {
    if (!content.trim() || !memory.id) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createComment({
          memoryId: memory.id,
          commentData: {
            content: content.trim(),
            replyToPostId: null,
            replyToCommentId: null,
          },
        }),
      );

      // Set flag to scroll to bottom after new comment is added
      setShouldScrollToBottom(true);
    } catch {
      // Failed to create comment
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submit new post
  const handleSubmitPost = async (
    content: string,
    title: string,
    images: File[],
  ) => {
    if (!content.trim() || !memory.id) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createPost({
          memoryId: memory.id,
          postData: {
            content: content.trim(),
            title: title.trim() || undefined,
            images: images.length > 0 ? images : undefined,
          },
        }),
      );

      // Set flag to scroll to bottom after new post is added
      setShouldScrollToBottom(true);
    } catch {
      // Failed to create post
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {t("memories.commentsTitle")}
          </h3>
        </CardHeader>
        <CardBody>
          {/* Load More Button - at the top for older activities */}
          {hasMore && (
            <div className="flex justify-center pb-4">
              <Button
                isLoading={isLoadingMore}
                variant="flat"
                onPress={() => loadMoreActivities(memory.id)}
              >
                {t("activities.loadOlder")}
              </Button>
            </div>
          )}
          {/* Activities List */}
          <div ref={activitiesContainerRef} className="overflow-y-auto">
            {isLoading && activities.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <Spinner size="sm" />
                <span className="ml-2">{t("activities.loading")}</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-danger mb-4">{error}</p>
                <Button
                  variant="bordered"
                  onPress={() => window.location.reload()}
                >
                  {t("common.retry")}
                </Button>
              </div>
            ) : activities.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-foreground-400">
                  {t("memories.noComments")}
                </p>
                <p className="text-xs text-foreground-300 mt-2">
                  {t("activities.beFirstToComment")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    memoryId={memory.id}
                  />
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Sticky Add Content Section at the bottom */}
      <div className="sticky bottom-0 z-50 my-5">
        <div className="mx-auto">
          <AddContentSection
            isSubmitting={isSubmitting}
            onSubmitComment={handleSubmitComment}
            onSubmitPost={handleSubmitPost}
          />
        </div>
      </div>
    </div>
  );
}
