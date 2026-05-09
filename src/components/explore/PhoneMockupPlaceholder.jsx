import Image from 'next/image'

import clsx from 'clsx'

export function PhoneMockupPlaceholder({ label, src, alt, className }) {
  const showImage = Boolean(src)

  return (
    <div
      className={clsx('relative mx-auto w-full max-w-[11.5rem]', className)}
      aria-hidden={!label && !alt}
    >
      <div className="rounded-[2.25rem] bg-[#141414] px-[0.35rem] pb-[0.35rem] pt-2 shadow-xl shadow-black/25 ring-1 ring-black/40">
        <div
          className="mx-auto mb-1.5 h-[0.2rem] w-14 rounded-full bg-[#0a0a0a]"
          aria-hidden
        />
        <div
          className={clsx(
            'relative flex aspect-[9/19.2] w-full flex-col overflow-hidden rounded-[1.85rem] bg-[#EDEAE4] ring-1 ring-white/10',
            showImage && 'bg-[#1a1a1a]',
          )}
        >
          {showImage ? (
            <Image
              src={src}
              alt={alt ?? ''}
              fill
              sizes="(max-width: 640px) 45vw, 200px"
              className="object-cover object-top"
            />
          ) : label ? (
            <div className="flex flex-1 items-center justify-center px-3 text-center text-[0.65rem] leading-snug tracking-wide text-[#8D6242]/75">
              {label}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
