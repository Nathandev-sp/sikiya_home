import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { AdminLogoutButton } from '@/components/AdminLogoutButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function verifyAdmin() {
  // Get token from cookies (client-side will set this)
  // For server-side, we need to check cookies
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  // Try to get token from cookies - but cookies() might not work in all contexts
  // We'll handle auth check on client-side for now
  return null;
}

export default async function AdminLayout({ children }) {
  // Note: Full admin verification will happen client-side
  // Server-side cookie access in Next.js App Router is limited
  
  return (
    <div className="min-h-screen bg-[#F6F3EF]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-gray-200 bg-white">
            <Link href="/admin" aria-label="Admin Home">
              <Logo className="h-12 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link 
              href="/admin/journalists/pending" 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Pending Journalists
            </Link>
            <Link 
              href="/admin/articles/pending" 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Pending Articles
            </Link>
            <Link 
              href="/admin/videos/pending" 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Pending Videos
            </Link>
            
            {/* Horizontal rule before approved content */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link 
                href="/admin/articles/approved" 
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approved Articles
              </Link>
              <Link 
                href="/admin/videos/approved" 
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approved Videos
              </Link>
            </div>
            
            {/* Horizontal rule before users/admins */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link 
                href="/admin/users" 
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
              </Link>
              <Link 
                href="/admin/admins" 
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#F6F3EF] hover:text-[#66462C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admins
              </Link>
            </div>
          </nav>

          {/* User Info and Logout */}
          <div className="px-4 py-4 border-t border-gray-200 bg-white">
            <div id="admin-user-info" className="text-sm font-medium text-gray-700 mb-3 truncate">
              Loading...
            </div>
            <AdminLogoutButton />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

