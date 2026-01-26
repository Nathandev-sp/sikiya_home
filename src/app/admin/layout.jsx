'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { Logo } from '@/components/Logo'
import { AdminLogoutButton } from '@/components/AdminLogoutButton'
import { useInactivityLogout } from '@/hooks/useInactivityLogout'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Icon components
const Bars3Icon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)

const XMarkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const DocumentTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const VideoCameraIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const JournalistIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
)

const PublisherIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
)

const ShieldCheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M7 15v3M11 11v7M15 7v11M19 5v13" />
  </svg>
)

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Pending Journalists', href: '/admin/journalists/pending', icon: UserIcon },
  { name: 'Pending Articles', href: '/admin/articles/pending', icon: DocumentTextIcon },
  { name: 'Pending Videos', href: '/admin/videos/pending', icon: VideoCameraIcon },
]

const approvedNavigation = [
  { name: 'Approved Articles', href: '/admin/articles/approved', icon: CheckCircleIcon },
  { name: 'Approved Videos', href: '/admin/videos/approved', icon: CheckCircleIcon },
]

const managementNavigation = [
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Journalists', href: '/admin/journalists', icon: JournalistIcon },
  { name: 'Publishers', href: '/admin/publishers', icon: PublisherIcon },
  { name: 'Admins', href: '/admin/admins', icon: ShieldCheckIcon },
]

const appStatsNavigation = [
  { name: 'App Stats', href: '/admin/app-stats', icon: ChartBarIcon },
  { name: 'Views', href: '/admin/views', icon: EyeIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // Auto logout after 30 minutes of inactivity
  useInactivityLogout(30 * 60 * 1000, '/login?redirect=/admin')

  useEffect(() => {
    // Check if user is publisher and redirect them
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          router.push('/login?redirect=/admin');
          return;
        }

        const response = await fetch(`${API_URL}/verify-admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // If user is publisher, redirect to publisher panel
          if (data.role === 'publisher') {
            router.push('/publisher');
            return;
          }
          
          // If user is not admin, redirect to login
          if (!data.isAdmin) {
            router.push('/login?redirect=/admin');
            return;
          }

          // Update user info in sidebar
          const userInfoEl = document.getElementById('admin-user-info');
          if (userInfoEl) {
            userInfoEl.textContent = `${data.email} (${data.role})`;
          }
        } else {
          router.push('/login?redirect=/admin');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/login?redirect=/admin');
      }
    };

    checkRole();
  }, [router]);

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  return (
    <div>
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            {/* Mobile Sidebar content */}
            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
              <div className="relative flex h-20 shrink-0 items-center justify-center">
                <Link href="/admin" aria-label="Admin Home">
                  <Logo className="h-12 w-auto" />
                </Link>
              </div>
              <nav className="relative flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const active = isActive(item.href)
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                active
                                  ? 'bg-[#F6F3EF] text-[#66462C]'
                                  : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                                'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                                  'size-5 shrink-0',
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-medium text-gray-400">Approved Content</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {approvedNavigation.map((item) => {
                        const active = isActive(item.href)
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                active
                                  ? 'bg-[#F6F3EF] text-[#66462C]'
                                  : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                                'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                                  'size-5 shrink-0',
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-medium text-gray-400">Management</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {managementNavigation.map((item) => {
                        const active = isActive(item.href)
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                active
                                  ? 'bg-[#F6F3EF] text-[#66462C]'
                                  : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                                'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                                  'size-5 shrink-0',
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-medium text-gray-400">App Stats</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {appStatsNavigation.map((item) => {
                        const active = isActive(item.href)
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                active
                                  ? 'bg-[#F6F3EF] text-[#66462C]'
                                  : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                                'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                                  'size-5 shrink-0',
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                </ul>
              </nav>
              <div className="border-t border-gray-200 pt-4 pb-4">
                <div id="admin-user-info" className="text-sm font-medium text-gray-700 mb-3 truncate">
                  Loading...
                </div>
                <AdminLogoutButton />
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="relative flex h-20 shrink-0 items-center justify-center">
            <Link href="/admin" aria-label="Admin Home">
              <Logo className="h-12 w-auto" />
            </Link>
          </div>
          <nav className="relative flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            active
                              ? 'bg-[#F6F3EF] text-[#66462C]'
                              : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                            'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                              'size-5 shrink-0',
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li>
                <div className="text-xs font-medium text-gray-400">App Stats</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {appStatsNavigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            active
                              ? 'bg-[#F6F3EF] text-[#66462C]'
                              : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                            'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                              'size-5 shrink-0',
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li>
                <div className="text-xs font-medium text-gray-400">Approved Content</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {approvedNavigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            active
                              ? 'bg-[#F6F3EF] text-[#66462C]'
                              : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                            'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                              'size-5 shrink-0',
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li>
                <div className="text-xs font-medium text-gray-400">Management</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {managementNavigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            active
                              ? 'bg-[#F6F3EF] text-[#66462C]'
                              : 'text-gray-700 hover:bg-[#F6F3EF] hover:text-[#66462C]',
                            'group flex gap-x-3 rounded-md p-2 text-xs font-medium',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              active ? 'text-[#66462C]' : 'text-gray-400 group-hover:text-[#66462C]',
                              'size-5 shrink-0',
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="border-t border-gray-200 px-6 py-4">
                  <div id="admin-user-info" className="text-sm font-medium text-gray-700 mb-3 truncate">
                    Loading...
                  </div>
                  <AdminLogoutButton />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="relative -m-2.5 p-2.5 text-gray-700"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="relative flex-1 text-sm/6 font-semibold text-gray-900">Admin Dashboard</div>
      </div>

      {/* Main content - single column */}
      <main className="lg:pl-72">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
          <div className="min-h-screen bg-[#F6F3EF] -mx-4 -my-10 sm:-mx-6 lg:-mx-8 lg:-my-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

