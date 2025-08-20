import React from 'react'
import ExploreCourses from '@/component/explore/ExploreCourses'
import ClientOnly from '@/util/CilentOnly'

type Props = {}

function page({}: Props) {
  return (
    <ClientOnly>
       <ExploreCourses/>
    </ClientOnly>
   
  )
}

export default page