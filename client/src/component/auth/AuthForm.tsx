'use client';

import React, { useState } from 'react';
import Button from '@/ui/Button';
import TextInput from '@/ui/TextInput';
import { createUser, loginUser } from '@/api/user/auth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/Store';
import Loading from '@/ui/Loading';
import { showNotification } from '@/store/slices/common/notification-slice';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

type AuthMode = 'signin' | 'signup';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Generate random credentials
  const generateRandomCredentials = () => {
    const randomName = `User${Math.floor(Math.random() * 10000)}`;
    const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
    const randomPassword = Math.random().toString(36).slice(-10);

    setName(randomName);
    setEmail(randomEmail);
    setPassword(randomPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.length < 3) {
      dispatch(
        showNotification({
          message: 'Please fill in all fields',
          type: 'error',
        })
      );
      return;
    }
    if (email.includes('@') && password.length < 8) {
      return dispatch(
        showNotification({
          message: 'Password must be at least 8 characters long',
          type: 'error',
        })
      );
    }

    if (mode === 'signin') {
      const response = await loginUser({ email, password }, dispatch, setIsLoading);
      if (response.success) {
        return router.push('/explore');
      }
    } else {
      if (name === '' || name.length < 3) {
        dispatch(
          showNotification({
            message: 'Name must be at least 3 characters long',
            type: 'error',
          })
        );
        return;
      }
      const response = await createUser({ name, email, password }, dispatch, setIsLoading);
      if (response.success) {
        return setMode('signin');
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="w-full max-w-md sm:max-w-lg bg-white  rounded-lg sm:rounded-xl overflow-hidden">
        
        {/* FORM SECTION */}
        <div className="w-full p-6 sm:p-8 lg:p-10">
          {/* Logo */}
         
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-700 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-700 text-sm sm:text-base mb-6 sm:mb-8">
            Sign in to your account or create a new one
          </p>

          {/* Mode Toggle */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 sm:py-2.5 px-4 rounded-md text-sm sm:text-base font-medium transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-white text-[#8c52ff] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 sm:py-2.5 px-4 rounded-md text-sm sm:text-base font-medium transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-white text-[#8c52ff] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {mode === 'signup' && (
              <>
                <TextInput
                  label="Name"
                  placeholder="Enter your name"
                  type="text"
                  value={name}
                  state={[name, setName]}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700
                            focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                            hover:border-[#8c52ff] transition-colors duration-200"
                  required
                />

                <Button
                  type="button"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-md 
                            flex items-center justify-center gap-2 text-sm sm:text-base font-medium
                            transition-all duration-200 hover:shadow-md"
                  onClick={generateRandomCredentials}
                >
                  <Sparkles className="w-4 h-4" />
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
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700
                        focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                        hover:border-[#8c52ff] transition-colors duration-200"
              required
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              state={[password, setPassword]}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700
                        focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                        hover:border-[#8c52ff] transition-colors duration-200"
              required
            />

            {mode === 'signin' && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2 w-4 h-4 text-[#8c52ff] border-gray-300 rounded focus:ring-[#8c52ff]" 
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-[#8c52ff] hover:text-[#7841df] hover:underline transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#8c52ff] hover:bg-[#7841df] text-white py-2.5 sm:py-3 rounded-md 
                        text-sm sm:text-base font-medium
                        transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
                        active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:ring-offset-2"
            >
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="flex items-center my-6 sm:my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 sm:mx-4 text-xs sm:text-sm text-gray-500">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Button
            type="button"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 
                      py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-2 sm:gap-3
                      text-sm sm:text-base font-medium
                      transition-all duration-200 hover:shadow-md hover:border-gray-400"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.35 11.1H12v2.91h5.35c-.25 1.39-1.56 4.08-5.35 4.08-3.23 0-5.85-2.68-5.85-5.99s2.62-5.99 5.85-5.99c1.84 0 3.07.78 3.77 1.45l2.58-2.49C17.51 3.37 15.01 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.83 0 9.68-4.08 9.68-9.83 0-.66-.08-1.14-.18-1.62z" />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;