'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function ApprovedArticlesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
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
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Approved Articles
        </h1>
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
          <div className="bg-white shadow-sm overflow-hidden rounded-lg border border-gray-100">
            <ul className="divide-y divide-gray-200">
              {articles.map((pubArticle) => {
                const article = pubArticle?.article_id;
                const publisher = pubArticle?.publisher_id;
                const journalist = article?.journalist_id;
                
                if (!article) return null;

                return (
                  <li key={pubArticle._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Article Image */}
                        {article.article_front_image && (
                          <div className="relative w-20 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '1.25/0.85' }}>
                            <SafeImage
                              src={article.article_front_image}
                              alt={article.article_title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-1 mb-1">
                            {article.article_title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">Journalist:</span>
                              <span className="text-gray-900">
                                {journalist?.firstname} {journalist?.lastname}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span className="font-medium">Publisher:</span>
                              <span className="text-gray-900">
                                {publisher?.firstname} {publisher?.lastname || 'Admin'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setExpandedId(expandedId === pubArticle._id ? null : pubArticle._id)}
                          className="p-2 text-slate-400 hover:text-[#66462C] transition-colors"
                        >
                          <svg
                            className={`w-6 h-6 transform transition-transform ${expandedId === pubArticle._id ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {expandedId === pubArticle._id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-6">
                          {/* Article Details */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-4">Article Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white rounded-md p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                  {article.created_on 
                                    ? new Date(article.created_on).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })
                                    : 'N/A'}
                                </p>
                              </div>
                              
                              <div className="bg-white rounded-md p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Published</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                  {article.published_on 
                                    ? new Date(article.published_on).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })
                                    : 'N/A'}
                                </p>
                              </div>
                              
                              <div className="bg-white rounded-md p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Article Group</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">{article.article_group || 'N/A'}</p>
                              </div>
                              
                              <div className="bg-white rounded-md p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved On</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                  {new Date(pubArticle.assigned_on).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Journalist Details */}
                          {journalist && (
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-4">Journalist Information</h4>
                              <div className="flex items-start gap-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                  {journalist.profile_picture ? (
                                    <SafeImage
                                      src={journalist.profile_picture}
                                      alt={`${journalist.firstname} ${journalist.lastname}`}
                                      fill
                                      className="object-cover rounded-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-md p-4 border border-gray-200">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</span>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-900 mt-1">
                                        {journalist.firstname} {journalist.lastname}
                                      </p>
                                    </div>
                                    
                                    {journalist.displayName && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.displayName}</p>
                                      </div>
                                    )}
                                    
                                    {journalist.journalist_affiliation && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Affiliation</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.journalist_affiliation}</p>
                                      </div>
                                    )}
                                    
                                    {journalist.area_of_expertise && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Area of Expertise</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.area_of_expertise}</p>
                                      </div>
                                    )}
                                    
                                    {journalist.trust_score !== undefined && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trust Score</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.trust_score}</p>
                                      </div>
                                    )}
                                    
                                    {journalist.total_articles_published !== undefined && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Articles Published</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.total_articles_published}</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {journalist.journalist_description && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</span>
                                      </div>
                                      <p className="text-sm text-gray-700 bg-white p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                                        {journalist.journalist_description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Publisher/Admin Details */}
                          {publisher && (
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-4">Publisher Information</h4>
                              <div className="flex items-start gap-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                  {publisher.profile_picture ? (
                                    <SafeImage
                                      src={publisher.profile_picture}
                                      alt={`${publisher.firstname} ${publisher.lastname}`}
                                      fill
                                      className="object-cover rounded-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-md p-4 border border-gray-200">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</span>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-900 mt-1">
                                        {publisher.firstname} {publisher.lastname}
                                      </p>
                                    </div>
                                    
                                    {publisher.displayName && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.displayName}</p>
                                      </div>
                                    )}
                                    
                                    {publisher.department && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.department}</p>
                                      </div>
                                    )}
                                    
                                    {publisher.position && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Position</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.position}</p>
                                      </div>
                                    )}
                                    
                                    {publisher.work_email && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Email</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.work_email}</p>
                                      </div>
                                    )}
                                    
                                    {publisher.total_articles_published !== undefined && (
                                      <div className="bg-white rounded-md p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Articles Published</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.total_articles_published}</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {publisher.bio && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bio</span>
                                      </div>
                                      <p className="text-sm text-gray-700 bg-white p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                                        {publisher.bio}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
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

export default function ApprovedArticlesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <ApprovedArticlesPageContent />
    </Suspense>
  );
}
