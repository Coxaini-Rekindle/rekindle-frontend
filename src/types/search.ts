export interface SearchPhoto {
  photoId: string;
  postId: string;
  title: string;
  content: string;
  creatorUserId: string;
}

export interface SearchMemoryResponse {
  memoryId: string;
  createdAt: string;
  photo: SearchPhoto;
  title: string;
  content: string;
}

export interface SearchParams {
  groupId: string;
  searchTerm: string;
  limit?: number;
  offset?: number;
  participants?: string[];
}
