import { Router } from "express";
import { Request as AuthRequest } from "express-jwt";
import { protectedRoute } from "../utils/middlewares";
import BookController from "../controllers/books";
import ReviewsController from "../controllers/reviews";

//The router will be added as a middleware and will take control of requests starting with /books/:bookId/reviews.
const reviews = Router({ mergeParams: true });
export default reviews;

const bookController = new BookController();
const reviewsController = new ReviewsController();

reviews.get("/", async (req: AuthRequest, res) => {
  const bookId = req?.params?.bookId;

  if (!bookId) {
    return res
      .status(400)
      .send({ message: bookController.errors.BOOK_ID_MISSING });
  }

  try {
    const reviews = await reviewsController.getReviews(bookId);
    return res.json(reviews);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .send({ message: reviewsController.errors.UNKNOWN_ERROR });
  }
});

reviews.post("/", protectedRoute, async (req: AuthRequest, res) => {
  const bookId = req?.params?.bookId;
  const reviewBody = req?.body;
  const userName = req?.auth?.name;

  if (!bookId) {
    return res
      .status(400)
      .send({ message: bookController.errors.BOOK_ID_MISSING });
  }

  try {
    const { insertResult, updateResult } = await reviewsController.createReview(
      bookId,
      reviewBody,
      userName
    );
    return res.status(201).send({
      message: reviewsController.success.CREATED,
      insertResult,
      updateResult,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: reviewsController.errors.UNKNOWN_ERROR });
  }
});
