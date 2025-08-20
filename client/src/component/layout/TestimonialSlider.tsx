'use client';

import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import Image from 'next/image';

type Testimonial = {
  name: string;
  role: string;
  image: string;
  feedback: string;
  rating: number; // e.g., 4.5
};

const testimonials: Testimonial[] = [
  {
    name: 'Alex Thompson',
    role: 'Web Developer',
    image: '/avatars/alex.png', // Replace with your actual image path
    feedback:
      'The courses on LMS UI Elegance have completely transformed my career. The instructors are knowledgeable and the content is up-to-date with industry standards.',
    rating: 5,
  },
  {
    name: 'Emily Parker',
    role: 'UX Designer',
    image: '/avatars/emily.png',
    feedback:
      "I've taken several design courses and the quality of instruction is exceptional. The platform is intuitive and makes learning enjoyable.",
    rating: 4.5,
  },
  {
    name: 'David Wilson',
    role: 'Marketing Specialist',
    image: '/avatars/david.png',
    feedback:
      'The digital marketing courses helped me double my client base in just three months. The practical approach and case studies were incredibly valuable.',
    rating: 5,
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-black text-black" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-black text-black" />);
  }

  return <div className="flex mt-3">{stars}</div>;
};

const TestimonialSlider = () => {
  return (
    <div className="bg-[#f9fafb] py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-10">What Our Students Say</h2>

      <div className="flex space-x-6 overflow-x-auto scrollbar-hide px-4">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="min-w-[300px] max-w-[380px] bg-white shadow rounded-xl p-6 flex-shrink-0"
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={t.image}
                alt={t.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">"{t.feedback}"</p>
            {renderStars(t.rating)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
