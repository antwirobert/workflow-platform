import { NextFunction, Request, Response } from "express";
import { searchService } from "./search.service";
import { SearchQuery } from "./search.schemas";
import { OrganizationIdParams } from "../modules/organizations/organizations.schemas";

export class SearchController {
  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, type } = req.validated!.query as SearchQuery;
      const { orgId } = req.validated!.params as OrganizationIdParams;

      const searchResults = await searchService.search({ q, type }, orgId);
      res.status(200).json(searchResults);
    } catch (error) {
      next(error);
    }
  };
}

export const searchController = new SearchController();
