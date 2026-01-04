'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';
import { getImageUrl } from '@/utils/imageUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function ApprovedVideosPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    checkAdminAccess();
    fetchVideos();
  }, [page]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/videos/approved');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok || !(await response.json()).isAdmin) {
        router.push('/login?redirect=/admin/videos/approved');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/videos/approved');
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/videos/approved?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch approved videos');
      }

      const data = await response.json();
      
      // Handle case where videos might be null or undefined
      const videosList = Array.isArray(data.videos) ? data.videos : [];
      setVideos(videosList);
      setPagination({
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        currentPage: data.pagination?.page || page,
      });
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Approved Videos</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (!videos || videos.length === 0) && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No approved videos</h3>
          <p className="mt-1 text-sm text-gray-500">Videos will appear here once they have been approved by an admin.</p>
        </div>
      )}

      {!loading && !error && Array.isArray(videos) && videos.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6">
            {videos.map((pubVideo) => {
              const video = pubVideo?.video_id;
              const publisher = pubVideo?.publisher_id;
              const journalist = video?.journalist_id;
              
              if (!video) return null;

              return (
                <div key={pubVideo._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Video Thumbnail/Icon */}
                      <div className="relative w-32 h-24 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                        {video.video_link ? (
                          <div className="text-white text-center">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <p className="text-xs">Video Available</p>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-center">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs">No Video</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          <Link href={`/admin/videos/${video._id}`} className="hover:underline">
                            {video.video_title}
                          </Link>
                        </h3>
                        
                        {/* Publisher, Journalist, and Date */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Publisher:</span>
                            <span className="text-gray-900">
                              {publisher?.displayName || `${publisher?.firstname} ${publisher?.lastname}`}
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
                              {new Date(pubVideo.assigned_on).toLocaleDateString()}
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
                Showing page {pagination.currentPage} of {pagination.pages} ({pagination.total} total videos)
              </div>
              <div className="flex gap-2">
                {pagination.currentPage > 1 && (
                  <button
                    onClick={() => router.push(`/admin/videos/approved?page=${pagination.currentPage - 1}`)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {pagination.currentPage < pagination.pages && (
                  <button
                    onClick={() => router.push(`/admin/videos/approved?page=${pagination.currentPage + 1}`)}
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

export default function ApprovedVideosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <ApprovedVideosPageContent />
    </Suspense>
  );
}

