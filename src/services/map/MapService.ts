import { IMapProvider, MapProviderType, DirectionsOptions, MapCoordinate } from './types';
import { GoogleMapsProvider } from './providers/GoogleMapsProvider';
import { OSMProvider } from './providers/OSMProvider';
import { CanvasMapProvider } from './providers/CanvasMapProvider';

export class MapService {
  private providers: Map<MapProviderType, IMapProvider> = new Map();
  private activeProviderId: MapProviderType = 'google';

  constructor() {
    this.registerProvider(new GoogleMapsProvider());
    this.registerProvider(new OSMProvider());
    this.registerProvider(new CanvasMapProvider());

    const envProvider = (import.meta as any).env?.VITE_MAP_PROVIDER as MapProviderType | undefined;
    if (envProvider && this.providers.has(envProvider)) {
      this.activeProviderId = envProvider;
    }
  }

  public registerProvider(provider: IMapProvider): void {
    this.providers.set(provider.id, provider);
  }

  public setProvider(id: MapProviderType): boolean {
    if (this.providers.has(id)) {
      this.activeProviderId = id;
      return true;
    }
    return false;
  }

  public getActiveProvider(): IMapProvider {
    return this.providers.get(this.activeProviderId) || this.providers.get('google')!;
  }

  public getAvailableProviders(): Array<{ id: MapProviderType; name: string }> {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
    }));
  }

  /**
   * Generates a navigation / directions URL for a given destination and optional origin.
   */
  public getDirectionsUrl(options: DirectionsOptions, providerId?: MapProviderType): string {
    const provider = (providerId && this.providers.get(providerId)) || this.getActiveProvider();
    return provider.getDirectionsUrl(options);
  }

  /**
   * Calculates Haversine distance between two coordinates in kilometers.
   */
  public calculateDistanceKm(coord1: MapCoordinate, coord2: MapCoordinate): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    const lat1 = this.toRadians(coord1.lat);
    const lat2 = this.toRadians(coord2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Formats distance for user display:
   * e.g. < 1km -> "500 m", "850 m"
   * >= 1km -> "1.2 km", "3.4 km"
   */
  public formatDistance(distanceKm?: number | null): string | null {
    if (typeof distanceKm !== 'number' || isNaN(distanceKm) || distanceKm < 0) {
      return null;
    }

    if (distanceKm < 1) {
      const meters = Math.round(distanceKm * 1000);
      return `${meters} m`;
    }

    if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)} km`;
    }

    return `${Math.round(distanceKm)} km`;
  }

  /**
   * Obfuscates exact coordinate string for public UI representation
   * e.g. 28.6304, 77.2197 -> "Connaught Place Vicinity" or rounded "28.63° N, 77.22° E"
   */
  public getObfuscatedCoordinateLabel(coord: MapCoordinate): string {
    const latApprox = coord.lat.toFixed(2);
    const lngApprox = coord.lng.toFixed(2);
    return `${latApprox}° N, ${lngApprox}° E`;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const mapService = new MapService();
export default mapService;
