/**
 * Get the CloudFront URL from environment variables
 */
export function getCloudFrontUrl() {
  return process.env.NEXT_PUBLIC_CLOUDFRONT_URL || 'https://d1flj35lnh82ng.cloudfront.net';
}

/**
 * Convert an image/video key to a full CloudFront URL
 * If the input is already a full URL, return it as-is
 * @param {string} key - The image/video key or full URL
 * @returns {string} - The full CloudFront URL or original URL
 */
export function getImageUrl(key) {
  if (!key) return null;
  if (typeof key !== 'string') return null;
  
  // If it's already a full URL, return as-is
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key;
  }
  
  // If it's a file:// URL, return null (invalid)
  if (key.startsWith('file://')) {
    return null;
  }
  
  // If it's a relative path starting with /, return as-is
  if (key.startsWith('/')) {
    return key;
  }
  
  // Otherwise, treat it as a key and prepend CloudFront URL
  const cloudFrontUrl = getCloudFrontUrl();
  // Ensure the key doesn't already start with a slash
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${cloudFrontUrl}/${cleanKey}`;
}

/**
 * Convert an array of image keys to full CloudFront URLs
 * @param {string[]} keys - Array of image keys or URLs
 * @returns {string[]} - Array of full CloudFront URLs or original URLs
 */
export function getImageUrls(keys) {
  if (!Array.isArray(keys)) return [];
  return keys.map(key => getImageUrl(key)).filter(url => url !== null);
}


