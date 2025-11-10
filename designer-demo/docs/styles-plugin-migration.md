# Styles 插件迁移与国际化实施总结

## 背景与目标
- 将 TinyEngine 官方 `Styles` 插件迁移至 `designer-demo` 独立维护，确保设计器可脱离本地源码运行。
- 实现右侧样式面板在多语言（中/英）环境下的即时切换，后续可扩展到更多语言。
- 避免修改 `packages` 目录中的源码（未来会替换为在线依赖），所有定制逻辑仅放在 `designer-demo` 工程内。

## 迁移步骤概览
1. **组件复制**  
   - 从 `packages/settings/styles/src` 复制原始组件到 `designer-demo/src/settings/styles`。  
   - 通过 `designer-demo/registry.ts` 覆盖官方注册项（`[META_APP.Styles]`）。

2. **国际化改造**  
   - 统一使用 `useDesignerI18n()` 提供的 `t` 与 `locale`，所有文案迁移至 `designer-demo/src/i18n/*.json`。  
   - 使用 `computed` 与 `watch`（或 `:key`）确保语言切换后组件即时重新渲染。
   - 对无法动态刷新占位符/控件的情况创建包装组件（见下文）。

3. **依赖管理**  
   - 若原插件使用 `@opentiny/tiny-engine` 或 `@opentiny/tiny-engine-configurator` 中的组件，迁移时维持相同 API，但在 `designer-demo` 内扩展包装逻辑而非修改 `packages`。

## 关键实现要点

### 1. Layout Tabs 文案刷新
- `LayoutGroup` 中的 Tabs 使用 `tabs-group-configurator`。语言切换后原组件不会自动刷新。
- 做法：将选项描述改为 `computed`（依赖 `locale.value`），并使用 `:key="locale"` 强制重新挂载 Tabs 组件。
- 特殊需求：用户希望布局选项始终显示英文，因此将选项文本固定为英文，避免再次随语言变化。

### 2. Color 输入框占位符
- 原 `ColorConfigurator` 的 placeholder 写死在 `packages` 源码内，且不会随 props 更新。
- **解决方案**：在 `designer-demo/src/components/i18n-wrappers` 下新增 `ColorConfigurator` 包装：
  - 接受 `placeholder` props；
  - 监听占位符变化，通过 `nextTick` 手动设置内部原生 input 的 `placeholder`；
  - 三个使用颜色输入的模块 (`TypographyGroup`、`BackgroundGroup`、`BorderGroup`) 都改为引用包装组件并传入 `t('designer.settings.styles.common.colorPlaceholder')`。
- 这样既保持官方依赖原样，也保证国际化占位符生效。

### 3. Grid / Flex / Size 等子模块
- `TypographyGroup`、`BackgroundGroup`、`BorderGroup`、`EffectGroup`、`SizeGroup` 全面移除了硬编码文案，改用 `t` 和 `computed` 生成选项。
- 需要动态生成的选项（如 Select / Tabs / Tooltip）统一先定义 `defs`，再在 `computed` 中根据 `t()` 组装。

### 4. ClassNames 面板
- 通过 `LinkButton` 包装（已存在于 `i18n-wrappers`）使“查看详情”链接可国际化。
- 所有提示语、错误消息、下拉文案集中在 `designer.settings.styles.globalStyle.*` 下，切换语言后即时更新。

### 5. 国际化文案组织
- 目录：`designer-demo/src/i18n/{zh-CN,en-US}.json`。
- 新增命名空间：`designer.settings.styles.*`，按模块分组（`layout`、`flex`、`grid`、`typography`、`background`、`border`、`common` 等）。
- 在新增子模块时记得同步维护所有语言文件，否则 `t()` 会回退为 key。

## 常见问题与应对
| 问题 | 处理方式 |
| --- | --- |
| 语言切换后 Tabs/Dropdown 文案未刷新 | 使用 `computed` + `locale` 依赖，必要时给组件加 `:key="locale"` 强制重建。 |
| 第三方组件 placeholder 固定为中文 | 新建包装组件，在 `designer-demo` 内处理，不改动 `packages`。 |
| 需要固定英文展示的文案 | 直接在 `computed` 里返回硬编码英文（如布局选项），并在文档中记录原因。 |
| 代码中仍有中文占位或注释 | 搜索 `[\u4e00-\u9fa5]`，逐步替换为 `t()` 或移至 i18n 文件。 |

## 后续迁移建议
1. **先定位依赖**：确定是否存在复杂依赖（Monaco、TinyCore 等），迁移时优先保持 API 不变。
2. **批量国际化**：新增模块时，将所有文案归入 `designer.settings.styles.<模块>`，同时更新多语言文件。
3. **复用包装组件**：遇到官方组件国际化能力不足时，优先在 `i18n-wrappers` 创建包装，保持未来可替换在线依赖。
4. **测试流程**：  
   - 切换语言观察 Tabs、Dropdown、输入框占位是否即时更新；  
   - 检查控制台是否有 `t()` 未命中提示；  
   - 回归功能性（如样式更新、历史记录）确保未引入回归。

## 目录参考
```
designer-demo/
├── docs/
│   └── styles-plugin-migration.md        # 本文档
├── src/
│   ├── components/i18n-wrappers/
│   │   ├── ColorConfigurator/            # 新增包装组件
│   │   └── ...                           # 其他包装
│   └── settings/styles/                  # 迁移后的插件源码
└── src/i18n/                             # 国际化文案
```

## 总结
- `Styles` 插件迁移成功实现了本地可维护的国际化版本。
- 通过包装组件和 `computed` 策略，可在不修改 `packages` 依赖的前提下灵活扩展功能。
- 文案统一存放于 i18n 文件，后续接入新语言或迁移其它插件时，可复用同样的模式。

