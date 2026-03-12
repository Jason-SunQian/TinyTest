#!/usr/bin/env node
/**
 * 校验物料包 bundle 结构是否符合设计器加载要求（data.materials.components 及 component 字段）
 * 用法：pnpm run validate:bundle-structure -- <bundle 路径或 URL>
 * 示例：pnpm run validate:bundle-structure -- ./dist/bundle.json
 *       pnpm run validate:bundle-structure -- http://localhost:3000/bundle.json
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const input = process.argv[2];
if (!input) {
    console.error('用法: pnpm run validate:bundle-structure -- <bundle 路径或 URL>');
    process.exit(1);
}

function loadBundle(source) {
    if (source.startsWith('http://') || source.startsWith('https://')) {
        return new Promise((resolve, reject) => {
            const lib = source.startsWith('https') ? https : http;
            lib.get(source, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('响应不是合法 JSON: ' + e.message));
                    }
                });
            }).on('error', reject);
        });
    }
    const filePath = path.isAbsolute(source) ? source : path.resolve(process.cwd(), source);
    if (!fs.existsSync(filePath)) {
        return Promise.reject(new Error('文件不存在: ' + filePath));
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return Promise.resolve(JSON.parse(raw));
}

function run() {
    loadBundle(input)
        .then((data) => {
            const materials = data?.data?.materials ?? data?.materials;
            if (!materials) {
                console.error('校验失败: 缺少 data.materials 或 materials');
                process.exit(1);
            }
            const components = materials.components || [];
            if (!Array.isArray(components)) {
                console.error('校验失败: materials.components 应为数组');
                process.exit(1);
            }
            const missing = [];
            components.forEach((comp, i) => {
                if (comp.component === undefined || comp.component === null || comp.component === '') {
                    missing.push(`components[${i}] 缺少 component 字段`);
                }
            });
            if (missing.length) {
                missing.forEach((m) => console.error('  ', m));
                process.exit(1);
            }
            console.log(`校验通过: ${components.length} 个组件，${(materials.snippets || []).length} 个 snippet 分组`);
        })
        .catch((err) => {
            console.error('校验失败:', err.message);
            process.exit(1);
        });
}

run();
