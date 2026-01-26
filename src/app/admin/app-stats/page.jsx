'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const ARTICLE_CATEGORIES = [
  'Politics',
  'Economy',
  'Social',
  'Tech',
  'Sports',
  'Business',
  'Entertainment',
  'Culture',
  'World',
];

export default function AdminAppStatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    contributorsThisMonth: 0,
    monthlyArticleViews: 0,
    monthlyVideoViews: 0,
    categoryViews: {},
    videoCategoryViews: {},
    journalistsCount: 0,
    journalistsArticleViewsThisMonth: 0,
    journalistsVideoViewsThisMonth: 0,
  });

  useEffect(() => {
    checkAdminAccess();
    loadStats();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/app-stats');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        router.push('/login?redirect=/admin/app-stats');
        return;
      }

      const data = await response.json();
      
      if (!data.isAdmin) {
        router.push('/login?redirect=/admin/app-stats');
        return;
      }

      const userInfoEl = document.getElementById('admin-user-info');
      if (userInfoEl) {
        userInfoEl.textContent = `${data.email} (${data.role})`;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/app-stats');
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) return;

      const statsResponse = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          contributorsThisMonth: statsData.contributorsThisMonth || 0,
          monthlyArticleViews: statsData.monthlyArticleViews || 0,
          monthlyVideoViews: statsData.monthlyVideoViews || 0,
          categoryViews: statsData.categoryViews || {},
          videoCategoryViews: statsData.videoCategoryViews || {},
          journalistsCount: statsData.journalistsCount || 0,
          journalistsArticleViewsThisMonth: statsData.journalistsArticleViewsThisMonth || 0,
          journalistsVideoViewsThisMonth: statsData.journalistsVideoViewsThisMonth || 0,
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
        App Stats
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Contributors This Month</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.contributorsThisMonth.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Monthly Article Views</div>
          <div className="text-3xl font-bold text-[#66462C]">
            {stats.monthlyArticleViews.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Monthly Video Views</div>
          <div className="text-3xl font-bold text-[#66462C]">
            {stats.monthlyVideoViews.toLocaleString()}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Monthly Views by Article Category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLE_CATEGORIES.map((category) => (
            <div key={category} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-500 mb-1">{category}</div>
              <div className="text-2xl font-bold text-gray-900">
                {(stats.categoryViews[category] || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Monthly Views by Video Category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLE_CATEGORIES.map((category) => (
            <div key={category} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-500 mb-1">{category}</div>
              <div className="text-2xl font-bold text-[#66462C]">
                {(stats.videoCategoryViews[category] || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}