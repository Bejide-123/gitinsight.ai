import axios, { AxiosError } from 'axios';
import { LoginData, RegisterData } from '@/types/auth';

const API_URL = '/api/auth';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper to handle errors consistently
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as any;
    const message = errorData?.error || errorData?.message || 'An unexpected error occurred';
    throw new Error(message);
  }
  throw new Error('An unexpected error occurred');
};

/**
 * Logs in a user - receives token in response
 */
export const login = async (loginData: LoginData): Promise<{ token: string; user: any }> => {
  try {
    const response = await apiClient.post('/login', loginData);
    const { token, ...userData } = response.data;
    
    // Save a client-side fallback cookie so protected routes can still authenticate
    // if the server-set HTTP-only cookie is not available in the browser for any reason.
    setAuthToken(token);
    
    return { token, user: userData };
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Registers a new user
 */
export const register = async (registerData: RegisterData): Promise<any> => {
  try {
    const response = await apiClient.post('/register', registerData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Logs out the current user - clears token
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/logout');
    clearAuthToken();
  } catch (error) {
    // Even if server fails, clear local token
    clearAuthToken();
    throw handleError(error);
  }
};

/**
 * Get the current auth token from cookies
 */
export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token' || name === 'auth_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

/**
 * Set the auth token in cookies with secure options
 */
export const setAuthToken = (token: string): void => {
  if (typeof document === 'undefined') return;
  
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
};

/**
 * Clear the auth token from cookies
 */
export const clearAuthToken = (): void => {
  if (typeof document === 'undefined') return;
  
  // Set cookie to expire immediately
  document.cookie = 'auth_token=; path=/; max-age=0';
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Get current user data from server using token
 */
export const getCurrentUser = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await apiClient.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};


// // Example: making authenticated API calls in other services
// import { getAuthToken } from '@/services/auth-service';

// export const fetchProtectedData = async () => {
//   const token = getAuthToken();
  
//   if (!token) {
//     throw new Error('Not authenticated');
//   }
  
//   const response = await fetch('/api/protected-endpoint', {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });
  
//   if (!response.ok) {
//     throw new Error('Failed to fetch protected data');
//   }
  
//   return response.json();
// };
// Export the client for custom requests with token
export default apiClient;