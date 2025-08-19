// components/CheckAuth.tsx
'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function CheckAuth() {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedToken = Cookies.get('token');
    setToken(savedToken);
  }, []);

  return <div>{token ? `Logged in with token: ${token}` : 'Not logged in'}</div>;
}
