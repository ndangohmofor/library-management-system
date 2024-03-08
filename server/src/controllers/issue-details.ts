import { UpdateResult } from "mongodb";
import { collections } from "../database";
import {
  BorrowedBook,
  issueDetail,
  IssueDetailType,
  Reservation,
  ReservationBook,
  ReservationUser,
} from "../models/issue-details";

import BookController from "./books";
import UserController from "./user";
import { User } from "../models/user";
import { Book } from "../models/book";

const bookController = new BookController();
const userController = new UserController();

class ReservationController {
  errors = {
    MISSING_ID: "Reservation id is missing",
    MISSING_DETAILS: "Reservation details are missing",
    NOT_FOUND: "Reservation not found",
    ADMIN_ONLY: "This operation is only allowed for admins",
    INVALID_TYPE: "Invalid type",
    ALREADY_RETURNED: "Book is already returned",
    ALREADY_BOOKED: "Books is already booked",
    INVALID_USER_ID: "Invalid user id",
    INVALID_BOOK_ID: "Invalid book id",
  };
}
