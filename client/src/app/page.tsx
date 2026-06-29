import React from 'react'
import { Star } from 'lucide-react'
import HeroSection from '@/component/layout/HeroSection'
import TopCategories from '@/component/layout/TopCategories'
import TestimonialSlider from '@/component/layout/TestimonialSlider'
import CourseSlider from '@/ui/CourseSlider'
import ContactUs from '@/component/layout/ContactUs'

type Props = {}

const stats = [
  { value: '12M+', label: 'Learners worldwide' },
  { value: '64,000+', label: 'Courses to explore' },
  { value: '4.8', label: 'Average course rating', star: true },
]

function StatsBand() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-2xl bg-text-primary px-6 py-12 sm:px-12">
          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-display text-5xl font-bold tracking-tight text-bg tnum md:text-6xl">
                    {s.value}
                  </span>
                  {s.star && (
                    <Star className="size-7 fill-brand text-brand" strokeWidth={1.75} />
                  )}
                </div>
                <span className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-light">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Homepage({}: Props) {
  return (
    <div className="bg-bg text-text-primary">
      <HeroSection/>
      <StatsBand/>
      <TopCategories/>
      <CourseSlider/>
      <TestimonialSlider/>
      <ContactUs/>
    </div>
  )
}

export default Homepage
