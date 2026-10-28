import { useEffect, useState, useCallback } from 'react';

interface DeviceHeadingState {
  heading: number | null; // 0 - 360 degrees, 0 = North
  requiresPermission: boolean;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useDeviceHeading(): DeviceHeadingState {
  const [heading, setHeading] = useState<number | null>(null);
  const [requiresPermission, setRequiresPermission] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Check if iOS 13+ permission is required
    const isIOS = typeof window !== 'undefined' && 
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === 'function';
    
    if (isIOS) {
      setRequiresPermission(true);
    } else if (typeof window !== 'undefined' && 'ondeviceorientationabsolute' in window) {
      // Standard absolute orientation
      const handleAbsolute = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) {
          // In standard w3c, 360 - alpha is compass heading
          const compHeading = 360 - e.alpha;
          setHeading((compHeading + 360) % 360);
          setPermissionGranted(true);
        }
      };
      window.addEventListener('deviceorientationabsolute', handleAbsolute as EventListener, true);
      return () => {
        window.removeEventListener('deviceorientationabsolute', handleAbsolute as EventListener, true);
      };
    } else if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (e: Event) => {
        const orientationEvent = e as DeviceOrientationEvent;
        const webkitHeading = (orientationEvent as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
        if (typeof webkitHeading === 'number' && !isNaN(webkitHeading)) {
          setHeading(webkitHeading);
          setPermissionGranted(true);
        } else if (orientationEvent.alpha !== null) {
          const compHeading = 360 - orientationEvent.alpha;
          setHeading((compHeading + 360) % 360);
          setPermissionGranted(true);
        }
      };
      const win = window as Window;
      win.addEventListener('deviceorientation', handleOrientation, true);
      return () => {
        win.removeEventListener('deviceorientation', handleOrientation, true);
      };
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const DeviceOrientationAny = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceOrientationAny.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationAny.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          setRequiresPermission(false);
          const handleOrientation = (e: DeviceOrientationEvent) => {
            const webkitHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
            if (typeof webkitHeading === 'number' && !isNaN(webkitHeading)) {
              setHeading(webkitHeading);
            }
          };
          window.addEventListener('deviceorientation', handleOrientation, true);
          return true;
        }
        return false;
      } catch (err) {
        console.warn('Error requesting device orientation permission:', err);
        return false;
      }
    }
    return true;
  }, []);

  return {
    heading,
    requiresPermission,
    permissionGranted,
    requestPermission,
  };
}
