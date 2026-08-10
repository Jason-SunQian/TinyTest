# 主工程 utils 工具提示导入思路

> 目的：把主工程（`/Users/mac/Desktop/Project/2025/mobilebanking`）通用工具方法（`utils/`）以“关键字 + 可选 snippets”的形式注入设计器，提升开发者在低代码设计器中编写 JS 的代码补全体验。
>
> 约束：设计器与物料解耦；设计器改造不触碰 `packages/`（`packages` 仅用于参考）。
>
> **落地与排障请以 [§10 已落地成果与经验总结](#10-已落地成果与经验总结2026-04) 为准。**  
> **口径与 schema 见 [§9](#9-当前落地结论口径1与实现摘要避免后续误导)。**  
> 下文 **§0–§1** 为与当前实现对齐的摘要；原「分步规划 / editorOnly 优先 / 人工 keywords 清单」等**已过时**，不再作为执行依据。

---

## 0. 背景与目标

1. 主工程产出物料（如 `dist/lowcode-materials`），设计器经插件或 URL 加载；通用工具补全需与主工程 **同一套 `@/utils` 契约**，避免「能提示不能跑」或「跑的是另一套实现」。
2. **当前状态（主线）**：设计器 **`this.utils.*` 补全** + 出码运行 **`this.utils` = `@/utils` 命名空间** 已打通；维护方式为主工程 **`pnpm run build:lowcode-utils`**（或物料构建）刷新 `completion-utils.json` 与 `utils.js`，**不必再单独维护一份「常用工具关键字」人工表**（除非产品上要白名单降噪）。
3. **仍属可选增强**：代码 **snippets**、更完整的 **signature/文档**、补全列表与运行态键 **100% 对齐**（TS Compiler API）等——见 **§6 未勾选项** 与 **§8**。

---

## 1. 架构摘要（取代原 §1–§5 规划稿）

### 1.1 交付物与职责

| 交付物                  | 产出位置                                                         | 作用                                                             |
| ----------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `completion-utils.json` | `dist/lowcode-utils/`（可同步到 `dist/lowcode-materials/`）      | 设计器 Monaco：`namespaces.utils` / `namespaces.http` 等二级成员 |
| `utils.js`              | 同上，再按 manifest **复制**到可被 `import.meta.glob` 命中的路径 | 运行态 `this.utils`                                              |

真源：**`src/utils/index.ts` → `@/utils` 聚合**；**不再**依赖 `extensions/utils-*.json` 演示文件。

### 1.2 信息流（实际实现）

1. 主工程 **`lowcode-utils/scripts/build.mjs`** 扫描 index 生成 `completion-utils.json`，生成 barrel **`utils.js`**。
2. 设计器 **`VITE_COMPLETION_CONFIG_URL`** 指向上述 JSON → `fetch` → **`window.TINY_COMPLETION_CONFIG`**（也可由插件提前注入同结构对象，效果等价）。
3. **`designer-demo/src/composable/completion.ts`**：`ensureCompletionUtilsConfigLoaded()` + **`getInjectedNamespaceMembers()`**（见 `completion-keywords.ts`）；在 **`this.<namespace>.`** 上下文中与 **`appSchemaState.utils`** 等合并；Monaco 列表右侧文案用 **`label.description`**（见 §10.3）。

### 1.3 与旧稿差异（避免误读）

-   **已废弃表述**：「editorOnly 优先、与运行态弱耦合」「人工维护 keywords + 插件独占注入」「getCompletionConfig() 待新增」「把注入 keywords 塞进 getApiSuggestions」——均已被 **口径 1（§9.1）+ `@/utils` 同源 + 二级 namespace 补全** 替代。
-   **`completion-keywords.ts`**：仍承担 **`customKeywords`（如 http、router）** 与 **解析 `TINY_COMPLETION_CONFIG.namespaces`**，不是第二套手工 utils 清单。
-   **若需「只提示部分工具」**：属于产品策略（白名单），要在生成脚本或 JSON 后处理中加规则，**不是**未完成的主线任务。

---

## 6. 进度记录（待办/已完成）

**结论：`this.utils` 设计器补全 + 出码运行与 `@/utils` 对齐 — 主线已完成。**  
下列未勾选项均为 **体验增强或非阻塞** 工作。

任务清单：

-   [x] 统计/生成主工程 `utils` 补全数据（以 `src/utils/index.ts` 为入口扫描，产出 `completion-utils.json`）
-   [x] 定义 `completion-utils.json` 的 schema（`version` + `namespaces.<ns>.members[]`，含 `name/detail/signature`）
-   [x] 约定注入全局变量 `window.TINY_COMPLETION_CONFIG`（由 fetch 或插件预注入）
-   [x] 设计器读取注入配置并合并到 completion（二级 `this.<namespace>.` + 动态 utils）
-   [x] 验证：Script / Page JS 编辑器中 `this.utils.` 二级提示与来源文案（Monaco `description`）
-   [x] 主工程运行时 `this.utils` 与 `@/utils` 对齐（`lowcode-utils` 生成 `utils.js` + `lowcode.js` default 读取）
-   [ ] 验证：片段 snippet 若后续扩展，插入缩进与占位符（当前主线为关键字/二级成员）
-   [ ] 可选：用 TS Compiler API 提升补全成员与运行态导出集合的完全一致率

---

## 7. 问题清单（记录疑问与经验）

已澄清或部分澄清：

-   **命名空间**：低码事件体统一使用 **`this.utils.xxx`**（与 `lowcodeWrap` 注入一致）；**`this.http`** 单独注入，不在 `utils.js` 内。
-   **提示与运行态**：采用 **口径 1**（§9.1）；`this.utils` 与 `@/utils` 同源后，「能提示」与「能调用」在成员存在性上对齐；个别 API 在浏览器侧 `reject` 属主工程既有行为。
-   **主工程 `utils-*.json`**：可不再维护；真源为 **`src/utils/index.ts` + `@/utils` 聚合**。

仍可按项目需要讨论：

-   snippets 是否按 Script / 表达式等场景拆分加载；
-   版本号与回滚策略在 CI 中的门禁。

---

## 8. 后续增强方向（可选，不影响主线闭环）

-   **补全列表 = 运行态键全集**：用 TypeScript Compiler API 或构建产物导出表，替代当前启发式扫描（见 §6 待办）。
-   **签名与文档**：在 `members[].signature` / 文档字段中补充参数说明（扫描或手书维护）。
-   **Snippets**：try/catch、常用 `this.http` 模板等（见 §6 待办）；与 `getSnippetsSuggestions` 扩展挂钩。
-   **白名单 / 分级加载**：若提示过多，在生成阶段过滤 `namespaces.utils.members`，或按编辑器场景加载不同配置。

---

## 9. 当前落地结论（口径 1）与实现摘要（避免后续误导）

> 本节用于统一团队对“提示=是否可用”的口径，避免后续继续讨论时把提示来源与运行态契约混在一起。

### 9.1 口径：运行态一致（口径 1）

-   设计器里 `this.<namespace>.<member>` 出现的成员（关键字/二级补全），必须来自“主工程运行态会真正注入/注册到 `this.<namespace>` 上”的那份清单。
-   当工具因为环境差异在非 native 场景下返回 `reject`（例如 `chooseImage/uploadFile` 内部 `mrBox.canIUse('chooseImage')` 拦截），这属于主工程自身在浏览器/非 native 环境的既有行为；因此只要出码后调用的是主工程同一实现，设计器与主工程表现应保持一致，允许出现 `reject`，但不允许出现“提示了主工程运行态根本没有的成员”（否则会出现 `undefined is not a function` 这类硬失败，破坏口径 1）。

### 9.2 当前 completion config schema（v2 方向）

-   `completion-utils.json` 使用结构化的 `namespaces`：
    -   `namespaces.<namespace>.members[]`
    -   `namespace` 对应设计器里 `this.<namespace>`（例如 `utils`、`http`）
    -   `members[]` 至少包含 `name`，可选 `detail/signature`

### 9.3 当前设计器补全策略（二级通用化）

-   二级补全不再为 `http` 写特化 demo，而是统一解析光标形态：
    -   当光标位于 `this.<namespace>.<prefix>` 时，触发对应 `namespaces[namespace].members` 的过滤补全。
-   members 的获取优先来自注入配置 `window.TINY_COMPLETION_CONFIG.namespaces[namespace].members`。
-   设计器仍保留与运行态动态工具列表的合并能力（确保 Bridge/动态注入不丢失）。

### 9.4 产物生成与设计器装载

-   主工程执行 **`pnpm run build:lowcode-utils`**，产出：
    -   `src/lowcode/utils/completion-utils.json`
    -   `src/lowcode/utils/utils.js`（并复制到 `common/extensions/utils.js`）
    -   `src/lowcode/utils/stores.js`（并复制到 `common/extensions/stores.js`）
-   **不再**把 `completion-utils.json` 混入 `dist/lowcode-materials/`（物料目录只负责组件 bundle）。
-   **设计器主路径（VS Code 插件）**：读取工作区上述 JSON，注入 `window.TINY_COMPLETION_CONFIG`；env 中 `VITE_COMPLETION_CONFIG_URL` 可注释。
-   **备选（无插件）**：自行静态服务 JSON，并配置 `VITE_COMPLETION_CONFIG_URL`。

### 9.5 成员集合与口径 1

-   **运行态 `this.utils`**：与 **`import * from '@/utils'`** 一致，故「实际可调用集合」由主工程 barrel 决定，**不要求**再手工维护一份「待提取关键字表」才能完成闭环。
-   **设计器补全列表**：由 `src/utils/index.ts` 扫描生成，可能 **少于** 运行态全部键（见 §10.2）；这不违反口径 1（未提示的成员仍可在运行态存在），若需列表与键集合完全一致，属 **§6 / §8** 的可选增强（TS API）。
-   对 native 依赖能力：允许 `reject`；不允许提示 **运行态不存在** 的 `this.utils` 成员（与手写 `undefined is not a function` 一致）。

---

## 10. 已落地成果与经验总结（2026-04）

本节汇总当前已实现链路、文件位置与踩坑经验，便于新成员接手与排障。

### 10.1 主工程：`lowcode-utils` 与运行时 `this.utils`

-   **独立目录**：主工程根下 `lowcode-utils/`，角色对齐 `lowcode-styles/`（单独构建；插件从工作区注入）。
-   **构建命令**：`pnpm run build:lowcode-utils`（**不再**挂在 `build:designer-materials` 末尾；全量可用 `pnpm run lowcode`）。
-   **产物目录**：默认 `src/lowcode/utils/`，包含：
    -   `completion-utils.json`：供设计器 Monaco 二级补全（插件注入）；
    -   `utils.js` / `stores.js`：供出码运行态 `import.meta.glob` 命中；
    -   `manifest.resolved.json`：本次构建路径快照（排查用）。
-   **`manifest.json`（`lowcode-utils/manifest.json`）**：
    -   `copyUtilJsTargets` / `copyStoreJsTargets`：生成后复制到的路径（相对仓库根）；
    -   `storeWhitelist`：`this.stores` 短名白名单；
    -   `outputs.distDir`：产物目录；
    -   可用环境变量 **`LOWCODE_UTILS_MANIFEST`** 指向另一份 manifest（多应用/多环境）。
-   **运行时契约（与手写一致）**：`utils.js` **不再**从 `utils-*.json` 拼 npm/内联函数，而是固定为：
    -   `import * as utils from '@/utils'`
    -   `export default utils`
        因此 **`this.utils.xxx` 与手写页面 `import { xxx } from '@/utils'` 使用同一套导出**。`src/lowcode/common/extensions/utils-*.json` 若仅为历史演示，**可删除**；构建**不读取**它们。
-   **`lowcode.js` 注意点**：聚合模块需使用 **`utilsModule.default ?? utilsModule`** 读取 ESM 的 `default export`，否则 `this.utils` 可能不是 plain object。

### 10.2 `completion-utils.json` 的生成规则（成员与 `detail` 文案）

-   **扫描入口**：`src/utils/index.ts`，按行解析 `export * from './…'`、`export { … } from '…'`、`export * from '包名'`。
-   **`members[].detail`（来源提示）**：与 index 上 **该条 export 的 `from` 展示名** 一致，例如：
    -   `./mrBox` → `mrBox`；
    -   `./formatDate` → `formatDate`；
    -   `@mr/shared-utils` → `@mr/shared-utils`；
    -   `lodash-es` → `lodash-es`。
-   **子目录再导出**：从 index 进入 `export * from './dialog'` 后，其下 `toast/alert/...` 等再导出链上的符号，**仍沿用** `dialog` 作为 `detail`（表示「从 index 看出去的第一段」）。
-   **同文件再导出**：支持 `export { mrBox };` 等形式，避免漏掉仅有花括号导出的符号。
-   **外部包 `export *`**：尝试读 `node_modules` 包入口 `types` 对应 `.d.ts` 做粗解析；**补全列表可能仍少于**真实 `import * from '@/utils'` 的全部键（复杂再导出、`.vue` 路径等）。**运行态**仍以整包 `@/utils` 为准，不受扫描完备性影响。
-   **与 `this.http` 的关系**：`http` 仍在 `lowcode.js` 单独注入；`completion-utils.json` 中保留 `namespaces.http.members`（如 get/post/put/delete）仅供补全，与 `utils` 分离。

### 10.3 设计器：`VITE_COMPLETION_CONFIG_URL` 与 Monaco 展示

-   **拉取配置**：`designer-demo` 中 `src/composable/completion.ts` 在补全前 `await ensureCompletionUtilsConfigLoaded()`：若尚无 `window.TINY_COMPLETION_CONFIG`，则按 **`VITE_COMPLETION_CONFIG_URL`** `fetch` JSON 并写入全局（与物料解耦，和样式 bundle URL 思路一致）。
-   **相对路径 URL**：脚本会将以 `/` 开头的 URL 补全为 `TINY_DESIGNER_ORIGIN` / `VITE_ORIGIN` / `location.origin`，避免 webview / Extension Host 下相对路径错域。
-   **二级补全合并**：`this.utils.` 时合并 **`TINY_COMPLETION_CONFIG.namespaces.utils.members`** 与 **`appSchemaState.utils`（仅 name）**；同名以注入配置为先。
-   **Monaco 0.52+ 关键经验（来源提示不显示）**：
    -   补全列表**右侧灰字**对应 **`CompletionItemLabel.description`**，需使用  
        `label: { label: 成员名, description: 来源文案 }`。
    -   仅设置顶层 **`detail`** 往往只作用于**选中项下方的详情区**，不足以填满列表右侧列，容易误以为「配置没生效」。
-   **兜底**：当某成员无 `detail`（例如仅来自 schema 动态列表）时，`utils` 命名空间下 **`description` 使用 `@/utils`**，其它命名空间可用 `Lowcode API`，避免右侧空白。

### 10.4 Page JS 面板宽度（避免补全被裁切）

-   **文件**：`designer-demo/src/plugins/script/Main.vue` 中 **`.plugin-page-js-container`**。
-   **经验**：曾用 `500px !important` 三向锁死宽度，覆盖 `registry` 里 `engine.plugins.customScript` 的 `width: 800`，导致 Monaco 补全列表过窄、右侧说明被裁成「Low…」或看似空白。
-   **建议**：与 registry 默认对齐 **`width: 800px`**，设合理 **`min-width` / `max-width`**（如 `min(1200px, 55vw)`），并与 **`widthResizable: true`** 配合；**避免**对 `.suggest-widget` 使用 `min-width: 100%` 等易破坏内部布局的覆盖。

### 10.5 联调检查清单

1. 浏览器 **Network** 能成功请求 **`completion-utils.json`**（注意 Extension Host / webview 的 origin 与端口）。
2. 设计器 **`this.utils.`** 列表右侧出现 **`detail` 对应文案**（如 `media`、`account`、`@mr/shared-utils`）。
3. 主工程出码页 **`Object.keys(this.utils || {})`** 非空，且调用行为与手写引用 `@/utils` 一致。

---

文档维护者：开发团队  
最后更新：2026-04-03（修订：精简 §1–§5、明确 utils 主线已闭环与可选增强）
