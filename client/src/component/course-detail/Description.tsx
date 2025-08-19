'use client';
import React from 'react';

interface Props{
  description:string
}

const CourseDescription = ({description}:Props) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">Description</h3>
      <p className="text-gray-700">
{ description?description:'Welcome to the Complete Web Development Bootcamp, the only course you need to learn web development in 2025. With over 42 hours of content, this comprehensive course covers everything you need to know to become a professional web developer.'}      </p>
    </div>
  );
};

export default CourseDescription;