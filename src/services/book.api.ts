import { apiClient } from '../api/apiClient';
import { IBook, IAuthor, BookCategoryDefinition, ReadingPathDefinition, EditorialCollectionDefinition } from '../types/book.types';

export interface BookFilterParams {
  category?: string;
  subcategory?: string;
  topic?: string;
  subject?: string;
  genre?: string;
  tag?: string;
  author?: string;
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
  sort?: string;
  page?: number;
  limit?: number;
}

export interface AuthorFilterParams {
  search?: string;
  isIndian?: boolean;
  country?: string;
  field?: string;
  profession?: string;
  featured?: boolean;
  popular?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const BookApi = {
  /**
   * Fetch main Discovery Hub Data
   */
  async getDiscoveryHub() {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('/books/discovery/hub');
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('BookApi.getDiscoveryHub network error, falling back:', err);
    }
    return null;
  },

  /**
   * Search / Browse Books
   */
  async getBooks(params: BookFilterParams = {}) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { books: IBook[]; total: number; page: number; totalPages: number };
      }>('/books', { params });
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('BookApi.getBooks network error:', err);
    }
    return { books: [], total: 0, page: 1, totalPages: 1 };
  },

  /**
   * Get single book by slug
   */
  async getBookBySlug(slug: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          book: IBook;
          authorDetails: IAuthor[];
          authorOtherBooks: IBook[];
          relatedBooks: IBook[];
          jsonLd: any;
        };
      }>(`/books/${slug}`);
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`BookApi.getBookBySlug(${slug}) network error:`, err);
    }
    return null;
  },

  /**
   * Get Authors directory
   */
  async getAuthors(params: AuthorFilterParams = {}) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { authors: IAuthor[]; total: number; page: number; totalPages: number };
      }>('/authors', { params });
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('BookApi.getAuthors network error:', err);
    }
    return { authors: [], total: 0, page: 1, totalPages: 1 };
  },

  /**
   * Get Author by slug
   */
  async getAuthorBySlug(slug: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          author: IAuthor;
          books: IBook[];
          relatedAuthors: IAuthor[];
          jsonLd: any;
        };
      }>(`/authors/${slug}`);
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`BookApi.getAuthorBySlug(${slug}) network error:`, err);
    }
    return null;
  },

  /**
   * Get Categories
   */
  async getCategories(): Promise<BookCategoryDefinition[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: BookCategoryDefinition[] }>(
        '/books/taxonomy/categories'
      );
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('BookApi.getCategories network error:', err);
    }
    return [];
  },

  /**
   * Get Reading Paths
   */
  async getReadingPaths(): Promise<ReadingPathDefinition[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ReadingPathDefinition[] }>(
        '/books/taxonomy/reading-paths'
      );
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('BookApi.getReadingPaths network error:', err);
    }
    return [];
  },

  /**
   * Get Reading Path by slug
   */
  async getReadingPathBySlug(slug: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { path: ReadingPathDefinition; stepBooks: Record<number, IBook[]> };
      }>(`/books/taxonomy/reading-paths/${slug}`);
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`BookApi.getReadingPathBySlug(${slug}) network error:`, err);
    }
    return null;
  },

  /**
   * Get Editorial Collections
   */
  async getEditorialCollections(): Promise<EditorialCollectionDefinition[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: EditorialCollectionDefinition[] }>(
        '/books/taxonomy/collections'
      );
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('BookApi.getEditorialCollections network error:', err);
    }
    return [];
  },

  /**
   * Get Editorial Collection by slug
   */
  async getEditorialCollectionBySlug(slug: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { collection: EditorialCollectionDefinition; books: IBook[] };
      }>(`/books/taxonomy/collections/${slug}`);
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`BookApi.getEditorialCollectionBySlug(${slug}) network error:`, err);
    }
    return null;
  },

  /**
   * Compare multiple books
   */
  async compareBooks(slugs: string[]): Promise<IBook[]> {
    try {
      const response = await apiClient.post<{ success: boolean; data: IBook[] }>('/books/compare', { slugs });
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('BookApi.compareBooks network error:', err);
    }
    return [];
  },

  /**
   * Admin: Create Book
   */
  async createBook(data: Partial<IBook>) {
    const response = await apiClient.post<{ success: boolean; data: IBook }>('/books', data);
    return response.data;
  },

  /**
   * Admin: Update Book
   */
  async updateBook(id: string, data: Partial<IBook>) {
    const response = await apiClient.put<{ success: boolean; data: IBook }>(`/books/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Delete Book
   */
  async deleteBook(id: string) {
    const response = await apiClient.delete<{ success: boolean; data: { deleted: boolean } }>(`/books/${id}`);
    return response.data;
  },

  /**
   * Admin: Create Author
   */
  async createAuthor(data: Partial<IAuthor>) {
    const response = await apiClient.post<{ success: boolean; data: IAuthor }>('/authors', data);
    return response.data;
  },

  /**
   * Admin: Update Author
   */
  async updateAuthor(id: string, data: Partial<IAuthor>) {
    const response = await apiClient.put<{ success: boolean; data: IAuthor }>(`/authors/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Delete Author
   */
  async deleteAuthor(id: string) {
    const response = await apiClient.delete<{ success: boolean; data: { deleted: boolean } }>(`/authors/${id}`);
    return response.data;
  },
};
