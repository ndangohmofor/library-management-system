import { Router } from "express";
import { ObjectId } from "mongodb";
import { protectedRoute, adminRoute } from "../utils/middlewares";
import { Request as AuthRequest } from "express-jwt";
import IssueDetailsController from "../controllers/issue-details";
import BookController from "../controllers/books";
import { collections } from "../database";

//The router will be added as middleware and will take control of requests starting with /reservations.
const reservations = Router({ mergeParams: true });
export default reservations;

const issueDetailsController = new IssueDetailsController();
const bookController = new BookController();

/**
 * Routes
 *
 * GET /reservations/page: Returns a page of reservations.
 * GET reservations: Returns the list of reservations for the logged in user.
 * GET /reservations/:reservationId: Returns the details of a reservation.
 * POST /reservations:bookId: Creates a new reservation.
 * DELETE /reservations/:bookId: Deletes a reservation.
 * GET /reservations/user/:userId: Returns the list of reservations for the specified user.
 *
 */

reservations.get("/", protectedRoute, async (req: AuthRequest, res) => {
  const userId = req?.auth?.sub;

  const reservations = await issueDetailsController.getReservations(userId);
  return res.status(200).json(reservations);
});

reservations.get(
  "/page",
  protectedRoute,
  adminRoute,
  async (req: AuthRequest, res) => {
    const limit = parseInt(req?.query?.limit as string) || undefined;
    const skip = parseInt(req?.query?.skip as string) || undefined;

    const reservations = await issueDetailsController.getPagedReservations(
      limit,
      skip
    );

    return res.status(200).json(reservations);
  }
);
