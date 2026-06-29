import { Hono } from "hono";
import { announceCourse, announceSchema } from "../../controller/admin/notification.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody } from "../../util/validate";

const announce = new Hono();

announce.post("/announce", authMiddleware, validateBody(announceSchema), announceCourse);

export default announce;
