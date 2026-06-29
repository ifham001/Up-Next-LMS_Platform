import { Hono } from "hono";
import {
  addWishlistItem,
  getWishlist,
  deleteWishlistItem,
  addWishlistSchema,
  courseIdParamSchema,
} from "../../controller/user/wishlist.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody, validateParams } from "../../util/validate";

const wishlist = new Hono();

wishlist.post("/wishlist", authMiddleware, validateBody(addWishlistSchema), addWishlistItem);
wishlist.get("/wishlist", authMiddleware, getWishlist);
wishlist.delete(
  "/wishlist/:courseId",
  authMiddleware,
  validateParams(courseIdParamSchema),
  deleteWishlistItem
);

export default wishlist;
