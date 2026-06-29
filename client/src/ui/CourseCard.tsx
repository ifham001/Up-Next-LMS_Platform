'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { BookOpen, Clock, Users, Tag } from 'lucide-react';


type Props = {
  imageUrl: string | StaticImageData;
  lessons?: number;
  courseDuration: string;
  title: string;
  description: string;
  price: number; // discounted price (number)
  enrollments: number;
};

const CourseCard: React.FC<Props> = ({
  imageUrl,
  lessons = 0,
  courseDuration,
  title,
  description,
  price,
  enrollments,
}) => {
  const actualPrice = price + 500;
  const discountPercent = Math.round(((actualPrice - price) / actualPrice) * 100);

  return (
    <div className="card-interactive group min-w-[300px] max-w-[350px] flex-shrink-0 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-[180px] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 350px"
        />
        <span className="chip absolute top-3 left-3 bg-surface">
          <Tag size={12} strokeWidth={1.75} /> {discountPercent}% off
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} strokeWidth={1.75} /> <span className="tnum">{lessons}</span> lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} strokeWidth={1.75} /> <span className="tnum">{courseDuration}</span>
          </span>
        </div>

        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-dark">Course</span>
          <h3 className="font-display text-base font-semibold leading-snug text-text-primary line-clamp-2 mt-1">{title}</h3>
          <p className="text-sm mt-1.5 leading-relaxed text-text-secondary line-clamp-2">{description}</p>
        </div>

        <div className="divider" />

        <div className="flex items-center justify-between">
          <div className="inline-flex items-baseline gap-2">
            <span className="font-display tnum text-lg font-semibold text-text-primary">₹{price.toLocaleString()}</span>
            <span className="tnum text-sm font-medium text-text-muted line-through">₹{actualPrice.toLocaleString()}</span>
          </div>
          <div className="text-sm text-text-muted flex items-center gap-1.5">
            <Users size={14} strokeWidth={1.75} /> <span className="tnum">{enrollments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
