import { IMapProvider, DirectionsOptions, MapCoordinate } from '../types';

export class CanvasMapProvider implements IMapProvider {
  readonly id = 'interactive_canvas' as const;
  readonly name = 'SpotPicks Vector Map';

  getDirectionsUrl(options: DirectionsOptions): string {
    const { destination, origin } = options;

    let destQuery = '';
    if ('lat' in destination && 'lng' in destination) {
      destQuery = `${destination.lat},${destination.lng}`;
    } else {
      destQuery = encodeURIComponent(`${destination.name || ''} ${destination.address}`);
    }

    if (origin) {
      return `https://www.google.com/maps/dir/?api=1&destination=${destQuery}&origin=${origin.lat},${origin.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${destQuery}`;
  }
}
