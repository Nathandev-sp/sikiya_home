'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SafeImage } from '@/components/SafeImage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const ARTICLE_CATEGORIES = [
  'Politics',
  'Economy',
  'Social',
  'Tech',
  'Sports',
  'Business',
  'Entertainment',
  'Culture',
  'World',
  'All'
];

function AdminPublishersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;

  const [publishers, setPublishers] = useState([]);
  const [allPublishers, setAllPublishers] = useState([]);
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
    fetchPublishers();
  }, [page]);

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

  const fetchPublishers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/publishers?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch publishers');
      }

      const data = await response.json();
      const fetchedPublishers = data.publishers || [];
      setAllPublishers(fetchedPublishers);
      
      setPagination({
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        currentPage: data.pagination?.page || page,
      });
    } catch (err) {
      console.error('Error fetching publishers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePublisherRole = async (publisherId, newRole) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/users/${publisherId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update publisher role');
      }

      fetchPublishers();
    } catch (err) {
      console.error('Error updating publisher role:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const updatePublisherCategory = async (publisherId, category) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/publishers/${publisherId}/category`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_group: category }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update publisher category');
      }

      fetchPublishers();
    } catch (err) {
      console.error('Error updating publisher category:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getPublisherName = (publisher) => {
    if (publisher.profile) {
      return publisher.profile.displayName || `${publisher.profile.firstname} ${publisher.profile.lastname}`;
    }
    return publisher.email.split('@')[0];
  };

  const getPublisherLocation = (publisher) => {
    if (publisher.profile) {
      const city = publisher.profile.city_of_residence || '';
      const country = publisher.profile.country_of_residence || '';
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

  const getCategoryDisplay = (category) => {
    return category || 'All';
  };

  // Filter publishers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPublishers(allPublishers);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = allPublishers.filter((publisher) => {
      const email = publisher.email?.toLowerCase() || '';
      const firstname = publisher.profile?.firstname?.toLowerCase() || '';
      const lastname = publisher.profile?.lastname?.toLowerCase() || '';
      const fullName = `${firstname} ${lastname}`.trim();
      const employeeId = publisher.profile?.employee_id?.toLowerCase() || '';
      
      return (
        email.includes(query) ||
        firstname.includes(query) ||
        lastname.includes(query) ||
        fullName.includes(query) ||
        employeeId.includes(query)
      );
    });

    setPublishers(filtered);
  }, [searchQuery, allPublishers]);

  if (loading && publishers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading publishers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Publisher Management
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
            placeholder="Search by email, name, or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#66462C] focus:border-[#66462C] sm:text-sm"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500">
            Showing {publishers.length} result{publishers.length !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && publishers.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <p className="text-slate-600">No publishers found</p>
        </div>
      )}

      {!loading && !error && publishers.length > 0 && (
        <div className="bg-white shadow-sm overflow-hidden rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {publishers.map((publisher) => {
              const isExpanded = expandedId === publisher._id;
              const showRole = publisher.role === 'publisher' || publisher.role === 'general' || publisher.role === 'contributor';
              
              return (
                <li key={publisher._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        {publisher.profile?.profile_picture ? (
                          <SafeImage
                            src={publisher.profile.profile_picture}
                            alt={getPublisherName(publisher)}
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
                          {getPublisherName(publisher)}
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 min-w-0">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{publisher.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 min-w-0">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{getPublisherLocation(publisher)}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${publisher.verifiedEmail ? 'text-green-600' : 'text-red-600'}`}>
                            {publisher.verifiedEmail ? (
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
                                {publisher.role.charAt(0).toUpperCase() + publisher.role.slice(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : publisher._id)}
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
                        <h4 className="text-base font-semibold text-gray-900 mb-4">Publisher Details</h4>
                        
                        <div className="mb-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <select
                              value={publisher.role}
                              onChange={(e) => updatePublisherRole(publisher._id, e.target.value)}
                              className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:border-transparent"
                            >
                              <option value="publisher">Publisher</option>
                              <option value="general">General</option>
                              <option value="contributor">Contributor</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Article Category
                            </label>
                            <select
                              value={getCategoryDisplay(publisher.profile?.article_group)}
                              onChange={(e) => updatePublisherCategory(publisher._id, e.target.value === 'All' ? null : e.target.value)}
                              className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:border-transparent"
                            >
                              {ARTICLE_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                              Publishers with "All" can see articles from all categories. Others see only their assigned category.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {publisher.profile?.displayName && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.displayName}</p>
                            </div>
                          )}

                          {publisher.profile?.firstname && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {publisher.profile.firstname} {publisher.profile.lastname}
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
                            <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.email}</p>
                          </div>

                          {publisher.profile?.employee_id && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employee ID</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.employee_id}</p>
                            </div>
                          )}

                          {publisher.profile?.department && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.department}</p>
                            </div>
                          )}

                          {publisher.profile?.position && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Position</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.position}</p>
                            </div>
                          )}

                          {publisher.profile?.work_email && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Email</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.work_email}</p>
                            </div>
                          )}

                          {publisher.profile?.work_phone && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Phone</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.work_phone}</p>
                            </div>
                          )}

                          {publisher.profile?.office_location && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Office Location</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.office_location}</p>
                            </div>
                          )}

                          {publisher.profile?.total_articles_published !== undefined && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Articles Published</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">{publisher.profile.total_articles_published || 0}</p>
                            </div>
                          )}

                          {publisher.profile?.employment_status && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment Status</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {publisher.profile.employment_status.charAt(0).toUpperCase() + publisher.profile.employment_status.slice(1).replace('_', ' ')}
                              </p>
                            </div>
                          )}

                          {publisher.profile?.hire_date && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hire Date</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {new Date(publisher.profile.hire_date).toLocaleDateString()}
                              </p>
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
                              {new Date(publisher.created_on).toLocaleDateString()}
                            </p>
                          </div>

                          {publisher.last_login && (
                            <div className="bg-white rounded-md p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Login</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {new Date(publisher.last_login).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <Link
                            href={`/admin/publishers/${publisher._id}/articles`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#66462C] text-white text-sm font-medium rounded-lg hover:bg-[#563B25] transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            See Details
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
            Showing page {pagination.currentPage} of {pagination.pages} ({pagination.total} total publishers)
          </div>
          <div className="flex gap-2">
            {pagination.currentPage > 1 && (
              <button
                onClick={() => router.push(`/admin/publishers?page=${pagination.currentPage - 1}`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {pagination.currentPage < pagination.pages && (
              <button
                onClick={() => router.push(`/admin/publishers?page=${pagination.currentPage + 1}`)}
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

export default function AdminPublishersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <AdminPublishersPageContent />
    </Suspense>
  );
}
