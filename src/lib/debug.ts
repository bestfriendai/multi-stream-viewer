/**
 * Debug utility for comprehensive logging and debugging
 * Provides enhanced console logging with timestamps, colors, and context
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface DebugConfig {
  enabled: boolean;
  level: LogLevel;
  showTimestamp: boolean;
  showContext: boolean;
  persistLogs: boolean;
}

class DebugLogger {
  private config: DebugConfig;
  private logs: Array<{ timestamp: Date; level: LogLevel; context: string; message: any; data?: any }> = [];

  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'development',
      level: LogLevel.DEBUG,
      showTimestamp: true,
      showContext: true,
      persistLogs: true,
    };

    // Enable debugging in development
    if (typeof window !== 'undefined' && this.config.enabled) {
      (window as any).__DEBUG__ = this;
      console.log('🐛 Debug mode enabled. Access via window.__DEBUG__');
    }
  }

  private formatMessage(level: LogLevel, context: string, message: any): string {
    const timestamp = this.config.showTimestamp ? `[${new Date().toISOString()}]` : '';
    const contextStr = this.config.showContext ? `[${context}]` : '';
    const levelStr = LogLevel[level];
    
    return `${timestamp} ${levelStr} ${contextStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.level;
  }

  private persistLog(level: LogLevel, context: string, message: any, data?: any) {
    if (this.config.persistLogs) {
      this.logs.push({
        timestamp: new Date(),
        level,
        context,
        message,
        data,
      });

      // Keep only last 1000 logs
      if (this.logs.length > 1000) {
        this.logs = this.logs.slice(-1000);
      }
    }
  }

  debug(context: string, message: any, data?: any) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const formatted = this.formatMessage(LogLevel.DEBUG, context, message);
    console.debug('🐛', formatted, data || '');
    this.persistLog(LogLevel.DEBUG, context, message, data);
  }

  info(context: string, message: any, data?: any) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const formatted = this.formatMessage(LogLevel.INFO, context, message);
    console.info('ℹ️', formatted, data || '');
    this.persistLog(LogLevel.INFO, context, message, data);
  }

  warn(context: string, message: any, data?: any) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const formatted = this.formatMessage(LogLevel.WARN, context, message);
    console.warn('⚠️', formatted, data || '');
    this.persistLog(LogLevel.WARN, context, message, data);
  }

  error(context: string, message: any, data?: any) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const formatted = this.formatMessage(LogLevel.ERROR, context, message);
    console.error('❌', formatted, data || '');
    this.persistLog(LogLevel.ERROR, context, message, data);
  }

  // Performance timing utilities
  time(label: string) {
    if (this.config.enabled) {
      console.time(`⏱️ ${label}`);
    }
  }

  timeEnd(label: string) {
    if (this.config.enabled) {
      console.timeEnd(`⏱️ ${label}`);
    }
  }

  // Component lifecycle debugging
  componentMount(componentName: string, props?: any) {
    this.debug('COMPONENT', `${componentName} mounted`, props);
  }

  componentUnmount(componentName: string) {
    this.debug('COMPONENT', `${componentName} unmounted`);
  }

  componentUpdate(componentName: string, prevProps?: any, nextProps?: any) {
    this.debug('COMPONENT', `${componentName} updated`, { prevProps, nextProps });
  }

  // API debugging
  apiRequest(method: string, url: string, data?: any) {
    this.info('API', `${method} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, data?: any) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `${method} ${url} - ${status}`;
    
    if (level === LogLevel.ERROR) {
      this.error('API', message, data);
    } else {
      this.info('API', message, data);
    }
  }

  // State debugging
  stateChange(context: string, prevState: any, nextState: any) {
    this.debug('STATE', `${context} state changed`, { prevState, nextState });
  }

  // Stream debugging
  streamEvent(event: string, data?: any) {
    this.info('STREAM', `Stream event: ${event}`, data);
  }

  streamError(error: string, data?: any) {
    this.error('STREAM', `Stream error: ${error}`, data);
  }

  // Utility methods
  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    console.clear();
    this.info('DEBUG', 'Logs cleared');
  }

  exportLogs() {
    const logsJson = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  configure(config: Partial<DebugConfig>) {
    this.config = { ...this.config, ...config };
    this.info('DEBUG', 'Configuration updated', this.config);
  }

  getConfig() {
    return this.config;
  }
}

// Create singleton instance
export const debugLogger = new DebugLogger();

// Convenience exports
export const debug = debugLogger.debug.bind(debugLogger);
export const info = debugLogger.info.bind(debugLogger);
export const warn = debugLogger.warn.bind(debugLogger);
export const error = debugLogger.error.bind(debugLogger);

// React component debugging hook
export function useDebugComponent(componentName: string) {
  if (typeof window === 'undefined') return {};

  return {
    onMount: (props?: any) => debugLogger.componentMount(componentName, props),
    onUnmount: () => debugLogger.componentUnmount(componentName),
    onUpdate: (prevProps?: any, nextProps?: any) => debugLogger.componentUpdate(componentName, prevProps, nextProps),
    log: (message: any, data?: any) => debugLogger.debug(componentName, message, data),
  };
}

export default debugLogger;
