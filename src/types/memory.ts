// Memory types for the Rekindle app

export interface MemoryDto {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  images: MemoryImageDto[];
  people: MemoryPersonDto[];
  comments: MemoryCommentDto[];
  reactions: MemoryReactionDto[];
  isPublic: boolean;
  groupId?: string;
  locations: MemoryLocationDto[];
}

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
