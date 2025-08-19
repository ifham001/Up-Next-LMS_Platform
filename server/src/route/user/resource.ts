import { Hono } from "hono";
import { resourceController } from "../../controller/user/resource.controller";
import { authMiddleware } from '../../util/authMiddleware'

const resource = new Hono()

resource.get('/get-resource/:resourceId',authMiddleware,resourceController)






export default resource