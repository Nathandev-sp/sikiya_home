'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export function NavLink({ href, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={clsx(
        'inline-block rounded-lg px-2 py-1 text-sm transition-colors',
        isActive
          ? 'bg-[#66462C] text-white'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      {children}
    </Link>
  )
}
