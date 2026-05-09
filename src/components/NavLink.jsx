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
        'inline-block rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-[#8D6242] text-white shadow-sm'
          : 'text-[#4A3428] hover:bg-black/[0.04] hover:text-[#2A1B14]',
      )}
    >
      {children}
    </Link>
  )
}
