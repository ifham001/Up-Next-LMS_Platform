'use client';
import React from 'react';
import { User2 } from 'lucide-react';

interface Props {
  title:string
  tagline:string
  total_enrollment:number
  resources:number
  quizzez:number
  duration:number


}

const Header = ({title,tagline,quizzez,resources,total_enrollment,duration}:Props) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title?title:'Complete Web Development Bootcamp 2025'}</h1>
      <p className="text-gray-600 mt-10">
          {tagline?tagline:   'Master HTML, CSS, JavaScript, React, Node.js and more with practical projects. Go from beginner to professional web developer.'}      </p>
      <div className="flex items-center gap-2 text-sm text-gray-700">
       
        <span>• {total_enrollment?total_enrollment:245}  students</span>
        <span>• {duration?duration:12.5} hours of content</span>
        <span>• {resources?resources:25} resources</span>
        <span>• {quizzez?quizzez:42} activities</span>
      </div>
      
    </div>
  );
};

export default Header;