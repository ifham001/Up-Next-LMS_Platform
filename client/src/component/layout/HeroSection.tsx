'use client';

import Button from '@/ui/Button';
import Image from 'next/image';
import heroImage from '../../../public/images/hero.jpg';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const route = useRouter()
  return (
    <section className="relative  h-[500px]  m-10">
      {/* Background Image */}
      <Image
        src={heroImage}
        alt="Learning Platform Banner"
        fill
        className="object-cover w-full h-full brightness-75 rounded-xl"
        priority
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-6">
          Learn Anything, Anytime,<br />Anywhere
        </h1>
        <p className="text-white mb-8 max-w-2xl">
          Discover thousands of courses taught by expert instructors. Take your skills to the next level with LMS UI Elegance.
        </p>
        <div className="flex gap-4">
          <Button className="px-6 py-2 bg-[#E0E722] text-white rounded-md font-medium">
            Get Started
          </Button>
         
          <button onClick={()=>{route.push('/explore')}} className=" bg-[#D22730] text-white px-6 py-2 rounded-md font-medium">
            Browse Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
