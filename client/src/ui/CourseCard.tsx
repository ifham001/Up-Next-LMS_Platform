'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import heroImage from '../../public/images/hero.jpg';
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
    <>
    
    <div className="min-w-[300px] max-w-[350px] rounded-xl overflow-hidden border bg-white shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0">
      {/* Image container must be relative when using `fill` */}
      <div className="relative h-[180px] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 350px"
        />

        {/* <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
          <Tag size={14} /> {discountPercent}% OFF
        </span> */}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <BookOpen size={14} /> {lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {courseDuration}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-lg leading-tight text-slate-800">{title}</h3>
          <p className="text-sm mt-1 text-slate-500 line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-green-600 font-bold text-lg flex items-center gap-2">
            ₹{price.toLocaleString()}
            <span className="text-sm text-slate-400 line-through">₹{actualPrice.toLocaleString()}</span>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <Users size={14} /> {enrollments} enrolled
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseCard;
