"use client"
import React from 'react'
import Profile from '@/component/user-profile/Profile'
import { withAuth } from '@/util/withAuth'

type Props = {}

function page({}: Props) {
  return (
    <Profile />
  )
}

export default  withAuth(page)