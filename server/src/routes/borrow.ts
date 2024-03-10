import { Router } from "express";
import { protectedRoute, adminRoute } from "../utils/middlewares";
import { Request as AuthRequest } from "express-jwt";
import IssueDetailsController from "../controllers/issue-details.js";
import BookController from "../controllers/books";

//The router will be added as a middleware and will take control of requests starting with /borrows.
const borrows = Router({ mergeParams: true });
export default borrows;

const issueDetailsController = new IssueDetailsController();
const bookController = new BookController();

/**
 * Routes
 *
 * GET /borrow/page: Returns a page of borrowed books.
 * POST /borrow/:bookId/:userId: Creates a new borrowed book for a user.
 * GET /borrow: Returns all borrowed books for the logged in user.
 * POST /borrow/:bookId/:userId/return: Returns a borrowed book
 * GET /borrow/history: Returns the history of borrowed books for the logged in user.
 *
 */

borrows.get(
  "/page",
  protectedRoute,
  adminRoute,
  async (req: AuthRequest, res) => {
    const limit = parseInt(req?.query?.limit as string) || undefined;
    const skip = parseInt(req?.query?.skip as string) || undefined;

    const borrowedBooks = await issueDetailsController.getPagedBorrows(
      limit,
      skip
    );
    return res.status(200).json(borrowedBooks);
  }
);
