'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';

// Force dynamic rendering to prevent build-time prerendering errors
export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ApprovedArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    checkAdminAccess();
    fetchArticles();
  }, [page]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/articles/approved');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok || !(await response.json()).isAdmin) {
        router.push('/login?redirect=/admin/articles/approved');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/articles/approved');
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

      const response = await fetch(`${API_URL}/admin/articles/approved?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch approved articles');
      }

      const data = await response.json();
      
      // Handle case where articles might be null or undefined
      const articlesList = Array.isArray(data.articles) ? data.articles : [];
      setArticles(articlesList);
      setPagination({
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        currentPage: data.pagination?.page || page,
      });
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
        <h2 className="text-2xl font-bold text-gray-900">Approved Articles</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (!articles || articles.length === 0) && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No approved articles</h3>
          <p className="mt-1 text-sm text-gray-500">Articles will appear here once they have been approved by an admin.</p>
        </div>
      )}

      {!loading && !error && Array.isArray(articles) && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6">
            {articles.map((pubArticle) => {
              const article = pubArticle?.article_id;
              const publisher = pubArticle?.publisher_id;
              const journalist = article?.journalist_id;
              
              if (!article) return null;

              return (
                <div key={pubArticle._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Article Image */}
                      {article.article_front_image && (
                        <div className="relative w-32 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '1.25/0.85' }}>
                          <SafeImage
                            src={article.article_front_image}
                            alt={article.article_title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Article Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {article.article_title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {article.article_highlight}
                        </p>
                        
                        {/* Publisher, Journalist, and Date */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Publisher:</span>
                            <span className="text-gray-900">
                              {publisher?.firstname} {publisher?.lastname}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Journalist:</span>
                            <span className="text-gray-900">
                              {journalist?.firstname} {journalist?.lastname}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Approved:</span>
                            <span className="text-gray-900">
                              {new Date(pubArticle.assigned_on).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.pages} ({pagination.total} total articles)
              </div>
              <div className="flex gap-2">
                {pagination.currentPage > 1 && (
                  <button
                    onClick={() => router.push(`/admin/articles/approved?page=${pagination.currentPage - 1}`)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {pagination.currentPage < pagination.pages && (
                  <button
                    onClick={() => router.push(`/admin/articles/approved?page=${pagination.currentPage + 1}`)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

