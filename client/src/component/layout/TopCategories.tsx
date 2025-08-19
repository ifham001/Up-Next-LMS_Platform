'use client';

import React from 'react';
import { BookOpen, Briefcase, Palette, Brain } from 'lucide-react';

const categories = [
  {
    title: 'Development',
    icon: <BookOpen className="w-6 h-6" />,
    courses: '450+ Courses',
  },
  {
    title: 'Business',
    icon: <Briefcase className="w-6 h-6" />,
    courses: '320+ Courses',
  },
  {
    title: 'Design',
    icon: <Palette className="w-6 h-6" />,
    courses: '280+ Courses',
  },
  {
    title: 'Psychology',
    icon: <Brain className="w-6 h-6" />,
    courses: '190+ Courses',
  },
];

const TopCategories = () => {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-10">Explore Top Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                {category.icon}
              </div>
              <h3 className="font-medium">{category.title}</h3>
              <p className="text-sm text-gray-500">{category.courses}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
