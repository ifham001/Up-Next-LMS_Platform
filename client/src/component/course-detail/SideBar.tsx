'use client';
import React, { useState } from 'react';
import VideoThumbnail from '@/ui/VideoThumbnail';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { useRouter } from 'next/navigation';
import Button from '@/ui/Button';
import { showNotification } from '@/store/slices/common/notification-slice';
import { addToCartApi } from '@/api/user/cart/cart';
import Loading from '@/ui/Loading';
import { addToCart } from '@/store/slices/user/addToCart-slice';
import { 
  Play, 
  Download, 
  Code, 
  Award, 
  Infinity, 
  Smartphone,
  ShieldCheck 
} from 'lucide-react';

interface Props {
  course_duration: number;
  resources: number;
  quizzez: number;
  price: number;
  preview_video: string;
  preview_video_duration: number;
  thumbnail_url: string;
  courseId: string;
}

const Sidebar = ({
  course_duration,
  resources,
  quizzez,
  price,
  preview_video,
  preview_video_duration,
  thumbnail_url,
  courseId
}: Props) => {
  const userId = useSelector((state: RootState) => state.userAuth.userId);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const addToCartHandler = async () => {
    if (!userId) {
      dispatch(showNotification({ message: "Please login before adding to cart", type: "error" }));
      return router.push('/auth');
    }
    if (userId) {
      const addingToCart = await addToCartApi(userId, courseId, dispatch, setIsLoading);
      if (addingToCart) {
        return dispatch(
          addToCart({
            courseId,
            title: 'dummy_title',
            tagline: 'dummy_tag_line',
            id: 'dummy_item_id',
            price,
            url: thumbnail_url
          })
        );
      }
    }
  };

  const enrollHandler = async () => {
    if (!userId) {
      dispatch(showNotification({ message: "Please login before enrolling", type: "error" }));
      return router.push('/auth');
    }
    if (userId) {
      const addingToCart = await addToCartApi(userId, courseId, dispatch, setIsLoading);

      if (addingToCart) {
        router.push(`/user/cart`);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const discountedPrice = price;
  const originalPrice = price + 500;
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <aside className="bg-white p-3 sm:p-4 shadow-lg rounded-lg w-full md:w-72 lg:w-80 space-y-3 sm:space-y-4 sticky top-4">
      {/* Video Preview */}
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <VideoThumbnail
          thumbnailUrl={thumbnail_url}
          duration={preview_video_duration}
          videoUrl={preview_video}
        />
      </div>

      {/* Pricing Section */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{price}</span>
          <span className="text-base sm:text-lg text-gray-500 line-through">₹{originalPrice}</span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
            {discountPercentage}% OFF
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={enrollHandler}
          className="w-full bg-[#8c52ff] hover:bg-[#7841df] text-white py-2.5 rounded-lg
                     font-semibold text-sm
                     transition-all duration-200 ease-in-out
                     hover:shadow-lg hover:-translate-y-0.5
                     active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:ring-offset-2"
        >
          Enroll Now
        </button>

        <button
          onClick={addToCartHandler}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 
                     hover:border-[#8c52ff] py-2.5 rounded-lg
                     font-semibold text-sm
                     transition-all duration-200 ease-in-out
                     hover:shadow-md
                     active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:ring-offset-2"
        >
          Add To Cart
        </button>
      </div>

      {/* Money-Back Guarantee */}
      <div className="flex items-center gap-2 justify-center py-2 bg-green-50 rounded-lg">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <p className="text-xs font-medium text-green-700">
          30-Day Money-Back Guarantee
        </p>
      </div>

      {/* Course Includes Section */}
      <div className="pt-2 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">
          This course includes:
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
            <Play className="w-4 h-4 text-[#8c52ff] flex-shrink-0 mt-0.5" />
            <span>{course_duration} hours on-demand video</span>
          </li>
          <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
            <Download className="w-4 h-4 text-[#8c52ff] flex-shrink-0 mt-0.5" />
            <span>{resources} downloadable resources</span>
          </li>
          <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
            <Code className="w-4 h-4 text-[#8c52ff] flex-shrink-0 mt-0.5" />
            <span>{quizzez} coding exercises</span>
          </li>
          <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
            <Award className="w-4 h-4 text-[#8c52ff] flex-shrink-0 mt-0.5" />
            <span>Certificate of completion</span>
          </li>
          <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
            <Infinity className="w-4 h-4 text-[#8c52ff] flex-shrink-0 mt-0.5" />
            <span>Full lifetime access</span>
          </li>
          <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
            <Smartphone className="w-4 h-4 text-[#8c52ff] flex-shrink-0 mt-0.5" />
            <span>Access on mobile and TV</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;