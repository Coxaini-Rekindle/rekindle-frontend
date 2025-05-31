// Memory types for the Rekindle app - aligned with API schema

export interface MemoryDto {
  id: string;
  groupId: string;
  title: string;
  description: string;
  createdAt: string;
  creatorUserId: string;
  participantsIds: string[];
  mainPostId: string;
  mainPost: PostDto | null;
}

export interface PostDto {
  id: string;
  memoryId: string;
  content: string;
  images: ImageDto[];
  createdAt: string;
  creatorUserId: string;
  reactions: ReactionDto[];
  reactionSummary: ReactionSummaryDto;
}

export interface ImageDto {
  fileId: string;
  participantIds: string[];
}

export interface ReactionDto {
  userId: string;
  type: ReactionTypeDto;
  createdAt: string;
}

export interface ReactionSummaryDto {
  totalCount: number;
  reactionCounts: Record<string, number>;
  userReactions: ReactionTypeDto[];
}

export enum ReactionTypeDto {
  Love = "Love",
  Laugh = "Laugh",
  Wow = "Wow",
  Nostalgic = "Nostalgic",
  Grateful = "Grateful",
  Celebrate = "Celebrate",
  Support = "Support",
  Memories = "Memories",
  Family = "Family",
  Friendship = "Friendship",
  Journey = "Journey",
  Milestone = "Milestone",
  Peaceful = "Peaceful",
  Adventure = "Adventure",
  Warm = "Warm",
}

export interface CursorPaginationResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// Request types
export interface CreateMemoryFormRequest {
  title: string;
  description: string;
  content: string;
  images?: File[];
  participantIds?: string;
  existingFileIds?: string;
}

// Legacy types (keeping for compatibility with existing components)
export interface MemoryImageDto {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  takenAt?: string;
  location?: MemoryLocationDto;
  people: MemoryPersonDto[];
  order: number;
}

export interface MemoryLocationDto {
  id: string;
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  country?: string;
  city?: string;
}

export interface MemoryPersonDto {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  isTagged: boolean;
}

export interface MemoryCommentDto {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  replies?: MemoryCommentDto[];
}

export interface MemoryReactionDto {
  id: string;
  type: ReactionType;
  userId: string;
  userName: string;
  createdAt: string;
}

export enum ReactionType {
  LIKE = "like",
  LOVE = "love",
  LAUGH = "laugh",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}

export interface CreateMemoryRequest {
  title: string;
  description?: string;
  images: CreateMemoryImageRequest[];
  people: string[]; // User IDs
  isPublic: boolean;
  groupId?: string;
}

export interface CreateMemoryImageRequest {
  file: File;
  caption?: string;
  takenAt?: string;
  location?: Omit<MemoryLocationDto, "id">;
  taggedPeople: string[]; // User IDs
  order: number;
}

export interface UpdateMemoryRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
}
