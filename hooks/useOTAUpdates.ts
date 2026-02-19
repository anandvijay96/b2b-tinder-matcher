import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';

export interface OTAUpdateState {
  isChecking: boolean;
  isDownloading: boolean;
  error: string | null;
}

/**
 * Checks for and applies OTA updates on mount.
 * In development this is a no-op (Updates.isEnabled is false).
 * In production builds the app silently downloads and reloads.
 */
export function useOTAUpdates(): OTAUpdateState {
  const [state, setState] = useState<OTAUpdateState>({
    isChecking: false,
    isDownloading: false,
    error: null,
  });

  useEffect(() => {
    if (!Updates.isEnabled) return;

    let cancelled = false;

    async function checkForUpdates() {
      try {
        setState((s) => ({ ...s, isChecking: true, error: null }));
        const result = await Updates.checkForUpdateAsync();

        if (cancelled) return;

        if (result.isAvailable) {
          setState((s) => ({ ...s, isChecking: false, isDownloading: true }));
          await Updates.fetchUpdateAsync();

          if (cancelled) return;

          await Updates.reloadAsync();
        } else {
          setState((s) => ({ ...s, isChecking: false }));
        }
      } catch (err) {
        if (cancelled) return;
        setState({
          isChecking: false,
          isDownloading: false,
          error: err instanceof Error ? err.message : 'OTA check failed',
        });
      }
    }

    checkForUpdates();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
