/**
 * FS polyfill for React Native
 * Anchor SDK requires fs module which is not available in React Native
 * 
 * This file provides a minimal fs mock that satisfies Anchor SDK's requirements
 */

// Minimal fs polyfill for React Native
// Anchor SDK uses fs for workspace operations, but we don't need actual file system access
const fsPolyfill = {
  existsSync: (path: string): boolean => {
    // Always return false - we don't need file system access in React Native
    return false;
  },
  readFileSync: (path: string, encoding?: string): string => {
    // Anchor SDK tries to read Anchor.toml for workspace configuration
    // In React Native, we don't have workspace files, so return empty TOML config
    if (path === 'Anchor.toml' || path.endsWith('Anchor.toml')) {
      // Return minimal valid TOML to prevent parsing errors
      return '[provider]\ncluster = "devnet"\n\n[programs.devnet]\n';
    }
    // For other files, return empty string
    console.warn('[FS Polyfill] readFileSync called but not supported in React Native:', path);
    return '';
  },
  writeFileSync: (path: string, data: string, encoding?: string): void => {
    // No-op - we don't need to write files in React Native
    console.warn('[FS Polyfill] writeFileSync called but not supported in React Native:', path);
  },
  readdirSync: (path: string): string[] => {
    // Return empty array - we don't need directory listing in React Native
    console.warn('[FS Polyfill] readdirSync called but not supported in React Native:', path);
    return [];
  },
  statSync: (path: string): { isFile: () => boolean; isDirectory: () => boolean } => {
    // Return a mock stat object
    return {
      isFile: () => false,
      isDirectory: () => false,
    };
  },
  mkdirSync: (path: string, options?: any): void => {
    // No-op - we don't need to create directories in React Native
    console.warn('[FS Polyfill] mkdirSync called but not supported in React Native:', path);
  },
  constants: {
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
  },
  promises: {
    readFile: async (path: string, encoding?: string): Promise<string> => {
      console.warn('[FS Polyfill] promises.readFile called but not supported in React Native:', path);
      return '';
    },
    writeFile: async (path: string, data: string, encoding?: string): Promise<void> => {
      console.warn('[FS Polyfill] promises.writeFile called but not supported in React Native:', path);
    },
    readdir: async (path: string): Promise<string[]> => {
      console.warn('[FS Polyfill] promises.readdir called but not supported in React Native:', path);
      return [];
    },
    stat: async (path: string): Promise<{ isFile: () => boolean; isDirectory: () => boolean }> => {
      return {
        isFile: () => false,
        isDirectory: () => false,
      };
    },
    mkdir: async (path: string, options?: any): Promise<void> => {
      console.warn('[FS Polyfill] promises.mkdir called but not supported in React Native:', path);
    },
  },
};

// Set fs on global for direct access (if needed)
if (typeof global !== 'undefined') {
  (global as any).fs = fsPolyfill;
}

// Also set on globalThis for compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).fs = fsPolyfill;
}

// Export for use as a module (CommonJS)
// This is critical for Anchor SDK which uses require('fs')
// Note: In React Native/Metro, we need to ensure CommonJS export works
if (typeof module !== 'undefined') {
  if (typeof module.exports !== 'undefined') {
    module.exports = fsPolyfill;
  }
  // Also set exports for ES module compatibility
  if (typeof module.exports === 'object' && module.exports !== null) {
    (module.exports as any).default = fsPolyfill;
    (module.exports as any).fs = fsPolyfill;
  }
}

// Export for use as ES module
export default fsPolyfill;

// Also export as named export for ES modules
export const fs = fsPolyfill;
