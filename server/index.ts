import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import { cors } from 'hono/cors';

import { env } from './src/config/env';
import { onError } from './src/util/errors';

const app = new Hono();

// Central error handler: any thrown AppError / ZodError / unknown error is
// translated to the canonical { success, message } response with the right
// status code here, instead of per-handler try/catch.
app.onError(onError);

// CORS middleware
app.use(

  cors({
    origin:'*', // your Vercel frontend
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // only if you’re using cookies/auth headers
  })
)
import uploadCourse from './src/route/admin/upload-course';
import authRoutes from './src/route/user/auth';
import managecourse from './src/route/admin/manage-course';
import userCourses from './src/route/user/course';
import cart from './src/route/user/cart';
import checkout from './src/route/user/checkout';
import userOrder from './src/route/user/order';
import userLearning from './src/route/user/learning';
import userProgress from './src/route/user/progress';
import userComments from './src/route/user/comments';
import quiz from './src/route/user/quiz';
import resource from './src/route/user/resource';
import getAllUsers from './src/route/admin/getAll-users';
import dashboard from './src/route/admin/admin-dashboard';
import adminAuth from './src/route/admin/admin-auth';
import review from './src/route/user/review';
import wishlist from './src/route/user/wishlist';
import certificate from './src/route/user/certificate';
import note from './src/route/user/note';
import notification from './src/route/user/notification';
import userCoupon from './src/route/user/coupon';
import passwordReset from './src/route/user/password-reset';
import profile from './src/route/user/profile';
import adminCoupon from './src/route/admin/coupon';
import adminAnnounce from './src/route/admin/announce';
// Admin routes
app.route('/admin', uploadCourse);
app.route('/admin', managecourse);
app.route('/admin', getAllUsers);
app.route('/admin', dashboard);
app.route('/admin', adminAuth);
app.route('/admin', adminCoupon);
app.route('/admin', adminAnnounce);

// User routes
app.route('/user', authRoutes);
app.route('/user', userCourses);
app.route('/user', cart);
app.route('/user', checkout);
app.route('/user', userOrder);
app.route('/user', userLearning);
app.route('/user', userProgress);
app.route('/user', userComments);
app.route('/user', quiz);
app.route('/user', resource);
app.route('/user', review);
app.route('/user', wishlist);
app.route('/user', certificate);
app.route('/user', note);
app.route('/user', notification);
app.route('/user', userCoupon);
app.route('/user', passwordReset);
app.route('/user', profile);

// Start server
serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`🚀 Hono server running on http://localhost:${env.PORT}`);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(1);
});
