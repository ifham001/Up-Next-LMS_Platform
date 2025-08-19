import { Hono } from "hono";
import { getVideo,addvideoProgress  } from "../../controller/user/progress.controller";
import { authMiddleware } from '../../util/authMiddleware'

const userProgress = new Hono() 

userProgress.post('/get-video-with-progress',authMiddleware,getVideo)
userProgress.post('/add-progress-to-video',addvideoProgress)





export default userProgress
