import { Hono } from "hono";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  updateProfileSchema,
  changePasswordSchema,
} from "../../controller/user/profile.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody } from "../../util/validate";

const profile = new Hono();

profile.get("/profile", authMiddleware, getMyProfile);
profile.put("/profile", authMiddleware, validateBody(updateProfileSchema), updateMyProfile);
profile.put(
  "/profile/password",
  authMiddleware,
  validateBody(changePasswordSchema),
  changeMyPassword
);

export default profile;
