export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarFileId?: string;
}

export interface UpdateNameRequest {
  name: string;
}

// New types for recognized users
export interface RecognizedUser {
  userId: string;
  lastFaceFileId: string | null;
  isTemp: boolean;
}

export interface MergeUsersRequest {
  sourceUserId: string;
  targetUserId: string;
}
