'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    publishedArticles: 0,
    totalComments: 0,
    articlesThisMonth: 0,
    totalContributors: 0,
  });

  useEffect(() => {
    checkAdminAccess();
    loadStats();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      console.log('Checking admin access...');
      console.log('Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        router.push('/login?redirect=/admin');
        return;
      }

      console.log('Calling verify-admin endpoint...');
      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Verify-admin response status:', response.status);
      console.log('Verify-admin response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verify-admin failed:', errorText);
        router.push('/login?redirect=/admin');
        return;
      }

      const data = await response.json();
      console.log('Verify-admin response data:', data);
      
      if (!data.isAdmin) {
        console.log('User is not admin, redirecting to login');
        router.push('/login?redirect=/admin');
        return;
      }

      console.log('Admin access verified successfully');
      setAdminInfo(data);
      
      // Update user info in sidebar
      const userInfoEl = document.getElementById('admin-user-info');
      if (userInfoEl) {
        userInfoEl.textContent = `${data.email} (${data.role})`;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      console.error('Error details:', error.message);
      router.push('/login?redirect=/admin');
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) return;

      // Get dashboard stats
      const statsResponse = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalArticles: statsData.totalArticles || 0,
          publishedArticles: statsData.publishedArticles || 0,
          totalComments: statsData.totalComments || 0,
          articlesThisMonth: statsData.articlesThisMonth || 0,
          totalContributors: statsData.totalContributors || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-[#66462C]">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#F6F3EF] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#66462C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-[#8B6F47]">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#F6F3EF] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.totalArticles.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-600">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.publishedArticles.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-slate-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Comments</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.totalComments.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-[#AE8C6F]">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#F6F3EF] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#AE8C6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.articlesThisMonth.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-[#66462C]">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#F6F3EF] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#66462C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Contributors</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.totalContributors.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="font-display text-xl font-semibold text-slate-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/journalists/pending"
            className="block p-5 border border-gray-200 rounded-lg hover:bg-[#F6F3EF] hover:border-[#66462C] transition-all"
          >
            <h4 className="font-semibold text-slate-900">Review Journalists</h4>
            <p className="text-sm text-slate-600 mt-2">Approve pending journalist applications</p>
          </a>
          <a
            href="/admin/articles/pending"
            className="block p-5 border border-gray-200 rounded-lg hover:bg-[#F6F3EF] hover:border-[#66462C] transition-all"
          >
            <h4 className="font-semibold text-slate-900">Review Articles</h4>
            <p className="text-sm text-slate-600 mt-2">Approve or reject pending articles</p>
          </a>
          <a
            href="/admin/articles/approved"
            className="block p-5 border border-gray-200 rounded-lg hover:bg-[#F6F3EF] hover:border-[#66462C] transition-all"
          >
            <h4 className="font-semibold text-slate-900">Approved Articles</h4>
            <p className="text-sm text-slate-600 mt-2">View all published articles</p>
          </a>
          <a
            href="/admin/videos/pending"
            className="block p-5 border border-gray-200 rounded-lg hover:bg-[#F6F3EF] hover:border-[#66462C] transition-all"
          >
            <h4 className="font-semibold text-slate-900">Review Videos</h4>
            <p className="text-sm text-slate-600 mt-2">Approve or reject pending videos</p>
          </a>
          <a
            href="/admin/users"
            className="block p-5 border border-gray-200 rounded-lg hover:bg-[#F6F3EF] hover:border-[#66462C] transition-all"
          >
            <h4 className="font-semibold text-slate-900">Manage Users</h4>
            <p className="text-sm text-slate-600 mt-2">View and manage all users</p>
          </a>
        </div>
      </div>
    </div>
  );
}

