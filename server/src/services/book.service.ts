import { Book, IBook } from '../models/Book';
import { Author } from '../models/Author';
import { SEED_BOOKS, SEED_AUTHORS } from '../seed/booksData';
import {
  BOOK_CATEGORIES,
  BOOK_TYPES,
  READING_PURPOSES,
  CAREER_PATHS,
  EDITORIAL_COLLECTIONS,
  READING_PATHS,
  BookCategoryDefinition,
  ReadingPathDefinition,
  EditorialCollectionDefinition,
} from '../constants/bookTaxonomy';
import { AuthorService } from './author.service';

export interface BookQueryOptions {
  category?: string;
  subcategory?: string;
  topic?: string;
  subject?: string;
  genre?: string;
  tag?: string;
  author?: string;
  authorSlug?: string;
  readingLevel?: string;
  bookType?: string;
  readingPurpose?: string;
  career?: string;
  goal?: string;
  country?: string;
  language?: string;
  isIndianAuthor?: boolean;
  isIndianPublication?: boolean;
  isPublicDomain?: boolean;
  minYear?: number;
  maxYear?: number;
  featured?: boolean;
  editorPick?: boolean;
  recommended?: boolean;
  trending?: boolean;
  search?: string;
  sort?: 'recommended' | 'popular' | 'newest' | 'classics' | 'title_asc' | 'title_desc';
  page?: number;
  limit?: number;
}

export class BookService {
  private static inMemoryBooks: IBook[] = SEED_BOOKS as any[];

  /**
   * Comprehensive Book search and filtered discovery
   */
  public static async getBooks(options: BookQueryOptions = {}): Promise<{
    books: IBook[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(options.limit) || 12));
    const skip = (page - 1) * limit;

    try {
      const query: any = { status: 'PUBLISHED' };

      if (options.category && options.category !== 'all') {
        query.category = options.category;
      }
      if (options.subcategory) {
        query.subcategory = options.subcategory;
      }
      if (options.topic) {
        query.topics = { $in: [new RegExp(`^${options.topic}$`, 'i')] };
      }
      if (options.subject) {
        query.subjects = { $in: [new RegExp(`^${options.subject}$`, 'i')] };
      }
      if (options.genre) {
        query.genres = { $in: [new RegExp(`^${options.genre}$`, 'i')] };
      }
      if (options.tag) {
        query.tags = { $in: [new RegExp(`^${options.tag}$`, 'i')] };
      }
      if (options.author) {
        query.authors = { $in: [new RegExp(options.author, 'i')] };
      }
      if (options.readingLevel && options.readingLevel !== 'ALL_LEVELS') {
        query.readingLevel = options.readingLevel;
      }
      if (options.bookType) {
        query.bookTypes = { $in: [options.bookType] };
      }
      if (options.readingPurpose) {
        query.readingPurposes = { $in: [options.readingPurpose] };
      }
      if (options.career) {
        query.careers = { $in: [options.career] };
      }
      if (options.goal) {
        query.goals = { $in: [options.goal] };
      }
      if (options.country) {
        query.country = new RegExp(options.country, 'i');
      }
      if (options.language) {
        query.language = new RegExp(options.language, 'i');
      }
      if (options.isIndianAuthor !== undefined) {
        query.isIndianAuthor = options.isIndianAuthor;
      }
      if (options.isIndianPublication !== undefined) {
        query.isIndianPublication = options.isIndianPublication;
      }
      if (options.isPublicDomain !== undefined) {
        query.isPublicDomain = options.isPublicDomain;
      }
      if (options.minYear || options.maxYear) {
        query.publicationYear = {};
        if (options.minYear) query.publicationYear.$gte = Number(options.minYear);
        if (options.maxYear) query.publicationYear.$lte = Number(options.maxYear);
      }
      if (options.featured !== undefined) {
        query.featured = options.featured;
      }
      if (options.editorPick !== undefined) {
        query.editorPick = options.editorPick;
      }
      if (options.recommended !== undefined) {
        query.recommended = options.recommended;
      }
      if (options.trending !== undefined) {
        query.trending = options.trending;
      }

      if (options.search) {
        const regex = new RegExp(options.search, 'i');
        query.$or = [
          { title: regex },
          { subtitle: regex },
          { description: regex },
          { shortDescription: regex },
          { authors: regex },
          { primaryAuthor: regex },
          { topics: regex },
          { subjects: regex },
          { keyIdeas: regex },
          { publisher: regex },
        ];
      }

      let sortOption: any = { popularityScore: -1, editorPick: -1, publicationYear: -1 };
      if (options.sort === 'popular') sortOption = { popularityScore: -1, viewCount: -1 };
      if (options.sort === 'newest') sortOption = { publicationYear: -1, createdAt: -1 };
      if (options.sort === 'classics') sortOption = { publicationYear: 1 };
      if (options.sort === 'title_asc') sortOption = { title: 1 };
      if (options.sort === 'title_desc') sortOption = { title: -1 };

      const [books, total] = await Promise.all([
        Book.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
        Book.countDocuments(query),
      ]);

      if (books.length > 0 || total > 0) {
        return {
          books: books as unknown as IBook[],
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      }
    } catch (err) {
      console.warn('BookService.getBooks DB query error, falling back to in-memory store:', err);
    }

    // In-memory fallback
    let filtered = [...this.inMemoryBooks].filter((b) => b.status === 'PUBLISHED');

    if (options.category && options.category !== 'all') {
      filtered = filtered.filter((b) => b.category === options.category);
    }
    if (options.subcategory) {
      filtered = filtered.filter((b) => b.subcategory === options.subcategory);
    }
    if (options.topic) {
      filtered = filtered.filter((b) =>
        b.topics.some((t: string) => t.toLowerCase() === options.topic!.toLowerCase())
      );
    }
    if (options.author) {
      filtered = filtered.filter((b) =>
        b.authors.some((a: string) => a.toLowerCase().includes(options.author!.toLowerCase()))
      );
    }
    if (options.readingLevel && options.readingLevel !== 'ALL_LEVELS') {
      filtered = filtered.filter((b) => b.readingLevel === options.readingLevel);
    }
    if (options.bookType) {
      filtered = filtered.filter((b) => b.bookTypes?.includes(options.bookType!));
    }
    if (options.readingPurpose) {
      filtered = filtered.filter((b) => b.readingPurposes?.includes(options.readingPurpose!));
    }
    if (options.career) {
      filtered = filtered.filter((b) => b.careers?.includes(options.career!));
    }
    if (options.goal) {
      filtered = filtered.filter((b) => b.goals?.includes(options.goal!));
    }
    if (options.isIndianAuthor !== undefined) {
      filtered = filtered.filter((b) => b.isIndianAuthor === options.isIndianAuthor);
    }
    if (options.isPublicDomain !== undefined) {
      filtered = filtered.filter((b) => b.isPublicDomain === options.isPublicDomain);
    }
    if (options.minYear) {
      filtered = filtered.filter((b) => b.publicationYear >= options.minYear!);
    }
    if (options.maxYear) {
      filtered = filtered.filter((b) => b.publicationYear <= options.maxYear!);
    }
    if (options.featured !== undefined) {
      filtered = filtered.filter((b) => b.featured === options.featured);
    }
    if (options.editorPick !== undefined) {
      filtered = filtered.filter((b) => b.editorPick === options.editorPick);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.authors.some((a: string) => a.toLowerCase().includes(q)) ||
          b.topics.some((t: string) => t.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q)
      );
    }

    // Sort in-memory
    if (options.sort === 'popular') {
      filtered.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
    } else if (options.sort === 'newest') {
      filtered.sort((a, b) => b.publicationYear - a.publicationYear);
    } else if (options.sort === 'classics') {
      filtered.sort((a, b) => a.publicationYear - b.publicationYear);
    } else if (options.sort === 'title_asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      books: paginated as unknown as IBook[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single book by slug with author details, related books, and author's other books
   */
  public static async getBookBySlug(slug: string): Promise<{
    book: IBook;
    authorDetails: any[];
    authorOtherBooks: IBook[];
    relatedBooks: IBook[];
  } | null> {
    let book: IBook | null = null;

    try {
      const dbBook = await Book.findOne({ slug: slug.toLowerCase() }).lean();
      if (dbBook) {
        book = dbBook as unknown as IBook;
        // Fire-and-forget view count increment
        Book.updateOne({ _id: dbBook._id }, { $inc: { viewCount: 1 } }).exec();
      }
    } catch (err) {
      console.warn('BookService.getBookBySlug DB fetch failed:', err);
    }

    if (!book) {
      const found = this.inMemoryBooks.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
      if (found) {
        book = found as unknown as IBook;
      }
    }

    if (!book) return null;

    // Fetch author profile details
    const authorDetails: any[] = [];
    for (const authorName of book.authors) {
      const authorSlug = authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const author = await AuthorService.getAuthorBySlug(authorSlug);
      if (author) authorDetails.push(author);
    }

    // Fetch more books by this author
    const authorOtherBooks = await this.getBooksByAuthor(book.primaryAuthor, book.slug, 6);

    // Fetch related books based on category, topics, and reading purpose
    const relatedBooks = await this.getRelatedBooks(book, 6);

    return {
      book,
      authorDetails,
      authorOtherBooks,
      relatedBooks,
    };
  }

  /**
   * Fetch all books written by an author (excluding current book if provided)
   */
  public static async getBooksByAuthor(authorName: string, excludeSlug?: string, limit: number = 6): Promise<IBook[]> {
    try {
      const query: any = {
        status: 'PUBLISHED',
        authors: { $in: [new RegExp(`^${authorName}$`, 'i')] },
      };
      if (excludeSlug) query.slug = { $ne: excludeSlug };

      const books = await Book.find(query).sort({ publicationYear: -1 }).limit(limit).lean();
      if (books && books.length > 0) return books as unknown as IBook[];
    } catch (err) {
      console.warn('BookService.getBooksByAuthor DB failed:', err);
    }

    return this.inMemoryBooks
      .filter(
        (b) =>
          b.status === 'PUBLISHED' &&
          b.slug !== excludeSlug &&
          b.authors.some((a) => a.toLowerCase() === authorName.toLowerCase())
      )
      .slice(0, limit) as unknown as IBook[];
  }

  /**
   * Fetch related books based on taxonomy similarities
   */
  public static async getRelatedBooks(targetBook: IBook, limit: number = 6): Promise<IBook[]> {
    try {
      const query: any = {
        slug: { $ne: targetBook.slug },
        status: 'PUBLISHED',
        $or: [
          { category: targetBook.category },
          { topics: { $in: targetBook.topics } },
          { readingPurposes: { $in: targetBook.readingPurposes || [] } },
          { readingLevel: targetBook.readingLevel },
        ],
      };

      const books = await Book.find(query).sort({ popularityScore: -1 }).limit(limit).lean();
      if (books && books.length > 0) return books as unknown as IBook[];
    } catch (err) {
      console.warn('BookService.getRelatedBooks DB failed:', err);
    }

    return this.inMemoryBooks
      .filter(
        (b) =>
          b.status === 'PUBLISHED' &&
          b.slug !== targetBook.slug &&
          (b.category === targetBook.category ||
            b.topics.some((t) => targetBook.topics.includes(t)) ||
            (b.readingPurposes || []).some((rp) => (targetBook.readingPurposes || []).includes(rp)))
      )
      .slice(0, limit) as unknown as IBook[];
  }

  /**
   * Main Discovery Hub bundle for /books
   */
  public static async getDiscoveryHubData(): Promise<{
    featuredBooks: IBook[];
    editorsPicks: IBook[];
    indianSpotlight: IBook[];
    studentEssentials: IBook[];
    categories: BookCategoryDefinition[];
    readingPurposes: Array<{ id: string; label: string; icon: string }>;
    careerPaths: Array<{ id: string; label: string; icon: string; description: string }>;
    readingPaths: ReadingPathDefinition[];
    editorialCollections: EditorialCollectionDefinition[];
    totalBooksCount: number;
  }> {
    const [featuredRes, picksRes, indianRes, allRes] = await Promise.all([
      this.getBooks({ featured: true, limit: 6 }),
      this.getBooks({ editorPick: true, limit: 6 }),
      this.getBooks({ isIndianAuthor: true, limit: 6 }),
      this.getBooks({ limit: 1 }),
    ]);

    // Student essentials: beginner/all-levels in CS or habits
    const studentRes = await this.getBooks({
      readingLevel: 'BEGINNER',
      sort: 'popular',
      limit: 6,
    });

    return {
      featuredBooks: featuredRes.books,
      editorsPicks: picksRes.books,
      indianSpotlight: indianRes.books,
      studentEssentials: studentRes.books,
      categories: BOOK_CATEGORIES,
      readingPurposes: READING_PURPOSES,
      careerPaths: CAREER_PATHS,
      readingPaths: READING_PATHS,
      editorialCollections: EDITORIAL_COLLECTIONS,
      totalBooksCount: allRes.total || this.inMemoryBooks.length,
    };
  }

  /**
   * Get all categories taxonomy
   */
  public static getCategories(): BookCategoryDefinition[] {
    return BOOK_CATEGORIES;
  }

  /**
   * Get category by slug
   */
  public static getCategoryBySlug(slug: string): BookCategoryDefinition | null {
    return BOOK_CATEGORIES.find((c) => c.slug === slug) || null;
  }

  /**
   * Get all reading paths
   */
  public static getReadingPaths(): ReadingPathDefinition[] {
    return READING_PATHS;
  }

  /**
   * Get reading path by slug with populated book recommendations
   */
  public static async getReadingPathBySlug(slug: string): Promise<{
    path: ReadingPathDefinition;
    stepBooks: Record<number, IBook[]>;
  } | null> {
    const path = READING_PATHS.find((p) => p.slug === slug);
    if (!path) return null;

    const stepBooks: Record<number, IBook[]> = {};

    for (const step of path.steps) {
      stepBooks[step.order] = [];
      for (const bSlug of step.recommendedBookSlugs) {
        const bookData = await this.getBookBySlug(bSlug);
        if (bookData?.book) {
          stepBooks[step.order].push(bookData.book);
        }
      }
    }

    return { path, stepBooks };
  }

  /**
   * Get all editorial collections
   */
  public static getEditorialCollections(): EditorialCollectionDefinition[] {
    return EDITORIAL_COLLECTIONS;
  }

  /**
   * Get single editorial collection with populated book records
   */
  public static async getEditorialCollectionBySlug(slug: string): Promise<{
    collection: EditorialCollectionDefinition;
    books: IBook[];
  } | null> {
    const collection = EDITORIAL_COLLECTIONS.find((c) => c.slug === slug);
    if (!collection) return null;

    const books: IBook[] = [];
    for (const bSlug of collection.bookSlugs) {
      const bRes = await this.getBookBySlug(bSlug);
      if (bRes?.book) books.push(bRes.book);
    }

    return { collection, books };
  }

  /**
   * Compare multiple books
   */
  public static async compareBooks(slugs: string[]): Promise<IBook[]> {
    const books: IBook[] = [];
    for (const slug of slugs.slice(0, 4)) {
      const bRes = await this.getBookBySlug(slug);
      if (bRes?.book) books.push(bRes.book);
    }
    return books;
  }

  /**
   * Admin: Create Book
   */
  public static async createBook(data: Partial<IBook>): Promise<IBook> {
    const slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const bookDoc = {
      ...data,
      slug,
      status: data.status || 'PUBLISHED',
      source: data.source || 'SpotPicx Editorial Team',
      sourceType: data.sourceType || 'EDITORIAL',
      lastVerified: new Date(),
      freshnessStatus: data.freshnessStatus || 'Verified Metadata',
      popularityScore: data.popularityScore || 80,
      format: data.format || ['Paperback', 'Ebook'],
      keyIdeas: data.keyIdeas || [],
      whoShouldRead: data.whoShouldRead || [],
      prerequisites: data.prerequisites || [],
      bestFor: data.bestFor || [],
      legitimatePurchaseLinks: data.legitimatePurchaseLinks || [],
      legitimateDigitalLinks: data.legitimateDigitalLinks || [],
    };

    try {
      const created = await Book.create(bookDoc);
      return created.toObject() as IBook;
    } catch (err) {
      console.warn('BookService.createBook DB write failed, updating in-memory:', err);
      this.inMemoryBooks.push(bookDoc as any);
      return bookDoc as unknown as IBook;
    }
  }

  /**
   * Admin: Update Book
   */
  public static async updateBook(idOrSlug: string, data: Partial<IBook>): Promise<IBook | null> {
    try {
      const updated = await Book.findOneAndUpdate(
        { $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }] },
        { $set: data },
        { new: true }
      ).lean();
      if (updated) return updated as unknown as IBook;
    } catch (err) {
      console.warn('BookService.updateBook DB update failed:', err);
    }

    const idx = this.inMemoryBooks.findIndex((b) => b.slug === idOrSlug || (b as any)._id === idOrSlug);
    if (idx !== -1) {
      this.inMemoryBooks[idx] = { ...this.inMemoryBooks[idx], ...data } as any;
      return this.inMemoryBooks[idx] as unknown as IBook;
    }
    return null;
  }

  /**
   * Admin: Delete Book
   */
  public static async deleteBook(idOrSlug: string): Promise<boolean> {
    try {
      await Book.findOneAndDelete({
        $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
      });
      return true;
    } catch (err) {
      console.warn('BookService.deleteBook DB deletion failed:', err);
    }

    this.inMemoryBooks = this.inMemoryBooks.filter((b) => b.slug !== idOrSlug && (b as any)._id !== idOrSlug);
    return true;
  }
}
