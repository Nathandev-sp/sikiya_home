'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PendingJournalistsPage() {
  const router = useRouter();
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    checkAdminAccess();
    fetchJournalists();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/journalists/pending');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok || !(await response.json()).isAdmin) {
        router.push('/login?redirect=/admin/journalists/pending');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/journalists/pending');
    }
  };

  const fetchJournalists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/journalists/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pending journalists');
      }

      const data = await response.json();
      setJournalists(data);
    } catch (err) {
      console.error('Error fetching journalists:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveJournalist = async (journalistId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/journalists/${journalistId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve journalist');
      }

      // Remove from list
      setJournalists(journalists.filter(j => j._id !== journalistId));
      alert('Journalist approved successfully!');
    } catch (err) {
      console.error('Error approving journalist:', err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading journalists...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Pending Journalist Approvals
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && journalists.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <p className="text-slate-600">No pending journalist approvals</p>
        </div>
      )}

      {!loading && !error && journalists.length > 0 && (
        <div className="bg-white shadow-sm overflow-hidden rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {journalists.map((journalist) => (
              <li key={journalist._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
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
                      <h3 className="text-lg font-medium text-gray-900">
                        {journalist.firstname} {journalist.lastname}
                      </h3>
                      <p className="text-sm text-gray-500">{journalist.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setExpandedId(expandedId === journalist._id ? null : journalist._id)}
                      className="p-2 text-slate-400 hover:text-[#66462C] transition-colors"
                    >
                      <svg
                        className={`w-6 h-6 transform transition-transform ${expandedId === journalist._id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => approveJournalist(journalist._id)}
                      className="px-4 py-2 bg-[#66462C] text-white text-sm font-medium rounded-lg hover:bg-[#563B25] transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {expandedId === journalist._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">Journalist Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {journalist.displayName && (
                          <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.displayName}</p>
                          </div>
                        )}
                        
                        {journalist.journalist_affiliation && (
                          <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Affiliation</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.journalist_affiliation}</p>
                          </div>
                        )}
                        
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">City of Residence</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.city_of_residence || 'N/A'}</p>
                        </div>
                        
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country of Residence</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.country_of_residence || 'N/A'}</p>
                        </div>
                        
                        {journalist.area_of_expertise && (
                          <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Area of Expertise</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.area_of_expertise}</p>
                          </div>
                        )}
                        
                        {(journalist.phone_country_code || journalist.phone_number) && (
                          <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">WhatsApp Phone</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {journalist.phone_country_code && journalist.phone_number 
                                ? `${journalist.phone_country_code} ${journalist.phone_number}`
                                : journalist.phone_country_code 
                                  ? journalist.phone_country_code 
                                  : journalist.phone_number 
                                    ? journalist.phone_number 
                                    : 'N/A'}
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {new Date(journalist.created_on).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {journalist.journalist_description && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</span>
                          </div>
                          <p className="text-sm text-gray-700 bg-white p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                            {journalist.journalist_description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

