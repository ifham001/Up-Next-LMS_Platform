import { and, eq, desc } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { wishlistItems } from "../../schema/user/wishlist";
import { course } from "../../schema/admin/course";
import { userCourses } from "../../schema/user/userCourses";

// Add a course to the user's wishlist. Blocks already-owned courses and
// silently no-ops on duplicates (idempotent).
export const addToWishlist = async (userId: string, courseId: string) => {
  const owned = await dbDrizzle
    .select({ id: userCourses.id })
    .from(userCourses)
    .where(and(eq(userCourses.userId, userId), eq(userCourses.courseId, courseId)))
    .limit(1);

  if (owned.length > 0) {
    return { added: false, message: "You already own this course" as const };
  }

  const [item] = await dbDrizzle
    .insert(wishlistItems)
    .values({ userId, courseId })
    .onConflictDoNothing({ target: [wishlistItems.userId, wishlistItems.courseId] })
    .returning();

  if (!item) {
    return { added: false, message: "Course is already in your wishlist" as const };
  }

  return { added: true, message: "Added to wishlist" as const, item };
};

// List the user's wishlist with course detail, newest first.
export const listWishlist = async (userId: string) => {
  return dbDrizzle
    .select({
      id: wishlistItems.id,
      courseId: course.id,
      title: course.title,
      tagline: course.tagline,
      price: course.price,
      thumbnailUrl: course.thumbnail,
      addedAt: wishlistItems.addedAt,
    })
    .from(wishlistItems)
    .innerJoin(course, eq(wishlistItems.courseId, course.id))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.addedAt));
};

// Remove a course from the user's wishlist. Scoped to the owner so one user
// cannot delete another's wishlist row.
export const removeFromWishlist = async (userId: string, courseId: string) => {
  const deleted = await dbDrizzle
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.courseId, courseId)))
    .returning();

  return { removed: deleted.length > 0 };
};
