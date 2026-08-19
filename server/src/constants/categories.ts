export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  popularSearchTerms: string[];
}

export const MAIN_CATEGORIES: CategoryItem[] = [
  {
    id: 'food-drinks',
    name: 'Food & Dining',
    slug: 'food-dining',
    icon: 'Utensils',
    description: 'Restaurants, cafes, street food, bakeries and desserts',
    popularSearchTerms: ['Best cafes in Delhi', 'Best momos in Majnu Ka Tilla', 'Rooftop dining Connaught Place'],
  },
  {
    id: 'stays-living',
    name: 'Stays & PGs',
    slug: 'stays-living',
    icon: 'Building2',
    description: 'Hotels, student PGs, hostels, coliving spaces',
    popularSearchTerms: ['Best PGs near North Campus', 'Hostels in South Delhi', 'Boutique hotels'],
  },
  {
    id: 'places-attractions',
    name: 'Places & Heritage',
    slug: 'places-heritage',
    icon: 'Landmark',
    description: 'Historical monuments, museums, art galleries, scenic parks',
    popularSearchTerms: ['Monuments near Mehrauli', 'Art galleries in Lutyens Delhi', 'Sunder Nursery parks'],
  },
  {
    id: 'shopping-markets',
    name: 'Shopping & Markets',
    slug: 'shopping-markets',
    icon: 'ShoppingBag',
    description: 'Bazaars, street markets, malls, thrift stores, bookshops',
    popularSearchTerms: ['Sarojini Nagar market', 'Khan Market bookshops', 'Dilli Haat handicrafts'],
  },
  {
    id: 'nightlife-dates',
    name: 'Nightlife & Dates',
    slug: 'nightlife-dates',
    icon: 'Sparkles',
    description: 'Cozy date spots, live music bars, clubbing, romantic cafes',
    popularSearchTerms: ['Date places in Hauz Khas Village', 'Live music venues', 'Couple friendly cafes'],
  },
  {
    id: 'fitness-wellness',
    name: 'Fitness & Salons',
    slug: 'fitness-wellness',
    icon: 'Dumbbell',
    description: 'Gyms, spas, barbers, beauty parlours, sports arenas',
    popularSearchTerms: ['MMA gyms in Delhi', 'Unisex salons', 'Badminton courts near me'],
  },
  {
    id: 'services-repairs',
    name: 'Services & Tech',
    slug: 'services-tech',
    icon: 'Wrench',
    description: 'Laptop/mobile repairs, electronics, health clinics, pet care',
    popularSearchTerms: ['Nehru Place laptop repair', 'Emergency pharmacies', 'Veterinary clinics'],
  },
  {
    id: 'education-coaching',
    name: 'Education & Coaching',
    slug: 'education-coaching',
    icon: 'GraduationCap',
    description: 'Colleges, competitive coaching centers, language schools, skills',
    popularSearchTerms: ['UPSC coaching Mukherjee Nagar', 'Dance academies', 'Foreign language institutes'],
  },
];
