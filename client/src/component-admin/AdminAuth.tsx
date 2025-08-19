"use client";
import React, { useState } from "react";
import Button from "@/ui/Button";
import TextInput from "@/ui/TextInput";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/common/notification-slice";
import Loading from "@/ui/Loading";
import { adminLogin } from "@/api/admin/auth";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {};

function AdminAuth({}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const route = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.length < 3 || !email.includes("@")) {
      return dispatch(
        showNotification({
          message: "Please enter a valid email address",
          type: "error",
        })
      );
    }

    if (password.length < 8) {
      return dispatch(
        showNotification({
          message: "Password must be at least 8 characters long",
          type: "error",
        })
      );
    }
    const login = await adminLogin(email,password,dispatch,setIsLoading)
    if(login.success){
        Cookies.set('admin-token',login.token)
        route.push('/admin/dashboard')
        return dispatch(showNotification({message:'login successfully',type:'success'}))
    }
    
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            state={[email, setEmail]}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            state={[password, setPassword]}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />

          <Button
            type="submit"
            className="w-full py-3 rounded-lg  text-white font-semibold transition-all"
          >
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Admin Dashboard
        </p>
      </div>
    </div>
  );
}

export default AdminAuth;
