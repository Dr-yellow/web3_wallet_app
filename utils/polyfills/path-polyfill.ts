/**
 * Path polyfill for React Native
 * Anchor SDK requires path module which is not available in React Native
 * 
 * This file provides a minimal path mock that satisfies Anchor SDK's requirements
 */

// Minimal path polyfill for React Native
// Anchor SDK uses path for file path operations, but we don't need actual path operations
const pathPolyfill = {
  join: (...paths: string[]): string => {
    // Simple path joining - just concatenate with '/'
    return paths.filter(Boolean).join('/').replace(/\/+/g, '/');
  },
  resolve: (...paths: string[]): string => {
    // Simple path resolution - similar to join
    return paths.filter(Boolean).join('/').replace(/\/+/g, '/');
  },
  dirname: (path: string): string => {
    // Return parent directory
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return parts.length > 0 ? '/' + parts.join('/') : '/';
  },
  basename: (path: string, ext?: string): string => {
    // Return filename
    const parts = path.split('/').filter(Boolean);
    const filename = parts[parts.length - 1] || '';
    if (ext && filename.endsWith(ext)) {
      return filename.slice(0, -ext.length);
    }
    return filename;
  },
  extname: (path: string): string => {
    // Return file extension
    const parts = path.split('/').filter(Boolean);
    const filename = parts[parts.length - 1] || '';
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.slice(lastDot) : '';
  },
  sep: '/',
  delimiter: ':',
};

// Set path on global for direct access (if needed)
if (typeof global !== 'undefined') {
  (global as any).path = pathPolyfill;
}

// Also set on globalThis for compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).path = pathPolyfill;
}

// Export for use as a module (CommonJS)
// This is critical for Anchor SDK which uses require('path')
if (typeof module !== 'undefined' && module.exports) {
  module.exports = pathPolyfill;
}

// Export for use as ES module
export default pathPolyfill;

// Also export as named export for ES modules
export const path = pathPolyfill;
