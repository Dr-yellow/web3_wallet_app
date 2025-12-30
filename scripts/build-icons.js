// scripts/build-icons.mjs
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ASSETS_DIR = resolve('./assets/icons');
const OUTPUT_DIR = resolve('./components/icons');

// 确保输出目录存在
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 清空输出目录（保留 index.tsx 先不删）
if (existsSync(OUTPUT_DIR)) {
  const files = readdirSync(OUTPUT_DIR).filter(file => file !== 'index.tsx');
  for (const file of files) {
    unlinkSync(resolve(OUTPUT_DIR, file));
  }
}

// 获取所有 .svg 文件
const svgFiles = existsSync(ASSETS_DIR)
  ? readdirSync(ASSETS_DIR).filter(file => file.endsWith('.svg'))
  : [];

if (svgFiles.length === 0) {
  console.warn('⚠️ 未找到任何 SVG 文件 in', ASSETS_DIR);
  process.exit(0);
}

console.log(`🔍 找到 ${svgFiles.length} 个 SVG 文件，开始转换...`);

// 调用 @svgr/cli 批量转换
try {
  execSync(
    `npx @svgr/cli --native --typescript --no-index --out-dir ${OUTPUT_DIR} ${ASSETS_DIR}`,
    { stdio: 'inherit' }
  );
} catch (e) {
  console.error('❌ SVG 转换失败:', e.message);
  process.exit(1);
}

// 生成 PascalCase 名称
function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// 生成 index.tsx
const exports = svgFiles.map(file => {
  const componentName = toPascalCase(file.replace(/\.svg$/, ''));
  return `export { default as ${componentName}Icon } from './${componentName}';`;
});

const indexContent = `${exports.join('\n')}\n`;
writeFileSync(resolve(OUTPUT_DIR, 'index.tsx'), indexContent);

console.log('✅ 图标构建成功！');
console.log(`📦 输出目录: ${OUTPUT_DIR}`);
console.log('📥 使用方式:');
console.log("   import { HomeIcon, UserIcon } from '@/src/components/icons';");
