'use client';

import React from 'react';
import CourseCard from './CourseCard';

const dummyCourses = [
  {
    title: 'React for Beginners',
    description: 'Learn the basics of React.js and start building web apps.',
    instructor: 'John Doe',
    price: '₹999',
    level: 'Beginner',
    lessons: 12,
  },
  {
    title: 'Next.js Masterclass',
    description: 'Deep dive into building full-stack apps with Next.js.',
    instructor: 'Jane Smith',
    price: '₹1499',
    level: 'Intermediate',
    lessons: 20,
  },
  {
    title: 'TypeScript Essentials',
    description: 'Master TypeScript for scalable frontend/backend apps.',
    instructor: 'Alice Johnson',
    price: '₹799',
    level: 'Beginner',
    lessons: 10,
  },
  {
    title: 'Node.js + Express API Bootcamp',
    description: 'Build fast and secure RESTful APIs using Node.js.',
    instructor: 'Chris Martin',
    price: '₹1299',
    level: 'Advanced',
    lessons: 18,
  },
  {
    title: 'MongoDB Crash Course',
    description: 'Learn how to use MongoDB with real-world examples.',
    instructor: 'Robert Greene',
    price: '₹699',
    level: 'Beginner',
    lessons: 8,
  },
];

const CourseSlider = () => {
  return (
    <div className="w-full px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Explore Courses</h2>
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
        {dummyCourses.map((course, index) => (
          <CourseCard key={index} {...course} level={course.level as "Beginner" | "Intermediate" | "Advanced"} />
        ))}
      </div>
    </div>
  );
};

export default CourseSlider;
