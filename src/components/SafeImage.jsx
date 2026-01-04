'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

/**
 * SafeImage component that handles file:// URLs and invalid image sources
 * Automatically converts image keys to CloudFront URLs
 * Falls back to a placeholder if the image URL is invalid
 */
export function SafeImage({ src, alt, fill, className, width, height, ...props }) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    // Convert the src (which might be a key) to a full CloudFront URL
    const fullUrl = getImageUrl(src);
    setImgSrc(fullUrl);
    setHasError(false);
  }, [src]);

  // If URL is invalid or error occurred, use placeholder
  if (!imgSrc || hasError) {
    const placeholderStyle = fill 
      ? { position: 'absolute', inset: 0 } 
      : width && height 
        ? { width, height } 
        : {};
    
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className || ''}`} 
        style={placeholderStyle}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Use Next.js Image component with unoptimized for external URLs
  return (
    <Image
      src={imgSrc}
      alt={alt || ''}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={() => setHasError(true)}
      unoptimized={imgSrc.startsWith('http://') || imgSrc.startsWith('https://')}
      {...props}
    />
  );
}

