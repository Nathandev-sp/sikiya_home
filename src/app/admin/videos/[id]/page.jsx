'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getImageUrl } from '@/utils/imageUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id;

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalReason, setApprovalReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    fetchVideo();
  }, [videoId]);

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

  const fetchVideo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch video');
      }

      const data = await response.json();
      setVideo(data);
      setEditedTitle(data.video_title);
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveEdits = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/videos/${videoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_title: editedTitle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update video');
      }

      const updatedVideo = await response.json();
      setVideo(updatedVideo);
      setEditing(false);
      alert('Video updated successfully!');
    } catch (err) {
      console.error('Error updating video:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const submitApproval = async () => {
    if (!approvalStatus) {
      alert('Please select an approval status');
      return;
    }

    if (approvalStatus === 'rejected' && !approvalReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/videos/${videoId}/approval`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approval_status: approvalStatus,
          approval_reason: approvalReason || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update approval status');
      }

      alert(`Video ${approvalStatus} successfully!`);
      router.push('/admin/videos/pending');
    } catch (err) {
      console.error('Error updating approval:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading video...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Video not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/videos/pending')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pending Videos
        </button>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Video
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Video Player Area */}
        <div className="relative w-full h-96 bg-gray-900 flex items-center justify-center">
          {video.video_link ? (
            <div className="text-white text-center">
              <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <p className="text-lg mb-2">Video Link Available</p>
              <a
                href={getImageUrl(video.video_link)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View Video
              </a>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">No Video Link</p>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
            {editing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{video.video_title}</h1>
            )}
          </div>

          {/* Video Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <span className="text-sm font-medium text-gray-500">Journalist:</span>
              <p className="text-sm text-gray-900">
                {video.journalist_id?.firstname} {video.journalist_id?.lastname}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Video Group:</span>
              <p className="text-sm text-gray-900">{video.video_group}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Location:</span>
              <p className="text-sm text-gray-900">{video.location || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Created:</span>
              <p className="text-sm text-gray-900">
                {new Date(video.created_on).toLocaleDateString()}
              </p>
            </div>
            {video.video_proof_text && (
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-500">Proof Text:</span>
                <p className="text-sm text-gray-900 mt-1">{video.video_proof_text}</p>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {editing && (
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={saveEdits}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditedTitle(video.video_title);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Approval Section */}
          {!editing && (
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Approve or Reject Video</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status...</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>

              {approvalStatus === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                    rows={4}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <button
                onClick={submitApproval}
                disabled={submitting || !approvalStatus}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Approval Decision'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

