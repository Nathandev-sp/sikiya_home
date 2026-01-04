'use client';

import { useRouter } from 'next/navigation';

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear token from localStorage/sessionStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Logout
    </button>
  );
}


