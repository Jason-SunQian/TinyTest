/**
 * 扫描 materials-src 目录，自动生成 build.lib.entry 对象
 * - 顶层 .js 文件（如 mr-components.js）→ entry 名为文件名去掉 .js
 * - 顶层子目录且存在 index.js（如 mp-card/index.js）→ entry 名为目录名
 * 这样新增组件只需在 materials-src 下加目录或文件，无需改 vite.materials.config.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MATERIALS_SRC = path.resolve(__dirname, '../materials-src');

export function getMaterialEntries() {
  const entries = {};
  if (!fs.existsSync(MATERIALS_SRC) || !fs.statSync(MATERIALS_SRC).isDirectory()) {
    return entries;
  }
  const names = fs.readdirSync(MATERIALS_SRC);
  for (const name of names) {
    const fullPath = path.join(MATERIALS_SRC, name);
    const stat = fs.statSync(fullPath);
    if (stat.isFile() && name.endsWith('.js')) {
      const entryName = name.slice(0, -3);
      entries[entryName] = fullPath;
    } else if (stat.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.js');
      if (fs.existsSync(indexPath)) {
        entries[name] = indexPath;
      }
    }
  }
  return entries;
}
