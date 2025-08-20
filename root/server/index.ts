import { Hono } from 'hono'
import uploadCourse from './src/route/admin/upload-course'
import { cors } from 'hono/cors'
import authRoutes from './src/route/user/auth'
import managecourse from './src/route/admin/manage-course'
import userCourses from './src/route/user/course'
import cart from './src/route/user/cart'
import checkout from './src/route/user/checkout'
import userOrder from './src/route/user/order'
import userLearning from './src/route/user/learning'
import userProgress from './src/route/user/progress'
import userComments from './src/route/user/comments'
import quiz from './src/route/user/quiz'
import resource from './src/route/user/resource'
import getAllUsers from './src/route/admin/getAll-users'
import dashboard from './src/route/admin/admin-dashboard'
import adminAuth from './src/route/admin/admin-auth'






const app = new Hono()
app.use(
    "*",
    cors({
      origin: "*", // your frontend URL
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  );



//routes for admin

app.route('/admin',uploadCourse)
app.route('/admin',managecourse)
app.route('/admin',getAllUsers)
app.route('/admin',dashboard)
app.route('/admin',adminAuth)



//routes for user
app.route('/user',authRoutes)  
app.route('/user',userCourses) 
app.route('/user',cart)
app.route('/user',checkout)
app.route('/user',userOrder)
app.route('/user',userLearning)
app.route('/user',userProgress)
app.route('/user',userComments)
app.route('/user',quiz)
app.route('/user',resource)







export default {
  port: 3018,
  fetch: app.fetch,
}


process.on("SIGINT", () => {
    console.log("Shutting down server...");
    process.exit(0);
  });
  