'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const TRENDING = ['Python', 'UX Design', 'Public Speaking', 'Excel', 'Photography', 'Marketing'];

const MARQUEE = [
  { tag: 'Data Science', title: 'Python for Data Science', seed: 'python-data' },
  { tag: 'Design', title: 'UX Foundations', seed: 'ux-foundations' },
  { tag: 'Business', title: 'Negotiation Mastery', seed: 'negotiation' },
  { tag: 'Creative', title: 'Photography Basics', seed: 'photography' },
  { tag: 'Communication', title: 'Public Speaking', seed: 'speaking' },
  { tag: 'Productivity', title: 'Advanced Excel', seed: 'excel' },
];

const HeroSection = () => {
  const route = useRouter();
  const [query, setQuery] = useState('');

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    route.push(query ? `/explore?domain=All` : '/explore');
  };

  return (
    <section className="relative overflow-hidden">
      {/* Ghost wordmark watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="ghost-wordmark -mt-[4vw] text-[22vw]">UpNext</span>
      </div>
      {/* Warm glow */}
      <div className="hero-glow left-1/2 top-[-8%] h-[62%] w-[62%] -translate-x-1/2" />

      {/* Centered content */}
      <div className="relative mx-auto max-w-[900px] px-6 pb-9 pt-20 text-center">
        <span className="eyebrow animate-fadeInUp">12M+ learners · 64,000+ courses</span>

        <h1 className="display mx-auto mt-6 text-[clamp(48px,7vw,84px)] text-text-primary animate-fadeInUp delay-1">
          What will you
          <br />
          learn <span className="text-accent">next?</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary animate-fadeInUp delay-1 sm:text-xl">
          One search away from a new skill, a new hobby, or a whole new career. Taught by coaches who&apos;ve actually done it.
        </p>

        {/* Search bar */}
        <form
          onSubmit={onSearch}
          className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-surface p-2.5 shadow-md animate-fadeInUp delay-2"
        >
          <div className="flex flex-1 items-center gap-2.5 pl-3">
            <Search className="h-5 w-5 text-text-muted" strokeWidth={2.2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “Python”, “design”, “public speaking”…"
              aria-label="Search courses"
              className="w-full bg-transparent text-base font-medium text-text-primary outline-none placeholder:text-input-placeholder"
            />
          </div>
          <button type="submit" className="btn-primary px-7 py-3 text-base font-semibold">
            Search
          </button>
        </form>

        {/* Trending pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 animate-fadeInUp delay-2">
          <span className="text-sm font-semibold text-text-muted">Trending:</span>
          {TRENDING.map((term) => (
            <button
              key={term}
              onClick={() => route.push('/explore')}
              className="chip"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Masked auto-scrolling course marquee */}
      <div
        className="overflow-hidden pb-16 pt-8"
        style={{
          WebkitMaskImage:
            'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
          maskImage:
            'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
        }}
      >
        <div className="flex w-max gap-[18px] animate-marquee">
          {[...MARQUEE, ...MARQUEE].map((c, i) => (
            <div
              key={`${c.seed}-${i}`}
              className="w-[248px] flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/upnext-${c.seed}/400/250`}
                  alt={c.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-4 pb-4 pt-3">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-dark">
                  {c.tag}
                </div>
                <div className="mt-1.5 font-display text-[15px] font-semibold leading-tight text-text-primary">
                  {c.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
