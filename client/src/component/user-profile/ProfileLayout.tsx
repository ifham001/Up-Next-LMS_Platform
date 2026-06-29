'use client';

import React from 'react';
import Sidebar from './Sidebar';

type Props = {
  username: string;
  children: React.ReactNode;
};

const ProfileLayout: React.FC<Props> = ({ username, children }) => {
  return (
    <div className="bg-bg min-h-screen border-t border-border">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
        <Sidebar username={username} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
};

export default ProfileLayout;
