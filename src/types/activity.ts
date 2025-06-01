// Activity types for the Rekindle app - aligned with API schema

import {
  ImageDto,
  ReactionDto,
  ReactionSummaryDto,
  ReactionTypeDto,
} from "./memory";

export enum MemoryActivityType {
  Post = "Post",
  Comment = "Comment",
}

export interface MemoryActivityDto {
  id: string;
  memoryId: string;
  content: string;
  createdAt: string;
  creatorUserId: string;
  type: MemoryActivityType;
  reactions: ReactionDto[];
  reactionSummary: ReactionSummaryDto;
  images: ImageDto[];
  replyToPostId: string | null;
  replyToCommentId: string | null;
  isReplyToPost: boolean;
  isReplyToComment: boolean;
  isTopLevelComment: boolean;
}

export interface CommentDto {
  id: string;
  memoryId: string;
  content: string;
  createdAt: string;
  creatorUserId: string;
  replyToPostId: string | null;
  replyToCommentId: string | null;
  reactions: ReactionDto[];
  reactionSummary: ReactionSummaryDto;
  isReplyToPost: boolean;
  isReplyToComment: boolean;
  isTopLevelComment: boolean;
}

// Request types
export interface CreateCommentRequest {
  content: string;
  replyToPostId: string | null;
  replyToCommentId: string | null;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface AddReactionRequest {
  type: ReactionTypeDto;
}

export interface CursorPaginationResponseOfMemoryActivityDto {
  items: MemoryActivityDto[];
  nextCursor: string | null;
  hasMore: boolean;
}
