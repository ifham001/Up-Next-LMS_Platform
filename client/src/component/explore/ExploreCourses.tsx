'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { getAllCoursesApi } from '@/api/user/courses/courses';
import { BookOpen, Clock, Users, SearchX } from 'lucide-react';

type Course = {
  imageUrl?: string;
  lessons?: number;
  courseDuration: string;
  title: string;
  description: string;
  price: number; // Discounted price
  enrollments: number; // used for filtering
};
type ICourse = {
  title: string;
  course_duration: number;
  tagline: string;
  price: number;
  domain: string;
  total_enrollment: number;
  id: string;
  lessons: number;
  thumbnailUrl: string;
};

const categories = ['All', 'Information Technology', 'Marketing', 'Business', 'Management', 'Language'];

const CourseCardItem = ({ course }: { course: ICourse }) => {
  const originalPrice = course.price + 500;
  const thumbnail =
    course.thumbnailUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(course.title || course.id)}/640/360`;

  return (
    <div className="card-interactive group flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted">
        <Image
          src={thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {course.domain && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-surface/90 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-brand-dark backdrop-blur">
            {course.domain}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} strokeWidth={1.75} />
            <span className="tnum">{course.lessons}</span> lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} strokeWidth={1.75} />
            <span className="tnum">{course.course_duration}</span>h
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} strokeWidth={1.75} />
            <span className="tnum">{course.total_enrollment}</span>
          </span>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold leading-snug tracking-tight text-text-primary line-clamp-2">
            {course.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-2">
            {course.tagline}
          </p>
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <div className="inline-flex items-baseline gap-2">
            <span className="tnum font-display text-lg font-semibold text-text-primary">
              ₹{course.price.toLocaleString()}
            </span>
            <span className="tnum text-sm text-text-muted line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-sm font-medium text-brand-dark transition-colors group-hover:text-brand">
            View
          </span>
        </div>
      </div>
    </div>
  );
};

const CardSkeleton = () => (
  <div className="card flex h-full flex-col overflow-hidden p-0">
    <div className="skeleton aspect-[16/9] w-full rounded-none" />
    <div className="flex flex-1 flex-col gap-4 p-5">
      <div className="skeleton h-3 w-2/3 rounded" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="skeleton h-5 w-20 rounded" />
        <div className="skeleton h-4 w-10 rounded" />
      </div>
    </div>
  </div>
);

const ExploreCourses = () => {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain');
  const [isLoading, setIsLoading] = useState(false);
  const disptach = useDispatch();
  const [allCourse, setAllCourse] = useState<ICourse[]>([]);

  const filteredCourses =
    selectedDomain === 'All'
      ? allCourse
      : allCourse.filter((course) => course.domain === selectedDomain);

  const categoryHandler = (category: string) => {
    setSelectedDomain(category);
    router.push(`/explore?domain=${category}`);
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      const courses = await getAllCoursesApi(disptach, setIsLoading);

      if (courses.length > 0) {
        setAllCourse(courses);
      } else {
        setAllCourse([]);
      }
    };
    fetchAllCourses();
  }, []);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      {/* Page header — left aligned, sentence case */}
      <div className="mb-10 max-w-2xl animate-fadeInUp">
        <span className="eyebrow">Catalog</span>
        <h1 className="display mt-4 text-4xl leading-tight md:text-5xl">
          Explore <span className="text-accent">courses</span>
        </h1>
        <p className="mt-3 leading-relaxed text-text-secondary">
          Browse the catalog and filter by domain to find your next course.
        </p>
      </div>

      {/* Category filters as quiet chips */}
      <div className="scrollbar-hide mb-10 flex gap-2 overflow-x-auto animate-fadeInUp delay-1">
        {categories.map((category) => {
          const active = selectedDomain === category;
          return (
            <button
              key={category}
              onClick={() => categoryHandler(category)}
              aria-pressed={active}
              className={`chip flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                active ? 'chip-active' : ''
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Course grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id ?? index}
              href={`/explore/${course.id}`}
              className="block animate-fadeInUp focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-[var(--radius-lg)]"
            >
              <CourseCardItem course={course} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
          <span className="flex size-11 items-center justify-center rounded-full border border-brand-50 bg-brand-50 text-brand-dark">
            <SearchX size={20} strokeWidth={1.75} />
          </span>
          <p className="font-medium text-text-primary">No courses in this domain yet</p>
          <p className="max-w-sm text-sm text-text-secondary">
            Try a different category or check back soon as the catalog grows.
          </p>
          <button
            onClick={() => categoryHandler('All')}
            className="btn-primary mt-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            View all courses
          </button>
        </div>
      )}
    </section>
  );
};

export default ExploreCourses;
