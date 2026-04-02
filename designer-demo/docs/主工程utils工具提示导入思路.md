# 主工程utils工具提示导入思路

> 目的：把主工程（`/Users/mac/Desktop/Project/2025/mobilebanking`）通用工具方法（`utils/`）以“关键字 + 可选 snippets”的形式注入设计器，提升开发者在低代码设计器中编写 JS 的代码补全体验。
>
> 约束：设计器与物料解耦；设计器改造不触碰 `packages/`（`packages` 仅用于参考）。

---

## 0. 背景与目标

1. 主工程会生成物料资产包（`dist/lowcode-materials`），并由 VSCode 插件导入设计器。
2. 设计器（`designer-demo`）与物料资产包协议解耦：设计器通过 bundle URL 加载组件与 snippets schema。
3. 现在希望进一步解耦“通用工具提示”：把主工程 `utils/` 里的通用工具方法导入到设计器的 Monaco 代码提示体系中。

目标：

- 支持开发者在设计器 JS 编辑器中获得补全提示（关键字形式）。
- 可选支持常用 snippets 快速插入（例如 try/catch、http 调用模板、常用表达式模板）。
- 设计器侧只消费“注入的配置数据”，不直接依赖主工程源码。

---

## 1. 总体信息流（建议方案）

推荐把“代码提示能力”做成同一类交付物：`completion config`。

信息流：

1. 主工程 `utils/` 被统计/提取，生成一份纯数据交付物（例如 `completion-utils.json`）。
2. VSCode 插件把该交付物解析为可注入的配置，并在打开设计器 webview 时注入到全局变量。
3. `designer-demo` 读取注入配置，合并到本地 `completion-keywords.ts` 与现有 completion 逻辑中。
4. Monaco 依据合并后的关键字与 snippets 产生补全建议。

关键点：

- 提示是“编辑器体验”（editorOnly）优先，避免提示与运行态存在强耦合。
- 只有在确实由 Bridge/运行时注入保证存在的对象，才将其标记为 runtimeBacked。

---

## 2. 第 1 步：统计主工程 `utils/` 需要提取什么

2.1 统计要回答的三个问题

- 导出形态：`function` / `const` / `namespace` / `class` / 对象树分别有哪些，以及导出名是什么。
- 编辑器可用性：哪些工具方法适合做提示？哪些可能因为运行态依赖而不适合（或只做“提示名字”）。
- 使用频率：高频优先，避免把提示空间塞满导致噪音。

2.2 建议统计输出（未来会落地为配置清单字段）

每条候选工具方法建议记录：

- `key`：设计器里希望出现的关键字（例如 `formatMoney`、`request`、`utils.formatMoney` 的最终呈现片段）
- `display`：提示展示名（可与 key 相同，也可更友好）
- `kind`：`function` / `const` / `namespace`
- `signature`：参数与返回（用于 detail/doc）
- `doc`：一句话说明 + 常见调用示例（用于提示 detail）
- `snippet`（可选）：当需要快速插入模板时提供 snippet 模板
- `runtimeAvailability`：
  - `editorOnly`：仅提示，不保证运行时一定存在
  - `requiresBridge`：运行时需 Bridge 提供（提示可提示，但建议标注）
  - `requiresRuntimeInjection`：运行时需通过 runtime 注入（提示可用，但应标注来源）
- `source`：主工程 `utils` 中的路径 + 导出名（用于回溯与维护）

2.3 统计分级建议

- 高优先级：登录/请求/http、基础格式化（时间/金额）、常见校验、常用通用转换
- 中优先级：相对业务化但仍可在低代码里高频复用的工具
- 低优先级：强依赖业务上下文/必须特定注入才能运行的工具（除非能确定运行时注入链路）

---

## 3. 第 2 步：导入之前，需要生成怎样的内容给插件

3.1 推荐先落地“可维护的纯数据清单”

建议生成类似 `completion-utils.json` 的交付物（建议随版本号变化）：

- `version`：配置版本，用于兼容升级
- `keywords`：关键字与 namespace/函数条目的列表（最终供 Monaco 使用）
- `snippets`：snippets 列表（可选；与 keywords 关联）
- `meta`（可选）：主工程标识、构建时间、适用范围（可选）

建议优势：

- 插件无需解析 TS 源码，只需读取数据并注入设计器。
- 设计器只消费注入配置，仍保持与主工程解耦。

3.2 两个实现路线

- 路线 A（推荐起步）：人工/半自动维护清单 JSON（先跑通链路）
- 路线 B（后续增强）：脚本从主工程源码/类型自动生成清单（降低维护成本）

---

## 4. 第 3 步：设计器要改造哪些内容接收插件传递的关键字列表

4.1 设计器改造原则

- 不修改 `packages/`，只在 `designer-demo/src/` 内做读取与合并逻辑。
- 注入配置的读取时机与物料注入类似：webview 打开时注入全局变量，设计器读取后合并到 completion。

4.2 设计器接收注入配置（建议新增能力）

新增一个“读取注入配置”的入口（名字可为 `getCompletionConfig()`）：

- 读取 `window.TINY_COMPLETION_CONFIG`（或类似命名）
- 与本地 `completion-keywords.ts` 做合并：
  - 去重（key/namespace 唯一）
  - 分组/过滤（可在编辑器不同场景使用不同策略）
  - 追加 snippets
- 将结果喂给现有 completion provider 逻辑

4.3 设计器 completion 合并逻辑（建议调整点）

将注入配置提供给以下能力：

- `getApiSuggestions()`：将注入 keywords 追加到建议列表（包含 doc/signature）
- `getSnippetsSuggestions()`：将注入 snippets 追加到片段建议
- 保留现有动态工具方法提示（例如 Bridge 创建的工具）逻辑不变

4.4 提示与运行态的标注（建议）

为了避免开发者误解“有提示=可运行”，建议在提示 detail/doc 中标注 runtimeAvailability：

- `editorOnly`：提示存在但运行态不保证
- `requiresBridge` / `requiresRuntimeInjection`：提示存在但依赖外部注入链路

---

## 5. 与现有 completion 体系的关系

现状：

- `designer-demo/src/config/completion-keywords.ts` 存在本地关键字配置（`customKeywords`）。
- `designer-demo/src/composable/completion.ts` 负责提供 Monaco completion（内置 API、动态工具、snippets）。

目标：

- 保留本地关键字作为“默认/兜底”
- 在插件注入配置存在时进行合并与覆盖（或仅追加）

---

## 6. 进度记录（待办/已完成）

（建议你按实际推进情况修改下面状态）

任务清单：

- [ ] 统计主工程 `utils/` 导出工具清单（产出字段见第 2 节）
- [ ] 定义 `completion-utils.json` 的 schema（version、keywords、snippets 等）
- [ ] 定义插件注入全局变量字段命名（如 `window.TINY_COMPLETION_CONFIG`）
- [ ] 插件读取清单并注入设计器（只传数据，不做运行时强耦合）
- [ ] 设计器读取注入配置并合并到 completion（关键字 + snippets）
- [ ] 验证：在 Script JS 编辑器中触发 `this.` 与 `this.utils.` 提示
- [ ] 验证：片段 snippet 插入是否正确（缩进/占位符/可重复性）
- [ ] 验证：提示文档与参数签名是否准确

---

## 7. 问题清单（记录疑问与经验）

待记录的问题：

- 需要在设计器里支持哪些命名空间风格（`this.api.xxx`、`this.utils.xxx`、还是扁平 key）？
- 对于强依赖运行态注入的工具，提示应该如何标注，是否需要降级策略？
- snippets 是否要按“场景编辑器”区分（Script/生命周期/变量表达式）？
- 如果主工程工具命名变更，如何通过版本号保证兼容与回滚？

---

## 8. 后续增强方向

- 自动化生成清单：从主工程 TS AST/类型生成候选条目，再叠加白名单/重命名策略。
- 分级加载：按需要在打开特定编辑器时加载对应 snippets/keywords，减少提示噪音。
- 与物料协议联动：如果某些 runtimeScript 已存在，进一步区分 editorOnly 与 runtimeBacked。

---

## 9. 当前落地结论（口径1）与实现摘要（避免后续误导）
> 本节用于统一团队对“提示=是否可用”的口径，避免后续继续讨论时把提示来源与运行态契约混在一起。

### 9.1 口径：运行态一致（口径1）
- 设计器里 `this.<namespace>.<member>` 出现的成员（关键字/二级补全），必须来自“主工程运行态会真正注入/注册到 `this.<namespace>` 上”的那份清单。
- 当工具因为环境差异在非 native 场景下返回 `reject`（例如 `chooseImage/uploadFile` 内部 `mrBox.canIUse('chooseImage')` 拦截），这属于主工程自身在浏览器/非 native 环境的既有行为；因此只要出码后调用的是主工程同一实现，设计器与主工程表现应保持一致，允许出现 `reject`，但不允许出现“提示了主工程运行态根本没有的成员”（否则会出现 `undefined is not a function` 这类硬失败，破坏口径1）。

### 9.2 当前 completion config schema（v2 方向）
- `completion-utils.json` 使用结构化的 `namespaces`：
  - `namespaces.<namespace>.members[]`
  - `namespace` 对应设计器里 `this.<namespace>`（例如 `utils`、`http`）
  - `members[]` 至少包含 `name`，可选 `detail/signature`

### 9.3 当前设计器补全策略（二级通用化）
- 二级补全不再为 `http` 写特化 demo，而是统一解析光标形态：
  - 当光标位于 `this.<namespace>.<prefix>` 时，触发对应 `namespaces[namespace].members` 的过滤补全。
- members 的获取优先来自注入配置 `window.TINY_COMPLETION_CONFIG.namespaces[namespace].members`。
- 设计器仍保留与运行态动态工具列表的合并能力（确保 Bridge/动态注入不丢失）。

### 9.4 产物生成与远程动态加入
- 主工程在物料构建链路中生成 `completion-utils.json`，并放入与物料同目录：
  - `dist/lowcode-materials/completion-utils.json`
- 设计器通过环境变量远程拉取该产物（与 `VITE_STYLE_BUNDLE_URLS` 类似）：
  - `VITE_COMPLETION_CONFIG_URL=<url>/completion-utils.json`

### 9.5 后续批量提取 utils 的规则（必须遵守）
- 可以用源码分析（`src/utils/**` 导出）做 signature/doc 提取与候选生成。
- 但最终写入 `namespaces.<namespace>.members` 的集合，必须满足口径1：即“运行态实际会注入的成员交集”。
- 对 native 依赖能力：允许 `reject` 行为存在；但不允许“提示了不存在的成员”。

---

文档维护者：开发团队
最后更新：2026-03-30

