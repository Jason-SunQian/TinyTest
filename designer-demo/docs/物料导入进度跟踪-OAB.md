# OAB 主工程物料导入进度跟踪

> 统计 **OAB** 主工程源码中使用的 `<mr-*` / `<mp-*` 组件，对照 `lowcode-materials/manifest.json` 已登记物料，跟踪设计器导入缺口。  
> 参考文档：[物料导入进度跟踪.md](./物料导入进度跟踪.md)（原 **mobilebanking** 主工程）。  
> 数据来源：OAB `src/`（**排除** `src/lowcode/`）标签扫描 + `lowcode-materials/manifest.json`。  
> 统计日期：**2026-07-22**。主工程路径：`/Users/mac/Desktop/Project/2025/OAB`。

---

## 一、背景与读法

1. 设计器物料最初在 **mobilebanking** 上导入联调，后切换到 **OAB** 作为主工程。OAB 的 `lowcode-materials` 大体延续了原工程已测物料，并新增了部分 OAB 业务物料（如 `MpTextAmt`、`MpDonationPayAccountSwiper`、`MpPage`）。
2. 本文只回答：**OAB 业务源码里用到了哪些组件、哪些已进设计器、用低代码继续开发 OAB 时优先补哪些。**
3. 「使用次数」为模板标签出现次数（含骨架重复），用于**优先级参考**，不是独立页面数。
4. 设计器内置根节点 `Page` 与物料 **`MpPage`** 不是同一概念：拖入 `MpPage` 可在面板配置 `title` / `bgColor` 等；出码后处理会保证模板根为 `<mp-page>`（未拖时也会把根 `div` 改成 `mp-page`）。

---

## 二、进度总览

| 分类 | OAB 源码使用（去重标签） | 已导入且被使用 | 已导入（manifest） | 待导入（源码有用） | 建议废弃/不导入 |
| ---- | ------------------------ | -------------- | ------------------ | ------------------ | ---------------- |
| **原子组件 (mr-)** | 55¹ | 39 | 39（manifest 含附属 content） | 16 | 见 2.4 |
| **业务组件 (mp-)** | 70 | 35 | 37² | 35 | 1（legacy） |
| **合计** | 125 | 74 | 76 | 51 | — |

¹ `mr-image` / `mr-img`、`mr-progress` / `mr-progress-bar` 等别名按「已导入」计。  
² OAB 相对原跟踪文档多导入：`MpTextAmt`、`MpDonationPayAccountSwiper`、`MpPage` / `MpContainer` / `MpPopup` / `MpDialog` / `MpSingleAmt` / `MpDatePopup` / `MpLinkedAccountInput` / `MpPinInputSimple` / `MpCodeInput` / `MpPinInput` / `MpBranchInput` / `MpUploader` / `MpMultiUploader` / `MpAccountCards` / `MpCcyInput` / `MpDictMultipleInput` / `MpTransSummary` / `MpListSkeleton` / `MpCkeditor`（均已联调可用）；另有 `MpCountryMultipleInput`（已导入待测）。

与 [mobilebanking 跟踪文档](./物料导入进度跟踪.md) 对比（该文档待导入业务约 9～11 个）：

| 差异 | 说明 |
| ---- | ---- |
| OAB 业务待导入更多 | 约 **35** 个 mp- 标签在源码出现但未进 manifest（含弹层壳、上传、账户卡等） |
| OAB 已补且可用 | `mp-text-amt`、`mp-donation-pay-account-swiper`、`mp-page`、`mp-container`、`mp-popup`、`mp-dialog`、`mp-single-amt`、`mp-date-popup`、`mp-linked-account-input`、`mp-pin-input-simple`、`mp-code-input`、`mp-pin-input`、`mp-branch-input`、`mp-uploader`、`mp-multi-uploader`、`mp-account-cards`、`mp-ccy-input`、`mp-dict-multiple-input`、`mp-trans-summary`、`mp-list-skeleton`、`mp-ckeditor`（均已联调可用）；`mp-country-multiple-input`（已导入待测） |
| 原文档待导入在 OAB 仍缺 | `mp-popup-container`、`mp-summary-popup`、`mp-refresher-content` 等 |

---

## 三、原子组件 (mr-)

### 3.1 已导入（OAB manifest 已有）

与 mobilebanking 侧已测清单基本一致，包括但不限于：

`mr-divider`、`mr-img`、`mr-segment` / `mr-segment-button`、`mr-label`、`mr-button`、`mr-skeleton-text`、`mr-infinite-scroll`(+content)、`mr-header` / `mr-toolbar` / `mr-buttons` / `mr-back-button` / `mr-title`、`mr-content`、`mr-footer`、`mr-searchbar`、`mr-refresher`(+content)、`mr-progress-bar`、`mr-switch`、`mr-collapse`(+item)、`mr-item` / sliding / options / option、`mr-accordion-group` / `mr-accordion`、`mr-radio-group` / `mr-radio`、`mr-checkbox-group` / `mr-checkbox`、`mr-reorder-group` / `mr-reorder`、`mr-cell-group` / `mr-cell`、`mr-toggle`、`mr-form`、`mr-field`（物料保留，业务侧更推荐 `mp-input`）。

> 联调结论与画布桩经验仍以 [物料导入进度跟踪.md](./物料导入进度跟踪.md)「五、导入经验」及《组件导入注意事项》为准；换主工程后建议对 OAB 主题 token / 出码链路做抽样回归，不必重复全量导入。

### 3.2 待导入（OAB 源码有使用）

| 组件 | 约使用次数 | 建议 | 说明 |
| ---- | ---------- | ---- | ---- |
| mr-spinner | 7 | 中 | 加载指示，表单/列表页常见 |
| mr-slider | 5 | 低～中 | 少量业务 |
| mr-picker-vant | 5 | 低 | 与业务 `mp-*-input` 弹层选择有重叠 |
| mr-modal | 5 | 低 | 弹层；低代码页更常依赖 `mp-popup` / `mp-dialog` |
| mr-form-renderer | 4 | 低 | 动态表单渲染，场景窄 |
| mr-input | 3 | 低 | 业务以 `mp-input` 为主 |
| mr-tabs | 2 | 低 | |
| mr-menu / mr-menu-button | 2 / 1 | 低 | |
| mr-badge | 1 | 低 | |
| mr-date-picker / mr-datetime | 1 / 1 | 低 | 业务侧已有 `mp-date-*` |
| mr-textarea | 1 | 低 | 业务侧已有 `mp-textarea` |

### 3.3 建议不导入 / 框架级

| 组件 | 约使用次数 | 原因 |
| ---- | ---------- | ---- |
| mr-page | 7 | 与原文档一致：主工程页面容器已转向 **mp-page**；勿与业务页物料混淆 |
| mr-app | 1 | 应用根节点，非页面搭建物料 |
| mr-router-outlet | 4 | 路由出口，非业务拖拽组件 |

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
| **mp-country-multiple-input** | 5 | Country Multiple Input | **已导入待测**（2026-07-24）。画布 `mp-country-multiple-input-designer.vue`（对齐 mp-input）；`v-model` → `state.mpCountryMultipleInputN`（`[]`）；画布点击累加演示国家至 maxSelection 后清空；snippet 勿写死演示国家码；可选 `channelCode`。 |
| **mp-trans-summary** | 4 | Trans Summary | **已联调可用**（2026-07-24）。画布 `mp-trans-summary-designer.vue`；必填 `transactionInfo` → `state.mpTransSummaryN`（`{}`）；列表场景用高级 loop + Bound `item`；点击传参须事件 **额外参数** `["item"]`。详见《组件导入注意事项》**循环列表点击传参**。 |
| **mp-list-skeleton** | 4 | List Skeleton | **已联调可用**（2026-07-27）。画布 `mp-list-skeleton-designer.vue`（CSS 骨架条，无 mp-cell）；纯展示无 v-model；`itemNumber`/`descNumber`/`isCard`/`iconRound`/`iconWidth`/`iconHeight`/`title`；插槽 `end`；画布行数 clamp 1～12。 |
| **mp-ckeditor** | 8 | Ckeditor | **已联调可用**（2026-07-27）。画布 `mp-ckeditor-designer.vue`（轻量桩，不引 ckeditor5/DOMPurify）；纯展示 prop `html`；剥标签后通用实体解码（含 `&nbsp;` 等）；snippet 勿写死长 HTML。 |

### 4.2 待导入（按低代码开发优先级）

#### P0 — 页面骨架 / 弹层（几乎所有业务页）

| 组件 | 约使用次数 | 设计器名称建议 | 典型场景 |
| ---- | ---------- | -------------- | -------- |
| ~~**mp-page**~~ | 406 | Page | **已联调可用**，见 4.1.2 |
| ~~**mp-container**~~ | 52 | Container | **已联调可用**，见 4.1.2 |
| ~~**mp-popup**~~ | 48 | Popup | **已联调可用**，见 4.1.2 |
| **mp-popup-container** | 27 | Popup Container | 弹层宿主（运行态被 `mp-popup` 内部使用；设计器一般直接用 `mp-popup`） |
| ~~**mp-dialog**~~ | 8 | Dialog | **已联调可用**，见 4.1.2 |

> `mp-page`、`mp-container`、`mp-popup`、`mp-dialog` 均已联调可用。P0 弹层壳完成；按需再补 `mp-popup-container`。

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
| ~~**mp-country-multiple-input**~~ | 5 | Country Multiple Input | **已导入待测**，见 4.1.2 |

#### P2 — 上传 / 摘要 / 列表反馈

| 组件 | 约使用次数 | 设计器名称建议 | 说明 |
| ---- | ---------- | -------------- | ---- |
| ~~**mp-multi-uploader**~~ | 12 | Multi Uploader | **已联调可用**，见 4.1.2 |
| ~~**mp-uploader**~~ | 8 | Uploader | **已联调可用**，见 4.1.2 |
| **mp-document-upload** | 3 | Document Upload | 证件类上传 |
| ~~**mp-trans-summary**~~ | 4 | Trans Summary | **已联调可用**，见 4.1.2 |
| **mp-summary-popup** | 2 | Summary Popup | 摘要弹层 |
| ~~**mp-list-skeleton**~~ | 4 | List Skeleton | **已联调可用**，见 4.1.2 |
| **mp-refresher-content** | 3 | Refresher Content | 与 `mr-refresher` 配套 |
| ~~**mp-account-cards**~~ | 11 | Account Cards | **已联调可用**，见 4.1.2 |
| **mp-linked-account-cards** | 3 | Linked Account Cards | 关联账户卡 |
| **mp-account-picker** | 3 | Account Picker | 账户选择 |
| **mp-account-item** | 1 | Account Item | 账户条目 |

#### P3 — 低频 / 领域专用 / 可延后

| 组件 | 约使用次数 | 说明 |
| ---- | ---------- | ---- |
| ~~**mp-ckeditor**~~ | 8 | Ckeditor | **已联调可用**，见 4.1.2；画布桩规避 ckeditor5 CSS |
| mp-sheet-model-page | 7 | Sheet 型页面壳 |
| mp-message-box | 4 | 消息盒 |
| mp-agreement-content | 3 | 协议正文 |
| mp-bank | 3 | 银行展示（非 Bank Input） |
| mp-gs-blur | 3 | 高斯模糊装饰 |
| mp-time-dialog | 3 | 时间对话框 |
| mp-list / mp-picker | 2 | 列表/选择器变体 |
| ~~mp-skeleton~~ | 2 | **不导入**：仓库无运行态源码（见 4.3） |
| mp-country / mp-date-dialog | 1 | 与已有 country/date 输入重叠可能大 |
| mp-saving-account / mp-sigma-page | 1 | 领域页，按模块再导入 |

### 4.3 已废弃 / 不导入

| 组件 | 约使用次数 | 原因 |
| ---- | ---------- | ---- |
| mp-date-picker-legacy | 3 | 已被 `mp-date-picker` / `mp-date-input` 替代（与原文档一致） |
| **mp-skeleton** | 2 | **无运行态实现**：全仓无 `mp-skeleton.vue`；仅 `saving/.../fixed-produts-list.vue` 与 `savings-produts-list.vue` 各有一处空标签，同页已用 `product-list-skeleton`。勿臆造物料；列表骨架用已导入的 **`MpListSkeleton`**，领域页用各自 `*-skeleton`。 |

---

## 五、用低代码开发 OAB 时的导入建议

按「先能搭页 → 再能填单 → 再能弹层上传」推进：

1. **立刻优先**：~~`mp-page` / `mp-container` / `mp-popup` / `mp-dialog`（均已联调可用）~~；按需再补 `mp-popup-container`  
   - P0 页面骨架与弹层壳已齐，可继续推进 P1 表单件。
2. **金额与账户页（含继续做 donations / transfer 类）**：~~`mp-single-amt` / `mp-date-popup` / `mp-linked-account-input` / `mp-pin-input-simple` / `mp-code-input` / `mp-pin-input` / `mp-branch-input`（已联调可用）~~、各类 `*-input`（P1）  
   - 已具备：`mp-page`、`mp-container`、`mp-multi-amt`、`mp-text-amt`、`mp-single-amt`、`mp-date-popup`、`mp-linked-account-input`、`mp-pin-input-simple`、`mp-pin-input`、`mp-code-input`、`mp-branch-input`、`mp-ccy-input`、`mp-dict-multiple-input`、`mp-country-multiple-input`、`mp-trans-summary`、`mp-list-skeleton`、`mp-ckeditor`、`mp-uploader`、`mp-multi-uploader`、`mp-account-cards`、`mp-account-input`、`mp-donation-pay-account-swiper`。  
3. **资料/工单类**：~~`mp-uploader`（已联调可用）~~ / ~~`mp-multi-uploader`（已联调可用）~~、~~`mp-trans-summary`（已联调可用）~~、~~`mp-list-skeleton`（已联调可用）~~。  
4. **原子侧**：OAB 缺口主要是低频 `mr-*`；优先补 `mr-spinner` 即可，其余按真实低代码页面需要再开。  
5. **不要优先导入**：`mr-page` / `mr-app` / `mr-router-outlet`、`mp-date-picker-legacy`、**`mp-skeleton`（无源码）**、极低频领域页组件。

### 与 donations 低代码的关系（已验证子集）

当前 donations 低代码主要依赖（均已在物料或出码可用）：

- 容器/展示：`mp-page`（**物料已联调可用** + 出码根节点处理）、`mp-card`、`mp-text-amt`、`mp-multi-amt`、`mp-donation-pay-account-swiper`、`mp-input`、`mp-avatar`、`mr-button` / `mr-cell*` 等  
- 结果页：公共 `trans-result` + `businessType: D101`，不依赖额外结果物料  

继续扩展 OAB 其他模块时，**缺口主要是上传/关联账户类与 P1 表单件**，而不是再补一套 donations 专用件。

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

_初稿：2026-07-22；主工程 OAB；扫描排除 `src/lowcode/`；manifest 物料数 70（含 Mr/Mp）。_

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
