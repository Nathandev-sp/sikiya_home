'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PendingArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAdminAccess();
    fetchArticles();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/articles/pending');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok || !(await response.json()).isAdmin) {
        router.push('/login?redirect=/admin/articles/pending');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/articles/pending');
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/articles/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pending articles');
      }

      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Pending Articles
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <p className="text-slate-600">No pending articles</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/admin/articles/${article._id}`}
              className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
            >
              {article.article_front_image && (
                <div className="relative w-full bg-gray-200" style={{ aspectRatio: '1.25/0.85', height: 'auto' }}>
                  <SafeImage
                    src={article.article_front_image}
                    alt={article.article_title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-2">
                  {article.article_title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {article.article_highlight}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">
                    {article.journalist_id?.firstname} {article.journalist_id?.lastname}
                  </span>
                  <span>{new Date(article.created_on).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

