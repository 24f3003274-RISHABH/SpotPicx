import mongoose from 'mongoose';
import { Location, ILocation } from '../models/Location';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

export interface LocalityRichMeta {
  highlights: string[];
  popularCategories: string[];
  nearbyLocalities: Array<{ name: string; slug: string; distance: string }>;
  faqs: Array<{ question: string; answer: string }>;
  relatedGuides: Array<{ title: string; slug: string }>;
  metroConnectivity: string;
}

export const DELHI_LOCALITY_METADATA: Record<string, LocalityRichMeta> = {
  'connaught-place': {
    highlights: [
      'Iconic Georgian colonnaded Inner & Outer Circles',
      'Central interchange at Rajiv Chowk Metro',
      'Janpath handicraft flea market & vintage bookstalls',
      'Heritage bakeries, colonial bars & legacy dining',
    ],
    popularCategories: ['Fine Dining', 'Heritage Cafes', 'Bookshops', 'Bar & Lounges', 'Street Food'],
    nearbyLocalities: [
      { name: 'Karol Bagh', slug: 'karol-bagh', distance: '3.5 km' },
      { name: 'Chandni Chowk', slug: 'chandni-chowk', distance: '4.0 km' },
      { name: 'Nehru Place', slug: 'nehru-place', distance: '12.0 km' },
      { name: 'Lajpat Nagar', slug: 'lajpat-nagar', distance: '9.0 km' },
    ],
    faqs: [
      {
        question: 'What is Connaught Place best known for?',
        answer: 'Connaught Place (CP) is Delhi’s civic and culinary heart, famous for colonial architecture, Palika Underground Bazaar, Janpath flea market, and legacy restaurants like Wenger’s and United Coffee House.',
      },
      {
        question: 'Which metro station is closest to Connaught Place?',
        answer: 'Rajiv Chowk Metro Station sits directly beneath Central Park at the center of Connaught Place, serving as the major interchange between the Yellow and Blue Lines.',
      },
      {
        question: 'What are the best dining spots in Connaught Place?',
        answer: 'Top rated spots include Wenger’s Deli for savory snacks & pastries, Odeon Social for co-working and drinks, and classic Mughal dining establishments around the Outer Circle.',
      },
    ],
    relatedGuides: [
      { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
      { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
      { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
    ],
    metroConnectivity: 'Rajiv Chowk (Yellow & Blue Line interchange)',
  },
  'hauz-khas': {
    highlights: [
      '13th-century Firoz Shah reservoir & madrasa ruins',
      'Bohemian cafe street with rooftop lake views',
      'Adjacent to lush 300-acre Deer Park & walking trails',
      'Eclectic indie fashion boutiques & designer craft studios',
    ],
    popularCategories: ['Rooftop Cafes', 'Lakeview Bistros', 'Cocktail Bars', 'Art Galleries', 'Dessert Studios'],
    nearbyLocalities: [
      { name: 'Saket', slug: 'saket', distance: '4.5 km' },
      { name: 'Vasant Kunj', slug: 'vasant-kunj', distance: '6.0 km' },
      { name: 'Greater Kailash', slug: 'greater-kailash', distance: '5.2 km' },
      { name: 'Lajpat Nagar', slug: 'lajpat-nagar', distance: '6.5 km' },
    ],
    faqs: [
      {
        question: 'What are the top things to do in Hauz Khas Village?',
        answer: 'Explore the medieval Hauz Khas Fort ruins at sunset, take a nature walk through Deer Park, and unwind at rooftop bistros overlooking the royal lake.',
      },
      {
        question: 'Is Hauz Khas Village good for romantic dates?',
        answer: 'Yes, HKV is widely celebrated as one of Delhi’s most romantic enclaves due to its pedestrian stone walkways, illuminated fort backdrops, and candlelit lake-facing restaurants.',
      },
    ],
    relatedGuides: [
      { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
      { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
      { title: 'Best Parks in Delhi', slug: 'best-parks-in-delhi' },
    ],
    metroConnectivity: 'Hauz Khas Metro (Yellow & Magenta Line interchange) and IIT Delhi Station',
  },
  'hauz-khas-village': {
    highlights: [
      '13th-century Firoz Shah reservoir & madrasa ruins',
      'Bohemian cafe street with rooftop lake views',
      'Adjacent to lush 300-acre Deer Park & walking trails',
      'Eclectic indie fashion boutiques & designer craft studios',
    ],
    popularCategories: ['Rooftop Cafes', 'Lakeview Bistros', 'Cocktail Bars', 'Art Galleries', 'Dessert Studios'],
    nearbyLocalities: [
      { name: 'Saket', slug: 'saket', distance: '4.5 km' },
      { name: 'Vasant Kunj', slug: 'vasant-kunj', distance: '6.0 km' },
      { name: 'Greater Kailash', slug: 'greater-kailash', distance: '5.2 km' },
    ],
    faqs: [
      {
        question: 'What are the top things to do in Hauz Khas Village?',
        answer: 'Explore the medieval Hauz Khas Fort ruins at sunset, take a nature walk through Deer Park, and unwind at rooftop bistros overlooking the royal lake.',
      },
    ],
    relatedGuides: [
      { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
      { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
    ],
    metroConnectivity: 'Hauz Khas Metro (Yellow & Magenta Line)',
  },
  'saket': {
    highlights: [
      'Champa Gali fairy-lit rustic cafe alleyway',
      'Select CITYWALK & DLF Avenue premier retail hub',
      'Saidulajab creative ceramic & coffee workshops',
      'Culinary melting pot from Vietnamese to artisanal gelatos',
    ],
    popularCategories: ['Specialty Coffee', 'Gourmet Dining', 'Work Cafes', 'Salons & Spas', 'Lifestyle Retail'],
    nearbyLocalities: [
      { name: 'Hauz Khas', slug: 'hauz-khas', distance: '4.5 km' },
      { name: 'Greater Kailash', slug: 'greater-kailash', distance: '5.0 km' },
      { name: 'Vasant Kunj', slug: 'vasant-kunj', distance: '7.5 km' },
    ],
    faqs: [
      {
        question: 'What is Champa Gali in Saket?',
        answer: 'Champa Gali in Saidulajab, Saket is an aesthetic pedestrian lane with fairy lights, handcrafted design studios, roasteries like Blue Tokai, and organic food cafes.',
      },
      {
        question: 'Which malls are in Saket?',
        answer: 'The Saket District Centre hosts Select CITYWALK, DLF Avenue, and MGF Metropolitan Mall all adjacent to each other.',
      },
    ],
    relatedGuides: [
      { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
      { title: 'Best Co-Working Cafes in Delhi', slug: 'best-co-working-cafes-in-delhi' },
      { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
    ],
    metroConnectivity: 'Saket Metro Station (Yellow Line) & Malviya Nagar Metro',
  },
  'lajpat-nagar': {
    highlights: [
      'Central Market bridal fabrics, footwear & designer dupattas',
      'Little Kabul Afghan dining enclave in Block II',
      'Crispy Ram Laddus with shredded radish & mint chutney',
      'Vibrant open-air bazaars and tailor boutiques',
    ],
    popularCategories: ['Ethnic Wear', 'Street Food', 'Afghan Cuisine', 'Jewellery', 'Fabrics'],
    nearbyLocalities: [
      { name: 'Greater Kailash', slug: 'greater-kailash', distance: '3.5 km' },
      { name: 'Nehru Place', slug: 'nehru-place', distance: '4.0 km' },
      { name: 'South Extension', slug: 'south-extension', distance: '2.5 km' },
      { name: 'Connaught Place', slug: 'connaught-place', distance: '9.0 km' },
    ],
    faqs: [
      {
        question: 'Is Lajpat Nagar Central Market closed on Mondays?',
        answer: 'Yes, the main Central Market in Lajpat Nagar is closed on Mondays, though food stalls and select chain stores remain open.',
      },
      {
        question: 'What is the most famous food in Lajpat Nagar?',
        answer: 'Must-try dishes include Ram Laddus with green chutney, spicy Dolma Aunty Momos, Nagpal Chole Bhature, and authentic Afghan kebabs.',
      },
    ],
    relatedGuides: [
      { title: 'Best Street Food in Delhi', slug: 'best-street-food-in-delhi' },
      { title: 'Best Markets in Delhi', slug: 'best-markets-in-delhi' },
      { title: 'Best Momos in Delhi', slug: 'best-momos-in-delhi' },
    ],
    metroConnectivity: 'Lajpat Nagar Metro Station (Pink & Violet Line interchange)',
  },
  'karol-bagh': {
    highlights: [
      'Ajmal Khan Road bridal wear & gold jewelry shopping',
      'Ghaffar Market electronics & mobile parts bazaar',
      'Premier hub for UPSC Civil Services coaching academies',
      'Legendary street breakfast spots like Sita Ram Diwan Chand',
    ],
    popularCategories: ['Chole Bhature', 'Bridal Fashion', 'Electronics', 'Coaching Centers', 'Student Living'],
    nearbyLocalities: [
      { name: 'Connaught Place', slug: 'connaught-place', distance: '3.5 km' },
      { name: 'Rajouri Garden', slug: 'rajouri-garden', distance: '7.5 km' },
      { name: 'Chandni Chowk', slug: 'chandni-chowk', distance: '4.8 km' },
    ],
    faqs: [
      {
        question: 'Why is Karol Bagh famous in Delhi?',
        answer: 'Karol Bagh is celebrated for shopping (Ajmal Khan Road & Ghaffar Market), UPSC civil services test preparation institutes, and iconic North Indian street eateries.',
      },
    ],
    relatedGuides: [
      { title: 'Best Street Food in Delhi', slug: 'best-street-food-in-delhi' },
      { title: 'Best Markets in Delhi', slug: 'best-markets-in-delhi' },
      { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
    ],
    metroConnectivity: 'Karol Bagh Metro Station (Blue Line)',
  },
  'chandni-chowk': {
    highlights: [
      '350-year-old historic Mughal shopping boulevard',
      'Paranthe Wali Gali with 30+ stuffed fried paranthas',
      'Khari Baoli — Asia’s largest wholesale spice market',
      'Dariba Kalan heritage silver & bridal jewelry bazaar',
    ],
    popularCategories: ['Heritage Street Food', 'Spice Bazaars', 'Mughlai Kebabs', 'Traditional Sweets', 'Bridal Lehengas'],
    nearbyLocalities: [
      { name: 'Connaught Place', slug: 'connaught-place', distance: '4.0 km' },
      { name: 'Karol Bagh', slug: 'karol-bagh', distance: '4.8 km' },
      { name: 'Majnu Ka Tilla', slug: 'majnu-ka-tilla', distance: '5.5 km' },
    ],
    faqs: [
      {
        question: 'What is the best way to explore Chandni Chowk?',
        answer: 'Arrive via Chandni Chowk or Jama Masjid Metro Station and explore on foot or via registered battery e-rickshaws along the newly pedestrianized heritage promenade.',
      },
      {
        question: 'What are the iconic food stops in Chandni Chowk?',
        answer: 'Natraj Dahi Bhalla, Old Famous Jalebi Wala, Pt. Kanhaiyalal Durgaprasad Paranthe, Karim’s, and Kuremal Mohan Lal Kulfi.',
      },
    ],
    relatedGuides: [
      { title: 'Best Street Food in Delhi', slug: 'best-street-food-in-delhi' },
      { title: 'Best Places to Visit in Delhi', slug: 'best-places-to-visit-in-delhi' },
      { title: 'Best Markets in Delhi', slug: 'best-markets-in-delhi' },
    ],
    metroConnectivity: 'Chandni Chowk Metro (Yellow Line) & Jama Masjid (Violet Line)',
  },
  'dwarka': {
    highlights: [
      'Asia’s largest planned residential sub-city with grid layout',
      'Vibrant food hubs across Sector 6, 10, and 12 markets',
      'Pacific D21 Mall and modern family amusement complexes',
      'Excellent connectivity via Blue Line, Magenta Line & Airport Express',
    ],
    popularCategories: ['Family Restaurants', 'Sports Academies', 'Co-Living Stays', 'Cafes & Bakeries', 'Sweet Houses'],
    nearbyLocalities: [
      { name: 'Rajouri Garden', slug: 'rajouri-garden', distance: '12.0 km' },
      { name: 'Vasant Kunj', slug: 'vasant-kunj', distance: '14.0 km' },
      { name: 'Rohini', slug: 'rohini', distance: '18.0 km' },
    ],
    faqs: [
      {
        question: 'Which sectors in Dwarka have the best street food and dining?',
        answer: 'Sector 6, Sector 10, and Sector 12 markets are the primary food and shopping epicenters in Dwarka with top street food stalls and family dining spots.',
      },
    ],
    relatedGuides: [
      { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
      { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
      { title: 'Best Parks in Delhi', slug: 'best-parks-in-delhi' },
    ],
    metroConnectivity: 'Dwarka Sector 21 (Blue Line & Airport Express) + 8 internal metro stations',
  },
  'rohini': {
    highlights: [
      'Swarna Jayanti Park (Japanese Park) with scenic boating lakes',
      'Sector 7 & Sector 9 bustling street chaat and tandoori food plazas',
      'Adventure Island theme park and Metro Walk mall',
      'Surrounded by prestigious technical institutes and student residences',
    ],
    popularCategories: ['Street Food', 'Recreation Parks', 'Fast Food & Chaat', 'Student Accommodations', 'Family Lounges'],
    nearbyLocalities: [
      { name: 'GTB Nagar', slug: 'gtb-nagar', distance: '8.5 km' },
      { name: 'Karol Bagh', slug: 'karol-bagh', distance: '12.0 km' },
      { name: 'Dwarka', slug: 'dwarka', distance: '18.0 km' },
    ],
    faqs: [
      {
        question: 'What is Japanese Park in Rohini?',
        answer: 'Swarna Jayanti Park (known locally as Japanese Park) is a massive 250-acre landscaped park in Rohini Sector 10 featuring lakes, Japanese gardens, jogging tracks, and open lawns.',
      },
      {
        question: 'Where can you find the best street food in Rohini?',
        answer: 'Sector 7, Sector 8, and Sector 9 central market complexes are packed with popular momo stalls, soya chaap specialists, and kulfi counters.',
      },
    ],
    relatedGuides: [
      { title: 'Best Parks in Delhi', slug: 'best-parks-in-delhi' },
      { title: 'Best Street Food in Delhi', slug: 'best-street-food-in-delhi' },
      { title: 'Best Momos in Delhi', slug: 'best-momos-in-delhi' },
    ],
    metroConnectivity: 'Rithala & Rohini West Metro Stations (Red Line)',
  },
  'vasant-kunj': {
    highlights: [
      'Luxury retail triangle: DLF Promenade, DLF Emporio & Ambience Mall',
      'Gateway to Aravalli Biodiversity Park walking trails',
      'Immediate proximity to JNU campus and Delhi International Airport',
      'Chic European bistros, farm-to-table dining & organic bakeries',
    ],
    popularCategories: ['Luxury Dining', 'Designer Retail', 'Student PGs', 'Wellness Spas', 'Biodiversity Walks'],
    nearbyLocalities: [
      { name: 'JNU & Munirka', slug: 'jnu-munirka', distance: '2.5 km' },
      { name: 'Saket', slug: 'saket', distance: '7.5 km' },
      { name: 'Hauz Khas', slug: 'hauz-khas', distance: '6.0 km' },
    ],
    faqs: [
      {
        question: 'What are the main attractions in Vasant Kunj?',
        answer: 'Vasant Kunj is known for the luxury mall trio (DLF Emporio, Promenade, Ambience), Aravalli Biodiversity Park, and student hubs near JNU.',
      },
    ],
    relatedGuides: [
      { title: 'Best Cafes near JNU', slug: 'best-cafes-near-jnu' },
      { title: 'Best PG near JNU', slug: 'best-pg-near-jnu' },
      { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
    ],
    metroConnectivity: 'Chhatarpur Metro (Yellow Line) and Vasant Vihar Metro (Magenta Line)',
  },
  'greater-kailash': {
    highlights: [
      'M-Block & N-Block GK-1 and GK-2 upscale shopping markets',
      'Artisanal coffee roasters, Italian trattorias & sourdough bakeries',
      'Designer boutiques, high-end bridal couture & organic skincare spas',
      'Vibrant evening cocktail lounges and rooftop bistros',
    ],
    popularCategories: ['Artisanal Coffee', 'Italian Dining', 'Boutique Fashion', 'Luxury Grooming', 'Cocktail Bars'],
    nearbyLocalities: [
      { name: 'Nehru Place', slug: 'nehru-place', distance: '2.0 km' },
      { name: 'Lajpat Nagar', slug: 'lajpat-nagar', distance: '3.5 km' },
      { name: 'Saket', slug: 'saket', distance: '5.0 km' },
      { name: 'Hauz Khas', slug: 'hauz-khas', distance: '5.2 km' },
    ],
    faqs: [
      {
        question: 'What is the difference between GK-1 and GK-2 markets?',
        answer: 'GK-1 M-Block is famous for street chaat, fashion retail, and casual cafes; GK-2 M-Block is known for fine dining restaurants, premium bakeries, and cocktail lounges.',
      },
    ],
    relatedGuides: [
      { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
      { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
      { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
    ],
    metroConnectivity: 'Greater Kailash & Kailash Colony Metro Stations (Magenta & Violet Lines)',
  },
  'nehru-place': {
    highlights: [
      'Asia’s largest IT and computer hardware market',
      'Laptop motherboard, chip diagnostics & custom PC builders',
      'Epicuria Food Mall directly integrated inside the metro complex',
      'Craft microbreweries and quick business lunch hubs',
    ],
    popularCategories: ['Electronics & Hardware', 'Laptop Repair', 'Business Breweries', 'Food Courts', 'Gadget Accessories'],
    nearbyLocalities: [
      { name: 'Greater Kailash', slug: 'greater-kailash', distance: '2.0 km' },
      { name: 'Lajpat Nagar', slug: 'lajpat-nagar', distance: '4.0 km' },
      { name: 'Saket', slug: 'saket', distance: '6.5 km' },
    ],
    faqs: [
      {
        question: 'What can you buy at Nehru Place in Delhi?',
        answer: 'Nehru Place is the premier destination for laptops, custom gaming PC parts, networking gear, chip-level repairs, and software solutions at wholesale pricing.',
      },
      {
        question: 'What is Epicuria at Nehru Place?',
        answer: 'Epicuria is an underground gourmet food hub attached directly to the Nehru Place Metro Station with over 25 premier cafes, restaurants, and lounges.',
      },
    ],
    relatedGuides: [
      { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
      { title: 'Best Co-Working Cafes in Delhi', slug: 'best-co-working-cafes-in-delhi' },
      { title: 'Best Markets in Delhi', slug: 'best-markets-in-delhi' },
    ],
    metroConnectivity: 'Nehru Place & Nehru Enclave Metro Stations (Violet & Magenta Lines)',
  },
  'rajouri-garden': {
    highlights: [
      'West Delhi’s undisputed food, nightlife & high-energy dining corridor',
      'Main Market bridal lehengas, ethnic jewelry & street fashion',
      'Multi-mall cluster: City Square, Pacific & TDI Mall',
      'Famous for tandoori chaap, butter chicken & creative cocktail bars',
    ],
    popularCategories: ['High-Energy Dining', 'Cocktail Lounges', 'Bridal Couture', 'Street Chaap', 'Dessert Bars'],
    nearbyLocalities: [
      { name: 'Karol Bagh', slug: 'karol-bagh', distance: '7.5 km' },
      { name: 'Dwarka', slug: 'dwarka', distance: '12.0 km' },
      { name: 'Connaught Place', slug: 'connaught-place', distance: '11.0 km' },
    ],
    faqs: [
      {
        question: 'What is Rajouri Garden famous for?',
        answer: 'Rajouri Garden is West Delhi’s premier lifestyle district, renowned for bustling wedding and bridal markets, energetic restaurants, and thriving nightlife.',
      },
    ],
    relatedGuides: [
      { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
      { title: 'Best Markets in Delhi', slug: 'best-markets-in-delhi' },
      { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
    ],
    metroConnectivity: 'Rajouri Garden Metro Station (Blue & Pink Line interchange)',
  },
};

export class LocationService {
  public static async getAllLocations(query: { type?: string; city?: string; state?: string; status?: string } = {}) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const filter: Record<string, any> = { isActive: true };
        if (query.type) filter.type = query.type;
        if (query.city) filter.city = new RegExp(`^${query.city}$`, 'i');
        if (query.state) filter.state = new RegExp(`^${query.state}$`, 'i');
        if (query.status) filter.status = query.status;

        const locations = await Location.find(filter)
          .populate('parent', 'name slug type status')
          .sort({ type: 1, name: 1 })
          .lean();

        if (locations && locations.length > 0) {
          return locations;
        }
      } catch (err: any) {
        console.warn('[LocationService] Falling back to in-memory locations:', err.message);
      }
    }

    // In-memory fallback
    SeedService.initializeInMemoryStore();
    let all = Array.from(SeedService.inMemoryLocations.values());

    if (query.type) {
      all = all.filter((l) => l.type === query.type);
    }
    if (query.city) {
      all = all.filter((l) => l.city.toLowerCase() === query.city?.toLowerCase());
    }
    if (query.state) {
      all = all.filter((l) => (l.state || '').toLowerCase() === query.state?.toLowerCase() || l.stateSlug === query.state?.toLowerCase());
    }
    if (query.status) {
      all = all.filter((l) => l.status === query.status);
    }

    return all.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get complete India overview with all States, active/coming soon statuses, and cities breakdown
   */
  public static async getIndiaOverview() {
    const allLocations = await this.getAllLocations();
    const states = allLocations.filter((l) => l.type === 'STATE');
    const cities = allLocations.filter((l) => l.type === 'CITY');
    const localities = allLocations.filter((l) => l.type === 'LOCALITY' || l.type === 'NEIGHBORHOOD');

    // Aggregate state cards with attached cities and readiness
    const stateCards = states.map((state) => {
      const stateCities = cities.filter(
        (c) =>
          c.stateSlug === state.slug ||
          (c.state || '').toLowerCase() === state.name.toLowerCase() ||
          (c.parent && typeof c.parent === 'object' && (c.parent as any).slug === state.slug)
      );

      const activeCities = stateCities.filter((c) => c.status === 'ACTIVE');
      const comingSoonCities = stateCities.filter((c) => c.status === 'COMING_SOON');

      return {
        ...state,
        totalCities: stateCities.length,
        activeCitiesCount: activeCities.length,
        comingSoonCitiesCount: comingSoonCities.length,
        cities: stateCities,
      };
    });

    const activeStatesCount = stateCards.filter((s) => s.status === 'ACTIVE').length;
    const comingSoonStatesCount = stateCards.filter((s) => s.status === 'COMING_SOON').length;

    return {
      country: 'India',
      countrySlug: 'india',
      totalStates: stateCards.length,
      activeStatesCount,
      comingSoonStatesCount,
      totalCities: cities.length,
      activeCitiesCount: cities.filter((c) => c.status === 'ACTIVE').length,
      totalLocalities: localities.length,
      states: stateCards,
      productionFocus: 'Delhi NCR (Fully Live & Indexed)',
      expansionRoadmap: [
        { phase: 'Phase 1 (Live)', states: ['Delhi NCR'], status: 'ACTIVE', verifiedSpots: 52 },
        { phase: 'Phase 2 (Next Wave)', states: ['Maharashtra (Mumbai, Pune)', 'Karnataka (Bangalore)'], status: 'COMING_SOON', target: 'Q3 2026' },
        { phase: 'Phase 3 (Southern & Eastern Hubs)', states: ['Telangana (Hyderabad)', 'West Bengal (Kolkata)', 'Tamil Nadu (Chennai)'], status: 'COMING_SOON', target: 'Q4 2026' },
        { phase: 'Phase 4 (Northern & Western Expansion)', states: ['Uttar Pradesh (Noida, Lucknow)', 'Gujarat (Ahmedabad)', 'Rajasthan (Jaipur)', 'Punjab (Chandigarh)'], status: 'COMING_SOON', target: '2027' },
      ],
    };
  }

  /**
   * Get State details with all its districts, cities, and localities
   */
  public static async getStateBySlug(stateSlug: string) {
    const cleanSlug = stateSlug.toLowerCase().trim();
    const allLocations = await this.getAllLocations();

    const state = allLocations.find(
      (l) => l.type === 'STATE' && (l.slug === cleanSlug || (l.stateSlug && l.stateSlug === cleanSlug))
    );

    if (!state) return null;

    const cities = allLocations.filter(
      (l) =>
        l.type === 'CITY' &&
        (l.stateSlug === cleanSlug || (l.state || '').toLowerCase() === state.name.toLowerCase())
    );

    const localities = allLocations.filter(
      (l) =>
        (l.type === 'LOCALITY' || l.type === 'NEIGHBORHOOD') &&
        (l.stateSlug === cleanSlug || (l.state || '').toLowerCase() === state.name.toLowerCase())
    );

    return {
      ...state,
      cities,
      localities,
      totalCities: cities.length,
      totalLocalities: localities.length,
    };
  }

  /**
   * Get City details by stateSlug and citySlug
   */
  public static async getCityBySlug(stateSlug: string, citySlug: string) {
    const cleanState = stateSlug.toLowerCase().trim();
    const cleanCity = citySlug.toLowerCase().trim();
    const allLocations = await this.getAllLocations();

    // Find city record
    let city = allLocations.find(
      (l) =>
        l.type === 'CITY' &&
        (l.slug === cleanCity || l.citySlug === cleanCity) &&
        (l.stateSlug === cleanState || cleanState === 'india' || cleanCity === 'delhi')
    );

    // If not found by strict match, try by city slug directly
    if (!city) {
      city = allLocations.find((l) => l.type === 'CITY' && (l.slug === cleanCity || l.slug === `${cleanCity}-city`));
    }

    if (!city && cleanCity === 'delhi') {
      city = allLocations.find((l) => l.slug === 'delhi');
    }

    if (!city) return null;

    // Get localities in this city
    const localities = allLocations.filter(
      (l) =>
        (l.type === 'LOCALITY' || l.type === 'NEIGHBORHOOD') &&
        (l.citySlug === cleanCity ||
          l.city.toLowerCase() === city.name.toLowerCase() ||
          (l.parent && typeof l.parent === 'object' && (l.parent as any).slug === city.slug) ||
          l.parent === city._id?.toString())
    );

    // Calculate live business count in this city
    let businessCount = 0;
    if (dbConnection.getStatus().isConnected) {
      try {
        businessCount = await Business.countDocuments({
          city: new RegExp(city.name, 'i'),
          status: 'ACTIVE',
        });
      } catch (e) {}
    } else {
      businessCount = Array.from(SeedService.inMemoryBusinesses.values()).filter(
        (b) => b.city.toLowerCase() === city.name.toLowerCase() && b.status === 'ACTIVE'
      ).length;
    }

    return {
      ...city,
      businessCount,
      localities,
      totalLocalities: localities.length,
    };
  }

  /**
   * Update city or state activation status (ACTIVE, COMING_SOON, BETA, INACTIVE)
   */
  public static async updateStatus(idOrSlug: string, status: 'ACTIVE' | 'COMING_SOON' | 'BETA' | 'INACTIVE') {
    if (dbConnection.getStatus().isConnected) {
      try {
        const updated = await Location.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(idOrSlug) ? idOrSlug : null }, { slug: idOrSlug.toLowerCase() }] },
          { $set: { status, updatedAt: new Date() } },
          { new: true }
        ).lean();

        if (updated) return updated;
      } catch (err: any) {
        console.warn('[LocationService] DB status update error:', err.message);
      }
    }

    SeedService.initializeInMemoryStore();
    const memLoc = SeedService.inMemoryLocations.get(idOrSlug.toLowerCase());
    if (memLoc) {
      memLoc.status = status;
      memLoc.updatedAt = new Date();
      return memLoc;
    }
    return null;
  }

  /**
   * Join waitlist for coming soon cities
   */
  public static inMemoryWaitlist: Array<{ citySlug: string; email: string; name?: string; role?: string; createdAt: Date }> = [];

  public static async joinWaitlist(data: { citySlug: string; email: string; name?: string; role?: string }) {
    const record = {
      citySlug: data.citySlug.toLowerCase(),
      email: data.email.toLowerCase().trim(),
      name: data.name || '',
      role: data.role || 'EXPLORER',
      createdAt: new Date(),
    };

    this.inMemoryWaitlist.push(record);

    // Increment waitlist count in memory
    SeedService.initializeInMemoryStore();
    const loc = SeedService.inMemoryLocations.get(data.citySlug.toLowerCase());
    if (loc) {
      loc.waitlistCount = (loc.waitlistCount || 0) + 1;
    }

    if (dbConnection.getStatus().isConnected) {
      try {
        await Location.findOneAndUpdate(
          { slug: data.citySlug.toLowerCase() },
          { $inc: { waitlistCount: 1 } }
        );
      } catch (e) {}
    }

    return {
      success: true,
      message: `You're on the early access list for ${loc ? loc.name : data.citySlug}! We'll notify you upon launch.`,
      waitlistCount: loc ? loc.waitlistCount : this.inMemoryWaitlist.length,
    };
  }

  public static async getLocationBySlug(slug: string) {
    const cleanSlug = slug.toLowerCase().trim();
    // Alias normalization
    const normalizedSlug = cleanSlug === 'cp' ? 'connaught-place' : cleanSlug === 'gk' ? 'greater-kailash' : cleanSlug;

    let locRecord: any = null;

    if (dbConnection.getStatus().isConnected) {
      try {
        locRecord = await Location.findOne({
          $or: [{ slug: normalizedSlug }, { slug: cleanSlug }],
          isActive: true,
        })
          .populate('parent', 'name slug type status')
          .lean();
      } catch (err: any) {
        console.warn('[LocationService] DB lookup error:', err.message);
      }
    }

    if (!locRecord) {
      SeedService.initializeInMemoryStore();
      locRecord = SeedService.inMemoryLocations.get(normalizedSlug) || SeedService.inMemoryLocations.get(cleanSlug);
    }

    if (!locRecord) {
      return null;
    }

    // Calculate live business count
    let businessCount = 0;
    if (dbConnection.getStatus().isConnected) {
      try {
        businessCount = await Business.countDocuments({
          $or: [
            { locality: new RegExp(locRecord.name, 'i') },
            { locality: new RegExp(locRecord.slug, 'i') },
          ],
          status: 'ACTIVE',
        });
      } catch (e) {}
    } else {
      businessCount = Array.from(SeedService.inMemoryBusinesses.values()).filter(
        (b) =>
          b.locality.toLowerCase().includes(locRecord.name.toLowerCase()) ||
          b.locality.toLowerCase().includes(locRecord.slug.toLowerCase())
      ).length;
    }

    const meta = DELHI_LOCALITY_METADATA[normalizedSlug] || DELHI_LOCALITY_METADATA[cleanSlug] || {
      highlights: ['Verified local spots', 'Transit and neighborhood access', 'Community ratings'],
      popularCategories: ['Cafes', 'Restaurants', 'Shopping', 'Services'],
      nearbyLocalities: [
        { name: 'Connaught Place', slug: 'connaught-place', distance: '5.0 km' },
        { name: 'Hauz Khas', slug: 'hauz-khas', distance: '6.0 km' },
        { name: 'Saket', slug: 'saket', distance: '7.0 km' },
      ],
      faqs: [
        {
          question: `What makes ${locRecord.name} special?`,
          answer: `${locRecord.name} is a vibrant destination offering a distinct mix of local culture, dining spots, and convenient city connections.`,
        },
      ],
      relatedGuides: [
        { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
        { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
      ],
      metroConnectivity: 'Connected via city transit networks',
    };

    return {
      ...locRecord,
      businessCount,
      highlights: meta.highlights,
      popularCategories: meta.popularCategories,
      nearbyLocalities: meta.nearbyLocalities,
      faqs: meta.faqs,
      relatedGuides: meta.relatedGuides,
      metroConnectivity: meta.metroConnectivity,
    };
  }
}

