// schema/index.ts
import { course } from "./admin/course";
import { admin , user, authType} from "./auth";
import { resource } from "./admin/resource";
import { section } from "./admin/section";
import { video } from "./admin/video";
import { quiz } from "./admin/quiz";
import { quizQuestion } from "./admin/quiz";
import { quizQuestionOption } from "./admin/quiz";
import { courseStatus } from "./admin/course";
import { sectionStatus } from "./admin/section";
import { sectionItem } from "./admin/section";
import { contentTypes } from "./admin/section";
import { domain } from "./admin/course";
import { checkout, paymentStatus, paymentModeEnum } from "./user/checkout";
import { userCourses } from "./user/userCourses";
import { cartItems } from "./user/cart";
import { Progress } from "./user/course-progress";
import { comment, commentRelations,subComment,subCommentRelations } from "./user/comments";
import { review, reviewRelations } from "./user/review";
import { wishlistItems } from "./user/wishlist";
import {
  quizAttempt,
  quizAnswer,
  quizAttemptRelations,
  quizAnswerRelations,
} from "./user/quiz-attempt";
import { certificate, certificateRelations } from "./user/certificate";
import { note, noteRelations } from "./user/note";
import {
  notification,
  notificationType,
  notificationRelations,
} from "./user/notification";
import {
  coupon,
  couponRedemption,
  discountType,
  couponRelations,
  couponRedemptionRelations,
} from "./admin/coupon";
import { passwordResetToken, resetRole } from "./user/password-reset";



export {
  domain,
  admin,
  user,
  authType,
  course,
  resource,
  section,
  video,
  quiz,
  quizQuestion,
  quizQuestionOption,
  courseStatus,
  sectionStatus,
  sectionItem,
  contentTypes,
  userCourses,
  checkout,
  paymentModeEnum,
  paymentStatus,
  cartItems,
  Progress,
  comment,
  commentRelations,
  subComment,
  subCommentRelations,
  review,
  reviewRelations,
  wishlistItems,
  quizAttempt,
  quizAnswer,
  quizAttemptRelations,
  quizAnswerRelations,
  certificate,
  certificateRelations,
  note,
  noteRelations,
  notification,
  notificationType,
  notificationRelations,
  coupon,
  couponRedemption,
  discountType,
  couponRelations,
  couponRedemptionRelations,
  passwordResetToken,
  resetRole
};
