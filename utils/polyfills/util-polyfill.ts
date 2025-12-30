/**
 * Util polyfill for React Native
 * Anchor SDK requires util module which is not available in React Native
 * 
 * This file provides a minimal util mock that satisfies Anchor SDK's requirements
 */

// Minimal util polyfill for React Native
// Anchor SDK uses util for various utility functions
// Note: TextEncoder and TextDecoder should be available globally from polyfills.ts
const globalTextEncoder = typeof TextEncoder !== 'undefined' ? TextEncoder : (typeof global !== 'undefined' && (global as any).TextEncoder);
const globalTextDecoder = typeof TextDecoder !== 'undefined' ? TextDecoder : (typeof global !== 'undefined' && (global as any).TextDecoder);

const utilPolyfill = {
  // Text encoding/decoding utilities
  // Anchor SDK's utf8.js uses util.TextEncoder and util.TextDecoder
  TextEncoder: globalTextEncoder,
  TextDecoder: globalTextDecoder,
  
  // Inspect function (for debugging)
  inspect: (obj: any, options?: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(obj);
    }
  },
  
  // Format function (like printf)
  format: (format: string, ...args: any[]): string => {
    let result = format;
    args.forEach((arg, index) => {
      const placeholder = `%${index === 0 ? '' : index}${typeof arg === 'number' ? 'd' : 's'}`;
      result = result.replace(placeholder, String(arg));
    });
    return result;
  },
  
  // Deprecate function
  deprecate: (fn: Function, message: string): Function => {
    let warned = false;
    return function (this: any, ...args: any[]) {
      if (!warned) {
        console.warn(`[Deprecated] ${message}`);
        warned = true;
      }
      return fn.apply(this, args);
    };
  },
  
  // Promisify function
  promisify: (fn: Function): Function => {
    return function (this: any, ...args: any[]) {
      return new Promise((resolve, reject) => {
        fn.apply(this, [
          ...args,
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        ]);
      });
    };
  },
  
  // Types checking
  types: {
    isString: (value: any): boolean => typeof value === 'string',
    isNumber: (value: any): boolean => typeof value === 'number',
    isBoolean: (value: any): boolean => typeof value === 'boolean',
    isObject: (value: any): boolean => typeof value === 'object' && value !== null,
    isArray: (value: any): boolean => Array.isArray(value),
    isFunction: (value: any): boolean => typeof value === 'function',
    isUndefined: (value: any): boolean => typeof value === 'undefined',
    isNull: (value: any): boolean => value === null,
  },
  
  // Inherits function (for class inheritance)
  inherits: (constructor: Function, superConstructor: Function): void => {
    // In React Native, we can't modify prototype chain easily
    // This is a no-op, but satisfies the API
    console.warn('[Util Polyfill] inherits() called but not fully supported in React Native');
  },
};

// Set util on global for direct access (if needed)
if (typeof global !== 'undefined') {
  (global as any).util = utilPolyfill;
}

// Also set on globalThis for compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).util = utilPolyfill;
}

// Export for use as a module (CommonJS)
// This is critical for Anchor SDK which uses require('util')
// Note: In React Native/Metro, we need to ensure CommonJS export works
if (typeof module !== 'undefined') {
  if (typeof module.exports !== 'undefined') {
    module.exports = utilPolyfill;
  }
  // Also set exports for ES module compatibility
  if (typeof module.exports === 'object' && module.exports !== null) {
    (module.exports as any).default = utilPolyfill;
    (module.exports as any).util = utilPolyfill;
  }
}

// Export for use as ES module
export default utilPolyfill;

// Also export as named export for ES modules
export const util = utilPolyfill;
