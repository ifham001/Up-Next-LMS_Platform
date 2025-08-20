import React from 'react'
import HeroSection from '@/component/layout/HeroSection'
import TopCategories from '@/component/layout/TopCategories'
import TestimonialSlider from '@/component/layout/TestimonialSlider'
import CourseSlider from '@/ui/CourseSlider'
import ContactUs from '@/component/layout/ContactUs'

type Props = {}

function Homepage({}: Props) {
  return (
    <div>
      <HeroSection/>
      <TopCategories/>
      <CourseSlider/>
      <TestimonialSlider/>
      <ContactUs/>
    </div>
  )
}

export default Homepage