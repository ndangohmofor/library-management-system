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
  success = {
    CREATED: "Reservation created",
    CANCELLED: "Reservation cancelled",
  };

  RESERVATION_DURATION = 0.5; //0.5 days -> 12 hours
  BORROWED_DURATION = 21; // days

  private async getPagedIssueDetails(
    type: IssueDetailType,
    limit = 50,
    skip = 0
  ) {
    const filter = {
      recordType:
        type === IssueDetailType.BorrowedBook ? "borrowedBook" : "reservation",
    };

    const sortField =
      type === IssueDetailType.BorrowedBook ? "borrowDate" : "expirationDate";

    const aggregationResult = await collections?.issueDetail
      ?.aggregate([
        {
          $match: filter,
        },
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            data: [
              { $sort: { [sortField]: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
          },
        },
      ])
      .toArray();

    if (!aggregationResult || aggregationResult.length === 0) {
      return [];
    } else {
      return {
        data: aggregationResult[0]?.data,
        totalCount: aggregationResult[0]?.metadata[0]?.totalCount,
      };
    }
  }

  private async getIssueDetailForUser(userId: string, type: IssueDetailType) {
    const filter = {
      _id: new RegExp(`^${userId}${type}`),
    };

    if (type === IssueDetailType.BorrowedBook) {
      filter["returned"] = false;
    }

    const issueDetails = await collections?.issueDetails
      ?.find(filter)
      .toArray();
    return issueDetails;
  }

  private getDueDate(type: string) {
    const now = Date.now();
    const daysInMs = 1000 * 60 * 60 * 24;
    const duration =
      type === IssueDetailType.Reservation
        ? this.RESERVATION_DURATION
        : this.BORROWED_DURATION;
    const dueDate = new Date(now + daysInMs * duration);
    return new Date(dueDate);
  }

  private getIssueDetailsId(bookId: string, userId: string, type: string) {
    return `${userId}${type}${bookId}`;
  }

  private getReservationId(bookId: string, userId: string) {
    return this.getIssueDetailsId(bookId, userId, IssueDetailType.Reservation);
  }

  private getBorrowedBookId(bookId: string, userId: string) {
    return this.getIssueDetailsId(bookId, userId, IssueDetailType.BorrowedBook);
  }
}
