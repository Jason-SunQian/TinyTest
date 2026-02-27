#!/usr/bin/env node
/**
 * 校验 mock/business-materials.json 是否符合 TinyEngine 物料协议必填字段
 * 用法：在 designer-demo 目录下执行 node scripts/validate-business-materials.js 或 pnpm run validate:materials-json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'mock/business-materials.json');

const REQUIRED_COMPONENT_FIELDS = [
  'component',
  'name',
  'icon',
  'group',
  'npm',
  'schema',
  'configure'
];
const REQUIRED_NAME_KEYS = ['zh_CN', 'en_US'];
const REQUIRED_NPM_KEYS = ['package', 'script', 'exportName'];
const REQUIRED_SCHEMA_KEYS = ['properties', 'events', 'slots'];
const REQUIRED_CONFIGURE_KEYS = ['loop', 'condition', 'contextMenu', 'framework'];
const REQUIRED_SNIPPET_CHILD_KEYS = ['snippetName', 'name', 'icon'];

function check(obj, path, required, name) {
  const missing = required.filter((k) => obj[k] === undefined || obj[k] === null);
  if (missing.length) return [{ path, name, missing }];
  return [];
}

function run() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error('未找到 mock/business-materials.json，请先运行 pnpm run generate:materials-json');
    process.exit(1);
  }
  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('business-materials.json 解析失败:', e.message);
    process.exit(1);
  }

  const materials = data?.data?.materials;
  if (!materials) {
    console.error('缺少 data.materials');
    process.exit(1);
  }

  const errors = [];
  const components = materials.components || [];
  components.forEach((comp, i) => {
    const base = `components[${i}](${comp.component || '?'})`;
    errors.push(...check(comp, base, REQUIRED_COMPONENT_FIELDS, 'Component'));
    if (comp.name && typeof comp.name === 'object') {
      const missingName = REQUIRED_NAME_KEYS.filter((k) => !comp.name[k]);
      if (missingName.length) errors.push({ path: `${base}.name`, name: 'name 双语', missing: missingName });
    } else if (comp.name === undefined) {
      errors.push({ path: `${base}.name`, name: 'name', missing: ['name 应为对象且含 zh_CN、en_US'] });
    }
    if (comp.npm) {
      errors.push(...check(comp.npm, `${base}.npm`, REQUIRED_NPM_KEYS, 'npm'));
    }
    if (comp.schema) {
      errors.push(...check(comp.schema, `${base}.schema`, REQUIRED_SCHEMA_KEYS, 'schema'));
    }
    if (comp.configure) {
      errors.push(...check(comp.configure, `${base}.configure`, REQUIRED_CONFIGURE_KEYS, 'configure'));
    }
  });

  const snippets = materials.snippets || [];
  snippets.forEach((snip, i) => {
    if (!snip.group || !Array.isArray(snip.children)) {
      errors.push({ path: `snippets[${i}]`, name: 'snippet', missing: ['group 或 children'] });
      return;
    }
    (snip.children || []).forEach((child, j) => {
      const base = `snippets[${i}].children[${j}]`;
      errors.push(...check(child, base, REQUIRED_SNIPPET_CHILD_KEYS, 'SnippetChild'));
      if (child.name && typeof child.name === 'object') {
        const missingName = REQUIRED_NAME_KEYS.filter((k) => !child.name[k]);
        if (missingName.length) errors.push({ path: `${base}.name`, name: 'name 双语', missing: missingName });
      }
    });
  });

  if (errors.length > 0) {
    console.error('校验未通过，以下字段缺失或不符合协议：\n');
    errors.forEach((e) => console.error(`  ${e.path}: ${e.name} 缺少 ${e.missing.join(', ')}`));
    process.exit(1);
  }
  console.log(`校验通过：${components.length} 个组件，${snippets.length} 个分组`);
}

run();
