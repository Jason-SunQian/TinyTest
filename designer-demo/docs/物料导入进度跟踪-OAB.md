# OAB 主工程物料导入进度跟踪

> 统计 **OAB** 主工程源码中使用的 `<mr-*` / `<mp-*` 组件，对照 `lowcode-materials/manifest.json` 已登记物料，跟踪设计器导入缺口。  
> 参考文档：[物料导入进度跟踪.md](./物料导入进度跟踪.md)（原 **mobilebanking** 主工程）。  
> 数据来源：OAB `src/`（**排除** `src/lowcode/`）标签扫描 + `lowcode-materials/manifest.json`。  
> 统计日期：**2026-08-25**（初稿 2026-07-22）。主工程路径：`/Users/mac/Desktop/Project/2025/OAB`。

---

## 一、背景与读法

1. 设计器物料最初在 **mobilebanking** 上导入联调，后切换到 **OAB** 作为主工程。OAB 的 `lowcode-materials` 大体延续了原工程已测物料，并新增了部分 OAB 业务物料（如 `MpTextAmt`、`MpDonationPayAccountSwiper`、`MpPage`）。
2. 本文只回答：**OAB 业务源码里用到了哪些组件、哪些已进设计器、用低代码继续开发 OAB 时优先补哪些。**
3. 「使用次数」为模板标签出现次数（含骨架重复），用于**优先级参考**，不是独立页面数。  
   **排除 `src/modules/example/`（及同类 demo/showcase 页）后的业务引用次数**才作为导入优先级依据；若标签**仅出现在 example/demo**，即使次数 > 0，也视为**无业务刚需**，优先级降至最低（见 §4.2 **P4**），勿与真实业务模块混排。
4. 设计器内置根节点 `Page` 与物料 **`MpPage`** 不是同一概念：拖入 `MpPage` 可在面板配置 `title` / `bgColor` 等；出码后处理会保证模板根为 `<mp-page>`（未拖时也会把根 `div` 改成 `mp-page`）。
5. **不导入判定原则（2026-08-25）**：凡符合下列任一情形，**暂时标记为「不导入」**，不进入待办队列——画布上一般**不需要单独拖拽**；设计器展示的是**父组件**或**加载它的完整业务组件**即可：
   - **子件 / 内部壳**：仅作为某父组件 template 的一部分（如 `mp-popup-container` 之于 `mp-popup`，`mp-account-item` 之于 `mp-account-picker`）。
   - **已有物料可组合替代**：功能可由已导入父组件 + 现有行展示/按钮拼出（如 `mp-summary-popup` → `MpPopup` + `MpTextAmt` + `MrButton`，参考 donations-confirm）。
   - **父组件已导入、子件随运行态带出**：如 `mp-account-picker` 随 **`MpAccountInput`** 出码一并存在，不必再立物料。
   - **框架 / 应用级**：`modalController` 弹窗、`mr-app` / `mr-router-outlet` 等，非页面搭建物料。
   - **别名或业务侧已有等价物**：如 `mr-image`→`MrImg`、`mr-input`→`MpInput`、`mr-textarea`→`MpTextarea`、`mr-date-picker`→`MpDateInput` 等。
   - **无运行态源码 / legacy**：如 `mp-skeleton`、`mp-date-picker-legacy`。

   完整清单见 **§3.3（mr）**、**§4.2「不导入」表**、**§4.3（废弃）**。真正「待评估是否导入」的，以 **§4.2 P3 / P4 及 §3.2 低频 mr** 中**未**列入不导入表的为准。

---

## 二、进度总览

| 分类 | OAB 源码使用（去重标签） | 已导入且被使用 | 已导入（manifest） | 待评估导入 | 不导入¹ |
| ---- | ------------------------ | -------------- | ------------------ | ---------- | ------- |
| **原子组件 (mr-)** | 55 | 41 | 41 | 8 | 15 |
| **业务组件 (mp-)** | 71 | 50 | 57 | 约 8 | 9 |
| **合计** | 126 | 91 | **98** | **约 16** | **24** |

¹ **不导入**含：框架/应用级、子件与内部壳、父组件已覆盖、别名等价物、legacy/无源码。见 §一.5。

与 [mobilebanking 跟踪文档](./物料导入进度跟踪.md) 对比（该文档待导入业务约 9～11 个）：

| 差异 | 说明 |
| ---- | ---- |
| **待评估导入（约 18）** | 源码有用、manifest 仍缺，且**未**归入「不导入」：mr 低频 + mp **P3 业务**；**不含**仅 example 的 P4 |
| donations 主工程已覆盖 | 列表/表单/确认页用到的组件均已导入且联调可用 |
| **不导入（24）** | 子件/内部壳/框架/别名/legacy，画布不单独拖拽；见 §一.5、§3.3、§4.2 |
| manifest | **98** 个物料；`MpGsBlur` / `MpAgreementContent` **已联调可用**；`mp-bank` 不导入（2026-08-26） |

---

## 三、原子组件 (mr-)

### 3.1 已导入（OAB manifest 已有）

与 mobilebanking 侧已测清单基本一致，包括但不限于：

`mr-divider`、`mr-img`、`mr-segment` / `mr-segment-button`、`mr-label`、`mr-button`、`mr-skeleton-text`、`mr-infinite-scroll`(+content)、`mr-header` / `mr-toolbar` / `mr-buttons` / `mr-back-button` / `mr-title`、`mr-content`、`mr-footer`、`mr-searchbar`、`mr-refresher`(+content)、`mr-progress-bar`、`mr-spinner`（**已联调可用**）、`mr-slider`（**已联调可用**）、`mr-switch`、`mr-collapse`(+item)、`mr-item` / sliding / options / option、`mr-accordion-group` / `mr-accordion`、`mr-radio-group` / `mr-radio`、`mr-checkbox-group` / `mr-checkbox`、`mr-reorder-group` / `mr-reorder`、`mr-cell-group` / `mr-cell`、`mr-toggle`、`mr-form`、`mr-field`（物料保留，业务侧更推荐 `mp-input`）。

> 联调结论与画布桩经验仍以 [物料导入进度跟踪.md](./物料导入进度跟踪.md)「五、导入经验」及《组件导入注意事项》为准；换主工程后建议对 OAB 主题 token / 出码链路做抽样回归，不必重复全量导入。

### 3.2 待评估导入（低频 mr，画布可能单独用到）

| 组件 | 约使用次数 | 建议 | 说明 |
| ---- | ---------- | ---- | ---- |
| ~~mr-slider~~ | 5 | — | **已联调可用**（2026-08-25），见 §3.1 |
| mr-form-renderer | 4 | 低 | 动态表单渲染，场景窄 |
| mr-tabs | 2 | 低 | |
| mr-menu / mr-menu-button | 2 / 1 | 低 | |
| mr-badge | 1 | 低 | |

> `mr-spinner` 已联调可用。下列已归入 **§3.3 不导入**，不再重复评估：`mr-picker-vant`、`mr-modal`（框架 modal）、`mr-input`（用 `MpInput`）、`mr-date-picker` / `mr-datetime`（用 `mp-date-*`）、`mr-textarea`（用 `MpTextarea`）。

### 3.3 不导入 — 框架级 / 别名 / 已有等价物（mr）

| 组件 | 约使用次数 | 类型 | 原因 |
| ---- | ---------- | ---- | ---- |
| mr-page | 7 | 框架 | 页面容器已用 **mp-page** |
| mr-app | 1 | 框架 | 应用根节点 |
| mr-router-outlet | 4 | 框架 | 路由出口 |
| mr-image | 8 | 别名 | 同 **mr-img**（`MrImg` 已导入） |
| mr-progress | 3 | 别名 | 同 **mr-progress-bar**（已导入） |
| mr-input | 3 | 等价物 | 业务以 **MpInput** 为主 |
| mr-textarea | 1 | 等价物 | 业务以 **MpTextarea** 为主 |
| mr-date-picker / mr-datetime | 1 / 1 | 等价物 | 业务以 **mp-date-*** 为主 |
| mr-modal | 5 | 框架内部 | `modalController` 等框架弹窗；低代码页用 **MpPopup** / **MpDialog** |
| mr-picker-vant | 5 | 框架内部 | 框架 picker modal 内部；低代码用各类 **mp-*-input** |

---

## 四、业务组件 (mp-)

### 4.1 已导入（OAB manifest）

#### 4.1.1 自 mobilebanking 延续（抽样联调结论见原跟踪文档）

| 组件 | 约使用次数 | 设计器名称 |
| ---- | ---------- | ---------- |
| mp-icon | 524 | Icon |
| mp-input | 394 | Input |
| mp-image | 136 | Image |
| mp-cell | 127 | Cell |
| mp-empty | 103 | Empty |
| mp-avatar | 74 | Avatar |
| mp-multi-amt | 56 | Multi Amt |
| mp-dict-input | 51 | Dict Input |
| mp-block | 42 | Block |
| mp-accept-agreement | 33 | Accept Agreement |
| mp-date-input | 32 | Date Input |
| mp-country-input | 29 | Country Input |
| mp-textarea | 26 | Textarea |
| mp-account-input | 25 | Account Input |
| mp-mobile-input | 25 | Mobile Input |
| mp-city-input | 23 | City Input |
| mp-dict-text | 22 | Dict Text |
| mp-card | 17 | Card |
| mp-input-content | 17 | Input Content |
| mp-tags | 16 | Tags |
| mp-result | 13 | Result |
| mp-back-button | 11 | Back Button (MP) |
| mp-date-picker | 6 | Date Picker |
| mp-bank-input | 5 | Bank Input |
| mp-pdf | 5 | PDF |
| mp-agreement-button | 2 | Agreement Button |
| mp-select-list | 2 | Select List |
| mp-progress | — | Progress |

#### 4.1.2 OAB 新增已导入

| 组件 | 约使用次数 | 设计器名称 | 说明 |
| ---- | ---------- | ---------- | ---- |
| **mp-text-amt** | 104 | Text Amt | 金额展示；donations confirm 等强依赖，见《组件导入注意事项》MpTextAmt |
| **mp-donation-pay-account-swiper** | 1（业务）/ 低代码 donations | Donation Pay Account Swiper | 捐赠付款账户横滑；专为 donations 低代码 |
| **mp-page** | 406 | Page | **已联调可用**（2026-07-22）。画布 `mp-page-designer.vue`（标题绝对居中）；可配 `title` / `bgColor` / `hideHeader` / `hideBackButton` / `translucent` / `scrollY` / `scrollEvents`；插槽与运行态对齐；出码 `<mp-page>`。**勿与设计器内置根节点 `Page` 混淆**。出码后处理：拖入时去掉外层 `div`；未拖时仍把根 `div` 改写为 `mp-page`。 |
| **mp-container** | 52 | Container | **已联调可用**（2026-07-22）。画布 `mp-container-designer.vue`（浅底 `thirdly-50` + `border-200` + `rounded-12px`）；无业务 props；`onClick` + default 插槽；样式用 Others → Class Name（如 `mt-16px p-16px`）。 |
| **mp-popup** | 48 | Popup | **已联调可用**（2026-07-22）。画布 `mp-popup-designer.vue` 始终展开底部面板（不跟 `show` 隐藏）；拖拽自动 `state.mpPopupN` + `v-model:show`；props：`title` / `show` / `fixHeight` / `hideHeader`；插槽 default / title / sub-title / sub-header / footer。画布样式对齐运行态：`text-h2`/`font-medium`、无标题分割线、24px 关闭图标、toolbar 顶距（`mt-8px` + 44px 行高居中）。 |
| **mp-dialog** | 8 | Dialog | **已联调可用**（2026-07-22）。画布 `mp-dialog-designer.vue` 始终展开居中卡片；拖拽自动 `state.mpDialogN` + `v-model:show`；props：`title` / `show` / `showCloseBtn`；插槽 default / header / header-start / footer。画布样式对齐运行态：`text-h1`/`font-heavy`、宽约 78%、圆角 10px、左右 24px、内容自适应高度、24px 关闭图标。 |
| **mp-single-amt** | 38 | Single Amt | **已联调可用**（2026-07-23）。画布 `mp-single-amt-designer.vue`（展示态）；双 `defineModel` → `state.mpSingleAmtFormN.{amount,ccy}`；画布样式对齐运行态：无额外横向 inset、吃 `van-cell-vertical-padding`、label 用 MrField 15px token、OMR 按 `mp-text-amt` `1em`/`h2`。详见《组件导入注意事项》**MpSingleAmt 迁移经验**。 |
| **mp-date-popup** | 23 | Date Popup | **已联调可用**（2026-07-23）。画布 `mp-date-popup-designer.vue`（始终展开 + 滚轮占位）；三绑定 `visible/date/endDate`；预览打开需 `visible=true`；`date`/`endDate` 须为 `Date` 或 `null`（禁止 `""`）。 |
| **mp-linked-account-input** | 13 | Linked Account Input | **已联调可用**（2026-07-23）。画布 `mp-linked-account-input-designer.vue`；无横向 inset；底部分割线在 cell padding 之后；箭头 `icon-fourth`；`v-model` → `state.mpLinkedAccountInputN`（对象 `{}`）。 |
| **mp-pin-input-simple** | 18 | Pin Input Simple | **已联调可用**（2026-07-23）。画布 `mp-pin-input-simple-designer.vue`（input / grid + 按住窥视眼睛）；`v-model:uid` → `state.mpPinInputSimpleUidN`（字符串 `''`，非 PIN 明文）；必填 `inputmode`（`0`/`1`）。 |
| **mp-code-input** | 11 | Code Input | **已联调可用**（2026-07-23）。画布 `mp-code-input-designer.vue`（方格 + 光标）；`v-model` → `state.mpCodeInputN`（`''`，snippet 勿写死演示码）；`length` / `mask` / `error`。 |
| **mp-pin-input** | 8 | Pin Input | **已联调可用**（2026-07-23）。画布 `mp-pin-input-designer.vue`（input 掩码点 / grid `max-w-50px`，无眼睛）；`v-model:uid` → `state.mpPinInputUidN`；依赖原生安全键盘；与 `MpPinInputSimple` 区分。 |
| **mp-branch-input** | 6 | Branch Input | **已联调可用**（2026-07-23）。画布 `mp-branch-input-designer.vue`；对齐 `mp-input`（无横向 inset、分割线在 cell padding 后、箭头 `icon-fourth`）；`v-model` → `state.mpBranchInputN`（分行号字符串）。 |
| **mp-uploader** | 8 | Uploader | **已联调可用**（2026-07-23）。画布 `mp-uploader-designer.vue`（上传区 bg-200 / h-134px）；双绑定 `fileId`/`name` → `state.mpUploaderFormN`；snippet 勿写死演示 id。 |
| **mp-multi-uploader** | 12 | Multi Uploader | **已联调可用**（2026-07-23）。画布 `mp-multi-uploader-designer.vue`（68px 缩略图 + 60x60 添加格）；`v-model` → `state.mpMultiUploaderN`（`[]`）；snippet 勿写死演示文件。 |
| **mp-account-cards** | 11 | Account Cards | **已联调可用**（2026-07-23）。画布 `mp-account-cards-designer.vue`（静态卡 + peek，无 paymentStore / Swiper）；三绑定 `v-model` / `v-model:ccy` / `v-model:balance` → `state.mpAccountCardsFormN.{account,ccy,balance}`（`account:{}`，`ccy/balance:''`）；snippet 勿写死演示账户；`sceneType` 必填。 |
| **mp-ccy-input** | 4 | Ccy Input | **已联调可用**（2026-07-23）。画布 `mp-ccy-input-designer.vue`（对齐 mp-input：无横向 inset、分割线在 cell padding 后、箭头 icon-fourth）；`v-model` → `state.mpCcyInputN`（`''`）；画布点击轮换 OMR/USD/EUR；snippet 勿写死演示币种。 |
| **mp-dict-multiple-input** | 6 | Dict Multiple Input | **已联调可用**（2026-07-24）。画布 `mp-dict-multiple-input-designer.vue`（对齐 mp-input）；`v-model` → `state.mpDictMultipleInputN`（`[]`）；画布点击累加演示选项至 maxSelection 后清空；snippet 勿写死演示 keys；`dictName` 业务必填。 |
| ~~**mp-country-multiple-input**~~ | 5 | Country Multiple Input | **已联调可用**（2026-08-25）。见 4.1.2 原说明。 |
| **mp-trans-summary** | 4 | Trans Summary | **已联调可用**（2026-07-24）。画布 `mp-trans-summary-designer.vue`；必填 `transactionInfo` → `state.mpTransSummaryN`（`{}`）；列表场景用高级 loop + Bound `item`；点击传参须事件 **额外参数** `["item"]`。详见《组件导入注意事项》**循环列表点击传参**。 |
| **mp-list-skeleton** | 4 | List Skeleton | **已联调可用**（2026-07-27）。画布 `mp-list-skeleton-designer.vue`（CSS 骨架条，无 mp-cell）；纯展示无 v-model；`itemNumber`/`descNumber`/`isCard`/`iconRound`/`iconWidth`/`iconHeight`/`title`；插槽 `end`；画布行数 clamp 1～12。 |
| **mp-ckeditor** | 8 | Ckeditor | **已联调可用**（2026-07-27）。画布 `mp-ckeditor-designer.vue`（轻量桩，不引 ckeditor5/DOMPurify）；纯展示 prop `html`；剥标签后通用实体解码（含 `&nbsp;` 等）；snippet 勿写死长 HTML。 |
| **mp-document-upload** | 3 | Document Upload | **已联调可用**（2026-07-30）。画布 `mp-document-upload-designer.vue`（title+desc+虚线拍摄区，无原生 SDK）；props：`title`/`desc`/`src`/`captureType`/`testId`；事件 `onSuccess`/`onFail`；无 v-model；相机图标须 extract 主工程 `camera.svg`（同 `i-mr-camera`）+ `icon-secondary`，禁止手写简化 SVG；`src` 通常 Bound `$fileUrl(fileId)`。详见《组件导入注意事项》**MpDocumentUpload**。 |
| ~~**mp-linked-account-cards**~~ | 3 | Linked Account Cards | **已联调可用**（2026-08-25）。见 4.1.2 原说明；**不能**用于捐赠付款。 |
| **mp-omr-text** | 5 | OMR Text | **已联调可用**（2026-08-25）。`mp-omr-text-designer` + entry + manifest；产物 **94** 个组件；把文案中字面量 `OMR` 换成币种 SVG（`currentColor`）；props：`content` / `fontSize` / `fontWeight` / `className`；用于 donations 限额蓝字（`donations.amountLimitRange`）等与 `mp-multi-amt` 红字错误提示同款图标；显隐与红字互斥用 schema **`condition`**。 |
| **mp-sheet-model-page** | 7 | Sheet Model Page | **已联调可用**（2026-08-26）。画布 `mp-sheet-model-page-designer.vue`（始终展开 Sheet）；props：`contentHeight` / `highTop` / `snapPosition` / `enableSlide` / `syncMainTabBar` / `refreshing` / `backgroundColor` / `title` / `translucent` / `hideBackButton` / `hideHeader`；插槽 default / `handle` / `modal-content`（须 Template，snippet 预开）；事件 `onRefresh`；内容区无默认 padding（业务自加 `px-16px` / sheetPad）。 |
| **mp-agreement-content** | 3 | Agreement Content | **已联调可用**（2026-08-26）。画布 `mp-agreement-content-designer.vue`（无 vue-pdf-embed）；props：`fileId` / `source` / `disabled`；拖拽 `v-model:disabled` → `state.mpAgreementContentDisabledN`（默认 `true`）；画布点击可切换 disabled；snippet 勿写死 fileId/source。配合 **MpAgreementButton**。 |
| **mp-gs-blur** | 3 | GS Blur | **已联调可用**（2026-08-26）。画布 `mp-gs-blur-designer.vue`（虚线框 + `GS Blur · on/off` 徽章）；prop `toggle`；default 插槽容器；无 v-model（轻量模板）；snippet 预开 Template + Text。详见《组件导入注意事项》**MpGsBlur**。 |

### 4.2 待评估导入 & 不导入清单

> 判定原则见 **§一.5**。下列 **「不导入」** 项：画布不单独拖拽，展示父组件或完整业务组件即可。

#### 不导入 — 子件 / 内部壳 / 父组件已覆盖 / 可组合替代（mp）

| 组件 | 约次数 | 类型 | 说明 |
| ---- | ------ | ---- | ---- |
| **mp-popup-container** | 29 | 内部壳 | `MpPopup` 内部标题/内容/底栏；框架 modal 亦直接用。拖 **MpPopup** 即可。 |
| **mp-summary-popup** | 2 | 可组合 | `MpPopup` + 摘要行 + 按钮；参考 **donations-confirm** 手拼。 |
| **mp-account-picker** | 3 | 子件 | 内嵌于 **MpAccountInput**；出码随父组件带出。 |
| **mp-account-item** | 1 | 子件 | 仅 `mp-account-picker` 列表行；父不导则子不导。 |
| **mp-refresher-content** | 3 | 可替代 | 低代码用已导入 **MrRefresherContent**（donations-list 已验证）。 |

#### P0 — 页面骨架 / 弹层（几乎所有业务页）

| 组件 | 约使用次数 | 设计器名称建议 | 典型场景 |
| ---- | ---------- | -------------- | -------- |
| ~~**mp-page**~~ | 406 | Page | **已联调可用**，见 4.1.2 |
| ~~**mp-container**~~ | 52 | Container | **已联调可用**，见 4.1.2 |
| ~~**mp-popup**~~ | 48 | Popup | **已联调可用**，见 4.1.2 |
| ~~**mp-popup-container**~~ | 29 | Popup Container | **不导入**（`MpPopup` 已覆盖页面弹层；container 为内部壳 / 框架 modal） |
| ~~**mp-dialog**~~ | 8 | Dialog | **已联调可用**，见 4.1.2 |

> `mp-page`、`mp-container`、`mp-popup`、`mp-dialog` 均已联调可用。P0 弹层壳完成；**无需**再补 `mp-popup-container`。

#### P1 — 表单金额 / 账户 / 日期（转账、捐赠、缴费同类页）

| 组件 | 约使用次数 | 设计器名称建议 | 说明 |
| ---- | ---------- | -------------- | ---- |
| ~~**mp-single-amt**~~ | 38 | Single Amt | **已联调可用**，见 4.1.2 |
| ~~**mp-date-popup**~~ | 23 | Date Popup | **已联调可用**，见 4.1.2 |
| ~~**mp-linked-account-input**~~ | 13 | Linked Account Input | **已联调可用**，见 4.1.2 |
| ~~**mp-pin-input-simple**~~ | 18 | Pin Input Simple | **已联调可用**，见 4.1.2 |
| ~~**mp-pin-input**~~ | 8 | Pin Input | **已联调可用**，见 4.1.2 |
| ~~**mp-code-input**~~ | 11 | Code Input | **已联调可用**，见 4.1.2 |
| ~~**mp-branch-input**~~ | 6 | Branch Input | **已联调可用**，见 4.1.2 |
| ~~**mp-ccy-input**~~ | 4 | Ccy Input | **已联调可用**，见 4.1.2 |
| ~~**mp-dict-multiple-input**~~ | 6 | Dict Multiple Input | **已联调可用**，见 4.1.2 |
| ~~**mp-country-multiple-input**~~ | 5 | Country Multiple Input | **已联调可用**，见 4.1.2 |

#### P2 — 上传 / 摘要 / 列表反馈

| 组件 | 约使用次数 | 设计器名称建议 | 说明 |
| ---- | ---------- | -------------- | ---- |
| ~~**mp-multi-uploader**~~ | 12 | Multi Uploader | **已联调可用**，见 4.1.2 |
| ~~**mp-uploader**~~ | 8 | Uploader | **已联调可用**，见 4.1.2 |
| ~~**mp-document-upload**~~ | 3 | Document Upload | **已联调可用**，见 4.1.2 |
| ~~**mp-trans-summary**~~ | 4 | Trans Summary | **已联调可用**，见 4.1.2 |
| ~~**mp-summary-popup**~~ | 2 | Summary Popup | **不导入**（用 `MpPopup` + 行展示组合，见上文） |
| ~~**mp-list-skeleton**~~ | 4 | List Skeleton | **已联调可用**，见 4.1.2 |
| ~~**mp-refresher-content**~~ | 3 | Refresher Content | **不导入**（低代码用 `MrRefresherContent`） |
| ~~**mp-account-cards**~~ | 11 | Account Cards | **已联调可用**，见 4.1.2 |
| ~~**mp-linked-account-cards**~~ | 3 | Linked Account Cards | **已联调可用**，见 4.1.2 |
| ~~**mp-account-picker**~~ | 3 | Account Picker | **不导入**（§4.2） |
| ~~**mp-account-item**~~ | 1 | Account Item | **不导入**（picker 子件，§4.2） |

#### P3 — 待评估导入（低频 / 领域专用）

> 下列为源码仍缺、且**未**归入不导入表的 mp 组件；**至少有一处真实业务模块引用**；仅在做对应模块低代码时再评估。  
> 「约使用次数」含 example 页时会偏高，以业务路径为准。

| 组件 | 约使用次数 | 说明 |
| ---- | ---------- | ---- |
| ~~**mp-ckeditor**~~ | 8 | Ckeditor | **已联调可用**，见 4.1.2；画布桩规避 ckeditor5 CSS |
| ~~**mp-sheet-model-page**~~ | 7 | Sheet 型页面壳 | **已联调可用**（2026-08-26），见 4.1.2 |
| ~~**mp-agreement-content**~~ | 3 | 协议正文 | **已联调可用**（2026-08-26），见 4.1.2 |
| ~~**mp-bank**~~ | 3 | 银行弹层 | **不导入**（无运行态源码，见 4.3；用已导入 **MpBankInput**） |
| ~~**mp-gs-blur**~~ | 3 | 高斯模糊装饰（loan / saving） | **已联调可用**（2026-08-26），见 4.1.2 |
| mp-list / mp-picker | 2 | 列表/选择器变体（transaction / mpayment / insurance 等） |
| ~~mp-skeleton~~ | 2 | **不导入**：仓库无运行态源码（见 4.3） |
| mp-country / mp-date-dialog | 1 | 与已有 country/date 输入重叠可能大 |
| mp-saving-account / mp-sigma-page | 1 | 领域页，按模块再导入 |

#### P4 — 仅 example / demo 演示（最低优先）

> 全仓模板引用**仅**出现在 `src/modules/example/`（或同类 showcase），**无业务模块使用**。扫描「使用次数」易误导，**默认不排期导入**；除非设计器本身要做组件展示页，再单独评估。

| 组件 | 约使用次数（含 demo） | 仅出现位置 | 说明 |
| ---- | -------------------- | ---------- | ---- |
| mp-message-box | 4 | `example/views/comp-message-box.vue` | 消息盒演示 |
| mp-time-dialog | 3 | `example/views/comp-time.vue` | 时间对话框演示 |

### 4.3 不导入 — 废弃 / legacy / 无源码（mp）

| 组件 | 约使用次数 | 原因 |
| ---- | ---------- | ---- |
| mp-date-picker-legacy | 3 | 已被 `mp-date-picker` / `mp-date-input` 替代 |
| **mp-skeleton** | 2 | **无运行态实现**：全仓无 `mp-skeleton.vue`；列表骨架用 **`MpListSkeleton`** |
| **mp-bank** | 3 | **已删除**：`src/components/mp-bank.vue` 于 `chore(common): mp-bank-input` 移除；仅剩 `@deprecated Not used` 的 `sc-bank-eft` / `sc-bank-pesalink` 残留标签。业务选银行用已导入 **`MpBankInput`** |

---

## 五、用低代码开发 OAB 时的导入建议

按「先能搭页 → 再能填单 → 再能弹层上传」推进：

1. **立刻优先**：~~`mp-page` / `mp-container` / `mp-popup` / `mp-dialog`（均已联调可用）~~；**无需** `mp-popup-container`。
2. **金额与账户页（含继续做 donations / transfer 类）**：P1 表单件已基本齐（含 `mp-country-multiple-input`、`mp-linked-account-cards`、`mp-omr-text` 等 **均已联调可用**）。  
   - 选账户：用 **`MpAccountInput`** / **`MpAccountCards`** / **`MpDonationPayAccountSwiper`**；**不必**再导 `mp-account-picker`。  
3. **资料/工单类**：`mp-uploader` / `mp-multi-uploader` / `mp-document-upload` / `mp-trans-summary` / `mp-list-skeleton` / `mp-ckeditor` **均已联调可用**。  
4. **原子侧**：`mr-spinner` **已联调可用**；其余低频 `mr-*`（slider、modal、tabs 等共 12 个）按真实低代码页面需要再开。  
5. **跨模块待评估（P3）**：仅在做对应模块低代码时再议，如 `mp-list` / `mp-picker` 等；**不导入表内组件不再重复评估**。`mp-sheet-model-page` / `mp-agreement-content` / `mp-gs-blur` **已联调可用**；`mp-bank` **不导入**（用 `MpBankInput`）。  
6. **仅 example 演示（P4，最低优先）**：如 `mp-message-box`、`mp-time-dialog`——全仓只在 `src/modules/example/` 出现，**无业务刚需，默认不排期**。  
7. **维护时**：新增扫描结果先对照 **§一.5** 判断是否归入「不导入」；再区分 **业务引用 vs 仅 example**（§一.3 / P4），最后更新 P3 / P4 表。

### 与 donations 低代码的关系（已验证子集）

当前 donations 主工程 + 低代码已覆盖的物料（**均已联调可用**）：

| 页面 | 主工程组件 | 低代码 schema 对应 | 备注 |
| ---- | ---------- | ------------------ | ---- |
| 列表 | `mp-page`、`mp-card`、`mp-avatar`、`mp-ckeditor`、`mr-refresher`(+content)、`mr-spinner`、`mr-button`、`mr-infinite-scroll`(+content) | 同左（`MrRefresherContent` 已导入） | loading 显隐用 schema **`condition`** |
| 表单 | `mp-page`、`mp-donation-pay-account-swiper`、`mp-card`、`mp-input`、`mp-multi-amt`、`mp-omr-text`、`mr-button` | 低代码暂用 `MpAccountCards` 占位账户区；限额蓝字用 `MpOmrText` | 付款账户 **不建议** 换 `mp-account-cards`（回归面大） |
| 确认 | `mp-page`、`mp-container`、`mp-avatar`、`mp-text-amt`、`mr-divider`、`mr-button` | `MpCard` + `MpTextAmt` + `MrCell*` | 结果页走公共 `trans-result`，不另导结果物料 |

**donations 链路暂无必须再导入的专用件。** 继续扩展 OAB 其他模块时，缺口主要在 **P2 摘要弹层 / 账户选择器** 与 **低频领域页**（见 §4.2），而不是 donations 再补一批组件。

---

## 六、维护方式

1. 新增物料后：更新本表「已导入 / 待导入」，并执行主工程 `pnpm run build:designer-materials`（或 `pnpm run lowcode`）。  
2. 扫描命令（在 OAB 根目录）：

```bash
rg -o --no-filename '<(mr|mp)-[a-z0-9-]+' src --glob '!**/lowcode/**' \
  | sed 's/^<//' | sort | uniq -c | sort -rn
```

3. 与 manifest 对比：以 `lowcode-materials/manifest.json` 中 `component` 字段（`Mr*` / `Mp*`）为准。  
4. 详细导入步骤与坑：见 [组件导入注意事项.md](./组件导入注意事项.md)、[物料导入快速参考.md](./物料导入快速参考.md)。

---

## 七、相关文档

- [物料导入进度跟踪.md](./物料导入进度跟踪.md)（mobilebanking 原跟踪）
- [主工程低代码集成指南-OAB.md](./主工程低代码集成指南-OAB.md)（OAB 集成入口：改哪里 / 要求 / 文档索引）
- [组件导入注意事项.md](./组件导入注意事项.md)
- [物料导入快速参考.md](./物料导入快速参考.md)
- [业务与原子组件导入方案.md](./业务与原子组件导入方案.md)
- OAB：`lowcode-materials/README.md`、`lowcode-materials/manifest.json`

---

_初稿：2026-07-22；主工程 OAB；扫描排除 `src/lowcode/`；manifest 物料数 **95**（含 Mr/Mp）。_

_补充（2026-07-22）：**mp-page** 已导入（`mp-page-designer` + `entries/mp-page.js` + manifest）；`pnpm run build:designer-materials` 产物 **71** 个组件。_

_补充（2026-07-22）：出码根节点。拖入物料 `MpPage` 后官方生成器会得到 `<div><mp-page/></div>`；`lowcode-kit` 的 `sfc-post-processor` 已改为：若根 `div` 的唯一子节点是 `mp-page`，则去掉外层 `div`（与 donations 手写页一致）；未拖 `MpPage` 时仍把根 `div` 改写为 `mp-page`。_

_补充（2026-07-22）：**mp-page 已联调可用**——画布标题绝对居中修复、属性/插槽与运行态对齐、出码根为 `<mp-page>`；由「已导入待测」记入「已联调可用」。_

_补充（2026-07-22）：**mp-container 已导入待测**——`mp-container-designer` + entry + manifest；产物 **72** 个组件；无业务 props，画布还原浅底圆角边框；支持 `onClick` 与 Class Name 覆盖。_

_补充（2026-07-22）：**mp-container 已联调可用**——由「已导入待测」记入「已联调可用」。下一步 P0 建议：`mp-popup` / `mp-popup-container` / `mp-dialog`。_

_补充（2026-07-22）：**mp-popup 已导入待测**——`mp-popup-designer` + entry + manifest；产物 **73** 个组件；拖拽绑定 `v-model:show` → `this.state.mpPopupN`（默认 `true`）；画布始终展开便于往 default/footer 等插槽塞内容；`mp-popup-container` 暂不单独导入（运行态由 `mp-popup` 内部使用）。_

_补充（2026-07-22）：**mp-popup 已联调可用**——画布拖拽编辑与插槽内容验证通过；由「已导入待测」记入「已联调可用」。下一步 P0 建议：`mp-dialog`（及按需 `mp-popup-container`）。_

_补充（2026-07-22）：**mp-dialog 已导入待测**——`mp-dialog-designer` + entry + manifest；产物 **74** 个组件；拖拽绑定 `v-model:show` → `this.state.mpDialogN`（默认 `true`）；画布始终展开居中卡片；props：`title` / `showCloseBtn`；插槽 default / header / header-start / footer。_

_补充（2026-07-22）：**mp-popup / mp-dialog 画布样式对齐运行态**——去掉 popup 标题分割线与虚假 min-height；dialog 去底部假空白；标题字号/字族与 24px 关闭图标对齐；popup 标题顶距按 `mt-8px` + Ionic toolbar 44px 行高修正。_

_补充（2026-07-22）：**mp-dialog 已联调可用**——功能与画布/出码样式比对通过；由「已导入待测」记入「已联调可用」。P0 弹层壳（page / container / popup / dialog）完成；下一步建议进入 P1（如 `mp-single-amt`、`mp-date-popup`、`mp-linked-account-input` 等），`mp-popup-container` 仍按需。_

_补充（2026-07-23）：**mp-single-amt 已导入待测**——`mp-single-amt-designer` + entry + manifest；产物 **75** 个组件；拖拽双绑定 `v-model` / `v-model:ccy` → `this.state.mpSingleAmtFormN.{amount,ccy}`（金额默认空、币种默认 `OMR`）；画布展示态对齐 large/small，本币用 OMR SVG；snippet **勿写死**演示金额。下一步 P1：`mp-date-popup`、`mp-linked-account-input` 等。_

_补充（2026-07-23）：**mp-single-amt 已联调可用**——画布/出码比对通过（横向不叠乘、label 15px、cell 垂直 padding、OMR `1em`）；由「已导入待测」记入「已联调可用」。经验写入《组件导入注意事项》**MpSingleAmt**。下一步 P1：`mp-date-popup`、`mp-linked-account-input` 等。_

_补充（2026-07-23）：**mp-date-popup 已导入待测**——`mp-date-popup-designer` + entry + manifest；产物 **76** 个组件；弹层壳对齐 `mp-popup`（标题 18px medium、关闭 24px、toolbar 44px）；滚轮轻量占位（不引入真实 `mp-date-picker`）；拖拽三绑定 → `this.state.mpDatePopupFormN.{visible,date,endDate}`。字段入口仍可用已有 `MpDateInput`。_

_补充（2026-07-23）：**mp-date-popup 已联调可用**——预览显隐与 Date 绑定验证通过（`visible=true` 打开；`date`/`endDate` 用 `Date`/`null` 勿用 `""`）；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-linked-account-input` 等。_

_补充（2026-07-23）：**mp-linked-account-input 已导入待测**——`mp-linked-account-input-designer` + entry + manifest；产物 **77** 个组件；画布无横向叠乘、Field 标签 15px、cell 垂直 padding；`v-model` → `this.state.mpLinkedAccountInputN`（对象）；与 `MpAccountInput`（付款方式）区分。_

_补充（2026-07-23）：**mp-linked-account-input 已联调可用**——画布/出码比对通过（横线在 cell 底 padding 后、箭头 `icon-fourth` 蓝）；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-pin-input-simple` 等。_

_补充（2026-07-23）：**mp-pin-input-simple 已导入待测**——`mp-pin-input-simple-designer` + entry + manifest；产物 **78** 个组件；画布支持 `input`/`grid` 与按住窥视眼睛；拖拽 `v-model:uid` → `this.state.mpPinInputSimpleUidN`（`''`，非 PIN 明文）；必填 `inputmode`（`0`/`1`）。与安全键盘版 `mp-pin-input` 区分。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-pin-input-simple 已联调可用**——功能与画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-code-input` 等。_

_补充（2026-07-23）：**mp-code-input 已导入待测**——`mp-code-input-designer` + entry + manifest；产物 **79** 个组件；方格对齐运行态（`max-w-70px` / `rounded-8px` / `border-200`）；`v-model` → `this.state.mpCodeInputN`（`''`）；画布点击可逐位演示（预览用真实输入）；snippet **勿写死**演示码。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-code-input 已联调可用**——画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-pin-input` 等。_

_补充（2026-07-23）：**mp-pin-input 已导入待测**——`mp-pin-input-designer` + entry + manifest；产物 **80** 个组件；安全键盘版（无眼睛、grid `max-w-50px`）；`v-model:uid` → `this.state.mpPinInputUidN`；与 `MpPinInputSimple` 状态键分离。画布点击仅演示掩码点数；真机/预览依赖 `mrBox.secureKeyboard`。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-pin-input 已联调可用**——功能与画布样式比对通过；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-branch-input` 等。_

_补充（2026-07-23）：**mp-branch-input 已导入待测**——`mp-branch-input-designer` + entry + manifest；产物 **81** 个组件；对齐 `mp-input`（无横向 inset、分割线在 cell padding 后、箭头 `icon-fourth`）；`v-model` → `this.state.mpBranchInputN`（分行号）；画布点击轮换演示分行；运行态打开 `showBranchPicker`。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-branch-input 已联调可用**——画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P2：`mp-uploader` 等。_

_补充（2026-07-23）：**mp-uploader 已导入待测**——`mp-uploader-designer` + entry + manifest；产物 **82** 个组件；上传区对齐运行态（`bg-200` / `rounded-8px` / `h-134px`）；双绑定 `v-model` / `v-model:name` → `this.state.mpUploaderFormN.{fileId,name}`；snippet **勿写死**演示 fileId；画布点击可切换空/已填演示态。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-uploader 已联调可用**——画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P2：`mp-multi-uploader` 等。_

_补充（2026-07-23）：**mp-multi-uploader 已导入待测**——`mp-multi-uploader-designer` + entry + manifest；产物 **83** 个组件；缩略图网格对齐运行态（68px + 60x60 添加格）；`v-model` → `this.state.mpMultiUploaderN`（`[]`）；画布可点加/删演示；snippet **勿写死**演示文件。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-multi-uploader 已联调可用**——画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P2：`mp-account-cards` 等。_

_补充（2026-07-23）：**mp-account-cards 已导入待测**——`mp-account-cards-designer` + entry + manifest；产物 **84** 个组件；静态卡 + peek（无 paymentStore / Swiper）；三绑定 `v-model` / `v-model:ccy` / `v-model:balance` → `this.state.mpAccountCardsFormN.{account,ccy,balance}`（`account:{}`，`ccy/balance:''`）；snippet **勿写死**演示账户；`sceneType` 必填。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-account-cards 已联调可用**——画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-ccy-input` 等。_

_补充（2026-07-23）：**mp-ccy-input 已导入待测**——`mp-ccy-input-designer` + entry + manifest；产物 **85** 个组件；对齐 `mp-input`（无横向 inset、分割线在 cell padding 后、箭头 `icon-fourth`）；`v-model` → `this.state.mpCcyInputN`（`''`）；画布点击轮换 OMR/USD/EUR；snippet **勿写死**演示币种。策略变更需 Reload Extension Host。_

_补充（2026-07-23）：**mp-ccy-input 已联调可用**——画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-dict-multiple-input` / `mp-country-multiple-input` 等。_

_补充（2026-07-24）：**mp-dict-multiple-input 已导入待测**——`mp-dict-multiple-input-designer` + entry + manifest；产物 **86** 个组件；对齐 `mp-input`；`v-model` → `this.state.mpDictMultipleInputN`（`[]`）；画布点击累加演示选项至 `maxSelection` 后清空；snippet **勿写死**演示 keys；`dictName` 业务必填。策略变更需 Reload Extension Host。_

_补充（2026-07-24）：**mp-dict-multiple-input 已联调可用**——画布/出码比对通过；由「已导入待测」记入「已联调可用」。下一步 P1：`mp-country-multiple-input` 等。_

_补充（2026-07-24）：**mp-country-multiple-input 已导入待测**——`mp-country-multiple-input-designer` + entry + manifest；产物 **87** 个组件；对齐 `mp-input`；`v-model` → `this.state.mpCountryMultipleInputN`（`[]`）；画布点击累加演示国家至 `maxSelection` 后清空；snippet **勿写死**演示国家码；可选 `channelCode`。策略变更需 Reload Extension Host。_

_补充（2026-07-24）：**mp-trans-summary 已导入待测**——`mp-trans-summary-designer` + entry + manifest；产物 **88** 个组件；列表行摘要（avatar + 标题/日期 + mp-text-amt）；必填 `transactionInfo` → `this.state.mpTransSummaryN`（`{}`）；snippet **勿写死**演示交易；`layout` default/card；有 `detailRows` 可点击展开。策略变更需 Reload Extension Host。_

_补充（2026-07-24）：**mp-trans-summary 已联调可用**——loop 列表 + `transactionInfo` Bound `item` + 事件额外参数 `["item"]` 验证通过（对照 donations-list `onDonate`）；由「已导入待测」记入「已联调可用」。经验写入《组件导入注意事项》**循环列表点击传参**。_

_补充（2026-07-27）：**mp-list-skeleton 已导入待测**——`mp-list-skeleton-designer` + entry + manifest；产物 **89** 个组件；纯展示无 v-model；画布 CSS 骨架条（不挂 mp-cell）；`itemNumber` 等属性改画布可见；插槽 `end`。_

_补充（2026-07-27）：**mp-list-skeleton 已联调可用**——由「已导入待测」记入「已联调可用」。_

_补充（2026-07-27）：**mp-skeleton 不导入**——全仓无 `mp-skeleton.vue` / 无组件定义；仅 saving 产品列表 2 处空标签（同页已有 `product-list-skeleton`）。低代码用 `MpListSkeleton` 或领域 `*-skeleton`，勿臆造物料。_

_补充（2026-07-27）：**mp-ckeditor 已导入待测**——`mp-ckeditor-designer` + entry + manifest；产物 **90** 个组件；只读富文本展示；画布桩不引入 ckeditor5/DOMPurify（对齐 MpPdf 重依赖规避）；prop `html`；snippet **勿写死**长 HTML。_

_补充（2026-07-27）：**mp-ckeditor 已联调可用**——画布/出码比对通过（含 `&nbsp;` 等多实体解码预览）；由「已导入待测」记入「已联调可用」。经验见《组件导入注意事项》**MpCkeditor**。_

_补充（2026-07-30）：**mp-document-upload 已导入待测**——`mp-document-upload-designer` + entry + manifest；产物 **91** 个组件；证件拍摄卡布局（无原生 `mrBox.captureDocument`）；props `title`/`desc`/`src`/`captureType`/`testId`；事件 `onSuccess(fileId)`/`onFail`；无 v-model；画布点击可切换空/演示预览（不写 schema）。Reload Extension Host 后验收。_

_补充（2026-07-30）：**mp-document-upload 已联调可用**——画布/出码比对通过；相机图标改为 extract 主工程 `camera.svg`（带加号）+ `icon-secondary` 后与运行态一致；由「已导入待测」记入「已联调可用」。经验见《组件导入注意事项》**MpDocumentUpload**。下一步 P2：`mp-summary-popup` 等。_

_补充（2026-08-19）：**mp-linked-account-cards 已导入待测**——`mp-linked-account-cards-designer` + entry + manifest；产物 **92** 个组件；静态卡 + peek（无 `useSavingStore` / Swiper）；无付款方式 chip；`v-model` → `this.state.mpLinkedAccountCardsN`（AccountItem `{}`）；snippet **勿写死**演示账户。与 `MpAccountCards`（`QueryPaymentMethod` 付款选路）不同，本组件走储蓄账户列表，**不能**用于捐赠付款。策略变更需 Reload Extension Host。下一步 P2：`mp-summary-popup` / `mp-account-picker` 等。_

_补充（2026-08-20）：**mr-spinner 已导入待测**——画布桩 `mr-spinner-canvas` + 样式自注入；`entries/mr-components.js` 设计态桩 / 预览 `IonSpinner`；`manifest` + `IonSpinner→MrSpinner` 映射；产物 **93** 个组件；默认 snippet `name="circles"`（对齐 donations-list）。策略变更需 Reload Extension Host / 刷新物料 bundle。_

_补充（2026-08-20）：**mr-spinner 已联调可用**——画布可选中、出码为 `<mr-spinner name="circles" />`；donations-list loading 条件用 schema **`condition`**（不是仅 `show`）才会生成 `v-if`。由「已导入待测」记入「已联调可用」。_

_补充（2026-08-24）：**mp-omr-text 已导入待测**——`mp-omr-text-designer` + entry + manifest；产物 **94** 个组件；把文案中字面量 `OMR` 换成币种 SVG（currentColor）；props：`content` / `fontSize` / `fontWeight` / `className`；用于 donations 限额蓝字等与红字 `mp-single-amt` 内错误提示同款图标。Reload Extension Host / 刷新物料 bundle 后验收。_

_补充（2026-08-25）：**mp-omr-text 已联调可用**——画布可选中、出码 `<mp-omr-text>`；`donations-page` 限额蓝字 Bound `donationAmountLimitRange` + 与红字互斥 `condition` 验证通过；由「已导入待测」记入「已联调可用」。_

_补充（2026-08-25）：**mp-country-multiple-input / mp-linked-account-cards 已联调可用**——由「已导入待测」记入「已联调可用」。_

_补充（2026-08-25）：**不导入判定原则**写入 §一.5——子件/内部壳、父组件已覆盖、可组合替代、框架级、别名等价物、legacy/无源码，统一暂不归入待导入；进度表拆为「待评估导入」与「不导入」。`mr-modal` / `mr-picker-vant` / `mr-input` / `mr-textarea` / `mr-date-picker` 等并入不导入表。_

_补充（2026-08-25）：**mr-slider 已联调可用**——与 `MrSwitch` 一致，设计态/出码均用 **Vant 原生 Slider**（白底圆钮，无默认蓝边 `#button`；业务可按需自配 PFM budget 样式）；`strategies/mrSlider.ts` 拖拽/保存自动 `v-model` → `this.state.mrSliderN`；`manifest` 补 `onUpdate:modelValue` / `onChange`；产物 **95** 个组件；demo 页拖动与样式已与画布对齐。Reload Extension Host / 刷新物料 bundle 后验收。_

_补充（2026-08-26）：**优先级：仅 example/demo 不计业务刚需**——§一.3 明确「使用次数」须排除 `src/modules/example/`；新增 **§4.2 P4**。`mp-message-box`、`mp-time-dialog` 全仓仅 `comp-*.vue` 演示页引用，从 P3 下调为 P4（默认不排期）。_

_补充（2026-08-26）：**mp-sheet-model-page 已导入待测**——`mp-sheet-model-page-designer` + entry + manifest；产物 **96** 个组件；画布始终展开 Sheet（header + 背景 default + handle + modal-content）；无 v-model 策略（轻量模板）；滑动/下拉刷新仅运行态。Reload Extension Host / 刷新物料 bundle 后验收。_

_补充（2026-08-26）：**mp-sheet-model-page 插槽用法补齐**——具名插槽（`modal-content` 等）须 Schema `Template` + `props.slot.name`（属性面板「插槽」开关）；snippet 预开 `default` + `modal-content`。画布去掉假 `#modal-content` 占位与壳层左右 padding，对齐运行态（loyalty 的 `sheetPad` / `px-16px` 由业务自加）。_

_补充（2026-08-26）：**mp-sheet-model-page 已联调可用**——插槽编辑与画布/运行态边距对齐验收通过；由「已导入待测」记入「已联调可用」。_

_补充（2026-08-26）：**mp-agreement-content 已导入待测**——`mp-agreement-content-designer` + entry + manifest；`strategies/mpAgreementContent.ts` 拖拽/保存自动 `v-model:disabled` → `this.state.mpAgreementContentDisabledN`（默认 `true`）；画布无 PDF 引擎，点击可切换 disabled；产物 **97** 个组件。Reload Extension Host / 刷新物料 bundle 后验收。_

_补充（2026-08-26）：**mp-agreement-content 已联调可用**——真实 PDF 预览验证通过（大文件仅加载慢）；由「已导入待测」记入「已联调可用」。_

_补充（2026-08-26）：**mp-bank 不导入**——仓库已无 `mp-bank.vue`（历史提交改为 `mp-bank-input`）；残留引用仅在 `@deprecated Not used` 的 `sc-bank-eft` / `sc-bank-pesalink`。低代码选银行请用已导入 **`MpBankInput`**。归入 §4.3。_

_补充（2026-08-26）：**mp-gs-blur 已导入待测**——`mp-gs-blur-designer` + entry + manifest；prop `toggle` + default 插槽；无 v-model 策略（轻量模板）；产物 **98** 个组件。Reload Extension Host / 刷新物料 bundle 后验收。_

_补充（2026-08-26）：**mp-gs-blur 已联调可用**——画布可见（徽章 + 虚线框）、插槽可塞 Text、Blur on 可反馈；踩坑：`props.className` 未 `const props = defineProps` 导致画布空白。经验写入《组件导入注意事项》**MpGsBlur**。下一步 P3：`mp-list` / `mp-picker` 等。_
