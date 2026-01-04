'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PendingVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAdminAccess();
    fetchVideos();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/videos/pending');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok || !(await response.json()).isAdmin) {
        router.push('/login?redirect=/admin/videos/pending');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/videos/pending');
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

      const response = await fetch(`${API_URL}/admin/videos/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pending videos');
      }

      const data = await response.json();
      setVideos(data);
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
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Pending Videos
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No pending videos</p>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Link
              key={video._id}
              href={`/admin/videos/${video._id}`}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-48 bg-gray-900 flex items-center justify-center">
                {video.video_link ? (
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <p className="text-sm">Video Available</p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No Video Link</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-3">
                  {video.video_title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {video.journalist_id?.firstname} {video.journalist_id?.lastname}
                  </span>
                  <span>{new Date(video.created_on).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


