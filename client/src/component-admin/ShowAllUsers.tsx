"use client"
import { getAllUsersDetails } from '@/api/admin/getUser-details'
import Loading from '@/ui/Loading'
import { Users } from 'lucide-react'
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

  return (
    <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3 animate-fadeInUp">
          <div>
            <span className="eyebrow mb-4">People</span>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Your <span className="text-accent">learners</span>
            </h1>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-text-secondary">
              All registered users and their purchase activity.
            </p>
          </div>
          {usersDetails.length > 0 && (
            <span className="chip tnum font-display">
              {usersDetails.length} {usersDetails.length === 1 ? 'user' : 'users'}
            </span>
          )}
        </header>

        {usersDetails.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-16 text-center animate-fadeInUp delay-1">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-dark">
              <Users size={20} strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium text-text-primary">No users yet</p>
            <p className="mt-1.5 text-sm text-text-muted">
              New users will appear here once they register.
            </p>
          </div>
        ) : (
          <div className="card animate-fadeInUp overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th className="px-5 py-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-text-muted">
                      Name
                    </th>
                    <th className="px-5 py-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-text-muted">
                      Email
                    </th>
                    <th className="px-5 py-3 text-right font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-text-muted">
                      Courses
                    </th>
                    <th className="px-5 py-3 text-right font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-text-muted">
                      Lifetime spend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usersDetails.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-surface-muted"
                    >
                      <td className="px-5 py-3.5 font-medium text-text-primary">
                        {user.name}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary">
                        {user.email}
                      </td>
                      <td className="tnum px-5 py-3.5 text-right text-text-secondary">
                        {user.coursesPurchased}
                      </td>
                      <td className="tnum px-5 py-3.5 text-right font-medium text-text-primary">
                        ₹{user.lifetimeSpend.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShowAllUsers
