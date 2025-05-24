import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  authApi,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
} from "../api/authApi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  refreshTokenSuccess,
  logout as logoutAction,
  clearError,
} from "../store/slices/authSlice";
import { RootState } from "../store";

// Helper function to wait for Redux state update and then navigate
const useAuthNavigate = () => {
  const navigate = useNavigate();
  const store = useStore();

  return (path: string) => {
    // Get initial auth state
    const initialState = store.getState() as RootState;
    const initialIsAuthenticated = initialState.auth.isAuthenticated;

    // If already authenticated, navigate immediately
    if (initialIsAuthenticated) {
      navigate(path);

      return;
    }

    // Otherwise set up a one-time listener for state changes
    const unsubscribe = store.subscribe(() => {
      const currentState = store.getState() as RootState;

      if (currentState.auth.isAuthenticated && !initialIsAuthenticated) {
        // State has changed to authenticated, navigate and unsubscribe
        navigate(path);
        unsubscribe();
      }
    });
  };
};

// Hook for login mutation
export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigateAfterAuth = useAuthNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => {
      dispatch(loginStart());

      return authApi.login(credentials);
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful! Welcome back.");
      navigateAfterAuth("/groups");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Login failed";

      toast.error(`Login failed: ${errorMessage}`);

      dispatch(loginFailure(errorMessage));
    },
  });
};

// Hook for registration mutation
export const useRegister = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigateAfterAuth = useAuthNavigate();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => {
      dispatch(registerStart());

      return authApi.register(userData);
    },
    onSuccess: (data) => {
      dispatch(registerSuccess(data));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Registration successful! Welcome to Rekindle.");
      navigateAfterAuth("/groups");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Registration failed";

      toast.error(`Registration failed: ${errorMessage}`);
      dispatch(registerFailure(errorMessage));
    },
  });
};

// Hook for token refresh mutation
export const useRefreshToken = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => {
      return authApi.refreshToken(data);
    },
    onSuccess: (data) => {
      dispatch(refreshTokenSuccess(data));
    },
    onError: () => {
      // If refresh token fails, log the user out
      dispatch(logoutAction());
    },
  });
};

// Hook for logout function
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    authApi.logout();
    dispatch(logoutAction());
    queryClient.invalidateQueries();
    toast.info("You have been logged out successfully.");
    navigate("/login");
  };
};

// Hook for clearing auth errors
export const useClearAuthError = () => {
  const dispatch = useDispatch();

  return () => {
    dispatch(clearError());
  };
};
