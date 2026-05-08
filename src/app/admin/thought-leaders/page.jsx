'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ThoughtLeadersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [thoughtLeaders, setThoughtLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [verifiedIds, setVerifiedIds] = useState({});
  const [rejectModal, setRejectModal] = useState({ open: false, userId: null, name: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const [removeModal, setRemoveModal] = useState({ open: false, userId: null, name: '' });
  const [removeSubmitting, setRemoveSubmitting] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    fetchThoughtLeaders(activeTab);
  }, [activeTab]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        router.push('/login?redirect=/admin/thought-leaders');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok || !(await response.json()).isAdmin) {
        router.push('/login?redirect=/admin/thought-leaders');
        return;
      }
    } catch (err) {
      console.error('Error checking admin access:', err);
      router.push('/login?redirect=/admin/thought-leaders');
    }
  };

  const fetchThoughtLeaders = async (status) => {
    setLoading(true);
    setError(null);
    setExpandedId(null);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/thoughtleaders?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch thought leaders');
      }

      const data = await response.json();
      setThoughtLeaders(data);
    } catch (err) {
      console.error('Error fetching thought leaders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveThoughtLeader = async (userId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/thoughtleaders/${userId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_verified: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve thought leader');
      }

      setThoughtLeaders((prev) => prev.filter((t) => t._id !== userId));
      setVerifiedIds((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      alert('Thought leader approved successfully!');
    } catch (err) {
      console.error('Error approving thought leader:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const openRejectModal = (userId, firstname, lastname) => {
    setRejectModal({
      open: true,
      userId,
      name: `${firstname || ''} ${lastname || ''}`.trim() || 'this applicant',
    });
    setRejectReason('');
  };

  const closeRejectModal = () => {
    if (rejectSubmitting) return;
    setRejectModal({ open: false, userId: null, name: '' });
    setRejectReason('');
  };

  const submitReject = async () => {
    const trimmed = rejectReason.trim();
    if (!trimmed) return;

    setRejectSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/admin/thoughtleaders/${rejectModal.userId}/reject`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: trimmed }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject thought leader');
      }

      setThoughtLeaders((prev) => prev.filter((t) => t._id !== rejectModal.userId));
      setVerifiedIds((prev) => {
        const next = { ...prev };
        delete next[rejectModal.userId];
        return next;
      });
      setRejectModal({ open: false, userId: null, name: '' });
      setRejectReason('');
      alert('Thought leader application rejected.');
    } catch (err) {
      console.error('Error rejecting thought leader:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setRejectSubmitting(false);
    }
  };

  const openRemoveModal = (userId, firstname, lastname) => {
    setRemoveModal({
      open: true,
      userId,
      name: `${firstname || ''} ${lastname || ''}`.trim() || 'this thought leader',
    });
  };

  const closeRemoveModal = () => {
    if (removeSubmitting) return;
    setRemoveModal({ open: false, userId: null, name: '' });
  };

  const submitRemove = async () => {
    setRemoveSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/thoughtleaders/${removeModal.userId}/remove`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove thought leader');
      }

      setThoughtLeaders((prev) => prev.filter((t) => t._id !== removeModal.userId));
      setRemoveModal({ open: false, userId: null, name: '' });
      alert('Thought leader removed. They will need to reapply.');
    } catch (err) {
      console.error('Error removing thought leader:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setRemoveSubmitting(false);
    }
  };

  const renderApplicantHeader = (tl) => (
    <div className="flex items-center space-x-4 flex-1">
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
        {tl.profile_picture ? (
          <SafeImage
            src={tl.profile_picture}
            alt={`${tl.firstname} ${tl.lastname}`}
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900">
          {tl.firstname} {tl.lastname}
        </h3>
        <p className="text-sm text-gray-500">{tl.email}</p>
        {tl.country_of_residence && (
          <p className="text-xs text-gray-400 mt-1">{tl.country_of_residence}</p>
        )}
      </div>
    </div>
  );

  const renderDetailsGrid = (tl) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tl.displayName && (
        <div className="bg-white rounded-md p-4 border border-gray-200">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Display Name
          </span>
          <p className="text-sm font-semibold text-gray-900 mt-1">{tl.displayName}</p>
        </div>
      )}
      <div className="bg-white rounded-md p-4 border border-gray-200">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          City of Residence
        </span>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {tl.city_of_residence || 'N/A'}
        </p>
      </div>
      <div className="bg-white rounded-md p-4 border border-gray-200">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Country of Residence
        </span>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {tl.country_of_residence || 'N/A'}
        </p>
      </div>
      {tl.area_of_expertise && (
        <div className="bg-white rounded-md p-4 border border-gray-200">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Area of Expertise
          </span>
          <p className="text-sm font-semibold text-gray-900 mt-1">{tl.area_of_expertise}</p>
        </div>
      )}
      {(tl.phone_country_code || tl.phone_number) && (
        <div className="bg-white rounded-md p-4 border border-gray-200">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Phone
          </span>
          <p className="text-sm font-semibold text-gray-900 mt-1">
            {`${tl.phone_country_code || ''} ${tl.phone_number || ''}`.trim() || 'N/A'}
          </p>
        </div>
      )}
      <div className="bg-white rounded-md p-4 border border-gray-200">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Account Created
        </span>
        <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(tl.created_on)}</p>
      </div>
    </div>
  );

  const renderPaymentBlock = (application) => (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Payment
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-md p-3 border border-gray-200">
          <span className="text-xs text-gray-500">Paid On</span>
          <p className="text-sm font-medium text-gray-900">{formatDate(application.paid_on)}</p>
        </div>
        <div className="bg-white rounded-md p-3 border border-gray-200">
          <span className="text-xs text-gray-500">Platform</span>
          <p className="text-sm font-medium text-gray-900 capitalize">
            {application.payment_platform || 'N/A'}
          </p>
        </div>
        <div className="bg-white rounded-md p-3 border border-gray-200">
          <span className="text-xs text-gray-500">Product ID</span>
          <p className="text-sm font-medium text-gray-900 truncate">
            {application.payment_product_id || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderApprovedAudit = (application) => (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
      <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-md p-3">
        <svg
          className="w-5 h-5 text-green-600 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm text-green-900">
          <div>
            <span className="font-semibold">ID verified</span> by{' '}
            {application.id_verified_by_admin_email || 'Unknown admin'} on{' '}
            {formatDateTime(application.id_verified_on)}
          </div>
          <div className="mt-1">
            <span className="font-semibold">Approved</span> by{' '}
            {application.approved_by_admin_email || 'Unknown admin'} on{' '}
            {formatDateTime(application.approved_on)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRejectedAudit = (application) => (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3">
        <svg
          className="w-5 h-5 text-red-600 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm text-red-900 flex-1">
          <div>
            <span className="font-semibold">Rejected</span> by{' '}
            {application.rejected_by_admin_email || 'Unknown admin'} on{' '}
            {formatDateTime(application.rejected_on)}
          </div>
          {application.rejection_reason && (
            <div className="mt-2">
              <span className="font-semibold">Reason:</span>
              <p className="mt-1 whitespace-pre-wrap">{application.rejection_reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderActionBar = (tl) => {
    const isVerified = !!verifiedIds[tl._id];
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setExpandedId(expandedId === tl._id ? null : tl._id)}
          className="p-2 text-slate-400 hover:text-[#66462C] transition-colors"
          aria-label="Toggle details"
        >
          <svg
            className={`w-6 h-6 transform transition-transform ${
              expandedId === tl._id ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => openRejectModal(tl._id, tl.firstname, tl.lastname)}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={() => approveThoughtLeader(tl._id)}
          disabled={!isVerified}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isVerified
              ? 'bg-[#66462C] text-white hover:bg-[#563B25] cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={isVerified ? 'Approve' : 'Tick "I verified the ID" below first'}
        >
          Approve
        </button>
      </div>
    );
  };

  const renderApprovedActions = (tl) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setExpandedId(expandedId === tl._id ? null : tl._id)}
        className="p-2 text-slate-400 hover:text-[#66462C] transition-colors"
        aria-label="Toggle details"
      >
        <svg
          className={`w-6 h-6 transform transition-transform ${
            expandedId === tl._id ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <button
        onClick={() => openRemoveModal(tl._id, tl.firstname, tl.lastname)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
      >
        Remove
      </button>
    </div>
  );

  const renderEmptyState = () => {
    const messages = {
      pending: 'No pending thought leader applications',
      approved: 'No approved thought leaders yet',
      rejected: 'No rejected applications',
    };
    return (
      <div className="bg-white shadow-sm rounded-lg p-12 text-center">
        <p className="text-slate-600">{messages[activeTab]}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Thought Leaders
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-[#66462C] text-[#66462C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading thought leaders...</div>
        </div>
      ) : thoughtLeaders.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="bg-white shadow-sm overflow-hidden rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {thoughtLeaders.map((tl) => {
              const application = tl.application || {};
              const isExpanded = expandedId === tl._id;
              return (
                <li key={tl._id} className="p-6">
                  <div className="flex items-center justify-between">
                    {renderApplicantHeader(tl)}
                    {activeTab === 'pending' ? renderActionBar(tl) : null}
                    {activeTab === 'approved' ? renderApprovedActions(tl) : null}
                    {activeTab === 'rejected' ? (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : tl._id)}
                        className="p-2 text-slate-400 hover:text-[#66462C] transition-colors"
                        aria-label="Toggle details"
                      >
                        <svg
                          className={`w-6 h-6 transform transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-4">
                          Applicant Information
                        </h4>
                        {renderDetailsGrid(tl)}

                        {tl.bio && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Bio
                            </span>
                            <p className="mt-2 text-sm text-gray-700 bg-white p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                              {tl.bio}
                            </p>
                          </div>
                        )}

                        {renderPaymentBlock(application)}

                        {activeTab === 'approved' && renderApprovedAudit(application)}
                        {activeTab === 'rejected' && renderRejectedAudit(application)}

                        {activeTab === 'pending' && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                id={`verify-${tl._id}`}
                                checked={!!verifiedIds[tl._id]}
                                onChange={() =>
                                  setVerifiedIds((prev) => ({
                                    ...prev,
                                    [tl._id]: !prev[tl._id],
                                  }))
                                }
                                className="w-5 h-5 text-[#66462C] border-gray-300 rounded focus:ring-[#66462C] focus:ring-2"
                              />
                              <label
                                htmlFor={`verify-${tl._id}`}
                                className="text-sm font-medium text-gray-900 cursor-pointer"
                              >
                                I verified the ID
                              </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-8">
                              The Approve button is enabled once this is checked. Approving
                              records you as the ID verifier.
                            </p>
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
      )}

      {/* Reject modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reject application</h3>
              <p className="text-sm text-gray-500 mt-1">
                Provide a reason for rejecting{' '}
                <span className="font-medium">{rejectModal.name}</span>. This will be logged
                with your admin account.
              </p>
            </div>
            <div className="p-6">
              <label
                htmlFor="reject-reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reject-reason"
                rows={5}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={rejectSubmitting}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:border-transparent disabled:bg-gray-50"
                placeholder="Explain why this application is being rejected..."
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                disabled={rejectSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={!rejectReason.trim() || rejectSubmitting}
                className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
                  !rejectReason.trim() || rejectSubmitting
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {rejectSubmitting ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove modal (approved tab) */}
      {removeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Remove thought leader</h3>
              <p className="text-sm text-gray-500 mt-1">
                This will reset the Thought Leader record for{' '}
                <span className="font-medium">{removeModal.name}</span>. They will need to reapply again.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end gap-3">
              <button
                onClick={closeRemoveModal}
                disabled={removeSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRemove}
                disabled={removeSubmitting}
                className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
                  removeSubmitting ? 'bg-amber-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {removeSubmitting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
