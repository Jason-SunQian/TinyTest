# 主工程 store 导入思路

> 目的：把主工程（**OAB**）公共 Pinia store 以 **`this.stores.<短名>`** 的形式注入低代码 Page JS，并在设计器 Monaco 中提供 **`this.stores.`** 二级补全，使低代码业务逻辑与手写 Vue 使用同一套 `@/stores` 能力。
>
> 约束：设计器与物料解耦；设计器侧**不新增** store 运行态实现，只消费主工程产物与既有 `completion` 机制。Page JS / schema **只改 json**，出码生成 `.vue`，勿手改 `views/*.vue`。
>
> **关联文档**：[主工程 utils 工具提示导入思路](./主工程utils工具提示导入思路.md)（同一套 `completion-utils.json` + `TINY_COMPLETION_CONFIG` 机制）、[主工程低代码集成指南-OAB](./主工程低代码集成指南-OAB.md)。
>
> **落地与排障请以 [§10 已落地成果与经验总结](#10-已落地成果与经验总结2026-08) 为准。**  
> **口径见 [§9](#9-当前落地结论与实现摘要)**。

---

## 0. 背景与目标

1. 低代码 Page JS 除 **`this.utils`** 外，还需要读写主工程 **Pinia store**（如 donations 流程中的 `local`、`transaction`）。
2. **当前状态（第一期）**：
   - 运行态：**`this.stores.transaction` / `this.stores.local`** 已挂载，与 `@/stores` 同源；
   - 设计态：**`this.stores.`** 二级补全已写入 `completion-utils.json` 的 `namespaces.stores`；
   - donations 模块已用 **`this.stores.local`** 验证通过。
3. **命名约定**：
   - Page JS 使用 **短名**（`transaction`、`local`），**不再**使用 `this.stores['common.transaction']` 等 Pinia `$id` 字符串键；
   - 交易结果页：直接 **`this.stores.transaction.setTransResult(...)` + `openResultPage()`**，不再经 `this.utils.openTransResult(..., store)` 中转（该 util 已移除）。

---

## 1. 架构摘要

### 1.1 与 `this.utils` 的对比

| 维度 | `this.utils` | `this.stores` |
|------|--------------|---------------|
| 真源 | `src/utils/index.ts` → `@/utils` | **`lowcode-utils/manifest.json` → `storeWhitelist`** |
| 运行态挂载 | `utils.js` + `lowcodeWrap` | **`stores.js`**（工厂表）+ `lowcode.js` → `collectStores()` |
| 补全数据来源 | 扫描 `utils/index.ts` → `namespaces.utils` | **同一 manifest 白名单** → `namespaces.stores` |
| 构建命令 | `pnpm run build:lowcode-utils` | **同一命令**（共用 `completion-utils.json` + 生成 `stores.js`） |
| Page JS 形态 | `this.utils.xxx()` | `this.stores.xxx.method()`（**实例**，非 `useXxxStore()` 工厂） |

### 1.2 交付物与职责

| 交付物 | 产出位置 | 作用 |
|--------|----------|------|
| `completion-utils.json` | OAB `src/lowcode/utils/` | 设计器 Monaco：`namespaces.stores.members`（插件工作区注入） |
| `stores.js` | OAB `src/lowcode/utils/` → 复制到 `common/extensions/stores.js` | 运行态 `LOWCODE_STORE_FACTORIES` |
| `lowcode.js` | OAB `src/lowcode/common/config/lowcode.js` | glob 加载 `stores.js`，`collectStores()` 实例化 |

**说明**：store 与 utils 同属 **`lowcode-utils`** 构建链路；白名单**只维护** `manifest.json` 的 `storeWhitelist`。

### 1.3 信息流（实际实现）

**运行态**

1. `pnpm run build:lowcode-utils` 根据 `storeWhitelist` 生成并复制 **`extensions/stores.js`**；
2. 主工程启动 / 出码页加载时，`lowcode()` 返回 `{ lowcodeWrap, stores }`；
3. 出码页：`wrap({ stores })`，Page JS 内 `this.stores` 指向 **已初始化的 Pinia 实例**；
4. `LOWCODE_STORE_FACTORIES` 中注册的 `useXxxStore()` 与手写 `import { useXxxStore } from '@/stores'` **同源**。

**设计态**

1. OAB 执行 **`pnpm run build:lowcode-utils`** → 更新 `completion-utils.json`（含 `namespaces.stores`，来自同一 `storeWhitelist`）；
2. 设计器 **`VITE_COMPLETION_CONFIG_URL`** 指向该 JSON（或 Extension Host 预注入 `window.TINY_COMPLETION_CONFIG`）；
3. **`packages/designer/src/composable/completion.ts`** + **`completion-keywords.ts`**：光标在 `this.stores.` 时读取 `namespaces.stores.members` 做二级补全。

### 1.4 Page JS 推荐写法

```js
// 读 local store（donations 草稿 / 列表缓存等）
const store = this.stores.local
store.list = mapped
store.donationSubmitContext = { ... }

// 交易结果页（与手写 useTransactionStore 一致）
this.stores.transaction.setTransResult(payload)
this.stores.transaction.openResultPage()
```

**勿用**（已废弃）：

```js
this.stores?.['common.local']
this.stores?.['common.transaction']
this.utils.openTransResult(payload, transStore)
```

---

## 6. 进度记录（待办/已完成）

**结论：`this.stores` 第一期（transaction + local）— 主线已完成。**

-   [x] 运行态：`stores.js` 白名单短名 `transaction` / `local`（`lowcode.js` glob 加载）
-   [x] 补全：`manifest.storeWhitelist` → `namespaces.stores`
-   [x] 构建：`pnpm run build:lowcode-utils` 写入 `completion-utils.json` + `stores.js`
-   [x] 设计器：`this.stores.` 二级提示（复用 utils 同一套 completion 管道）
-   [x] donations：`this.stores.local` 联调验证
-   [x] donations-confirm：schema 改为 `this.stores.transaction.setTransResult` + `openResultPage`
-   [x] 移除 `openTransResult` util（不再作为低代码推荐路径）
-   [x] **白名单单源**：`manifest.json` → `storeWhitelist`（补全 + 运行态 `stores.js`）
-   [ ] 可选：`this.stores.transaction.` 三级方法补全（`setTransResult` / `openResultPage` 等）
-   [ ] 可选：从 `@/stores` 扫描方法表做三级补全（类似 utils barrel，成本更高）

---

## 7. 问题清单（记录疑问与经验）

已澄清：

-   **为何不用 `useXxxStore()` 写在 Page JS 里？** Pinia 在事件回调里通常仍可 `useStore()`，但低代码 `wrap` 上下文与手写 setup 不同；运行态统一在 `collectStores()` 实例化，Page JS 只拿 **`this.stores.<短名>` 实例**，更简单、与补全键一致。
-   **短名与 Pinia `$id` 关系**：例如 `transaction` → Pinia id **`common.transaction`**；`local` → **`common.local`**。对外只暴露短名。
-   **schema 与 vue**：业务逻辑只改 **`*.json`（page schema）**，再出码；**不要**手改 `views/*.vue`。
-   **与 utils 共用 JSON**：`namespaces.stores` 与 `namespaces.utils` 在同一份 **`completion-utils.json`**，一次 build 同时更新。

仍可按项目需要讨论：

-   store 白名单是否按模块/环境拆分；
-   是否在 VariableConfigurator 等 UI 中展示 `this.stores.*` 与 schema globalState 的边界。

---

## 8. 后续增强方向（可选）

-   **三级补全**：`this.stores.transaction.` → `setTransResult` / `openResultPage`（需扫描 store 导出或维护方法表）。
-   **自动扫描方法表**：TS Compiler API 读 `defineStore` 的 return 方法（成本高，第一期未做）。
-   **composables**：另文档规划；与 store 类似但需区分「能否在 Page JS 事件里安全调用」。

> **白名单单源（档 B）已落地**：`manifest.storeWhitelist` → `completion-utils.json` + `stores.js`（含生成物文件头注释）。出码 `.vue` 内额外注释未做（价值低）。

---

## 9. 当前落地结论与实现摘要

### 9.1 口径：运行态一致（同 utils 口径 1）

-   设计器 **`this.stores.<member>`** 补全列表中的 `member`，必须在运行态 **`collectStores()`** 白名单里存在；
-   不允许「能补全但运行态没有」→ 避免 `undefined is not a function`；
-   允许「运行态有但未补全」（未进白名单或未 rebuild JSON）——仅影响提示，不影响调用（若开发者手写键名）。

### 9.2 白名单在哪里改（单源）

| 用途 | 文件（OAB 主工程） | 说明 |
|------|---------------------|------|
| **唯一配置** | `lowcode-utils/manifest.json` → **`storeWhitelist`** | `key` / `useStore` / `module` / `piniaId` |
| **运行态产物** | `src/lowcode/common/extensions/stores.js`（生成，勿手改） | `LOWCODE_STORE_FACTORIES` |
| **补全产物** | `src/lowcode/utils/completion-utils.json`（生成，勿手改） | `namespaces.stores.members` |
| **加载** | `src/lowcode/common/config/lowcode.js` | `import.meta.glob(.../stores.js)` + `collectStores()` |

**第一期白名单**（与 manifest 一致）

| 短名 `this.stores.*` | 工厂函数 | Pinia `$id`（signature 说明用） |
|----------------------|----------|----------------------------------|
| `transaction` | `useTransactionStore` | `common.transaction` |
| `local` | `useLocalStore` | `common.local` |
| `user` | `useUserStore` | `common.user` |
| `dict` | `useDictStore` | `dict` |
| `payment` | `usePaymentStore` | `common.payment` |

### 9.3 `completion-utils.json` 中 stores 结构

与 utils 共用 schema v2：

```json
{
  "namespaces": {
    "stores": {
      "members": [
        { "name": "transaction", "detail": "@/stores/transaction", "signature": "common.transaction" },
        { "name": "local", "detail": "@/stores/local", "signature": "common.local" }
      ]
    }
  }
}
```

-   **`name`**：Page JS 使用的短名（= `storeWhitelist[].key`）；
-   **`detail`**：Monaco 列表右侧来源文案（= `module`）；
-   **`signature`**：Pinia `$id` 对照（= `piniaId`）。

### 9.4 如何编译 / 刷新

在 **OAB 根目录**：

```bash
pnpm run build:lowcode-utils
```

产出 / 更新：

-   `src/lowcode/utils/completion-utils.json`（含 `namespaces.stores`）；
-   `src/lowcode/utils/stores.js` → 复制到 `src/lowcode/common/extensions/stores.js`。

Build 会校验：缺字段、重复 `key`、`useStore` 在 `src/stores` 中不存在 → **失败退出**。

修改白名单后：执行上述 build，再重启 **`pnpm dev`** / Reload 设计器（插件重读工作区 `completion-utils.json`）。

---

## 10. 已落地成果与经验总结（2026-08）

### 10.1 主工程：运行态 `this.stores`

**配置**：`OAB/lowcode-utils/manifest.json` → `storeWhitelist`  
**产物**：`OAB/src/lowcode/common/extensions/stores.js`（由 build 生成）  
**加载**：`OAB/src/lowcode/common/config/lowcode.js`（glob + `collectStores`）

```js
// stores.js（生成物，勿手改）
import { useLocalStore, useTransactionStore } from '@/stores';

export const LOWCODE_STORE_FACTORIES = {
    transaction: useTransactionStore,
    local: useLocalStore,
};
```

出码页典型注入（由出码器生成，勿手改）：

```js
const { t, lowcodeWrap, stores } = vue.inject(I18nInjectionKey).lowcode();
const wrap = lowcodeWrap(props, { emit });
wrap({ stores });
```

### 10.2 主工程：补全白名单与构建

**真源**：`manifest.storeWhitelist` → `buildCompletionConfig(root, manifest)`。  
**命令**：`pnpm run build:lowcode-utils`（`package.json` 已配置；`build:designer-materials` 末尾也会执行）。  
**产物目录**（`outputs.distDir`）：默认 **`src/lowcode/utils/`**。

### 10.3 设计器：补全如何生效

-   **`packages/designer/src/composable/completion.ts`**：`ensureCompletionUtilsConfigLoaded()` 加载 JSON；
-   **`packages/designer/src/config/completion-keywords.ts`**：`getInjectedNamespaceMembers('stores')` 读取 `namespaces.stores.members`；
-   光标匹配 **`this.stores.<prefix>`** 时触发二级补全（与 `this.utils.` 同一套逻辑）。

Extension Host 亦可通过 **`useVSCodeBridge`** 注入 `window.TINY_COMPLETION_CONFIG`。

### 10.4 新增 store 操作清单（维护者）

以新增 **`user`**（`useUserStore`，Pinia id 假设为 `user`）为例：

1. **`lowcode-utils/manifest.json`**：在 `storeWhitelist` 增加一项：

```json
{
  "key": "user",
  "useStore": "useUserStore",
  "module": "@/stores/user",
  "piniaId": "user"
}
```

2. **`pnpm run build:lowcode-utils`**（校验 `useUserStore` 存在于 `src/stores`）；
3. Reload 设计器，确认 **`this.stores.`** 出现 `user`；
4. 在业务 **schema json** 中使用 `this.stores.user...`，**出码**更新 vue；
5. 主工程预览验证。

### 10.5 联调检查清单

1. Network / 插件注入：能加载最新 **`completion-utils.json`**；
2. 设计器 Page JS：输入 **`this.stores.`** 可见 `transaction`、`local`，右侧有 `@/stores/...` 文案；
3. 出码页：**`this.stores.local`** / **`this.stores.transaction`** 可读写，行为与手写 store 一致；
4. schema **仅改 json**，出码后 vue 与 json 一致，无手改 vue 漂移；
5. **`extensions/stores.js` 勿手改**；改白名单只动 manifest + rebuild。

### 10.6 donations 参考（schema 侧）

-   **列表 / 表单页**：`getDonationStore()` → `return this.stores?.local || null`；
-   **确认页提交成功/失败**：

```js
this.stores.transaction.setTransResult({ ... })
this.stores.transaction.openResultPage()
```

---

文档维护者：开发团队  
最后更新：2026-08-10（白名单单源：manifest.storeWhitelist → completion + stores.js）
