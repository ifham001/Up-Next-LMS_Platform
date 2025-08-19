'use client';
import React, { useState } from 'react';
import VideoThumbnail from '@/ui/VideoThumbnail';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { useRouter } from 'next/navigation';
import Button from '@/ui/Button';
import { showNotification } from '@/store/slices/common/notification-slice';
import { addToCartApi } from '@/api/user/cart/cart';
import Loading from '@/ui/Loading';
import { addToCart } from '@/store/slices/user/addToCart-slice';




interface Props {
  course_duration:number,
  resources:number,
  quizzez:number,
  price:number
  preview_video:string
  preview_video_duration:number
  thumbnail_url :string
  courseId:string

}



const Sidebar = ({course_duration,resources,quizzez,price,preview_video,preview_video_duration ,thumbnail_url,courseId}:Props) => {

  const userId = useSelector((state:RootState)=>state.userAuth.userId)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoading,setIsLoading] = useState(false)


  const addToCartHandler =async()=>{
    if(!userId){
        dispatch(showNotification({message:"Please loggin before adding to cart",type:"error"}))
      return router.push('/auth')
    }
    if(userId){
      const addingToCart =await addToCartApi(userId,courseId,dispatch,setIsLoading)
      if(addingToCart){
        return dispatch(addToCart({courseId,title:'dummy_title',tagline:'dummy_tag_line',id:'dummy_item_id',price,url:thumbnail_url}))
      }
      
    }
    
  }
  const enrollHandler = async ()=>{
    if(!userId){
      dispatch(showNotification({message:"Please loggin before adding to cart",type:"error"}))
    return router.push('/auth')
  }
  if(userId){
    const addingToCart =await addToCartApi(userId,courseId,dispatch,setIsLoading)
    
    if(addingToCart){
      router.push(`/user/cart`)
    }
  }
  }
  if(isLoading){
    return <Loading/>
  }


  return (
    <aside className="bg-white p-4 shadow rounded-xl w-full md:w-80 space-y-4">
      <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
        <VideoThumbnail thumbnailUrl={thumbnail_url} duration={preview_video_duration} videoUrl={preview_video}/>
      </div>
      <div className="text-2xl font-semibold">₹ {price}/- <span className="line-through text-gray-500 text-base ml-2">₹ {price+500}/-</span></div>
      <button className="w-full bg-gray-700 text-white py-2 rounded-xl" onClick={enrollHandler}>Enroll Now</button>
      <Button className="w-full border text-black bg-gray-200 border-bg-gray-7 py-2 rounded-xl" onClick={addToCartHandler}>Add To Cart</Button>
      <p className="text-xs text-gray-500">30-Day Money-Back Guarantee</p>
      <ul className="text-sm text-gray-700 space-y-2">
        <li>📺 {course_duration} hours on-demand video</li>
        <li>📁 {resources} downloadable resources</li>
        <li>💻 {quizzez} coding exercises</li>
        <li>📜 Certificate of completion</li>
        <li>♾ Full lifetime access</li>
        <li>📱 Access on mobile and TV</li>
      </ul>
    </aside>
  );
};

export default Sidebar;