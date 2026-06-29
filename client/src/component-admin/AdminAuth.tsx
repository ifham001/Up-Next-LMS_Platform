"use client";
import React, { useState } from "react";
import TextInput from "@/ui/TextInput";
import Button from "@/ui/Button";
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
    if(login){
      
        route.push('/admin/dashboard')
        return dispatch(showNotification({message:'login successfully',type:'success'}))
    }
    
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="card animate-fadeInUp w-full max-w-md p-10">
        <div className="mb-8">
          <span className="eyebrow mb-4">Admin console</span>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Admin <span className="text-accent">sign in</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Sign in to manage courses, users, and content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Email"
            placeholder="you@example.com"
            type="email"
            value={email}
            state={[email, setEmail]}
            required
          />

          <TextInput
            label="Password"
            placeholder="Your password"
            type="password"
            value={password}
            state={[password, setPassword]}
            required
          />

          <Button type="submit" fullWidth size="lg">
            Sign in
          </Button>
        </form>

        <div className="divider my-7" />

        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Up Next · Admin console
        </p>
      </div>
    </div>
  );
}

export default AdminAuth;
