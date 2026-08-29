import {
  Crown,
  Landmark,
  Building2,
  Sparkles,
  Award,
  BookOpen,
  Castle,
  Shield,
  Layers,
  ShoppingBag,
  Home,
  Sun,
  Eye,
  LucideIcon,
} from 'lucide-react';
import { HeritageCategory } from '../../types/delhiHeritage.types';

export interface CategoryMetadata {
  id: HeritageCategory;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  iconName: string;
  era: string;
  prominentKeywords: string[];
}

export const DELHI_HERITAGE_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'Mughal Heritage',
    slug: 'mughal-heritage',
    name: 'Mughal Heritage',
    tagline: 'Imperial Charbaghs, Red Sandstone & Marble Splendors (1526–1857 CE)',
    description:
      'From the grand garden tomb of Humayun to the imposing sandstone bastions of the Red Fort and Safdarjung’s garden palace, Delhi preserves the pinnacle of Mughal architectural evolution and Persian-influenced landscaping.',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Crown',
    era: '16th – 19th Century CE',
    prominentKeywords: ['Charbagh', 'Pietra Dura', 'Red Sandstone', 'Jali Screen', 'Jahanpanah', 'Shahjahanabad'],
  },
  {
    id: 'Sultanate Architecture',
    slug: 'sultanate-architecture',
    name: 'Sultanate Architecture',
    tagline: 'Mamluk, Khalji, Tughlaq, Sayyid & Lodi Monumental Legacy (1192–1526 CE)',
    description:
      'Spanning over three centuries across five dynasties, Delhi Sultanate architecture introduced pointed arches, domes, corbelled squinches, and rugged fortress masonry across Mehrauli, Hauz Khas, and Tughlaqabad.',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Landmark',
    era: '12th – 16th Century CE',
    prominentKeywords: ['Qutb Complex', 'Sloping Walls', 'Corbelled Arches', 'Tughlaqabad', 'Hauz Khas Madrasa'],
  },
  {
    id: 'British-era Delhi',
    slug: 'british-era-delhi',
    name: 'British-era Delhi',
    tagline: 'Imperial Central Vista, Edwardian Classical & Colonial Enclaves (1803–1947 CE)',
    description:
      'The transition of British power from the 1857 siege of Kashmere Gate and the Northern Ridge to the monumental symmetry of Edwin Lutyens and Herbert Baker’s Imperial New Delhi (Raisina Hill, India Gate, and Connaught Place).',
    heroImage: 'https://images.unsplash.com/photo-1585139097873-10e3ea6c65bb?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Building2',
    era: '19th – 20th Century CE',
    prominentKeywords: ['Central Vista', 'Lutyens Delhi', 'Kashmere Gate', 'Coronation Park', 'Rashtrapati Bhavan'],
  },
  {
    id: 'Ancient/Medieval Sites',
    slug: 'ancient-medieval-sites',
    name: 'Ancient & Medieval Sites',
    tagline: 'Indraprastha Foundations, Ashokan Inscriptions & Tomara Citadels (1000 BCE – 12th Century CE)',
    description:
      'Excavations at Purana Qila revealing Painted Grey Ware pottery, Ashokan minor rock edicts at East of Kailash, and Anangpal Tomar’s 11th-century Lal Kot ramparts define Delhi’s deepest antiquity.',
    heroImage: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Sparkles',
    era: '1000 BCE – 12th Century CE',
    prominentKeywords: ['Indraprastha', 'Ashokan Edict', 'Lal Kot', 'Anangpur Dam', 'Iron Pillar'],
  },
  {
    id: 'UNESCO-related heritage',
    slug: 'unesco-heritage',
    name: 'UNESCO World Heritage Sites',
    tagline: 'Globally Inscribed Masterpieces of Outstanding Universal Value',
    description:
      'Delhi is home to three designated UNESCO World Heritage Sites: the Qutb Complex (1993), Humayun’s Tomb (1993), and the Red Fort Complex (2007), showcasing the pinnacle of architectural mastery.',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Award',
    era: '12th – 17th Century CE',
    prominentKeywords: ['UNESCO World Heritage', 'Qutb Minar', 'Humayun Tomb', 'Red Fort', 'Global Significance'],
  },
  {
    id: 'Museums',
    slug: 'museums',
    name: 'Premier Museums & Galleries',
    tagline: 'Centuries of Antiquities, Harappan Artifacts & Modern Cultural Memory',
    description:
      'World-class preservation institutions housing ancient Harappan treasures, Mughal miniature paintings, royal railway heritage, modern art, and democratic history at the National Museum and Pradhanmantri Sangrahalaya.',
    heroImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
    iconName: 'BookOpen',
    era: 'Harappan Era – 21st Century',
    prominentKeywords: ['National Museum', 'Dancing Girl', 'Modern Art', 'Rail Museum', 'Sangrahalaya'],
  },
  {
    id: 'Tombs & Mausoleums',
    slug: 'tombs-and-mausoleums',
    name: 'Tombs & Mausoleums',
    tagline: 'Serene Octagonal Domes, Garden Sanctuaries & Royal Memorials',
    description:
      'From the octagonal Lodi-era tombs nestled in Lodhi Gardens to Isa Khan’s sunken tomb, Safdarjung’s garden tomb, and the secluded mausoleum of Razia Sultana in Old Delhi.',
    heroImage: 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Castle',
    era: '13th – 18th Century CE',
    prominentKeywords: ['Lodhi Gardens', 'Isa Khan Tomb', 'Safdarjung Tomb', 'Razia Sultan', 'Bara Gumbad'],
  },
  {
    id: 'Forts',
    slug: 'forts',
    name: 'Historic Forts & Citadels',
    tagline: 'Massive Stone Ramparts, Royal Citadels & Medieval Battlements',
    description:
      'Explore the fortresses of Delhi’s historical cities: the gigantic rubble masonry of Tughlaqabad, the riverside walls of Purana Qila, and the red sandstone fortifications of Lal Qila.',
    heroImage: 'https://images.unsplash.com/photo-1598598795009-f80c5072e661?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Shield',
    era: '11th – 17th Century CE',
    prominentKeywords: ['Tughlaqabad', 'Purana Qila', 'Lal Qila', 'Feroz Shah Kotla', 'Siri Fort'],
  },
  {
    id: 'Stepwells',
    slug: 'stepwells',
    name: 'Ancient Stepwells (Baolis)',
    tagline: 'Subterranean Water Architecture & Atmospheric Arcades',
    description:
      'Ancient hydro-engineering marvels that provided cool subterranean gathering spaces: Agrasen ki Baoli, Gandhak ki Baoli, Rajon ki Baoli, and the sacred waters of Nizamuddin Baoli.',
    heroImage: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Layers',
    era: '14th – 16th Century CE',
    prominentKeywords: ['Agrasen ki Baoli', 'Rajon ki Baoli', 'Subterranean', 'Hydro-architecture', 'Mehrauli Baoli'],
  },
  {
    id: 'Historic Markets',
    slug: 'historic-markets',
    name: 'Historic Bazaars & Markets',
    tagline: 'Century-Old Trading Alleys, Silversmith Lanes & Spice Markets',
    description:
      'Bustling commercial arteries laid out in the 17th century by Princess Jahanara: Chandni Chowk, Khari Baoli (Asia’s largest spice hub), Dariba Kalan (jewelers), and Nai Sarak booksellers.',
    heroImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    iconName: 'ShoppingBag',
    era: '1650 CE – Present',
    prominentKeywords: ['Chandni Chowk', 'Khari Baoli', 'Dariba Kalan', 'Spice Market', 'Kinari Bazaar'],
  },
  {
    id: 'Heritage Villages',
    slug: 'heritage-villages',
    name: 'Urban Heritage Villages',
    tagline: 'Medieval Settlements Reborn into Contemporary Cultural Hubs',
    description:
      'Historical urban villages enclosed within Delhi’s urban sprawl: Hauz Khas Village beside 14th-century madrasas, Mehrauli’s ancient lanes, Shahpur Jat within Siri’s ramparts, and Kotla Mubarakpur.',
    heroImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Home',
    era: '13th – 21st Century',
    prominentKeywords: ['Hauz Khas Village', 'Mehrauli Village', 'Shahpur Jat', 'Kotla Mubarakpur'],
  },
  {
    id: 'Religious Heritage',
    slug: 'religious-heritage',
    name: 'Sacred Religious Heritage',
    tagline: 'Sufi Dargahs, Historic Gurudwaras, Ancient Shrines & Temples',
    description:
      'Centuries of spiritual syncretism across Hazrat Nizamuddin Auliya Dargah, Gurudwara Bangla Sahib, Jama Masjid, ancient Kalkaji temple, St. James’ Church, and the Bahá’í Lotus Temple.',
    heroImage: 'https://images.unsplash.com/photo-1597044141240-ab270d44081c?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Sun',
    era: '13th – 20th Century CE',
    prominentKeywords: ['Nizamuddin Auliya', 'Bangla Sahib', 'Jama Masjid', 'Lotus Temple', 'Qawwali'],
  },
  {
    id: 'Hidden Historical Places',
    slug: 'hidden-historical-places',
    name: 'Hidden Historical Places',
    tagline: 'Lesser-Known Ruins, Forest Tombs & Overlooked Enclaves',
    description:
      'Unfrequented architectural wonders off the standard tourist trail: Jahaz Mahal in Mehrauli, Chauburji Mosque on the Ridge, Mirza Ghalib’s Haveli in Ballimaran, Zafar Mahal, and Wazirpur Gumbad.',
    heroImage: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Eye',
    era: '14th – 19th Century CE',
    prominentKeywords: ['Jahaz Mahal', 'Ghalib Haveli', 'Northern Ridge Ruins', 'Zafar Mahal', 'Off-beat Delhi'],
  },
];

export const HISTORIC_CITIES_OF_DELHI = [
  {
    number: 1,
    name: 'Indraprastha / Lal Kot & Qila Rai Pithora',
    founder: 'King Anangpal Tomar / Prithviraj Chauhan',
    period: '1000 BCE / 736 – 1192 CE',
    location: 'Mehrauli, Sanjay Van, Purana Qila',
    highlights: 'Lal Kot ramparts, Iron Pillar, Painted Grey Ware strata',
  },
  {
    number: 2,
    name: 'Mehrauli (First Delhi Sultanate City)',
    founder: 'Qutb-ud-din Aibak & Shamsuddin Iltutmish',
    period: '1192 – 1290 CE',
    location: 'Mehrauli Archaeological Park',
    highlights: 'Qutb Minar, Quwwat-ul-Islam Mosque, Gandhak ki Baoli',
  },
  {
    number: 3,
    name: 'Siri (Second City of Delhi)',
    founder: 'Alauddin Khalji',
    period: '1303 CE',
    location: 'Siri Fort, Shahpur Jat, Asian Games Village',
    highlights: 'Hauz Khas reservoir, Siri rubble walls, Chor Minar',
  },
  {
    number: 4,
    name: 'Tughlaqabad (Third City of Delhi)',
    founder: 'Ghiyas-ud-din Tughlaq',
    period: '1321 – 1325 CE',
    location: 'Southern Ridge, Mehrauli-Badarpur Road',
    highlights: 'Massive sloping battlements, Tomb of Ghiyas-ud-din, Adilabad',
  },
  {
    number: 5,
    name: 'Jahanpanah (Fourth City of Delhi)',
    founder: 'Muhammad bin Tughlaq',
    period: '1326 – 1351 CE',
    location: 'Enclosed space between Qila Rai Pithora and Siri',
    highlights: 'Bijay Mandal palace ruins, Begumpur Mosque, Serai Shahji',
  },
  {
    number: 6,
    name: 'Ferozabad (Fifth City of Delhi)',
    founder: 'Feroz Shah Tughlaq',
    period: '1354 – 1388 CE',
    location: 'Feroz Shah Kotla (Near Bahadur Shah Zafar Marg)',
    highlights: 'Ashokan Pillar of Topra, Jami Masjid, stepwell baoli',
  },
  {
    number: 7,
    name: 'Dinpanah & Shergarh (Sixth City of Delhi)',
    founder: 'Humayun & Sher Shah Suri',
    period: '1533 – 1545 CE',
    location: 'Purana Qila (Mathura Road)',
    highlights: 'Qila-i-Kuhna Mosque, Sher Mandal observatory, grand gateways',
  },
  {
    number: 8,
    name: 'Shahjahanabad (Seventh City of Delhi)',
    founder: 'Mughal Emperor Shah Jahan',
    period: '1638 – 1648 CE',
    location: 'Old Delhi / Chandni Chowk',
    highlights: 'Red Fort (Lal Qila), Jama Masjid, Chandni Chowk bazaars',
  },
  {
    number: 9,
    name: 'Lutyens’ New Delhi (Eighth City of Delhi)',
    founder: 'Edwin Lutyens, Herbert Baker & British Administration',
    period: '1911 – 1931 CE',
    location: 'Central Vista / Raisina Hill',
    highlights: 'Rashtrapati Bhavan, India Gate, North & South Blocks, Connaught Place',
  },
];
