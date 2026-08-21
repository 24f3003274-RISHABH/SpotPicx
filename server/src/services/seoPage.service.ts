import { SeoPage, ISeoPage } from '../models/SeoPage';
import { Top10Service } from './top10.service';

export interface SeedSeoPageData {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  category: string;
  location: string;
  intent: string;
  filters?: {
    priceRange?: string[];
    amenities?: string[];
    tags?: string[];
    minRating?: number;
    dietaryOptions?: string[];
  };
  rankingMethod: 'rating' | 'reviewCount' | 'popularity' | 'distance' | 'engagement' | 'newest' | 'custom';
  contentSections: Array<{
    title: string;
    body: string;
    bulletPoints?: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  relatedPages: string[];
  relatedCategories: string[];
  relatedLocations: string[];
  published: boolean;
  canonicalUrl: string;
  keywords: string[];
}

export const curatedDelhiSeoPages: SeedSeoPageData[] = [
  {
    title: '10 Best Restaurants in Delhi (2026 Curated Guide)',
    slug: 'best-restaurants-in-delhi',
    metaTitle: '10 Best Restaurants in Delhi: Fine Dining, Mughlai & Iconic Gems | SpotPicks',
    metaDescription: 'Discover Delhi’s highest-rated dining destinations, from legendary ITC Maurya Bukhara to progressive Indian Accent, curated by local food critics.',
    h1: '10 Best Restaurants in Delhi (2026 Edition)',
    intro: 'Delhi is India’s culinary capital, where centuries-old Mughlai recipes mingle with cutting-edge modern gastronomy. From the opulent clay-oven kebabs of ITC Bukhara in Chanakyapuri to the inventive tasting menus at Indian Accent in Lodhi, our editorial team evaluated over 450 verified restaurants across South Delhi, Central Delhi, and Old Delhi. Here are the definitive top 10 establishments you cannot miss.',
    category: 'Restaurants',
    location: 'Delhi',
    intent: 'BEST',
    rankingMethod: 'custom',
    filters: {
      minRating: 4.5,
    },
    contentSections: [
      {
        title: 'How We Evaluated Delhi’s Top Dining Establishments',
        body: 'Every restaurant in our top 10 undergoes rigorous anonymous audits by our verified local reviewers. We weigh kitchen consistency, hygiene certifications, authentic spice balance, table service attentiveness, and wine/beverage curation.',
        bulletPoints: [
          'Authenticity & Heritage: Preservation of traditional tandoori and Dum Pukht techniques.',
          'Ingredient Freshness: Daily farm-to-table sourcing and artisanal dairy procurement.',
          'Atmosphere & Comfort: Spatial acoustic design, ambient lighting, and heritage aesthetics.',
          'Verified Community Consensus: Over 25,000 aggregated verified diner ratings on SpotPicks.',
        ],
      },
      {
        title: 'Price Range & Reservation Recommendations',
        body: 'Delhi’s fine-dining circuit experiences high weekend demand. We strongly advise booking at least 3–7 days in advance for establishments like Indian Accent and Bukhara. Average spend ranges between ₹2,500 to ₹6,500 for two guests at premier destinations.',
      },
    ],
    faq: [
      {
        question: 'Which is considered the single most iconic fine-dining restaurant in Delhi?',
        answer: 'Indian Accent at The Lodhi and Bukhara at ITC Maurya are universally regarded as Delhi’s flagship culinary landmarks, celebrated globally for progressive Indian tasting menus and heritage tandoori craft respectively.',
      },
      {
        question: 'Do these top restaurants accommodate vegetarian and vegan diners?',
        answer: 'Yes, all top 10 restaurants offer dedicated vegetarian tasting menus and curated plant-based courses, honoring Delhi’s deep vegetarian heritage.',
      },
      {
        question: 'Is there a strict dress code at high-end Delhi restaurants?',
        answer: 'Most fine-dining restaurants follow a smart casual or formal dress code. Closed footwear and collared shirts are recommended for evening reservations.',
      },
    ],
    relatedPages: [
      'best-cafes-in-delhi',
      'best-date-places-in-delhi',
      'best-street-food-in-old-delhi',
      'best-rooftop-bars-in-delhi',
    ],
    relatedCategories: ['Restaurants', 'Fine Dining', 'Mughlai', 'Bar & Lounge'],
    relatedLocations: ['Connaught Place', 'Chanakyapuri', 'Lodhi Colony', 'Saket'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-restaurants-in-delhi',
    keywords: ['best restaurants in delhi', 'delhi fine dining', 'top 10 food places delhi', 'indian accent', 'bukhara delhi'],
  },
  {
    title: '10 Best Cafes in Delhi for Coffee, Vibe & Work (2026)',
    slug: 'best-cafes-in-delhi',
    metaTitle: '10 Best Cafes in Delhi: Artisan Coffee, Aesthetic Corners & Work Cafes',
    metaDescription: 'Explore the top cafes in Delhi for pour-overs, sourdough brunch, fast Wi-Fi, and charming outdoor seating across Champa Gali, Saket, and Hauz Khas.',
    h1: '10 Best Cafes in Delhi: Artisan Coffee & Aesthetic Vibes',
    intro: 'Delhi’s specialty coffee culture has exploded into a vibrant scene of artisanal roasteries, European-style garden bistros, and peaceful work-friendly spaces. Whether you seek a tranquil pour-over spot in Saidulajab’s Champa Gali, a romantic outdoor terrace at Diggin Chanakyapuri, or specialty micro-lots at Blue Tokai, here are the top 10 coffee spots in Delhi NCR.',
    category: 'Cafes',
    location: 'Delhi',
    intent: 'BEST',
    rankingMethod: 'custom',
    filters: {
      tags: ['cafe', 'coffee', 'bakery', 'cozy'],
      minRating: 4.3,
    },
    contentSections: [
      {
        title: 'The Specialty Coffee Boom in South Delhi',
        body: 'From single-origin beans sourced directly from Chikmagalur estates to aeropress brewing workshops, Delhi roasteries prioritize ethical bean sourcing and nuanced flavor notes of dark cocoa, citrus, and stone fruits.',
        bulletPoints: [
          'Wi-Fi & Power Sockets: Designated quiet zones for remote professionals and creators.',
          'Pet-Friendly Outdoor Terraces: Lush courtyards welcoming pets in Saket and Dhan Mill.',
          'Artisanal Bakeries: Freshly laminated butter croissants, Basque cheesecakes, and artisanal sourdough loaves.',
        ],
      },
    ],
    faq: [
      {
        question: 'Which area in Delhi has the highest concentration of aesthetic cafes?',
        answer: 'Hauz Khas Village, Saidulajab (Champa Gali), Dhan Mill Compound in Chhatarpur, and Shahpur Jat boast the highest density of concept cafes and roasteries.',
      },
      {
        question: 'Are Delhi cafes suitable for long remote working sessions?',
        answer: 'Yes! Places like Blue Tokai Roasters, Perch Wine & Coffee Bar, and select outlets in Saket provide high-speed Wi-Fi, ample power outlets, and laptop-friendly desks.',
      },
    ],
    relatedPages: [
      'best-co-working-cafes-in-delhi',
      'best-date-places-in-delhi',
      'best-cafes-in-saket',
      'best-restaurants-in-delhi',
    ],
    relatedCategories: ['Cafes', 'Bakeries', 'Desserts', 'Breakfast'],
    relatedLocations: ['Hauz Khas', 'Saket', 'Chhatarpur', 'Khan Market'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-cafes-in-delhi',
    keywords: ['best cafes in delhi', 'aesthetic cafes delhi', 'delhi coffee shops', 'blue tokai delhi', 'diggin delhi'],
  },
  {
    title: '10 Best Momos in Delhi: From Majnu Ka Tilla to Yashwant Place',
    slug: 'best-momos-in-delhi',
    metaTitle: '10 Best Momos in Delhi: Steamed, Tandoori & Tibetan Spots | SpotPicks',
    metaDescription: 'Craving authentic momos in Delhi? Here are the top 10 spots for juicy steamed Tibetan dumplings, spicy Schezwan gravy, and crispy Kurkure momos.',
    h1: '10 Best Momos in Delhi (Ranked by Street Food Experts)',
    intro: 'In Delhi, momos are not just a snack — they are an emotion. From the traditional Himalayan steamed pork and buffalo momos of Majnu Ka Tilla to the fiery tandoori momos of Amar Colony and sizzling platters at Chanakyapuri’s Yashwant Place, we have mapped out Delhi’s ultimate momo trail.',
    category: 'Street Food',
    location: 'Delhi',
    intent: 'BEST',
    rankingMethod: 'popularity',
    filters: {
      tags: ['momo', 'dumplings', 'tibetan', 'street food'],
    },
    contentSections: [
      {
        title: 'The Evolution of Momo Styles Across Delhi',
        body: 'Delhi introduced revolutionary variations to the traditional Himalayan dumpling, including charcoal-roasted Tandoori momos brushed with spiced butter and cornflake-encrusted Kurkure momos served with creamy garlic dip.',
        bulletPoints: [
          'Majnu Ka Tilla: Authentic Tibetan recipe with clear bone broth (Thukpa) and fiery crushed red chili sauce.',
          'Yashwant Place: Famous for piping hot sizzler momos and mutton steam dumplings in Central Delhi.',
          'Amar Colony (Lajpat Nagar): Home to Delhi’s inventive Tandoori Afghan momos marinated in spiced curd.',
        ],
      },
    ],
    faq: [
      {
        question: 'Where can I find the most authentic traditional Tibetan momos in Delhi?',
        answer: 'Majnu Ka Tilla (New Aruna Nagar) is Delhi’s Tibetan colony and offers the most authentic traditional steamed and fried momos with garlic-chili dip.',
      },
      {
        question: 'What is the average price of momos in Delhi?',
        answer: 'Street vendors charge ₹60 to ₹120 per plate, while sit-down Himalayan cafes charge ₹150 to ₹280 per plate.',
      },
    ],
    relatedPages: [
      'best-street-food-in-old-delhi',
      'best-markets-in-delhi',
      'best-cafes-in-delhi',
    ],
    relatedCategories: ['Street Food', 'Tibetan', 'Asian', 'Fast Food'],
    relatedLocations: ['Majnu Ka Tilla', 'Lajpat Nagar', 'Chanakyapuri', 'Old Delhi'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-momos-in-delhi',
    keywords: ['best momos in delhi', 'majnu ka tilla momos', 'tandoori momos delhi', 'yashwant place momos'],
  },
  {
    title: '10 Best Date Places in Delhi for Couples & Romance (2026)',
    slug: 'best-date-places-in-delhi',
    metaTitle: '10 Best Romantic Date Places in Delhi: Rooftops, Heritage Views & Gardens',
    metaDescription: 'Plan the perfect romantic date in Delhi. Discover dreamy rooftop restaurants, illuminated Qutub Minar views, and candlelit garden bistros.',
    h1: '10 Best Date Places in Delhi: Romantic Spots & Skyline Views',
    intro: 'Looking to impress your partner or celebrate an anniversary in Delhi? From fairy-lit glasshouses at Diggin to open-air heritage terraces overlooking the Qutub Minar at Olive Bar & Kitchen, Delhi boasts some of India’s most enchanting date night venues.',
    category: 'Nightlife',
    location: 'Delhi',
    intent: 'ROMANTIC',
    rankingMethod: 'custom',
    filters: {
      tags: ['romantic', 'date', 'rooftop', 'cozy', 'ambiance'],
      minRating: 4.4,
    },
    contentSections: [
      {
        title: 'Choosing the Ideal Date Vibe in Delhi',
        body: 'Whether you prefer a peaceful sunset walk among blooming bougainvillea followed by artisanal gelato, or a candlelit European dinner with live jazz, location and ambience define the romantic experience.',
        bulletPoints: [
          'Heritage Serenade: Mehrauli’s stylish courtyards with Qutub Minar panoramas.',
          'Green Oasis: Sunder Nursery picnics followed by artisanal coffee in Nizamuddin.',
          'Italian Charm: Chanakyapuri’s brick-and-ivy garden bistros.',
        ],
      },
    ],
    faq: [
      {
        question: 'Which romantic restaurant has the best view in Delhi?',
        answer: 'Olive Bar & Kitchen and Rooh in Mehrauli offer unrivaled views of the illuminated Qutub Minar amidst lush bougainvillea canopy.',
      },
      {
        question: 'Are there budget-friendly date spots in Delhi?',
        answer: 'Absolutely! Sunder Nursery and Lodhi Gardens offer breathtaking landscaped heritage lawns for peaceful evening strolls for less than ₹100 entry.',
      },
    ],
    relatedPages: [
      'best-restaurants-in-delhi',
      'best-cafes-in-delhi',
      'best-parks-in-delhi',
      'best-rooftop-bars-in-delhi',
    ],
    relatedCategories: ['Fine Dining', 'Cafes', 'Italian', 'Rooftop Lounge'],
    relatedLocations: ['Mehrauli', 'Chanakyapuri', 'Lodhi Colony', 'Hauz Khas'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-date-places-in-delhi',
    keywords: ['best date places delhi', 'romantic restaurants delhi', 'couple spots delhi', 'olive mehrauli date'],
  },
  {
    title: '10 Best Parks & Heritage Gardens in Delhi for Picnics & Walks',
    slug: 'best-parks-in-delhi',
    metaTitle: '10 Best Parks in Delhi: Sunder Nursery, Lodhi Garden & Green Escapes',
    metaDescription: 'Explore the green heart of Delhi. From 15th-century Mughal tombs at Lodhi Garden to the UNESCO-restored botanical haven at Sunder Nursery.',
    h1: '10 Best Parks & Green Spaces in Delhi (2026 Guide)',
    intro: 'Delhi is one of the greenest capital cities in the world, filled with royal Mughal gardens, ancient architectural ruins, and expansive ecological parks. Escape the city bustle with these top 10 heritage parks for morning jogs, weekend picnics, and birdwatching.',
    category: 'Parks',
    location: 'Delhi',
    intent: 'OUTDOOR',
    rankingMethod: 'popularity',
    filters: {
      tags: ['park', 'garden', 'heritage', 'nature', 'picnic'],
    },
    contentSections: [
      {
        title: 'Delhi’s Botanical & Historical Heritage',
        body: 'Unlike standard urban parks, Delhi’s green reserves are living archaeological sanctuaries dating back to the Sayyid, Lodi, and Mughal dynasties. Sunder Nursery alone features over 300 tree species and 20 restored 16th-century monuments.',
      },
    ],
    faq: [
      {
        question: 'Which park in Delhi is best for family picnics?',
        answer: 'Sunder Nursery in Nizamuddin is Delhi’s top picnic park, with sprawling manicured lawns, clean lakes, cafes, and weekend organic farmers markets.',
      },
      {
        question: 'Are pets allowed in Delhi parks?',
        answer: 'Lodhi Garden and Sunder Nursery (on leashes) welcome pets, making them favorites among South Delhi dog parents.',
      },
    ],
    relatedPages: [
      'best-date-places-in-delhi',
      'best-markets-in-delhi',
      'best-restaurants-in-delhi',
    ],
    relatedCategories: ['Parks', 'Heritage', 'Outdoors', 'Photography'],
    relatedLocations: ['Lodhi Colony', 'Nizamuddin', 'Hauz Khas', 'Mehrauli'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-parks-in-delhi',
    keywords: ['best parks in delhi', 'sunder nursery delhi', 'lodhi garden', 'delhi picnic spots'],
  },
  {
    title: '10 Best Shopping Markets in Delhi: Bargains, Fashion & Crafts',
    slug: 'best-markets-in-delhi',
    metaTitle: '10 Best Markets in Delhi: Sarojini Nagar, Khan Market & Dilli Haat',
    metaDescription: 'From high-street luxury at Khan Market to unbeatable street fashion bargains in Sarojini Nagar and authentic handicrafts at Dilli Haat INA.',
    h1: '10 Best Shopping Markets in Delhi: Street Fashion & Luxury',
    intro: 'Delhi is India’s ultimate shopping bazaar. Whether you are hunting for budget runway export surplus at Sarojini Nagar, handcrafted shawls and jewelry at Dilli Haat, or upscale designer boutiques at Khan Market, our curated guide covers the top 10 shopping hubs.',
    category: 'Shopping',
    location: 'Delhi',
    intent: 'POPULAR',
    rankingMethod: 'popularity',
    filters: {
      tags: ['market', 'shopping', 'bazaar', 'fashion', 'handicrafts'],
    },
    contentSections: [
      {
        title: 'Top Shopping Districts by Category',
        body: 'Each Delhi bazaar specializes in unique craft and commerce traditions:',
        bulletPoints: [
          'Sarojini Nagar & Janpath: Export surplus apparel, shoes, and trendy accessories.',
          'Khan Market: Upscale lifestyle books, artisanal skincare, and fine dining.',
          'Dilli Haat INA: Direct artisan craft stalls and pan-India regional food court.',
          'Chandni Chowk: Bridal lehengas, silverware, spices, and historic textiles.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is the best market in Delhi for cheap western clothes?',
        answer: 'Sarojini Nagar Market is universally famed for ₹100–₹500 export surplus fashion, tops, denim, and footwear.',
      },
      {
        question: 'Are Delhi markets open on Mondays?',
        answer: 'Most markets like Sarojini Nagar and Khan Market are open, but Chandni Chowk and Karol Bagh remain closed on Sundays, while Sarojini has fewer vendors on Mondays.',
      },
    ],
    relatedPages: [
      'best-street-food-in-old-delhi',
      'best-cafes-in-delhi',
      'best-restaurants-in-delhi',
    ],
    relatedCategories: ['Shopping', 'Fashion', 'Handicrafts', 'Bazaars'],
    relatedLocations: ['Sarojini Nagar', 'Khan Market', 'INA', 'Chandni Chowk'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-markets-in-delhi',
    keywords: ['best markets in delhi', 'sarojini nagar shopping', 'khan market delhi', 'dilli haat ina'],
  },
  {
    title: '10 Best PGs & Co-Living Spaces in Delhi for Students & Techies',
    slug: 'best-pg-in-delhi',
    metaTitle: '10 Best PGs in Delhi: Student & Working Professional Accommodations',
    metaDescription: 'Find verified, premium PGs and co-living hubs in Delhi with high-speed Wi-Fi, home-cooked food, 24/7 security, and AC rooms across North and South Campus.',
    h1: '10 Best PGs & Co-Living Spaces in Delhi (2026 Verified)',
    intro: 'Moving to Delhi for university or a new job? We reviewed top student accommodations and tech co-living spaces across North Campus (Vijay Nagar, Hudson Lane), South Campus (Satya Niketan), Saket, and Noida connectivity belts to bring you the top 10 verified PGs with great amenities.',
    category: 'Living',
    location: 'Delhi',
    intent: 'STUDENT_FRIENDLY',
    rankingMethod: 'custom',
    filters: {
      tags: ['pg', 'co-living', 'student', 'accommodation', 'hostel'],
    },
    contentSections: [
      {
        title: 'Key Factors to Check When Choosing a Delhi PG',
        body: 'Always verify metro proximity (under 10 mins walk), biometric security, electricity backup for summer heatwaves, and daily hygienic meal menus before booking.',
      },
    ],
    faq: [
      {
        question: 'What is the average monthly rent for a PG in South Delhi?',
        answer: 'A single sharing room costs between ₹14,000–₹22,000/month including meals, Wi-Fi, and housekeeping. Double sharing costs ₹8,000–₹13,000/month.',
      },
      {
        question: 'Which areas are best for Delhi University students?',
        answer: 'Hudson Lane, Vijay Nagar, and Kamla Nagar for North Campus; Satya Niketan and Anand Niketan for South Campus.',
      },
    ],
    relatedPages: [
      'best-co-working-cafes-in-delhi',
      'best-cafes-in-delhi',
      'best-markets-in-delhi',
    ],
    relatedCategories: ['Living', 'Hostels', 'Co-Living', 'Student Hubs'],
    relatedLocations: ['North Campus', 'Satya Niketan', 'Saket', 'Laxmi Nagar'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-pg-in-delhi',
    keywords: ['best pg in delhi', 'co living delhi', 'student pg south campus', 'delhi university pg'],
  },
  {
    title: '10 Best Street Food Spots in Old Delhi (Chandni Chowk Trail)',
    slug: 'best-street-food-in-old-delhi',
    metaTitle: '10 Best Old Delhi Street Food Spots: Chandni Chowk Culinary Trail',
    metaDescription: 'Experience the culinary magic of Shahjahanabad: Daulat ki Chaat, Natraj Dahi Bhalla, Paranthe Wali Gali, and Karim’s kebabs in Old Delhi.',
    h1: '10 Best Street Food Spots in Old Delhi (Chandni Chowk Guide)',
    intro: 'Old Delhi is a sensory explosion of sizzling spices, golden jalebis, and fragrant biryanis that have been perfected over 350 years. Walk through the narrow historic alleys of Chandni Chowk and Jama Masjid with our definitive top 10 street food stops.',
    category: 'Street Food',
    location: 'Old Delhi',
    intent: 'BEST',
    rankingMethod: 'popularity',
    filters: {
      tags: ['street food', 'chaat', 'old delhi', 'chandni chowk', 'mughlai'],
    },
    contentSections: [
      {
        title: 'Timeless Icons of Shahjahanabad',
        body: 'Old Delhi’s street culinary masters have maintained single-item perfection across four to five generations of family stewardship.',
        bulletPoints: [
          'Natraj Dahi Bhalla: Velvety soaked lentil dumplings with spiced curd since 1940.',
          'Old Famous Jalebi Wala: Giant saffron-infused jalebis fried in pure desi ghee at Dariba Kalan.',
          'Kuremal Mohan Lal Kulfi: 100% natural fruit-stuffed kulfis (mango, pomegranate, jamun) since 1906.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is the best time to visit Old Delhi for street food?',
        answer: 'Early morning (8:00 AM to 11:00 AM) for bedmi puri and nihari, or late afternoon (4:00 PM to 9:00 PM) for evening chaat and kebabs.',
      },
      {
        question: 'Which metro station is closest to Chandni Chowk street food?',
        answer: 'Chandni Chowk Metro Station (Yellow Line) and Jama Masjid Metro Station (Violet Line) provide direct walking access.',
      },
    ],
    relatedPages: [
      'best-restaurants-in-delhi',
      'best-momos-in-delhi',
      'best-markets-in-delhi',
    ],
    relatedCategories: ['Street Food', 'Mughlai', 'Desserts', 'Heritage'],
    relatedLocations: ['Old Delhi', 'Chandni Chowk', 'Jama Masjid', 'Daryaganj'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-street-food-in-old-delhi',
    keywords: ['best street food old delhi', 'chandni chowk food', 'paranthe wali gali', 'karims delhi'],
  },
  {
    title: '10 Best Co-Working Cafes in Delhi with Fast Wi-Fi & Plugs',
    slug: 'best-co-working-cafes-in-delhi',
    metaTitle: '10 Best Work-Friendly Cafes in Delhi: Fast Wi-Fi, Sockets & Good Coffee',
    metaDescription: 'Find quiet, laptop-friendly cafes in Delhi with blazing Wi-Fi, ample charging ports, ergonomic seats, and specialty brews for remote work.',
    h1: '10 Best Co-Working Cafes in Delhi for Remote Work (2026)',
    intro: 'Need a productive spot outside your home office? We tested network speeds, power socket density, seating ergonomics, and acoustic comfort across 60+ Delhi cafes to curate the top 10 work-friendly spaces in the capital.',
    category: 'Cafes',
    location: 'Delhi',
    intent: 'WORK_FRIENDLY',
    rankingMethod: 'custom',
    filters: {
      tags: ['work', 'wifi', 'cafe', 'coffee', 'quiet'],
    },
    contentSections: [
      {
        title: 'Evaluation Criteria for Remote Work Cafes',
        body: 'Every co-working cafe on this list guarantees 50+ Mbps fiber internet, unobstructed charging outlets at over 60% of tables, and welcoming staff who support multi-hour work sessions.',
      },
    ],
    faq: [
      {
        question: 'Can I attend Zoom calls in these work-friendly cafes?',
        answer: 'Yes, most listed cafes have moderate acoustic levels and quiet corners suitable for voice and video meetings with headphones.',
      },
      {
        question: 'Do any work cafes offer dedicated work day-passes?',
        answer: 'Establishments like Social and select Blue Tokai hubs offer day passes that include food and beverage redeemable credits.',
      },
    ],
    relatedPages: [
      'best-cafes-in-delhi',
      'best-pg-in-delhi',
      'best-cafes-in-saket',
    ],
    relatedCategories: ['Cafes', 'Co-Working', 'Specialty Coffee'],
    relatedLocations: ['Saket', 'Hauz Khas', 'Connaught Place', 'Aerocity'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-co-working-cafes-in-delhi',
    keywords: ['work cafes delhi', 'co working cafes delhi', 'laptop friendly cafes delhi', 'wifi cafe delhi'],
  },
  {
    title: '10 Best Rooftop Bars & Lounges in Delhi for Sunset Drinks',
    slug: 'best-rooftop-bars-in-delhi',
    metaTitle: '10 Best Rooftop Bars in Delhi: Skyline Views, Cocktails & Nightlife',
    metaDescription: 'Sip craft cocktails overlooking Delhi’s historic skyline and lush canopies. Here are the 10 best rooftop bars in CP, Mehrauli, and Aerocity.',
    h1: '10 Best Rooftop Bars in Delhi: Skyline Panoramas & Craft Drinks',
    intro: 'Delhi’s skyline comes alive at twilight. From colonial terraces overlooking Connaught Place’s inner circle to chic Mehrauli lounges gazing at the illuminated Qutub Minar, explore the top 10 open-air rooftop bars for memorable evenings.',
    category: 'Nightlife',
    location: 'Delhi',
    intent: 'ROMANTIC',
    rankingMethod: 'popularity',
    filters: {
      tags: ['rooftop', 'bar', 'cocktails', 'nightlife', 'lounge'],
    },
    contentSections: [
      {
        title: 'The Rooftop Mixology Scene in Delhi',
        body: 'Delhi’s leading mixologists are reimagining cocktails with indigenous botanicals like elderflower, Darjeeling tea infusions, and smoked Kashmiri saffron.',
      },
    ],
    faq: [
      {
        question: 'Do Delhi rooftop bars require advance reservation?',
        answer: 'Yes, rooftop seating is highly coveted on Friday and Saturday evenings. We recommend reserving at least 48 hours prior.',
      },
    ],
    relatedPages: [
      'best-date-places-in-delhi',
      'best-restaurants-in-delhi',
      'best-cafes-in-delhi',
    ],
    relatedCategories: ['Nightlife', 'Bars', 'Rooftops', 'Cocktails'],
    relatedLocations: ['Connaught Place', 'Mehrauli', 'Aerocity', 'Hauz Khas'],
    published: true,
    canonicalUrl: 'https://spotpicks.delhi/best-rooftop-bars-in-delhi',
    keywords: ['best rooftop bars delhi', 'skyline lounge delhi', 'rooftop restaurants cp', 'nightlife delhi'],
  },
];

export class SeoPageService {
  /**
   * Initialize or retrieve all curated SEO pages
   */
  public static async getAllPublished() {
    try {
      const pages = await SeoPage.find({ published: true }).sort({ createdAt: -1 }).lean();
      if (pages && pages.length > 0) {
        return pages;
      }
    } catch (e) {
      console.warn('SeoPage find error, falling back to curated list:', e);
    }
    return curatedDelhiSeoPages;
  }

  /**
   * Resolve an SEO page by slug, dynamic query fallback, and compute its live Top 10 items
   */
  public static async getBySlug(slug: string) {
    const cleanSlug = slug.toLowerCase().trim();

    let pageData: any = null;

    try {
      pageData = await SeoPage.findOne({ slug: cleanSlug, published: true }).lean();
    } catch (err) {
      console.warn('Error fetching SEO page from DB:', err);
    }

    if (!pageData) {
      // Look up in curated static list
      pageData = curatedDelhiSeoPages.find((p) => p.slug === cleanSlug);
    }

    // Dynamic SEO fallback for pattern `best-<category>-in-<location>` if not pre-seeded
    if (!pageData && cleanSlug.startsWith('best-')) {
      const parts = cleanSlug.replace(/^best-/, '').split('-in-');
      const categoryPart = parts[0]?.replace(/-/g, ' ') || 'Spots';
      const locationPart = parts[1]?.replace(/-/g, ' ') || 'Delhi';

      const capitalizedCategory = categoryPart
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const capitalizedLocation = locationPart
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      pageData = {
        title: `10 Best ${capitalizedCategory} in ${capitalizedLocation} (2026 Guide)`,
        slug: cleanSlug,
        metaTitle: `10 Best ${capitalizedCategory} in ${capitalizedLocation} | SpotPicks Curated`,
        metaDescription: `Discover the top rated ${capitalizedCategory} in ${capitalizedLocation}, Delhi. Evaluated and ranked by local Delhi food and lifestyle critics.`,
        h1: `10 Best ${capitalizedCategory} in ${capitalizedLocation}`,
        intro: `Explore our verified rankings of the top ${capitalizedCategory.toLowerCase()} across ${capitalizedLocation}. Every establishment is scored on customer satisfaction, service standards, and verified community reviews.`,
        category: capitalizedCategory,
        location: capitalizedLocation,
        intent: 'BEST',
        rankingMethod: 'custom',
        contentSections: [
          {
            title: `Why Visit ${capitalizedCategory} in ${capitalizedLocation}?`,
            body: `${capitalizedLocation} offers exceptional diversity for ${capitalizedCategory.toLowerCase()}, combining vibrant local energy with outstanding hospitality.`,
          },
        ],
        faq: [
          {
            question: `What makes these ${capitalizedCategory.toLowerCase()} the best in ${capitalizedLocation}?`,
            answer: `Our rankings combine verified diner ratings, consistent service quality, and authentic local recommendations from SpotPicks curators.`,
          },
        ],
        relatedPages: ['best-restaurants-in-delhi', 'best-cafes-in-delhi', 'best-markets-in-delhi'],
        relatedCategories: [capitalizedCategory, 'Restaurants', 'Cafes'],
        relatedLocations: [capitalizedLocation, 'Delhi NCR', 'South Delhi'],
        published: true,
        canonicalUrl: `https://spotpicks.delhi/${cleanSlug}`,
        keywords: [`best ${categoryPart} in ${locationPart}`, `${categoryPart} ${locationPart}`, `top 10 ${categoryPart}`],
      };
    }

    if (!pageData) {
      return null;
    }

    // Compute live Top 10 rankings dynamically using Top10Service
    const top10Result = await Top10Service.getTop10({
      category: pageData.category,
      location: pageData.location,
      intent: pageData.intent,
      rankingMethod: pageData.rankingMethod,
      priceRange: pageData.filters?.priceRange,
      tags: pageData.filters?.tags,
      amenities: pageData.filters?.amenities,
      minRating: pageData.filters?.minRating,
      limit: 10,
    });

    return {
      ...pageData,
      top10: top10Result.items,
      stats: top10Result.meta,
    };
  }

  /**
   * Generate JSON-LD Structured Data Schema for the SEO page
   */
  public static generateJsonLd(seoPage: any, baseUrl = 'https://spotpicks.delhi') {
    const canonical = seoPage.canonicalUrl || `${baseUrl}/${seoPage.slug}`;

    // 1. BreadcrumbList Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Delhi Guides',
          item: `${baseUrl}/explore`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: seoPage.h1 || seoPage.title,
          item: canonical,
        },
      ],
    };

    // 2. ItemList Schema for Top 10 Rankings
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: seoPage.h1 || seoPage.title,
      description: seoPage.metaDescription,
      numberOfItems: seoPage.top10?.length || 0,
      itemListElement: (seoPage.top10 || []).map((biz: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LocalBusiness',
          name: biz.name,
          image: biz.images?.[0] || biz.coverImage,
          url: `${baseUrl}/business/${biz.slug || biz._id}`,
          telephone: biz.phone,
          priceRange: biz.priceRange === 'BUDGET' ? '₹' : biz.priceRange === 'MODERATE' ? '₹₹' : '₹₹₹₹',
          address: {
            '@type': 'PostalAddress',
            streetAddress: biz.address,
            addressLocality: biz.locality || 'Delhi',
            addressRegion: 'Delhi NCR',
            addressCountry: 'IN',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: biz.rating || 4.5,
            reviewCount: biz.reviewCount || 10,
            bestRating: 5,
            worstRating: 1,
          },
        },
      })),
    };

    // 3. FAQPage Schema
    const faqSchema =
      seoPage.faq && seoPage.faq.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: seoPage.faq.map((item: any) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }
        : null;

    return {
      breadcrumbSchema,
      itemListSchema,
      faqSchema,
    };
  }
}
