"use client"
import React from 'react'
import Learning from '@/component/user-learning/Learning'
import { withAuth } from '@/util/withAuth'

type Props = {}

function page({}: Props) {
  return (
    <Learning/>
  )
}

export default withAuth(page)