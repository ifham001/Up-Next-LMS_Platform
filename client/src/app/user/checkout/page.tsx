"use client"
import { Checkout } from '@/component/checkout/Checkout'
import { withAuth } from '@/util/withAuth'
import React from 'react'


type Props = {}

function page({}: Props) {
  return (
    <>

        <Checkout/>
    
    
    </>
  )
}

export default withAuth(page) 