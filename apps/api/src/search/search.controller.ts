import { NextFunction, Request, Response } from "express";
import { searchService } from "./search.service";
import { SearchQuery } from "./search.schemas";
import { AuthenticatedRequest } from "../middleware/authenticate";

export class SearchController {
  search = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { q, type } = req.validated!.query as SearchQuery;

      const searchResults = await searchService.search(
        { q, type },
        req.organization!.id,
      );
      res.status(200).json(searchResults);
    } catch (error) {
      next(error);
    }
  };
}

export const searchController = new SearchController();
