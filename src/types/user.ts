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
