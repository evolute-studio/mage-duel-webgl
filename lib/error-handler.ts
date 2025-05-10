import { logError } from './axiom';

type ConsoleArg = string | number | boolean | Error | object | null | undefined;

// Only initialize on client side
if (typeof window !== 'undefined') {
  try {
    // Store original console methods
    const originalConsoleError = console.error.bind(console);
    //const originalConsoleWarn = console.warn.bind(console);

    // Override console.error
    console.error = function(...args: ConsoleArg[]) {
      try {
        // Call original console.error
        originalConsoleError(...args);

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
      } catch (error) {
        console.error('Error in console.error:', error);
      }
    };

    // Override console.warn
    // console.warn = function(...args: ConsoleArg[]) {
    //   try {
    //     // Call original console.warn
    //     originalConsoleWarn(...args);

    //     // Send to Axiom
    //     const warningMessage = args
    //       .map(arg => String(arg))
    //       .join(' ');

    //     // Enhanced warning logging
    //     logError(new Error(warningMessage), {
    //       source: 'console.warn',
    //       severity: 'warning',
    //       url: window.location.href,
    //       userAgent: navigator.userAgent,
    //       timestamp: new Date().toISOString(),
    //       args: JSON.stringify(args.map(String)),
    //     });
    //   } catch (error) {
    //     console.error('Error in console.warn:', error);
    //   }
    // };

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
  } catch (error) {
    console.error('Error in error handler:', error);
  }
} 