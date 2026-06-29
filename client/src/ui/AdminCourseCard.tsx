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
  courseStatus: string;
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
  courseStatus,
}) => {
  // Parse number from price string
  const priceNumber = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  const totalRevenue = priceNumber * studentsEnrolled;

  return (
    <div className="card-interactive group relative w-full max-w-sm flex-shrink-0 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />

        {/* Status chip */}
        <span className="chip absolute top-3 left-3 bg-surface text-text-secondary">
          {courseStatus}
        </span>

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <div className="grid place-items-center size-9 rounded-full border border-border bg-surface hover:border-border-strong cursor-pointer group/menu relative transition-colors">
            <MoreVertical className="w-5 h-5 text-text-secondary" strokeWidth={1.75} />
            {/* Dropdown */}
            <div className="hidden group-hover/menu:flex flex-col absolute right-0 top-10 card text-sm w-[170px] z-10 overflow-hidden p-1.5 shadow-md animate-fadeIn">
              <button
                className="px-3 py-2.5 rounded-md text-text-secondary hover:bg-surface-muted hover:text-error text-left transition-colors"
                onClick={() => onDelete(id)}
              >
                Delete course
              </button>
              <button
                className="px-3 py-2.5 rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary text-left transition-colors"
                onClick={() => onArchive(id)}
              >
                Archive course
              </button>
              <button
                className="px-3 py-2.5 rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary text-left transition-colors"
                onClick={() => onChangePrice(id)}
              >
                Change price
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <h3 className="font-display text-base font-semibold leading-snug line-clamp-2 text-text-primary">
          {title}
        </h3>

        {/* Stat row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="surface-muted rounded-md p-3 border border-border">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Users className="w-3.5 h-3.5" strokeWidth={1.75} /> Enrolled
            </div>
            <div className="tnum text-base font-semibold text-text-primary mt-1">{studentsEnrolled.toLocaleString()}</div>
          </div>
          <div className="surface-muted rounded-md p-3 border border-border">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Tag className="w-3.5 h-3.5" strokeWidth={1.75} /> Price
            </div>
            <div className="tnum text-base font-semibold text-text-primary mt-1">{price}</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="flex items-center gap-2.5 rounded-md border border-border surface-muted px-4 py-3">
          <Banknote className="w-4 h-4 text-success" strokeWidth={1.75} />
          <span className="text-sm text-text-secondary">Total revenue</span>
          <span className="tnum text-sm font-semibold text-text-primary ml-auto">₹{totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseCard;
