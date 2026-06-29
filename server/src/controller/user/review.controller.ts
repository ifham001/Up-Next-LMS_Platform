import { Context } from "hono";
import { z } from "zod";
import {
  upsertReview,
  deleteReview,
  listReviewsByCourse,
  getMyReview,
  isEnrolled,
} from "../../queries/user/review.queries";
import { getValidated } from "../../util/validate";
import { ok, created } from "../../util/response";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../util/errors";

export const upsertReviewSchema = z.object({
  courseId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});

// The authenticated user's id comes from the verified JWT, never from the body.
const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

// POST /user/reviews — create or update the caller's review (enrollment-gated).
export const submitReview = async (c: Context) => {
  const userId = currentUserId(c);
  const { courseId, rating, comment } =
    getValidated<z.infer<typeof upsertReviewSchema>>(c, "body");

  if (!(await isEnrolled(userId, courseId))) {
    throw new ForbiddenError("You must be enrolled in this course to review it");
  }

  const result = await upsertReview(userId, courseId, rating, comment);
  return created(c, result, "Review saved");
};

// GET /user/reviews/:courseId — public list of reviews + aggregate.
export const getCourseReviews = async (c: Context) => {
  const { courseId } = getValidated<z.infer<typeof courseIdParamSchema>>(c, "params");
  const reviews = await listReviewsByCourse(courseId);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  return ok(
    c,
    { reviews, averageRating: Number(averageRating.toFixed(2)), totalReviews },
    "Reviews fetched"
  );
};

// GET /user/reviews/:courseId/me — the caller's own review (or null).
export const getOwnReview = async (c: Context) => {
  const userId = currentUserId(c);
  const { courseId } = getValidated<z.infer<typeof courseIdParamSchema>>(c, "params");
  const myReview = await getMyReview(userId, courseId);
  return ok(c, { review: myReview ?? null }, "Review fetched");
};

// DELETE /user/reviews/:courseId — remove the caller's review.
export const removeReview = async (c: Context) => {
  const userId = currentUserId(c);
  const { courseId } = getValidated<z.infer<typeof courseIdParamSchema>>(c, "params");

  const result = await deleteReview(userId, courseId);
  if (!result.deleted) throw new NotFoundError("You have not reviewed this course");

  return ok(c, result, "Review deleted");
};
