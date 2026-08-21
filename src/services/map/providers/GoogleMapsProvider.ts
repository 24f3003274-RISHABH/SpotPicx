import { IMapProvider, DirectionsOptions, MapCoordinate } from '../types';

export class GoogleMapsProvider implements IMapProvider {
  readonly id = 'google' as const;
  readonly name = 'Google Maps';

  getDirectionsUrl(options: DirectionsOptions): string {
    const { destination, origin, travelMode = 'driving' } = options;

    let destParam = '';
    if ('lat' in destination && 'lng' in destination) {
      destParam = `${destination.lat},${destination.lng}`;
    } else {
      destParam = encodeURIComponent(`${destination.name ? destination.name + ', ' : ''}${destination.address}`);
    }

    let originParam = '';
    if (origin) {
      originParam = `&origin=${origin.lat},${origin.lng}`;
    }

    const modeMap: Record<string, string> = {
      driving: 'driving',
      walking: 'walking',
      transit: 'transit',
      bicycling: 'bicycling',
    };

    const mode = modeMap[travelMode] || 'driving';
    return `https://www.google.com/maps/dir/?api=1&destination=${destParam}${originParam}&travelmode=${mode}`;
  }

  getStaticMapUrl(center: MapCoordinate, zoom: number, width: number, height: number): string {
    const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=color:red%7C${center.lat},${center.lng}`;
    }
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=color:red%7C${center.lat},${center.lng}&key=${apiKey}`;
  }
}
