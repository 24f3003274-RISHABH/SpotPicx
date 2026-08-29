import { Author, IAuthor } from '../models/Author';
import { Book } from '../models/Book';
import { SEED_AUTHORS } from '../seed/booksData';

export interface AuthorFilterOptions {
  search?: string;
  isIndian?: boolean;
  country?: string;
  field?: string;
  profession?: string;
  featured?: boolean;
  popular?: boolean;
  page?: number;
  limit?: number;
  sort?: 'name' | 'popular' | 'newest' | 'bookCount';
}

export class AuthorService {
  private static inMemoryAuthors: IAuthor[] = SEED_AUTHORS as any[];

  /**
   * Fetch authors with filtering, search, and pagination
   */
  public static async getAuthors(options: AuthorFilterOptions = {}): Promise<{
    authors: IAuthor[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(options.limit) || 12));
    const skip = (page - 1) * limit;

    try {
      const query: any = { status: 'ACTIVE' };

      if (options.isIndian !== undefined) {
        query.isIndian = options.isIndian;
      }
      if (options.country) {
        query.country = new RegExp(options.country, 'i');
      }
      if (options.field) {
        query.fields = { $in: [new RegExp(options.field, 'i')] };
      }
      if (options.profession) {
        query.profession = { $in: [new RegExp(options.profession, 'i')] };
      }
      if (options.featured !== undefined) {
        query.featured = options.featured;
      }
      if (options.popular !== undefined) {
        query.popular = options.popular;
      }
      if (options.search) {
        const regex = new RegExp(options.search, 'i');
        query.$or = [
          { name: regex },
          { biography: regex },
          { fields: regex },
          { profession: regex },
          { notableWorks: regex },
        ];
      }

      let sortOption: any = { popular: -1, bookCount: -1, name: 1 };
      if (options.sort === 'name') sortOption = { name: 1 };
      if (options.sort === 'popular') sortOption = { popular: -1, featured: -1, bookCount: -1 };
      if (options.sort === 'newest') sortOption = { createdAt: -1 };
      if (options.sort === 'bookCount') sortOption = { bookCount: -1 };

      const [authors, total] = await Promise.all([
        Author.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
        Author.countDocuments(query),
      ]);

      if (authors.length > 0 || total > 0) {
        return {
          authors: authors as unknown as IAuthor[],
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      }
    } catch (err) {
      console.warn('AuthorService.getAuthors falling back to in-memory store:', err);
    }

    // In-memory fallback
    let filtered = [...this.inMemoryAuthors];
    if (options.isIndian !== undefined) {
      filtered = filtered.filter((a) => a.isIndian === options.isIndian);
    }
    if (options.country) {
      filtered = filtered.filter((a) => a.country.toLowerCase().includes(options.country!.toLowerCase()));
    }
    if (options.field) {
      filtered = filtered.filter((a) =>
        a.fields.some((f: string) => f.toLowerCase().includes(options.field!.toLowerCase()))
      );
    }
    if (options.featured !== undefined) {
      filtered = filtered.filter((a) => a.featured === options.featured);
    }
    if (options.popular !== undefined) {
      filtered = filtered.filter((a) => a.popular === options.popular);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.biography.toLowerCase().includes(q) ||
          a.fields.some((f: string) => f.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      authors: paginated as unknown as IAuthor[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single author by slug
   */
  public static async getAuthorBySlug(slug: string): Promise<IAuthor | null> {
    try {
      const author = await Author.findOne({ slug: slug.toLowerCase() }).lean();
      if (author) return author as unknown as IAuthor;
    } catch (err) {
      console.warn('AuthorService.getAuthorBySlug DB error, checking in-memory fallback:', err);
    }

    const found = this.inMemoryAuthors.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
    return (found as unknown as IAuthor) || null;
  }

  /**
   * Get related authors based on overlapping fields or nationality
   */
  public static async getRelatedAuthors(authorSlug: string, limit: number = 4): Promise<IAuthor[]> {
    const author = await this.getAuthorBySlug(authorSlug);
    if (!author) return [];

    try {
      const related = await Author.find({
        slug: { $ne: author.slug },
        status: 'ACTIVE',
        $or: [{ fields: { $in: author.fields } }, { country: author.country }],
      })
        .limit(limit)
        .lean();

      if (related && related.length > 0) return related as unknown as IAuthor[];
    } catch (err) {
      console.warn('AuthorService.getRelatedAuthors falling back to in-memory:', err);
    }

    return this.inMemoryAuthors
      .filter(
        (a) =>
          a.slug !== author.slug &&
          (a.country === author.country || a.fields.some((f: string) => author.fields.includes(f)))
      )
      .slice(0, limit) as unknown as IAuthor[];
  }

  /**
   * Admin: Create author
   */
  public static async createAuthor(data: Partial<IAuthor>): Promise<IAuthor> {
    const slug = data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const authorDoc = {
      ...data,
      slug,
      status: data.status || 'ACTIVE',
      sources: data.sources || [{ name: 'Editorial Verified', url: 'https://spotpicx.com' }],
      featured: Boolean(data.featured),
      popular: Boolean(data.popular),
      bookCount: data.bookCount || 0,
    };

    try {
      const created = await Author.create(authorDoc);
      return created.toObject() as IAuthor;
    } catch (err) {
      console.warn('AuthorService.createAuthor DB write failed, updating in-memory:', err);
      this.inMemoryAuthors.push(authorDoc as any);
      return authorDoc as unknown as IAuthor;
    }
  }

  /**
   * Admin: Update author
   */
  public static async updateAuthor(idOrSlug: string, data: Partial<IAuthor>): Promise<IAuthor | null> {
    try {
      const updated = await Author.findOneAndUpdate(
        { $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }] },
        { $set: data },
        { new: true }
      ).lean();
      if (updated) return updated as unknown as IAuthor;
    } catch (err) {
      console.warn('AuthorService.updateAuthor DB update failed, falling back:', err);
    }

    const idx = this.inMemoryAuthors.findIndex((a) => a.slug === idOrSlug || (a as any)._id === idOrSlug);
    if (idx !== -1) {
      this.inMemoryAuthors[idx] = { ...this.inMemoryAuthors[idx], ...data } as any;
      return this.inMemoryAuthors[idx] as unknown as IAuthor;
    }
    return null;
  }

  /**
   * Admin: Delete author
   */
  public static async deleteAuthor(idOrSlug: string): Promise<boolean> {
    try {
      await Author.findOneAndDelete({
        $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
      });
      return true;
    } catch (err) {
      console.warn('AuthorService.deleteAuthor DB deletion failed:', err);
    }

    this.inMemoryAuthors = this.inMemoryAuthors.filter((a) => a.slug !== idOrSlug && (a as any)._id !== idOrSlug);
    return true;
  }
}
