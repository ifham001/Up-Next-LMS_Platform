'use client';
import React from 'react';

interface Props {
  description: string;
}

const CourseDescription = ({ description }: Props) => {
  return (
    <section className="animate-fadeInUp space-y-4">
      <h2 className="display text-2xl text-text-primary">About this course</h2>
      <p className="max-w-[65ch] leading-relaxed text-text-secondary">
        {description
          ? description
          : 'This bootcamp covers everything you need to become a working web developer, with over 40 hours of content. You will build real projects, learn the fundamentals deeply, and practice the same workflows used on production teams.'}
      </p>
    </section>
  );
};

export default CourseDescription;
