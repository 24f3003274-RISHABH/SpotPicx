export interface CityLocality {
  id: string;
  name: string;
  area: string;
  city?: string;
  popularFor: string;
  latitude: number;
  longitude: number;
}


// This file is for adding the location , in future if there will be new place then we can add up the locations 

export const POPULAR_DELHI_LOCALITIES: CityLocality[] = [

  // =========================
  // CENTRAL DELHI
  // =========================

  { id: 'connaught-place', name: 'Connaught Place', area: 'Central Delhi', city: 'Delhi', popularFor: 'Heritage Dining & Shopping', latitude: 28.6304, longitude: 77.2197 },

  { id: 'barakhamba', name: 'Barakhamba', area: 'Central Delhi', city: 'Delhi', popularFor: 'Corporate Offices & Fine Dining', latitude: 28.6315, longitude: 77.2250 },

  { id: 'mandi-house', name: 'Mandi House', area: 'Central Delhi', city: 'Delhi', popularFor: 'Theatres, Culture & Art', latitude: 28.6257, longitude: 77.2340 },

  { id: 'india-gate', name: 'India Gate', area: 'Central Delhi', city: 'Delhi', popularFor: 'Monuments, Picnics & Night Walks', latitude: 28.6129, longitude: 77.2295 },

  { id: 'janpath', name: 'Janpath', area: 'Central Delhi', city: 'Delhi', popularFor: 'Street Shopping & Handicrafts', latitude: 28.6271, longitude: 77.2180 },

  { id: 'khan-market', name: 'Khan Market', area: 'Central Delhi', city: 'Delhi', popularFor: 'Gourmet Eateries & Bookstores', latitude: 28.6003, longitude: 77.2272 },

  { id: 'lodi-colony', name: 'Lodhi Colony', area: 'Central Delhi', city: 'Delhi', popularFor: 'Street Art, Cafes & Heritage', latitude: 28.5895, longitude: 77.2273 },

  { id: 'sunder-nagar', name: 'Sundar Nagar', area: 'Central Delhi', city: 'Delhi', popularFor: 'Antiques, Cafes & Premium Shopping', latitude: 28.6035, longitude: 77.2400 },

  { id: 'jantar-mantar', name: 'Jantar Mantar', area: 'Central Delhi', city: 'Delhi', popularFor: 'Heritage & Historical Attractions', latitude: 28.6271, longitude: 77.2165 },

  { id: 'karol-bagh', name: 'Karol Bagh', area: 'Central Delhi', city: 'Delhi', popularFor: 'Shopping, Street Food & Hotels', latitude: 28.6517, longitude: 77.1906 },

  { id: 'patel-nagar', name: 'Patel Nagar', area: 'West Delhi', city: 'Delhi', popularFor: 'Residential Areas, Food & Shopping', latitude: 28.6500, longitude: 77.1700 },

  { id: 'rajendra-place', name: 'Rajendra Place', area: 'Central Delhi', city: 'Delhi', popularFor: 'Offices, Restaurants & Business Hotels', latitude: 28.6428, longitude: 77.1780 },


  // =========================
  // OLD DELHI
  // =========================

  { id: 'chandni-chowk', name: 'Chandni Chowk', area: 'Old Delhi', city: 'Delhi', popularFor: 'Legendary Street Food & Markets', latitude: 28.6506, longitude: 77.2303 },

  { id: 'lal-quila', name: 'Red Fort', area: 'Old Delhi', city: 'Delhi', popularFor: 'Mughal Heritage & Tourism', latitude: 28.6562, longitude: 77.2410 },

  { id: 'jama-masjid', name: 'Jama Masjid', area: 'Old Delhi', city: 'Delhi', popularFor: 'Heritage, Architecture & Food', latitude: 28.6507, longitude: 77.2334 },

  { id: 'chawri-bazar', name: 'Chawri Bazar', area: 'Old Delhi', city: 'Delhi', popularFor: 'Traditional Markets & Street Food', latitude: 28.6494, longitude: 77.2265 },

  { id: 'dariba-kalan', name: 'Dariba Kalan', area: 'Old Delhi', city: 'Delhi', popularFor: 'Jewellery & Traditional Markets', latitude: 28.6535, longitude: 77.2300 },

  { id: 'khari-baoli', name: 'Khari Baoli', area: 'Old Delhi', city: 'Delhi', popularFor: 'Spice Market & Street Food', latitude: 28.6570, longitude: 77.2208 },

  { id: 'fatehpuri', name: 'Fatehpuri', area: 'Old Delhi', city: 'Delhi', popularFor: 'Spices, Sweets & Traditional Food', latitude: 28.6560, longitude: 77.2187 },

  { id: 'ballimaran', name: 'Ballimaran', area: 'Old Delhi', city: 'Delhi', popularFor: 'Traditional Bazaars & Street Food', latitude: 28.6545, longitude: 77.2250 },

  { id: 'daryaganj', name: 'Daryaganj', area: 'Central Delhi', city: 'Delhi', popularFor: 'Books, Food & Sunday Market', latitude: 28.6469, longitude: 77.2460 },

  { id: 'paharganj', name: 'Paharganj', area: 'Central Delhi', city: 'Delhi', popularFor: 'Budget Hotels, Food & Backpackers', latitude: 28.6430, longitude: 77.2130 },


  // =========================
  // SOUTH DELHI
  // =========================

  { id: 'hauz-khas-village', name: 'Hauz Khas Village', area: 'South Delhi', city: 'Delhi', popularFor: 'Boutique Cafes, Nightlife & Lake Views', latitude: 28.5494, longitude: 77.1932 },

  { id: 'green-park', name: 'Green Park', area: 'South Delhi', city: 'Delhi', popularFor: 'Restaurants, Cafes & Shopping', latitude: 28.5587, longitude: 77.2067 },

  { id: 'safdarjung-enclave', name: 'Safdarjung Enclave', area: 'South Delhi', city: 'Delhi', popularFor: 'Restaurants, Cafes & Residential Living', latitude: 28.5620, longitude: 77.1950 },

  { id: 'south-extension', name: 'South Extension', area: 'South Delhi', city: 'Delhi', popularFor: 'Bridal Shopping & Premium Salons', latitude: 28.5729, longitude: 77.2223 },

  { id: 'greater-kailash', name: 'Greater Kailash', area: 'South Delhi', city: 'Delhi', popularFor: 'Premium Shopping, Restaurants & Cafes', latitude: 28.5487, longitude: 77.2380 },

  { id: 'greater-kailash-1', name: 'Greater Kailash 1', area: 'South Delhi', city: 'Delhi', popularFor: 'M Block Market, Cafes & Restaurants', latitude: 28.5494, longitude: 77.2380 },

  { id: 'greater-kailash-2', name: 'Greater Kailash 2', area: 'South Delhi', city: 'Delhi', popularFor: 'Shopping, Cafes & Residential Living', latitude: 28.5330, longitude: 77.2420 },

  { id: 'kailash-colony', name: 'Kailash Colony', area: 'South Delhi', city: 'Delhi', popularFor: 'Cafes, Restaurants & Shopping', latitude: 28.5530, longitude: 77.2410 },

  { id: 'nehru-place', name: 'Nehru Place', area: 'South Delhi', city: 'Delhi', popularFor: 'Electronics, Laptops & Computer Repairs', latitude: 28.5492, longitude: 77.2529 },

  { id: 'kalkaji', name: 'Kalkaji', area: 'South Delhi', city: 'Delhi', popularFor: 'Temples, Markets & Local Food', latitude: 28.5355, longitude: 77.2588 },

  { id: 'govindpuri', name: 'Govindpuri', area: 'South Delhi', city: 'Delhi', popularFor: 'Student Housing, PGs & Local Markets', latitude: 28.5435, longitude: 77.2640 },

  { id: 'chittaranjan-park', name: 'Chittaranjan Park', area: 'South Delhi', city: 'Delhi', popularFor: 'Bengali Food, Markets & Restaurants', latitude: 28.5380, longitude: 77.2490 },

  { id: 'greater-kailash-market', name: 'GK M Block', area: 'South Delhi', city: 'Delhi', popularFor: 'Fashion, Cafes & Premium Shopping', latitude: 28.5494, longitude: 77.2420 },

  { id: 'saket', name: 'Saket & Saidulajab', area: 'South Delhi', city: 'Delhi', popularFor: 'Champa Gali, Cafes & Malls', latitude: 28.5244, longitude: 77.2066 },

  { id: 'malviya-nagar', name: 'Malviya Nagar', area: 'South Delhi', city: 'Delhi', popularFor: 'Shopping, Food & Student Living', latitude: 28.5355, longitude: 77.2110 },

  { id: 'hauz-khas', name: 'Hauz Khas', area: 'South Delhi', city: 'Delhi', popularFor: 'Cafes, Shopping & Urban Lifestyle', latitude: 28.5494, longitude: 77.2000 },

  { id: 'sarvapriya-vihar', name: 'Sarvapriya Vihar', area: 'South Delhi', city: 'Delhi', popularFor: 'Residential Living & Cafes', latitude: 28.5370, longitude: 77.1940 },

  { id: 'panchsheel-park', name: 'Panchsheel Park', area: 'South Delhi', city: 'Delhi', popularFor: 'Premium Residential Living & Restaurants', latitude: 28.5420, longitude: 77.2180 },

  { id: 'defence-colony', name: 'Defence Colony', area: 'South Delhi', city: 'Delhi', popularFor: 'Premium Restaurants, Cafes & Shopping', latitude: 28.5740, longitude: 77.2320 },

  { id: 'lajpat-nagar', name: 'Lajpat Nagar', area: 'South Delhi', city: 'Delhi', popularFor: 'Street Shopping, Food & Markets', latitude: 28.5677, longitude: 77.2430 },

  { id: 'lajpat-nagar-central-market', name: 'Lajpat Nagar Central Market', area: 'South Delhi', city: 'Delhi', popularFor: 'Clothes, Street Food & Shopping', latitude: 28.5700, longitude: 77.2430 },

  { id: 'amar-colony', name: 'Amar Colony', area: 'South Delhi', city: 'Delhi', popularFor: 'Street Food, Cafes & Shopping', latitude: 28.5660, longitude: 77.2450 },

  { id: 'moolchand', name: 'Moolchand', area: 'South Delhi', city: 'Delhi', popularFor: 'Food, Hospitals & Shopping', latitude: 28.5640, longitude: 77.2340 },


  // =========================
  // SOUTH-WEST DELHI
  // =========================

  { id: 'vasant-kunj', name: 'Vasant Kunj', area: 'South West Delhi', city: 'Delhi', popularFor: 'Malls, Restaurants & Premium Living', latitude: 28.5420, longitude: 77.1550 },

  { id: 'vasant-vihar', name: 'Vasant Vihar', area: 'South West Delhi', city: 'Delhi', popularFor: 'Premium Shopping, Restaurants & Cafes', latitude: 28.5600, longitude: 77.1600 },

  { id: 'munirka', name: 'Munirka', area: 'South West Delhi', city: 'Delhi', popularFor: 'Student PGs, Food & Local Markets', latitude: 28.5570, longitude: 77.1740 },

  { id: 'r-k-puram', name: 'R.K. Puram', area: 'South West Delhi', city: 'Delhi', popularFor: 'Residential Areas, Markets & Food', latitude: 28.5670, longitude: 77.1730 },

  { id: 'ber-sarai', name: 'Ber Sarai', area: 'South Delhi', city: 'Delhi', popularFor: 'Student PGs, Cafes & Affordable Food', latitude: 28.5470, longitude: 77.1860 },

  { id: 'katwaria-sarai', name: 'Katwaria Sarai', area: 'South Delhi', city: 'Delhi', popularFor: 'Student PGs, Hostels & Affordable Food', latitude: 28.5450, longitude: 77.1880 },

  { id: 'mehrauli', name: 'Mehrauli', area: 'South Delhi', city: 'Delhi', popularFor: 'Heritage, Forts & Local Food', latitude: 28.5196, longitude: 77.1780 },

  { id: 'chhatarpur', name: 'Chhatarpur', area: 'South Delhi', city: 'Delhi', popularFor: 'Temples, Farmhouses & Restaurants', latitude: 28.5060, longitude: 77.1750 },

  { id: 'sultanpur', name: 'Sultanpur', area: 'South Delhi', city: 'Delhi', popularFor: 'Residential Areas, Markets & Local Food', latitude: 28.4990, longitude: 77.1620 },


  // =========================
  // NORTH DELHI
  // =========================

  { id: 'majnu-ka-tilla', name: 'Majnu Ka Tilla', area: 'North Delhi', city: 'Delhi', popularFor: 'Tibetan Cafes, Momos & Backpacker Culture', latitude: 28.7041, longitude: 77.2273 },

  { id: 'civil-lines', name: 'Civil Lines', area: 'North Delhi', city: 'Delhi', popularFor: 'Historic Buildings, Cafes & Residential Living', latitude: 28.6760, longitude: 77.2250 },

  { id: 'kamla-nagar', name: 'Kamla Nagar', area: 'North Delhi', city: 'Delhi', popularFor: 'Student Life, Shopping & Street Food', latitude: 28.6800, longitude: 77.2020 },

  { id: 'vijay-nagar', name: 'Vijay Nagar', area: 'North Delhi', city: 'Delhi', popularFor: 'Student PGs, Cafes & Affordable Food', latitude: 28.6960, longitude: 77.2040 },

  { id: 'hudson-lane', name: 'Hudson Lane', area: 'North Delhi', city: 'Delhi', popularFor: 'Student Cafes, Food & Nightlife', latitude: 28.6940, longitude: 77.2050 },

  { id: 'gtb-nagar', name: 'GTB Nagar', area: 'North Delhi', city: 'Delhi', popularFor: 'Student Cafes, PGs & Food', latitude: 28.6980, longitude: 77.2070 },

  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar', area: 'North Delhi', city: 'Delhi', popularFor: 'Student PGs & Competitive Exam Coaching', latitude: 28.7118, longitude: 77.2096 },

  { id: 'kamla-nagar-market', name: 'Kamla Nagar Market', area: 'North Delhi', city: 'Delhi', popularFor: 'Shopping, Street Food & Student Hangouts', latitude: 28.6800, longitude: 77.2040 },

  { id: 'model-town', name: 'Model Town', area: 'North Delhi', city: 'Delhi', popularFor: 'Residential Living, Restaurants & Parks', latitude: 28.7170, longitude: 77.1910 },

  { id: 'ashok-vihar', name: 'Ashok Vihar', area: 'North West Delhi', city: 'Delhi', popularFor: 'Residential Living, Markets & Restaurants', latitude: 28.6900, longitude: 77.1750 },

  { id: 'shalimar-bagh', name: 'Shalimar Bagh', area: 'North West Delhi', city: 'Delhi', popularFor: 'Residential Areas, Markets & Food', latitude: 28.7160, longitude: 77.1580 },

  { id: 'pitampura', name: 'Pitampura', area: 'North West Delhi', city: 'Delhi', popularFor: 'Shopping, Restaurants & Residential Living', latitude: 28.7030, longitude: 77.1320 },

  { id: 'rohini', name: 'Rohini', area: 'North West Delhi', city: 'Delhi', popularFor: 'Malls, Restaurants, Parks & Shopping', latitude: 28.7495, longitude: 77.0565 },

  { id: 'prashant-vihar', name: 'Prashant Vihar', area: 'North West Delhi', city: 'Delhi', popularFor: 'Restaurants, Cafes & Residential Living', latitude: 28.7180, longitude: 77.1280 },

  { id: 'burari', name: 'Burari', area: 'North Delhi', city: 'Delhi', popularFor: 'Residential Areas, Local Markets & Food', latitude: 28.7550, longitude: 77.2000 },


  // =========================
  // WEST DELHI
  // =========================

  { id: 'rajouri-garden', name: 'Rajouri Garden', area: 'West Delhi', city: 'Delhi', popularFor: 'Shopping, Restaurants & Nightlife', latitude: 28.6415, longitude: 77.1220 },

  { id: 'punjabi-bagh', name: 'Punjabi Bagh', area: 'West Delhi', city: 'Delhi', popularFor: 'Restaurants, Cafes & Nightlife', latitude: 28.6680, longitude: 77.1320 },

  { id: 'paschim-vihar', name: 'Paschim Vihar', area: 'West Delhi', city: 'Delhi', popularFor: 'Residential Living, Food & Shopping', latitude: 28.6700, longitude: 77.1000 },

  { id: 'janakpuri', name: 'Janakpuri', area: 'West Delhi', city: 'Delhi', popularFor: 'Shopping, Food & Residential Living', latitude: 28.6219, longitude: 77.0878 },

  { id: 'tilak-nagar', name: 'Tilak Nagar', area: 'West Delhi', city: 'Delhi', popularFor: 'Shopping, Street Food & Local Markets', latitude: 28.6360, longitude: 77.0960 },

  { id: 'subhash-nagar', name: 'Subhash Nagar', area: 'West Delhi', city: 'Delhi', popularFor: 'Pacific Mall, Food & Entertainment', latitude: 28.6410, longitude: 77.1040 },

  { id: 'tagore-garden', name: 'Tagore Garden', area: 'West Delhi', city: 'Delhi', popularFor: 'Shopping, Restaurants & Residential Living', latitude: 28.6420, longitude: 77.1120 },

  { id: 'vikaspuri', name: 'Vikaspuri', area: 'West Delhi', city: 'Delhi', popularFor: 'Residential Living, Shopping & Food', latitude: 28.6380, longitude: 77.0730 },

  { id: 'dwarka', name: 'Dwarka', area: 'South West Delhi', city: 'Delhi', popularFor: 'Residential Living, Malls, Food & Parks', latitude: 28.5921, longitude: 77.0460 },

  { id: 'dwarka-sector-10', name: 'Dwarka Sector 10', area: 'South West Delhi', city: 'Delhi', popularFor: 'Markets, Restaurants & Local Services', latitude: 28.5780, longitude: 77.0570 },

  { id: 'dwarka-sector-12', name: 'Dwarka Sector 12', area: 'South West Delhi', city: 'Delhi', popularFor: 'Shopping, Restaurants & Residential Living', latitude: 28.5920, longitude: 77.0400 },

  { id: 'dwarka-sector-21', name: 'Dwarka Sector 21', area: 'South West Delhi', city: 'Delhi', popularFor: 'Metro Connectivity, Shopping & Airport Access', latitude: 28.5520, longitude: 77.0580 },


  // =========================
  // EAST DELHI
  // =========================

  { id: 'laxmi-nagar', name: 'Laxmi Nagar', area: 'East Delhi', city: 'Delhi', popularFor: 'Student PGs, Coaching & Shopping', latitude: 28.6300, longitude: 77.2770 },

  { id: 'preet-vihar', name: 'Preet Vihar', area: 'East Delhi', city: 'Delhi', popularFor: 'Restaurants, Shopping & Residential Living', latitude: 28.6420, longitude: 77.2940 },

  { id: 'nirman-vihar', name: 'Nirman Vihar', area: 'East Delhi', city: 'Delhi', popularFor: 'Markets, Food & Student Living', latitude: 28.6360, longitude: 77.2860 },

  { id: 'shakarpur', name: 'Shakarpur', area: 'East Delhi', city: 'Delhi', popularFor: 'Affordable Housing, PGs & Local Food', latitude: 28.6290, longitude: 77.2830 },

  { id: 'mayur-vihar', name: 'Mayur Vihar', area: 'East Delhi', city: 'Delhi', popularFor: 'Residential Living, Markets & Restaurants', latitude: 28.6080, longitude: 77.2950 },

  { id: 'patparganj', name: 'Patparganj', area: 'East Delhi', city: 'Delhi', popularFor: 'Residential Living, Schools & Local Markets', latitude: 28.6200, longitude: 77.3000 },

  { id: 'anand-vihar', name: 'Anand Vihar', area: 'East Delhi', city: 'Delhi', popularFor: 'Transport Hub, Hotels & Shopping', latitude: 28.6469, longitude: 77.3160 },

  { id: 'vivek-vihar', name: 'Vivek Vihar', area: 'East Delhi', city: 'Delhi', popularFor: 'Restaurants, Shopping & Residential Living', latitude: 28.6710, longitude: 77.3180 },

  { id: 'krishna-nagar', name: 'Krishna Nagar', area: 'East Delhi', city: 'Delhi', popularFor: 'Shopping, Food & Residential Living', latitude: 28.6560, longitude: 77.2880 },

  { id: 'preet-vihar-market', name: 'Preet Vihar Market', area: 'East Delhi', city: 'Delhi', popularFor: 'Shopping, Food & Local Services', latitude: 28.6420, longitude: 77.2940 },


  // =========================
  // SOUTH-EAST DELHI
  // =========================

  { id: 'jamia-nagar', name: 'Jamia Nagar', area: 'South East Delhi', city: 'Delhi', popularFor: 'Street Food, Markets & Student Living', latitude: 28.5610, longitude: 77.2910 },

  { id: 'okhla', name: 'Okhla', area: 'South East Delhi', city: 'Delhi', popularFor: 'Industrial Areas, Food & Shopping', latitude: 28.5350, longitude: 77.2730 },

  { id: 'new-friends-colony', name: 'New Friends Colony', area: 'South East Delhi', city: 'Delhi', popularFor: 'Restaurants, Cafes & Premium Living', latitude: 28.5680, longitude: 77.2670 },

  { id: 'kalindi-kunj', name: 'Kalindi Kunj', area: 'South East Delhi', city: 'Delhi', popularFor: 'Parks, Riverfront & Local Markets', latitude: 28.5460, longitude: 77.3090 },

  { id: 'sarita-vihar', name: 'Sarita Vihar', area: 'South East Delhi', city: 'Delhi', popularFor: 'Residential Living, Food & Shopping', latitude: 28.5300, longitude: 77.2950 },

  { id: 'jasola', name: 'Jasola', area: 'South East Delhi', city: 'Delhi', popularFor: 'Malls, Offices & Restaurants', latitude: 28.5400, longitude: 77.2910 },

  { id: 'badarpur', name: 'Badarpur', area: 'South East Delhi', city: 'Delhi', popularFor: 'Local Markets, Food & Transport', latitude: 28.5030, longitude: 77.3030 },


  // =========================
  // HERITAGE & TOURIST AREAS
  // =========================

  { id: 'qutub-minar', name: 'Qutub Minar', area: 'South Delhi', city: 'Delhi', popularFor: 'UNESCO Heritage & Historical Tourism', latitude: 28.5244, longitude: 77.1855 },

  { id: 'humayuns-tomb', name: 'Humayun’s Tomb', area: 'South East Delhi', city: 'Delhi', popularFor: 'Mughal Architecture & Heritage', latitude: 28.5933, longitude: 77.2507 },

  { id: 'purana-qila', name: 'Purana Qila', area: 'Central Delhi', city: 'Delhi', popularFor: 'Fort, History & Architecture', latitude: 28.6096, longitude: 77.2430 },

  { id: 'safdarjung-tomb', name: 'Safdarjung Tomb', area: 'South Delhi', city: 'Delhi', popularFor: 'Mughal Architecture & Photography', latitude: 28.5893, longitude: 77.2110 },

  { id: 'lodhi-garden', name: 'Lodhi Garden', area: 'Central Delhi', city: 'Delhi', popularFor: 'Heritage, Walking & Photography', latitude: 28.5933, longitude: 77.2197 },

  { id: 'agrassen-ki-baoli', name: 'Agrasen Ki Baoli', area: 'Central Delhi', city: 'Delhi', popularFor: 'Historic Architecture & Photography', latitude: 28.6260, longitude: 77.2250 },

  { id: 'lotus-temple', name: 'Lotus Temple', area: 'South Delhi', city: 'Delhi', popularFor: 'Architecture, Peace & Tourism', latitude: 28.5535, longitude: 77.2588 },

  { id: 'akshardham', name: 'Akshardham', area: 'East Delhi', city: 'Delhi', popularFor: 'Temple Architecture & Cultural Tourism', latitude: 28.6127, longitude: 77.2773 },

  { id: 'gurudwara-bangla-sahib', name: 'Gurudwara Bangla Sahib', area: 'Central Delhi', city: 'Delhi', popularFor: 'Religious Tourism & Heritage', latitude: 28.6264, longitude: 77.2090 },

  { id: 'iskcon-temple', name: 'ISKCON Temple Delhi', area: 'South Delhi', city: 'Delhi', popularFor: 'Spirituality, Culture & Vegetarian Food', latitude: 28.5538, longitude: 77.2510 },


  // =========================
  // MARKETS & SHOPPING HUBS
  // =========================

  { id: 'sarojini-nagar', name: 'Sarojini Nagar', area: 'South West Delhi', city: 'Delhi', popularFor: 'Affordable Fashion & Street Shopping', latitude: 28.5765, longitude: 77.1960 },

  { id: 'lajpat-nagar-market', name: 'Lajpat Nagar Market', area: 'South Delhi', city: 'Delhi', popularFor: 'Fashion, Accessories & Street Food', latitude: 28.5700, longitude: 77.2430 },

  { id: 'janpath-market', name: 'Janpath Market', area: 'Central Delhi', city: 'Delhi', popularFor: 'Handicrafts, Clothes & Souvenirs', latitude: 28.6270, longitude: 77.2190 },

  { id: 'palika-bazaar', name: 'Palika Bazaar', area: 'Central Delhi', city: 'Delhi', popularFor: 'Affordable Shopping & Electronics', latitude: 28.6328, longitude: 77.2185 },

  { id: 'gandhi-nagar-market', name: 'Gandhi Nagar Market', area: 'East Delhi', city: 'Delhi', popularFor: 'Wholesale Clothes & Garments', latitude: 28.6600, longitude: 77.2620 },

  { id: 'tilak-nagar-market', name: 'Tilak Nagar Market', area: 'West Delhi', city: 'Delhi', popularFor: 'Clothes, Jewellery & Street Shopping', latitude: 28.6360, longitude: 77.0960 },

  { id: 'sadar-bazaar', name: 'Sadar Bazaar', area: 'Central Delhi', city: 'Delhi', popularFor: 'Wholesale Shopping & Affordable Goods', latitude: 28.6570, longitude: 77.2100 },

  { id: 'nehru-place-market', name: 'Nehru Place Market', area: 'South Delhi', city: 'Delhi', popularFor: 'Laptops, Electronics & Computer Accessories', latitude: 28.5492, longitude: 77.2529 },

  { id: 'bhagirath-palace', name: 'Bhagirath Palace', area: 'Old Delhi', city: 'Delhi', popularFor: 'Electrical Goods & Electronics', latitude: 28.6550, longitude: 77.2310 },

  { id: 'khan-market-area', name: 'Khan Market Area', area: 'Central Delhi', city: 'Delhi', popularFor: 'Books, Fashion & Premium Dining', latitude: 28.6003, longitude: 77.2272 },


  // =========================
  // PARKS & RECREATION
  // =========================

  { id: 'nehru-park', name: 'Nehru Park', area: 'South Delhi', city: 'Delhi', popularFor: 'Morning Walks, Picnics & Events', latitude: 28.5910, longitude: 77.1990 },

  { id: 'deer-park', name: 'Deer Park', area: 'South Delhi', city: 'Delhi', popularFor: 'Nature, Walking & Photography', latitude: 28.5540, longitude: 77.1950 },

  { id: 'sanjay-van', name: 'Sanjay Van', area: 'South Delhi', city: 'Delhi', popularFor: 'Nature Trails, Photography & Birdwatching', latitude: 28.5220, longitude: 77.1650 },

  { id: 'jahanpanah-city-forest', name: 'Jahanpanah City Forest', area: 'South Delhi', city: 'Delhi', popularFor: 'Nature Walks, Cycling & Photography', latitude: 28.5140, longitude: 77.2250 },

  { id: 'garden-of-five-senses', name: 'Garden of Five Senses', area: 'South Delhi', city: 'Delhi', popularFor: 'Nature, Couples & Photography', latitude: 28.5130, longitude: 77.2050 },

  { id: 'japanese-park', name: 'Japanese Park', area: 'Rohini', city: 'Delhi', popularFor: 'Picnics, Walking & Family Outings', latitude: 28.7280, longitude: 77.1160 },

  { id: 'millennium-park', name: 'Millennium Park', area: 'East Delhi', city: 'Delhi', popularFor: 'Riverfront Walks & Family Outings', latitude: 28.6150, longitude: 77.2550 },


  // =========================
  // FOOD & NIGHTLIFE HUBS
  // =========================

  { id: 'dhabas-delhi-gate', name: 'Delhi Gate Food Area', area: 'Central Delhi', city: 'Delhi', popularFor: 'Traditional Food & Local Dhabas', latitude: 28.6420, longitude: 77.2380 },

  { id: 'amar-colony-food', name: 'Amar Colony Food Street', area: 'South Delhi', city: 'Delhi', popularFor: 'Street Food & Cafes', latitude: 28.5660, longitude: 77.2450 },

  { id: 'champa-gali', name: 'Champa Gali', area: 'South Delhi', city: 'Delhi', popularFor: 'Aesthetic Cafes, Boutiques & Date Spots', latitude: 28.5240, longitude: 77.2060 },

  { id: 'satya-niketan', name: 'Satya Niketan', area: 'South Delhi', city: 'Delhi', popularFor: 'Student Cafes, Food & Hangouts', latitude: 28.5870, longitude: 77.1680 },

  { id: 'rajouri-garden-food', name: 'Rajouri Garden Food Hub', area: 'West Delhi', city: 'Delhi', popularFor: 'Restaurants, Cafes & Nightlife', latitude: 28.6415, longitude: 77.1220 },

  { id: 'hauz-khas-nightlife', name: 'Hauz Khas Nightlife District', area: 'South Delhi', city: 'Delhi', popularFor: 'Bars, Clubs, Cafes & Nightlife', latitude: 28.5494, longitude: 77.1932 },

  { id: 'cp-nightlife', name: 'Connaught Place Nightlife', area: 'Central Delhi', city: 'Delhi', popularFor: 'Pubs, Clubs, Rooftops & Restaurants', latitude: 28.6304, longitude: 77.2197 },

];

export const SUPPORTED_CITIES = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi', active: true, tag: 'Primary Hub' },
  { id: 'gurugram', name: 'Gurugram', state: 'Haryana', active: true, tag: 'NCR Expansion' },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh', active: true, tag: 'NCR Expansion' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', active: false, tag: 'Coming Soon' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', active: false, tag: 'Coming Soon' },
];
