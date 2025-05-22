import { useSelector } from "react-redux";

import { RootState } from "../store";

export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  return {
    isAuthenticated,
    isLoading,
    error,
  };
};
