"use client"
import { getAllUsersDetails } from '@/api/admin/getUser-details'
import Loading from '@/ui/Loading'
import UserDetailCard from '@/ui/UserDetailCard'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

type UserDetail = {
  id: string
  name: string
  email: string
  coursesPurchased: number
  lifetimeSpend: number
  courses: string[]
}

function ShowAllUsers() {
  const [usersDetails, setUserDetails] = useState<UserDetail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const getUsers = async () => {
      const detail = await getAllUsersDetails(dispatch, setIsLoading)
      if (detail.success) {
        console.log(detail)
        setUserDetails(detail.userDetails)
      }
    }
    getUsers()
  }, [dispatch])

  if (isLoading) {
    return <Loading />
  }

  if (!isLoading && usersDetails.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No users found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {usersDetails.map((user) => (
        <UserDetailCard
          key={user.id}
          name={user.name}
          email={user.email}
          coursesBought={user.coursesPurchased}
          lifetimePurchaseAmount={user.lifetimeSpend}
          courses={user.courses}
        />
      ))}
    </div>
  )
}

export default ShowAllUsers
