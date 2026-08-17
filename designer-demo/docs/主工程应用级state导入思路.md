# 主工程应用级 state 导入思路

> 目的：把主工程**非 Pinia** 的模块级单例响应式状态，以 **`this.appState.<key>`** 注入低代码 Page JS，并在设计器提供二/三级补全。  
> 与 `this.stores`（业务 Pinia）、`this.composables`（页级 useXxx）并列，专门承接「应用壳 / 跨页轻量单例」。
>
> **关联文档**：[主工程公共能力总结和导入记录](./主工程公共能力总结和导入记录.md)、[主工程低代码资源操作手册](./主工程低代码资源操作手册.md)、[主工程 store 导入思路](./主工程store导入思路.md)、[主工程 composable 导入思路](./主工程composable导入思路.md)。

---

## 0. 背景与目标

1. 主工程除 Pinia 外，存在少量**模块顶层 `ref` + readonly + 受控写方法**的应用壳状态（代表：`mainTabBarVisibility`）。
2. 样例虽少，仍需要**导入通道**：低代码全屏/半屏页常要控主 TabBar 等壳层行为。
3. **当前状态（已落地）**：
   - 挂载面：`this.appState.<key>`
   - 配置：`manifest.appStateWhitelist`
   - 第一项：`mainTabBar` ← `mainTabBarAppState`

---

## 1. 统一约定

| 项 | 约定 |
|----|------|
| Page JS | **`this.appState.<key>`** |
| 实例语义 | **模块单例**（跨页共享同一引用），**不是**每页 `useXxx()` |
| 补全一级 | `this.appState` |
| 补全二级 | `this.appState.` → `mainTabBar` / … |
| 补全三级 | `this.appState.mainTabBar.` → `setVisible` / `visible` / `reset` / … |
| 读写 | 读可解包 ref；写只通过导出 methods |

**不要**：

- 挂到 `this.<key>` 一级（污染根命名空间）
- 塞进 `this.utils`（工具函数面）
- 塞进 `this.composables`（页级工厂语义不同）
- 仅为了低代码把壳层状态强行改成 Pinia（可保留模块单例形态）

### 与 stores / composables 对比

| 维度 | `this.stores` | `this.composables` | `this.appState` |
|------|---------------|--------------------|-----------------|
| 真源 | `storeWhitelist` | `composableHelpers` | **`appStateWhitelist`** |
| 生命周期 | 页内 `useStore()` 实例 | 页内 `useXxx()` 一次 | **进程内单例 export** |
| 典型用途 | 业务域状态 | 剪贴板、倒计时等 | TabBar、壳层 UI 信标 |
| 主工程侧要什么 | 已有 `useXxxStore` | 已有 `useXxx` | **一个可 import 的单例对象**（见下） |

### 主工程是否必须改源码？（规则）

**白名单只能引用「已导出的单例对象」**（`module` + `exportName`）。因此：

| 情况 | 要不要改主工程源码 |
|------|-------------------|
| 模块里**已经有**合适形状的对象（读字段 + 写方法在一起） | **不必**再包一层；manifest 直接指它 |
| 像 TabBar 这样：读是 `mainTabBarVisible` 等 ref，写在 `mainTabBarVisibilityContext` | **需要**加一层薄 facade（如 `mainTabBarAppState`），把读写收成**一个** export，方便 Page JS 与补全 |

所以：`mainTabBarAppState` **是规则的一部分（推荐形态）**，不是生成器魔法；生成器**不会**自动从零散 export 拼对象。

以后扩展同一套路：

1. 主工程具备（或新增）`xxxAppState` 这类单例 export；
2. `appStateWhitelist` 登记 `key` / `module` / `exportName` / `members`；
3. `pnpm run build:lowcode-utils`。

### 零散 export（`mainTabBarHideProgress` 等）能不能也进低代码？

| 符号 | 低代码怎么拿 | 是否再单独挂 `this.appState.xxx` |
|------|--------------|----------------------------------|
| `mainTabBarVisible` | → **`this.appState.mainTabBar.visible`**（facade 已映射） | **否**（重复） |
| `mainTabBarHideProgress` | → **`this.appState.mainTabBar.hideProgress`** | **否** |
| `mainTabBarScrollTracking` | → **`this.appState.mainTabBar.scrollTracking`** | **否** |
| `mainTabBarVisibilityContext` | 方法已收成 `setVisible` / `setHideProgress` / `reset` | **否**（避免两套 API） |
| `createMainTabBarScrollController` | 手写布局滚动用，偏壳层实现 | **默认不进** Page JS |

结论：**能力已经通过 `mainTabBarAppState` 导出给低代码了**；下面那些符号继续给手写 Vue `import` 用即可，不必再各挂一个 `appState` key。

---

## 2. 架构与信息流

| 交付物 | 位置 | 作用 |
|--------|------|------|
| `completion-utils.json` | `src/lowcode/utils/` | `namespaces.appState` + `children` |
| `app-state-helpers.js` | → `common/extensions/` | `APP_STATE_REGISTRY` |
| `lowcode.js` | `common/config/lowcode.js` | `this.appState` + ref 解包 facade |

```text
manifest.appStateWhitelist
        │
        ▼
 build:lowcode-utils
        ├── completion-utils.json ──► 插件 ──► this.appState. / .mainTabBar.
        └── app-state-helpers.js ──► lowcode.js ──► this.appState.<key>
```

主工程侧需导出**稳定单例对象**（示例已有）：

```ts
// src/shared/main/utils/mainTabBarVisibility.ts
export const mainTabBarAppState = {
  visible,       // Readonly<Ref<boolean>>
  hideProgress,
  scrollTracking,
  setVisible(visible: boolean) { ... },
  setHideProgress(progress: number) { ... },
  reset() { ... },
};
```

---

## 3. manifest 怎么写

路径：`OAB/lowcode-utils/manifest.json` → **`appStateWhitelist`**。

```json
{
  "key": "mainTabBar",
  "enabled": true,
  "module": "@/shared/main/utils/mainTabBarVisibility",
  "exportName": "mainTabBarAppState",
  "members": [
    { "name": "visible", "signature": "boolean", "detail": "appState:mainTabBar" },
    { "name": "setVisible", "signature": "(visible: boolean)", "detail": "appState:mainTabBar" },
    { "name": "reset", "signature": "()", "detail": "appState:mainTabBar" }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `key` | `this.appState.<key>` |
| `exportName` | 模块导出的单例对象名 |
| `module` | `@/…` 路径 |
| `members` | 补全三级列表 |
| `enabled` | `false` 跳过 |

Build 校验：缺字段、重复 key、文件/导出不存在、空 members → 失败退出。  
复制目标：`copyAppStateHelpersTargets` → `extensions/app-state-helpers.js`。

---

## 4. 当前白名单

| key | 源 export | 常用 API |
|-----|-----------|----------|
| `mainTabBar` | `mainTabBarAppState` | `setVisible` / `reset` / `visible` / `hideProgress` / `scrollTracking` |

### Page JS 示例

```js
// 隐藏主 TabBar（全屏 / 半屏低代码页）
this.appState.mainTabBar.setVisible(false)
console.log(this.appState.mainTabBar.visible) // false

// 恢复
this.appState.mainTabBar.reset()
// 或
this.appState.mainTabBar.setVisible(true)
```

donations **demo** 页：`Show Pop` 会 `setVisible(false)`；`Show Dialog` 会 `reset()`。

---

## 5. 如何编译 / 验证

```bash
# OAB 根目录
pnpm run build:lowcode-utils
```

### 设计器补全

1. Reload Extension Host（让插件重读 `completion-utils.json`）
2. Page JS 输入：
   - `this.appState` → 应出现关键字
   - `this.appState.` → `mainTabBar`
   - `this.appState.mainTabBar.` → `setVisible` / `visible` / `reset` …
3. Console：

```js
window.TINY_COMPLETION_CONFIG?.namespaces?.appState?.members?.map(m => m.name)
window.TINY_COMPLETION_CONFIG?.namespaces?.appState?.children?.mainTabBar?.members?.map(m => m.name)
```

### 运行态（主工程预览，需能看到主 TabBar）

1. `pnpm dev`（或已有预览）打开带主 TabBar 的低代码 demo 页（如 `#/lowcode/lowcode-demo`）
2. 点 **Show Pop** → 底栏应隐藏；Console 有 `[appState.mainTabBar] false`
3. 点 **Show Dialog** → 底栏应恢复；Console 有 `reset` / `true`

> 设计器画布内嵌预览若**没有**主 TabBar，补全仍可验；**显隐效果**请在主工程带壳预览中看。

---

## 6. 新增一项的最小步骤

1. 主工程实现模块单例 + 导出 `xxxAppState`（readonly 读 + methods 写）
2. `manifest.appStateWhitelist` 增加一条
3. `pnpm run build:lowcode-utils`
4. Reload Host + 预览验证
5. **勿手改** `app-state-helpers.js` / `completion-utils.json`

### 准入

- 确需跨页 / 壳层共享，且不适合进 Pinia；
- API 受控（禁止对外暴露可写内部 `*State`）；
- 白名单保持少而精。

---

## 7. 进度

- [x] `appStateWhitelist` + 生成器 + `APP_STATE_REGISTRY`
- [x] `lowcode.js` → `this.appState` + facade
- [x] 补全 `namespaces.appState` + 关键字 `appState`
- [x] 第一项 `mainTabBar` + demo 页调用
- [ ] 按需扩白名单（默认保持个位数）

---

文档维护者：开发团队  
最后更新：2026-08-17（首次落地 mainTabBar）
