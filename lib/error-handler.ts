import { logError } from "./axiom";

type ConsoleArg = string | number | boolean | Error | object | null | undefined;

// Only initialize on client side
if (typeof window !== "undefined") {
  try {
    // Function to show reload alert
    const showReloadAlert = (message: string) => {
      // Create overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        backdrop-filter: blur(2px);
      `;

      const alertDiv = document.createElement("div");
      alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 9999;
        text-align: center;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.4s forwards;
        pointer-events: auto;
      `;

      // Add keyframes for the animation
      const style = document.createElement("style");
      style.textContent = `
        @keyframes slideDown {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);

      const messageP = document.createElement("p");
      messageP.style.marginBottom = "15px";
      messageP.textContent = message;

      const reloadButton = document.createElement("button");
      reloadButton.textContent = "Reload Page";
      reloadButton.classList.add("text-outline");
      reloadButton.style.cssText = `
        background: #BD835B;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 18px;
        transition: opacity 0.12s ease-in;
        pointer-events: auto;
      `;
      reloadButton.onmouseover = () => (reloadButton.style.opacity = "0.85");
      reloadButton.onmouseout = () => (reloadButton.style.opacity = "1");
      reloadButton.onclick = () => window.location.reload();

      alertDiv.appendChild(messageP);
      alertDiv.appendChild(reloadButton);

      // Add overlay first, then alert
      document.body.appendChild(overlay);
      document.body.appendChild(alertDiv);

      // Prevent scrolling
      document.body.style.overflow = "hidden";
    };

    // Store original console methods
    const originalConsoleError = console.error.bind(console);
    //const originalConsoleWarn = console.warn.bind(console);

    // Override console.error
    console.error = function (...args: ConsoleArg[]) {
      try {
        // Call original console.error
        originalConsoleError(...args);

        // Send to Axiom
        const errorMessage = args
          .map((arg) => {
            if (arg instanceof Error) {
              return arg.message;
            }
            return String(arg);
          })
          .join(" ");
        // Check for JSON-RPC error
        console.log("Error message:", errorMessage);
        if (
          errorMessage.includes("JSON-RPC error: code=") &&
          errorMessage.includes("connection error")
        ) {
          console.log(
            "Detected JSON-RPC connection error, showing reload alert...",
          );
          showReloadAlert(
            "We are experiencing server stability issues. Please reload the page to reconnect.",
          );
          return;
        }
        if (errorMessage.includes("ContractNotFound")) {
          console.log(
            "Detected ContractNotFound error, clearing IndexedDB and showing reload alert...",
          );
          // Clear all IndexedDB databases
          window.indexedDB.databases().then((dbs) => {
            for (let i = 0; i < dbs.length; i++)
              window.indexedDB.deleteDatabase(dbs[i].name!);
            // Show reload alert after clearing
            showReloadAlert(
              "We are experiencing server stability issues. Please reload the page to reconnect.",
            );
          });
          return;
        }

        const error = new Error(errorMessage);
        error.stack =
          args.find((arg) => arg instanceof Error)?.stack || new Error().stack;

        // Enhanced error logging
        logError(error, {
          source: "console.error",
          severity: "error",
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          args: JSON.stringify(
            args.map((arg) => {
              if (arg instanceof Error) {
                return {
                  message: arg.message,
                  stack: arg.stack,
                  name: arg.name,
                };
              }
              return String(arg);
            }),
          ),
        });
      } catch (error) {
        console.error("Error in console.error:", error);
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
    window.addEventListener("unhandledrejection", (event) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      // Enhanced promise rejection logging
      logError(error, {
        source: "unhandledrejection",
        severity: "error",
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        promise: String(event.promise),
      });
    });

    // Function to capture global errors
    window.addEventListener("error", (event) => {
      // Enhanced global error logging
      logError(event.error || new Error(event.message), {
        source: "global.error",
        severity: "error",
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        filename: event.filename,
        lineno: String(event.lineno),
        colno: String(event.colno),
      });
    });
  } catch (error) {
    console.error("Error in error handler:", error);
  }
}
