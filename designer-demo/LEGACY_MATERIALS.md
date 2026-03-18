## 物料相关代码梳理与 Legacy 标记

> 本文只做**梳理与标记**，不代表立刻删除任何代码。  
> 真正删除 / 挪动前，请先在团队内评审确认。

### 1. 总体思路

- **事实来源在主工程**：真实业务组件与设计时兼容版组件的产出逻辑，以 `mobilebanking/lowcode-materials` 目录及其中的 `DESIGN_TIME_COMPAT.md`、`README.md` 为最新来源。
- **designer-demo 侧更多是「宿主 + Demo」**：这里的物料相关代码，主要用来承载 VSCode 插件里的「物料中心」界面，以及早期本地构建 / mock 流程的 Demo。
- **这份文档的目标**：标出哪些是**仍在使用的代码**，哪些是**旧流程遗留 / Demo**，后者未来可以逐步迁移到 `legacy/` 或删除。

---

### 2. 仍然需要长期保留的部分

这些目录 / 文件支撑了现在的 VSCode 物料中心插件与画布集成，暂时视为**现行代码**，不作为删除候选。

- **`src/plugins/materials/**`**
  - 作用：VSCode 插件侧「物料中心」主界面、元数据面板、物料列表等 UI 与逻辑。
  - 包括：
    - `src/plugins/materials/Main.vue`
    - `src/plugins/materials/meta/**`
    - `src/plugins/materials/composable/**`
    - `src/plugins/materials/mcp/**`
    - `src/plugins/materials/styles/vars.scss`
  - 说明：这些代码负责**如何展示/操作物料**，与「物料是从哪里构建出来的」解耦，仍然需要。

- **文档（已在上一轮更新过）**
  - `docs/业务与原子组件导入方案.md`：章节 10–12 描述的是**目标架构**，1–9 已被标记为历史流程参考。
  - `docs/MATERIALS_ISSUES_AND_EXPECTATIONS.md`：历史问题与期望记录，用于排查物料加载问题。

> 后续如果 VSCode 插件整体重构，可以再考虑精简 `src/plugins/materials/**`，但与本次「旧流程清理」不是一批动作。

---

### 3. 明确是旧流程 / Demo 的部分（候选 legacy）

这些目录与脚本对应的是**设计器本地构建物料的老路线**：  
现在主工程已经通过 `lowcode-materials` 产出物料包，再由设计器加载，**不再建议沿用这里的构建产线**。

#### 3.1 旧版物料源码目录：`materials-src/**`

- 路径：`designer-demo/materials-src/**`
- 特征：
  - 包含各类 `mp-*` 组件的 Vue 源码与入口：
    - `materials-src/mp-input/**`
    - `materials-src/mp-account-input/**`
    - `materials-src/mp-account-picker/**`
    - `materials-src/mp-date-input/**`
    - `materials-src/mp-date-picker/**`
    - `materials-src/mp-cell/**`
    - `materials-src/mp-card/**`
    - `materials-src/mp-image/**`
    - `materials-src/mp-progress/**`
    - `materials-src/mp-empty/**`
    - `materials-src/mp-icon/**`
    - `materials-src/mp-tags/**`
    - `materials-src/mr-components.js`
  - 对应的是**「设计器自己构建业务物料」**的时期，用本地 `materials-src` + `vite.materials.config.ts` 打包出一个物料 bundle。
- 当前建议：
  - 标记为：**旧版物料源码，仅做历史参考 / Demo**。
  - 新增后续 TODO：
    - \[TODO] 为这些组件找「对应的主工程物料」并在注释 / 文档中互相链接。
    - \[TODO] 将整个 `materials-src/` 迁移到 `legacy/materials-src/` 目录，仅保留少数 Demo 组件。

#### 3.2 旧版物料构建产物（本地 mock）：`public/mock/materials/**`

- 路径：`public/mock/materials/**`
- 特征：
  - 包含各种 `mp-*` 的打包 JS / CSS：
    - 如 `public/mock/materials/mp-input.js`
    - `public/mock/materials/mp-account-input.js`
    - `public/mock/materials/mp-card.js`
    - `public/mock/materials/mp-image.js`
    - 以及 `_plugin-vue_export-helper-*.js` 等。
  - 本质上是**通过旧的 `materials-src` 构建出来的 demo 物料包**，方便本地快速预览。
- 当前建议：
  - 标记为：**本地 Mock 物料产物**，不再作为正式来源。
  - 新增后续 TODO：
    - \[TODO] 在相关 README 或注释里写明：真实物料请使用主工程 `lowcode-materials` 构建出来的 bundle。
    - \[TODO] 将 `public/mock/materials/` 迁到 `public/legacy-materials/` 或在未来统一清理。

#### 3.3 旧版物料清单与生成脚本：`mock/**` 与 `scripts/**`

- **`mock/materials-manifest.json`**
  - 旧版本地物料清单，用来描述 `public/mock/materials/` 里有哪些组件。
  - 建议标记为：**旧版 Mock 清单**。

- **`mock/business-materials.json`**
  - 旧版业务物料列表 Demo，用于配合 VSCode 插件 / 物料中心演示。
  - 建议标记为：**业务物料 Demo 配置**，未来可迁往 `mock/legacy-business-materials.json`。

- **`scripts/generate-business-materials.cjs`**
  - 用于从旧的 `materials-src` 生成业务物料 JSON / manifest 的脚本。
  - 现有主工程已经在 `mobilebanking/lowcode-materials` 内有自己的 manifest 与构建流程，本脚本仅用于旧 Demo。

- **`scripts/get-material-entries.js`**
  - 为旧版物料构建抓取 `materials-src` 入口的脚本。

- **`scripts/validate-business-materials.cjs`**
  - 校验旧版业务物料 JSON 的脚本。

- 当前建议：
  - 以上脚本统一标记为：**旧版物料构建/校验脚本，仅用于本地 Demo**。
  - 新增后续 TODO：
    - \[TODO] 新增一个 `scripts/LEGACY_README.md` 或在本文件中附录详细用途。
    - \[TODO] 未来整体迁移到 `scripts/legacy/` 目录。

#### 3.4 旧版物料专用 Vite 配置：`vite.materials.config.ts`

- 作用：配合 `materials-src/**` 打包出旧版物料 bundle。
- 当前建议：
  - 标记为：**旧流程专用 Vite 配置，不再推荐使用**。
  - 新增后续 TODO：
    - \[TODO] 在文件头部添加注释：推荐参考主工程 `mobilebanking/lowcode-materials` 的 Vite 构建。

---

### 4. 建议的后续迁移步骤（仅规划）

> 这一节是**行动建议**，可以在未来按优先级逐步执行。

- **步骤 1：加注释，不改行为**
  - 在下列文件头部添加简短注释，指向本 `LEGACY_MATERIALS.md`：
    - `materials-src/**` 入口文件（各组件 `index.js`）
    - `public/mock/materials/style.css` 及各 `mp-*.js`
    - `mock/materials-manifest.json`、`mock/business-materials.json`
    - `scripts/generate-business-materials.cjs`
    - `scripts/get-material-entries.js`
    - `scripts/validate-business-materials.cjs`
    - `vite.materials.config.ts`

- **步骤 2：物理隔离到 `legacy/` 目录**
  - 新建 `designer-demo/legacy/` 目录，将下列路径整体迁移进去：
    - `materials-src/**`
    - `public/mock/materials/**`
    - 与旧流程强相关的脚本：`scripts/generate-business-materials.cjs` 等。
  - 迁移时仅改路径，不改实现逻辑；VSCode 插件如有引用，可统一更新 import。

- **步骤 3：按实际使用情况渐进删除**
  - 在迁移到 `legacy/` 之后，通过搜索 / 日志确认是否还有工具链在使用这些代码。
  - 如果连续一段时间（例如 1–2 个版本）均未使用，可考虑删除部分 Demo / 脚本，减少噪音。

---

### 5. 如何在日常开发中使用这份文档

- **新增物料相关代码时**：
  - 如果是为了服务**主工程产出的物料包**（例如 VSCode 物料中心 UI 逻辑），尽量放在 `src/plugins/materials/**` 并补充到主工程文档。
  - 如果只是本地 Demo / 实验代码，请放到未来的 `legacy/` 区域，并在注释中说明用途。

- **看到 `materials-src/**` 或 `public/mock/materials/**` 时**：
  - 默认把它们当作「历史 Demo」，而不是正式物料来源。
  - 遇到业务需求时，优先去主工程 `lowcode-materials` 里看真实实现与设计时兼容版组件。

