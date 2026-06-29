'use client';
import React, { useState } from 'react';
import VideoThumbnail from '@/ui/VideoThumbnail';
import Button from '@/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { useRouter } from 'next/navigation';
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
  ShieldCheck,
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
  courseId,
}: Props) => {
  const userId = useSelector((state: RootState) => state.userAuth.userId);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const addToCartHandler = async () => {
    if (!userId) {
      dispatch(showNotification({ message: 'Please login before adding to cart', type: 'error' }));
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
            url: thumbnail_url,
          })
        );
      }
    }
  };

  const enrollHandler = async () => {
    if (!userId) {
      dispatch(showNotification({ message: 'Please login before enrolling', type: 'error' }));
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

  const includes = [
    { Icon: Play, label: `${course_duration} hours on-demand video` },
    { Icon: Download, label: `${resources} downloadable resources` },
    { Icon: Code, label: `${quizzez} coding exercises` },
    { Icon: Award, label: 'Certificate of completion' },
    { Icon: Infinity, label: 'Full lifetime access' },
    { Icon: Smartphone, label: 'Access on mobile and TV' },
  ];

  return (
    <aside className="card sticky top-6 w-full space-y-6 p-5 animate-fadeInUp delay-1 sm:p-6">
      {/* Video preview */}
      <div className="aspect-video overflow-hidden rounded-[var(--radius)] border border-border">
        <VideoThumbnail
          thumbnailUrl={thumbnail_url}
          duration={preview_video_duration}
          videoUrl={preview_video}
        />
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="tnum display text-4xl text-text-primary">₹{price.toLocaleString()}</span>
          <span className="tnum text-base text-text-muted line-through">
            ₹{originalPrice.toLocaleString()}
          </span>
        </div>
        <span className="chip border-success/30 bg-success-soft text-success">
          <span className="tnum">{discountPercentage}%</span> off
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="primary" fullWidth size="lg" onClick={enrollHandler}>
          Enroll now
        </Button>
        <Button variant="outline" fullWidth size="lg" onClick={addToCartHandler}>
          Add to cart
        </Button>
      </div>

      {/* Guarantee */}
      <div className="flex items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-surface-muted py-2.5">
        <ShieldCheck strokeWidth={1.75} className="h-4 w-4 text-success" />
        <p className="text-xs font-medium text-text-secondary">30-day money-back guarantee</p>
      </div>

      {/* Includes */}
      <div className="divider" />
      <div className="space-y-4">
        <p className="text-sm font-medium text-text-primary">This course includes</p>
        <ul className="space-y-3">
          {includes.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm text-text-secondary">
              <Icon strokeWidth={1.75} className="h-4 w-4 flex-shrink-0 text-brand-dark" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
