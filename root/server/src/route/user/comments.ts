import { Hono } from 'hono'
import {getAllCommentsByVideo,addNewComment,addReplyComment} from '../../controller/user/comments.controller'
import { authMiddleware } from '../../util/authMiddleware'


const userComments= new Hono();


userComments.post('/add-new-comment',authMiddleware,addNewComment)
userComments.post('/add-reply-comment',authMiddleware,addReplyComment)
userComments.get('/get-all-comments/:videoId',authMiddleware,getAllCommentsByVideo)






export default userComments