import { logError } from './axiom';

type ConsoleArg = string | number | boolean | Error | object | null | undefined;

// Only initialize on client side
if (typeof window !== 'undefined') {
  // Store original console methods
  const originalConsoleError: typeof console.error = console.error;
  const originalConsoleWarn: typeof console.warn = console.warn;

  // Override console.error
  console.error = function(...args: ConsoleArg[]) {
    // Call original console.error
    originalConsoleError.apply(console, args);

    // Send to Axiom
    const errorMessage = args
      .map(arg => {
        if (arg instanceof Error) {
          return arg.message;
        }
        return String(arg);
      })
      .join(' ');

    const error = new Error(errorMessage);
    error.stack = args.find(arg => arg instanceof Error)?.stack || new Error().stack;

    // Enhanced error logging
    logError(error, {
      source: 'console.error',
      severity: 'error',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      args: JSON.stringify(args.map(arg => {
        if (arg instanceof Error) {
          return {
            message: arg.message,
            stack: arg.stack,
            name: arg.name,
          };
        }
        return String(arg);
      })),
    });
  };

  // Override console.warn
  console.warn = function(...args: ConsoleArg[]) {
    // Call original console.warn
    originalConsoleWarn.apply(console, args);

    // Send to Axiom
    const warningMessage = args
      .map(arg => String(arg))
      .join(' ');

    // Enhanced warning logging
    logError(new Error(warningMessage), {
      source: 'console.warn',
      severity: 'warning',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      args: JSON.stringify(args.map(String)),
    });
  };

  // Function to capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));

    // Enhanced promise rejection logging
    logError(error, {
      source: 'unhandledrejection',
      severity: 'error',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      promise: String(event.promise),
    });
  });

  // Function to capture global errors
  window.addEventListener('error', (event) => {
    // Enhanced global error logging
    logError(event.error || new Error(event.message), {
      source: 'global.error',
      severity: 'error',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      filename: event.filename,
      lineno: String(event.lineno),
      colno: String(event.colno),
    });
  });

  // Test error logging
  console.error('Test error from error handler');
  console.warn('Test warning from error handler');
  Promise.reject(new Error('Test unhandled rejection'));
} 