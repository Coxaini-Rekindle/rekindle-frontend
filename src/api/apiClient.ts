import axios from "axios";
import { toast } from "react-toastify";

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5049", // Default to localhost:5049 if not specified
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/auth/refresh`,
            { refreshToken },
          );

          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            // Update the failed request with new token and retry
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // Handle common error cases with toast notifications
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";

    // Only show toast for non-401 errors (401s are handled above with refresh logic)
    if (error.response?.status !== 401) {
      // Customize messages based on status code
      switch (error.response?.status) {
        case 400:
          toast.error(`Bad request: ${errorMessage}`);
          break;
        case 403:
          toast.error("You don't have permission to access this resource");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 500:
          toast.error("Server error. Please try again later");
          break;
        default:
          // For other error types
          toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
