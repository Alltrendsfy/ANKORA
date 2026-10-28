import { useState, useEffect } from 'react';
import { Coordinates, LocationSimulationMode, SIMULATED_COORDINATES } from '../types/profile';

export function useUserLocation(simulationMode: LocationSimulationMode) {
  const [coords, setCoords] = useState<Coordinates>(
    simulationMode === 'real'
      ? SIMULATED_COORDINATES.piazza_grande // initial default until GPS locks
      : SIMULATED_COORDINATES[simulationMode]
  );
  const [gpsActive, setGpsActive] = useState(simulationMode === 'real');
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    if (simulationMode !== 'real') {
      setCoords(SIMULATED_COORDINATES[simulationMode]);
      setGpsActive(false);
      setGpsError(null);
      return;
    }

    if (!('geolocation' in navigator)) {
      setGpsError('Geolocalização não suportada');
      setCoords(SIMULATED_COORDINATES.piazza_grande);
      return;
    }

    setGpsActive(true);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          isSimulated: false,
          name: 'GPS do Aparelho',
        });
        setGpsError(null);
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
        setGpsError(err.message);
        // Fallback to Modena center if GPS is denied or unavailable
        setCoords(SIMULATED_COORDINATES.piazza_grande);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [simulationMode]);

  return { coords, gpsActive, gpsError };
}
