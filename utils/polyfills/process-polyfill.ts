/**
 * Process polyfill for React Native
 * Anchor SDK requires process.env which is not available in React Native
 * 
 * This file is used as a Metro resolver polyfill and also imported in src/polyfills.ts
 * 
 * CRITICAL: This must be executed immediately, before any module tries to require('process')
 */

// Polyfill process module for React Native compatibility
const processPolyfill = {
  env: {
    NODE_ENV: (typeof __DEV__ !== 'undefined' && __DEV__ !== false) ? 'development' : 'production',
    ANCHOR_PROVIDER_URL: '',
  },
  version: '',
  versions: {},
  platform: 'react-native',
  nextTick: (fn: Function) => {
    if (typeof setTimeout !== 'undefined') {
      setTimeout(fn, 0);
    } else {
      Promise.resolve().then(() => fn());
    }
  },
  cwd: () => '/',
  exit: (code?: number) => {
    console.warn('[Process Polyfill] process.exit() called with code:', code);
  },
};

// Set process on global immediately (before any require calls)
if (typeof global !== 'undefined') {
  if (typeof global.process === 'undefined') {
    (global as any).process = processPolyfill;
  } else {
    // Merge with existing process if it exists
    Object.assign(global.process, processPolyfill);
    if (!global.process.env) {
      (global as any).process.env = processPolyfill.env;
    }
  }
}

// Also set on globalThis for compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).process = typeof global !== 'undefined' ? global.process : processPolyfill;
}

// Set on window for web compatibility
if (typeof window !== 'undefined') {
  (window as any).process = typeof global !== 'undefined' ? global.process : processPolyfill;
}

// Get the process object (already set on global)
const processObj = typeof global !== 'undefined' ? global.process : processPolyfill;

// Export process for use as a module (CommonJS)
// This is critical for Anchor SDK which uses require('process')
// Note: In React Native/Metro, we need to ensure CommonJS export works
if (typeof module !== 'undefined') {
  if (typeof module.exports !== 'undefined') {
    module.exports = processObj;
  }
  // Also set exports for ES module compatibility
  if (typeof module.exports === 'object' && module.exports !== null) {
    (module.exports as any).default = processObj;
    (module.exports as any).process = processObj;
  }
}

// Export for use as ES module
export default processObj;

// Also export as named export for ES modules
export const process = processObj;
