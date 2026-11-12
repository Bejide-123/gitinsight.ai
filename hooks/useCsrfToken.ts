'use client';

import { useState, useEffect } from 'react';
import { clearCsrfToken, getCsrfToken } from '@/services/auth-service';

/**
 * Hook to manage CSRF tokens for the application.
 * Reads the token from its same-site, JavaScript-readable cookie.
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCsrfToken(getCsrfToken());
    setIsLoading(false);
  }, []);

  const clearCsrf = () => {
    clearCsrfToken();
    setCsrfToken(null);
  };

  return {
    csrfToken,
    clearCsrf,
    isLoading,
  };
}
