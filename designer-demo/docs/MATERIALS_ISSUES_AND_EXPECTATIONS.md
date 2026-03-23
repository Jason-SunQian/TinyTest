# 物料加载：历史问题记录与预期效果

> **重要说明（2025 起）**：
>
> -   当前推荐的物料产出与设计时兼容方案，已收敛到各主工程仓库的 `lowcode-materials/README.md` 和 `lowcode-materials/DESIGN_TIME_COMPAT.md`。
> -   本文主要保留为 **VSCode 插件中物料加载问题的历史排查记录**，用于定位和回顾曾经的 bug 与相关代码位置。
> -   阅读本文时，请以主工程的最新实现为准，文中部分“未解决问题”“后续方向”可能已在后续迭代中修复。

本文档记录在 **VSCode 插件中打开设计器** 时，物料（Materials）相关的历史问题、根因说明，以及曾经期望达成的效果。便于后续从文档出发做有目标的修复，避免在代码中反复打补丁。

---

## 一、预期效果

1. **在 VSCode 插件中打开设计器后**

    - 左侧物料面板能正常展示物料列表（mock 的 56 个组件 + 主工程 bundle 中的业务组件，如 MpAccountInput 等）。
    - 仅展示**一套**组件，无重复、无多套相同列表。

2. **拖拽业务组件（如 MpAccountInput）到画布后**

    - 画布能正确渲染该组件，不出现「区块 MpAccountInput 加载错误」。
    - 控制台不出现「block 未在已加载物料中找到: label= MpAccountInput」类报错。

3. **物料拉取逻辑**

    - 设计器能按 `engine.config.material`（如 `/mock/bundle.json`、`http://localhost:3000/bundle.json`）拉取并合并物料。
    - 主工程通过 `http://localhost:3000` 提供 `bundle.json` 时，设计器能成功请求并注册其中的组件。

4. **与 registry 的约定**
    - 不通过修改 `registry.ts` 的插件入口或显式覆盖 `engine.service.resource` / `engine.service.material` 来实现上述效果（该文件负责设计器各插件入口，包括物料插件，且已为国际化迁移做过调整，见 `docs/PLUGIN_MIGRATION.md`）。

---

## 二、当前未解决的问题

### 2.1 插件环境下物料面板为空或拉取未触发

-   **现象**：在插件里打开设计器后，左侧物料面板为「暂无数据」，或长时间无物料展示。
-   **可能原因**：
    -   物料拉取依赖 `useResource().fetchResource()`，而 `fetchResource` 的调用来自 `packages/design-core/src/App.vue` 中对 `useCanvas().isCanvasApiReady` 的 watch；在插件/iframe 场景下 **`isCanvasApiReady` 可能一直不为 true**，导致 `fetchResource` 从未执行，进而 `fetchMaterial` 也未执行。
    -   或：`fetchResource` 内先执行 `fetchAppState()`（请求 `/app-center/v1/api/apps/schema/${id}`）；在插件环境下无有效 `id` 或接口不可用时 **`fetchAppState` 抛错**，packages 的 `fetchResource` 未做 try/catch，导致后续 `fetchMaterial()` 不执行，物料列表为空。

### 2.2 主工程 bundle 中的组件（如 MpAccountInput）在设计器中找不到

-   **现象**：拖拽 MpAccountInput 等主工程组件到画布后，出现「区块 MpAccountInput 加载错误」；控制台报「block 未在已加载物料中找到: label= MpAccountInput，将走插件代理…」。
-   **可能原因**：
    -   设计器实际使用的 `useMaterial` 来自 packages，其 `getMaterialsRes` 对所有 URL 使用 `Http.get(url)`；对 `http://localhost:3000/bundle.json` 在插件/代理环境下可能未正确请求或返回格式不一致，导致主工程 bundle 未被加入 materialState。
    -   或：物料虽被拉取，但组件注册时的 `label`/`component` 与画布解析时使用的名称不一致，导致按 label 查找失败。

### 2.3 多套组件 / 重复列表

-   **现象**：物料面板中同一批组件出现两套、三套重复列表。
-   **可能原因**：
    -   `fetchMaterial()` 被多次触发（例如画布就绪触发一次 `fetchResource`，另有保底逻辑再次触发 `fetchMaterial` 或 `fetchResource`），每次都会 `addMaterials` 追加到同一 materialState，造成重复展示。
    -   若在保底中既调 `fetchResource()` 又单独调 `fetchMaterial()`，或与画布就绪的触发叠加，会放大重复次数。

### 2.4 控制台 Vue i18n 警告

-   **现象**：`[Vue warn]: injection "Symbol(global-vue-i18n)" not found.`，堆栈涉及 CanvasContainer、Main 等。
-   **说明**：与画布/物料面板的国际化注入有关，可能影响部分文案或组件行为，但与「物料是否加载成功」无直接一一对应关系；可作为独立问题后续处理。

---

## 三、相关代码位置（便于还原与排查）

-   **物料拉取入口**：`packages/design-core/src/App.vue` 中 `watch(useCanvas().isCanvasApiReady, …)` → `useResource().fetchResource()`。
-   **fetchResource 实现**：
    -   packages：`packages/plugins/materials/src/composable/useResource.ts`（无 fetchAppState 容错，抛错即不执行 fetchMaterial）。
    -   designer-demo 自定义：`designer-demo/src/plugins/materials/composable/useResource.ts`（有 fetchAppState try/catch，但通过 registry 覆盖后曾导致面板用错 materialState，已不再通过 registry 覆盖）。
-   **fetchMaterial / addMaterials**：
    -   packages：`packages/plugins/materials/src/composable/useMaterial.ts`（getMaterialsRes 使用 Http.get；addMaterials 为追加）。
    -   designer-demo：`designer-demo/src/plugins/materials/composable/useMaterial.ts`（对 http(s) URL 使用原生 fetch，并含更多日志）。
-   **画布就绪**：`packages/canvas/DesignCanvas/src/api/useCanvas.ts` 中 `isCanvasApiReady`；在 `DesignCanvas.vue` 中初始化完成后置为 true。
-   **registry**：`designer-demo/registry.ts`（插件入口与 engine.config；**不建议**为修物料而显式覆盖 `engine.service.resource` / `engine.service.material`，以免影响插件迁移与国际化）。

---

## 四、建议的后续方向（不写补丁，仅作记录）

1. **根因确认**：在插件环境下用日志或断点确认 `isCanvasApiReady` 是否会变为 true，以及 `fetchResource` / `fetchMaterial` 是否被调用、调用次数。
2. **单一触发源**：若需「保底」拉取物料，应保证全链路只触发**一次** `fetchMaterial`（或只在一处做 addMaterials），避免多处、多次触发导致多套组件。
3. **主工程 bundle**：确认在插件环境下，对 `http://localhost:3000/bundle.json` 的请求由谁发起（Http 服务还是原生 fetch）、返回结构是否为 `{ materials }` 或 `{ data: { materials } }`，以及是否成功写入当前使用的 materialState。
4. **registry 与 hook**：不通过 registry 覆盖 resource/material 的前提下，若希望使用 designer-demo 的 fetchMaterial 逻辑（含对 http(s) 的 fetch 与容错），需另寻方式（例如在合适生命周期中直接调用 designer-demo 的 fetchMaterial 并将结果通过现有 hook 的 addMaterials 写入），且需避免与画布就绪触发重复。

---

_文档更新时间：按当前代码还原后的状态记录。_
