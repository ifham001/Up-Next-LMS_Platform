import React from 'react'
import ProfileLayout from './ProfileLayout'
import ProfileForm from './ProfileForm'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/Store'


type Props = {}

function Profile({}: Props) {
  const username =  useSelector((state:RootState)=>state.userAuth.username)
  return (
    <ProfileLayout username={username!}>
    <ProfileForm />
  </ProfileLayout>
  )
}

export default Profile