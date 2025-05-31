// API configuration for microservices
export const API_PREFIXES = {
  USER_GROUPS: "/user-groups-api",
  MEMORIES: "/memories-api",
} as const;

// Helper function to build endpoint URLs
export const buildEndpoint = (prefix: string, path: string): string => {
  return `${prefix}${path}`;
};
