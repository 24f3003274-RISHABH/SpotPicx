import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export class BookController {
  /**
   * GET /api/books/discovery/hub
   */
  public static getDiscoveryHub = asyncHandler(async (req: Request, res: Response) => {
    const hubData = await BookService.getDiscoveryHubData();
    return sendSuccess(res, hubData, 'Discovery hub data retrieved successfully');
  });

  /**
   * GET /api/books
   */
  public static getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      category,
      subcategory,
      topic,
      subject,
      genre,
      tag,
      author,
      authorSlug,
      readingLevel,
      bookType,
      readingPurpose,
      career,
      goal,
      country,
      language,
      isIndianAuthor,
      isIndianPublication,
      isPublicDomain,
      minYear,
      maxYear,
      featured,
      editorPick,
      recommended,
      trending,
      search,
      sort,
      page,
      limit,
    } = req.query;

    const result = await BookService.getBooks({
      category: category as string,
      subcategory: subcategory as string,
      topic: topic as string,
      subject: subject as string,
      genre: genre as string,
      tag: tag as string,
      author: author as string,
      authorSlug: authorSlug as string,
      readingLevel: readingLevel as string,
      bookType: bookType as string,
      readingPurpose: readingPurpose as string,
      career: career as string,
      goal: goal as string,
      country: country as string,
      language: language as string,
      isIndianAuthor: isIndianAuthor !== undefined ? isIndianAuthor === 'true' : undefined,
      isIndianPublication: isIndianPublication !== undefined ? isIndianPublication === 'true' : undefined,
      isPublicDomain: isPublicDomain !== undefined ? isPublicDomain === 'true' : undefined,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
      editorPick: editorPick !== undefined ? editorPick === 'true' : undefined,
      recommended: recommended !== undefined ? recommended === 'true' : undefined,
      trending: trending !== undefined ? trending === 'true' : undefined,
      search: search as string,
      sort: sort as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });

    return sendSuccess(res, result, 'Books retrieved successfully');
  });

  /**
   * GET /api/books/taxonomy/categories
   */
  public static getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = BookService.getCategories();
    return sendSuccess(res, categories, 'Categories retrieved successfully');
  });

  /**
   * GET /api/books/taxonomy/reading-paths
   */
  public static getReadingPaths = asyncHandler(async (req: Request, res: Response) => {
    const paths = BookService.getReadingPaths();
    return sendSuccess(res, paths, 'Reading paths retrieved successfully');
  });

  /**
   * GET /api/books/taxonomy/reading-paths/:slug
   */
  public static getReadingPathBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const pathData = await BookService.getReadingPathBySlug(slug);
    if (!pathData) {
      return sendError(res, 'Reading path not found', 404);
    }
    return sendSuccess(res, pathData, 'Reading path retrieved successfully');
  });

  /**
   * GET /api/books/taxonomy/collections
   */
  public static getEditorialCollections = asyncHandler(async (req: Request, res: Response) => {
    const collections = BookService.getEditorialCollections();
    return sendSuccess(res, collections, 'Editorial collections retrieved successfully');
  });

  /**
   * GET /api/books/taxonomy/collections/:slug
   */
  public static getEditorialCollectionBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const collectionData = await BookService.getEditorialCollectionBySlug(slug);
    if (!collectionData) {
      return sendError(res, 'Editorial collection not found', 404);
    }
    return sendSuccess(res, collectionData, 'Editorial collection retrieved successfully');
  });

  /**
   * POST /api/books/compare
   */
  public static compare = asyncHandler(async (req: Request, res: Response) => {
    const { slugs } = req.body;
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return sendError(res, 'Please provide an array of book slugs to compare', 400);
    }
    const comparison = await BookService.compareBooks(slugs);
    return sendSuccess(res, comparison, 'Books compared successfully');
  });

  /**
   * GET /api/books/:slug
   */
  public static getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await BookService.getBookBySlug(slug);

    if (!result) {
      return sendError(res, 'Book not found', 404);
    }

    const { book, authorDetails, authorOtherBooks, relatedBooks } = result;

    // Rich Schema.org Book JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      alternateName: book.alternateTitles,
      description: book.shortDescription || book.description,
      image: book.coverImage,
      author: book.authors.map((a) => ({
        '@type': 'Person',
        name: a,
      })),
      publisher: {
        '@type': 'Organization',
        name: book.publisher,
      },
      datePublished: book.publicationYear?.toString(),
      inLanguage: book.language,
      isbn: book.isbn13 || book.isbn10,
      numberOfPages: book.pageCount,
      genre: [...(book.genres || []), ...(book.topics || [])],
      bookFormat: 'https://schema.org/EBook',
      url: `https://spotpicx.com/books/${book.slug}`,
      offers: (book.legitimatePurchaseLinks || []).map((link) => ({
        '@type': 'Offer',
        url: link.url,
        seller: {
          '@type': 'Organization',
          name: link.storeOrPlatform || link.label,
        },
      })),
    };

    return sendSuccess(
      res,
      {
        book,
        authorDetails,
        authorOtherBooks,
        relatedBooks,
        jsonLd,
      },
      'Book details retrieved successfully'
    );
  });

  /**
   * POST /api/books (Admin)
   */
  public static create = asyncHandler(async (req: Request, res: Response) => {
    const book = await BookService.createBook(req.body);
    return sendSuccess(res, book, 'Book created successfully', 201);
  });

  /**
   * PUT /api/books/:id
   */
  public static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await BookService.updateBook(id, req.body);
    if (!book) {
      return sendError(res, 'Book not found for update', 404);
    }
    return sendSuccess(res, book, 'Book updated successfully');
  });

  /**
   * DELETE /api/books/:id
   */
  public static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await BookService.deleteBook(id);
    return sendSuccess(res, { deleted }, 'Book deleted successfully');
  });
}
