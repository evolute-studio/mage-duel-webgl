type EventData = Record<string, string | number | boolean | null | undefined>;
type ErrorContext = Record<string, string | number | boolean | null | undefined>;

export const logEvent = async (event: string, data?: EventData) => {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        data,
        type: 'event',
      }),
    });
  } catch (error) {
    console.error('Error logging to Axiom:', error);
  }
};

export const logError = async (error: Error, context?: ErrorContext) => {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: error.message,
        data: {
          stack: error.stack,
          ...context,
        },
        type: 'error',
      }),
    });
  } catch (err) {
    console.error('Error logging error to Axiom:', err);
  }
}; 