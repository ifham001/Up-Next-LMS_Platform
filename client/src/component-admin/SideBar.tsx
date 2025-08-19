"use client";
import { Home, BookOpen, Users, Settings, BarChart2, HelpCircle, Upload, Video,LogOut  } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/common/notification-slice";


export default function Sidebar() {
  const route = useRouter()
  const dispatch = useDispatch()

  const logOutHandler = ()=>{
    Cookies.remove('admin-token')
    route.push('/admin')
    return dispatch(showNotification({message:'Logut successfully',type:'success'}))
  }


  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
    { name: "Manage course", icon: <BookOpen size={20} />, href: "/admin/manage-course" },
    { name: "Users", icon: <Users size={20} />, href: "/admin/users" },
    { name: "Upload Course", icon: <Upload size={20} />, href: "/admin/add-new-course" },

    
  ];

  return (
    <div className="w-60 h-screen bg-white border-r p-4 flex flex-col">
      <div className="mb-10">
        <h1 className="text-xl font-bold">Up Next</h1>
        <p className="text-sm text-gray-500">Admin</p>
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors`}
            
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        <p onClick={logOutHandler} className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors`}>
          <LogOut/>
          <span>Logout</span>
        </p>
      </nav>
    </div>
  );
}
