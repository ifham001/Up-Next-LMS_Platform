"use client"
import ShowAllUsers from '@/component-admin/ShowAllUsers'
import { withAdminAuth } from '@/util/withAdminAuth'
import React from 'react'


type Props = {}

function page({}: Props) {
  return (
    <ShowAllUsers/>
  )
}

export default withAdminAuth(page)