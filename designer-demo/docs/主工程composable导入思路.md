# 主工程 composable 导入思路

> 目的：把主工程（**OAB**）少数确有必要的公共 composable，以统一的 **`this.composables.<key>`** 注入低代码 Page JS，并在设计器 Monaco 提供 **`this.composables.`** 二级 / 三级补全。
>
> 约束：设计器侧**不实现** composable 运行态，只消费主工程 `completion-utils.json` 与既有补全机制。Page JS / schema **只改 json**，出码生成 `.vue`，勿手改 `views/*.vue`。
>
> **关联文档**：[主工程低代码资源操作手册](./主工程低代码资源操作手册.md)、[主工程 store 导入思路](./主工程store导入思路.md)、[主工程 utils 工具提示导入思路](./主工程utils工具提示导入思路.md)、[主工程低代码集成指南-OAB](./主工程低代码集成指南-OAB.md)。

---

## 0. 背景与目标

1. 主工程大量公共 composable（`useQuery`、`useKeyboard`、`useMpRouter` 等）在手写 Vue 里很有用，但 **多数不应整包暴露给 Page JS**：
   - 请求 → 已有 **`this.http`**
   - 状态 → 已有 **`this.stores.<短名>`**
   - 路由 → 已有 **`this.router`**
   - UI / 交互 → 优先物料事件与画布组件
2. 少数能力在 Page JS 高频、且没有等价 API（如剪贴板、OTP 倒计时），需要可控白名单暴露。
3. **当前状态（已闭环）**：
   - 运行态 / 补全统一挂载面：**`this.composables.<key>`**（与 `this.stores.<key>` 同构）
   - 配置单源：`lowcode-utils/manifest.json` → **`composableHelpers`**
   - 已落地：`clipboard`（`useClipboard`）、`countdown`（`useCountdown`）

---

## 1. 统一约定（必读）

### 1.1 唯一挂载面

| 项 | 约定 |
|----|------|
| Page JS | **`this.composables.<key>`** |
| 补全一级 | `this.composables`（关键字，与 `stores` / `utils` 并列） |
| 补全二级 | `this.composables.` → `clipboard` / `countdown` / … |
| 补全三级 | `this.composables.countdown.` → `startCountdown` / `time` / … |
| 生命周期 | **一律**在 `lowcodeWrap`（页 setup）内 `useXxx()` **一次** |

**已废弃（勿再文档化 / 勿再配置）**

- `mount: "utils"` → 合并进 `this.utils`（曾：`this.utils.copyText`）
- `mount: "page"` → 挂到 `this.<key>` 一级（曾：`this.countdown`）

`this.utils` **只**承载 `@/utils` barrel；composable 与 utils **分树**，来源清晰。

### 1.2 与 utils / stores 对比

| 维度 | `this.utils` | `this.stores` | `this.composables` |
|------|--------------|---------------|---------------------|
| 真源 | `src/utils/index.ts` | `manifest.storeWhitelist` | **`manifest.composableHelpers`** |
| 运行态 | `extensions/utils.js` | `extensions/stores.js` | **`extensions/composable-helpers.js`** |
| 补全 | `namespaces.utils` | `namespaces.stores` | **`namespaces.composables`**（含 `children`） |
| 构建 | 同一 `pnpm run build:lowcode-utils` | 同左 | 同左 |
| Page JS | `this.utils.fn()` | `this.stores.key.method()` | **`this.composables.key.member`** |

### 1.3 准入规则（比接线更重要）

**默认不导出。** 仅当同时满足时才进 `composableHelpers`：

1. Page JS 高频调用；
2. 没有 `this.http` / `this.stores` / `this.router` / 物料的等价写法；
3. 可接受「每页一次实例」（含无状态的 clipboard）。

关闭某项：manifest 设 `"enabled": false` → rebuild。

### 1.4 为何目前只导出 clipboard / countdown？（结论）

**可以先不管 `src/composables/base` 里其余 composable**（`useQuery`、`useMpRouter`、`useKeyboard` 等）。这不是烂尾，而是刻意白名单。

| 问题 | 结论 |
|------|------|
| base 里其它要不要现在导入设计器？ | **不用。** |
| 会影响主工程 / 以后手写开发吗？ | **不会。** 那些 composable 仍在主工程给 Vue / Pinia 用（例如 store 里 `useQuery` + `http.post`）。 |
| 当前设计器做低代码够不够用？ | **够做常见页**：请求 → `this.http`；跳转 → `this.router`；业务状态 → `this.stores`；工具弹层 → `this.utils`；复制/倒计时 → `this.composables`；壳层 TabBar → `this.appState`。 |

**为何不是「其它都进了 store」**

- `useQuery` ≠ `this.http`：同一请求链路，不同 API。`http` 能发请求；`useQuery` 还带 loading/缓存/语言失效/登出清理等。低代码多数页用 `this.http` + `this.state` 手写子集即可，**不必**整包导入 `useQuery`。
- `useMpRouter` ≠ 完整等于 `this.router`：同一导航体系；低代码已有 `push` / `back` / `goBack`（部分接自 MpRouter），`changeTab` 等若真需要再补 router 或白名单。
- 业务数据 / 用户 / 字典 → 才是 **`this.stores.*`** 覆盖的部分。
- Toast / Picker / 支付等 → 本来就在 **`this.utils`**，不是 composable 缺口。

**只导出这两项的原因**

| 已导出 | 原因 |
|--------|------|
| `clipboard` | Page JS 常见，且无等价 `this.*` |
| `countdown` | OTP/重发倒计时常见，且无等价 `this.*` |

**以后什么时候再加 base 里的项**

低代码页**反复**需要某 composable 的完整语义（例如必须要 `useQuery` 的缓存/失效，或必须要 `changeTab`），且用现有 `this.http` / `this.router` / `this.stores` / `this.utils` 写起来很痛苦时——再进 `composableHelpers`（或优先补 `this.router`）。机制已具备，扩员成本低。

---

## 2. 架构与信息流

### 2.1 交付物

| 交付物 | 产出位置 | 作用 |
|--------|----------|------|
| `completion-utils.json` | OAB `src/lowcode/utils/` | `namespaces.composables.members` + `children.<key>.members` |
| `composable-helpers.js` | → `common/extensions/` | `COMPOSABLE_FACTORIES` + `COMPOSABLE_MEMBER_ALIASES` |
| `lowcode.js` | `common/config/lowcode.js` | glob 加载；`this.composables`；ref 解包 facade |

### 2.2 运行态

1. `build:lowcode-utils` 按 `composableHelpers` 生成并复制 **`composable-helpers.js`**；
2. `lowcodeWrap` 内对每个 factory 调用一次，挂到 **`global.composables[key]`**；
3. Facade：方法可调用；`ref` / `computed` 读时自动 `.value`；`members[].from` 做别名（如 `copyText` → `copy`）。

### 2.3 设计态

1. 同一 build 写入 `namespaces.composables`；
2. VS Code 插件注入 **`window.TINY_COMPLETION_CONFIG`**；
3. `completion-keywords.ts`：关键字含 `composables`；
4. `completion.ts`：支持 `this.ns.` 与 **`this.ns.child.`**（三级，用于 `composables.countdown.`）。

```text
manifest.composableHelpers
        │
        ▼
 build:lowcode-utils
        │
        ├── completion-utils.json ──► 插件 ──► TINY_COMPLETION_CONFIG
        │                                      this.composables. / .countdown.
        └── composable-helpers.js ──► lowcode.js ──► this.composables.<key>
```

---

## 3. manifest 怎么写

路径：`OAB/lowcode-utils/manifest.json` → **`composableHelpers`**。

```json
{
  "key": "clipboard",
  "enabled": true,
  "composable": "useClipboard",
  "module": "@/composables/useClipboard",
  "members": [
    {
      "name": "copy",
      "signature": "(text: string)",
      "detail": "composable:useClipboard"
    },
    {
      "name": "copyText",
      "from": "copy",
      "signature": "(text: string)",
      "detail": "composable:useClipboard alias→copy"
    }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `key` | Page JS 键：`this.composables.<key>` |
| `enabled` | `false` 则跳过生成 |
| `composable` | 导出函数名，须存在于 `module` |
| `module` | 如 `@/composables/useClipboard` |
| `members` | **必填**：补全三级列表；`from` 可选，运行态别名 |
| ~~`mount`~~ | **已删除**，配置即报错 |

Build 会校验：缺字段、重复 `key`、模块文件不存在、composable 未导出、空 `members`、残留 `mount` → **失败退出**。

---

## 4. 当前白名单（与 manifest 一致）

| `this.composables.*` | 源 | 常用 API |
|----------------------|-----|----------|
| `clipboard` | `useClipboard` | `copy(text)` / `copyText(text)`（别名） |
| `countdown` | `useCountdown` | `startCountdown(interval)`、`remainingTime`、`time` |

### 4.1 Page JS 示例

```js
// 剪贴板
this.composables.clipboard.copy('hello')
// 或别名
this.composables.clipboard.copyText('hello')

// 倒计时：只更新内部值，不会 toast / 自动改 UI
this.composables.countdown.startCountdown('60')
console.log(
  this.composables.countdown.remainingTime,
  this.composables.countdown.time,
)

// 要显示在页面上：写入 state 再绑画布文案
this.state.otpText = this.composables.countdown.time
const id = setInterval(() => {
  this.state.otpText = this.composables.countdown.time
  if (this.composables.countdown.remainingTime <= 0) clearInterval(id)
}, 1000)
```

**注意**

- `startCountdown('60')` 每次调用都会**重置**为 60；连点会看到同样的起始值。
- 紧跟其后的同步 `console.log` 只能看到启动瞬间；要验证递减请 `setTimeout` 或绑 UI。

---

## 5. 补全 JSON 结构

```json
{
  "namespaces": {
    "composables": {
      "members": [
        { "name": "clipboard", "detail": "composable:useClipboard", "signature": "@/composables/useClipboard" },
        { "name": "countdown", "detail": "composable:useCountdown", "signature": "@/composables/useCountdown" }
      ],
      "children": {
        "clipboard": {
          "members": [
            { "name": "copy", "detail": "composable:useClipboard", "signature": "(text: string)" },
            { "name": "copyText", "detail": "composable:useClipboard alias→copy", "signature": "(text: string)" }
          ]
        },
        "countdown": {
          "members": [
            { "name": "startCountdown", "detail": "composable:useCountdown", "signature": "(interval: string)" },
            { "name": "remainingTime", "detail": "composable:useCountdown", "signature": "number (ref)" },
            { "name": "time", "detail": "composable:useCountdown", "signature": "string mm:ss (computed)" }
          ]
        }
      }
    }
  }
}
```

右侧 detail 带 **`composable:useXxx`**，与 `namespaces.utils` 的 `@/utils` 导出区分。

---

## 6. 如何编译 / 验证

在 **OAB 根目录**：

```bash
pnpm run build:lowcode-utils
```

产出：

- `src/lowcode/utils/completion-utils.json`（含 `namespaces.composables`）
- `src/lowcode/utils/composable-helpers.js` → `common/extensions/composable-helpers.js`

**设计器 Console（补全注入）**

```js
!!window.TINY_COMPLETION_CONFIG
window.TINY_COMPLETION_CONFIG?.namespaces?.composables?.members?.map(m => m.name)
window.TINY_COMPLETION_CONFIG?.namespaces?.composables?.children?.countdown?.members?.map(m => m.name)
```

**主工程出码页（运行态）**

```js
typeof this.composables?.clipboard?.copy // 'function'
typeof this.composables?.countdown?.startCountdown // 'function'
this.composables.countdown.startCountdown('60')
setTimeout(() => {
  console.log(this.composables.countdown.remainingTime, this.composables.countdown.time)
}, 3000)
```

改完后：**Reload Extension Host**（补全）；出码预览必要时重启 **`pnpm dev`**。

---

## 7. 新增一项 composable 的最小步骤

1. 确认符合 [§1.3 准入](#13-准入规则比接线更重要)（多数情况应拒绝导出）。
2. 在 `manifest.composableHelpers` 增加一条：`key` / `composable` / `module` / `members`（可选 `from` 别名）。
3. `pnpm run build:lowcode-utils`。
4. 设计器 Reload Host；预览页验证 `this.composables.<key>`。
5. **不要**手改 `composable-helpers.js` / `completion-utils.json`。

---

## 8. 进度与口径

- [x] 统一挂载：`this.composables.<key>`（取消 `mount` 二选一）
- [x] 生成器：`COMPOSABLE_FACTORIES` + `COMPOSABLE_MEMBER_ALIASES`
- [x] 补全：`namespaces.composables` + `children` + 三级解析
- [x] 第一批：`clipboard`、`countdown` 联调通过
- [x] 文档明确：`base` 其余 composable 默认不导入设计器；用 `this.http` / `router` / `stores` / `utils` 覆盖常见能力（见 §1.4）
- [ ] 按业务需要审慎扩白名单（默认仍不导出）

**落地结论**：接线规则唯一——要导出就配 `composableHelpers`，用法永远是 `this.composables.<key>`；扩展时不再判断「进 utils 还是挂一级」。**当前设计器做常见低代码页够用；不必把 `composables/base` 整包导入。**

---

文档维护者：开发团队  
最后更新：2026-08-17（补充 §1.4：为何只导出 clipboard/countdown）
