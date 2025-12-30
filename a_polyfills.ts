// ============================================
// CRITICAL: structuredClone polyfill MUST be first
// This must be set before any modules that might use it (like @coral-xyz/anchor)
// ============================================
if (typeof global.structuredClone !== 'function') {
  const structuredClonePolyfill = function structuredClone(obj: any, options?: any): any {
    try {
      // 使用 JSON 序列化/反序列化作为基础实现
      // 注意：这不支持所有类型（如函数、Symbol、循环引用等），但对于大多数用例足够
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      // 如果 JSON 序列化失败，尝试返回原始对象（浅拷贝）
      if (error instanceof TypeError && error.message.includes('circular')) {
        // 处理循环引用：返回原始对象
        return obj;
      }
      // 对于其他错误，也返回原始对象
      return obj;
    }
  };
  
  // 设置到 global（React Native 环境）
  (global as any).structuredClone = structuredClonePolyfill;
  
  // 确保在 globalThis 上也设置（某些环境可能使用 globalThis）
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).structuredClone = structuredClonePolyfill;
  }
  
  // 如果在 window 对象上（Web 环境）
  if (typeof window !== 'undefined') {
    (window as any).structuredClone = structuredClonePolyfill;
  }
}

// Polyfills for React Native
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
// @ts-ignore - text-encoding 没有类型定义
import { TextEncoder, TextDecoder } from 'text-encoding';

// Set TextEncoder/TextDecoder to global FIRST (before util polyfill needs them)
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

// @ts-ignore
global.Buffer = Buffer;

// Process polyfill (must be imported before Anchor SDK)
// This is critical for @coral-xyz/anchor which requires process.env
import './utils/polyfills/process-polyfill';

// FS polyfill (must be imported before Anchor SDK)
// This is critical for @coral-xyz/anchor which requires fs module
import './utils/polyfills/fs-polyfill';

// Util polyfill (must be imported after TextEncoder/TextDecoder are set)
// This is critical for @coral-xyz/anchor which requires util module
import './utils/polyfills/util-polyfill';

// Stream polyfill (must be imported before cipher-base/bip39)
// This is critical for cipher-base which requires stream module
// Note: Metro config redirects 'stream' to 'readable-stream' automatically
// We keep the custom polyfill as a fallback, but Metro resolver should handle it

