'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedHighlight, setEditedHighlight] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalReason, setApprovalReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    fetchArticle();
  }, [articleId]);

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

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/articles/${articleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch article');
      }

      const data = await response.json();
      setArticle(data);
      setEditedTitle(data.article_title);
      setEditedContent(data.article_content);
      setEditedHighlight(data.article_highlight);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveEdits = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_title: editedTitle,
          article_content: editedContent,
          article_highlight: editedHighlight,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update article');
      }

      const updatedArticle = await response.json();
      setArticle(updatedArticle);
      setEditing(false);
      alert('Article updated successfully!');
    } catch (err) {
      console.error('Error updating article:', err);
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
      
      const response = await fetch(`${API_URL}/admin/articles/${articleId}/approval`, {
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

      alert(`Article ${approvalStatus} successfully!`);
      router.push('/admin/articles/pending');
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
        <div className="text-gray-500">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Article not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/articles/pending')}
          className="text-slate-600 hover:text-[#66462C] flex items-center gap-2 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pending Articles
        </button>
        {!editing && (
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-[#66462C] text-white text-sm font-medium rounded-lg hover:bg-[#563B25] transition-colors"
          >
            Edit Article
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
            {editing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{article.article_title}</h1>
            )}
          </div>

          {/* Highlight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlight</label>
            {editing ? (
              <textarea
                value={editedHighlight}
                onChange={(e) => setEditedHighlight(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-lg text-gray-700">{article.article_highlight}</p>
            )}
          </div>

          {/* Main Image - 25% bigger than additional images, centered in rectangular component */}
          {article.article_front_image && (
            <div className="flex justify-center w-full">
              <div className="relative bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md" style={{ width: '100%', maxWidth: '800px', aspectRatio: '1.25/0.85' }}>
                <SafeImage
                  src={article.article_front_image}
                  alt={article.article_title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            {editing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{article.article_content}</p>
              </div>
            )}
          </div>

          {/* Additional Images - 25% smaller than main image */}
          {article.article_other_images && article.article_other_images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <div className="flex justify-center w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ width: '80%', maxWidth: '640px' }}>
                  {article.article_other_images && article.article_other_images.length > 0 && article.article_other_images.map((imageKey, index) => {
                    // Main image is 25% bigger, so additional images are 80% of main (100% / 1.25 = 80%)
                    return (
                      <div key={index} className="relative bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md" style={{ aspectRatio: '1.25/0.85', width: '100%' }}>
                        <SafeImage
                          src={imageKey}
                          alt={`Additional image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Article Info - Improved styling */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Article Group</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{article.article_group}</p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{article.location}</p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{article.concerned_country}</p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{article.concerned_city}</p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date(article.created_on).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              {article.published_on && (
                <div className="bg-white rounded-md p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Published</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {new Date(article.published_on).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Proof Image and Text - displayed before journalist information */}
          {(article.article_proof_image || article.article_proof_text) && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof Information</h3>
              
              {article.article_proof_text && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proof Text</label>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-md border border-gray-200">
                    {article.article_proof_text}
                  </p>
                </div>
              )}

              {article.article_proof_image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proof Image</label>
                  <div className="flex justify-center w-full">
                    <div className="relative bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md" style={{ width: '100%', maxWidth: '600px', aspectRatio: '1.25/0.85' }}>
                      <SafeImage
                        src={article.article_proof_image}
                        alt="Proof image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Journalist Card - moved to be just before approval section */}
          {article.journalist_id && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Journalist Information</h3>
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {article.journalist_id.profile_picture ? (
                    <SafeImage
                      src={article.journalist_id.profile_picture}
                      alt={`${article.journalist_id.firstname} ${article.journalist_id.lastname}`}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900">
                    {article.journalist_id.firstname} {article.journalist_id.lastname}
                  </h4>
                  {article.journalist_id.displayName && (
                    <p className="text-sm text-gray-600 mt-1">{article.journalist_id.displayName}</p>
                  )}
                  {article.journalist_id.journalist_affiliation && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Affiliation:</span> {article.journalist_id.journalist_affiliation}
                    </p>
                  )}
                  {article.journalist_id.area_of_expertise && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Expertise:</span> {article.journalist_id.area_of_expertise}
                    </p>
                  )}
                  {article.journalist_id.journalist_description && (
                    <p className="text-sm text-gray-600 mt-2">{article.journalist_id.journalist_description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit Actions */}
          {editing && (
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={saveEdits}
                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditedTitle(article.article_title);
                  setEditedContent(article.article_content);
                  setEditedHighlight(article.article_highlight);
                }}
                className="px-6 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Approval Section */}
          {!editing && (
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Approve or Reject Article</h3>
              
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
                className="w-full px-4 py-3 bg-[#66462C] text-white text-sm font-medium rounded-lg hover:bg-[#563B25] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
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

