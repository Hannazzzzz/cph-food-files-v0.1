// Thin wrapper around Umami custom events. Safe to call when Umami is blocked,
// not yet loaded, or running locally: it simply does nothing.
type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

export const track = (event: string, data?: EventData): void => {
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics must never break the site.
  }
};
