'use client';

import React from 'react';
import Sidebar from './Sidebar';

type Props = {
  username: string;
  children: React.ReactNode;
};

const ProfileLayout: React.FC<Props> = ({ username, children }) => {
  return (
    <div className="flex min-h-screen border-t border-gray-200 mt-10 bg-gray-50">
      <Sidebar username={username} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default ProfileLayout;
