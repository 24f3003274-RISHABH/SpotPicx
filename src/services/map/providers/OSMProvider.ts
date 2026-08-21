import { IMapProvider, DirectionsOptions, MapCoordinate } from '../types';

export class OSMProvider implements IMapProvider {
  readonly id = 'osm' as const;
  readonly name = 'OpenStreetMap';

  getDirectionsUrl(options: DirectionsOptions): string {
    const { destination, origin } = options;

    let destLat = 28.6139;
    let destLng = 77.2090;

    if ('lat' in destination && 'lng' in destination) {
      destLat = destination.lat;
      destLng = destination.lng;
    }

    if (origin) {
      // OSM route via OSRM / OpenStreetMap route viewer
      return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin.lat}%2C${origin.lng}%3B${destLat}%2C${destLng}#map=14/${destLat}/${destLng}`;
    }

    return `https://www.openstreetmap.org/?mlat=${destLat}&mlon=${destLng}#map=16/${destLat}/${destLng}`;
  }

  getStaticMapUrl(center: MapCoordinate, zoom: number, width: number, height: number): string {
    // OpenStreetMap tile proxy or static map generator format
    return `https://static-maps.yandex.ru/1.x/?ll=${center.lng},${center.lat}&z=${zoom}&l=map&size=${Math.min(width, 600)},${Math.min(height, 450)}&pt=${center.lng},${center.lat},pm2rdm`;
  }
}
