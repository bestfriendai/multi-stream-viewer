// Modern error handling types for 2025

// Base error interface
export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;
  readonly stack?: string;
}

// Specific error types
export interface StreamError extends AppError {
  readonly streamId?: string;
  readonly platform?: string;
  readonly channelName?: string;
}

export interface NetworkError extends AppError {
  readonly url?: string;
  readonly status?: number;
  readonly retryCount?: number;
}

export interface ValidationError extends AppError {
  readonly field: string;
  readonly value: unknown;
  readonly constraint: string;
}

// Error codes enum
export const ERROR_CODES = {
  // Stream errors
  STREAM_NOT_FOUND: 'STREAM_NOT_FOUND',
  STREAM_LOAD_FAILED: 'STREAM_LOAD_FAILED',
  STREAM_INVALID_URL: 'STREAM_INVALID_URL',
  STREAM_PLATFORM_UNSUPPORTED: 'STREAM_PLATFORM_UNSUPPORTED',
  STREAM_QUOTA_EXCEEDED: 'STREAM_QUOTA_EXCEEDED',
  STREAM_LIMIT_EXCEEDED: 'STREAM_LIMIT_EXCEEDED',
  
  // Network errors
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  NETWORK_RATE_LIMITED: 'NETWORK_RATE_LIMITED',
  
  // Validation errors
  VALIDATION_REQUIRED: 'VALIDATION_REQUIRED',
  VALIDATION_FORMAT: 'VALIDATION_FORMAT',
  VALIDATION_RANGE: 'VALIDATION_RANGE',
  
  // System errors
  SYSTEM_STORAGE_FULL: 'SYSTEM_STORAGE_FULL',
  SYSTEM_MEMORY_LOW: 'SYSTEM_MEMORY_LOW',
  SYSTEM_PERMISSION_DENIED: 'SYSTEM_PERMISSION_DENIED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Error factory functions
export const createStreamError = (
  code: ErrorCode,
  message: string,
  context?: {
    streamId?: string;
    platform?: string;
    channelName?: string;
    [key: string]: unknown;
  }
): StreamError => ({
  code,
  message,
  severity: 'medium',
  timestamp: new Date(),
  ...(context && { context }),
  ...(context?.streamId && { streamId: context.streamId }),
  ...(context?.platform && { platform: context.platform }),
  ...(context?.channelName && { channelName: context.channelName }),
});

export const createNetworkError = (
  code: ErrorCode,
  message: string,
  context?: {
    url?: string;
    status?: number;
    retryCount?: number;
    [key: string]: unknown;
  }
): NetworkError => ({
  code,
  message,
  severity: 'high',
  timestamp: new Date(),
  ...(context && { context }),
  ...(context?.url && { url: context.url }),
  ...(context?.status && { status: context.status }),
  ...(context?.retryCount && { retryCount: context.retryCount }),
});

export const createValidationError = (
  field: string,
  value: unknown,
  constraint: string,
  message?: string
): ValidationError => ({
  code: ERROR_CODES.VALIDATION_FORMAT,
  message: message || `Invalid ${field}: ${constraint}`,
  severity: 'low',
  timestamp: new Date(),
  field,
  value,
  constraint,
});

// Error boundary props
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Error recovery strategies
export interface ErrorRecoveryStrategy {
  canRecover: (error: AppError) => boolean;
  recover: (error: AppError) => Promise<boolean>;
  maxRetries: number;
}

// Global error handler interface
export interface ErrorHandler {
  handleError: (error: AppError) => void;
  reportError: (error: AppError) => Promise<void>;
  clearErrors: () => void;
  getErrors: () => readonly AppError[];
}