import axios, { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';
import { LoginData, RegisterData } from '@/types/auth';
import { loginSchema } from '@/lib/validation';

const API_URL = '/api/auth';

export const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.trim().split('=');
    if (cookieName === 'csrf_token') {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
};

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
 * Logs in a user; the session token is set in an HTTP-only cookie.
 */
export const login = async (loginData: LoginData): Promise<{ user: any }> => {
  try {
    const validatedData = loginSchema.parse(loginData);
    const response = await apiClient.post('/login', validatedData);
    return { user: response.data.user };
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
    await signOut({ redirect: false });
    clearCsrfToken();
  } catch (error) {
    clearCsrfToken();
    throw handleError(error);
  }
};

export const clearCsrfToken = (): void => {
  if (typeof document === 'undefined') return;

  document.cookie = 'csrf_token=; path=/; max-age=0; SameSite=Strict';
};

export const restoreGitHubSession = async (): Promise<{ user: any } | null> => {
  try {
    const response = await fetch('/api/auth/github/session', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.user ? { user: data.user } : null;
  } catch {
    return null;
  }
};

/**
 * Get current user data from the server using the HTTP-only session cookie.
 */
export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/me', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};


export default apiClient;