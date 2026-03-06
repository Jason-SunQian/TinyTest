#!/usr/bin/env node
/**
 * 根据 mock/materials-manifest.json 生成符合 TinyEngine 协议的 mock/business-materials.json
 * 用法：在 designer-demo 目录下执行 node scripts/generate-business-materials.js 或 pnpm run generate:materials-json
 * 清单中只需维护少量字段（component、group、nameZh、nameEn、icon、script、exportName 等），
 * 脚本自动补全 protocol 要求的 configure、schema 等完整结构。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'mock/materials-manifest.json');
const OUT_PATH = path.join(ROOT, 'mock/business-materials.json');

const DEFAULT_NESTING_RULE = {
  childWhitelist: '',
  parentWhitelist: '',
  descendantBlacklist: '',
  ancestorWhitelist: ''
};

const DEFAULT_CONTEXT_MENU = {
  actions: ['copy', 'remove', 'insert', 'updateAttr', 'bindEvent', 'createBlock'],
  disable: []
};

function defaultConfigure(item) {
  return {
    loop: true,
    condition: true,
    styles: true,
    isContainer: !!item.isContainer,
    isModal: false,
    nestingRule: { ...DEFAULT_NESTING_RULE },
    isNullNode: false,
    isLayout: false,
    rootSelector: '',
    ...(item.shortcuts && { shortcuts: item.shortcuts }),
    contextMenu: { ...DEFAULT_CONTEXT_MENU },
    clickCapture: true,
    framework: 'Vue'
  };
}

/**
 * 为 schema 的 content 项补全协议要求的 widget 等字段，否则属性面板无法渲染
 * 参考：https://www.opentiny.design/tiny-engine#/protocol 属性配置面板的渲染配置
 */
function ensurePropertyWidgets(properties) {
  if (!Array.isArray(properties)) return properties;
  return properties.map((group) => {
    if (!group.content || !Array.isArray(group.content)) return group;
    const content = group.content.map((prop) => {
      const type = prop.type || 'string';
      const widget =
        prop.widget && prop.widget.component
          ? prop.widget
          : {
              component: type === 'boolean' ? 'SwitchConfigurator' : 'InputConfigurator',
              props: prop.widget?.props || {}
            };
      return {
        required: false,
        readOnly: false,
        disabled: false,
        cols: 12,
        labelPosition: 'top',
        ...prop,
        widget
      };
    });
    return { ...group, content };
  });
}

function defaultSchema(item) {
  const base = {
    properties: [
      {
        name: '0',
        label: { zh_CN: '基础', en_US: 'Basic' },
        content: []
      }
    ],
    events: {},
    slots: {}
  };
  if (item.schemaExtra) {
    if (item.schemaExtra.properties) {
      base.properties = ensurePropertyWidgets(item.schemaExtra.properties);
    }
    if (item.schemaExtra.events) base.events = item.schemaExtra.events;
    if (item.schemaExtra.slots) base.slots = item.schemaExtra.slots;
  }
  return base;
}

function manifestToComponent(item) {
  const scriptPath = `/mock/materials/${item.script}`;
  const npm = {
    package: item.package,
    script: scriptPath,
    exportName: item.exportName,
    destructuring: true
  };
  if (item.hasCss) npm.css = '/mock/materials/style.css';

  return {
    version: '1.0.0',
    icon: item.icon,
    name: { zh_CN: item.nameZh, en_US: item.nameEn },
    component: item.component,
    description: item.description || '',
    docUrl: '',
    screenshot: '',
    tags: '',
    keywords: '',
    devMode: 'proCode',
    group: item.group,
    npm,
    schema: defaultSchema(item),
    configure: defaultConfigure(item)
  };
}

function manifestToSnippetChild(item) {
  return {
    snippetName: item.component,
    name: { zh_CN: item.nameZh, en_US: item.nameEn },
    icon: item.icon,
    schema: {},
    ...(item.hiddenInPanel && { hidden: true })
  };
}

function run() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('未找到 mock/materials-manifest.json');
    process.exit(1);
  }
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (e) {
    console.error('materials-manifest.json 解析失败:', e.message);
    process.exit(1);
  }
  const components = (manifest.components || []).map(manifestToComponent);
  const byGroup = {};
  (manifest.components || []).forEach((item) => {
    if (!byGroup[item.group]) byGroup[item.group] = [];
    byGroup[item.group].push(manifestToSnippetChild(item));
  });
  const snippets = Object.entries(byGroup).map(([group, children]) => ({
    group,
    children
  }));

  const output = {
    data: {
      materials: {
        components,
        snippets
      }
    }
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`已生成 ${OUT_PATH}，共 ${components.length} 个组件`);
}

run();
