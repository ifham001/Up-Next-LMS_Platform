"use client";

import React from "react";

export default function AboutUs() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="max-w-2xl animate-fadeInUp">
        <span className="eyebrow">Our story</span>
        <h1 className="display mt-3 text-4xl font-semibold text-text-primary md:text-5xl">
          About <span className="text-accent">UpNext</span>
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Editorial copy */}
        <div className="lg:col-span-7 animate-fadeInUp delay-1">
          <div className="max-w-[65ch] space-y-5 text-base leading-relaxed text-text-secondary">
            <p className="text-lg font-medium text-text-primary">
              UpNext is a learning platform built to make good courses easier to find,
              follow, and finish. We work with practitioners who teach the way they work,
              so the material reflects what teams actually do.
            </p>
            <p>
              Learners can browse courses, track their progress lesson by lesson, and pick
              up where they left off. Instructors get straightforward tools to build,
              publish, and update their courses without fighting the software.
            </p>
            <p>
              We keep the product focused: clear navigation, honest course descriptions, and
              no busywork between you and the next lesson. That is the whole idea.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="lg:col-span-5 animate-fadeInUp delay-2">
          <div className="overflow-hidden rounded-xl border border-border bg-surface-muted">
            <img
              src="https://picsum.photos/seed/upnext-team-collaboration-studio/1000/900"
              alt="A small team working together at a shared desk"
              className="aspect-[10/9] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
