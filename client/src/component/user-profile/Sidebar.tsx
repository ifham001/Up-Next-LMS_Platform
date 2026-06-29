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
    <aside className="w-64 shrink-0 border-r border-border bg-surface p-6">
      <div className="flex flex-col items-center mb-8">
        {profileImageAvailable ? (
          <Image
            src={''} // TODO: replace with actual image path or prop
            alt="Profile"
            width={80}
            height={80}
            className="rounded-xl object-cover border border-border"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-brand-50 border border-border flex items-center justify-center font-display text-2xl font-semibold text-brand-dark">
            {getInitials(username?username:'xyz')}
          </div>
        )}
        <div className="text-base font-semibold text-text-primary mt-3 tracking-tight">{username?username:'xyz'}</div>
      </div>

      <span className="eyebrow px-3">Account</span>
      <ul className="mt-2 space-y-0.5">
        {menuItems.map((item, index) => {
          const isActive = index === 1; // "Profile" is the current view
          return (
            <li key={item}>
              <button
                className={`text-left w-full text-sm rounded-md px-3 py-2 border-l-2 transition-colors duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-dark font-medium border-brand'
                    : 'text-text-secondary border-transparent hover:bg-surface-muted hover:text-text-primary'
                }`}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
