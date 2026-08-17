# 主工程 modal 导入思路

> 目的：把主工程 `@/modal` 中**适合 Page JS 的弹窗 API**，以 **`this.modal.<name>`** 白名单注入低代码，并提供设计器补全。  
> 与 `this.utils`（工具）、`this.stores` / `this.appState`（状态）并列，专门承接 OTP / PIN 等鉴权类弹窗。
>
> **关联文档**：[主工程公共能力总结和导入记录](./主工程公共能力总结和导入记录.md)、[主工程低代码资源操作手册](./主工程低代码资源操作手册.md)。

---

## 0. 背景与目标

1. `@/modal` 不在 `@/utils` 里；低代码页若要弹 PIN / OTP，原先没有挂载面。
2. **不要整包** `@/modal`：支付鉴权等优先走 `this.utils.requestPayment`，避免绕开统一支付链路。
3. **当前状态（已落地）**：
   - 挂载面：`this.modal.<name>`
   - 配置：`manifest.modalHelpers`
   - 白名单：`showPinInput`、`showCheckOTP`

---

## 1. 统一约定

| 项 | 约定 |
|----|------|
| Page JS | **`this.modal.<name>`** |
| 语义 | **函数桥**（直接 re-export `@/modal` 白名单函数），不是页级 factory、也不是单例 state |
| 补全一级 | `this.modal` |
| 补全二级 | `this.modal.` → `showPinInput` / `showCheckOTP` |
| 配置 | `manifest.modalHelpers` |
| 产物 | `modal-helpers.js` → `MODAL_BRIDGE`；补全 `namespaces.modal` |

**不要**：

- 整包 `import * from '@/modal'` 挂到 `this`
- 默认导出 `showRequestAuth`（支付鉴权请用 **`this.utils.requestPayment`**）
- 把 modal 塞进 `this.utils`（职责不同：utils 是通用工具；modal 是鉴权弹窗面）

### 与其它挂载面对比

| 维度 | `this.utils` | `this.modal` |
|------|--------------|--------------|
| 真源 | `@/utils` 整包 | **`modalHelpers` 白名单** |
| 典型 | toast / picker / `requestPayment` | `showPinInput` / `showCheckOTP` |
| 支付鉴权 | **优先 `requestPayment`** | 不默认暴露底层 auth modal |

---

## 2. 架构与信息流

```text
manifest.modalHelpers
        │
        ▼
 build:lowcode-utils
        ├── completion-utils.json ──► 插件 ──► this.modal.
        └── modal-helpers.js ──► lowcode.js ──► this.modal.<name>
```

| 交付物 | 位置 | 作用 |
|--------|------|------|
| `completion-utils.json` | `src/lowcode/utils/` | `namespaces.modal.members` |
| `modal-helpers.js` | → `common/extensions/` | `MODAL_BRIDGE` |
| `lowcode.js` | `common/config/lowcode.js` | `Object.defineProperty(global, 'modal', …)` |

---

## 3. manifest 怎么写

路径：`OAB/lowcode-utils/manifest.json` → **`modalHelpers`**。

```json
{
  "name": "showPinInput",
  "enabled": true,
  "module": "@/modal",
  "exportName": "showPinInput",
  "signature": "(options: PinInputOptions)",
  "detail": "modal:showPinInput"
}
```

| 字段 | 说明 |
|------|------|
| `name` | `this.modal.<name>`（通常与 `exportName` 相同） |
| `module` | 一般为 `@/modal`（barrel）；也可指具体子路径 |
| `exportName` | 模块导出函数名 |
| `enabled` | `false` 跳过 |
| `signature` / `detail` | 补全展示 |

Build 校验：缺字段、重复 name、导出不存在 → 失败退出。  
复制目标：`copyModalHelpersTargets` → `extensions/modal-helpers.js`。

---

## 4. 当前白名单

| name | 源 | 说明 |
|------|-----|------|
| `showPinInput` | `@/modal` | PIN / 密码输入弹窗；**最易视觉验证** |
| `showCheckOTP` | `@/modal` | OTP 校验弹窗；会先走发码，需真实业务参数 |

### Page JS 示例

```js
// PIN（推荐 demo / 联调）
const pinRes = await this.modal.showPinInput({
  inputmode: '0', // '0' | '1' 必填
  title: 'Demo PIN',
})
console.log(pinRes) // { role: 'confirm' | 'cancel' | 'action', data? }

// OTP（需真实 type / businessType / maskValue / receiverType 等，会触发发码）
// const otpRes = await this.modal.showCheckOTP({ ... })
```

**默认不进白名单**

| API | 原因 |
|-----|------|
| `showRequestAuth` 等支付鉴权弹窗 | 优先 `this.utils.requestPayment` |

donations **demo**：点 **Show Date** 会先弹 PIN，再打开日期；点列表项会 `console.log` `typeof this.modal.showPinInput / showCheckOTP`。

---

## 5. 如何编译 / 验证

```bash
# OAB 根目录
pnpm run build:lowcode-utils
```

日志中应出现：`modal: showCheckOTP,showPinInput`，并复制 `modal-helpers.js`。

### 设计器补全

1. Reload Extension Host（重读 `completion-utils.json`）
2. Page JS 输入：
   - `this.modal` → 关键字
   - `this.modal.` → `showPinInput` / `showCheckOTP`
3. Console：

```js
window.TINY_COMPLETION_CONFIG?.namespaces?.modal?.members?.map(m => m.name)
// → ['showCheckOTP', 'showPinInput']（顺序以产物为准）
```

### 运行态（主工程预览）

1. `pnpm dev`，打开低代码 demo（如 donations demo / `#/lowcode/...`）
2. 点 **Show Date** → 应出现 PIN 弹窗；确认/取消后 Console 有 `[modal.showPinInput]`，并 toast `role`
3. 点列表项 → Console：`[modal APIs] function function`
4. 或在 Page JS / 调试 Console：

```js
typeof this.modal?.showPinInput // 'function'
typeof this.modal?.showCheckOTP // 'function'
```

> **OTP**：不要在无业务参数时乱点；缺参或发码失败会直接 cancel，且可能打真实发码接口。

---

## 6. 新增一项的最小步骤

1. 确认该函数适合 Page JS，且**没有**更合适的 utils / payment 入口
2. `manifest.modalHelpers` 增加一条（`enabled: true`）
3. `pnpm run build:lowcode-utils`
4. Reload Host + 预览验证
5. **勿手改** `modal-helpers.js` / `completion-utils.json`

### 准入

- Page JS 高频需要直接弹 OTP/PIN；
- 不替代 `requestPayment` 等统一支付链路；
- 白名单保持少而精。

---

文档维护者：开发团队  
最后更新：2026-08-17
