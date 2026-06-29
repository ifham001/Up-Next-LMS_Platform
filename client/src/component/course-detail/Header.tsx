'use client';
import React from 'react';
import Image from 'next/image';
import { Star, BookOpen, Clock, Users } from 'lucide-react';

interface Props {
  title: string;
  tagline: string;
  total_enrollment: number;
  resources: number;
  quizzez: number;
  duration: number;
}

const Header = ({ title, tagline, quizzez, resources, total_enrollment, duration }: Props) => {
  const enrollments = total_enrollment ? total_enrollment : 245;
  const hours = duration ? duration : 12.5;
  const lessonCount = resources ? resources : 25;
  const activities = quizzez ? quizzez : 42;
  const thumbnail = `https://picsum.photos/seed/${encodeURIComponent(title || 'course')}/1280/720`;

  return (
    <div className="animate-fadeInUp space-y-6">
      <div className="max-w-2xl space-y-4">
        <h1 className="display text-3xl leading-tight text-text-primary sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="leading-relaxed text-text-secondary">
          {tagline
            ? tagline
            : 'Learn HTML, CSS, JavaScript, React, and Node.js with practical projects, from the fundamentals to building production apps.'}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <Star size={15} strokeWidth={1.75} className="fill-brand text-brand" />
            <span className="tnum font-medium text-text-primary">4.7</span>
            <span className="text-text-muted">rating</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={15} strokeWidth={1.75} />
            <span className="tnum">{lessonCount}</span> lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={15} strokeWidth={1.75} />
            <span className="tnum">{hours}</span>h total
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={15} strokeWidth={1.75} />
            <span className="tnum">{enrollments.toLocaleString()}</span> enrolled
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="tnum">{activities}</span> activities
          </span>
        </div>
      </div>

      {/* Course thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-muted">
        <Image
          src={thumbnail}
          alt={`${title || 'Course'} cover`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </div>
    </div>
  );
};

export default Header;
