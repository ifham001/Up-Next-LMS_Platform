import { and, eq, desc, sql } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";

// Transaction handle type, derived from the db so the recompute helper can be
// called with the `tx` passed into dbDrizzle.transaction(...).
type Tx = Parameters<Parameters<typeof dbDrizzle.transaction>[0]>[0];
import { review } from "../../schema/user/review";
import { course } from "../../schema/admin/course";
import { userCourses } from "../../schema/user/userCourses";
import { user } from "../../schema/auth";

// Is the user enrolled in (owns) the course? Reviews are gated on enrollment.
export const isEnrolled = async (userId: string, courseId: string): Promise<boolean> => {
  const rows = await dbDrizzle
    .select({ id: userCourses.id })
    .from(userCourses)
    .where(and(eq(userCourses.userId, userId), eq(userCourses.courseId, courseId)))
    .limit(1);
  return rows.length > 0;
};

// Recompute the denormalised aggregate on the course row from the review table.
// `course.rating` is an integer column, so we store the rounded average and
// expose the precise average via the API where needed.
const recomputeCourseRating = async (
  tx: Tx,
  courseId: string
): Promise<{ averageRating: number; totalReviews: number }> => {
  const [agg] = await tx
    .select({
      avg: sql<number>`COALESCE(AVG(${review.rating}), 0)`.mapWith(Number),
      count: sql<number>`COUNT(${review.id})`.mapWith(Number),
    })
    .from(review)
    .where(eq(review.courseId, courseId));

  const averageRating = agg?.avg ?? 0;
  const totalReviews = agg?.count ?? 0;

  await tx
    .update(course)
    .set({ rating: Math.round(averageRating), total_reviews: totalReviews })
    .where(eq(course.id, courseId));

  return { averageRating, totalReviews };
};

// Create or update the caller's review for a course (idempotent per user+course).
export const upsertReview = async (
  userId: string,
  courseId: string,
  rating: number,
  comment?: string
) => {
  return dbDrizzle.transaction(async (tx) => {
    const [saved] = await tx
      .insert(review)
      .values({ userId, courseId, rating, comment })
      .onConflictDoUpdate({
        target: [review.userId, review.courseId],
        set: { rating, comment, updatedAt: new Date() },
      })
      .returning();

    const aggregate = await recomputeCourseRating(tx, courseId);
    return { review: saved, aggregate };
  });
};

// Delete the caller's review for a course, then recompute the aggregate.
export const deleteReview = async (userId: string, courseId: string) => {
  return dbDrizzle.transaction(async (tx) => {
    const deleted = await tx
      .delete(review)
      .where(and(eq(review.userId, userId), eq(review.courseId, courseId)))
      .returning();

    if (deleted.length === 0) return { deleted: false, aggregate: null };

    const aggregate = await recomputeCourseRating(tx, courseId);
    return { deleted: true, aggregate };
  });
};

// All reviews for a course, newest first, with reviewer name.
export const listReviewsByCourse = async (courseId: string) => {
  return dbDrizzle
    .select({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      userId: review.userId,
      name: user.name,
    })
    .from(review)
    .leftJoin(user, eq(review.userId, user.id))
    .where(eq(review.courseId, courseId))
    .orderBy(desc(review.createdAt));
};

// The caller's own review for a course (or undefined).
export const getMyReview = async (userId: string, courseId: string) => {
  const rows = await dbDrizzle
    .select()
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.courseId, courseId)))
    .limit(1);
  return rows[0];
};
