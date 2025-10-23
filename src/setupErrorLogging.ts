import { Alert, Platform } from 'react-native';

// Initialize global error logging so errors show in Metro terminal
export function initErrorLogging(): void {
  // Handle runtime JS errors
  const defaultHandler = (ErrorUtils as any)?.getGlobalHandler?.();
  (ErrorUtils as any)?.setGlobalHandler?.((error: any, isFatal?: boolean) => {
    try {
      const title = isFatal ? 'Fatal error' : 'Error';
      const message = `${error?.name || 'Error'}: ${error?.message || String(error)}`;
      // Print full stack to terminal
      if (error?.stack) {
        // eslint-disable-next-line no-console
        console.error('[AppError]', message, '\n', error.stack);
      } else {
        // eslint-disable-next-line no-console
        console.error('[AppError]', message);
      }
      if (__DEV__) {
        Alert.alert(title, message);
      }
    } finally {
      if (typeof defaultHandler === 'function') {
        defaultHandler(error, isFatal);
      }
    }
  });

  // Unhandled promise rejections
  const trackUnhandled = (id: number, error: any) => {
    const msg = `[UnhandledPromiseRejection:${id}] ${error?.message || String(error)}`;
    // eslint-disable-next-line no-console
    console.error(msg, error?.stack || '');
  };
  (global as any).RCTFatalPromiseRejectionTracking?.setEnabled?.(true); // RN internal if available
  (global as any).setUnhandledPromiseRejectionTracker?.(trackUnhandled);

  // Extra: globalThis listener fallback
  try {
    (globalThis as any).addEventListener?.('unhandledrejection', (e: any) => {
      // eslint-disable-next-line no-console
      console.error('[unhandledrejection]', e?.reason || e);
    });
  } catch {}

  // Log environment
  // eslint-disable-next-line no-console
  console.log(`[Startup] Error logging initialized (${Platform.OS})`);
}



