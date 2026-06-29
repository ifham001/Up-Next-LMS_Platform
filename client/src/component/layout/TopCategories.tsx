'use client';

import React from 'react';
import { BookOpen, Briefcase, Palette, Brain, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    title: 'Development',
    Icon: BookOpen,
    blurb: 'Frontend, backend, mobile and the tooling around them.',
  },
  {
    title: 'Business',
    Icon: Briefcase,
    blurb: 'Operations, finance and the basics of running a team.',
  },
  {
    title: 'Design',
    Icon: Palette,
    blurb: 'Product, interface and visual design from the ground up.',
  },
  {
    title: 'Psychology',
    Icon: Brain,
    blurb: 'How people think, decide and learn over time.',
  },
];

const TopCategories = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 max-w-2xl animate-fadeInUp">
          <span className="eyebrow">Find your path</span>
          <h2 className="display mt-3 text-3xl font-semibold text-text-primary md:text-4xl">
            Browse by <span className="text-accent">category</span>
          </h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            Find the right path for your goals across our most popular subject areas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ title, Icon, blurb }, idx) => (
            <a
              key={title}
              href="/explore"
              className={`card-interactive group flex flex-col gap-4 p-6 animate-fadeInUp delay-${(idx % 3) + 1}`}
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-dark transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <ArrowUpRight
                  className="size-4 text-text-muted transition-colors group-hover:text-brand-dark"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-text-primary">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{blurb}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
