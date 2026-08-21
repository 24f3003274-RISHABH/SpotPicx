export type MapProviderType = 'google' | 'osm' | 'mapbox' | 'interactive_canvas';

export interface MapCoordinate {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarkerConfig {
  id: string;
  position: MapCoordinate;
  title: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  priceLabel?: string;
  locality?: string;
  image?: string;
  verified?: boolean;
  slug?: string;
}

export interface DirectionsOptions {
  destination: MapCoordinate | { address: string; name?: string };
  origin?: MapCoordinate;
  travelMode?: 'driving' | 'walking' | 'transit' | 'bicycling';
}

export interface IMapProvider {
  readonly id: MapProviderType;
  readonly name: string;
  getDirectionsUrl(options: DirectionsOptions): string;
  getStaticMapUrl?(center: MapCoordinate, zoom: number, width: number, height: number): string;
  formatCoordinates?(coord: MapCoordinate): string;
}
