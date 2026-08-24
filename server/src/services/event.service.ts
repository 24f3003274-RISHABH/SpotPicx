import mongoose from 'mongoose';
import { Event, IEvent, EventCategoryType, EventStatus } from '../models/Event';
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
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

const now = new Date();
const getFutureDate = (days: number, hour = 18, minute = 0) => {
  const d = new Date();
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
    tags: ['live-music', 'sufi', 'outdoor', 'evening', 'student-friendly', 'concerts'],
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
    startDate: getFutureDate(2, 12, 0), // Weekend
    endDate: getFutureDate(3, 22, 0),
    ticketPrice: 'Free Entry',
    bookingUrl: 'https://spotpicks.demo/food-carnival',
    organizer: 'Delhi Tourism & Heritage Food Forum',
    tags: ['street-food', 'family-dining', 'chandni-chowk', 'budget-friendly', 'food-festivals'],
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
    startDate: getFutureDate(0, 20, 30), // Tonight!
    endDate: getFutureDate(0, 23, 0),
    ticketPrice: '₹349',
    bookingUrl: 'https://bookmyshow.demo/comedy-delhi',
    organizer: 'NCR Comedy Collective',
    tags: ['comedy', 'nightlife', 'friends', 'couples', 'tonight'],
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
    startDate: getFutureDate(2, 9, 0), // Weekend
    endDate: getFutureDate(3, 20, 0),
    ticketPrice: 'Free Entry',
    bookingUrl: 'https://unstop.demo/ncr-hackathon',
    organizer: 'Delhi Tech Student Network & Google Developers Group',
    tags: ['hackathon', 'tech', 'student-friendly', 'internships', 'coding', 'hackathons'],
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
    startDate: getFutureDate(1, 8, 0), // Tomorrow morning
    endDate: getFutureDate(1, 11, 30),
    ticketPrice: '₹600',
    bookingUrl: 'https://spotpicks.demo/heritage-walk',
    organizer: 'Delhi Heritage Explorers',
    tags: ['heritage', 'workshop', 'photography', 'solo', 'morning', 'workshops'],
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
    startDate: getFutureDate(0, 18, 0), // Tonight / Today evening!
    endDate: getFutureDate(0, 21, 30),
    ticketPrice: '₹750',
    bookingUrl: 'https://townscript.demo/founders-mixer',
    organizer: 'Delhi NCR Angels Network',
    tags: ['startup', 'tech', 'networking', 'entrepreneurship', 'startup-events'],
    featured: true,
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
    startDate: getFutureDate(2, 19, 0), // Weekend evening
    endDate: getFutureDate(2, 21, 30),
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
    title: 'National Modern Art Exhibition: Delhi Expressions',
    slug: 'national-modern-art-exhibition-delhi-expressions',
    description: 'A curated gallery showcase featuring 80+ visual installations, contemporary oil canvases, and sculpture pieces exploring rapid urbanism in the capital.',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800',
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
    ],
    category: 'Exhibition',
    venue: 'National Gallery of Modern Art (NGMA)',
    location: {
      address: 'Jaipur House, India Gate',
      locality: 'Connaught Place',
      city: 'Delhi',
      coordinates: [77.235, 28.611],
    },
    startDate: getFutureDate(0, 10, 0), // Today
    endDate: getFutureDate(14, 18, 0), // This Month
    ticketPrice: '₹50',
    bookingUrl: 'https://ngmaindia.gov.in',
    organizer: 'NGMA Curatorial Board',
    tags: ['exhibitions', 'art', 'cultural', 'students', 'exhibition'],
    featured: true,
    status: 'UPCOMING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'evt_9',
    title: 'Delhi Tech Cloud & DevOps Summit 2026',
    slug: 'delhi-tech-cloud-devops-summit-2026',
    description: 'Keynotes from principal architects at Google Cloud, AWS, and leading NCR unicorns discussing Kubernetes at scale, edge AI deployment, and system reliability.',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    ],
    category: 'Tech',
    venue: 'India Habitat Centre, Lodhi Road',
    location: {
      address: 'Stein Auditorium, IHC, Lodhi Road',
      locality: 'Lodhi Colony',
      city: 'Delhi',
      coordinates: [77.225, 28.589],
    },
    startDate: getFutureDate(1, 10, 0), // Tomorrow
    endDate: getFutureDate(1, 18, 0),
    ticketPrice: 'Free Entry',
    bookingUrl: 'https://devopsdelhi.demo',
    organizer: 'Delhi Cloud Engineering Forum',
    tags: ['tech', 'tech-events', 'cloud', 'devops', 'student-friendly'],
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
  timeframe?: 'today' | 'tonight' | 'tomorrow' | 'weekend' | 'month' | 'all';
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
   * Helper to normalize category name / aliases
   */
  public static normalizeCategory(cat: string): string {
    const c = cat.toLowerCase().trim();
    if (c.includes('concert')) return 'Concert';
    if (c.includes('comedy')) return 'Comedy';
    if (c.includes('theatre') || c.includes('theater')) return 'Theatre';
    if (c.includes('exhibit')) return 'Exhibition';
    if (c.includes('workshop')) return 'Workshop';
    if (c.includes('hackathon')) return 'Hackathon';
    if (c.includes('startup')) return 'Startup';
    if (c.includes('tech')) return 'Tech';
    if (c.includes('food') || c.includes('festival')) return 'Food Festival';
    if (c.includes('cultural')) return 'Cultural';
    return cat;
  }

  /**
   * Automatically sweep and expire old events whose endDate has passed
   */
  public static async autoExpireOldEvents(): Promise<void> {
    const rightNow = new Date();

    // Expire in-memory
    inMemoryEvents.forEach((evt) => {
      if (new Date(evt.endDate) < rightNow && evt.status === 'UPCOMING') {
        evt.status = 'COMPLETED';
        evt.updatedAt = rightNow.toISOString();
      }
    });

    // Expire in MongoDB if connected
    if (dbConnection.getStatus().isConnected) {
      try {
        await Event.updateMany(
          { endDate: { $lt: rightNow }, status: { $in: ['UPCOMING', 'ONGOING'] } },
          { $set: { status: 'COMPLETED' } }
        );
      } catch (err) {
        console.warn('MongoDB autoExpireOldEvents error:', err);
      }
    }
  }

  /**
   * List events with rich filtering and timeframe intelligence
   */
  public static async getEvents(params: EventFilterParams = {}) {
    await this.autoExpireOldEvents();

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
        const normalizedTarget = this.normalizeCategory(category).toLowerCase();
        const eventCat = (e.category || '').toLowerCase();
        const eventTags = (e.tags || []).map((t) => t.toLowerCase());

        const matchesCat =
          eventCat.includes(normalizedTarget) ||
          eventTags.some((t) => t.includes(normalizedTarget) || t.includes(category.toLowerCase()));

        if (!matchesCat) return false;
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
      const eventEnd = new Date(e.endDate);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const tonightStart = new Date();
      tonightStart.setHours(17, 30, 0, 0); // 5:30 PM onwards

      const tonightEnd = new Date(todayStart);
      tonightEnd.setDate(tonightEnd.getDate() + 1);
      tonightEnd.setHours(4, 0, 0, 0); // 4:00 AM next morning

      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);

      const tomorrowEnd = new Date(todayEnd);
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

      if (timeframe === 'today') {
        return (eventStart >= todayStart && eventStart <= todayEnd) || (eventStart <= todayStart && eventEnd >= todayStart);
      } else if (timeframe === 'tonight') {
        return (
          (eventStart >= tonightStart && eventStart <= tonightEnd) ||
          (eventStart <= tonightStart && eventEnd >= tonightStart)
        );
      } else if (timeframe === 'tomorrow') {
        return eventStart >= tomorrowStart && eventStart <= tomorrowEnd;
      } else if (timeframe === 'weekend') {
        const currentDay = todayStart.getDay(); // 0 is Sun, 6 is Sat, 5 is Fri
        const distToFri = (5 - currentDay + 7) % 7;
        const friEvening = new Date(todayStart);
        friEvening.setDate(friEvening.getDate() + (distToFri === 0 && todayStart.getHours() > 21 ? 7 : distToFri));
        friEvening.setHours(17, 0, 0, 0);

        const sunMidnight = new Date(friEvening);
        sunMidnight.setDate(sunMidnight.getDate() + 2);
        sunMidnight.setHours(23, 59, 59, 999);

        return (
          (eventStart >= todayStart && eventStart <= sunMidnight) ||
          (eventStart <= todayStart && eventEnd >= todayStart)
        );
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
        if (category && category !== 'all') {
          const norm = this.normalizeCategory(category);
          mongoQuery.$or = [
            { category: new RegExp(norm, 'i') },
            { tags: new RegExp(category, 'i') },
          ];
        }
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
    await this.autoExpireOldEvents();

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
   * Admin Edit / Update Event
   */
  public static async updateEvent(id: string, data: Partial<InMemoryEvent>) {
    if (dbConnection.getStatus().isConnected) {
      const updated = await Event.findByIdAndUpdate(id, { $set: data }, { new: true });
      if (!updated) throw new Error('Event not found');
      return updated.toObject();
    }

    const existing = inMemoryEvents.get(id);
    if (!existing) throw new Error('Event not found');

    const updated: InMemoryEvent = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    inMemoryEvents.set(id, updated);
    return updated;
  }

  /**
   * Admin Approve Event
   */
  public static async approveEvent(id: string) {
    return this.updateEvent(id, { status: 'UPCOMING' });
  }

  /**
   * Admin Toggle Featured
   */
  public static async toggleFeatured(id: string) {
    const existing = await this.getEventBySlug(id);
    if (!existing) throw new Error('Event not found');
    return this.updateEvent(id, { featured: !existing.featured });
  }

  /**
   * Admin Expire Event
   */
  public static async expireEvent(id: string) {
    return this.updateEvent(id, { status: 'EXPIRED' });
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
