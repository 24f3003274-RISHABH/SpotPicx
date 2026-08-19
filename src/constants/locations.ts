export interface CityLocality {
  id: string;
  name: string;
  area: string;
  popularFor: string;
}

export const POPULAR_DELHI_LOCALITIES: CityLocality[] = [
  { id: 'connaught-place', name: 'Connaught Place', area: 'Central Delhi', popularFor: 'Heritage Dining & Shopping' },
  { id: 'hauz-khas-village', name: 'Hauz Khas Village', area: 'South Delhi', popularFor: 'Boutique Cafes & Lake Views' },
  { id: 'chandni-chowk', name: 'Chandni Chowk', area: 'Old Delhi', popularFor: 'Legendary Street Food & Markets' },
  { id: 'majnu-ka-tilla', name: 'Majnu Ka Tilla', area: 'North Delhi', popularFor: 'Tibetan Cafes & Momos' },
  { id: 'south-extension', name: 'South Extension', area: 'South Delhi', popularFor: 'Bridal Shopping & Premium Salons' },
  { id: 'nehru-place', name: 'Nehru Place', area: 'South Delhi', popularFor: 'Electronics & Laptop Repairs' },
  { id: 'khan-market', name: 'Khan Market', area: 'Central Delhi', popularFor: 'Gourmet Eateries & Bookstores' },
  { id: 'saket', name: 'Saket & Saidulajab', area: 'South Delhi', popularFor: 'Champa Gali Cafes & Malls' },
  { id: 'karol-bagh', name: 'Karol Bagh', area: 'Central Delhi', popularFor: 'Shopping & Street Food' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar / GTB', area: 'North Delhi', popularFor: 'Student PGs & Coaching Hub' },
];

export const SUPPORTED_CITIES = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi', active: true, tag: 'Primary Hub' },
  { id: 'gurugram', name: 'Gurugram', state: 'Haryana', active: true, tag: 'NCR Expansion' },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh', active: true, tag: 'NCR Expansion' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', active: false, tag: 'Coming Soon' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', active: false, tag: 'Coming Soon' },
];
