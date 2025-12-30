// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add polyfill resolvers
config.resolver.extraNodeModules.crypto = require.resolve("expo-crypto");

// 配置 Metro 以支持 sourceExts，确保能解析 .js 文件
config.resolver.sourceExts = [
  ...(config.resolver.sourceExts || []),
  "js",
  "jsx",
  "ts",
  "tsx",
  "json",
];

// 配置 Metro 以正确处理 node_modules
config.resolver.unstable_enablePackageExports = true;

// 允许动态 require
config.resolver.unstable_conditionNames = [
  "react-native",
  "require",
  "default",
];

// 在 React Native 中重定向 @walletconnect/ethereum-provider 到 mock 模块
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (
  context,
  moduleName,
  platform,
  modulePath
) => {
  // Process polyfill - critical for @coral-xyz/anchor
  if (moduleName === "process") {
    const processPolyfillPath = path.resolve(
      __dirname,
      "utils/polyfills/process-polyfill.ts"
    );
    return {
      type: "sourceFile",
      filePath: processPolyfillPath,
    };
  }

  // FS polyfill - critical for @coral-xyz/anchor (nodewallet.js)
  if (moduleName === "fs") {
    const fsPolyfillPath = path.resolve(
      __dirname,
      "utils/polyfills/fs-polyfill.ts"
    );
    return {
      type: "sourceFile",
      filePath: fsPolyfillPath,
    };
  }

  // Util polyfill - critical for @coral-xyz/anchor (utf8.js)
  if (moduleName === "util") {
    const utilPolyfillPath = path.resolve(
      __dirname,
      "utils/polyfills/util-polyfill.ts"
    );
    return {
      type: "sourceFile",
      filePath: utilPolyfillPath,
    };
  }

  // Stream polyfill - critical for cipher-base and bip39
  // Use readable-stream which is already installed as a dependency
  if (moduleName === "stream") {
    try {
      // Try to resolve readable-stream from node_modules
      // readable-stream provides a full Node.js stream implementation
      const readableStreamPath = require.resolve("readable-stream", {
        paths: [__dirname],
      });
      return {
        type: "sourceFile",
        filePath: readableStreamPath,
      };
    } catch (e) {
      // Fallback to custom polyfill if readable-stream is not found
      console.warn(
        "[Metro Config] readable-stream not found, using custom stream polyfill"
      );
      const streamPolyfillPath = path.resolve(
        __dirname,
        "utils/polyfills/stream-polyfill.ts"
      );
      return {
        type: "sourceFile",
        filePath: streamPolyfillPath,
      };
    }
  }

  // 在 web 平台上，将原生模块和 React Native 专用模块重定向到空模块
  // 避免 Metro bundler 尝试解析这些模块

  // 使用默认解析
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform, modulePath);
  }

  // 回退到默认解析
  return context.resolveRequest(context, moduleName, platform, modulePath);
};

module.exports = config;
