'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SafeImage } from '@/components/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function AdminJournalistsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;

  const [journalists, setJournalists] = useState([]);
  const [allJournalists, setAllJournalists] = useState([]); // Store all journalists for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    checkAdminAccess();
    fetchJournalists();
  }, [page]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/admin/journalists');
        return;
      }

      const response = await fetch(`${API_URL}/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        router.push('/login?redirect=/admin/journalists');
        return;
      }

      const data = await response.json();
      
      if (!data.isAdmin) {
        router.push('/login?redirect=/admin/journalists');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/login?redirect=/admin/journalists');
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

      const response = await fetch(`${API_URL}/admin/journalists?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch journalists');
      }

      const data = await response.json();
      const fetchedJournalists = data.journalists || [];
      setAllJournalists(fetchedJournalists);
      // The useEffect will handle filtering based on searchQuery
      
      setPagination({
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        currentPage: data.pagination?.page || page,
      });
    } catch (err) {
      console.error('Error fetching journalists:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateJournalistRole = async (journalistId, newRole) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/users/${journalistId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update journalist role');
      }

      // Refresh journalists list
      fetchJournalists();
    } catch (err) {
      console.error('Error updating journalist role:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getJournalistName = (journalist) => {
    if (journalist.profile) {
      return journalist.profile.displayName || `${journalist.profile.firstname} ${journalist.profile.lastname}`;
    }
    return journalist.email.split('@')[0]; // Fallback to email username
  };

  const getJournalistLocation = (journalist) => {
    if (journalist.profile) {
      const city = journalist.profile.city_of_residence || '';
      const country = journalist.profile.country_of_residence || '';
      if (city && country) {
        return `${city}, ${country}`;
      } else if (city) {
        return city;
      } else if (country) {
        return country;
      }
    }
    return 'N/A';
  };

  const getRoleDisplay = (role) => {
    if (role === 'journalist' || role === 'general' || role === 'contributor') {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
    return null;
  };

  // Filter journalists based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setJournalists(allJournalists);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = allJournalists.filter((journalist) => {
      const email = journalist.email?.toLowerCase() || '';
      const firstname = journalist.profile?.firstname?.toLowerCase() || '';
      const lastname = journalist.profile?.lastname?.toLowerCase() || '';
      const fullName = `${firstname} ${lastname}`.trim();
      
      return (
        email.includes(query) ||
        firstname.includes(query) ||
        lastname.includes(query) ||
        fullName.includes(query)
      );
    });

    setJournalists(filtered);
  }, [searchQuery, allJournalists]);

  if (loading && journalists.length === 0) {
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
          Journalist Management
        </h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by email, first name, or last name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#66462C] focus:border-[#66462C] sm:text-sm"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500">
            Showing {journalists.length} result{journalists.length !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && journalists.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <p className="text-slate-600">No journalists found</p>
        </div>
      )}

      {!loading && !error && journalists.length > 0 && (
        <div className="bg-white shadow-sm overflow-hidden rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {journalists.map((journalist) => {
              const isExpanded = expandedId === journalist._id;
              const showRole = journalist.role === 'journalist' || journalist.role === 'general' || journalist.role === 'contributor';
              
              return (
                <li key={journalist._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        {journalist.profile?.profile_picture ? (
                          <SafeImage
                            src={journalist.profile.profile_picture}
                            alt={getJournalistName(journalist)}
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
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getJournalistName(journalist)}
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 min-w-0">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{journalist.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 min-w-0">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{getJournalistLocation(journalist)}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${journalist.verifiedEmail ? 'text-green-600' : 'text-red-600'}`}>
                            {journalist.verifiedEmail ? (
                              <>
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Email Verified</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Email Not Verified</span>
                              </>
                            )}
                          </div>
                          {showRole && (
                            <div className="flex items-center">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {getRoleDisplay(journalist.role)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : journalist._id)}
                        className="p-2 text-slate-400 hover:text-[#66462C] transition-colors"
                      >
                        <svg
                          className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-4">Journalist Details</h4>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                          </label>
                          <select
                            value={journalist.role}
                            onChange={(e) => updateJournalistRole(journalist._id, e.target.value)}
                            className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:border-transparent"
                          >
                            <option value="journalist">Journalist</option>
                            <option value="general">General</option>
                            <option value="contributor">Contributor</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {journalist.profile?.displayName && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.profile.displayName}</p>
                            </div>
                          )}

                          {journalist.profile?.firstname && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {journalist.profile.firstname} {journalist.profile.lastname}
                              </p>
                            </div>
                          )}

                          <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.email}</p>
                          </div>

                          <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{getJournalistLocation(journalist)}</p>
                          </div>

                          {journalist.profile?.city_of_residence && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.profile.city_of_residence}</p>
                            </div>
                          )}

                          {journalist.profile?.country_of_residence && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.profile.country_of_residence}</p>
                            </div>
                          )}

                          {journalist.profile?.phone_number && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {journalist.profile.phone_country_code ? `${journalist.profile.phone_country_code} ` : ''}
                                {journalist.profile.phone_number}
                              </p>
                            </div>
                          )}

                          {journalist.profile?.journalist_affiliation && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Affiliation</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.profile.journalist_affiliation}</p>
                            </div>
                          )}

                          {journalist.profile?.trust_score !== undefined && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trust Score</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.profile.trust_score}</p>
                            </div>
                          )}

                          {journalist.profile?.total_articles_published !== undefined && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Articles</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.profile.total_articles_published || 0}</p>
                            </div>
                          )}

                          {journalist.profile?.journalist_description && (
                            <div className="bg-white rounded-md p-4 border border-gray-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</span>
                              </div>
                              <p className="text-sm text-gray-900 mt-1">{journalist.profile.journalist_description}</p>
                            </div>
                          )}

                          {journalist.profile?.area_of_expertise && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Area of Expertise</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{journalist.profile.area_of_expertise}</p>
                            </div>
                          )}

                          <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Created</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {new Date(journalist.created_on).toLocaleDateString()}
                            </p>
                          </div>

                          {journalist.last_login && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Login</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {new Date(journalist.last_login).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <Link
                            href={`/admin/journalists/${journalist._id}/articles`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#66462C] text-white text-sm font-medium rounded-lg hover:bg-[#563B25] transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            See Articles
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {pagination.currentPage} of {pagination.pages} ({pagination.total} total journalists)
          </div>
          <div className="flex gap-2">
            {pagination.currentPage > 1 && (
              <button
                onClick={() => router.push(`/admin/journalists?page=${pagination.currentPage - 1}`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {pagination.currentPage < pagination.pages && (
              <button
                onClick={() => router.push(`/admin/journalists?page=${pagination.currentPage + 1}`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminJournalistsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <AdminJournalistsPageContent />
    </Suspense>
  );
}
