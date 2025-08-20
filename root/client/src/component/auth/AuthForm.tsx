'use client';

import React, { useState } from 'react';
import Button from '@/ui/Button';
import TextInput from '@/ui/TextInput';
import Image from 'next/image';
import AuthImage from '../../../public/images/authImg.jpg'
import { createUser, loginUser } from '@/api/user/auth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/Store';
import Loading from '@/ui/Loading';
import { showNotification } from '@/store/slices/common/notification-slice';
import { useRouter } from 'next/navigation';

type AuthMode = 'signin' | 'signup';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()

  // ✅ Function to generate random credentials
  const generateRandomCredentials = () => {
    const randomName = `User${Math.floor(Math.random() * 10000)}`;
    const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
    const randomPassword = Math.random().toString(36).slice(-10); // random 10-char password

    setName(randomName);
    setEmail(randomEmail);
    setPassword(randomPassword);

  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if(email.length <3){
      dispatch(showNotification({
        message: 'Please fill in all fields',
        type: 'error',
      }));
      return;
    }
    if(email.includes('@') && password.length < 8){
     return dispatch(showNotification({
        message: 'Password must be at least 8 characters long',
        type: 'error',
      }));
    }

    if (mode === 'signin') {
    const response =  await loginUser({email,password},dispatch,setIsLoading);
    if(response.success){
      return router.push('/explore')
    }
    } else {
      if(name === '' || name.length < 3){
        dispatch(showNotification({
          message: 'Name must be at least 3 characters long',
          type: 'error',
        }));
        return;
      }
    const response =   await createUser({name,email,password},dispatch,setIsLoading);
    if(response.success){
      return setMode('signin')
    }

    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 mb-10 bg-gray-50">
      <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* IMAGE SECTION */}
        <div className="w-1/2 h-full hidden md:block">
          <Image
            src={AuthImage}
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM SECTION */}
        <div className="w-full  md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-6">
            Sign in to your account or create a new one
          </p>

          <div className="flex justify-around border-b mb-6">
            <p
              onClick={() => setMode('signin')}
              className={`pb-2 cursor-pointer border-b-2 ${
                mode === 'signin'
                  ? 'border-black font-semibold'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Sign In
            </p>
            <p
              onClick={() => setMode('signup')}
              className={`pb-2 cursor-pointer border-b-2 ${
                mode === 'signup'
                  ? 'border-black font-semibold'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Sign Up
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <TextInput
                  label="Name"
                  placeholder="Enter your name"
                  type="text"
                  value={name}
                  state={[name, setName]}
                  className="w-full px-4 py-2 border rounded bg-gray-50"
                  required
                />

                {/* ✅ Button to generate random credentials */}
                <Button 
                  type="button" 
                  className="w-full bg-gray-200 text-black py-2 rounded"
                  onClick={generateRandomCredentials}
                >
                  Generate Random Credentials
                </Button>
              </>
            )}

            <TextInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              state={[email, setEmail]}
              className="w-full px-4 py-2 border rounded bg-gray-50"
              required
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              state={[password, setPassword]}
              className="w-full px-4 py-2 border rounded bg-gray-50"
              required
            />

            {mode === 'signin' && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />
                  Remember me
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <Button type="submit" className="w-full text-white py-2 rounded transition">
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Button className="w-full bg-white text-gray-500 border py-2 rounded flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.35 11.1H12v2.91h5.35c-.25 1.39-1.56 4.08-5.35 4.08-3.23 0-5.85-2.68-5.85-5.99s2.62-5.99 5.85-5.99c1.84 0 3.07.78 3.77 1.45l2.58-2.49C17.51 3.37 15.01 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.83 0 9.68-4.08 9.68-9.83 0-.66-.08-1.14-.18-1.62z" />
            </svg>
            Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
