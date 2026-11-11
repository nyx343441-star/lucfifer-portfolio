export type DeviceCategory =
  | 'Windows PC'
  | 'Mac'
  | 'Linux PC'
  | 'Android Phone'
  | 'Android Tablet'
  | 'iPhone'
  | 'iPad'
  | 'Unknown Device';

/**
 * Detects ONLY a general device category strictly inside the visitor's browser
 * after explicit privacy consent. Does not read hostnames, IPs, fingerprints,
 * hardware IDs, or transmit anything externally.
 */
export function detectGeneralDeviceCategory(): DeviceCategory {
  if (typeof navigator === 'undefined') return 'Unknown Device';

  const ua = navigator.userAgent || '';
  const navWithUAData = navigator as Navigator & {
    userAgentData?: { platform?: string; mobile?: boolean };
  };
  const platformHint = navWithUAData.userAgentData?.platform || navigator.platform || '';

  const isTouchDevice =
    typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;

  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua) || (/Macintosh|Mac/i.test(ua) && isTouchDevice)) return 'iPad';

  if (/Android/i.test(ua)) {
    return /Mobile/i.test(ua) ? 'Android Phone' : 'Android Tablet';
  }

  if (/Windows|Win32|Win64/i.test(platformHint) || /Windows NT/i.test(ua)) {
    return 'Windows PC';
  }

  if (/Mac|Macintosh|MacIntel/i.test(platformHint) || /Macintosh|Mac OS X/i.test(ua)) {
    return 'Mac';
  }

  if (/Linux|X11/i.test(platformHint) || (/Linux/i.test(ua) && !/Android/i.test(ua))) {
    return 'Linux PC';
  }

  return 'Unknown Device';
}
