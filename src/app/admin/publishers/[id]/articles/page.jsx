'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PublisherArticlesPage() {
  const router = useRouter();
  const params = useParams();
  const publisherId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [counts, setCounts] = useState({
    totalArticles: 0,
    totalVideos: 0,
    articlesThisMonth: 0,
    videosThisMonth: 0
  });
  const [thisMonth, setThisMonth] = useState([]);
  const [rest, setRest] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    checkAdminAccess();
    fetchPublisherArticles();
  }, [publisherId]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/publishers');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        router.push('/login?redirect=/admin/publishers');
        return;
      }

      const data = await response.json();
      
      if (!data.isAdmin) {
        router.push('/login?redirect=/admin/publishers');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/publishers');
    }
  };

  const fetchPublisherArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      // Fetch publisher info
      const publisherResponse = await fetch(`${API_URL}/admin/publishers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (publisherResponse.ok) {
        const publisherData = await publisherResponse.json();
        const foundPublisher = publisherData.publishers?.find(p => p._id === publisherId);
        if (foundPublisher) {
          setPublisher(foundPublisher);
        }
      }

      // Fetch approved articles and videos
      const response = await fetch(`${API_URL}/admin/publishers/${publisherId}/articles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch approved articles and videos');
      }

      const data = await response.json();
      setCounts(data.counts || {});
      setThisMonth(data.thisMonth || []);
      setRest(data.rest || []);
    } catch (err) {
      console.error('Error fetching publisher articles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderContentCard = (item) => {
    const isExpanded = expandedId === item._id;
    const publishedDate = item.published_on || item.created_on;
    const approvedDate = item.approved_on;
    
    return (
      <div key={item._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.approval_status)}`}>
                  {item.approval_status?.charAt(0).toUpperCase() + item.approval_status?.slice(1) || 'Pending'}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {item.type === 'article' ? 'Article' : 'Video'}
                </span>
                {item.group && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {item.group}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              {item.article_highlight && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.article_highlight}</p>
              )}
              {item.journalist_id && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">By:</span>
                  {item.journalist_id.profile_picture ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <SafeImage
                        src={item.journalist_id.profile_picture}
                        alt={item.journalist_id.displayName || `${item.journalist_id.firstname} ${item.journalist_id.lastname}`}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : null}
                  <span className="text-sm font-medium text-gray-700">
                    {item.journalist_id.displayName || `${item.journalist_id.firstname} ${item.journalist_id.lastname}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Published: {formatDate(publishedDate)}
                </span>
                <span className="flex items-center gap-1 text-[#66462C]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Approved: {formatDate(approvedDate)}
                </span>
                {item.number_of_likes !== undefined && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {item.number_of_likes || 0} likes
                  </span>
                )}
                {item.number_of_comments !== undefined && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {item.number_of_comments || 0} comments
                  </span>
                )}
              </div>
            </div>
            <div className="ml-4">
              {item.image && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-200">
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setExpandedId(isExpanded ? null : item._id)}
            className="mt-3 flex items-center gap-2 text-sm text-[#66462C] hover:text-[#563B25] font-medium"
          >
            {isExpanded ? 'Show Less' : 'Show More Details'}
            <svg
              className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created On</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(item.created_on)}</p>
              </div>

              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Published On</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(item.published_on)}</p>
              </div>

              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-[#66462C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved On</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(item.approved_on)}</p>
              </div>

              {item.group && (
                <div className="bg-white rounded-md p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{item.group}</p>
                </div>
              )}

              {item.type === 'video' && item.video_link && (
                <div className="bg-white rounded-md p-4 border border-gray-200 md:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Video Link</span>
                  </div>
                  <a 
                    href={item.video_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 break-all"
                  >
                    {item.video_link}
                  </a>
                </div>
              )}

              {item.journalist_id && (
                <div className="bg-white rounded-md p-4 border border-gray-200 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Journalist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.journalist_id.profile_picture ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <SafeImage
                          src={item.journalist_id.profile_picture}
                          alt={item.journalist_id.displayName || `${item.journalist_id.firstname} ${item.journalist_id.lastname}`}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.journalist_id.displayName || `${item.journalist_id.firstname} ${item.journalist_id.lastname}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading approved articles and videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const publisherName = publisher?.profile 
    ? (publisher.profile.displayName || `${publisher.profile.firstname} ${publisher.profile.lastname}`)
    : 'Publisher';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/publishers')}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Publishers
          </button>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
            {publisherName}'s Approved Content
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Articles Approved</div>
          <div className="text-3xl font-bold text-gray-900">{counts.totalArticles}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Videos Approved</div>
          <div className="text-3xl font-bold text-gray-900">{counts.totalVideos}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Articles Approved This Month</div>
          <div className="text-3xl font-bold text-[#66462C]">{counts.articlesThisMonth}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Videos Approved This Month</div>
          <div className="text-3xl font-bold text-[#66462C]">{counts.videosThisMonth}</div>
        </div>
      </div>

      {/* This Month Section */}
      {thisMonth.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved This Month</h2>
          <div className="space-y-4">
            {thisMonth.map(item => renderContentCard(item))}
          </div>
        </div>
      )}

      {/* Rest of Articles Section */}
      {rest.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rest of Approved Content</h2>
          <div className="space-y-4">
            {rest.map(item => renderContentCard(item))}
          </div>
        </div>
      )}

      {thisMonth.length === 0 && rest.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <p className="text-slate-600">No approved articles or videos found for this publisher.</p>
        </div>
      )}
    </div>
  );
}
