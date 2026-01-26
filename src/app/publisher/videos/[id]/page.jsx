'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getImageUrl } from '@/utils/imageUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PublisherVideoReviewPage() {
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
    checkPublisherAccess();
    fetchVideo();
  }, [videoId]);

  const checkPublisherAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/publisher/videos/pending');
        return;
      }

      const response = await fetch(`${API_URL}/verify-publisher`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok || !(await response.json()).isPublisher) {
        router.push('/login?redirect=/publisher/videos/pending');
        return;
      }
    } catch (error) {
      console.error('Error checking publisher access:', error);
      router.push('/login?redirect=/publisher/videos/pending');
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

      const response = await fetch(`${API_URL}/publisher/videos/${videoId}`, {
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
      
      const response = await fetch(`${API_URL}/publisher/videos/${videoId}`, {
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
      
      const response = await fetch(`${API_URL}/publisher/videos/${videoId}/approval`, {
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
      router.push('/publisher/videos/pending');
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
          onClick={() => router.push('/publisher/videos/pending')}
          className="text-slate-600 hover:text-[#66462C] flex items-center gap-2 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pending Videos
        </button>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-[#66462C] text-white text-sm font-medium rounded-lg hover:bg-[#563B25] transition-colors"
          >
            Edit Video
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Video Player Area */}
        <div className="relative w-full h-80 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          {video.video_link ? (
            <div className="text-white text-center">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-lg font-semibold mb-4">Video Link Available</p>
              <a
                href={getImageUrl(video.video_link)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 bg-[#66462C] text-white text-base rounded-md hover:bg-[#563B25] transition-colors font-medium"
              >
                View Video
              </a>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gray-700/50 flex items-center justify-center">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-semibold">No Video Link Available</p>
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
            {editing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#66462C]"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{video.video_title}</h1>
            )}
          </div>

          {/* Video Info */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Video Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase">Journalist</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {video.journalist_id?.firstname} {video.journalist_id?.lastname}
                </p>
              </div>

              <div className="bg-white rounded-md p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase">Video Group</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{video.video_group}</p>
              </div>

              <div className="bg-white rounded-md p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase">Location</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{video.location || 'N/A'}</p>
              </div>

              <div className="bg-white rounded-md p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase">Created</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(video.created_on).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {video.video_proof_text && (
                <div className="col-span-2 bg-white rounded-md p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase">Proof Text</span>
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{video.video_proof_text}</p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {editing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={saveEdits}
                className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditedTitle(video.video_title);
                }}
                className="px-5 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Approval Section */}
          {!editing && (
            <div className="pt-5 border-t border-gray-200 space-y-4">
              <h3 className="text-base font-medium text-gray-900">Approve or Reject Video</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                  className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#66462C]"
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
                    rows={3}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#66462C]"
                    required
                  />
                </div>
              )}

              <button
                onClick={submitApproval}
                disabled={submitting || !approvalStatus}
                className="w-full px-4 py-2.5 bg-[#66462C] text-white text-base font-medium rounded-md hover:bg-[#563B25] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
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
