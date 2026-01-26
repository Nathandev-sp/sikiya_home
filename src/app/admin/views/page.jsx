'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminViewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [journalists, setJournalists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    checkAdminAccess();
    loadViews();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/views');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        router.push('/login?redirect=/admin/views');
        return;
      }

      const data = await response.json();
      
      if (!data.isAdmin) {
        router.push('/login?redirect=/admin/views');
        return;
      }

      const userInfoEl = document.getElementById('admin-user-info');
      if (userInfoEl) {
        userInfoEl.textContent = `${data.email} (${data.role})`;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/views');
    }
  };

  const loadViews = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/views`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJournalists(data.journalists || []);
      }
    } catch (error) {
      console.error('Error loading views:', error);
    }
  };

  // Filter journalists based on search query
  const filteredJournalists = journalists.filter((item) => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      item.journalist.firstname?.toLowerCase().includes(searchLower) ||
      item.journalist.lastname?.toLowerCase().includes(searchLower) ||
      item.journalist.displayName?.toLowerCase().includes(searchLower) ||
      item.journalist.email?.toLowerCase().includes(searchLower) ||
      `${item.journalist.firstname} ${item.journalist.lastname}`.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Views
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search journalists by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#66462C] focus:border-[#66462C] sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredJournalists.map((item) => {
          const fullName = `${item.journalist.firstname || ''} ${item.journalist.lastname || ''}`.trim() || 'Unknown Journalist';
          const displayName = item.journalist.displayName || 'No display name';
          const nameParts = fullName.split(' ').filter(n => n.length > 0);
          const initials = nameParts.length > 0 
            ? nameParts.map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'UJ';
          
          const totalViews = item.articleViewsThisMonth + item.videoViewsThisMonth;

          return (
            <div
              key={item.journalist._id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:border-[#66462C]"
            >
              {/* Header */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  {item.journalist.profile_picture && !imageErrors.has(item.journalist._id) ? (
                    <img
                      src={item.journalist.profile_picture}
                      alt={fullName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      onError={() => {
                        setImageErrors(prev => new Set(prev).add(item.journalist._id));
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#66462C] to-[#8B6F47] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {initials}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {fullName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {displayName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="space-y-3">
                {/* Article Views */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#66462C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600">Articles</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {item.articleViewsThisMonth.toLocaleString()}
                  </span>
                </div>

                {/* Video Views */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#66462C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600">Videos</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {item.videoViewsThisMonth.toLocaleString()}
                  </span>
                </div>

                {/* Comments on Content */}
                <div className="flex items-center justify-between p-2 bg-[#F6F3EF] rounded-md">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#66462C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600">On Content</span>
                  </div>
                  <span className="text-lg font-bold text-[#66462C]">
                    {item.commentsOnContent.toLocaleString()}
                  </span>
                </div>

                {/* Comments by Journalist */}
                <div className="flex items-center justify-between p-2 bg-[#F6F3EF] rounded-md">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#66462C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600">By Journalist</span>
                  </div>
                  <span className="text-lg font-bold text-[#66462C]">
                    {item.commentsByJournalist.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Total Views Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Total Views</span>
                  <span className="text-sm font-bold text-[#66462C]">
                    {totalViews.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredJournalists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No journalists found matching your search.' : 'No journalists found.'}
          </p>
        </div>
      )}
    </div>
  );
}
