import apiClient from "./apiClient";
import { API_PREFIXES, buildEndpoint } from "./apiConfig";

// Define TypeScript interfaces for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticationResult {
  accessToken: string;
  refreshToken: string;
}

// Auth API functions
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthenticationResult> => {
    const response = await apiClient.post<AuthenticationResult>(
      buildEndpoint(API_PREFIXES.USER_GROUPS, "/auth/login"),
      credentials,
    );

    return response.data;
  },

  register: async (
    userData: RegisterRequest,
  ): Promise<AuthenticationResult> => {
    const response = await apiClient.post<AuthenticationResult>(
      buildEndpoint(API_PREFIXES.USER_GROUPS, "/auth/register"),
      userData,
    );

    return response.data;
  },

  refreshToken: async (
    data: RefreshTokenRequest,
  ): Promise<AuthenticationResult> => {
    const response = await apiClient.post<AuthenticationResult>(
      buildEndpoint(API_PREFIXES.USER_GROUPS, "/auth/refresh"),
      data,
    );

    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
};
