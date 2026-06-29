import { Hono } from "hono";
import {
  submitReview,
  getCourseReviews,
  getOwnReview,
  removeReview,
  upsertReviewSchema,
  courseIdParamSchema,
} from "../../controller/user/review.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody, validateParams } from "../../util/validate";

const review = new Hono();

// Create or update the caller's review (enrollment-gated, auth required).
review.post("/reviews", authMiddleware, validateBody(upsertReviewSchema), submitReview);

// The caller's own review for a course.
review.get(
  "/reviews/:courseId/me",
  authMiddleware,
  validateParams(courseIdParamSchema),
  getOwnReview
);

// Public: all reviews + aggregate for a course.
review.get("/reviews/:courseId", validateParams(courseIdParamSchema), getCourseReviews);

// Delete the caller's review for a course.
review.delete(
  "/reviews/:courseId",
  authMiddleware,
  validateParams(courseIdParamSchema),
  removeReview
);

export default review;
