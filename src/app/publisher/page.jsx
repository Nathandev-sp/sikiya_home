'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PublisherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    articles: {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    },
    videos: {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    }
  });

  useEffect(() => {
    checkPublisherAccess();
    loadStats();
  }, []);

  const checkPublisherAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/publisher');
        return;
      }

      const response = await fetch(`${API_URL}/verify-publisher`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        router.push('/login?redirect=/publisher');
        return;
      }

      const data = await response.json();
      
      if (!data.isPublisher) {
        router.push('/login?redirect=/publisher');
        return;
      }

      const userInfoEl = document.getElementById('publisher-user-info');
      if (userInfoEl) {
        userInfoEl.textContent = `${data.email} (${data.role})`;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking publisher access:', error);
      router.push('/login?redirect=/publisher');
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_URL}/publisher/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
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

      {/* Articles Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Articles</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-500 mb-1">Pending</div>
            <div className="text-3xl font-bold text-amber-600">
              {stats.articles.pending.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-500 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.articles.approved.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-500 mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-600">
              {stats.articles.rejected.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Videos</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-500 mb-1">Pending</div>
            <div className="text-3xl font-bold text-amber-600">
              {stats.videos.pending.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-500 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.videos.approved.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-500 mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-600">
              {stats.videos.rejected.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
