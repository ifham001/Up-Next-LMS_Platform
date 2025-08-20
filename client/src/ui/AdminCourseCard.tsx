'use client';

import React from 'react';
import Image from 'next/image';
import { MoreVertical, Users, Tag, Banknote } from 'lucide-react';

type Props = {
  id: string;
  thumbnail: string;
  title: string;
  price: string; // e.g., "₹499"
  studentsEnrolled: number;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onChangePrice: (id: string) => void;
  courseStatus:string
};

const AdminCourseCard: React.FC<Props> = ({
  id,
  thumbnail,
  title,
  price,
  studentsEnrolled,
  onDelete,
  onArchive,
  onChangePrice,
  courseStatus
}) => {
  // Parse number from price string
  const priceNumber = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  const totalRevenue = priceNumber * studentsEnrolled;

  return (
    <div className="group relative w-full max-w-sm rounded-2xl overflow-hidden border bg-white shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
      {/* Thumbnail */}
      <div className="relative h-[200px]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-gray-100 cursor-pointer p-2 group/menu relative">
            <MoreVertical className="w-5 h-5 text-gray-700" />
            {/* Dropdown */}
            <div className="hidden group-hover/menu:flex flex-col absolute right-0 top-8 bg-white border rounded-lg shadow-lg text-sm w-[160px] z-10 animate-fadeIn">
              <button
                className="px-4 py-2 hover:bg-gray-50 text-left"
                onClick={() => onDelete(id)}
              >
                ❌ Delete Course
              </button>
              <button
                className="px-4 py-2 hover:bg-gray-50 text-left"
                onClick={() => onArchive(id)}
              >
                📦 Archive Course
              </button>
              <button
                className="px-4 py-2 hover:bg-gray-50 text-left"
                onClick={() => onChangePrice(id)}
              >
                💰 Change Price
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div className='flex gap-5'>
        <h3 className="font-semibold text-lg leading-snug line-clamp-2 text-gray-900">
          {title}
        </h3>
        <p className='text-red-600'>{courseStatus}</p>
          
        </div>
       

        {/* Students */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-blue-500" />
          <span>{studentsEnrolled.toLocaleString()} enrolled</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <Tag className="w-4 h-4 text-indigo-500" />
          <span>{price}</span>
        </div>

        {/* Total Revenue */}
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
          <Banknote className="w-4 h-4 text-emerald-600" />
          <span>Total Revenue: ₹{totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseCard;
