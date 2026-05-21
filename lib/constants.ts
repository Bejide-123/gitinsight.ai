// lib/constants.ts

/**
 * File size thresholds (lines of code)
 */
export const FILE_SIZE_THRESHOLDS = {
  WARNING: 500,
  ERROR: 1000,
  CRITICAL: 2000,
} as const;

/**
 * Component complexity thresholds
 */
export const COMPLEXITY_THRESHOLDS = {
  USE_STATE: {
    WARNING: 10,
    ERROR: 20,
  },
  USE_EFFECT: {
    WARNING: 5,
    ERROR: 10,
  },
  PROPS: {
    WARNING: 10,
    ERROR: 15,
  },
} as const;

/**
 * Testing coverage thresholds
 */
export const COVERAGE_THRESHOLDS = {
  MINIMUM: 70,
  GOOD: 80,
  EXCELLENT: 90,
} as const;

/**
 * Code file extensions to analyze
 */
export const CODE_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
] as const;

/**
 * Config files to always fetch
 */
export const CONFIG_FILES = [
  'package.json',
  'tsconfig.json',
  'jsconfig.json',
  '.env.example',
  'next.config.js',
  'next.config.mjs',
  'vite.config.js',
  'vite.config.ts',
  'tailwind.config.js',
  'tailwind.config.ts',
  '.eslintrc.js',
  '.eslintrc.json',
] as const;

/**
 * Entry point file patterns
 */
export const ENTRY_POINT_PATTERNS = [
  'src/main',
  'src/index',
  'src/App',
  'app/layout',
  'pages/_app',
  'pages/index',
] as const;

/**
 * Security patterns to detect
 */
export const SECURITY_PATTERNS = {
  // Hardcoded secrets
  SECRETS: [
    /(?:API_KEY|APIKEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY)\s*=\s*["'`]([a-zA-Z0-9_\-]{8,})["'`]/gi,
    /(?:apiKey|api_key|accessToken|secretKey)\s*:\s*["'`]([a-zA-Z0-9_\-]{8,})["'`]/gi,
  ],

  // SQL Injection
  SQL_INJECTION: [
    /\$\{[^}]+\}.*(?:SELECT|INSERT|UPDATE|DELETE)/gi,
    /\+.*(?:SELECT|INSERT|UPDATE|DELETE).*FROM/gi,
  ],

  // XSS
  XSS: [
    /dangerouslySetInnerHTML/gi,
    /innerHTML(?!\s*=\s*DOMPurify)/gi,
  ],
} as const;

/**
 * Framework/library detection
 */
export const FRAMEWORK_SIGNALS = {
  REACT: ['react', 'react-dom'],
  NEXT: ['next'],
  VITE: ['vite'],
  TESTING: ['jest', 'vitest', 'playwright', 'cypress'],
  STATE_MANAGEMENT: ['zustand', 'redux', '@reduxjs/toolkit', 'jotai', 'recoil'],
  DATA_FETCHING: ['@tanstack/react-query', 'swr', 'apollo-client'],
  AUTH: ['next-auth', 'clerk', 'supabase', 'firebase'],
  PAYMENTS: ['stripe', '@stripe/stripe-js'],
  MONITORING: ['sentry', '@sentry/react', 'datadog', 'posthog'],
} as const;

/**
 * Maturity levels based on score
 */
export const MATURITY_LEVELS = [
  { min: 0, max: 30, level: 'Early Development', production: false },
  { min: 31, max: 50, level: 'Functional Prototype', production: false },
  { min: 51, max: 70, level: 'MVP - Feature Complete', production: false },
  { min: 71, max: 85, level: 'Production Candidate', production: true },
  { min: 86, max: 100, level: 'Production Ready', production: true },
] as const;

/**
 * Get maturity level from score
 */
export function getMaturityLevel(score: number): {
  level: string;
  production: boolean;
} {
  const match = MATURITY_LEVELS.find(
    (m) => score >= m.min && score <= m.max
  );
  return match || MATURITY_LEVELS[0];
}

/**
 * Severity score penalties
 */
export const SEVERITY_PENALTIES = {
  critical: 40,
  high: 25,
  medium: 10,
  low: 5,
} as const;

/**
 * Auto-fail conditions (instant production fail)
 */
export const AUTO_FAIL_CONDITIONS = {
  HARDCODED_SECRETS: true,
  SQL_INJECTION: true,
  XSS_VULNERABILITY: true,
  NO_AUTH_ON_PROTECTED_ROUTES: true,
} as const;