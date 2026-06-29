import { Context } from "hono";
import { z } from "zod";
import {
  addToWishlist,
  listWishlist,
  removeFromWishlist,
} from "../../queries/user/wishlist.queries";
import { getValidated } from "../../util/validate";
import { ok, created } from "../../util/response";
import { NotFoundError, UnauthorizedError } from "../../util/errors";

export const addWishlistSchema = z.object({
  courseId: z.string().uuid(),
});

export const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});

const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

// POST /user/wishlist — add a course to the wishlist.
export const addWishlistItem = async (c: Context) => {
  const userId = currentUserId(c);
  const { courseId } = getValidated<z.infer<typeof addWishlistSchema>>(c, "body");

  const result = await addToWishlist(userId, courseId);
  return created(c, result, result.message);
};

// GET /user/wishlist — list the caller's wishlist.
export const getWishlist = async (c: Context) => {
  const userId = currentUserId(c);
  const items = await listWishlist(userId);
  return ok(c, { items }, "Wishlist fetched");
};

// DELETE /user/wishlist/:courseId — remove a course from the wishlist.
export const deleteWishlistItem = async (c: Context) => {
  const userId = currentUserId(c);
  const { courseId } = getValidated<z.infer<typeof courseIdParamSchema>>(c, "params");

  const result = await removeFromWishlist(userId, courseId);
  if (!result.removed) throw new NotFoundError("Course not in wishlist");

  return ok(c, result, "Removed from wishlist");
};
