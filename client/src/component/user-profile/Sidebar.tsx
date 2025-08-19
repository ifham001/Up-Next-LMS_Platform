'use client';

import React from 'react';
import Image from 'next/image';

const profileImageAvailable = false; // Toggle to true if image is available

const getInitials = (name: string) => {
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[1][0]).toUpperCase();
};

const menuItems = [
  'View public profile',
  'Profile',
  'Photo',
  'Close account',
];

type SidebarProps = {
  username: string;
};

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
  return (
    <aside className="w-64 border-r border-t border-gray-200 p-6">
      <div className="flex flex-col items-center mb-6">
        {profileImageAvailable ? (
          <Image
            src={''} // TODO: replace with actual image path or prop
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-gray-700">
            {getInitials(username?username:'xyz')}
          </div>
        )}
        <div className="text-xl font-semibold mt-3">{username?username:'xyz'}</div>
      </div>

      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item}>
            <button className="text-left w-full text-sm text-gray-700 hover:text-black hover:font-medium transition">
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
