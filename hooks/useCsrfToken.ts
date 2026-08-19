'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to manage CSRF tokens for the application.
 * Retrieves token from localStorage and provides refresh functionality.
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load CSRF token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('csrfToken');
    setCsrfToken(stored);
    setIsLoading(false);
  }, []);

  /**
   * Store a new CSRF token (typically called after login or when receiving new token from server)
   */
  const setCsrf = (token: string) => {
    localStorage.setItem('csrfToken', token);
    setCsrfToken(token);
  };

  /**
   * Remove CSRF token (typically called on logout)
   */
  const clearCsrf = () => {
    localStorage.removeItem('csrfToken');
    setCsrfToken(null);
  };

  return {
    csrfToken,
    setCsrf,
    clearCsrf,
    isLoading,
  };
}
