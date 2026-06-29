"use client";
import { Home, BookOpen, Users, Upload, LogOut, GraduationCap } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/common/notification-slice";


export default function Sidebar() {
  const route = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()

  const logOutHandler = ()=>{
    Cookies.remove('admin-token')
    route.push('/admin')
    return dispatch(showNotification({message:'Logut successfully',type:'success'}))
  }


  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} strokeWidth={1.75} />, href: "/admin/dashboard" },
    { name: "Manage course", icon: <BookOpen size={20} strokeWidth={1.75} />, href: "/admin/manage-course" },
    { name: "Users", icon: <Users size={20} strokeWidth={1.75} />, href: "/admin/users" },
    { name: "Upload Course", icon: <Upload size={20} strokeWidth={1.75} />, href: "/admin/add-new-course" },


  ];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border bg-surface px-4 py-5">
      {/* Brand mark */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-brand text-text-inverted shadow-brand">
          <GraduationCap size={18} strokeWidth={1.75} />
        </div>
        <div className="leading-tight">
          <h1 className="font-display text-base font-bold tracking-tight text-text-primary">
            Up<span className="text-accent">Next</span>
          </h1>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-text-muted">Admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={index}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                isActive
                  ? "bg-brand-50 text-brand-dark"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
              )}
              <span className={isActive ? "text-brand" : "text-text-muted group-hover:text-text-primary"}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="divider my-3" />

      <button
        onClick={logOutHandler}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-error-soft hover:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
      >
        <LogOut size={20} strokeWidth={1.75} />
        <span>Log out</span>
      </button>
    </aside>
  );
}
