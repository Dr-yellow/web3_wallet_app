/**
 * Stream polyfill for React Native
 * cipher-base and other crypto libraries require stream module which is not available in React Native
 * 
 * This file is used as a Metro resolver polyfill and also imported in src/polyfills.ts
 * 
 * CRITICAL: This must be executed before any module tries to require('stream')
 */

// Simple stream polyfill for React Native
// This provides a minimal implementation that satisfies cipher-base and other libraries

class Readable {
  constructor(options?: any) {
    // Minimal implementation
  }
  
  read(size?: number): any {
    return null;
  }
  
  on(event: string, listener: Function): this {
    return this;
  }
  
  once(event: string, listener: Function): this {
    return this;
  }
  
  emit(event: string, ...args: any[]): boolean {
    return false;
  }
  
  pipe(destination: any, options?: any): any {
    return destination;
  }
  
  unpipe(destination?: any): this {
    return this;
  }
  
  destroy(error?: Error): this {
    return this;
  }
}

class Writable {
  constructor(options?: any) {
    // Minimal implementation
  }
  
  write(chunk: any, encoding?: string, callback?: Function): boolean {
    if (callback) {
      callback();
    }
    return true;
  }
  
  end(chunk?: any, encoding?: string, callback?: Function): this {
    if (callback) {
      callback();
    }
    return this;
  }
  
  on(event: string, listener: Function): this {
    return this;
  }
  
  once(event: string, listener: Function): this {
    return this;
  }
  
  emit(event: string, ...args: any[]): boolean {
    return false;
  }
  
  destroy(error?: Error): this {
    return this;
  }
}

class Transform extends Readable {
  constructor(options?: any) {
    super(options);
  }
  
  _transform(chunk: any, encoding: string, callback: Function): void {
    callback(null, chunk);
  }
}

class Duplex extends Readable {
  constructor(options?: any) {
    super(options);
  }
  
  write(chunk: any, encoding?: string, callback?: Function): boolean {
    if (callback) {
      callback();
    }
    return true;
  }
  
  end(chunk?: any, encoding?: string, callback?: Function): this {
    if (callback) {
      callback();
    }
    return this;
  }
}

// Create stream module object
const streamPolyfill = {
  Readable,
  Writable,
  Transform,
  Duplex,
  Stream: Readable,
  PassThrough: Transform,
  pipeline: (streams: any[], callback?: Function) => {
    // Simple pipeline implementation
    if (callback) {
      callback(null);
    }
  },
  finished: (stream: any, callback: Function) => {
    // Simple finished implementation
    callback(null);
  },
};

// Set stream on global for direct access
if (typeof global !== 'undefined') {
  (global as any).stream = streamPolyfill;
}

// Also set on globalThis for compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).stream = streamPolyfill;
}

// Export for use as a module (CommonJS)
// This is critical for cipher-base which uses require('stream')
if (typeof module !== 'undefined') {
  if (typeof module.exports !== 'undefined') {
    module.exports = streamPolyfill;
  }
  // Also set exports for ES module compatibility
  if (typeof module.exports === 'object' && module.exports !== null) {
    (module.exports as any).default = streamPolyfill;
    (module.exports as any).stream = streamPolyfill;
    (module.exports as any).Readable = Readable;
    (module.exports as any).Writable = Writable;
    (module.exports as any).Transform = Transform;
    (module.exports as any).Duplex = Duplex;
  }
}

// Export for use as ES module
export default streamPolyfill;

// Also export as named exports for ES modules
export const stream = streamPolyfill;
export { Readable, Writable, Transform, Duplex };
