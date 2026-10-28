import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Coordinates } from '../types/profile';
import { useOnlineStatus } from '../hooks/usePWA';
import { formatLocalizedDistance } from '../data/ankoraData';
import {
  Compass,
  MapPin,
  Crosshair,
  Maximize2,
  Wifi,
  WifiOff,
  Layers,
} from 'lucide-react';

interface OfflineMapViewProps {
  userCoords: Coordinates;
  destCoords: {
    lat: number;
    lon: number;
    nome: string;
    endereco?: string | null;
  };
  distanceMeters: number;
  bearing: number;
  lang?: string;
  className?: string;
}

export const OfflineMapView: React.FC<OfflineMapViewProps> = ({
  userCoords,
  destCoords,
  distanceMeters,
  bearing,
  lang = 'pt-BR',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [tileErrorCount, setTileErrorCount] = useState(0);
  const isOnline = useOnlineStatus();

  // Initialize or update map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map if not yet initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        maxZoom: 19,
        minZoom: 4,
      });

      // Standard OSM tile layer (cached by Service Worker)
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      });

      tileLayer.on('tileload', () => {
        setTilesLoaded(true);
      });

      tileLayer.on('tileerror', () => {
        setTileErrorCount((prev) => prev + 1);
      });

      tileLayer.addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous vector layers / markers (except base tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    const userLatLng = L.latLng(userCoords.lat, userCoords.lon);
    const destLatLng = L.latLng(destCoords.lat, destCoords.lon);

    // 1. Destination Marker (Custom Brand SVG Pin)
    const destIcon = L.divIcon({
      className: 'ankora-dest-marker',
      html: `
        <div style="position: relative; width: 40px; height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-20px, -44px);">
          <div style="background: #F26A21; width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #0F2B3D; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(15,43,61,0.35);">
            <div style="transform: rotate(45deg); width: 10px; height: 10px; background: #0F2B3D; border-radius: 50%;"></div>
          </div>
          <div style="width: 14px; height: 5px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: 2px;"></div>
        </div>
      `,
      iconSize: [40, 48],
      iconAnchor: [20, 44],
    });

    const destMarker = L.marker(destLatLng, { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #0F2B3D; padding: 2px;">
        <strong style="font-size: 13px; color: #0F2B3D;">${destCoords.nome}</strong><br/>
        <span style="color: #4A5C6A; font-size: 11px;">${destCoords.endereco || 'Modena, Itália'}</span><br/>
        <span style="display: inline-block; margin-top: 4px; font-weight: bold; color: #F26A21;">${formatLocalizedDistance(distanceMeters, lang)}</span>
      </div>
    `);

    // 2. User Marker (Teal Pulsing Dot with Heading)
    const userIcon = L.divIcon({
      className: 'ankora-user-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transform: translate(-16px, -16px);">
          <div style="position: absolute; width: 28px; height: 28px; background: rgba(14, 124, 116, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 18px; height: 18px; background: #0E7C74; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; color: #0F2B3D;">
        <strong>Sua localização</strong><br/>
        <span style="color: #4A5C6A; font-size: 11px;">${userCoords.name || 'Coordenadas do dispositivo'}</span>
      </div>
    `);

    // 3. Navigation Path Line
    const pathLine = L.polyline([userLatLng, destLatLng], {
      color: '#F26A21',
      weight: 3.5,
      dashArray: '6, 8',
      opacity: 0.9,
    }).addTo(map);

    // 4. Fit bounds to comfortably show both user & destination
    const bounds = L.latLngBounds([userLatLng, destLatLng]);
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 17,
      animate: false,
    });

    // Invalidate size on resize
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userCoords.lat, userCoords.lon, destCoords.lat, destCoords.lon, distanceMeters, lang]);

  // Recenter controls
  const handleFitBounds = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([
      [userCoords.lat, userCoords.lon],
      [destCoords.lat, destCoords.lon],
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
  };

  const handleCenterUser = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lon], 16, { animate: true });
  };

  const handleCenterDest = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([destCoords.lat, destCoords.lon], 16, { animate: true });
  };

  const isOfflineMode = !isOnline || (tileErrorCount > 4 && !tilesLoaded);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#E5E9EC] dark:bg-[#071017] ${className}`}>
      {/* Map Leaflet Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[260px] z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(15, 43, 61, 0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Offline Grid Overlay if tiles aren't loaded (resilient fallback) */}
      {isOfflineMode && (
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F2B3D]/85 text-white text-[11px] font-medium backdrop-blur-xs shadow-xs">
            <WifiOff className="w-3 h-3 text-[#F26A21]" />
            <span>Mapa em modo offline</span>
          </div>
        </div>
      )}

      {/* Online indicator */}
      {!isOfflineMode && isOnline && (
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 dark:bg-[#0F2B3D]/90 text-slate-700 dark:text-slate-200 text-[10px] font-medium backdrop-blur-xs border border-slate-200/50 dark:border-slate-700/50 shadow-2xs">
            <Wifi className="w-3 h-3 text-[#0E7C74]" />
            <span>OpenStreetMap</span>
          </div>
        </div>
      )}

      {/* Floating Recenter Buttons */}
      <div className="absolute right-2.5 bottom-2.5 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleFitBounds}
          title="Ver rota completa"
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#0E1E28] text-[#0F2B3D] dark:text-white shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleCenterDest}
          title="Focar no Destino"
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#0E1E28] text-[#F26A21] shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition active:scale-95"
        >
          <MapPin className="w-4 h-4" />
        </button>
        <button
          onClick={handleCenterUser}
          title="Focar na Minha Localização"
          className="w-8 h-8 rounded-lg bg-white dark:bg-[#0E1E28] text-[#0E7C74] shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition active:scale-95"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Center Distance Badge */}
      <div className="absolute left-2.5 bottom-2.5 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-[#0E1E28]/95 text-[#0F2B3D] dark:text-[#E6EDF2] border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-[#F26A21]" />
          <span>{formatLocalizedDistance(distanceMeters, lang)}</span>
          <span className="text-[10px] text-slate-400 font-normal">({Math.round(bearing)}°)</span>
        </div>
      </div>
    </div>
  );
};
