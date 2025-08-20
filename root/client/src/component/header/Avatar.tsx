'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
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

  const logout= () => {
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
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <CircleUserRound className="w-6 h-6 md:w-8 md:h-8 text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <ul className="py-2">
            {optionsForUser.map((option) => (
              <li key={option.label}>
                <Link
                  href={option.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {option.label}
                </Link>
              </li>

            ))}
            <li onClick={logout}>
                <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-colors">
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
