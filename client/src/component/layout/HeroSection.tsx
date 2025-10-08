'use client';

import Button from '@/ui/Button';
import Image from 'next/image';
import study from '../../../public/images/study.png';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Award } from 'lucide-react';

const HeroSection = () => {
  const route = useRouter();
  
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:mt-10 sm:py-12 lg:py-16 xl:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Main Container - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Image Section - First on mobile, second on desktop */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[350px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-full lg:-mt-20 ">
              <Image
                src={study}
                alt="Student learning online"
                className="w-full h-auto"
                priority
                sizes="(max-width: 640px) 350px, (max-width: 768px) 450px, (max-width: 1024px) 500px, 600px"
              />
            </div>
          </div>

          {/* Text Content Section - Second on mobile, first on desktop */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Heading */}
            <h1 className="text-gray-700 text-4xl sm:text-5xl lg:text-6xl font-bold leading-8 lg:leading-12">
              Learn Anything,{' '}
              <span className="block mt-1 sm:mt-2">Anytime,</span>
              <span className="block mt-1 sm:mt-2 text-[#8c52ff]">Anywhere.</span>
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-base  sm:text-m lg:text-l max-w-xl leading-5">
              Discover thousands of courses taught by expert instructors. Take your skills to the next level with LMS UI Elegance.
            </p>

            {/* CTA Button */}
            <div className="pt-2 w-full sm:w-auto">
              <button
                onClick={() => { route.push('/explore') }}
                className="bg-[#8c52ff] text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 
                          w-full sm:w-auto sm:min-w-[220px]
                          rounded-md font-medium text-sm sm:text-base
                          transition-all duration-200 ease-in-out
                          hover:bg-[#7841df] hover:shadow-lg hover:-translate-y-0.5
                          active:scale-95 active:shadow-md
                          focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:ring-offset-2"
              >
                Browse Courses
              </button>
            </div>

            {/* Stats Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10 pt-4 sm:pt-6 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12  bg-opacity-10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#8c52ff]" />
                </div>
                <div>
                  <p className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">500+</p>
                  <p className="text-xs sm:text-sm text-gray-700">Courses</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12  bg-opacity-10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#8c52ff]" />
                </div>
                <div>
                  <p className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">10K+</p>
                  <p className="text-xs sm:text-sm text-gray-700">Students</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-opacity-10 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#8c52ff]" />
                </div>
                <div>
                  <p className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">50+</p>
                  <p className="text-xs sm:text-sm text-gray-700">Instructors</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;