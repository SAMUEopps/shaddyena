// shd-lib/hooks/useApiWithOrg.ts

import { useAuth } from "@/shd-contexts/AuthContext";


/**
 * Hook to get headers with organization ID for API calls
 */
export function useApiWithOrg() {
  const { token, organizationId, user } = useAuth();

  const getHeaders = (additionalHeaders: Record<string, string> = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (organizationId) {
      headers['X-Organization-Id'] = organizationId;
    }

    return headers;
  };

  const apiRequest = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const headers = getHeaders(options.headers as Record<string, string>);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  };

  return {
    getHeaders,
    apiRequest,
    organizationId,
    token,
    user,
    isAuthenticated: !!user && !!token
  };
}