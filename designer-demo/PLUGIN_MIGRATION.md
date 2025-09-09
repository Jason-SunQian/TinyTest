## TinyEngine 插件迁移方案（v2.7+）

本方案用于将 packages 中官方插件平滑迁移到 `designer-demo` 工程内，以“最少改动、快速可用、可覆盖官方入口、可定制 UI 与国际化”为目标。

---

### 目标
- 保留核心能力：逻辑与行为与官方一致或兼容
- 可快速替换：通过 Registry 覆盖官方入口
- 可本地二开：在 `designer-demo/src` 内管理代码与资源
- 统一国际化：使用 `useDesignerI18n` 钩子，词条集中管理

---

### 迁移原则
1. 入口替换优先：不强求目录完全一致，能覆盖入口即可
2. 尽量零侵入：保留原逻辑、少量适配
3. 类型兜底：必要时使用 `.d.ts` 提供 TS 声明
4. 配置前置：HTTP、i18n 在应用创建前加载

---

### 推荐目录结构（示例：Save 工具栏）
```
designer-demo/src/toolbars/save/
  ├─ Main.vue         # 入口组件（自定义 UI + 逻辑包装）
  └─ js/index.ts      # 逻辑方法（尽量复用官方实现）
```

> 说明：不强制镜像官方 packages 结构，聚焦最小可运行集合；多文件/子组件按需新增。

---

### 注册表覆盖（Registry）
在 `designer-demo/registry.ts` 中直接替换官方 META_APP 入口：
```ts
import { META_SERVICE, META_APP } from '@opentiny/tiny-engine-meta-register'
import CustomSave from './src/toolbars/save/Main.vue'

export default {
  [META_APP.Save]: {
    id: 'engine.toolbars.customSave',
    title: 'Save',
    icon: 'save',
    entry: CustomSave
  }
}
```

> 要点：自定义 ID，避免与官方 ID 冲突；entry 可直接指向 Vue 组件文件。

---

### 国际化策略（强烈推荐）
统一使用 `src/services/i18nService.ts` 提供的钩子：

```ts
import { useDesignerI18n } from '@/services/i18nService'

const { t } = useDesignerI18n()
```

- 词条文件：`src/i18n/zh-CN.json`、`src/i18n/en-US.json`
- 在应用创建前合并词条：
  - `registry.ts` 或 `src/main.ts` 调用 `loadDesignerI18n()`
- 防警告：内部对 `t` 做了 `te(key)` 存在性判断，无词条时不报错

> 说明：TinyEngine 内部仍可能在部分位置调用其内置 `t`；我们方案会优先使用自定义 `t` 并合并词条，兼顾“可控”和“少警告”。

---

### 类型支持（如遇到 TS 报错）
在 `src/types/` 下添加 `.d.ts`：
- `tiny-engine-common.d.ts`：声明 `VueMonaco`、`ToolbarBase`、`handlePageUpdate` 等
- `tiny-engine-meta-register.d.ts`：声明 `useCanvas`、`useMessage`、`META_APP` 等
- `tiny-engine-utils.d.ts`：声明 `constants`

并在 `tsconfig.json` 中包含：
```json
"include": [
  "src/types/**/*.d.ts",
  "registry.ts",
  "src/**/*.ts",
  "src/**/*.vue"
]
```

---

### 迁移步骤（示例：Save 插件）
1. 拷贝官方核心代码到 `src/toolbars/save/`
2. 修正导入：统一从 `@opentiny/tiny-engine-meta-register`、`@opentiny/tiny-engine-common` 导入
3. 引用官方能力：如保存调用 `@opentiny/tiny-engine-common/js/http` 的 `handlePageUpdate`
4. i18n：模板/脚本统一 `const { t } = useDesignerI18n()`；下拉/列表文案使用 `computed` 确保切换生效
5. 注册表替换入口（见上）
6. 本地运行验证：
   - 保存成功/刷新后持久化
   - 语言切换生效
   - 控制台无类型报错

---

### 常见问题与解法
- 引用报红、类型缺失：在 `src/types` 增加 `.d.ts`
- i18n 弹警告：使用 `useDesignerI18n().t`，并在 `loadDesignerI18n()` 合并词条
- 保存失败（mock 环境）：核对接口路由（如 `/app-center/api/pages/update/:id`）与参数结构
- 事件联动：通过 `useMessage().publish/subscribe` 触发/监听（如 `page-saved`）

---

### 迁移清单（Checklist）
- [ ] 入口组件与逻辑就位（`Main.vue`、`js/index.ts`）
- [ ] Registry 覆盖官方入口
- [ ] i18n 词条补齐并合并
- [ ] TS 声明补齐（如需）
- [ ] 保存/刷新/提示验证通过
- [ ] 控制台无阻断性报错

---

### 自动化建议
可编写脚本，将下列操作自动化：
1. 从 `packages` 扫描指定插件，复制核心文件到 `designer-demo/src/{plugins|toolbars}/<name>`
2. 注入/更新 `registry.ts` 的覆盖项（使用自定义 ID）
3. 扫描模板/脚本中的文案，生成 i18n 词条草稿合并至 `src/i18n/*.json`
4. 若检测到 TS 报错关键依赖，生成 `.d.ts` 模板

---

### 参考实现（节选）
- Save 插件：
  - 入口：`src/toolbars/save/Main.vue`
  - 逻辑：`src/toolbars/save/js/index.ts`
  - 入口替换：`registry.ts` `[META_APP.Save]`
  - 保存：`handlePageUpdate(updateParams)`（import 自 `@opentiny/tiny-engine-common/js/http`）

---

### 结语
本方案已在 `Save` 工具栏验证可用，后续迁移其它插件时复用相同流程与钩子，显著降低适配成本并提升一致性。


