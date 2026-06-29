'use client';

import React, { useState } from 'react';
import TextInput from '@/ui/TextInput';
import Button from '@/ui/Button';
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
      if (response?.success) {
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
      if (response?.success) {
        return setMode('signin');
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm sm:text-base
    bg-input-bg text-text-primary placeholder:text-input-placeholder
    border border-input-border transition-colors duration-150
    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-border-strong
    hover:border-border-strong`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="card p-7 sm:p-8 shadow-sm">
          {/* UpNext coral mark */}
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-9 place-items-center rounded-xl font-display text-lg font-bold shadow-sm"
              style={{ background: 'var(--color-brand)', color: 'var(--color-text-inverted)' }}
            >
              U
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              Up<span className="text-accent">Next</span>
            </span>
          </div>

          {/* Eyebrow */}
          <span className="eyebrow mt-6">
            {mode === 'signin' ? 'Welcome back' : 'Get started'}
          </span>

          {/* Heading — Space Grotesk, sentence case, one coral word */}
          <h1 className="mt-3 text-2xl sm:text-3xl font-display font-bold tracking-tight text-text-primary">
            {mode === 'signin' ? (
              <>Log in to your <span className="text-accent">account</span></>
            ) : (
              <>Create your <span className="text-accent">account</span></>
            )}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {mode === 'signin'
              ? 'Pick up where you left off.'
              : 'Start learning on Up-Next.'}
          </p>

          {/* Mode toggle — quiet bordered segmented control */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              aria-pressed={mode === 'signin'}
              className={`rounded-md py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                mode === 'signin'
                  ? 'bg-surface text-text-primary border border-border shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              aria-pressed={mode === 'signup'}
              className={`rounded-md py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                mode === 'signup'
                  ? 'bg-surface text-text-primary border border-border shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <div className="space-y-3">
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  type="text"
                  value={name}
                  state={[name, setName]}
                  className={inputClass}
                  required
                />

                <button
                  type="button"
                  onClick={generateRandomCredentials}
                  className="text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded"
                >
                  Fill with test credentials
                </button>
              </div>
            )}

            <TextInput
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              state={[email, setEmail]}
              className={inputClass}
              required
            />

            <TextInput
              label="Password"
              placeholder="At least 8 characters"
              type="password"
              value={password}
              state={[password, setPassword]}
              className={inputClass}
              required
            />

            {mode === 'signin' && (
              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-text-secondary">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-input-border bg-input-bg accent-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="link-accent font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary flex w-full items-center justify-center py-3 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {mode === 'signin' ? 'Log in' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-text-muted">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" fullWidth size="lg">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M21.35 11.1H12v2.91h5.35c-.25 1.39-1.56 4.08-5.35 4.08-3.23 0-5.85-2.68-5.85-5.99s2.62-5.99 5.85-5.99c1.84 0 3.07.78 3.77 1.45l2.58-2.49C17.51 3.37 15.01 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.83 0 9.68-4.08 9.68-9.83 0-.66-.08-1.14-.18-1.62z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-5 text-center text-xs text-text-muted">
            Encrypted and secure. We never share your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
