/**
 * Centralized image utility for GitHub Pages and development builds.
 * Handles BASE_URL resolution for proper image loading.
 */

/**
 * Resolves image paths for GitHub Pages compatibility.
 *
 * @param path - Absolute path starting with "/" (e.g., "/images/components/controllers/pro-micro.webp")
 * @returns Resolved URL with BASE_URL prefix if needed
 *
 * @example
 * // Development (BASE_URL = "/")
 * getImageUrl("/images/test.jpg") // => "/images/test.jpg"
 *
 * // GitHub Pages (BASE_URL = "/keyboard-building/")
 * getImageUrl("/images/test.jpg") // => "/keyboard-building/images/test.jpg"
 */
export function getImageUrl(path: string): string {
  if (!path) return ''

  const base = import.meta.env.BASE_URL || '/'

  // Remove leading slash from path if present and combine with base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  return `${base}${cleanPath}`
}

/**
 * Validates that an image path follows the expected format.
 * Useful for development-time checks.
 */
export function isValidImagePath(path: string): boolean {
  if (!path) return false

  // Should start with /images/
  if (!path.startsWith('/images/')) return false

  // Should have a file extension
  const hasExtension = /\.(jpg|jpeg|png|webp|svg)$/i.test(path)

  return hasExtension
}

/**
 * Helper to generate image path from components.
 * Useful when adding new images programmatically.
 */
export function buildImagePath(category: string, filename: string): string {
  return `/images/components/${category}/${filename}`
}
