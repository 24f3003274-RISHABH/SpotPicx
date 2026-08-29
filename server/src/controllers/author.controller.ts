import { Request, Response } from 'express';
import { AuthorService } from '../services/author.service';
import { BookService } from '../services/book.service';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export class AuthorController {
  /**
   * GET /api/authors
   */
  public static getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      search,
      isIndian,
      country,
      field,
      profession,
      featured,
      popular,
      page,
      limit,
      sort,
    } = req.query;

    const result = await AuthorService.getAuthors({
      search: search as string,
      isIndian: isIndian !== undefined ? isIndian === 'true' : undefined,
      country: country as string,
      field: field as string,
      profession: profession as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
      popular: popular !== undefined ? popular === 'true' : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
      sort: sort as any,
    });

    return sendSuccess(res, result, 'Authors retrieved successfully');
  });

  /**
   * GET /api/authors/:slug
   */
  public static getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const author = await AuthorService.getAuthorBySlug(slug);

    if (!author) {
      return sendError(res, 'Author not found', 404);
    }

    // Fetch author's books and related authors
    const [books, relatedAuthors] = await Promise.all([
      BookService.getBooksByAuthor(author.name, undefined, 20),
      AuthorService.getRelatedAuthors(author.slug, 4),
    ]);

    // JSON-LD Person Schema
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author.name,
      alternateName: author.alternateNames,
      description: author.shortBiography || author.biography,
      image: author.portrait,
      nationality: author.nationality,
      jobTitle: author.profession,
      sameAs: [
        author.officialWebsite,
        author.wikipediaUrl,
        ...(author.sources?.map((s) => s.url) || []),
      ].filter(Boolean),
    };

    return sendSuccess(
      res,
      {
        author,
        books,
        relatedAuthors,
        jsonLd,
      },
      'Author details retrieved successfully'
    );
  });

  /**
   * POST /api/authors (Admin)
   */
  public static create = asyncHandler(async (req: Request, res: Response) => {
    const author = await AuthorService.createAuthor(req.body);
    return sendSuccess(res, author, 'Author created successfully', 201);
  });

  /**
   * PUT /api/authors/:id
   */
  public static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const author = await AuthorService.updateAuthor(id, req.body);
    if (!author) {
      return sendError(res, 'Author not found for update', 404);
    }
    return sendSuccess(res, author, 'Author updated successfully');
  });

  /**
   * DELETE /api/authors/:id
   */
  public static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await AuthorService.deleteAuthor(id);
    return sendSuccess(res, { deleted }, 'Author deleted successfully');
  });
}
