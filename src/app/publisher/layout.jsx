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

const navigation = [
  { name: 'Dashboard', href: '/publisher', icon: HomeIcon },
]

const articlesNavigation = [
  { name: 'Pending Articles', href: '/publisher/articles/pending', icon: DocumentTextIcon },
  { name: 'Approved Articles', href: '/publisher/articles/approved', icon: DocumentTextIcon },
  { name: 'Rejected Articles', href: '/publisher/articles/rejected', icon: DocumentTextIcon },
]

const videosNavigation = [
  { name: 'Pending Videos', href: '/publisher/videos/pending', icon: VideoCameraIcon },
  { name: 'Approved Videos', href: '/publisher/videos/approved', icon: VideoCameraIcon },
  { name: 'Rejected Videos', href: '/publisher/videos/rejected', icon: VideoCameraIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PublisherLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // Auto logout after 30 minutes of inactivity
  useInactivityLogout(30 * 60 * 1000, '/login?redirect=/publisher')

  useEffect(() => {
    // Check if user is admin and redirect them
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          router.push('/login?redirect=/publisher');
          return;
        }

        const response = await fetch(`${API_URL}/verify-publisher`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // If user is admin, redirect to admin panel
          if (data.role === 'admin') {
            router.push('/admin');
            return;
          }
          
          // If user is not publisher, redirect to login
          if (!data.isPublisher) {
            router.push('/login?redirect=/publisher');
            return;
          }

          // Update user info in sidebar
          const userInfoEl = document.getElementById('publisher-user-info');
          if (userInfoEl) {
            userInfoEl.textContent = `${data.email} (${data.role})`;
          }
        } else {
          router.push('/login?redirect=/publisher');
        }
      } catch (error) {
        console.error('Error checking publisher access:', error);
        router.push('/login?redirect=/publisher');
      }
    };

    checkRole();
  }, [router]);

  const isActive = (href) => {
    if (href === '/publisher') {
      return pathname === '/publisher'
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
                <Link href="/publisher" aria-label="Publisher Home">
                  <Logo className="h-20 w-auto" />
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
                  <div className="text-xs font-medium text-gray-400">Articles</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {articlesNavigation.map((item) => {
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
                  <div className="text-xs font-medium text-gray-400">Videos</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {videosNavigation.map((item) => {
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
                <div id="publisher-user-info" className="text-sm font-medium text-gray-700 mb-3 truncate">
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
            <Link href="/publisher" aria-label="Publisher Home">
              <Logo className="h-20 w-auto" />
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
                <div className="text-xs font-medium text-gray-400">Articles</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {articlesNavigation.map((item) => {
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
                <div className="text-xs font-medium text-gray-400">Videos</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {videosNavigation.map((item) => {
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
                  <div id="publisher-user-info" className="text-sm font-medium text-gray-700 mb-3 truncate">
                    Loading...
                  </div>
                  <AdminLogoutButton />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-[#F6F3EF] px-4 py-4 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="relative -m-2.5 p-2.5 text-gray-700"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="relative flex-1 text-sm/6 font-semibold text-gray-900">Publisher Panel</div>
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
