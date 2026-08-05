# 主工程低代码集成指南（OAB）

> **适用范围**：以 **OAB** 为主工程，将 TinyEngine 低代码能力接入 Vue3 + Vite 手机银行工程。  
> **读者**：新加入的主工程 / 设计器开发、以及需要改低代码链路的 **AI Agent**。  
> **本文定位**：入口导航 + 集成清单 + **改哪里 / 怎么改** 的精简要求。细节案例不重复展开，一律链到专项文档。

---

## 0. 先读这一节（给人或 Agent）

### 0.1 你要达成什么

| 目标 | 成功标准 |
|------|----------|
| 设计器可拖物料 | 面板出现 `MR` / `MP` 分组，画布可拖、可选中 |
| 出码可落地 | 写入 `OAB/src/lowcode/modules/**`，路由自动注册 |
| 主工程可预览 | `#/lowcode/lowcode-<path>` 非白屏，无 i18n inject 报错 |
| 画布 ≈ 运行态 | 横向/标签/箭头等与真机一致；属性改动能在画布看见反馈 |

### 0.2 改动前先问三句

1. **现象出在哪一层？** 物料构建 / 设计器画布 / 拖拽 state 绑定 / 出码 / 主工程预览？  
2. **权威行为以谁为准？** 永远以 **OAB 运行态组件源码**（`src/components/**`、`src/layout/**`）为准，画布桩只做「可见近似」，禁止为设计态去改运行态业务语义。  
3. **该改哪座仓库？** 见 [§2 仓库地图](#2-仓库地图与职责) 与 [§5 问题 → 改哪里](#5-问题--改哪里决策表)。

### 0.3 文档怎么用

| 你想… | 打开 |
|-------|------|
| 接新主工程 / 查路由 i18n 白屏 | **本文** §3～§4、§8 |
| 导入某个 `mp-*` / `mr-*` | [物料导入进度跟踪-OAB](./物料导入进度跟踪-OAB.md) + [组件导入注意事项](./组件导入注意事项.md) |
| 画布样式/选中框/金额对齐踩坑 | [组件导入注意事项](./组件导入注意事项.md)（强规则 + 各组件经验） |
| AM 导入 / 物料 URL / Network | [物料导入快速参考](./物料导入快速参考.md)、[插件与设计器物料导入对接与排障](./插件与设计器物料导入对接与排障.md) |
| 设计器能否改 TinyEngine 官方 packages | [设计器与 packages 边界约定](./设计器与packages边界约定.md)（**不能**改官方只读 packages；业务改造落在 **designer 工程** `src/`） |
| Class Name / Uno `!` 前缀 | [公共样式与 UnoCSS 导入设计器方案](./公共样式与UnoCSS导入设计器方案.md) |
| **待解决问题**（入口替换 / 返回） | **本文 [§11](#11-待解决问题)** |

---

## 1. 背景（为何不能只复制目录）

从参考工程复制 `lowcode-materials/`、`src/lowcode/` 等之后，常见「设计器能编、主工程预览挂」——根因是 **运行时与构建链路未接通**，不是出码器坏了。

| 阶段 | 现象 | 根因 | 处理 |
|------|------|------|------|
| 1 | `#/lowcode/xxx` 白屏 / No match | 未注册低代码路由 | `src/router/lowcode.ts` + 合并进 `router/index.ts` |
| 2 | `inject(I18nInjectionKey)` undefined | 未 provide i18n | `main.ts`：`app.provide(I18nInjectionKey, i18n)` |
| 3 | `reading 'lowcode'` | `lowcode()` 未挂载 | `main.ts` 在 provide 前挂载 `i18n.lowcode`（**勿**在 `i18n/index.ts` 静态 import） |
| 4 | `i18n before initialization` | 循环依赖 | 仅 `main.ts`：先 `i18n` 再 `lowcode` |
| 5 | `build:designer-materials` 失败 | Uno 扫到出码页 `@opentiny/*` | UnoCSS `exclude: ['src/lowcode/**']`；勿装无用 OpenTiny |
| 6 | 缺 `~icons/...` | 物料 vite 无 Icons | 对齐 `build/icon.ts` |
| 7 | 仍打开旧工程物料 | Extension Host 工作区错 | Host 窗口 **打开文件夹 = OAB 根目录** |

OAB 上 donations 等页（如 `#/lowcode/lowcode-donations-list`）已可设计 → 出码 → 预览。

---

## 2. 仓库地图与职责

日常联调涉及 **三块工程**（路径以本机惯例为准，可按团队克隆位置调整）。

> **文档口径（重要）**：凡称「设计器 / designer 工程」，一律指 **`lowcode-kit/packages/designer`**。  
> 本地若暂用 `TinyTest/designer-demo` 改代码，**必须同步回 designer 工程**；文档、评审、排障路径都以 designer 工程为准，不要把 designer-demo 写成权威设计器。

```
┌──────────────────────────────────────────────────────────────────────────┐
│ OAB（主工程）                                                             │
│  · 运行态组件源码（权威）                                                  │
│  · lowcode-materials/（manifest、entries、*-designer、canvas-stubs）       │
│  · pnpm build:designer-materials → dist/lowcode-materials/                │
│  · 出码落地：src/lowcode/modules/** + router/lowcode.ts 自动注册           │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │ 物料 URL / AM ZIP
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ lowcode-kit/packages/designer（设计器工程，权威）                           │
│  · 画布、属性面板、拖拽落盘、schema 补丁                                   │
│  · component-defaults/strategies（v-model 演示策略）                       │
│  · 业务改造落在 packages/designer/src/**                                  │
│  · 仓库内 TinyEngine 官方 packages（若有）只读参考，见边界约定               │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │ postMessage / 配置
                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ lowcode-kit（VSCode 插件 + dsl 出码等）                                    │
│  · 插件：认「当前工作区 = 主工程根」；AM、静态服务、注入物料 URL             │
│  · packages/dsl-vue：出码后处理（如剥 mr-button 误写 children）             │
└──────────────────────────────────────────────────────────────────────────┘
```

| 工程 | 改什么 | 不改什么 |
|------|--------|----------|
| **OAB** | 运行态组件、物料入口/画布桩、manifest、构建脚本、`src/lowcode` 出码与 common | 不要为「画布好看」改坏业务运行态语义 |
| **designer 工程**（`lowcode-kit/packages/designer`） | 拖拽/补丁策略、面板行为、画布 iframe 壳样式、设计器插件扩展 | **不要**改 TinyEngine 官方只读 packages（见边界约定） |
| **lowcode-kit 其余包**（插件、`dsl-vue` 等） | 插件协议、出码后处理 | 不要把设计器业务逻辑散落到非 designer 包却不落盘到 designer 工程 |

**开发与同步约定**：设计器改动的**落盘目标**始终是 **designer 工程**。若临时在 `TinyTest/designer-demo` 联调，改完 `component-defaults/strategies/*`、`external-drop.ts`、`schema-patches.ts` 等后须同步到 `lowcode-kit/packages/designer`；策略生效后需 **Reload Extension Host**。

---

## 3. 架构数据流（一眼）

```
OAB: pnpm build:designer-materials
        → dist/lowcode-materials/{bundle.json, mp-*.js, mr-bank.css, runtime.js}
        →（可选）npx serve dist/lowcode-materials -p 3000 --cors
                 或 AM 导入 ZIP → src/lowcode/assets/packages/<id>/

插件注入 TINY_MATERIAL_BUNDLE_URLS → designer 工程拉物料

设计器保存/出码 → OAB/src/lowcode/modules/<业务>/{routes,views,*.json}
主工程 pnpm dev → #/lowcode/lowcode-<path>
```

---

## 4. OAB 主工程集成清单（接新机或回归）

### 4.1 从参考工程复制的目录

| 路径 | 说明 |
|------|------|
| `lowcode-materials/` | manifest、entries、design-components、canvas-stubs、脚本 |
| `lowcode-styles/` | Class Name / utilities 产物 |
| `lowcode-utils/` | 出码 utils 扫描与 completion |
| `vite.lowcode-materials.config.ts` / `vite.runtime.config.ts` | 物料与 runtime 构建 |
| `src/lowcode/` | 出码目录、common、i18n、utils |

**不要默认复制**：OpenTiny demo 出码页、`@opentiny/vue*`（OAB 业务用 `mp-*`/`mr-*`）。

复制后必须改路由与 `main.ts`（§4.2），不能只拷目录。

### 4.2 必须新增 / 修改

| 文件 | 要点 |
|------|------|
| `src/router/lowcode.ts` | glob 扫描 `src/lowcode/modules/**/routes` 与 views |
| `src/router/index.ts` | native / web 均合并 `...lowcodeRoutes` |
| `src/main.ts` | `import i18n` → `import lowcode` → 挂载 → `provide(I18nInjectionKey)`（在 `app.use(plugins)` 前） |
| `src/plugins/i18n.ts` | glob 合并 `@/lowcode/common/i18n` |
| `src/i18n/index.ts` | **禁止**静态 import `lowcode.js` |
| `types/lowcode.d.ts` | 类型声明 |
| `package.json` | `build:designer-materials` / `lowcode` / `lowcode:release` |
| `vite.lowcode-materials.config.ts` | Icons；UnoCSS **exclude `src/lowcode/**`**；canvas-stubs alias |
| ESLint / husky | 出码与生成 CSS 的 ignore；生成 CSS 用 `/* */` 勿用 `//` |

### 4.3 推荐 scripts

```json
{
  "lowcode": "pnpm run build:designer-materials && pnpm run build:lowcode-styles",
  "lowcode:release": "pnpm run build:designer-materials && pnpm run build:lowcode-styles && pnpm run versionize:lowcode-materials",
  "build:designer-materials": "node lowcode-materials/scripts/extract-design-tokens.cjs && node lowcode-materials/scripts/extract-canvas-assets.cjs && node lowcode-materials/scripts/extract-base-overrides.cjs && vite build --config vite.lowcode-materials.config.ts && vite build --config vite.runtime.config.ts && node lowcode-materials/scripts/generate-bundle.cjs && node lowcode-utils/scripts/build.mjs",
  "build:lowcode-styles": "node --experimental-strip-types lowcode-styles/scripts/build.mjs",
  "build:lowcode-utils": "node lowcode-utils/scripts/build.mjs"
}
```

联调前：**必跑** `pnpm run build:designer-materials`（成功标志：`dist/lowcode-materials/bundle.json` 组件数与 manifest 一致）。

### 4.4 联调顺序（最短路径）

1. OAB：`pnpm run build:designer-materials`  
2. （推荐本地）`npx serve dist/lowcode-materials -p 3000 --cors`，或 AM 导入 ZIP  
3. lowcode-kit：**F5** Extension Development Host → **打开文件夹 = OAB 根**  
4. 启动 **designer 工程**开发服务（`lowcode-kit/packages/designer`，端口如 8090）；插件 `developmentServerUrl` 指向它  
5. 拖拽 / 保存 / 出码 → OAB `pnpm dev` 打开 `#/lowcode/lowcode-...`  

策略或插件改动后：**Reload Extension Host**。

### 4.5 出码路径约定

```ts
// routes 示例
{ module: 'lowcode', routes: [{ name: 'donations-list', path: 'lowcode-donations-list', meta: { ktTitle: 'Donations' } }] }
```

- 路由 name：`lowcode.lowcode.donations-list`  
- URL：`/#/lowcode/lowcode-donations-list`  
- 业务页只用 **`mp-*` / `mr-*`**，避免残留 `tiny-*` demo。

---

## 5. 问题 → 改哪里（决策表）

| 现象 / 需求 | 优先改 | 参考 |
|-------------|--------|------|
| 预览白屏、无路由 | OAB `router/lowcode.ts`、`main.ts` i18n | 本文 §1、§8 |
| 物料列表没有新组件 / bundle 旧 | OAB `manifest` + entry + `build:designer-materials`；确认插件 URL | 快速参考、排障 |
| 拖入无 state / 无 v-model | **designer 工程** `strategies` + `external-drop` + `schema-patches` | 注意事项 **§1.7** |
| 画布丑、多缩进、箭头色不对、分割线位置错 | OAB `design-components/*-designer` 或 canvas-stub；**先读运行态 padding** | 注意事项 **画布横向/垂直强规则**、MpSingleAmt |
| 属性面板能改、画布不变 | 画布桩写死了；桩必须读 props | 注意事项「属性面板改动必须在画布可见」 |
| 出码 props 怪（如 `mr-button` 同时有 slot + `children`） | lowcode-kit `dsl-vue` 出码后处理；或 designer 侧 slotChildren 同步 | 注意事项 slot 文本；dsl-vue `sfc-post-processor` |
| Class Name / `!bg-200` 画布无效 | OAB `build:lowcode-styles` 产物；禁止设计器动态拼规则 | 公共样式方案 |
| Ionic 组件 Shadow / 0 尺寸 | Ionic 桩方案；必要时轻量包装 | Ionic 组件导入与桩方案 |
| 进度「导了哪个」 | 只更新进度文档状态 | [物料导入进度跟踪-OAB](./物料导入进度跟踪-OAB.md) |

**禁止的方向**（反复踩过）：

- 为设计态去改 OAB 运行态组件「顺便兼容画布」  
- 在 `container.ts` / `useMaterial.ts` 堆组件特例长分支（应进 `strategies`）  
- snippet / state **写死演示业务数据**（金额、账号、fileId、OTP 等）；演示只在画布点击切换，初始绑定空值/`{}`/`[]`  
- 只在临时目录（如 designer-demo）改策略，**不同步回 designer 工程**  
- 把主工程 `dist` bundle 随便 `cp` 覆盖 designer mock 基线  

---

## 6. 低代码开发要求（精简版）

完整条文见 [组件导入注意事项](./组件导入注意事项.md) **§一**。此处只列 **OAB 阶段必须内化** 的要求：

### 6.1 物料与画布

1. **MR**：优先第三方真实实现（Vant/Ionic）；仅 0 尺寸不可选中时做最小包装。  
2. **MP**：优先运行态源码；复杂/依赖 store·原生桥时用 `*-designer.vue` / canvas-stub。  
3. **横向 inset**：先看运行态是否 `--van-cell-horizontal-padding: 0`（如多数 `mp-input` 系）。清零则画布 **禁止**再加 16px 根级左右 padding。  
4. **分割线**：在 cell **底 padding 之后**，不要画在文字行底边造成「双线/贴字」。  
5. **箭头色**：`mp-input` 系用 `--mr-color-icon-fourth`（`#015eab`），勿用中性灰。  
6. **标签**：Field 标签跟 `--van-cell-font-size`（约 15px）与 label color token。  
7. **snippet**：可写 `label`/`sceneType` 等结构默认值；**勿**写死演示金额/账户/文件。  

### 6.2 v-model / state（designer 工程）

路径前缀：`lowcode-kit/packages/designer/src/plugins/materials/component-defaults/`

1. 策略单源：`strategies/<name>.ts`  
2. 注册两处：`external-drop.ts`（拖拽）+ `schema-patches.ts`（保存/预览兜底）  
3. 复用 `modelBindingShared`（`allocateIndexedStateKey` 等）  
4. 多 `defineModel` 绑同一 form 对象，如 `mpXxxFormN.{a,b}`；用户已绑业务 state 时 `shouldSkip`  
5. 无 v-model 演示需求的组件：**不要**为对称硬加 strategy  

### 6.3 新增 MP 组件最小闭环（OAB 实践顺序）

1. 读运行态 + 1～2 处业务用法  
2. OAB：`design-components/mp-xxx-designer.vue`（或 canvas-stub）+ `entries/mp-xxx.js`  
3. OAB：`manifest.json`：`snippetSchema` + `schemaExtra` + events  
4. 若需演示绑定：在 **designer 工程** 增加 strategy 并注册两处入口（临时在 demo 改的须同步回来）  
5. `pnpm run build:designer-materials` → Reload Host → 画布 / 出码 / 预览验收  
6. 进度文档标 **已导入待测** → 人工确认后 **已联调可用**  

验收底线：画布改 prop 可见 → 出码 props/v-model 正确 → 预览语义对齐运行态。

### 6.4 出码与预览

- 出码标签保持主工程组件名（`mp-page`、`mp-ccy-input`…）  
- 预览走真实 OAB 依赖；画布 store/picker 可用静态桩，但出码绑定名必须可对接真 store  

---

## 7. 验证清单（拷贝用）

### 构建

- [ ] `pnpm run build:designer-materials` 成功  
- [ ] `bundle.json` 组件数 ≈ manifest  
- [ ] 存在 `runtime.js`；`completion-utils.json` 已更新  

### 设计器

- [ ] Extension Host 工作区 = **OAB 根**  
- [ ] Network：`bundle.json` / `mp-*.js` / `mr-bank.css` 均为 200  
- [ ] 可拖 MR/MP；拖入后左侧 state（如需要）自动出现  
- [ ] 出码写入 `src/lowcode/modules/**`  

### 主工程预览

- [ ] `#/lowcode/lowcode-<path>` 可开  
- [ ] 无 i18n inject / `reading 'lowcode'` / 路由 No match  

---

## 8. 常见问题速查

| 问题 | 处理 |
|------|------|
| `No match found for path "/lowcode/..."` | 合并 `lowcodeRoutes`；重启 `pnpm dev` |
| `inject(I18nInjectionKey)` | `main.ts` provide |
| `reading 'lowcode'` / i18n TDZ | 仅 `main.ts` 挂载；勿在 `i18n/index` 静态引 lowcode |
| 构建找 `@opentiny/*` | Uno exclude `src/lowcode/**`；删 demo；勿乱加依赖 |
| `~icons/...` | 物料 vite 配 Icons |
| 设计器仍用旧主工程 | Host 重新打开 OAB 根 |
| 物料面板无新组件 | 重建物料 + 确认 URL/AM；Reload Host |
| 拖入无 v-model | 查 designer 工程 strategy / 两处入口是否已注册；临时 demo 改动是否已同步 |
| Class Name 无效 | `build:lowcode-styles`；查注入顺序 tokens→mr-bank→utilities |
| pre-commit 挂在生成 CSS | `/* */` 注释，勿 `//` |

---

## 9. 相关文档索引

| 文档 | 用途 |
|------|------|
| [物料导入进度跟踪-OAB](./物料导入进度跟踪-OAB.md) | **当前**导入优先级与联调状态（OAB） |
| [物料导入进度跟踪](./物料导入进度跟踪.md) | 原 mobilebanking 跟踪（历史对照） |
| [组件导入注意事项](./组件导入注意事项.md) | **强规则** + 分组件踩坑（必读） |
| [物料导入快速参考](./物料导入快速参考.md) | ZIP / 协议 / 改造方向 |
| [插件与设计器物料导入对接与排障](./插件与设计器物料导入对接与排障.md) | AM、静态服务、Network |
| [设计器与 packages 边界约定](./设计器与packages边界约定.md) | TinyEngine 官方 packages 只读；业务改 designer 工程 `src/` |
| [公共样式与 UnoCSS 导入设计器方案](./公共样式与UnoCSS导入设计器方案.md) | Class Name、`!` 前缀 |
| [主工程 Runtime 产出说明](./主工程Runtime产出说明.md) | `runtime.js` |
| [Ionic 组件导入与桩方案](./Ionic组件导入与桩方案.md) | Ionic 桩与 slot 文本 |
| [VSCode 集成](./VSCode-Integration.md) | 插件通信 |
| [I18N 包装器指南](./I18N_WRAPPER_GUIDE.md) | 出码 `t('lowcode.xxx')` |
| OAB `lowcode-materials/README.md` | 物料构建与画布桩细节 |

---

## 10. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-06-02 | 初版：OAB 接入路由 / i18n / 物料构建 / 排障（原文件名「主工程低代码集成指南」） |
| 2026-07-24 | 重命名为 **主工程低代码集成指南-OAB**；补充仓库地图、策略同步、问题决策表与精简开发要求；链到进度与注意事项作为细节单源 |
| 2026-07-24 | 文档口径更正：设计器权威工程为 **`lowcode-kit/packages/designer`**；`designer-demo` 仅作临时开发源，须同步回 designer |
| 2026-08-05 | 新增 **§11 待解决问题**：低代码页替换主工程入口、多入口返回 history 上一页；记录现象 / 根因判断 / 已尝试与约束 |

---

## 11. 待解决问题

> **状态**：未解决（2026-08-05）  
> **场景**：用低代码出码页逐步替换主工程业务页（以 donations 为例），并保证导航体验与普通模块一致。  
> **约束**：优先少动 / 慎动主工程公共导航组件；未经验证通过的大范围公共改动应回滚，避免「改得多、效果没达成」。

### 11.1 目的（要达成什么）

1. **页面替换**：低代码开发的页面能替换主工程原模块页（例：donations 列表）。  
2. **入口配置一致**：与普通模块一样，通过 **service id**（如侧拉菜单 `1901`）+ `services` 里的 `name`（`RouteName.xxx` / `DependencyRouteName.xxx`）跳转即可；调用方写 `$router.push({ name })` 或菜单 / 宫格按 service 跳转，**不必**为低代码单独写一套入口逻辑。  
3. **多入口返回正确**：入口可能来自侧拉菜单、首页头像、宫格、其它业务页等；点返回应回到 **history 上一页**，而不是固定回首页 Tab。  
4. **长期形态**：低代码页在「配置方式 / 跳转 / 返回」上尽量与普通模块无感，而不是依赖 `query.from=backToHome` 等特例。

### 11.2 问题（当前卡在哪）

| 项 | 说明 |
|----|------|
| 复现 | 从首页头像（或同类从 Tab 根）`push` 进入 `#/lowcode/lowcode-donations-list`，点页头返回 |
| 现象 A | 默认 `mp-back-button`：从 Tab 进二级页时，mount 时 Ionic `canGoBack` 常为 `false`，返回键无有效逻辑或按钮不按预期工作 |
| 现象 B | 用 `router.back()` / history fallback：浏览器地址已变为 `#/main/tabs/home`，**画面仍停在 Donations 列表**（Vue history 与 Ionic 视图栈不同步） |
| 配置侧 | 低代码路由名目前多为 `lowcode.lowcode.*`（生成 `module` + `name`），与业务 `RouteName.donationsList` 尚未对齐；**配置对齐**与**返回可用**是两件事，都未闭环 |

相关代码锚点（排查用，非定论）：

- 返回键：`OAB/src/components/base/mp-back-button.vue`（mount 读 `canGoBack`；支持 `query.from=backToHome` / `native`）  
- 路由栈：`OAB/src/composables/base/useMpRouter.ts`（`navigateToRoot` 会 `ionRouter.navigate` + 卸载 view stack）  
- Tab outlet：`OAB/src/shared/main/components/sc-main-tabs.vue`（离开 `/main/tabs/*` 时 `mr-router-outlet` 的 `key` 变化，易导致栈重建）  
- 菜单入口：`sc-menu-content` → `createMenuList({ id: '1901' })` → `getService` → `push({ name })`；**当前菜单不透传 `service.query`**  
- 宫格：`home-grid` 的 `handleServiceClick` 会带 `query`  
- 低代码路由注册：`OAB/src/router/lowcode.ts`（`name = lowcode.${module}.${route.name}`）

### 11.3 痛点

1. **`backToHome` 不符合产品要求**：返回被写成回首页 Tab，多入口时错误（应从侧拉进则回侧拉前的页，从业务页进则回业务页）。  
2. **不能只改低代码业务页就「像普通模块」**：返回失效根因更贴近 **Ionic + Tab outlet + `mp-back-button` 读栈时机**，普通模块从 Tab 根推进来也可能同类；低代码只是暴露了问题。  
3. **改公共返回 / 公共路由风险高**：曾尝试在 `mp-back-button`、`useMpRouter` 做 history / Ionic 双栈同步；出现「URL 变了、页面不变」，且公共面过大，**已回滚，不接受未验证通过的大改公共代码**。  
4. **配置与返回纠缠**：希望只配 `RouteName` / service id，但返回未解决时容易误用 `query` 特例，把「入口替换」和「返回策略」绑死，后续难维护。

### 11.4 已尝试（结论：未采纳）

| 尝试 | 结果 |
|------|------|
| 入口带 `query: { from: 'backToHome' }` | 能回，但**永远回首页**，不符合多入口 history 要求 |
| 改 `mp-back-button`：点击再判 `canGoBack` + `router.back()` | 地址变了，**Ionic 页未卸**，画面卡住 |
| 再扩 `useMpRouter.historyAwareBack`（`ionRouter.navigate` + 清 view stack） | 仍未稳定达成效果；公共改动面大，**已还原** |

### 11.5 后续排查方向（仅记录，未实施）

以下为可选方向，**实施前需小步验证、优先最小改动**，通过后再考虑是否动公共层：

1. **配置对齐（与返回解耦）**：`1901` 仍指向 `RouteName.donationsList`；原路由 `redirect` / 换 component 到低代码页，或生成时对齐业务 `module`/`name`。先解决「像普通模块配置」。  
2. **返回**：区分「显示返回键」与「执行返回」；任何方案必须同时满足 **URL 与可见 ion-page 一致**，且回到 **history 上一页**。  
3. **慎改清单**：`mp-back-button`、`useMpRouter`、`sc-main-tabs` outlet `key`——改前要有明确复现用例（侧拉 / 头像 / 业务页互跳）与回滚方案。  
4. **不推荐**：在低代码每个出码页手写返回特例作为长期方案（与「和普通模块一致」冲突）。

### 11.6 验收标准（解决后勾选）

- [ ] 侧拉 Donations（`1901`）进入低代码列表，返回回到进入前页面（通常为首页），**画面与 URL 一致**  
- [ ] 其它业务页 `push` 进入同一列表，返回回到该业务页，而非强制首页  
- [ ] 入口只需 service / `RouteName`（或等价 DependencyRouteName），**无需**为返回塞 `backToHome`  
- [ ] 公共层改动范围可审、可回滚；有回归用例覆盖 Tab 内外跳转  
