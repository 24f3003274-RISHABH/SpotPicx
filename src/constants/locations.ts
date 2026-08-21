export interface CityLocality {
  id: string;
  name: string;
  area: string;
  city?: string;
  popularFor: string;
  latitude: number;
  longitude: number;
}

export const POPULAR_DELHI_LOCALITIES: CityLocality[] = [
  { id: 'connaught-place', name: 'Connaught Place', area: 'Central Delhi', city: 'Delhi', popularFor: 'Heritage Dining & Shopping', latitude: 28.6304, longitude: 77.2197 },
  { id: 'hauz-khas-village', name: 'Hauz Khas Village', area: 'South Delhi', city: 'Delhi', popularFor: 'Boutique Cafes & Lake Views', latitude: 28.5494, longitude: 77.1932 },
  { id: 'chandni-chowk', name: 'Chandni Chowk', area: 'Old Delhi', city: 'Delhi', popularFor: 'Legendary Street Food & Markets', latitude: 28.6506, longitude: 77.2303 },
  { id: 'majnu-ka-tilla', name: 'Majnu Ka Tilla', area: 'North Delhi', city: 'Delhi', popularFor: 'Tibetan Cafes & Momos', latitude: 28.7041, longitude: 77.2273 },
  { id: 'south-extension', name: 'South Extension', area: 'South Delhi', city: 'Delhi', popularFor: 'Bridal Shopping & Premium Salons', latitude: 28.5729, longitude: 77.2223 },
  { id: 'nehru-place', name: 'Nehru Place', area: 'South Delhi', city: 'Delhi', popularFor: 'Electronics & Laptop Repairs', latitude: 28.5492, longitude: 77.2529 },
  { id: 'khan-market', name: 'Khan Market', area: 'Central Delhi', city: 'Delhi', popularFor: 'Gourmet Eateries & Bookstores', latitude: 28.6003, longitude: 77.2272 },
  { id: 'saket', name: 'Saket & Saidulajab', area: 'South Delhi', city: 'Delhi', popularFor: 'Champa Gali Cafes & Malls', latitude: 28.5244, longitude: 77.2066 },
  { id: 'karol-bagh', name: 'Karol Bagh', area: 'Central Delhi', city: 'Delhi', popularFor: 'Shopping & Street Food', latitude: 28.6517, longitude: 77.1906 },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar / GTB', area: 'North Delhi', city: 'Delhi', popularFor: 'Student PGs & Coaching Hub', latitude: 28.7118, longitude: 77.2096 },
];

export const SUPPORTED_CITIES = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi', active: true, tag: 'Primary Hub' },
  { id: 'gurugram', name: 'Gurugram', state: 'Haryana', active: true, tag: 'NCR Expansion' },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh', active: true, tag: 'NCR Expansion' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', active: false, tag: 'Coming Soon' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', active: false, tag: 'Coming Soon' },
];
