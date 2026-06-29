'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  token: string | null;
  logoutHandler: () => void;
};

const optionsForUser = [
  { label: "Profile", href: "/user/profile" },
  { label: "My Learning", href: "/user/learning" },
  { label: "My Cart", href: "/user/cart" },
];

function Avatar({ token, logoutHandler }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const logout = () => {
    setIsOpen(false);
    logoutHandler();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!token) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account menu"
        className="flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <CircleUserRound className="w-7 h-7 md:w-8 md:h-8 text-text-secondary hover:text-text-primary transition-colors duration-200" strokeWidth={1.75} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-border bg-surface p-1.5 shadow-md animate-fadeIn">
          <ul className="space-y-0.5">
            {optionsForUser.map((option) => (
              <li key={option.label}>
                <Link
                  href={option.href}
                  className="block rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-brand-50 hover:text-brand-dark"
                  onClick={() => setIsOpen(false)}
                >
                  {option.label}
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-border pt-1" onClick={logout}>
              <Link
                href="/logout"
                className="block rounded-full px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error-soft"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Avatar;