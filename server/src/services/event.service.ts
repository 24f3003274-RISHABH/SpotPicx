import mongoose from 'mongoose';
import { Event, IEvent, EventCategoryType } from '../models/Event';
import { dbConnection } from '../config/db';

export interface InMemoryEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  category: string;
  venue: string;
  location: {
    address: string;
    locality: string;
    city: string;
    coordinates?: [number, number];
  };
  startDate: string;
  endDate: string;
  ticketPrice: string | number;
  bookingUrl: string;
  organizer: string;
  tags: string[];
  featured: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

const now = new Date();
const getFutureDate = (days: number, hour = 18, minute = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const SEED_EVENTS: InMemoryEvent[] = [
  {
    _id: 'evt_1',
    title: 'Delhi Indie Music & Sufi Fusion Fest',
    slug: 'delhi-indie-music-sufi-fusion-fest',
    description: 'An enchanting evening of contemporary acoustic indie sets, soulful Qawwali renditions, and live percussion by leading underground artists.',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    ],
    category: 'Concert',
    venue: 'JL Nehru Stadium Amphitheatre',
    location: {
      address: 'Gate 2, Pragati Vihar',
      locality: 'Pragati Vihar',
      city: 'Delhi',
      coordinates: [77.234, 28.583],
    },
    startDate: getFutureDate(1, 18, 30),
    endDate: getFutureDate(1, 23, 0),
    ticketPrice: '₹499',
    bookingUrl: 'https://insider.in/demo-event',
    organizer: 'Delhi Live Arts Guild',
    tags: ['live-music', 'sufi', 'outdoor', 'evening', 'student-friendly'],
    featured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_2',
    title: 'Old Delhi Chaat & Street Food Carnival 2026',
    slug: 'old-delhi-chaat-street-food-carnival-2026',
    description: 'Over 40 iconic culinary stalls from Chandni Chowk, Jama Masjid, and Chawri Bazar serving authentic Daulat ki Chaat, Natraj Dahi Bhalle, and hot Jalebis.',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    ],
    category: 'Food Festival',
    venue: 'Major Dhyan Chand National Stadium',
    location: {
      address: 'India Gate Circle, Central Delhi',
      locality: 'Connaught Place',
      city: 'Delhi',
      coordinates: [77.236, 28.614],
    },
    startDate: getFutureDate(2, 12, 0),
    endDate: getFutureDate(4, 22, 0),
    ticketPrice: 'Free Entry',
    bookingUrl: 'https://spotpicks.demo/food-carnival',
    organizer: 'Delhi Tourism & Heritage Food Forum',
    tags: ['street-food', 'family-dining', 'chandni-chowk', 'budget-friendly'],
    featured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_3',
    title: 'Delhi Stand-up Comedy Showcase: Late Night Laughs',
    slug: 'delhi-standup-comedy-showcase-late-night-laughs',
    description: 'Top circuit comedians from Delhi NCR perform their freshest standup bits. Hilarious take on metro commutes, college dating, and NCR roommate drama.',
    images: [
      'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    ],
    category: 'Comedy',
    venue: 'The Laugh Club Cafe & Stage',
    location: {
      address: 'M-Block Market, Greater Kailash 2',
      locality: 'Greater Kailash',
      city: 'Delhi',
      coordinates: [77.242, 28.535],
    },
    startDate: getFutureDate(0, 20, 0), // Today!
    endDate: getFutureDate(0, 22, 0),
    ticketPrice: '₹349',
    bookingUrl: 'https://bookmyshow.demo/comedy-delhi',
    organizer: 'NCR Comedy Collective',
    tags: ['comedy', 'nightlife', 'friends', 'couples'],
    featured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_4',
    title: 'NCR GenAI & Full-Stack Hackathon 2026',
    slug: 'ncr-genai-fullstack-hackathon-2026',
    description: 'A 36-hour sprint for student builders and developers creating localized AI utilities for Delhi public transport, campus hubs, and civic amenities. Cash pool ₹3,00,000.',
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    ],
    category: 'Hackathon',
    venue: 'IIIT Delhi Innovation Center',
    location: {
      address: 'Okhla Phase III, Near Govind Puri Metro',
      locality: 'Saket',
      city: 'Delhi',
      coordinates: [77.271, 28.544],
    },
    startDate: getFutureDate(5, 9, 0),
    endDate: getFutureDate(6, 20, 0),
    ticketPrice: 'Free Entry',
    bookingUrl: 'https://unstop.demo/ncr-hackathon',
    organizer: 'Delhi Tech Student Network & Google Developers Group',
    tags: ['hackathon', 'tech', 'student-friendly', 'internships', 'coding'],
    featured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_5',
    title: 'Hauz Khas Heritage Walk & Smartphone Photography Workshop',
    slug: 'hauz-khas-heritage-walk-smartphone-photography-workshop',
    description: 'Guided architectural walk covering the 13th-century Madrassa, lake pavilions, and Firoz Shah tomb, followed by hands-on visual framing and Lightroom masterclass.',
    images: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ],
    category: 'Workshop',
    venue: 'Hauz Khas Monument Complex',
    location: {
      address: 'Deer Park Entrance, Hauz Khas Village',
      locality: 'Hauz Khas Village',
      city: 'Delhi',
      coordinates: [77.193, 28.552],
    },
    startDate: getFutureDate(3, 7, 30),
    endDate: getFutureDate(3, 11, 0),
    ticketPrice: '₹600',
    bookingUrl: 'https://spotpicks.demo/heritage-walk',
    organizer: 'Delhi Heritage Explorers',
    tags: ['heritage', 'workshop', 'photography', 'solo', 'morning'],
    featured: false,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_6',
    title: 'Startup Founders & Angels Mixer: NCR Tech Hub',
    slug: 'startup-founders-angels-mixer-ncr-tech-hub',
    description: 'Connect with 150+ bootstrapped and seed-stage founders, angel investors, and product designers. Pitch sessions, 1-on-1 networking, and high tea.',
    images: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
    ],
    category: 'Startup',
    venue: 'Innov8 Coworking Hub',
    location: {
      address: 'Regal Building, 69 Connaught Place',
      locality: 'Connaught Place',
      city: 'Delhi',
      coordinates: [77.218, 28.631],
    },
    startDate: getFutureDate(4, 17, 0),
    endDate: getFutureDate(4, 20, 30),
    ticketPrice: '₹750',
    bookingUrl: 'https://townscript.demo/founders-mixer',
    organizer: 'Delhi NCR Angels Network',
    tags: ['startup', 'tech', 'networking', 'entrepreneurship'],
    featured: false,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_7',
    title: 'Shri Ram Centre Theatre Festival: Andha Yug',
    slug: 'shri-ram-centre-theatre-festival-andha-yug',
    description: 'A celebrated stage adaptation of Dharamvir Bharati classic play exploring the devastating aftermath of Kurukshetra, performed by veteran NSD alumni.',
    images: [
      'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=800',
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    ],
    category: 'Theatre',
    venue: 'Shri Ram Centre for Performing Arts',
    location: {
      address: '4 Safdar Hashmi Marg, Mandi House',
      locality: 'Connaught Place',
      city: 'Delhi',
      coordinates: [77.234, 28.625],
    },
    startDate: getFutureDate(6, 19, 0),
    endDate: getFutureDate(6, 21, 30),
    ticketPrice: '₹250',
    bookingUrl: 'https://bookmyshow.demo/src-theatre',
    organizer: 'National School of Drama Ensemble',
    tags: ['theatre', 'cultural', 'heritage', 'student-friendly'],
    featured: false,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_8',
    title: 'Dilli Haat Spring Crafts & Handloom Mela',
    slug: 'dilli-haat-spring-crafts-handloom-mela',
    description: 'National artisan exhibition featuring Kashmiri Pashmina weavers, Rajasthani blue pottery, Madhubani painters, and regional food stalls from 22 states.',
    images: [
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    ],
    category: 'Cultural',
    venue: 'Dilli Haat INA',
    location: {
      address: 'Kidwai Nagar West, Opposite INA Market',
      locality: 'South Extension',
      city: 'Delhi',
      coordinates: [77.208, 28.573],
    },
    startDate: getFutureDate(2, 10, 30),
    endDate: getFutureDate(10, 22, 0),
    ticketPrice: '₹30',
    bookingUrl: 'https://delhitourism.demo/dilli-haat',
    organizer: 'Ministry of Textiles & DTTDC',
    tags: ['cultural', 'handicrafts', 'family-dining', 'budget-friendly'],
    featured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const inMemoryEvents: Map<string, InMemoryEvent> = new Map();
SEED_EVENTS.forEach((evt) => inMemoryEvents.set(evt._id, evt));

export interface EventFilterParams {
  category?: string;
  timeframe?: 'today' | 'tomorrow' | 'weekend' | 'month' | 'all';
  price?: 'free' | 'paid' | 'all';
  locality?: string;
  query?: string;
  tag?: string;
  status?: string;
  limit?: number;
  page?: number;
}

export class EventService {
  /**
   * List events with rich filtering
   */
  public static async getEvents(params: EventFilterParams = {}) {
    const {
      category,
      timeframe = 'all',
      price = 'all',
      locality,
      query,
      tag,
      status = 'UPCOMING',
      limit = 20,
      page = 1,
    } = params;

    const filterFn = (e: InMemoryEvent) => {
      if (status && status !== 'ALL' && e.status !== status) return false;

      if (category && category !== 'all' && category.toLowerCase() !== 'all') {
        const catMatch = e.category.toLowerCase() === category.toLowerCase();
        if (!catMatch) return false;
      }

      if (locality && locality !== 'all') {
        const locMatch =
          e.location.locality.toLowerCase().includes(locality.toLowerCase()) ||
          e.venue.toLowerCase().includes(locality.toLowerCase());
        if (!locMatch) return false;
      }

      if (price === 'free') {
        const isFree =
          String(e.ticketPrice).toLowerCase().includes('free') ||
          Number(e.ticketPrice) === 0;
        if (!isFree) return false;
      } else if (price === 'paid') {
        const isFree =
          String(e.ticketPrice).toLowerCase().includes('free') ||
          Number(e.ticketPrice) === 0;
        if (isFree) return false;
      }

      if (tag) {
        if (!e.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      }

      if (query) {
        const q = query.toLowerCase();
        const textMatch =
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q);
        if (!textMatch) return false;
      }

      // Timeframe logic
      const eventStart = new Date(e.startDate);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);

      const tomorrowEnd = new Date(todayEnd);
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

      if (timeframe === 'today') {
        return eventStart >= todayStart && eventStart <= todayEnd;
      } else if (timeframe === 'tomorrow') {
        return eventStart >= tomorrowStart && eventStart <= tomorrowEnd;
      } else if (timeframe === 'weekend') {
        const currentDay = todayStart.getDay(); // 0 is Sunday, 6 is Saturday
        const distToSat = (6 - currentDay + 7) % 7;
        const satStart = new Date(todayStart);
        satStart.setDate(satStart.getDate() + distToSat);

        const sunEnd = new Date(satStart);
        sunEnd.setDate(sunEnd.getDate() + 1);
        sunEnd.setHours(23, 59, 59, 999);

        return eventStart >= todayStart && eventStart <= sunEnd;
      } else if (timeframe === 'month') {
        const endOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0, 23, 59, 59);
        return eventStart >= todayStart && eventStart <= endOfMonth;
      }

      return true;
    };

    if (dbConnection.getStatus().isConnected) {
      try {
        const mongoQuery: any = {};
        if (status && status !== 'ALL') mongoQuery.status = status;
        if (category && category !== 'all') mongoQuery.category = new RegExp(category, 'i');
        if (locality && locality !== 'all') mongoQuery['location.locality'] = new RegExp(locality, 'i');
        if (tag) mongoQuery.tags = tag;
        if (query) {
          mongoQuery.$or = [
            { title: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') },
            { venue: new RegExp(query, 'i') },
          ];
        }

        const events = await Event.find(mongoQuery)
          .sort({ startDate: 1 })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean();

        if (events && events.length > 0) {
          return {
            events,
            total: await Event.countDocuments(mongoQuery),
            page,
            limit,
          };
        }
      } catch (err) {
        console.warn('MongoDB Event query fallback to memory:', err);
      }
    }

    // In-memory filter
    const all = Array.from(inMemoryEvents.values()).sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    const filtered = all.filter(filterFn);
    const startIdx = (page - 1) * limit;
    const paginated = filtered.slice(startIdx, startIdx + limit);

    return {
      events: paginated,
      total: filtered.length,
      page,
      limit,
    };
  }

  /**
   * Get single event by slug or ID
   */
  public static async getEventBySlug(slugOrId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        let evt = null;
        if (mongoose.Types.ObjectId.isValid(slugOrId)) {
          evt = await Event.findById(slugOrId).lean();
        }
        if (!evt) {
          evt = await Event.findOne({ slug: slugOrId }).lean();
        }
        if (evt) return evt;
      } catch (err) {
        console.warn('MongoDB single event fallback:', err);
      }
    }

    return (
      inMemoryEvents.get(slugOrId) ||
      Array.from(inMemoryEvents.values()).find((e) => e.slug === slugOrId) ||
      null
    );
  }

  /**
   * Admin Create Event
   */
  public static async createEvent(data: Partial<InMemoryEvent>) {
    const slug = (data.title || 'event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (dbConnection.getStatus().isConnected) {
      const created = await Event.create({
        ...data,
        slug,
      });
      return created.toObject();
    }

    const _id = `evt_${Date.now()}`;
    const newEvent: InMemoryEvent = {
      _id,
      title: data.title || 'Untitled Event',
      slug,
      description: data.description || '',
      images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
      category: data.category || 'Concert',
      venue: data.venue || 'Delhi Venue',
      location: data.location || { address: '', locality: 'Delhi NCR', city: 'Delhi' },
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date(Date.now() + 4 * 3600000).toISOString(),
      ticketPrice: data.ticketPrice || 'Free Entry',
      bookingUrl: data.bookingUrl || '',
      organizer: data.organizer || 'SpotPicks Organizer',
      tags: data.tags || [],
      featured: !!data.featured,
      status: data.status || 'UPCOMING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryEvents.set(_id, newEvent);
    return newEvent;
  }

  /**
   * Delete Event
   */
  public static async deleteEvent(id: string) {
    if (dbConnection.getStatus().isConnected) {
      await Event.findByIdAndDelete(id);
      return true;
    }
    inMemoryEvents.delete(id);
    return true;
  }
}
