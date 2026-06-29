'use client';

import React from 'react';
import { Star, StarHalf, Quote } from 'lucide-react';

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
    image: '/avatars/alex.png',
    feedback:
      'The courses changed how I work. The instructors know their field and the material keeps pace with what teams actually use.',
    rating: 5,
  },
  {
    name: 'Emily Parker',
    role: 'UX Designer',
    image: '/avatars/emily.png',
    feedback:
      'I have taken several design courses here. The instruction is clear and the platform stays out of the way while you learn.',
    rating: 4.5,
  },
  {
    name: 'David Wilson',
    role: 'Marketing Specialist',
    image: '/avatars/david.png',
    feedback:
      'The marketing track helped me grow my client base in a few months. The case studies were the most useful part.',
    rating: 5,
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`star-${i}`} className="size-4 fill-brand text-brand" strokeWidth={1.75} />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half-star" className="size-4 fill-brand text-brand" strokeWidth={1.75} />);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">{stars}</div>
      <span className="font-display text-sm font-semibold text-text-primary tnum">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const TestimonialSlider = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 max-w-2xl animate-fadeInUp">
          <span className="eyebrow">In their words</span>
          <h2 className="display mt-3 text-3xl font-semibold text-text-primary md:text-4xl">
            What learners say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <figure
              key={index}
              className={`card-interactive flex flex-col p-6 animate-fadeInUp delay-${index + 1}`}
            >
              <Quote className="size-7 text-brand" strokeWidth={1.75} />
              <blockquote className="mt-4 text-base leading-relaxed text-text-primary">
                {t.feedback}
              </blockquote>
              <div className="mt-5">{renderStars(t.rating)}</div>
              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-bold text-brand-dark">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-medium text-text-primary">{t.name}</div>
                  <div className="text-sm text-text-muted">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
