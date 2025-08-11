import "./style.css";
import "./js/i18n.js";
import { i18nKeyMaps as ju, SCHEMA_DATA_TYPE as cc, PAGE_STATUS as uc, TYPES as vh, PROP_DATA_TYPE as dc } from "./js/constants.js";
import Os from "@opentiny/tiny-engine-i18n-host";
import { resolveComponent as F, createElementBlock as $, openBlock as C, createVNode as O, withCtx as M, renderSlot as re, createTextVNode as Se, reactive as yt, createElementVNode as R, toDisplayString as ce, Fragment as Xe, renderList as Pt, createBlock as ue, resolveDynamicComponent as ar, mergeProps as Rn, computed as ie, ref as Ce, inject as tn, provide as Qa, watch as Vt, createCommentVNode as ee, normalizeClass as Ye, normalizeStyle as Fn, withDirectives as _r, vShow as nn, watchEffect as Sr, nextTick as ca, onMounted as Ds, onBeforeUnmount as nl, createSlots as gh, defineComponent as Ls, h as Ga, Teleport as _h, pushScopeId as Vr, popScopeId as zr, withModifiers as er, onActivated as yh, onDeactivated as bh, unref as gr, useCssVars as wh, vModelText as fc, normalizeProps as Eh, guardReactiveProps as Sh, render as Ph, toRaw as xh } from "vue";
import { CollapseItem as Bu, Collapse as Uu, RadioGroup as Ch, Radio as kh, Popover as ur, Tooltip as qr, Button as dr, TinyTooltip as Ih, Input as cn, FormItem as Ns, Form as $s, DialogBox as Ms, Split as Rh, Grid as Th, GridColumn as xa, Checkbox as Ka, Search as Ah, Option as Oh, Select as Dh, Modal as al, Notify as Lh } from "@opentiny/vue";
import { IconHelpCircle as Nh, IconPlusCircle as $h, IconWriting as Mh, iconPlus as Fh, iconClose as Vu, iconMore as jh, iconEdit as Bh, iconDel as Uh, iconYes as Vh, iconInfo as zh, IconClose as qh } from "@opentiny/vue-icon";
import { typeOf as Hh } from "@opentiny/vue-renderless/common/type";
import { getConfigurator as Wn, useProperties as Ca, useMaterial as Zh, useCanvas as yr, useLayout as Hr, useHistory as Ma, useResource as Wh, useModal as Fs, useBlock as js, usePage as Jh, getMergeMeta as ka, useNotify as zu, useTranslate as Jo, getMetaApi as Tn, META_APP as hc, useMessage as sl, defineService as ol, META_SERVICE as jn, getAllMergeMeta as Qh } from "@opentiny/tiny-engine-meta-register";
import { utils as il, constants as Bs } from "@opentiny/tiny-engine-utils";
import { SvgButton as Gh } from "@opentiny/tiny-engine-common";
import { isObject as Kh } from "@opentiny/vue-renderless/grid/static";
import * as co from "monaco-editor";
import { formatString as Qo } from "./js/ast.js";
import "@babel/parser";
import "@babel/generator";
import "@babel/traverse";
import "prettier";
import "prettier/parser-html";
import "prettier/parser-postcss";
import "prettier/parser-babel";
import { format as qu } from "@opentiny/vue-renderless/common/date";
import { extend as Go } from "@opentiny/vue-renderless/common/object";
import { initCompletion as Yh } from "./js/completion.js";
import { lint as Xh, initLinter as ep } from "./js/linter.js";
import { parseRequiredBlocks as Hu, generateApp as tp, genSFCWithDefaultPlugin as rp } from "@opentiny/tiny-engine-dsl-vue";
import np from "./js/config-files/prettierrc.js";
import { g as Zu, c as ap } from "./_commonjsHelpers-DaMA6jEr.js";
import { u as pc } from "./index-lnBLG_4I.js";
const sp = {
  required: "Mandatory",
  addParameter: "Add",
  deleteParameter: "Delete Parameter",
  selectParameter: "Select Input Parameter",
  parameterName: "Name",
  nameFormat: "Start with a letter and enter only letters, digits, underscores (_), and hyphens (-). Max. characters: 32.",
  description: "Description",
  parameterGroup: "Parameter Group",
  parameterType: "Data Type",
  initialValue: "Initial Value",
  allowEmpty: "Null Allowance",
  condition: "Constraint",
  constraintError: "If either Constraint or Error Message is specified, the other is mandatory.",
  errorTip: "Error Message",
  inputValue: "Enter a value.",
  inputConstraint: "Enter a constraint.",
  inputMessage: "Enter an error message.",
  inputParamName: "Enter a name.",
  inputDescription: "Enter a description.",
  proposal: "Recommended CIDR blocks:",
  selectAParameter: "--Select--",
  typeErrorTip: "The data type of {property} is {type}. Select the same data type.",
  selectParam: "Parameter",
  confirm: "Confirm",
  ok: "OK",
  cancel: "Cancel",
  string: "String",
  number: "Number",
  boolean: "Boolean",
  select: "Select",
  format: "Format",
  save: "Save",
  close: "Close",
  commonParam: "Plain Parameter",
  encryptionParam: "Encrypted Parameter",
  createCommon: "Create Plain Parameter",
  passwordTip1: "Sensitive. Plaintext is risky. You are advised to click ",
  passwordTip2: " to add an encrypted parameter to configure the value.",
  createEncryption: "Create Encrypted Parameter",
  expandExample: "Show Example",
  collapseExample: "Hide Example",
  exampleCode: "Example Code"
}, op = {
  common: sp
}, ip = {
  required: "必填",
  addParameter: "添加参数",
  deleteParameter: "删除参数",
  selectParameter: "选择输入参数",
  parameterName: "参数名称",
  nameFormat: "大小写字母开头，大小写字母、数字、连线符、下划线组成，长度为1-32",
  description: "描述",
  parameterGroup: "参数分类",
  parameterType: "参数类型",
  initialValue: "初始值",
  allowEmpty: "允许空值",
  condition: "约束条件",
  constraintError: "约束条件与失败提示必须同时存在",
  errorTip: "失败提示",
  inputValue: "请输入值",
  inputConstraint: "请输入值",
  inputMessage: "请输入值",
  inputParamName: "请输入参数名称",
  inputDescription: "请输入描述",
  selectAParameter: "请选择参数",
  proposal: "建议使用网段：",
  typeErrorTip: "{property}的参数类型为{type}，请选择相同的参数类型！",
  selectParam: "选择参数",
  confirm: "确认",
  ok: "确定",
  cancel: "取消",
  string: "字符串",
  number: "整数",
  boolean: "布尔值",
  select: "选择",
  format: "格式化",
  save: "保存",
  close: "关闭",
  commonParam: "普通参数",
  encryptionParam: "加密参数",
  createCommon: "创建普通参数",
  passwordTip1: "密码属敏感数据，输入明文有一定安全风险，建议点击",
  passwordTip2: "通过加密参数来配置密码数据。",
  createEncryption: "创建加密参数",
  expandExample: "展开示例",
  collapseExample: "收起示例",
  exampleCode: "示例代码"
}, lp = {
  common: ip
}, { mergeLocaleMessage: Wu } = Os.global;
Wu(ju.enUS, op);
Wu(ju.zhCN, lp);
const cp = {
  components: {
    TinyCollapse: Uu,
    TinyCollapseItem: Bu
  },
  props: {
    title: {
      type: String,
      default: "更多类型选项"
    }
  },
  setup() {
    return {};
  }
}, me = (t, e) => {
  const r = t.__vccOpts || t;
  for (const [a, n] of e)
    r[a] = n;
  return r;
}, up = { id: "typography-more" };
function dp(t, e, r, a, n, s) {
  const o = F("tiny-collapse-item"), i = F("tiny-collapse");
  return C(), $("div", up, [
    O(i, null, {
      default: M(() => [
        O(o, {
          title: r.title,
          name: "1"
        }, {
          default: M(() => [
            re(t.$slots, "default", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["title"])
      ]),
      _: 3
    })
  ]);
}
const fp = /* @__PURE__ */ me(cp, [["render", dp], ["__scopeId", "data-v-50d14bf7"]]), hp = {
  props: {
    group: Object,
    index: Number,
    design: Boolean,
    emptyText: {
      type: String,
      default: "空"
    }
  },
  render() {
    var l;
    const t = this.group.content || [], {
      item: e
    } = this.$slots, r = ((l = this.group.collapse) == null ? void 0 : l.number) || t.length, a = t.map((c, u) => e({
      data: c,
      propIndex: u
    })), n = a.slice(0, r), s = a.slice(r), o = O("div", {
      class: "item-container",
      "data-group-index": this.index
    }, [n.length ? n : O("div", {
      class: "empty"
    }, [this.emptyText])]), i = s.length ? O(fp, null, {
      default: () => [O("div", {
        class: "item-container",
        "data-group-index": this.index
      }, [s])]
    }) : null;
    return O("div", {
      style: "width:100%"
    }, [o, Se(" "), i]);
  }
}, Ju = /* @__PURE__ */ me(hp, [["__scopeId", "data-v-e48a3147"]]), pp = {
  name: "MultiTypeSelector",
  components: {
    TinyTooltip: qr,
    TinyPopover: ur,
    TinyRadio: kh,
    TinyRadioGroup: Ch
  },
  inheritAttrs: !1,
  props: {
    meta: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: String,
      default: ""
    }
  },
  emits: ["change", "update:modelValue"],
  setup(t, { emit: e }) {
    var u, d;
    const r = (h, f) => {
      let m = h[0] || "";
      if (f === void 0) return m;
      for (const p of h)
        if (typeof f === p || p === "array" && Array.isArray(f)) {
          m = p, e("change", [p]);
          break;
        }
      return m;
    }, a = r(t.meta.type, (d = (u = t.meta.widget) == null ? void 0 : u.props) == null ? void 0 : d.modelValue), n = r(t.meta.type, t.meta.defaultValue), o = yt({
      type: a,
      // 当前选中的组件类型
      typesValue: t.meta.type.map((h) => {
        var f, m;
        return h === a ? { modelValue: (m = (f = t.meta.widget) == null ? void 0 : f.props) == null ? void 0 : m.modelValue } : h === n ? { modelValue: t.meta.defaultValue } : { modelValue: null };
      })
      // 保存多个组件的modelValue
    });
    return {
      state: o,
      TYPE_MAP: {
        string: "字符串",
        number: "数字",
        boolean: "布尔值",
        object: "对象",
        array: "数组"
      },
      change: (h) => {
        const f = t.meta.type.findIndex((m) => m === h[0]);
        f > -1 && e("update:modelValue", o.typesValue[f].modelValue), e("change", h);
      },
      handleChange: (h, f) => {
        const m = t.meta.type[h];
        o.type !== m && (o.type = m, e("change", [m])), e("update:modelValue", f);
      },
      getConfigurator: Wn
    };
  }
}, mp = { class: "container" }, vp = { class: "container-title" }, gp = { class: "item-label" }, _p = { class: "component-wrap" };
function yp(t, e, r, a, n, s) {
  const o = F("tiny-radio"), i = F("tiny-radio-group");
  return C(), $("div", mp, [
    R("div", vp, ce(r.label), 1),
    R("div", null, [
      O(i, {
        modelValue: a.state.type,
        "onUpdate:modelValue": e[0] || (e[0] = (l) => a.state.type = l),
        vertical: "",
        onChange: a.change
      }, {
        default: M(() => [
          (C(!0), $(Xe, null, Pt(r.meta.type, (l, c) => {
            var u;
            return C(), $("div", {
              key: l,
              class: "property-container"
            }, [
              R("div", gp, [
                O(o, { label: l }, {
                  default: M(() => [
                    Se(ce(a.TYPE_MAP[l] || l), 1)
                  ]),
                  _: 2
                }, 1032, ["label"])
              ]),
              re(t.$slots, "prefix", {}, void 0, !0),
              R("div", _p, [
                (C(), ue(ar(a.getConfigurator((u = r.meta.widget.component) == null ? void 0 : u[c])), Rn(r.meta.widget.props, {
                  modelValue: a.state.typesValue[c].modelValue,
                  "onUpdate:modelValue": [(d) => a.state.typesValue[c].modelValue = d, (d) => a.handleChange(c, d)],
                  meta: r.meta
                }), null, 16, ["modelValue", "onUpdate:modelValue", "meta"]))
              ]),
              re(t.$slots, "suffix", {}, void 0, !0)
            ]);
          }), 128))
        ]),
        _: 3
      }, 8, ["modelValue", "onChange"])
    ])
  ]);
}
const mc = /* @__PURE__ */ me(pp, [["render", yp], ["__scopeId", "data-v-23a64d02"]]), { parseFunction: uo } = il, vc = (t, e) => t ? !0 : Array.isArray(e) && e.length > 0, bp = {
  components: {
    MultiTypeSelector: mc,
    TinyPopover: ur,
    TinyTooltip: qr,
    IconWriting: Mh(),
    IconPlusCircle: $h(),
    IconHelpCircle: Nh()
  },
  props: {
    properties: {
      type: [Array, Object],
      default: () => []
    },
    property: {
      type: Object,
      default: () => ({})
    },
    isTopLayer: {
      type: Boolean,
      default: !1
    },
    onlyEdit: {
      type: Boolean,
      default: !1
    },
    group: {
      type: Object,
      default: () => ({})
    },
    metaComponents: {
      type: Object,
      default: () => ({})
    },
    showMessageError: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const r = Wn("CodeConfigurator"), a = Wn("VariableConfigurator"), { t: n, locale: s } = Os.global, o = yt({
      failed: !1,
      message: "",
      hasRule: ie(() => {
        var j, K;
        return vc((j = t.property) == null ? void 0 : j.required, (K = t.property) == null ? void 0 : K.rules);
      })
    }), i = Ce(null), l = tn("currentProperty", null), c = tn("propsObj", null), u = ie(() => {
      var j;
      return ((j = t.property) == null ? void 0 : j.required) || !1;
    }), d = ie(() => t.hidden), h = ie(() => {
      var j;
      return ((j = t.property) == null ? void 0 : j.widget) || {};
    }), f = ie(
      () => {
        var j, K, Ee, Ne, we;
        return ((Ee = (K = (j = t.property) == null ? void 0 : j.label) == null ? void 0 : K.text) == null ? void 0 : Ee[s.value]) || ((we = (Ne = t.property) == null ? void 0 : Ne.label) == null ? void 0 : we.text) || t.property.property;
      }
    ), m = ie(() => Array.isArray(h.value.component)), p = Ce(!1), v = ie(
      () => t.isTopLayer && p.value === !1 && (m.value || ["array", "object"].includes(t.property.type))
    ), y = ie(
      () => !t.onlyEdit && f.value && (p.value || ![
        "GroupItemConfigurator",
        "ArrayItemConfigurator",
        "RelatedColumnsConfigurator",
        "TableColumnsConfigurator"
      ].includes(h.value.component)) && !m.value
    ), b = ie(
      () => {
        var j, K, Ee, Ne, we, Oe, Be, Pe;
        return (((K = (j = t.property) == null ? void 0 : j.description) == null ? void 0 : K[s.value]) ?? ((Ee = t.property) == null ? void 0 : Ee.description)) || (((Oe = (we = (Ne = t.property) == null ? void 0 : Ne.label) == null ? void 0 : we.text) == null ? void 0 : Oe[s.value]) ?? ((Pe = (Be = t.property) == null ? void 0 : Be.label) == null ? void 0 : Pe.text));
      }
    ), _ = ie(() => !!t.property.linked), E = ie(() => m.value ? mc : Wn(h.value.component) || t.metaComponents[h.value.component] || Wn("InputConfigurator")), P = ie(() => {
      var K, Ee, Ne, we;
      let j = (Ne = (Ee = (K = t.property) == null ? void 0 : K.widget) == null ? void 0 : Ee.props) == null ? void 0 : Ne.modelValue;
      if (j == null) {
        const Oe = (we = t.property) == null ? void 0 : we.defaultValue;
        j = (Oe == null ? void 0 : Oe[s.value]) ?? Oe;
      }
      return (j == null ? void 0 : j.componentName) === "Icon" && (j = j.props.name), j;
    }), A = ie(() => {
      var Ee, Ne, we, Oe, Be, Pe;
      const j = (we = (Ne = (Ee = t.property) == null ? void 0 : Ee.widget) == null ? void 0 : Ne.props) == null ? void 0 : we.language, K = ((Be = (Oe = t.property) == null ? void 0 : Oe.description) == null ? void 0 : Be.zh_CN) === "分页配置" || ((Pe = t.property) == null ? void 0 : Pe.type) === "Object" ? "json" : "javascript";
      return j || K;
    }), k = ie(() => {
      var j, K;
      return y.value ? t.property.labelPosition ? t.property.labelPosition : ["CheckBoxConfigurator", "SwitchConfigurator"].includes((j = t.property.widget) == null ? void 0 : j.component) ? "left" : ((K = t.property.widget) == null ? void 0 : K.component) === "CodeConfigurator" ? "top" : "auto" : "none";
    }), B = (j) => {
      const { property: K, type: Ee } = t.property, { setProp: Ne, getSchema: we } = Ca();
      if ((j == null ? void 0 : j.type) === cc.JSExpression) {
        const Pe = we().componentName, {
          schema: { events: Ie = {} }
        } = Zh().getMaterial(Pe);
        Object.keys(Ie).includes(`onUpdate:${K}`) && (j = { ...j, model: K === "modelValue" ? !0 : { prop: K } });
      }
      const { operateNode: Oe, isSaved: Be } = yr();
      if (K === "children") {
        const Pe = we();
        Oe({ type: "updateAttributes", id: Pe.id, value: { children: j } });
      } else {
        if (!Be() && ![uc.Guest, uc.Occupy].includes(Hr().layoutState.pageStatus.state))
          return;
        K !== "name" && ["SelectIconConfigurator"].includes(t.property.widget.component) && (j = {
          componentName: "Icon",
          props: {
            name: j
          }
        }), t.isTopLayer && Ne(K, j, Ee);
      }
      Ma().addHistory();
    }, L = (j, K) => {
      j.failed = !0, j.message = typeof K == "string" ? K : K == null ? void 0 : K[s.value];
    }, H = (j) => j == null || Hh(j) === vh.StringType && j.trim() === "", J = (j) => !H(j), q = (j = "", K = []) => {
      var Oe, Be;
      const Ee = {
        failed: !1,
        message: ""
      };
      if (!vc((Oe = t.property) == null ? void 0 : Oe.required, (Be = t.property) == null ? void 0 : Be.rules))
        return Ee;
      if (u.value && !J(j))
        return L(Ee, n("common.required")), Ee;
      const Ne = K.length, { getProp: we } = Ca();
      for (let Pe = 0; Pe < Ne; Pe++) {
        const Ie = K[Pe];
        if (Ie.required && !J(j))
          return L(Ee, Ie.message), Ee;
        if (Ie.pattern) {
          if (!new RegExp(Ie.pattern).test(j)) {
            L(Ee, Ie.message);
            break;
          }
        } else if (Ie.validator)
          try {
            if (!uo(Ie.validator, {
              props: {
                value: j
              },
              getProp: we
            })(Ie, j)) {
              L(Ee, Ie.message);
              break;
            }
          } catch (At) {
            console.log(At);
          }
      }
      return Ee;
    }, N = (j, K) => {
      var Be;
      const { onChange: Ee, rules: Ne } = t.property, { setProp: we, delProp: Oe } = Ca();
      if (Ee && c)
        try {
          uo(Ee, {
            ...c.value,
            config: {
              ...(Be = h.value) == null ? void 0 : Be.props
            },
            setProp: we,
            delProp: Oe
          })(j, K);
        } catch (Pe) {
          console.log(Pe);
        }
      Object.assign(o, q(j, Ne));
    }, D = (j, K = !0) => {
      const Ee = P.value;
      h.value.props.modelValue = j, e("update:modelValue", j), K && (B(j), N(j, Ee));
    }, Q = tn("path", ""), ae = tn("data", null);
    Qa("path", `${Q ? Q + "." : ""}${t.property.property}`), Qa("data", Ca().getSchema()), Vt(
      () => P.value,
      (j) => {
        p.value = (j == null ? void 0 : j.type) === cc.JSExpression;
      },
      {
        immediate: !0
      }
    );
    const de = Ce(!1), le = Ce(!1);
    Vt(
      () => [o.failed, le.value],
      () => {
        if (!o.failed) {
          de.value = !1;
          return;
        }
        de.value = !0;
      }
    );
    const ge = () => {
      le.value = !0;
    }, se = () => {
      var K;
      le.value = !1;
      const j = (K = t.property) == null ? void 0 : K.onBlur;
      if (j)
        try {
          uo(j, {})(P.value);
        } catch {
        }
    }, je = (j) => ["RelatedEditorConfigurator", "RelatedColumnsConfigurator"].includes(j), Te = ie(
      () => !t.onlyEdit && (p.value || _.value) && !je(h.value.component)
    );
    return {
      CodeConfigurator: r,
      VariableConfigurator: a,
      verification: o,
      showCodeEditIcon: v,
      editorModalRef: i,
      isBindingState: p,
      component: E,
      hidden: d,
      widget: h,
      required: u,
      isLinked: _,
      propLabel: f,
      showLabel: y,
      multiType: m,
      propDescription: b,
      bindValue: P,
      currentProperty: l,
      showBindState: Te,
      onModelUpdate: D,
      parentData: ae,
      currentLanguage: A,
      showErrorPopup: de,
      handleFocus: ge,
      handleBlur: se,
      isFocus: le,
      isRelatedComponents: je,
      labelPosition: k
    };
  }
}, wp = { class: "prop-content" }, Ep = { class: "prop-title" }, Sp = { class: "prop-description" }, Pp = { class: "item-input" }, xp = {
  key: 0,
  class: "binding-state text-ellipsis-multiple"
}, Cp = {
  key: 2,
  class: "error-tips-container"
}, kp = { class: "error-desc" }, Ip = { class: "action-icon" };
function Rp(t, e, r, a, n, s) {
  var u;
  const o = F("tiny-popover"), i = F("svg-icon"), l = F("icon-writing"), c = F("tiny-tooltip");
  return r.property.hidden ? ee("", !0) : (C(), $("div", {
    key: r.property,
    style: Fn({ width: r.property.cols / 0.12 + "%" }),
    class: Ye([
      "properties-item",
      {
        active: r.property === a.currentProperty
      }
    ])
  }, [
    R("div", {
      class: Ye(["item-warp", a.labelPosition, r.property.className, { multiType: a.multiType }])
    }, [
      a.showLabel ? (C(), $("div", {
        key: 0,
        class: Ye(["item-label", { linked: a.isLinked }])
      }, [
        O(o, {
          placement: "top",
          title: "",
          trigger: "hover",
          "popper-class": "prop-label-tips-container",
          "open-delay": 500,
          disabled: !a.propDescription || a.propDescription === a.propLabel
        }, {
          reference: M(() => [
            R("div", null, [
              R("div", {
                class: Ye([{ "pro-underline": a.propDescription && a.propDescription !== a.propLabel }])
              }, [
                R("span", null, ce(a.propLabel), 1)
              ], 2)
            ])
          ]),
          default: M(() => [
            R("div", wp, [
              R("div", Ep, ce(r.property.property), 1),
              R("div", Sp, ce(a.propDescription), 1)
            ])
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 2)) : ee("", !0),
      R("div", Pp, [
        re(t.$slots, "prefix", {}, void 0, !0),
        R("div", {
          class: Ye([
            "widget",
            {
              "verify-failed": a.verification.failed
            }
          ])
        }, [
          a.showBindState ? (C(), $("div", xp, ce("已绑定：" + ((u = a.widget.props.modelValue) == null ? void 0 : u.value)), 1)) : _r((C(), ue(ar(a.component), Rn({ key: 1 }, a.widget.props, {
            "model-value": a.bindValue,
            language: a.currentLanguage,
            meta: r.property,
            label: a.propLabel,
            metaComponents: r.metaComponents,
            "onUpdate:modelValue": a.onModelUpdate,
            onFocus: a.handleFocus,
            onBlur: a.handleBlur
          }), null, 16, ["model-value", "language", "meta", "label", "metaComponents", "onUpdate:modelValue", "onFocus", "onBlur"])), [
            [nn, !a.hidden]
          ]),
          a.showErrorPopup ? (C(), $("div", Cp, [
            O(i, {
              name: "notify-failure",
              class: "error-icon"
            }),
            R("span", kp, ce(a.verification.message), 1)
          ])) : ee("", !0)
        ], 2),
        R("div", Ip, [
          re(t.$slots, "suffix", {}, void 0, !0),
          a.showCodeEditIcon ? (C(), ue(ar(a.CodeConfigurator), Rn({
            key: 0,
            ref: "editorModalRef"
          }, a.widget.props, {
            "model-value": a.bindValue,
            meta: r.property,
            label: a.propLabel,
            language: "json",
            "onUpdate:modelValue": a.onModelUpdate
          }), {
            default: M(() => [
              O(c, {
                class: "item",
                effect: "light",
                content: "源码编辑",
                placement: "left"
              }, {
                default: M(() => [
                  O(l, {
                    class: "code-icon",
                    onClick: e[0] || (e[0] = (d) => {
                      var h;
                      return ((h = a.editorModalRef) == null ? void 0 : h.open) && a.editorModalRef.open();
                    })
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 16, ["model-value", "meta", "label", "onUpdate:modelValue"])) : ee("", !0),
          r.isTopLayer && !r.onlyEdit && r.property.bindState !== !1 && !a.isRelatedComponents(a.widget.component) ? (C(), ue(ar(a.VariableConfigurator), {
            key: 1,
            "model-value": a.widget.props.modelValue,
            name: a.widget.props.name,
            "onUpdate:modelValue": a.onModelUpdate
          }, null, 8, ["model-value", "name", "onUpdate:modelValue"])) : ee("", !0)
        ])
      ])
    ], 2)
  ], 6));
}
const ll = /* @__PURE__ */ me(bp, [["render", Rp], ["__scopeId", "data-v-a9b4f28a"]]), Tp = {}, Ap = { class: "button-group" };
function Op(t, e) {
  return C(), $("div", Ap, [
    re(t.$slots, "default", {}, void 0, !0)
  ]);
}
const Dp = /* @__PURE__ */ me(Tp, [["render", Op], ["__scopeId", "data-v-bcbe223f"]]), Lp = {
  components: {
    TinyTooltip: qr
  },
  props: {
    tips: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom"
    },
    name: {
      type: String,
      default: "add"
    },
    hoverBgColor: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["click"],
  setup(t, { emit: e }) {
    return {
      isTinyIcon: ie(() => t.name.toLowerCase().indexOf("icon") === 0),
      handleClick: (n) => {
        var s;
        (s = n.target) == null || s.blur(), e("click", n);
      }
    };
  }
};
function Np(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("tiny-tooltip");
  return C(), $("span", {
    class: Ye(["svg-button", { "svg-button-hover": r.hoverBgColor }]),
    onClick: e[0] || (e[0] = (l) => a.handleClick(l))
  }, [
    O(i, {
      effect: "light",
      content: r.tips,
      placement: r.placement
    }, {
      default: M(() => [
        a.isTinyIcon ? (C(), ue(ar(r.name), { key: 0 })) : (C(), ue(o, {
          key: 1,
          name: r.name
        }, null, 8, ["name"]))
      ]),
      _: 1
    }, 8, ["content", "placement"])
  ], 2);
}
const cl = /* @__PURE__ */ me(Lp, [["render", Np], ["__scopeId", "data-v-60df7044"]]), pn = {
  FULL_SCREEN_CHANGE: "fullScreenChange",
  SAVE: "save",
  CANCEL: "cancel",
  ADD: "add",
  CLICK: "click"
}, $p = {
  components: {
    TinyButton: dr,
    SvgButton: cl,
    ButtonGroup: Dp
  },
  props: {
    /**
     * plugin-setting面板标题
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * 是否为二级展开面板
     */
    isSecond: {
      type: Boolean,
      default: !1
    },
    /**
     * 是否为全屏显示
     */
    isFullScreen: {
      type: Boolean,
      default: !1
    },
    showIfFullScreen: {
      type: Boolean,
      default: !1
    },
    /**
     * 是否为图标按钮
     */
    isIconButton: {
      type: Boolean,
      default: !1
    },
    iconButtonText: {
      type: String,
      default: "新增数据"
    },
    icon: {
      type: Object,
      default: Fh()
    },
    fixedName: {
      type: String,
      default: ""
    },
    align: {
      type: String,
      default: "leftTop"
    }
  },
  emits: [pn.FULL_SCREEN_CHANGE, pn.SAVE, pn.CANCEL, pn.ADD, pn.CLICK],
  setup(t, { emit: e }) {
    const r = yt({
      isFullScreen: !1
    }), { getPluginWidth: a } = Hr(), n = ie(() => a(t.fixedName) - 1), s = ie(() => t.align.includes("left") ? "left" : "right"), o = ie(() => `${s.value} : ${n.value}px`), i = ie(() => {
      var h;
      const d = ((h = document.querySelector(".plugin-setting")) == null ? void 0 : h.clientWidth) + n.value;
      return `${s.value} : ${d.value}px`;
    });
    Sr(() => {
      var h;
      const d = ((h = document.querySelector(".plugin-setting")) == null ? void 0 : h.clientWidth) + n.value;
      ca(() => {
        var f;
        (f = document.querySelector(".second-panel")) == null || f.style.setProperty(s.value, `${d}px`);
      });
    }), Sr(() => {
      r.isFullScreen = t.isFullScreen;
    });
    const l = () => {
      r.isFullScreen = !r.isFullScreen, e(pn.FULL_SCREEN_CHANGE, r.isFullScreen);
    }, c = (d) => d ? "收起" : "全屏查看", u = ie(() => t.isSecond ? "" : t.align.includes("right") ? "shadow-right" : "shadow-left");
    return {
      alignStyle: o,
      secondAlignStyle: i,
      shadowClass: u,
      firstPanelOffset: n,
      state: r,
      fullScreen: l,
      getFullScreenLabel: c
    };
  }
}, Mp = { class: "plugin-setting-header" }, Fp = { class: "plugin-setting-header-title" }, jp = { class: "button-group-wrap" }, Bp = { class: "plugin-setting-content lowcode-scrollbar" };
function Up(t, e, r, a, n, s) {
  const o = F("tiny-button"), i = F("svg-button"), l = F("button-group");
  return C(), $("div", {
    id: "panel-setting",
    class: Ye([
      "plugin-setting",
      { "second-panel": r.isSecond },
      { "full-screen": a.state.isFullScreen },
      { "align-right": r.align.includes("right") },
      a.shadowClass
    ]),
    style: Fn(r.isSecond ? a.secondAlignStyle : a.alignStyle),
    onClick: e[4] || (e[4] = (c) => t.$emit("click"))
  }, [
    R("div", Mp, [
      re(t.$slots, "title", {}, () => [
        R("span", Fp, ce(r.title), 1)
      ], !0),
      R("div", jp, [
        re(t.$slots, "header", {}, () => [
          O(l, null, {
            default: M(() => [
              r.isIconButton ? ee("", !0) : (C(), ue(o, {
                key: 0,
                type: "info",
                onClick: e[0] || (e[0] = (c) => t.$emit("save")),
                class: "plugin-save"
              }, {
                default: M(() => [
                  Se("保存")
                ]),
                _: 1
              })),
              r.isIconButton ? (C(), ue(o, {
                key: 1,
                icon: r.icon,
                type: "info",
                onClick: e[1] || (e[1] = (c) => t.$emit("add"))
              }, {
                default: M(() => [
                  Se(ce(r.iconButtonText), 1)
                ]),
                _: 1
              }, 8, ["icon"])) : ee("", !0),
              r.showIfFullScreen ? (C(), $("div", {
                key: 2,
                class: "cursor",
                onClick: e[2] || (e[2] = (...c) => a.fullScreen && a.fullScreen(...c))
              }, [
                a.state.isFullScreen ? ee("", !0) : (C(), ue(i, {
                  key: 0,
                  name: "full-screen"
                })),
                a.state.isFullScreen ? (C(), ue(i, {
                  key: 1,
                  name: "cancel-full-screen"
                })) : ee("", !0)
              ])) : ee("", !0),
              O(i, {
                name: "close",
                onClick: e[3] || (e[3] = (c) => t.$emit("cancel"))
              })
            ]),
            _: 1
          })
        ], !0)
      ])
    ]),
    re(t.$slots, "progress", {}, void 0, !0),
    R("div", Bp, [
      re(t.$slots, "content", {}, void 0, !0)
    ])
  ], 6);
}
const Jx = /* @__PURE__ */ me($p, [["render", Up], ["__scopeId", "data-v-930d639c"]]), Vp = {
  components: {
    TinyTooltip: Ih
  },
  props: {
    href: {
      type: String,
      default: ""
    },
    tips: {
      type: String,
      default: "帮助"
    }
  }
}, zp = { class: "link-button" }, qp = { class: "tip-content" }, Hp = ["href"];
function Zp(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("tiny-tooltip");
  return C(), $("span", zp, [
    O(i, {
      effect: "light",
      content: r.tips
    }, {
      content: M(() => [
        R("div", qp, ce(r.tips), 1),
        r.href ? (C(), $("a", {
          key: 0,
          class: "tip-jump",
          href: r.href,
          target: "_blank"
        }, [
          O(o, { name: "jump" }),
          Se(" 查看详情 ")
        ], 8, Hp)) : ee("", !0)
      ]),
      default: M(() => [
        O(o, { name: "plugin-icon-plugin-help" })
      ]),
      _: 1
    }, 8, ["content"])
  ]);
}
const Wp = /* @__PURE__ */ me(Vp, [["render", Zp], ["__scopeId", "data-v-717dc5ca"]]), Jp = {
  props: {
    name: {
      type: String,
      default: "cross"
    }
  },
  setup(t) {
    return {
      isTinyIcon: ie(() => t.name.toLowerCase().indexOf("icon") === 0)
    };
  }
};
function Qp(t, e, r, a, n, s) {
  const o = F("svg-icon");
  return C(), $("span", {
    class: "icon-wrap",
    onClick: e[0] || (e[0] = (i) => t.$emit("close"))
  }, [
    a.isTinyIcon ? (C(), ue(ar(r.name), { key: 0 })) : (C(), ue(o, {
      key: 1,
      name: r.name
    }, null, 8, ["name"]))
  ]);
}
const Gp = /* @__PURE__ */ me(Jp, [["render", Qp], ["__scopeId", "data-v-5e0ce604"]]), Kp = {
  components: {
    TinyTooltip: qr,
    LinkButton: Wp,
    CloseIcon: Gp,
    SvgButton: Gh
  },
  props: {
    /**
     * plugin面板标题
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * 关闭图标是否在左侧
     */
    isCloseLeft: {
      type: Boolean,
      default: !1
    },
    name: {
      type: String,
      default: "cross"
    },
    docsUrl: {
      type: String,
      default: ""
    },
    docsContent: {
      type: String,
      default: ""
    },
    isShowDocsIcon: {
      type: Boolean,
      default: !1
    },
    /**
     * 固定面板插件数组
     */
    fixedPanels: {
      type: Array
    },
    /**
     * 固定面板标识
     */
    fixedName: {
      type: String
    },
    /**
     * 是否展示标题下边线
     */
    showBottomBorder: {
      type: Boolean,
      default: !1
    },
    /**
     * 是否展示折叠按钮
     */
    isShowCollapseIcon: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["close", "updateCollapseStatus"],
  setup(t, { emit: e }) {
    const r = () => {
      e("close");
    }, { PLUGIN_DEFAULT_WIDTH: a } = Bs, n = a, s = 1e3, o = Ce(null);
    let i = 0, l = 0, c = null;
    const u = Ce(!1), d = ie(() => u.value ? "collapse_all" : "expand_all");
    Qa("isCollapsed", u);
    const h = tn("panelState"), f = () => {
      h == null || h.emitEvent("fixPanel", t.fixedName);
    }, m = ie(() => t.showBottomBorder ? "header-bottom-line" : ""), { getPluginWidth: p, changePluginWidth: v, getPluginByLayout: y, changeMoveDragBarState: b, isPanelWidthResizable: _ } = Hr(), E = Ce(y(t.fixedName)), P = Ce(p(t.fixedName)), A = Ce(E.value.includes("left")), k = Ce(E.value.includes("right")), B = ie(() => _(t.fixedName)), L = (Te) => {
      c && cancelAnimationFrame(c), c = requestAnimationFrame(() => {
        P.value = Math.max(n, Math.min(Te, s)), v(t.fixedName, P.value);
      });
    }, H = (Te) => {
      const j = l + (Te.clientX - i);
      L(j);
    }, J = (Te) => {
      const j = l - (Te.clientX - i);
      L(j);
    }, q = pc(H, 16), N = pc(J, 16), D = Ce(null), Q = Ce(null), ae = () => {
      b(!1), document.removeEventListener("mousemove", q), document.removeEventListener("mouseup", ae), document.body.style.cursor = "", Q.value && Q.value.classList.remove("dragging"), c && (cancelAnimationFrame(c), c = null);
    }, de = (Te) => {
      var j;
      b(!0), i = Te.clientX, l = ((j = o.value) == null ? void 0 : j.offsetWidth) || 0, document.addEventListener("mousemove", q), document.addEventListener("mouseup", ae), document.body.style.cursor = "col-resize", Q.value && Q.value.classList.add("dragging");
    }, le = () => {
      b(!1), document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", le), document.body.style.cursor = "", D.value && D.value.classList.remove("dragging"), c && (cancelAnimationFrame(c), c = null);
    }, ge = (Te) => {
      var j;
      b(!0), i = Te.clientX, l = ((j = o.value) == null ? void 0 : j.offsetWidth) || 0, document.addEventListener("mousemove", N), document.addEventListener("mouseup", le), document.body.style.cursor = "col-resize", D.value && D.value.classList.add("dragging");
    }, se = () => {
      const Te = document.querySelector(".resizer-left"), j = document.querySelector(".resizer-right");
      Te instanceof HTMLElement && (D.value = Te), j instanceof HTMLElement && (Q.value = j);
    }, je = () => {
      u.value = !u.value, e("updateCollapseStatus", u.value);
    };
    return Ds(() => {
      se();
    }), {
      isWidthResizable: B,
      headerBottomLine: m,
      clickCollapseIcon: je,
      isCollapsed: u,
      settingIcon: d,
      closePanel: r,
      fixPanel: f,
      panel: o,
      panelWidth: P,
      onMouseDownRight: de,
      onMouseDownLeft: ge,
      isLeftResizer: A,
      isRightResizer: k
    };
  }
}, Yp = { class: "plugin-panel-title" }, Xp = { class: "title" }, em = { class: "plugin-panel-icon" }, tm = { class: "scroll-content" }, rm = { key: 0 };
function nm(t, e, r, a, n, s) {
  var u, d;
  const o = F("link-button"), i = F("close-icon"), l = F("svg-button"), c = F("tiny-tooltip");
  return C(), $("div", {
    class: "plugin-panel",
    ref: "panel",
    style: Fn({ width: a.panelWidth + "px" })
  }, [
    R("div", {
      class: Ye(["plugin-panel-header", a.headerBottomLine])
    }, [
      R("div", Yp, [
        R("span", Xp, [
          Se(ce(r.title), 1),
          r.isShowDocsIcon ? (C(), ue(o, {
            key: 0,
            class: "link",
            tips: r.docsContent,
            href: r.docsUrl
          }, null, 8, ["tips", "href"])) : ee("", !0)
        ]),
        r.isCloseLeft ? (C(), ue(i, {
          key: 0,
          name: r.name,
          onClose: a.closePanel
        }, null, 8, ["name", "onClose"])) : ee("", !0)
      ]),
      R("div", em, [
        re(t.$slots, "header", {}, void 0, !0),
        r.isShowCollapseIcon ? (C(), ue(c, {
          key: 0,
          effect: "light",
          content: a.isCollapsed ? "展开" : "折叠",
          placement: "top",
          "visible-arrow": !1
        }, {
          default: M(() => [
            O(l, {
              name: a.settingIcon,
              onClick: a.clickCollapseIcon
            }, null, 8, ["name", "onClick"])
          ]),
          _: 1
        }, 8, ["content"])) : ee("", !0),
        O(l, {
          class: "item icon-sidebar",
          name: (u = r.fixedPanels) != null && u.includes(r.fixedName) ? "fixed-solid" : "fixed",
          tips: (d = r.fixedPanels) != null && d.includes(r.fixedName) ? "解除固定面板" : "固定面板",
          onClick: a.fixPanel
        }, null, 8, ["name", "tips", "onClick"]),
        r.isCloseLeft ? ee("", !0) : (C(), ue(i, {
          key: 1,
          name: r.name,
          onClose: a.closePanel
        }, null, 8, ["name", "onClose"]))
      ])
    ], 2),
    R("div", tm, [
      re(t.$slots, "content", {}, void 0, !0)
    ]),
    a.isWidthResizable ? (C(), $("div", rm, [
      a.isLeftResizer ? (C(), $("div", {
        key: 0,
        class: "resizer-right",
        onMousedown: e[0] || (e[0] = (...h) => a.onMouseDownRight && a.onMouseDownRight(...h))
      }, null, 32)) : ee("", !0),
      a.isRightResizer ? (C(), $("div", {
        key: 1,
        class: "resizer-left",
        onMousedown: e[1] || (e[1] = (...h) => a.onMouseDownLeft && a.onMouseDownLeft(...h))
      }, null, 32)) : ee("", !0)
    ])) : ee("", !0)
  ], 4);
}
const Qx = /* @__PURE__ */ me(Kp, [["render", nm], ["__scopeId", "data-v-244112f9"]]), am = {
  props: {
    list: {
      type: Array
    },
    align: {
      type: String,
      default: "left"
    }
  },
  emits: ["close", "switchAlign"],
  setup(t, { emit: e }) {
    const { getPluginShown: r, changePluginShown: a, changeMenuShown: n } = Hr(), s = Ce(""), o = yt({
      type: !0,
      visible: !1,
      x: 0,
      y: 0,
      item: null,
      index: null,
      list: null
    }), i = t.align.includes("right") ? 130 : 0, l = (p, v, y, b, _, E) => {
      const P = window.innerHeight;
      o.type = y, o.visible = !0, ca(() => {
        const A = document.querySelector(".plugin-context-menu"), k = A == null ? void 0 : A.offsetHeight, B = P - v - 20;
        k && B < k ? o.y = v - k : o.y = v, o.x = p - i;
      }), y && (o.item = b, o.index = _, s.value = E);
    }, c = () => {
      o.visible = !1;
    }, u = () => {
      e("close"), a(o.item.id), c();
    }, d = () => {
      e("close"), e("switchAlign", o.index, o.item.id, s.value), c();
    }, h = () => {
      const p = t.align.includes("right") ? "right" : "left";
      n(p), c();
    }, f = (p) => {
      a(p);
    }, m = (p) => {
      p.target.closest(".plugin-context-menu") || c();
    };
    return Ds(() => {
      document.addEventListener("click", m);
    }), nl(() => {
      document.removeEventListener("click", m);
    }), {
      contextMenu: o,
      showContextMenu: l,
      changeShowState: f,
      getPluginShown: r,
      hidePlugin: u,
      switchAlign: d,
      hideSidebar: h
    };
  }
};
function sm(t, e, r, a, n, s) {
  return ee("", !0);
}
const Gx = /* @__PURE__ */ me(am, [["render", sm], ["__scopeId", "data-v-810dc423"]]), om = {
  components: {
    TinyCollapse: Uu,
    TinyCollapseItem: Bu,
    ConfigGroup: Ju,
    ConfigItem: ll
  },
  props: {
    data: {
      type: [Array, Object],
      default: () => []
    },
    design: Boolean,
    emptyText: {
      type: String,
      default: "空"
    }
  },
  emits: ["selected", "select-prop", "select-group"],
  setup(t, { emit: e }) {
    const r = Ce([]), a = (c) => {
      const u = {};
      return c == null || c.forEach(({ content: d }) => {
        d.length && d.forEach(
          (h) => {
            var m;
            const f = (m = h.schema) != null && m.length ? a(h.schema) : {};
            f.setValue = (p) => {
              h.widget.props.modelValue = p;
            }, u[h.property] = f;
          }
        );
      }), u;
    }, n = ie(() => a(t.data || []));
    Qa("propsObj", n);
    const s = (c) => e("select-prop", c), o = (c) => e("select-group", c), i = (c) => {
      var u, d, h;
      return ((h = (d = (u = c == null ? void 0 : c.filter) == null ? void 0 : u.call(c, (f) => !f.fold)) == null ? void 0 : d.map) == null ? void 0 : h.call(d, (f, m) => m)) || [];
    };
    Sr(() => {
      r.value = i(t.data);
    });
    const l = ie(() => t.data);
    return { onPropClick: s, onGroupClick: o, activeNames: r, properties: l };
  }
}, im = { class: "properties-list" }, lm = ["onClick"];
function cm(t, e, r, a, n, s) {
  const o = F("config-item"), i = F("config-group"), l = F("tiny-collapse-item"), c = F("tiny-collapse");
  return C(), $("div", im, [
    O(c, {
      modelValue: a.activeNames,
      "onUpdate:modelValue": e[0] || (e[0] = (u) => a.activeNames = u)
    }, {
      default: M(() => [
        (C(!0), $(Xe, null, Pt(r.data, (u, d) => (C(), ue(l, {
          key: u,
          name: d
        }, {
          title: M(() => [
            re(t.$slots, "title", { group: u }, () => {
              var h;
              return [
                R("div", {
                  onClick: (f) => a.onGroupClick(u)
                }, ce(((h = u.label) == null ? void 0 : h.zh_CN) || ""), 9, lm)
              ];
            })
          ]),
          default: M(() => [
            O(i, {
              group: u,
              index: d,
              design: r.design,
              emptyText: r.emptyText
            }, {
              item: M(({ data: h, propIndex: f }) => [
                (C(), ue(o, {
                  key: f,
                  properties: a.properties,
                  property: h,
                  "data-prop-index": f,
                  "data-group-index": d,
                  isTopLayer: !0,
                  group: u,
                  onClick: (m) => a.onPropClick(h)
                }, gh({
                  prefix: M(() => [
                    re(t.$slots, "prefix", { data: h })
                  ]),
                  _: 2
                }, [
                  h.noBinding ? void 0 : {
                    name: "suffix",
                    fn: M(() => [
                      re(t.$slots, "suffix", { data: h })
                    ]),
                    key: "0"
                  }
                ]), 1032, ["properties", "property", "data-prop-index", "data-group-index", "group", "onClick"]))
              ]),
              _: 2
            }, 1032, ["group", "index", "design", "emptyText"])
          ]),
          _: 2
        }, 1032, ["name"]))), 128))
      ]),
      _: 3
    }, 8, ["modelValue"])
  ]);
}
const Kx = /* @__PURE__ */ me(om, [["render", cm]]), um = {
  components: {
    TinyForm: $s,
    TinyFormItem: Ns,
    TinyInput: cn,
    TinyButton: dr
  },
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    footerbtnHide: {
      type: Boolean,
      default: !1
    }
  },
  setup(t, { emit: e }) {
    const r = Object.keys(t.option), a = yt({ ...t.option });
    return {
      labelList: r,
      formData: a,
      labelTranslations: {
        label: "显示值",
        text: "展示值",
        zh_CN: "中文",
        en_US: "英文",
        field: "field",
        title: "title",
        description: "描述",
        defaultValue: "缺省值"
      },
      cancel: () => {
        e("cancel");
      },
      confirm: () => {
        e("confirm", a);
      }
    };
  }
}, dm = { class: "demo-form" };
function fm(t, e, r, a, n, s) {
  const o = F("tiny-input"), i = F("tiny-form-item"), l = F("tiny-button"), c = F("tiny-form");
  return C(), $("div", dm, [
    O(c, {
      "label-position": "left",
      "label-width": "53px"
    }, {
      default: M(() => [
        (C(!0), $(Xe, null, Pt(a.labelList, (u) => (C(), $(Xe, { key: u }, [
          a.labelTranslations[u] ? (C(), ue(i, {
            key: 0,
            label: a.labelTranslations[u] || u
          }, {
            default: M(() => [
              O(o, {
                modelValue: a.formData[u],
                "onUpdate:modelValue": (d) => a.formData[u] = d
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ]),
            _: 2
          }, 1032, ["label"])) : ee("", !0)
        ], 64))), 128)),
        O(i, {
          class: Ye({ footerbtnHide: r.footerbtnHide })
        }, {
          default: M(() => [
            O(l, { onClick: a.cancel }, {
              default: M(() => [
                Se("取消")
              ]),
              _: 1
            }, 8, ["onClick"]),
            O(l, { onClick: a.confirm }, {
              default: M(() => [
                Se("确定")
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["class"])
      ]),
      _: 1
    })
  ]);
}
const hm = /* @__PURE__ */ me(um, [["render", fm], ["__scopeId", "data-v-deabf0b2"]]), pm = {
  components: {
    TinyTooltip: qr
  },
  props: {
    actions: {
      type: Array,
      default: () => []
    }
  },
  setup(t, { emit: e }) {
    return {
      actionsEvents: (a) => {
        e("actionEvents", a);
      }
    };
  }
}, mm = ["onClick"];
function vm(t, e, r, a, n, s) {
  const o = F("tiny-tooltip");
  return C(!0), $(Xe, null, Pt(r.actions, (i, l) => (C(), $("span", {
    key: l,
    class: "actionsItem",
    onClick: (c) => a.actionsEvents(i)
  }, [
    O(o, {
      class: "item",
      effect: "light",
      content: i.title,
      placement: "top"
    }, {
      default: M(() => [
        (C(), ue(ar(i.icon)))
      ]),
      _: 2
    }, 1032, ["content"])
  ], 8, mm))), 128);
}
const Yx = /* @__PURE__ */ me(pm, [["render", vm], ["__scopeId", "data-v-3984036f"]]), gm = {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
function _m(t, e, r, a, n, s) {
  return C(), $("div", null, ce(r.title), 1);
}
const Xx = /* @__PURE__ */ me(gm, [["render", _m]]);
/*!
  * vue-draggable-next v2.2.0
  * (c) 2023 Anish George
  * @license MIT
  */
/**!
 * Sortable 1.14.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function gc(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(t);
    e && (a = a.filter(function(n) {
      return Object.getOwnPropertyDescriptor(t, n).enumerable;
    })), r.push.apply(r, a);
  }
  return r;
}
function ir(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? gc(Object(r), !0).forEach(function(a) {
      ym(t, a, r[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : gc(Object(r)).forEach(function(a) {
      Object.defineProperty(t, a, Object.getOwnPropertyDescriptor(r, a));
    });
  }
  return t;
}
function Fa(t) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Fa = function(e) {
    return typeof e;
  } : Fa = function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Fa(t);
}
function ym(t, e, r) {
  return e in t ? Object.defineProperty(t, e, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = r, t;
}
function Pr() {
  return Pr = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var a in r)
        Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
    }
    return t;
  }, Pr.apply(this, arguments);
}
function bm(t, e) {
  if (t == null) return {};
  var r = {}, a = Object.keys(t), n, s;
  for (s = 0; s < a.length; s++)
    n = a[s], !(e.indexOf(n) >= 0) && (r[n] = t[n]);
  return r;
}
function wm(t, e) {
  if (t == null) return {};
  var r = bm(t, e), a, n;
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(t);
    for (n = 0; n < s.length; n++)
      a = s[n], !(e.indexOf(a) >= 0) && Object.prototype.propertyIsEnumerable.call(t, a) && (r[a] = t[a]);
  }
  return r;
}
var Em = "1.14.0";
function wr(t) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(t);
}
var kr = wr(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), fa = wr(/Edge/i), _c = wr(/firefox/i), ta = wr(/safari/i) && !wr(/chrome/i) && !wr(/android/i), Qu = wr(/iP(ad|od|hone)/i), Sm = wr(/chrome/i) && wr(/android/i), Gu = {
  capture: !1,
  passive: !1
};
function $e(t, e, r) {
  t.addEventListener(e, r, !kr && Gu);
}
function De(t, e, r) {
  t.removeEventListener(e, r, !kr && Gu);
}
function Ya(t, e) {
  if (e) {
    if (e[0] === ">" && (e = e.substring(1)), t)
      try {
        if (t.matches)
          return t.matches(e);
        if (t.msMatchesSelector)
          return t.msMatchesSelector(e);
        if (t.webkitMatchesSelector)
          return t.webkitMatchesSelector(e);
      } catch {
        return !1;
      }
    return !1;
  }
}
function Pm(t) {
  return t.host && t !== document && t.host.nodeType ? t.host : t.parentNode;
}
function tr(t, e, r, a) {
  if (t) {
    r = r || document;
    do {
      if (e != null && (e[0] === ">" ? t.parentNode === r && Ya(t, e) : Ya(t, e)) || a && t === r)
        return t;
      if (t === r) break;
    } while (t = Pm(t));
  }
  return null;
}
var yc = /\s+/g;
function Mt(t, e, r) {
  if (t && e)
    if (t.classList)
      t.classList[r ? "add" : "remove"](e);
    else {
      var a = (" " + t.className + " ").replace(yc, " ").replace(" " + e + " ", " ");
      t.className = (a + (r ? " " + e : "")).replace(yc, " ");
    }
}
function fe(t, e, r) {
  var a = t && t.style;
  if (a) {
    if (r === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? r = document.defaultView.getComputedStyle(t, "") : t.currentStyle && (r = t.currentStyle), e === void 0 ? r : r[e];
    !(e in a) && e.indexOf("webkit") === -1 && (e = "-webkit-" + e), a[e] = r + (typeof r == "string" ? "" : "px");
  }
}
function xn(t, e) {
  var r = "";
  if (typeof t == "string")
    r = t;
  else
    do {
      var a = fe(t, "transform");
      a && a !== "none" && (r = a + " " + r);
    } while (!e && (t = t.parentNode));
  var n = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return n && new n(r);
}
function Ku(t, e, r) {
  if (t) {
    var a = t.getElementsByTagName(e), n = 0, s = a.length;
    if (r)
      for (; n < s; n++)
        r(a[n], n);
    return a;
  }
  return [];
}
function sr() {
  var t = document.scrollingElement;
  return t || document.documentElement;
}
function ft(t, e, r, a, n) {
  if (!(!t.getBoundingClientRect && t !== window)) {
    var s, o, i, l, c, u, d;
    if (t !== window && t.parentNode && t !== sr() ? (s = t.getBoundingClientRect(), o = s.top, i = s.left, l = s.bottom, c = s.right, u = s.height, d = s.width) : (o = 0, i = 0, l = window.innerHeight, c = window.innerWidth, u = window.innerHeight, d = window.innerWidth), (e || r) && t !== window && (n = n || t.parentNode, !kr))
      do
        if (n && n.getBoundingClientRect && (fe(n, "transform") !== "none" || r && fe(n, "position") !== "static")) {
          var h = n.getBoundingClientRect();
          o -= h.top + parseInt(fe(n, "border-top-width")), i -= h.left + parseInt(fe(n, "border-left-width")), l = o + s.height, c = i + s.width;
          break;
        }
      while (n = n.parentNode);
    if (a && t !== window) {
      var f = xn(n || t), m = f && f.a, p = f && f.d;
      f && (o /= p, i /= m, d /= m, u /= p, l = o + u, c = i + d);
    }
    return {
      top: o,
      left: i,
      bottom: l,
      right: c,
      width: d,
      height: u
    };
  }
}
function bc(t, e, r) {
  for (var a = Mr(t, !0), n = ft(t)[e]; a; ) {
    var s = ft(a)[r], o = void 0;
    if (o = n >= s, !o) return a;
    if (a === sr()) break;
    a = Mr(a, !1);
  }
  return !1;
}
function An(t, e, r, a) {
  for (var n = 0, s = 0, o = t.children; s < o.length; ) {
    if (o[s].style.display !== "none" && o[s] !== he.ghost && (a || o[s] !== he.dragged) && tr(o[s], r.draggable, t, !1)) {
      if (n === e)
        return o[s];
      n++;
    }
    s++;
  }
  return null;
}
function ul(t, e) {
  for (var r = t.lastElementChild; r && (r === he.ghost || fe(r, "display") === "none" || e && !Ya(r, e)); )
    r = r.previousElementSibling;
  return r || null;
}
function Ut(t, e) {
  var r = 0;
  if (!t || !t.parentNode)
    return -1;
  for (; t = t.previousElementSibling; )
    t.nodeName.toUpperCase() !== "TEMPLATE" && t !== he.clone && (!e || Ya(t, e)) && r++;
  return r;
}
function wc(t) {
  var e = 0, r = 0, a = sr();
  if (t)
    do {
      var n = xn(t), s = n.a, o = n.d;
      e += t.scrollLeft * s, r += t.scrollTop * o;
    } while (t !== a && (t = t.parentNode));
  return [e, r];
}
function xm(t, e) {
  for (var r in t)
    if (t.hasOwnProperty(r)) {
      for (var a in e)
        if (e.hasOwnProperty(a) && e[a] === t[r][a]) return Number(r);
    }
  return -1;
}
function Mr(t, e) {
  if (!t || !t.getBoundingClientRect) return sr();
  var r = t, a = !1;
  do
    if (r.clientWidth < r.scrollWidth || r.clientHeight < r.scrollHeight) {
      var n = fe(r);
      if (r.clientWidth < r.scrollWidth && (n.overflowX == "auto" || n.overflowX == "scroll") || r.clientHeight < r.scrollHeight && (n.overflowY == "auto" || n.overflowY == "scroll")) {
        if (!r.getBoundingClientRect || r === document.body) return sr();
        if (a || e) return r;
        a = !0;
      }
    }
  while (r = r.parentNode);
  return sr();
}
function Cm(t, e) {
  if (t && e)
    for (var r in e)
      e.hasOwnProperty(r) && (t[r] = e[r]);
  return t;
}
function fo(t, e) {
  return Math.round(t.top) === Math.round(e.top) && Math.round(t.left) === Math.round(e.left) && Math.round(t.height) === Math.round(e.height) && Math.round(t.width) === Math.round(e.width);
}
var ra;
function Yu(t, e) {
  return function() {
    if (!ra) {
      var r = arguments, a = this;
      r.length === 1 ? t.call(a, r[0]) : t.apply(a, r), ra = setTimeout(function() {
        ra = void 0;
      }, e);
    }
  };
}
function km() {
  clearTimeout(ra), ra = void 0;
}
function Xu(t, e, r) {
  t.scrollLeft += e, t.scrollTop += r;
}
function ed(t) {
  var e = window.Polymer, r = window.jQuery || window.Zepto;
  return e && e.dom ? e.dom(t).cloneNode(!0) : r ? r(t).clone(!0)[0] : t.cloneNode(!0);
}
var jt = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Im() {
  var t = [], e;
  return {
    captureAnimationState: function() {
      if (t = [], !!this.options.animation) {
        var a = [].slice.call(this.el.children);
        a.forEach(function(n) {
          if (!(fe(n, "display") === "none" || n === he.ghost)) {
            t.push({
              target: n,
              rect: ft(n)
            });
            var s = ir({}, t[t.length - 1].rect);
            if (n.thisAnimationDuration) {
              var o = xn(n, !0);
              o && (s.top -= o.f, s.left -= o.e);
            }
            n.fromRect = s;
          }
        });
      }
    },
    addAnimationState: function(a) {
      t.push(a);
    },
    removeAnimationState: function(a) {
      t.splice(xm(t, {
        target: a
      }), 1);
    },
    animateAll: function(a) {
      var n = this;
      if (!this.options.animation) {
        clearTimeout(e), typeof a == "function" && a();
        return;
      }
      var s = !1, o = 0;
      t.forEach(function(i) {
        var l = 0, c = i.target, u = c.fromRect, d = ft(c), h = c.prevFromRect, f = c.prevToRect, m = i.rect, p = xn(c, !0);
        p && (d.top -= p.f, d.left -= p.e), c.toRect = d, c.thisAnimationDuration && fo(h, d) && !fo(u, d) && // Make sure animatingRect is on line between toRect & fromRect
        (m.top - d.top) / (m.left - d.left) === (u.top - d.top) / (u.left - d.left) && (l = Tm(m, h, f, n.options)), fo(d, u) || (c.prevFromRect = u, c.prevToRect = d, l || (l = n.options.animation), n.animate(c, m, d, l)), l && (s = !0, o = Math.max(o, l), clearTimeout(c.animationResetTimer), c.animationResetTimer = setTimeout(function() {
          c.animationTime = 0, c.prevFromRect = null, c.fromRect = null, c.prevToRect = null, c.thisAnimationDuration = null;
        }, l), c.thisAnimationDuration = l);
      }), clearTimeout(e), s ? e = setTimeout(function() {
        typeof a == "function" && a();
      }, o) : typeof a == "function" && a(), t = [];
    },
    animate: function(a, n, s, o) {
      if (o) {
        fe(a, "transition", ""), fe(a, "transform", "");
        var i = xn(this.el), l = i && i.a, c = i && i.d, u = (n.left - s.left) / (l || 1), d = (n.top - s.top) / (c || 1);
        a.animatingX = !!u, a.animatingY = !!d, fe(a, "transform", "translate3d(" + u + "px," + d + "px,0)"), this.forRepaintDummy = Rm(a), fe(a, "transition", "transform " + o + "ms" + (this.options.easing ? " " + this.options.easing : "")), fe(a, "transform", "translate3d(0,0,0)"), typeof a.animated == "number" && clearTimeout(a.animated), a.animated = setTimeout(function() {
          fe(a, "transition", ""), fe(a, "transform", ""), a.animated = !1, a.animatingX = !1, a.animatingY = !1;
        }, o);
      }
    }
  };
}
function Rm(t) {
  return t.offsetWidth;
}
function Tm(t, e, r, a) {
  return Math.sqrt(Math.pow(e.top - t.top, 2) + Math.pow(e.left - t.left, 2)) / Math.sqrt(Math.pow(e.top - r.top, 2) + Math.pow(e.left - r.left, 2)) * a.animation;
}
var mn = [], ho = {
  initializeByDefault: !0
}, ha = {
  mount: function(e) {
    for (var r in ho)
      ho.hasOwnProperty(r) && !(r in e) && (e[r] = ho[r]);
    mn.forEach(function(a) {
      if (a.pluginName === e.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(e.pluginName, " more than once");
    }), mn.push(e);
  },
  pluginEvent: function(e, r, a) {
    var n = this;
    this.eventCanceled = !1, a.cancel = function() {
      n.eventCanceled = !0;
    };
    var s = e + "Global";
    mn.forEach(function(o) {
      r[o.pluginName] && (r[o.pluginName][s] && r[o.pluginName][s](ir({
        sortable: r
      }, a)), r.options[o.pluginName] && r[o.pluginName][e] && r[o.pluginName][e](ir({
        sortable: r
      }, a)));
    });
  },
  initializePlugins: function(e, r, a, n) {
    mn.forEach(function(i) {
      var l = i.pluginName;
      if (!(!e.options[l] && !i.initializeByDefault)) {
        var c = new i(e, r, e.options);
        c.sortable = e, c.options = e.options, e[l] = c, Pr(a, c.defaults);
      }
    });
    for (var s in e.options)
      if (e.options.hasOwnProperty(s)) {
        var o = this.modifyOption(e, s, e.options[s]);
        typeof o < "u" && (e.options[s] = o);
      }
  },
  getEventProperties: function(e, r) {
    var a = {};
    return mn.forEach(function(n) {
      typeof n.eventProperties == "function" && Pr(a, n.eventProperties.call(r[n.pluginName], e));
    }), a;
  },
  modifyOption: function(e, r, a) {
    var n;
    return mn.forEach(function(s) {
      e[s.pluginName] && s.optionListeners && typeof s.optionListeners[r] == "function" && (n = s.optionListeners[r].call(e[s.pluginName], a));
    }), n;
  }
};
function Am(t) {
  var e = t.sortable, r = t.rootEl, a = t.name, n = t.targetEl, s = t.cloneEl, o = t.toEl, i = t.fromEl, l = t.oldIndex, c = t.newIndex, u = t.oldDraggableIndex, d = t.newDraggableIndex, h = t.originalEvent, f = t.putSortable, m = t.extraEventProperties;
  if (e = e || r && r[jt], !!e) {
    var p, v = e.options, y = "on" + a.charAt(0).toUpperCase() + a.substr(1);
    window.CustomEvent && !kr && !fa ? p = new CustomEvent(a, {
      bubbles: !0,
      cancelable: !0
    }) : (p = document.createEvent("Event"), p.initEvent(a, !0, !0)), p.to = o || r, p.from = i || r, p.item = n || r, p.clone = s, p.oldIndex = l, p.newIndex = c, p.oldDraggableIndex = u, p.newDraggableIndex = d, p.originalEvent = h, p.pullMode = f ? f.lastPutMode : void 0;
    var b = ir(ir({}, m), ha.getEventProperties(a, e));
    for (var _ in b)
      p[_] = b[_];
    r && r.dispatchEvent(p), v[y] && v[y].call(e, p);
  }
}
var Om = ["evt"], Dt = function(e, r) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, n = a.evt, s = wm(a, Om);
  ha.pluginEvent.bind(he)(e, r, ir({
    dragEl: Z,
    parentEl: et,
    ghostEl: _e,
    rootEl: Qe,
    nextEl: Xr,
    lastDownEl: ja,
    cloneEl: tt,
    cloneHidden: Nr,
    dragStarted: Jn,
    putSortable: bt,
    activeSortable: he.active,
    originalEvent: n,
    oldIndex: Sn,
    oldDraggableIndex: na,
    newIndex: Ft,
    newDraggableIndex: Or,
    hideGhostForTarget: ad,
    unhideGhostForTarget: sd,
    cloneNowHidden: function() {
      Nr = !0;
    },
    cloneNowShown: function() {
      Nr = !1;
    },
    dispatchSortableEvent: function(i) {
      kt({
        sortable: r,
        name: i,
        originalEvent: n
      });
    }
  }, s));
};
function kt(t) {
  Am(ir({
    putSortable: bt,
    cloneEl: tt,
    targetEl: Z,
    rootEl: Qe,
    oldIndex: Sn,
    oldDraggableIndex: na,
    newIndex: Ft,
    newDraggableIndex: Or
  }, t));
}
var Z, et, _e, Qe, Xr, ja, tt, Nr, Sn, Ft, na, Or, Ia, bt, _n = !1, Xa = !1, es = [], Kr, Zt, po, mo, Ec, Sc, Jn, vn, aa, sa = !1, Ra = !1, Ba, St, vo = [], Ko = !1, ts = [], Us = typeof document < "u", Ta = Qu, Pc = fa || kr ? "cssFloat" : "float", Dm = Us && !Sm && !Qu && "draggable" in document.createElement("div"), td = function() {
  if (Us) {
    if (kr)
      return !1;
    var t = document.createElement("x");
    return t.style.cssText = "pointer-events:auto", t.style.pointerEvents === "auto";
  }
}(), rd = function(e, r) {
  var a = fe(e), n = parseInt(a.width) - parseInt(a.paddingLeft) - parseInt(a.paddingRight) - parseInt(a.borderLeftWidth) - parseInt(a.borderRightWidth), s = An(e, 0, r), o = An(e, 1, r), i = s && fe(s), l = o && fe(o), c = i && parseInt(i.marginLeft) + parseInt(i.marginRight) + ft(s).width, u = l && parseInt(l.marginLeft) + parseInt(l.marginRight) + ft(o).width;
  if (a.display === "flex")
    return a.flexDirection === "column" || a.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (a.display === "grid")
    return a.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (s && i.float && i.float !== "none") {
    var d = i.float === "left" ? "left" : "right";
    return o && (l.clear === "both" || l.clear === d) ? "vertical" : "horizontal";
  }
  return s && (i.display === "block" || i.display === "flex" || i.display === "table" || i.display === "grid" || c >= n && a[Pc] === "none" || o && a[Pc] === "none" && c + u > n) ? "vertical" : "horizontal";
}, Lm = function(e, r, a) {
  var n = a ? e.left : e.top, s = a ? e.right : e.bottom, o = a ? e.width : e.height, i = a ? r.left : r.top, l = a ? r.right : r.bottom, c = a ? r.width : r.height;
  return n === i || s === l || n + o / 2 === i + c / 2;
}, Nm = function(e, r) {
  var a;
  return es.some(function(n) {
    var s = n[jt].options.emptyInsertThreshold;
    if (!(!s || ul(n))) {
      var o = ft(n), i = e >= o.left - s && e <= o.right + s, l = r >= o.top - s && r <= o.bottom + s;
      if (i && l)
        return a = n;
    }
  }), a;
}, nd = function(e) {
  function r(s, o) {
    return function(i, l, c, u) {
      var d = i.options.group.name && l.options.group.name && i.options.group.name === l.options.group.name;
      if (s == null && (o || d))
        return !0;
      if (s == null || s === !1)
        return !1;
      if (o && s === "clone")
        return s;
      if (typeof s == "function")
        return r(s(i, l, c, u), o)(i, l, c, u);
      var h = (o ? i : l).options.group.name;
      return s === !0 || typeof s == "string" && s === h || s.join && s.indexOf(h) > -1;
    };
  }
  var a = {}, n = e.group;
  (!n || Fa(n) != "object") && (n = {
    name: n
  }), a.name = n.name, a.checkPull = r(n.pull, !0), a.checkPut = r(n.put), a.revertClone = n.revertClone, e.group = a;
}, ad = function() {
  !td && _e && fe(_e, "display", "none");
}, sd = function() {
  !td && _e && fe(_e, "display", "");
};
Us && document.addEventListener("click", function(t) {
  if (Xa)
    return t.preventDefault(), t.stopPropagation && t.stopPropagation(), t.stopImmediatePropagation && t.stopImmediatePropagation(), Xa = !1, !1;
}, !0);
var Yr = function(e) {
  if (Z) {
    e = e.touches ? e.touches[0] : e;
    var r = Nm(e.clientX, e.clientY);
    if (r) {
      var a = {};
      for (var n in e)
        e.hasOwnProperty(n) && (a[n] = e[n]);
      a.target = a.rootEl = r, a.preventDefault = void 0, a.stopPropagation = void 0, r[jt]._onDragOver(a);
    }
  }
}, $m = function(e) {
  Z && Z.parentNode[jt]._isOutsideThisEl(e.target);
};
function he(t, e) {
  if (!(t && t.nodeType && t.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(t));
  this.el = t, this.options = e = Pr({}, e), t[jt] = this;
  var r = {
    group: null,
    sort: !0,
    disabled: !1,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(t.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: !1,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: !0,
    direction: function() {
      return rd(t, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(o, i) {
      o.setData("Text", i.textContent);
    },
    dropBubble: !1,
    dragoverBubble: !1,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: !1,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: !1,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: !1,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: he.supportPointer !== !1 && "PointerEvent" in window && !ta,
    emptyInsertThreshold: 5
  };
  ha.initializePlugins(this, t, r);
  for (var a in r)
    !(a in e) && (e[a] = r[a]);
  nd(e);
  for (var n in this)
    n.charAt(0) === "_" && typeof this[n] == "function" && (this[n] = this[n].bind(this));
  this.nativeDraggable = e.forceFallback ? !1 : Dm, this.nativeDraggable && (this.options.touchStartThreshold = 1), e.supportPointer ? $e(t, "pointerdown", this._onTapStart) : ($e(t, "mousedown", this._onTapStart), $e(t, "touchstart", this._onTapStart)), this.nativeDraggable && ($e(t, "dragover", this), $e(t, "dragenter", this)), es.push(this.el), e.store && e.store.get && this.sort(e.store.get(this) || []), Pr(this, Im());
}
he.prototype = /** @lends Sortable.prototype */
{
  constructor: he,
  _isOutsideThisEl: function(e) {
    !this.el.contains(e) && e !== this.el && (vn = null);
  },
  _getDirection: function(e, r) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, e, r, Z) : this.options.direction;
  },
  _onTapStart: function(e) {
    if (e.cancelable) {
      var r = this, a = this.el, n = this.options, s = n.preventOnFilter, o = e.type, i = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, l = (i || e).target, c = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || l, u = n.filter;
      if (qm(a), !Z && !(/mousedown|pointerdown/.test(o) && e.button !== 0 || n.disabled) && !c.isContentEditable && !(!this.nativeDraggable && ta && l && l.tagName.toUpperCase() === "SELECT") && (l = tr(l, n.draggable, a, !1), !(l && l.animated) && ja !== l)) {
        if (Sn = Ut(l), na = Ut(l, n.draggable), typeof u == "function") {
          if (u.call(this, e, l, this)) {
            kt({
              sortable: r,
              rootEl: c,
              name: "filter",
              targetEl: l,
              toEl: a,
              fromEl: a
            }), Dt("filter", r, {
              evt: e
            }), s && e.cancelable && e.preventDefault();
            return;
          }
        } else if (u && (u = u.split(",").some(function(d) {
          if (d = tr(c, d.trim(), a, !1), d)
            return kt({
              sortable: r,
              rootEl: d,
              name: "filter",
              targetEl: l,
              fromEl: a,
              toEl: a
            }), Dt("filter", r, {
              evt: e
            }), !0;
        }), u)) {
          s && e.cancelable && e.preventDefault();
          return;
        }
        n.handle && !tr(c, n.handle, a, !1) || this._prepareDragStart(e, i, l);
      }
    }
  },
  _prepareDragStart: function(e, r, a) {
    var n = this, s = n.el, o = n.options, i = s.ownerDocument, l;
    if (a && !Z && a.parentNode === s) {
      var c = ft(a);
      if (Qe = s, Z = a, et = Z.parentNode, Xr = Z.nextSibling, ja = a, Ia = o.group, he.dragged = Z, Kr = {
        target: Z,
        clientX: (r || e).clientX,
        clientY: (r || e).clientY
      }, Ec = Kr.clientX - c.left, Sc = Kr.clientY - c.top, this._lastX = (r || e).clientX, this._lastY = (r || e).clientY, Z.style["will-change"] = "all", l = function() {
        if (Dt("delayEnded", n, {
          evt: e
        }), he.eventCanceled) {
          n._onDrop();
          return;
        }
        n._disableDelayedDragEvents(), !_c && n.nativeDraggable && (Z.draggable = !0), n._triggerDragStart(e, r), kt({
          sortable: n,
          name: "choose",
          originalEvent: e
        }), Mt(Z, o.chosenClass, !0);
      }, o.ignore.split(",").forEach(function(u) {
        Ku(Z, u.trim(), go);
      }), $e(i, "dragover", Yr), $e(i, "mousemove", Yr), $e(i, "touchmove", Yr), $e(i, "mouseup", n._onDrop), $e(i, "touchend", n._onDrop), $e(i, "touchcancel", n._onDrop), _c && this.nativeDraggable && (this.options.touchStartThreshold = 4, Z.draggable = !0), Dt("delayStart", this, {
        evt: e
      }), o.delay && (!o.delayOnTouchOnly || r) && (!this.nativeDraggable || !(fa || kr))) {
        if (he.eventCanceled) {
          this._onDrop();
          return;
        }
        $e(i, "mouseup", n._disableDelayedDrag), $e(i, "touchend", n._disableDelayedDrag), $e(i, "touchcancel", n._disableDelayedDrag), $e(i, "mousemove", n._delayedDragTouchMoveHandler), $e(i, "touchmove", n._delayedDragTouchMoveHandler), o.supportPointer && $e(i, "pointermove", n._delayedDragTouchMoveHandler), n._dragStartTimer = setTimeout(l, o.delay);
      } else
        l();
    }
  },
  _delayedDragTouchMoveHandler: function(e) {
    var r = e.touches ? e.touches[0] : e;
    Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    Z && go(Z), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var e = this.el.ownerDocument;
    De(e, "mouseup", this._disableDelayedDrag), De(e, "touchend", this._disableDelayedDrag), De(e, "touchcancel", this._disableDelayedDrag), De(e, "mousemove", this._delayedDragTouchMoveHandler), De(e, "touchmove", this._delayedDragTouchMoveHandler), De(e, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(e, r) {
    r = r || e.pointerType == "touch" && e, !this.nativeDraggable || r ? this.options.supportPointer ? $e(document, "pointermove", this._onTouchMove) : r ? $e(document, "touchmove", this._onTouchMove) : $e(document, "mousemove", this._onTouchMove) : ($e(Z, "dragend", this), $e(Qe, "dragstart", this._onDragStart));
    try {
      document.selection ? Ua(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(e, r) {
    if (_n = !1, Qe && Z) {
      Dt("dragStarted", this, {
        evt: r
      }), this.nativeDraggable && $e(document, "dragover", $m);
      var a = this.options;
      !e && Mt(Z, a.dragClass, !1), Mt(Z, a.ghostClass, !0), he.active = this, e && this._appendGhost(), kt({
        sortable: this,
        name: "start",
        originalEvent: r
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Zt) {
      this._lastX = Zt.clientX, this._lastY = Zt.clientY, ad();
      for (var e = document.elementFromPoint(Zt.clientX, Zt.clientY), r = e; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(Zt.clientX, Zt.clientY), e !== r); )
        r = e;
      if (Z.parentNode[jt]._isOutsideThisEl(e), r)
        do {
          if (r[jt]) {
            var a = void 0;
            if (a = r[jt]._onDragOver({
              clientX: Zt.clientX,
              clientY: Zt.clientY,
              target: e,
              rootEl: r
            }), a && !this.options.dragoverBubble)
              break;
          }
          e = r;
        } while (r = r.parentNode);
      sd();
    }
  },
  _onTouchMove: function(e) {
    if (Kr) {
      var r = this.options, a = r.fallbackTolerance, n = r.fallbackOffset, s = e.touches ? e.touches[0] : e, o = _e && xn(_e, !0), i = _e && o && o.a, l = _e && o && o.d, c = Ta && St && wc(St), u = (s.clientX - Kr.clientX + n.x) / (i || 1) + (c ? c[0] - vo[0] : 0) / (i || 1), d = (s.clientY - Kr.clientY + n.y) / (l || 1) + (c ? c[1] - vo[1] : 0) / (l || 1);
      if (!he.active && !_n) {
        if (a && Math.max(Math.abs(s.clientX - this._lastX), Math.abs(s.clientY - this._lastY)) < a)
          return;
        this._onDragStart(e, !0);
      }
      if (_e) {
        o ? (o.e += u - (po || 0), o.f += d - (mo || 0)) : o = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: u,
          f: d
        };
        var h = "matrix(".concat(o.a, ",").concat(o.b, ",").concat(o.c, ",").concat(o.d, ",").concat(o.e, ",").concat(o.f, ")");
        fe(_e, "webkitTransform", h), fe(_e, "mozTransform", h), fe(_e, "msTransform", h), fe(_e, "transform", h), po = u, mo = d, Zt = s;
      }
      e.cancelable && e.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!_e) {
      var e = this.options.fallbackOnBody ? document.body : Qe, r = ft(Z, !0, Ta, !0, e), a = this.options;
      if (Ta) {
        for (St = e; fe(St, "position") === "static" && fe(St, "transform") === "none" && St !== document; )
          St = St.parentNode;
        St !== document.body && St !== document.documentElement ? (St === document && (St = sr()), r.top += St.scrollTop, r.left += St.scrollLeft) : St = sr(), vo = wc(St);
      }
      _e = Z.cloneNode(!0), Mt(_e, a.ghostClass, !1), Mt(_e, a.fallbackClass, !0), Mt(_e, a.dragClass, !0), fe(_e, "transition", ""), fe(_e, "transform", ""), fe(_e, "box-sizing", "border-box"), fe(_e, "margin", 0), fe(_e, "top", r.top), fe(_e, "left", r.left), fe(_e, "width", r.width), fe(_e, "height", r.height), fe(_e, "opacity", "0.8"), fe(_e, "position", Ta ? "absolute" : "fixed"), fe(_e, "zIndex", "100000"), fe(_e, "pointerEvents", "none"), he.ghost = _e, e.appendChild(_e), fe(_e, "transform-origin", Ec / parseInt(_e.style.width) * 100 + "% " + Sc / parseInt(_e.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(e, r) {
    var a = this, n = e.dataTransfer, s = a.options;
    if (Dt("dragStart", this, {
      evt: e
    }), he.eventCanceled) {
      this._onDrop();
      return;
    }
    Dt("setupClone", this), he.eventCanceled || (tt = ed(Z), tt.draggable = !1, tt.style["will-change"] = "", this._hideClone(), Mt(tt, this.options.chosenClass, !1), he.clone = tt), a.cloneId = Ua(function() {
      Dt("clone", a), !he.eventCanceled && (a.options.removeCloneOnHide || Qe.insertBefore(tt, Z), a._hideClone(), kt({
        sortable: a,
        name: "clone"
      }));
    }), !r && Mt(Z, s.dragClass, !0), r ? (Xa = !0, a._loopId = setInterval(a._emulateDragOver, 50)) : (De(document, "mouseup", a._onDrop), De(document, "touchend", a._onDrop), De(document, "touchcancel", a._onDrop), n && (n.effectAllowed = "move", s.setData && s.setData.call(a, n, Z)), $e(document, "drop", a), fe(Z, "transform", "translateZ(0)")), _n = !0, a._dragStartId = Ua(a._dragStarted.bind(a, r, e)), $e(document, "selectstart", a), Jn = !0, ta && fe(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(e) {
    var r = this.el, a = e.target, n, s, o, i = this.options, l = i.group, c = he.active, u = Ia === l, d = i.sort, h = bt || c, f, m = this, p = !1;
    if (Ko) return;
    function v(le, ge) {
      Dt(le, m, ir({
        evt: e,
        isOwner: u,
        axis: f ? "vertical" : "horizontal",
        revert: o,
        dragRect: n,
        targetRect: s,
        canSort: d,
        fromSortable: h,
        target: a,
        completed: b,
        onMove: function(je, Te) {
          return Aa(Qe, r, Z, n, je, ft(je), e, Te);
        },
        changed: _
      }, ge));
    }
    function y() {
      v("dragOverAnimationCapture"), m.captureAnimationState(), m !== h && h.captureAnimationState();
    }
    function b(le) {
      return v("dragOverCompleted", {
        insertion: le
      }), le && (u ? c._hideClone() : c._showClone(m), m !== h && (Mt(Z, bt ? bt.options.ghostClass : c.options.ghostClass, !1), Mt(Z, i.ghostClass, !0)), bt !== m && m !== he.active ? bt = m : m === he.active && bt && (bt = null), h === m && (m._ignoreWhileAnimating = a), m.animateAll(function() {
        v("dragOverAnimationComplete"), m._ignoreWhileAnimating = null;
      }), m !== h && (h.animateAll(), h._ignoreWhileAnimating = null)), (a === Z && !Z.animated || a === r && !a.animated) && (vn = null), !i.dragoverBubble && !e.rootEl && a !== document && (Z.parentNode[jt]._isOutsideThisEl(e.target), !le && Yr(e)), !i.dragoverBubble && e.stopPropagation && e.stopPropagation(), p = !0;
    }
    function _() {
      Ft = Ut(Z), Or = Ut(Z, i.draggable), kt({
        sortable: m,
        name: "change",
        toEl: r,
        newIndex: Ft,
        newDraggableIndex: Or,
        originalEvent: e
      });
    }
    if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), a = tr(a, i.draggable, r, !0), v("dragOver"), he.eventCanceled) return p;
    if (Z.contains(e.target) || a.animated && a.animatingX && a.animatingY || m._ignoreWhileAnimating === a)
      return b(!1);
    if (Xa = !1, c && !i.disabled && (u ? d || (o = et !== Qe) : bt === this || (this.lastPutMode = Ia.checkPull(this, c, Z, e)) && l.checkPut(this, c, Z, e))) {
      if (f = this._getDirection(e, a) === "vertical", n = ft(Z), v("dragOverValid"), he.eventCanceled) return p;
      if (o)
        return et = Qe, y(), this._hideClone(), v("revert"), he.eventCanceled || (Xr ? Qe.insertBefore(Z, Xr) : Qe.appendChild(Z)), b(!0);
      var E = ul(r, i.draggable);
      if (!E || Bm(e, f, this) && !E.animated) {
        if (E === Z)
          return b(!1);
        if (E && r === e.target && (a = E), a && (s = ft(a)), Aa(Qe, r, Z, n, a, s, e, !!a) !== !1)
          return y(), r.appendChild(Z), et = r, _(), b(!0);
      } else if (E && jm(e, f, this)) {
        var P = An(r, 0, i, !0);
        if (P === Z)
          return b(!1);
        if (a = P, s = ft(a), Aa(Qe, r, Z, n, a, s, e, !1) !== !1)
          return y(), r.insertBefore(Z, P), et = r, _(), b(!0);
      } else if (a.parentNode === r) {
        s = ft(a);
        var A = 0, k, B = Z.parentNode !== r, L = !Lm(Z.animated && Z.toRect || n, a.animated && a.toRect || s, f), H = f ? "top" : "left", J = bc(a, "top", "top") || bc(Z, "top", "top"), q = J ? J.scrollTop : void 0;
        vn !== a && (k = s[H], sa = !1, Ra = !L && i.invertSwap || B), A = Um(e, a, s, f, L ? 1 : i.swapThreshold, i.invertedSwapThreshold == null ? i.swapThreshold : i.invertedSwapThreshold, Ra, vn === a);
        var N;
        if (A !== 0) {
          var D = Ut(Z);
          do
            D -= A, N = et.children[D];
          while (N && (fe(N, "display") === "none" || N === _e));
        }
        if (A === 0 || N === a)
          return b(!1);
        vn = a, aa = A;
        var Q = a.nextElementSibling, ae = !1;
        ae = A === 1;
        var de = Aa(Qe, r, Z, n, a, s, e, ae);
        if (de !== !1)
          return (de === 1 || de === -1) && (ae = de === 1), Ko = !0, setTimeout(Fm, 30), y(), ae && !Q ? r.appendChild(Z) : a.parentNode.insertBefore(Z, ae ? Q : a), J && Xu(J, 0, q - J.scrollTop), et = Z.parentNode, k !== void 0 && !Ra && (Ba = Math.abs(k - ft(a)[H])), _(), b(!0);
      }
      if (r.contains(Z))
        return b(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    De(document, "mousemove", this._onTouchMove), De(document, "touchmove", this._onTouchMove), De(document, "pointermove", this._onTouchMove), De(document, "dragover", Yr), De(document, "mousemove", Yr), De(document, "touchmove", Yr);
  },
  _offUpEvents: function() {
    var e = this.el.ownerDocument;
    De(e, "mouseup", this._onDrop), De(e, "touchend", this._onDrop), De(e, "pointerup", this._onDrop), De(e, "touchcancel", this._onDrop), De(document, "selectstart", this);
  },
  _onDrop: function(e) {
    var r = this.el, a = this.options;
    if (Ft = Ut(Z), Or = Ut(Z, a.draggable), Dt("drop", this, {
      evt: e
    }), et = Z && Z.parentNode, Ft = Ut(Z), Or = Ut(Z, a.draggable), he.eventCanceled) {
      this._nulling();
      return;
    }
    _n = !1, Ra = !1, sa = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Yo(this.cloneId), Yo(this._dragStartId), this.nativeDraggable && (De(document, "drop", this), De(r, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), ta && fe(document.body, "user-select", ""), fe(Z, "transform", ""), e && (Jn && (e.cancelable && e.preventDefault(), !a.dropBubble && e.stopPropagation()), _e && _e.parentNode && _e.parentNode.removeChild(_e), (Qe === et || bt && bt.lastPutMode !== "clone") && tt && tt.parentNode && tt.parentNode.removeChild(tt), Z && (this.nativeDraggable && De(Z, "dragend", this), go(Z), Z.style["will-change"] = "", Jn && !_n && Mt(Z, bt ? bt.options.ghostClass : this.options.ghostClass, !1), Mt(Z, this.options.chosenClass, !1), kt({
      sortable: this,
      name: "unchoose",
      toEl: et,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: e
    }), Qe !== et ? (Ft >= 0 && (kt({
      rootEl: et,
      name: "add",
      toEl: et,
      fromEl: Qe,
      originalEvent: e
    }), kt({
      sortable: this,
      name: "remove",
      toEl: et,
      originalEvent: e
    }), kt({
      rootEl: et,
      name: "sort",
      toEl: et,
      fromEl: Qe,
      originalEvent: e
    }), kt({
      sortable: this,
      name: "sort",
      toEl: et,
      originalEvent: e
    })), bt && bt.save()) : Ft !== Sn && Ft >= 0 && (kt({
      sortable: this,
      name: "update",
      toEl: et,
      originalEvent: e
    }), kt({
      sortable: this,
      name: "sort",
      toEl: et,
      originalEvent: e
    })), he.active && ((Ft == null || Ft === -1) && (Ft = Sn, Or = na), kt({
      sortable: this,
      name: "end",
      toEl: et,
      originalEvent: e
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    Dt("nulling", this), Qe = Z = et = _e = Xr = tt = ja = Nr = Kr = Zt = Jn = Ft = Or = Sn = na = vn = aa = bt = Ia = he.dragged = he.ghost = he.clone = he.active = null, ts.forEach(function(e) {
      e.checked = !0;
    }), ts.length = po = mo = 0;
  },
  handleEvent: function(e) {
    switch (e.type) {
      case "drop":
      case "dragend":
        this._onDrop(e);
        break;
      case "dragenter":
      case "dragover":
        Z && (this._onDragOver(e), Mm(e));
        break;
      case "selectstart":
        e.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function() {
    for (var e = [], r, a = this.el.children, n = 0, s = a.length, o = this.options; n < s; n++)
      r = a[n], tr(r, o.draggable, this.el, !1) && e.push(r.getAttribute(o.dataIdAttr) || zm(r));
    return e;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(e, r) {
    var a = {}, n = this.el;
    this.toArray().forEach(function(s, o) {
      var i = n.children[o];
      tr(i, this.options.draggable, n, !1) && (a[s] = i);
    }, this), r && this.captureAnimationState(), e.forEach(function(s) {
      a[s] && (n.removeChild(a[s]), n.appendChild(a[s]));
    }), r && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function() {
    var e = this.options.store;
    e && e.set && e.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function(e, r) {
    return tr(e, r || this.options.draggable, this.el, !1);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function(e, r) {
    var a = this.options;
    if (r === void 0)
      return a[e];
    var n = ha.modifyOption(this, e, r);
    typeof n < "u" ? a[e] = n : a[e] = r, e === "group" && nd(a);
  },
  /**
   * Destroy
   */
  destroy: function() {
    Dt("destroy", this);
    var e = this.el;
    e[jt] = null, De(e, "mousedown", this._onTapStart), De(e, "touchstart", this._onTapStart), De(e, "pointerdown", this._onTapStart), this.nativeDraggable && (De(e, "dragover", this), De(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(r) {
      r.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), es.splice(es.indexOf(this.el), 1), this.el = e = null;
  },
  _hideClone: function() {
    if (!Nr) {
      if (Dt("hideClone", this), he.eventCanceled) return;
      fe(tt, "display", "none"), this.options.removeCloneOnHide && tt.parentNode && tt.parentNode.removeChild(tt), Nr = !0;
    }
  },
  _showClone: function(e) {
    if (e.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Nr) {
      if (Dt("showClone", this), he.eventCanceled) return;
      Z.parentNode == Qe && !this.options.group.revertClone ? Qe.insertBefore(tt, Z) : Xr ? Qe.insertBefore(tt, Xr) : Qe.appendChild(tt), this.options.group.revertClone && this.animate(Z, tt), fe(tt, "display", ""), Nr = !1;
    }
  }
};
function Mm(t) {
  t.dataTransfer && (t.dataTransfer.dropEffect = "move"), t.cancelable && t.preventDefault();
}
function Aa(t, e, r, a, n, s, o, i) {
  var l, c = t[jt], u = c.options.onMove, d;
  return window.CustomEvent && !kr && !fa ? l = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (l = document.createEvent("Event"), l.initEvent("move", !0, !0)), l.to = e, l.from = t, l.dragged = r, l.draggedRect = a, l.related = n || e, l.relatedRect = s || ft(e), l.willInsertAfter = i, l.originalEvent = o, t.dispatchEvent(l), u && (d = u.call(c, l, o)), d;
}
function go(t) {
  t.draggable = !1;
}
function Fm() {
  Ko = !1;
}
function jm(t, e, r) {
  var a = ft(An(r.el, 0, r.options, !0)), n = 10;
  return e ? t.clientX < a.left - n || t.clientY < a.top && t.clientX < a.right : t.clientY < a.top - n || t.clientY < a.bottom && t.clientX < a.left;
}
function Bm(t, e, r) {
  var a = ft(ul(r.el, r.options.draggable)), n = 10;
  return e ? t.clientX > a.right + n || t.clientX <= a.right && t.clientY > a.bottom && t.clientX >= a.left : t.clientX > a.right && t.clientY > a.top || t.clientX <= a.right && t.clientY > a.bottom + n;
}
function Um(t, e, r, a, n, s, o, i) {
  var l = a ? t.clientY : t.clientX, c = a ? r.height : r.width, u = a ? r.top : r.left, d = a ? r.bottom : r.right, h = !1;
  if (!o) {
    if (i && Ba < c * n) {
      if (!sa && (aa === 1 ? l > u + c * s / 2 : l < d - c * s / 2) && (sa = !0), sa)
        h = !0;
      else if (aa === 1 ? l < u + Ba : l > d - Ba)
        return -aa;
    } else if (l > u + c * (1 - n) / 2 && l < d - c * (1 - n) / 2)
      return Vm(e);
  }
  return h = h || o, h && (l < u + c * s / 2 || l > d - c * s / 2) ? l > u + c / 2 ? 1 : -1 : 0;
}
function Vm(t) {
  return Ut(Z) < Ut(t) ? 1 : -1;
}
function zm(t) {
  for (var e = t.tagName + t.className + t.src + t.href + t.textContent, r = e.length, a = 0; r--; )
    a += e.charCodeAt(r);
  return a.toString(36);
}
function qm(t) {
  ts.length = 0;
  for (var e = t.getElementsByTagName("input"), r = e.length; r--; ) {
    var a = e[r];
    a.checked && ts.push(a);
  }
}
function Ua(t) {
  return setTimeout(t, 0);
}
function Yo(t) {
  return clearTimeout(t);
}
Us && $e(document, "touchmove", function(t) {
  (he.active || _n) && t.cancelable && t.preventDefault();
});
he.utils = {
  on: $e,
  off: De,
  css: fe,
  find: Ku,
  is: function(e, r) {
    return !!tr(e, r, e, !1);
  },
  extend: Cm,
  throttle: Yu,
  closest: tr,
  toggleClass: Mt,
  clone: ed,
  index: Ut,
  nextTick: Ua,
  cancelNextTick: Yo,
  detectDirection: rd,
  getChild: An
};
he.get = function(t) {
  return t[jt];
};
he.mount = function() {
  for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
    e[r] = arguments[r];
  e[0].constructor === Array && (e = e[0]), e.forEach(function(a) {
    if (!a.prototype || !a.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));
    a.utils && (he.utils = ir(ir({}, he.utils), a.utils)), ha.mount(a);
  });
};
he.create = function(t, e) {
  return new he(t, e);
};
he.version = Em;
var ot = [], Qn, Xo, ei = !1, _o, yo, rs, Gn;
function Hm() {
  function t() {
    this.defaults = {
      scroll: !0,
      forceAutoScrollFallback: !1,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: !0
    };
    for (var e in this)
      e.charAt(0) === "_" && typeof this[e] == "function" && (this[e] = this[e].bind(this));
  }
  return t.prototype = {
    dragStarted: function(r) {
      var a = r.originalEvent;
      this.sortable.nativeDraggable ? $e(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? $e(document, "pointermove", this._handleFallbackAutoScroll) : a.touches ? $e(document, "touchmove", this._handleFallbackAutoScroll) : $e(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(r) {
      var a = r.originalEvent;
      !this.options.dragOverBubble && !a.rootEl && this._handleAutoScroll(a);
    },
    drop: function() {
      this.sortable.nativeDraggable ? De(document, "dragover", this._handleAutoScroll) : (De(document, "pointermove", this._handleFallbackAutoScroll), De(document, "touchmove", this._handleFallbackAutoScroll), De(document, "mousemove", this._handleFallbackAutoScroll)), xc(), Va(), km();
    },
    nulling: function() {
      rs = Xo = Qn = ei = Gn = _o = yo = null, ot.length = 0;
    },
    _handleFallbackAutoScroll: function(r) {
      this._handleAutoScroll(r, !0);
    },
    _handleAutoScroll: function(r, a) {
      var n = this, s = (r.touches ? r.touches[0] : r).clientX, o = (r.touches ? r.touches[0] : r).clientY, i = document.elementFromPoint(s, o);
      if (rs = r, a || this.options.forceAutoScrollFallback || fa || kr || ta) {
        bo(r, this.options, i, a);
        var l = Mr(i, !0);
        ei && (!Gn || s !== _o || o !== yo) && (Gn && xc(), Gn = setInterval(function() {
          var c = Mr(document.elementFromPoint(s, o), !0);
          c !== l && (l = c, Va()), bo(r, n.options, c, a);
        }, 10), _o = s, yo = o);
      } else {
        if (!this.options.bubbleScroll || Mr(i, !0) === sr()) {
          Va();
          return;
        }
        bo(r, this.options, Mr(i, !1), !1);
      }
    }
  }, Pr(t, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Va() {
  ot.forEach(function(t) {
    clearInterval(t.pid);
  }), ot = [];
}
function xc() {
  clearInterval(Gn);
}
var bo = Yu(function(t, e, r, a) {
  if (e.scroll) {
    var n = (t.touches ? t.touches[0] : t).clientX, s = (t.touches ? t.touches[0] : t).clientY, o = e.scrollSensitivity, i = e.scrollSpeed, l = sr(), c = !1, u;
    Xo !== r && (Xo = r, Va(), Qn = e.scroll, u = e.scrollFn, Qn === !0 && (Qn = Mr(r, !0)));
    var d = 0, h = Qn;
    do {
      var f = h, m = ft(f), p = m.top, v = m.bottom, y = m.left, b = m.right, _ = m.width, E = m.height, P = void 0, A = void 0, k = f.scrollWidth, B = f.scrollHeight, L = fe(f), H = f.scrollLeft, J = f.scrollTop;
      f === l ? (P = _ < k && (L.overflowX === "auto" || L.overflowX === "scroll" || L.overflowX === "visible"), A = E < B && (L.overflowY === "auto" || L.overflowY === "scroll" || L.overflowY === "visible")) : (P = _ < k && (L.overflowX === "auto" || L.overflowX === "scroll"), A = E < B && (L.overflowY === "auto" || L.overflowY === "scroll"));
      var q = P && (Math.abs(b - n) <= o && H + _ < k) - (Math.abs(y - n) <= o && !!H), N = A && (Math.abs(v - s) <= o && J + E < B) - (Math.abs(p - s) <= o && !!J);
      if (!ot[d])
        for (var D = 0; D <= d; D++)
          ot[D] || (ot[D] = {});
      (ot[d].vx != q || ot[d].vy != N || ot[d].el !== f) && (ot[d].el = f, ot[d].vx = q, ot[d].vy = N, clearInterval(ot[d].pid), (q != 0 || N != 0) && (c = !0, ot[d].pid = setInterval((function() {
        a && this.layer === 0 && he.active._onTouchMove(rs);
        var Q = ot[this.layer].vy ? ot[this.layer].vy * i : 0, ae = ot[this.layer].vx ? ot[this.layer].vx * i : 0;
        typeof u == "function" && u.call(he.dragged.parentNode[jt], ae, Q, t, rs, ot[this.layer].el) !== "continue" || Xu(ot[this.layer].el, ae, Q);
      }).bind({
        layer: d
      }), 24))), d++;
    } while (e.bubbleScroll && h !== l && (h = Mr(h, !1)));
    ei = c;
  }
}, 30), od = function(e) {
  var r = e.originalEvent, a = e.putSortable, n = e.dragEl, s = e.activeSortable, o = e.dispatchSortableEvent, i = e.hideGhostForTarget, l = e.unhideGhostForTarget;
  if (r) {
    var c = a || s;
    i();
    var u = r.changedTouches && r.changedTouches.length ? r.changedTouches[0] : r, d = document.elementFromPoint(u.clientX, u.clientY);
    l(), c && !c.el.contains(d) && (o("spill"), this.onSpill({
      dragEl: n,
      putSortable: a
    }));
  }
};
function dl() {
}
dl.prototype = {
  startIndex: null,
  dragStart: function(e) {
    var r = e.oldDraggableIndex;
    this.startIndex = r;
  },
  onSpill: function(e) {
    var r = e.dragEl, a = e.putSortable;
    this.sortable.captureAnimationState(), a && a.captureAnimationState();
    var n = An(this.sortable.el, this.startIndex, this.options);
    n ? this.sortable.el.insertBefore(r, n) : this.sortable.el.appendChild(r), this.sortable.animateAll(), a && a.animateAll();
  },
  drop: od
};
Pr(dl, {
  pluginName: "revertOnSpill"
});
function fl() {
}
fl.prototype = {
  onSpill: function(e) {
    var r = e.dragEl, a = e.putSortable, n = a || this.sortable;
    n.captureAnimationState(), r.parentNode && r.parentNode.removeChild(r), n.animateAll();
  },
  drop: od
};
Pr(fl, {
  pluginName: "removeOnSpill"
});
he.mount(new Hm());
he.mount(fl, dl);
function Zm() {
  return typeof window < "u" ? window.console : global.console;
}
const Wm = Zm();
function Jm(t) {
  const e = /* @__PURE__ */ Object.create(null);
  return function(a) {
    return e[a] || (e[a] = t(a));
  };
}
const Qm = /-(\w)/g, Cc = Jm((t) => t.replace(Qm, (e, r) => r ? r.toUpperCase() : ""));
function wo(t) {
  t.parentElement !== null && t.parentElement.removeChild(t);
}
function kc(t, e, r) {
  const a = r === 0 ? t.children[0] : t.children[r - 1].nextSibling;
  t.insertBefore(e, a);
}
function Gm(t, e) {
  return Object.values(t).indexOf(e);
}
function Km(t, e, r, a) {
  if (!t)
    return [];
  const n = Object.values(t), s = e.length - a;
  return [...e].map((i, l) => l >= s ? n.length : n.indexOf(i));
}
function id(t, e) {
  this.$nextTick(() => this.$emit(t.toLowerCase(), e));
}
function Ym(t) {
  return (e) => {
    this.realList !== null && this["onDrag" + t](e), id.call(this, t, e);
  };
}
function Xm(t) {
  return ["transition-group", "TransitionGroup"].includes(t);
}
function ev(t) {
  if (!t || t.length !== 1)
    return !1;
  const [{ type: e }] = t;
  return e ? Xm(e.name) : !1;
}
function tv(t, e) {
  return e ? { ...e.props, ...e.attrs } : t;
}
const ti = ["Start", "Add", "Remove", "Update", "End"], ri = ["Choose", "Unchoose", "Sort", "Filter", "Clone"], rv = ["Move", ...ti, ...ri].map((t) => "on" + t);
let Eo = null;
const nv = {
  options: Object,
  list: {
    type: Array,
    required: !1,
    default: null
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: !1
  },
  clone: {
    type: Function,
    default: (t) => t
  },
  tag: {
    type: String,
    default: "div"
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: !1,
    default: null
  },
  component: {
    type: String,
    default: null
  },
  modelValue: {
    type: Array,
    required: !1,
    default: null
  }
}, av = Ls({
  name: "VueDraggableNext",
  inheritAttrs: !1,
  emits: [
    "update:modelValue",
    "move",
    "change",
    ...ti.map((t) => t.toLowerCase()),
    ...ri.map((t) => t.toLowerCase())
  ],
  props: nv,
  data() {
    return {
      transitionMode: !1,
      noneFunctionalComponentMode: !1,
      headerOffset: 0,
      footerOffset: 0,
      _sortable: {},
      visibleIndexes: [],
      context: {}
    };
  },
  render() {
    const t = this.$slots.default ? this.$slots.default() : null, e = tv(this.$attrs, this.componentData);
    return t ? (this.transitionMode = ev(t), Ga(this.getTag(), e, t)) : Ga(this.getTag(), e, []);
  },
  created() {
    this.list !== null && this.modelValue !== null && Wm.error("list props are mutually exclusive! Please set one.");
  },
  mounted() {
    const t = {};
    ti.forEach((n) => {
      t["on" + n] = Ym.call(this, n);
    }), ri.forEach((n) => {
      t["on" + n] = id.bind(this, n);
    });
    const e = Object.keys(this.$attrs).reduce((n, s) => (n[Cc(s)] = this.$attrs[s], n), {}), r = Object.assign({}, e, t, {
      onMove: (n, s) => this.onDragMove(n, s)
    });
    !("draggable" in r) && (r.draggable = ">*");
    const a = this.$el.nodeType === 1 ? this.$el : this.$el.parentElement;
    this._sortable = new he(a, r), a.__draggable_component__ = this, this.computeIndexes();
  },
  beforeUnmount() {
    try {
      this._sortable !== void 0 && this._sortable.destroy();
    } catch {
    }
  },
  computed: {
    realList() {
      return this.list ? this.list : this.modelValue;
    }
  },
  watch: {
    $attrs: {
      handler(t) {
        this.updateOptions(t);
      },
      deep: !0
    },
    realList() {
      this.computeIndexes();
    }
  },
  methods: {
    getTag() {
      return this.component ? F(this.component) : this.tag;
    },
    updateOptions(t) {
      for (var e in t) {
        const r = Cc(e);
        rv.indexOf(r) === -1 && this._sortable.option(r, t[e]);
      }
    },
    getChildrenNodes() {
      return this.$el.children;
    },
    computeIndexes() {
      this.$nextTick(() => {
        this.visibleIndexes = Km(this.getChildrenNodes(), this.$el.children, this.transitionMode, this.footerOffset);
      });
    },
    getUnderlyingVm(t) {
      const e = Gm(this.getChildrenNodes() || [], t);
      if (e === -1)
        return null;
      const r = this.realList[e];
      return { index: e, element: r };
    },
    emitChanges(t) {
      this.$nextTick(() => {
        this.$emit("change", t);
      });
    },
    alterList(t) {
      if (this.list) {
        t(this.list);
        return;
      }
      const e = [...this.modelValue];
      t(e), this.$emit("update:modelValue", e);
    },
    spliceList() {
      const t = (e) => e.splice(...arguments);
      this.alterList(t);
    },
    updatePosition(t, e) {
      const r = (a) => a.splice(e, 0, a.splice(t, 1)[0]);
      this.alterList(r);
    },
    getVmIndex(t) {
      const e = this.visibleIndexes, r = e.length;
      return t > r - 1 ? r : e[t];
    },
    getComponent() {
      return this.$slots.default ? (
        //@ts-ignore
        this.$slots.default()[0].componentInstance
      ) : null;
    },
    resetTransitionData(t) {
      if (!this.noTransitionOnDrag || !this.transitionMode)
        return;
      var e = this.getChildrenNodes();
      e[t].data = null;
      const r = this.getComponent();
      r.children = [], r.kept = void 0;
    },
    onDragStart(t) {
      this.computeIndexes(), this.context = this.getUnderlyingVm(t.item), this.context && (t.item._underlying_vm_ = this.clone(this.context.element), Eo = t.item);
    },
    onDragAdd(t) {
      const e = t.item._underlying_vm_;
      if (e === void 0)
        return;
      wo(t.item);
      const r = this.getVmIndex(t.newIndex);
      this.spliceList(r, 0, e), this.computeIndexes();
      const a = { element: e, newIndex: r };
      this.emitChanges({ added: a });
    },
    onDragRemove(t) {
      if (kc(this.$el, t.item, t.oldIndex), t.pullMode === "clone") {
        wo(t.clone);
        return;
      }
      if (!this.context)
        return;
      const e = this.context.index;
      this.spliceList(e, 1);
      const r = { element: this.context.element, oldIndex: e };
      this.resetTransitionData(e), this.emitChanges({ removed: r });
    },
    onDragUpdate(t) {
      wo(t.item), kc(t.from, t.item, t.oldIndex);
      const e = this.context.index, r = this.getVmIndex(t.newIndex);
      this.updatePosition(e, r);
      const a = { element: this.context.element, oldIndex: e, newIndex: r };
      this.emitChanges({ moved: a });
    },
    updateProperty(t, e) {
      t.hasOwnProperty(e) && (t[e] += this.headerOffset);
    },
    onDragMove(t, e) {
      const r = this.move;
      if (!r || !this.realList)
        return !0;
      const a = this.getRelatedContextFromMoveEvent(t), n = this.context, s = this.computeFutureIndex(a, t);
      Object.assign(n, { futureIndex: s });
      const o = Object.assign({}, t, {
        relatedContext: a,
        draggedContext: n
      });
      return r(o, e);
    },
    onDragEnd() {
      this.computeIndexes(), Eo = null;
    },
    getTrargetedComponent(t) {
      return t.__draggable_component__;
    },
    getRelatedContextFromMoveEvent({ to: t, related: e }) {
      const r = this.getTrargetedComponent(t);
      if (!r)
        return { component: r };
      const a = r.realList, n = { list: a, component: r };
      if (t !== e && a && r.getUnderlyingVm) {
        const s = r.getUnderlyingVm(e);
        if (s)
          return Object.assign(s, n);
      }
      return n;
    },
    computeFutureIndex(t, e) {
      const r = [...e.to.children].filter((o) => o.style.display !== "none");
      if (r.length === 0)
        return 0;
      const a = r.indexOf(e.related), n = t.component.getVmIndex(a);
      return r.indexOf(Eo) !== -1 || !e.willInsertAfter ? n : n + 1;
    }
  }
}), sv = {
  props: {
    visible: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["close"],
  setup(t) {
    return {
      visibleModal: ie(() => t.visible)
    };
  }
};
function ov(t, e, r, a, n, s) {
  return C(), ue(_h, { to: "body" }, [
    a.visibleModal ? (C(), $("div", {
      key: 0,
      class: "mask-modal",
      onClick: e[0] || (e[0] = (o) => t.$emit("close"))
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ])) : ee("", !0)
  ]);
}
const iv = /* @__PURE__ */ me(sv, [["render", ov], ["__scopeId", "data-v-aa40c81e"]]), lv = {
  components: {
    TinyTooltip: qr,
    TinyInput: cn,
    TinyFormItem: Ns,
    TinyForm: $s,
    TinyPopover: ur,
    TinyDialogBox: Ms,
    TinyButton: dr,
    MetaForm: hm,
    MaskModal: iv,
    IconDel: Uh(),
    IconEdit: Bh(),
    IconMore: jh(),
    IconClose: Vu()
  },
  inheritAttrs: !1,
  props: {
    item: {
      type: Object,
      default: () => {
      }
    },
    dataScource: {
      type: Object,
      default: () => {
      }
    },
    index: {
      type: Number,
      default: 0
    },
    currentIndex: {
      type: Number,
      default: -1
    },
    // 使用itemClick判断是否由双击触发弹出面板
    itemClick: {
      type: Boolean,
      default: !1
    },
    // 子级弹出层是否在左侧展开
    expand: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["editItem", "changeItem", "deleteItem", "hide"],
  setup(t, { emit: e }) {
    const r = yt({}), a = Ce(!1), n = Ce(!1), s = Ce(!1), o = Ce(0), i = () => {
      a.value = !0;
    }, l = () => {
      s.value = !0, n.value = !0;
    }, c = (_, E) => {
      switch (E) {
        case "delete":
          i();
          break;
        case "openModal":
          e("editItem", { action: "openModal", index: t.index });
          break;
        case "edit":
          e("editItem", { action: "edit", index: t.index }), l();
          break;
        default:
          e("editItem", { index: t.index }), l();
          break;
      }
    }, u = () => {
      e("changeItem", r);
    }, d = () => {
      a.value = !1, e("deleteItem", r);
    }, h = () => {
      n.value = !1, s.value = !1;
    }, f = () => {
      e("hide");
    }, m = Ce(!1), p = () => {
      n.value = !1;
    }, v = (_) => {
      e("changeItem", { data: _, index: t.index }), n.value = !1;
    };
    Sr(() => {
      r.option = t.item, r.textField = t.dataScource.textField, r.valueField = t.dataScource.valueField, r.label = t.dataScource.label, r.index = t.index, t.currentIndex !== t.index && p();
    });
    const y = () => {
      t.itemClick && !a.value && l();
    }, b = () => {
      s.value = !1, n.value = !1;
    };
    return Ds(() => {
      t.currentIndex === t.index && l();
    }), {
      itemData: r,
      change: u,
      deleteItem: i,
      closeEditOption: h,
      btnClick: c,
      hide: f,
      isShow: a,
      confirm: d,
      editList: l,
      isVisible: n,
      showMask: s,
      closeMask: b,
      top: o,
      isShowModal: m,
      formConfirm: v,
      cancel: p,
      openEdit: y
    };
  }
}, cv = (t) => (Vr("data-v-0407293f"), t = t(), zr(), t), uv = { class: "option-input" }, dv = { class: "left" }, fv = { class: "right" }, hv = ["onClick"], pv = /* @__PURE__ */ cv(() => /* @__PURE__ */ R("span", { class: "switch-tip" }, [
  /* @__PURE__ */ R("span", null, "确定删除吗？")
], -1));
function mv(t, e, r, a, n, s) {
  const o = F("icon-more"), i = F("icon-close"), l = F("meta-form"), c = F("icon-edit"), u = F("tiny-popover"), d = F("tiny-button"), h = F("tiny-dialog-box"), f = F("mask-modal");
  return C(), $(Xe, null, [
    R("div", {
      class: Ye(["item-content", { "active-item": r.currentIndex === r.index }]),
      onClick: e[1] || (e[1] = (...m) => a.openEdit && a.openEdit(...m))
    }, [
      R("div", uv, [
        R("div", dv, [
          O(o, { class: "tiny-svg-size icon-more" }),
          re(t.$slots, "content", { data: r.item }, void 0, !0)
        ]),
        R("div", fv, [
          re(t.$slots, "operate", { data: r.item }, () => [
            (C(!0), $(Xe, null, Pt(r.dataScource.btnList, (m) => (C(), $(Xe, {
              key: m.type
            }, [
              m.type === "edit" ? (C(), ue(u, {
                key: a.itemData.index,
                modelValue: a.isVisible,
                "onUpdate:modelValue": e[0] || (e[0] = (p) => a.isVisible = p),
                placement: "bottom-start",
                "popper-class": ["option-popper", { "fixed-left": r.expand }],
                "visible-arrow": !r.expand,
                title: "",
                width: "295",
                height: "auto",
                trigger: "manual",
                onHide: (p) => a.hide(m)
              }, {
                reference: M(() => [
                  O(c, {
                    class: "tiny-svg-size icon-edit",
                    onClick: (p) => a.btnClick(p, m.type)
                  }, null, 8, ["onClick"])
                ]),
                default: M(() => [
                  a.isVisible ? (C(), $("div", {
                    key: 0,
                    ref_for: !0,
                    ref: "addOptions",
                    class: "add-options",
                    style: Fn(`left:${a.itemData.left}px;top:${a.itemData.top}px`)
                  }, [
                    O(i, {
                      class: "tiny-svg-size icon-close",
                      onClick: a.closeEditOption
                    }, null, 8, ["onClick"]),
                    re(t.$slots, "metaForm", {}, () => [
                      O(l, Rn(a.itemData, {
                        footerbtnHide: "true",
                        onChangeItem: a.change,
                        onCancel: a.cancel,
                        onConfirm: a.formConfirm
                      }), null, 16, ["onChangeItem", "onCancel", "onConfirm"])
                    ], !0),
                    re(t.$slots, "footer", {}, void 0, !0)
                  ], 4)) : ee("", !0)
                ]),
                _: 2
              }, 1032, ["modelValue", "popper-class", "visible-arrow", "onHide"])) : (C(), $("span", {
                key: 1,
                class: "item-icon",
                onClick: (p) => a.btnClick(p, m.type)
              }, [
                (C(), ue(ar(m.icon)))
              ], 8, hv))
            ], 64))), 128))
          ], !0)
        ])
      ])
    ], 2),
    a.isShow ? (C(), ue(h, {
      key: 0,
      "append-to-body": !0,
      visible: a.isShow,
      title: "提示",
      width: "20%",
      "onUpdate:visible": e[3] || (e[3] = (m) => a.isShow = m)
    }, {
      footer: M(() => [
        O(d, {
          onClick: e[2] || (e[2] = (m) => a.isShow = !1)
        }, {
          default: M(() => [
            Se("取消")
          ]),
          _: 1
        }),
        O(d, {
          type: "danger",
          onClick: a.confirm
        }, {
          default: M(() => [
            Se("删除")
          ]),
          _: 1
        }, 8, ["onClick"])
      ]),
      default: M(() => [
        pv
      ]),
      _: 1
    }, 8, ["visible"])) : ee("", !0),
    O(f, {
      visible: a.showMask && !r.expand,
      onClose: a.closeMask
    }, null, 8, ["visible", "onClose"])
  ], 64);
}
const vv = /* @__PURE__ */ me(lv, [["render", mv], ["__scopeId", "data-v-0407293f"]]), gv = {
  components: {
    MetaListItem: vv,
    VueDraggableNext: av
  },
  props: {
    draggable: {
      type: Boolean,
      default: !0
    },
    optionsList: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ""
    },
    valueField: {
      type: String,
      default: ""
    },
    textField: {
      type: String,
      default: ""
    },
    btnList: {
      type: Array,
      default: () => []
    },
    // 使用itemClick判断是否由双击触发弹出面板
    itemClick: {
      type: Boolean,
      default: !1
    }
  },
  setup(t, { emit: e }) {
    const r = ie(() => t), { appSchemaState: a } = Wh(), n = (u) => {
      const d = [...t.optionsList];
      u.data && (d[u.index] = u.data), e("changeItem", d);
    }, s = (u) => {
      e("deleteItem", u);
    }, o = (u) => {
      e("dragEnd", u);
    }, i = (u) => {
      const d = [...t.optionsList];
      switch (u.action) {
        case "openModal":
          e("openModal", { index: u.index });
          break;
        default:
          d[u.index] = u.data, e("changeItem", d);
          break;
      }
    }, l = {
      index: "序号",
      selection: "复选框",
      radio: "单选框",
      expand: "展开行"
    };
    return {
      listItemOption: r,
      changeItem: n,
      deleteItem: s,
      dragEnd: o,
      editItem: i,
      formatName: (u) => {
        if (!u)
          return "";
        let d = "";
        return ie(() => {
          if (u.type && (d = l[u.type]), u[t.textField])
            if (u[t.textField].i18nKey) {
              const f = u[t.textField].i18nKey;
              d = a.langs[f][a.currentLang];
            } else
              d = u[t.textField];
          return d;
        });
      }
    };
  }
}, _v = { key: 1 };
function yv(t, e, r, a, n, s) {
  const o = F("meta-list-item"), i = F("vue-draggable-next");
  return r.draggable ? (C(), ue(i, {
    key: 0,
    class: "dragArea list-group w-full",
    list: r.optionsList,
    handle: ".icon-more",
    onChange: a.dragEnd
  }, {
    default: M(() => [
      (C(!0), $(Xe, null, Pt(r.optionsList, (l, c) => (C(), $("div", {
        key: c,
        class: "option-item"
      }, [
        O(o, {
          item: l,
          index: c,
          itemClick: r.itemClick,
          dataScource: a.listItemOption,
          onChangeItem: a.changeItem,
          onDeleteItem: a.deleteItem,
          onEditItem: a.editItem
        }, {
          content: M(() => [
            re(t.$slots, "content", { data: l }, () => [
              R("span", null, ce(l[r.textField] || a.formatName(l)), 1)
            ], !0)
          ]),
          operate: M(() => [
            re(t.$slots, "operate", { data: l }, void 0, !0)
          ]),
          metaForm: M(() => [
            re(t.$slots, "form", { data: l }, void 0, !0)
          ]),
          footer: M(() => [
            re(t.$slots, "footer", { data: l }, void 0, !0)
          ]),
          _: 2
        }, 1032, ["item", "index", "itemClick", "dataScource", "onChangeItem", "onDeleteItem", "onEditItem"])
      ]))), 128))
    ]),
    _: 3
  }, 8, ["list", "onChange"])) : (C(), $("div", _v, [
    (C(!0), $(Xe, null, Pt(r.optionsList, (l, c) => (C(), $("div", {
      key: c,
      class: "option-item not-draggable"
    }, [
      O(o, {
        item: l,
        index: c,
        itemClick: r.itemClick,
        dataScource: a.listItemOption,
        onChangeItem: a.changeItem,
        onDeleteItem: a.deleteItem,
        onEditItem: a.editItem
      }, {
        content: M(() => [
          re(t.$slots, "content", { data: l }, () => [
            R("span", null, ce(l[r.textField] || a.formatName(l)), 1)
          ], !0)
        ]),
        operate: M(() => [
          re(t.$slots, "operate", { data: l }, void 0, !0)
        ]),
        metaForm: M(() => [
          re(t.$slots, "form", { data: l }, void 0, !0)
        ]),
        footer: M(() => [
          re(t.$slots, "footer", { data: l }, void 0, !0)
        ]),
        _: 2
      }, 1032, ["item", "index", "itemClick", "dataScource", "onChangeItem", "onDeleteItem", "onEditItem"])
    ]))), 128))
  ]));
}
const bv = /* @__PURE__ */ me(gv, [["render", yv], ["__scopeId", "data-v-ddb3040f"]]), Kn = yt({
  show: !1,
  created: !1
}), wv = () => ({ openModal: () => {
  Kn.created || (Kn.created = !0), Kn.show = !0;
}, closeModal: () => {
  Kn.show = !1;
} }), Ev = {
  props: {
    width: {
      type: Number,
      default: 239
    },
    top: {
      type: Number,
      default: 0
    }
  },
  setup(t, { emit: e }) {
    const { closeModal: r } = wv();
    return {
      close: () => {
        r(), e("close");
      },
      modal: Kn
    };
  }
}, Sv = {
  key: 0,
  class: "modal-wrapper"
};
function Pv(t, e, r, a, n, s) {
  return a.modal.created ? _r((C(), $("div", Sv, [
    R("div", {
      class: "modal-mask",
      onClick: e[0] || (e[0] = (...o) => a.close && a.close(...o))
    }),
    R("div", {
      class: "modal-content",
      style: Fn({ width: r.width + "px" })
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 4)
  ], 512)), [
    [nn, a.modal.show]
  ]) : ee("", !0);
}
const eC = /* @__PURE__ */ me(Ev, [["render", Pv], ["__scopeId", "data-v-2793d67f"]]), xv = {
  components: {
    ConfigItem: ll
  },
  inheritAttrs: !1,
  props: {
    meta: {
      type: Object,
      default: () => {
      }
    },
    type: {
      type: String,
      default: "object"
    },
    arrayIndex: {
      type: Number,
      default: -1
    }
  },
  setup(t, { emit: e }) {
    const { locale: r } = Os.global, a = {
      zh_CN: "未命名标题",
      en_US: "Untitled"
    }, n = ie(() => {
      var f;
      const i = ((f = t.meta.widget.props) == null ? void 0 : f.modelValue) || [], { title: l, label: c, type: u } = i[t.arrayIndex] || {}, d = l || c;
      return (Kh(d) ? d[r.value] : d) || u || a[r.value] || a.zh_CN;
    }), s = ie(() => {
      var c, u, d, h;
      const i = [...((d = (u = (c = t.meta) == null ? void 0 : c.properties) == null ? void 0 : u[0]) == null ? void 0 : d.content) || []], l = (h = t.meta.widget.props) == null ? void 0 : h.modelValue;
      return i.length && l && i.forEach((f) => {
        let m = l;
        t.type === "array" && t.arrayIndex > -1 && (m = m[t.arrayIndex]);
        const p = m[f.property];
        f.widget.props.modelValue = typeof p == "boolean" ? p : p || null;
      }), i;
    });
    return {
      title: n,
      properties: s,
      onValueChange: (i, l) => {
        e("update:modelValue", { propertyKey: i, propertyValue: l });
      }
    };
  }
}, Cv = { class: "items-container" }, kv = { class: "title" };
function Iv(t, e, r, a, n, s) {
  const o = F("config-item");
  return C(), $("div", Cv, [
    R("div", kv, ce(a.title), 1),
    (C(!0), $(Xe, null, Pt(a.properties, (i, l) => (C(), $("div", {
      key: l,
      class: "meta-config-item"
    }, [
      (C(), ue(o, {
        key: l,
        property: i,
        "data-prop-index": l,
        "data-group-index": t.index,
        "onUpdate:modelValue": (c) => a.onValueChange(i.property, c)
      }, {
        default: M(() => [
          re(t.$slots, "prefix", { data: i }, void 0, !0),
          re(t.$slots, "suffix", { data: i }, void 0, !0)
        ]),
        _: 2
      }, 1032, ["property", "data-prop-index", "data-group-index", "onUpdate:modelValue"]))
    ]))), 128))
  ]);
}
const ld = /* @__PURE__ */ me(xv, [["render", Iv], ["__scopeId", "data-v-f141a5eb"]]), Rv = {
  components: {
    MetaChildItem: ld,
    TinyButton: dr,
    IconClose: Vu()
  },
  props: {
    meta: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ["save", "close", "update:modelValue"],
  setup(t, { emit: e }) {
    const r = yt({
      show: !1,
      created: !1
    }), a = ie(() => {
      var l, c;
      return `编辑${((c = (l = t.meta.label) == null ? void 0 : l.text) == null ? void 0 : c.zh_CN) || t.meta.property || "属性"}`;
    }), n = () => {
      r.show = !1, e("close");
    };
    return {
      title: a,
      modalState: r,
      save: (l) => {
        e("update:modelValue", l), n();
      },
      close: n,
      open: () => {
        r.created || (r.created = !0), r.show = !0;
      },
      onValueChange: ({ propertyKey: l, propertyValue: c }) => {
        var d, h;
        const u = { ...(h = (d = t.meta.widget) == null ? void 0 : d.props) == null ? void 0 : h.modelValue, [l]: c };
        e("update:modelValue", u);
      }
    };
  }
}, Tv = { class: "meta-modal-wrap" }, Av = { class: "property-item" }, Ov = { class: "property-item-header" }, Dv = { class: "header-text" }, Lv = { class: "icon-wrap" }, Nv = { class: "meta-modal-body" }, $v = { class: "property-item-footer" };
function Mv(t, e, r, a, n, s) {
  const o = F("tiny-button"), i = F("icon-close"), l = F("meta-child-item");
  return C(), $("div", Tv, [
    O(o, { onClick: a.open }, {
      default: M(() => [
        Se(ce(a.title), 1)
      ]),
      _: 1
    }, 8, ["onClick"]),
    a.modalState.created ? _r((C(), $("div", {
      key: 0,
      class: "mask",
      onClick: e[0] || (e[0] = er((...c) => a.close && a.close(...c), ["self"]))
    }, [
      R("div", Av, [
        R("div", Ov, [
          R("span", Dv, ce(a.title), 1),
          R("span", Lv, [
            O(i, {
              class: "header-icon",
              onClick: a.close
            }, null, 8, ["onClick"])
          ])
        ]),
        re(t.$slots, "body", {}, () => [
          R("div", Nv, [
            O(l, {
              meta: r.meta,
              "onUpdate:modelValue": a.onValueChange
            }, null, 8, ["meta", "onUpdate:modelValue"])
          ])
        ], !0),
        re(t.$slots, "footer", {}, () => [
          _r(R("div", $v, [
            O(o, { onClick: a.close }, {
              default: M(() => [
                Se("关闭")
              ]),
              _: 1
            }, 8, ["onClick"]),
            O(o, {
              type: "info",
              onClick: a.save
            }, {
              default: M(() => [
                Se("保存")
              ]),
              _: 1
            }, 8, ["onClick"])
          ], 512), [
            [nn, !1]
          ])
        ], !0)
      ])
    ], 512)), [
      [nn, a.modalState.show]
    ]) : ee("", !0)
  ]);
}
const tC = /* @__PURE__ */ me(Rv, [["render", Mv], ["__scopeId", "data-v-c53a6f94"]]), Fv = {
  components: {
    MetaChildItem: ld,
    TinyPopover: ur,
    TinyButton: dr
  },
  inheritAttrs: !1,
  props: {
    meta: {
      type: Object,
      default: () => ({})
    }
  },
  setup(t, { emit: e }) {
    return { title: ie(() => {
      var n, s;
      return `编辑${((s = (n = t.meta.label) == null ? void 0 : n.text) == null ? void 0 : s.zh_CN) || t.meta.property || "属性"}`;
    }), onValueChange: ({ propertyKey: n, propertyValue: s }) => {
      var i, l;
      const o = { ...(l = (i = t.meta.widget) == null ? void 0 : i.props) == null ? void 0 : l.modelValue, [n]: s };
      e("update:modelValue", o);
    } };
  }
};
function jv(t, e, r, a, n, s) {
  const o = F("tiny-button"), i = F("meta-child-item"), l = F("tiny-popover");
  return C(), ue(l, {
    width: "267",
    trigger: "click",
    placement: "bottom-end",
    "visible-arrow": !0,
    popperClass: "option-popper"
  }, {
    reference: M(() => [
      re(t.$slots, "reference", {}, () => [
        O(o, null, {
          default: M(() => [
            Se(ce(a.title), 1)
          ]),
          _: 1
        })
      ])
    ]),
    default: M(() => [
      re(t.$slots, "body", {}, () => [
        O(i, {
          meta: r.meta,
          "onUpdate:modelValue": a.onValueChange
        }, null, 8, ["meta", "onUpdate:modelValue"])
      ])
    ]),
    _: 3
  });
}
const rC = /* @__PURE__ */ me(Fv, [["render", jv]]), cd = "vs", ni = Ce(cd), nC = (t) => {
  ni.value = t || cd;
}, Bv = {
  name: "MonacoEditor",
  model: {
    event: "change"
  },
  props: {
    original: {
      type: String
    },
    value: {
      type: String,
      required: !0
    },
    language: {
      type: String
    },
    options: {
      type: Object,
      default: () => ({})
    },
    amdRequire: {
      type: Function
    },
    diffEditor: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["change", "editorWillMount", "editorDidMount", "shortcutSave"],
  setup(t, { emit: e }) {
    const r = {
      editor: null,
      monaco: null
    }, a = Ce(null), n = {
      autoIndent: !0,
      automaticLayout: !0,
      formatOnPaste: !0,
      roundedSelection: !0,
      tabSize: 2
    }, s = () => r.editor && r.editor.focus(), o = () => r.monaco, i = () => r.editor, l = () => t.diffEditor ? r.editor.getModifiedEditor() : r.editor, c = () => t.diffEditor ? r.editor.getOriginalEditor() : r.editor, u = () => r.monaco.editor.getModelMarkers(), d = (h) => {
      e("editorWillMount", r.monaco);
      const f = {
        ...n,
        value: t.value,
        theme: ni.value,
        language: t.language,
        ...t.options
      };
      if (t.diffEditor) {
        r.editor = h.editor.createDiffEditor(a.value, f);
        const p = h.editor.createModel(t.original, t.language), v = h.editor.createModel(t.value, t.language);
        r.editor.setModel({
          original: p,
          modified: v
        });
      } else
        r.editor = h.editor.create(a.value, f);
      r.editor.addCommand(co.KeyMod.CtrlCmd | co.KeyCode.KeyS, () => {
        e("shortcutSave");
      });
      const m = l();
      m.onDidChangeModelContent((p) => {
        const v = m.getValue();
        t.value !== v && e("change", v, p);
      }), e("editorDidMount", r.editor);
    };
    return Ds(() => {
      t.amdRequire ? t.amdRequire(["vs/editor/editor.main"], () => {
        r.monaco = window.monaco, ca(() => {
          d(window.monaco);
        });
      }) : (r.monaco = co, ca(() => {
        d(r.monaco), r.editor.addAction({
          id: "prettier",
          label: "Prettier",
          precondition: null,
          contextMenuGroupId: "navigation",
          run(h) {
            const f = h.getValue(), m = Qo(f, t.options.language);
            m !== f && h.setValue(m);
          }
        });
      }));
    }), nl(() => {
      r.editor && r.editor.dispose();
    }), Vt(
      () => t.options,
      (h) => {
        r.editor && l().updateOptions(h);
      },
      {
        deep: !0
      }
    ), Vt(
      () => t.value,
      (h) => {
        if (r.editor) {
          const f = l();
          h !== f.getValue() && f.setValue(h);
        }
      }
    ), Vt(
      () => t.original,
      (h) => {
        if (r.editor && t.diffEditor) {
          const f = c();
          h !== f.getValue() && f.setValue(h);
        }
      }
    ), Vt(
      () => t.language,
      (h) => {
        if (r.editor) {
          const f = l();
          r.monaco.editor.setModelLanguage(f.getModel(), h);
        }
      }
    ), Vt(ni, (h) => {
      r.editor && r.monaco.editor.setTheme(h);
    }), {
      getMonaco: o,
      getEditor: i,
      getModifiedEditor: l,
      getOriginalEditor: c,
      initMonaco: d,
      focus: s,
      monacoRef: a,
      getModelMarkers: u
    };
  }
}, Uv = { ref: "monacoRef" };
function Vv(t, e, r, a, n, s) {
  return C(), $("div", Uv, null, 512);
}
const Vs = /* @__PURE__ */ me(Bv, [["render", Vv]]), zv = {
  components: {
    TinySplit: Rh,
    MonacoEditor: Vs,
    TinyButton: dr,
    TinyDialogBox: Ms
  },
  props: {
    buttonText: {
      type: [String, Object],
      default: "编辑代码"
    },
    modelValue: {
      type: [String, Object, Array],
      default: ""
    },
    buttonShowContent: {
      type: Boolean,
      default: !1
    },
    title: {
      type: [String, Object],
      default: "编辑代码"
    },
    language: {
      type: String,
      default: "javascript"
    },
    dataType: String,
    single: {
      type: Boolean,
      default: !1
    },
    theme: {
      type: String
    },
    showFormatBtn: {
      type: Boolean,
      default: !0
    },
    showErrorMsg: {
      type: Boolean,
      default: !0
    },
    tips: {
      // 代码编辑器上方提示：title显示简短的文字描述，demo为显示的示例，点击 “展开示例” 可查看
      type: Object,
      default: () => ({ title: "", demo: "" })
    }
  },
  emits: ["save", "open", "close"],
  setup(t, { emit: e }) {
    var y;
    const { locale: r } = Os.global, a = yt({
      show: !1,
      created: !1,
      errorMsg: "",
      showEditorDemo: !1,
      splitWidth: (y = t.tips) != null && y.demo ? 0.7 : 1
    }), n = Ce(""), s = Ce(null), o = ie(() => {
      var b;
      return ((b = t.buttonText) == null ? void 0 : b[r.value]) ?? t.buttonText;
    }), i = ie(() => {
      var b;
      return ((b = t.title) == null ? void 0 : b[r.value]) ?? t.title;
    }), l = ie(() => {
      var b, _, E;
      return ((_ = (b = t.tips) == null ? void 0 : b.title) == null ? void 0 : _[r.value]) ?? ((E = t.tips) == null ? void 0 : E.title);
    }), c = ie(() => {
      var b, _, E;
      return ((_ = (b = t.tips) == null ? void 0 : b.demo) == null ? void 0 : _[r.value]) ?? ((E = t.tips) == null ? void 0 : E.demo);
    }), u = "编辑代码";
    Sr(() => {
      const { modelValue: b, dataType: _ } = t, E = _ ? (b == null ? void 0 : b.value) || "" : b;
      n.value = typeof E == "string" ? E : JSON.stringify(E, null, 2);
    });
    const d = () => {
      a.show = !1, e("close");
    }, h = () => {
      a.created || (a.created = !0), a.show = !0, e("open"), ca(() => window.dispatchEvent(new Event("resize")));
    }, f = (b = ((_) => (_ = s.value) == null ? void 0 : _.getEditor().getValue())()) => {
      let E;
      if (t.language === "json" && b)
        try {
          E = JSON.parse(b), a.errorMsg = "";
        } catch (P) {
          a.errorMsg = P;
        }
      return E;
    };
    return {
      save: () => {
        var A;
        const { language: b, dataType: _, single: E } = t, P = Qo((A = s.value) == null ? void 0 : A.getEditor().getValue(), b);
        if (e("save", { content: P }), !E) {
          let k = P;
          const B = Function;
          try {
            _ ? k = k === "" ? "" : { type: _, value: k } : b === "json" ? k = new B(`return ${P}`)() : k = typeof t.modelValue == "string" ? P : JSON.parse(P);
          } catch {
          }
          e("update:modelValue", k);
        }
        d();
      },
      close: d,
      open: h,
      formatCode: () => {
        var _, E;
        let b = (_ = s.value) == null ? void 0 : _.getEditor().getValue();
        if (b)
          try {
            b = Qo(b, "json"), (E = s.value) == null || E.getEditor().setValue(b);
          } catch {
          }
      },
      editorDidMount: (b) => {
        b.onDidChangeModelContent(() => {
          const _ = b.getValue();
          f(_);
        });
      },
      buttonLabel: o,
      titleLabel: i,
      editorTipsTitle: l,
      editorTipsDemo: c,
      editor: s,
      editorState: a,
      value: n,
      EDIT_CODE_TEXT: u,
      options: {
        language: t.language,
        minimap: {
          enabled: !1
        }
      },
      locale: r
    };
  }
}, qv = { class: "editor-wrap" }, Hv = { class: "text-content text-ellipsis-multiple text-line-clamp" }, Zv = { class: "source-code" }, Wv = {
  key: 0,
  class: "header-tips-container"
}, Jv = ["title"], Qv = { class: "source-code-split-panel-wrapper" }, Gv = {
  key: 0,
  class: "source-code-split-panel-wrapper-right"
}, Kv = { class: "header-tips-demo-content lowcode-scrollbar-thin" }, Yv = {
  key: 1,
  class: "error-msg"
}, Xv = { class: "btn-box" };
function eg(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("tiny-button"), l = F("monaco-editor"), c = F("tiny-split"), u = F("tiny-dialog-box");
  return C(), $("div", qv, [
    re(t.$slots, "default", { open: a.open }, () => [
      r.buttonShowContent ? (C(), $("div", {
        key: 0,
        class: Ye(["full-width", { "empty-color": a.value === "" }]),
        onClick: e[0] || (e[0] = (...d) => a.open && a.open(...d))
      }, [
        R("span", Hv, ce(a.value === "" ? a.buttonLabel : a.value), 1),
        O(o, {
          class: "edit-icon",
          name: "to-edit"
        })
      ], 2)) : (C(), ue(i, {
        key: 1,
        class: "edit-btn",
        onClick: a.open
      }, {
        default: M(() => [
          re(t.$slots, "icon", {}, void 0, !0),
          [r.buttonText[a.locale], r.buttonText].includes(a.EDIT_CODE_TEXT) ? (C(), ue(o, {
            key: 0,
            name: "page-schema",
            class: "edit-btn-icon"
          })) : ee("", !0),
          Se(" " + ce(a.buttonLabel), 1)
        ]),
        _: 3
      }, 8, ["onClick"]))
    ], !0),
    O(u, {
      visible: a.editorState.show,
      "onUpdate:visible": e[2] || (e[2] = (d) => a.editorState.show = d),
      title: a.titleLabel,
      width: "50vw",
      class: "meta-code-editor-dialog-box",
      "append-to-body": "",
      "close-on-click-modal": !1
    }, {
      footer: M(() => [
        R("div", Xv, [
          r.language === "json" && r.showFormatBtn ? (C(), ue(i, {
            key: 0,
            class: "format-btn",
            plain: "",
            type: "danger",
            onClick: a.formatCode
          }, {
            default: M(() => [
              Se(ce(t.$t("common.format")), 1)
            ]),
            _: 1
          }, 8, ["onClick"])) : ee("", !0),
          R("div", null, [
            O(i, { onClick: a.close }, {
              default: M(() => [
                Se(ce(t.$t("common.cancel")), 1)
              ]),
              _: 1
            }, 8, ["onClick"]),
            O(i, {
              type: "primary",
              onClick: a.save
            }, {
              default: M(() => [
                Se(ce(t.$t("common.save")), 1)
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ])
      ]),
      default: M(() => [
        R("div", Zv, [
          a.editorTipsTitle ? (C(), $("div", Wv, [
            R("span", {
              class: "header-tips-title",
              title: a.editorTipsTitle
            }, ce(a.editorTipsTitle), 9, Jv)
          ])) : ee("", !0),
          R("div", Qv, [
            O(c, {
              modelValue: a.editorState.splitWidth,
              "onUpdate:modelValue": e[1] || (e[1] = (d) => a.editorState.splitWidth = d)
            }, {
              left: M(() => [
                O(l, {
                  ref: "editor",
                  class: "source-code-content",
                  value: a.value,
                  options: a.options,
                  onEditorDidMount: a.editorDidMount
                }, null, 8, ["value", "options", "onEditorDidMount"])
              ]),
              right: M(() => [
                a.editorTipsDemo ? (C(), $("div", Gv, [
                  R("div", Kv, [
                    R("span", null, ce(t.$t("common.exampleCode")), 1),
                    R("pre", null, [
                      R("code", null, ce(a.editorTipsDemo), 1)
                    ])
                  ])
                ])) : ee("", !0)
              ]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          r.showErrorMsg ? (C(), $("div", Yv, ce(a.editorState.errorMsg), 1)) : ee("", !0)
        ])
      ]),
      _: 1
    }, 8, ["visible", "title"])
  ]);
}
const aC = /* @__PURE__ */ me(zv, [["render", eg], ["__scopeId", "data-v-ad90f8a6"]]), Zn = {
  DESCRIPTION_TYPE: {
    INFO: "info",
    WARNING: "warning",
    ERROR: "error"
  }
}, tg = {
  props: {
    type: {
      type: String,
      default: Zn.DESCRIPTION_TYPE.INFO
    },
    text: {
      type: String,
      default: ""
    },
    footer: {
      type: Object,
      default: () => ({})
    },
    border: {
      type: Boolean,
      default: !1
    },
    visible: {
      type: Boolean,
      default: !0
    }
  },
  setup(t, { emit: e }) {
    const r = Ce(!0), a = yt({
      wrapper: !0,
      warning: t.type === Zn.DESCRIPTION_TYPE.WARNING,
      error: t.type === Zn.DESCRIPTION_TYPE.ERROR
    }), n = () => {
      r.value = !1, e("close");
    };
    return Sr(() => {
      a.warning = t.type === Zn.DESCRIPTION_TYPE.WARNING, a.error = t.type === Zn.DESCRIPTION_TYPE.ERROR, r.value = t.visible;
    }), {
      showDescription: r,
      classObject: a,
      closeDescription: n
    };
  }
}, rg = { class: "content" }, ng = { class: "footer" }, ag = ["href"];
function sg(t, e, r, a, n, s) {
  return _r((C(), $("div", {
    class: Ye([a.classObject, { border: r.border }])
  }, [
    R("div", rg, [
      re(t.$slots, "content", {}, () => [
        Se(ce(r.text), 1)
      ], !0)
    ]),
    R("div", ng, [
      R("div", null, [
        re(t.$slots, "footer-left", {}, () => [
          R("a", {
            href: r.footer.href,
            target: "_blank",
            class: "footer-text link"
          }, ce(r.footer.text), 9, ag)
        ], !0)
      ]),
      R("div", null, [
        re(t.$slots, "footer-right", {}, () => [
          R("div", {
            class: "footer-text",
            onClick: e[0] || (e[0] = (...o) => a.closeDescription && a.closeDescription(...o))
          }, ce(r.footer.confirm), 1)
        ], !0)
      ])
    ])
  ], 2)), [
    [nn, a.showDescription]
  ]);
}
const ud = /* @__PURE__ */ me(tg, [["render", sg], ["__scopeId", "data-v-731c2f66"]]), og = {
  components: {
    MetaDescription: ud
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    src: {
      type: String,
      default: ""
    },
    cover: {
      type: String,
      default: ""
    }
  },
  setup() {
    return {
      isVscodeEnvironment: window.vscodeBridge
    };
  }
}, ig = ["href"], lg = ["src", "alt"], cg = {
  key: 1,
  class: "guide-video",
  controls: ""
}, ug = ["src"];
function dg(t, e, r, a, n, s) {
  const o = F("meta-description");
  return C(), ue(o, { class: "block-guide" }, {
    content: M(() => [
      R("div", null, ce(r.title), 1),
      R("div", null, [
        re(t.$slots, "video", {}, () => [
          Se("请观看指引视频")
        ], !0)
      ]),
      a.isVscodeEnvironment ? (C(), $("a", {
        key: 0,
        href: r.src,
        target: "_blank"
      }, [
        R("img", {
          class: "guide-video",
          src: r.cover,
          alt: r.cover
        }, null, 8, lg)
      ], 8, ig)) : (C(), $("video", cg, [
        R("source", {
          src: r.src,
          type: "video/mp4"
        }, null, 8, ug)
      ]))
    ]),
    _: 3
  });
}
const sC = /* @__PURE__ */ me(og, [["render", dg], ["__scopeId", "data-v-9a1a4d45"]]), fg = {
  props: {
    name: {
      type: String,
      default: "cross"
    },
    svgClass: {
      type: String,
      default: ""
    }
  },
  setup(t) {
    return {
      isTinyIcon: ie(() => t.name.toLowerCase().indexOf("icon") === 0)
    };
  }
}, hg = { class: "public-icon" };
function pg(t, e, r, a, n, s) {
  const o = F("svg-icon");
  return C(), $("span", hg, [
    a.isTinyIcon ? (C(), ue(ar(r.name), { key: 0 })) : (C(), ue(o, {
      key: 1,
      name: r.name,
      class: Ye(r.svgClass)
    }, null, 8, ["name", "class"]))
  ]);
}
const mg = /* @__PURE__ */ me(fg, [["render", pg]]), { OPEN_DELAY: vg } = Bs, gg = {
  components: {
    MonacoEditor: Vs,
    PublicIcon: mg,
    TinyTooltip: qr
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    options: {
      type: Object,
      default: () => ({})
    },
    showFormatBtn: {
      type: Boolean,
      default: !1
    },
    showFullScreenBtn: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["editorDidMount", "change", "fullscreenChange", "shortcutSave"],
  setup(t, { emit: e }) {
    const r = Ce(null), a = Ce(!1), n = ie(() => ({
      language: "javascript",
      lineNumbers: !1,
      minimap: {
        enabled: !1
      },
      ...t.options
    })), s = () => {
      var u, d;
      return (d = (u = r.value) == null ? void 0 : u.getEditor()) == null ? void 0 : d.getValue();
    }, o = () => r.value.getEditor(), i = () => {
      let u = o().getValue();
      const d = Function;
      try {
        if (u = new d(`return ${u}`)(), u instanceof Date)
          return {
            type: "JSExpression",
            value: o().getValue()
          };
      } catch {
      }
      return u;
    }, l = () => {
      const u = i();
      o().setValue(typeof u == "string" ? u.trim() : JSON.stringify(u, null, 2));
    };
    return yh(() => {
      r.value.initMonaco(r.value.getMonaco());
    }), bh(() => {
      r.value.getEditor().dispose();
    }), {
      editorOptions: n,
      editor: r,
      getEditor: o,
      getEditorValue: s,
      fullscreen: a,
      switchFullScreen: (u) => {
        a.value = u, e("fullscreenChange", u);
      },
      getValue: i,
      formatCode: l,
      OPEN_DELAY: vg
    };
  }
}, _g = { class: "editor-container-content" }, yg = { class: "toolbar" }, bg = { class: "toolbar-start" }, wg = { key: 1 };
function Eg(t, e, r, a, n, s) {
  const o = F("public-icon"), i = F("tiny-tooltip"), l = F("monaco-editor", !0);
  return C(), $("div", {
    class: Ye(["editor-container", { "editor-container-full": a.fullscreen }])
  }, [
    a.fullscreen ? re(t.$slots, "fullscreenHead", { key: 0 }, void 0, !0) : ee("", !0),
    R("div", _g, [
      R("div", yg, [
        R("div", bg, [
          re(t.$slots, "toolbarStart", {}, void 0, !0)
        ]),
        R("div", {
          class: Ye(["buttons", { "monaco-btn-fullscreen": a.fullscreen }]),
          id: "icon-buttons"
        }, [
          re(t.$slots, "buttons", {}, void 0, !0),
          r.showFormatBtn && r.options.language === "json" ? (C(), ue(i, {
            key: 0,
            content: "格式化",
            placement: "top",
            "open-delay": a.OPEN_DELAY.Default,
            effect: "light"
          }, {
            default: M(() => [
              O(o, {
                name: "json",
                onClick: a.formatCode
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["open-delay"])) : ee("", !0),
          r.showFullScreenBtn ? (C(), $("span", wg, [
            a.fullscreen ? (C(), ue(i, {
              key: 1,
              content: "退出全屏",
              effect: "light",
              placement: "top",
              "open-delay": a.OPEN_DELAY.Default
            }, {
              default: M(() => [
                O(o, {
                  name: "cancel-full-screen",
                  onClick: e[1] || (e[1] = (c) => a.switchFullScreen(!1))
                })
              ]),
              _: 1
            }, 8, ["open-delay"])) : (C(), ue(i, {
              key: 0,
              effect: "light",
              content: "全屏",
              placement: "top",
              "open-delay": a.OPEN_DELAY.Default
            }, {
              default: M(() => [
                O(o, {
                  name: "full-screen",
                  onClick: e[0] || (e[0] = (c) => a.switchFullScreen(!0))
                })
              ]),
              _: 1
            }, 8, ["open-delay"]))
          ])) : ee("", !0)
        ], 2)
      ]),
      O(l, {
        ref: "editor",
        class: "editor",
        value: r.value,
        options: a.editorOptions,
        language: "javascript",
        onEditorDidMount: e[2] || (e[2] = (c) => t.$emit("editorDidMount", c)),
        onShortcutSave: e[3] || (e[3] = (c) => t.$emit("shortcutSave", c)),
        onChange: e[4] || (e[4] = (c) => t.$emit("change", c))
      }, null, 8, ["value", "options"])
    ]),
    a.fullscreen ? re(t.$slots, "fullscreenFooter", { key: 1 }, void 0, !0) : ee("", !0)
  ], 2);
}
const oC = /* @__PURE__ */ me(gg, [["render", Eg], ["__scopeId", "data-v-661433e3"]]), Sg = {
  key: 0,
  class: "version-v"
}, Pg = ["onClick"], xg = ["onClick"], Cg = {
  key: 1,
  class: "empty"
}, kg = /* @__PURE__ */ Ls({
  __name: "BlockHistoryList",
  props: {
    history: {
      type: Array,
      default: () => []
    },
    isBlockManage: {
      type: Boolean,
      default: !1
    },
    lastVersion: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["preview", "restore"],
  setup(t) {
    return (e, r) => (C(), $(Xe, null, [
      t.history.length ? (C(), ue(gr(Th), {
        key: 0,
        data: t.history,
        "row-id": "id",
        height: "300"
      }, {
        default: M(() => [
          t.isBlockManage ? (C(), ue(gr(xa), {
            key: 0,
            field: "version",
            title: "版本号"
          }, {
            default: M((a) => [
              Se(ce(a.row.version) + " ", 1),
              a.row.version === t.lastVersion.versions ? (C(), $("span", Sg, "最新")) : ee("", !0)
            ]),
            _: 1
          })) : ee("", !0),
          O(gr(xa), {
            field: "updated_at",
            title: "发布时间"
          }, {
            default: M((a) => [
              Se(ce(gr(qu)(a.row.updated_at, "yyyy/MM/dd hh:mm:ss")), 1)
            ]),
            _: 1
          }),
          O(gr(xa), {
            field: "message",
            title: "描述"
          }),
          O(gr(xa), {
            width: "90",
            field: "operation",
            title: "操作"
          }, {
            default: M((a) => [
              R("span", {
                class: "operation-text",
                onClick: (n) => e.$emit("preview", a.row)
              }, "预览", 8, Pg),
              t.isBlockManage ? ee("", !0) : (C(), $("span", {
                key: 0,
                class: "operation-text",
                onClick: (n) => e.$emit("restore", a.row)
              }, "还原", 8, xg))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["data"])) : ee("", !0),
      t.history.length ? ee("", !0) : (C(), $("div", Cg, "暂无数据"))
    ], 64));
  }
}), iC = /* @__PURE__ */ me(kg, [["__scopeId", "data-v-2eae930f"]]), Ig = {
  components: {
    TinyPopover: ur
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(t) {
    var _, E;
    const {
      confirm: e
    } = Fs(), {
      pageState: r,
      canvasApi: a,
      getSchema: n
    } = yr(), {
      addBlockProperty: s,
      removePropertyLink: o,
      getCurrentBlock: i,
      editBlockProperty: l
    } = js(), {
      PLUGIN_NAME: c,
      activePlugin: u
    } = Hr(), {
      schema: d
    } = (n == null ? void 0 : n()) || {}, h = yt({
      newPropertyName: ""
    }), f = ((E = (_ = d == null ? void 0 : d.properties) == null ? void 0 : _[0]) == null ? void 0 : E.content) || [], m = ie(() => !!t.data.linked);
    return {
      state: h,
      isLinked: m,
      unLink: (P) => {
        e({
          title: "提示",
          message: "您确定要取消关联吗?",
          exec: () => {
            var k;
            ((k = r == null ? void 0 : r.currentSchema) == null ? void 0 : k.id) && (o({
              componentProperty: P
            }), Ma().addHistory());
          }
        });
      },
      addProperty: (P) => {
        h.newPropertyName = "", e({
          title: "属性名称",
          message: {
            render() {
              return O("div", null, [O(cn, {
                placeholder: "请输入字段名称",
                modelValue: h.newPropertyName,
                "onUpdate:modelValue": (A) => h.newPropertyName = A
              }, null)]);
            }
          },
          exec() {
            var L, H;
            const {
              schema: {
                id: A,
                componentName: k
              }
            } = ((H = (L = a.value) == null ? void 0 : L.getCurrent) == null ? void 0 : H.call(L)) || {}, B = Go(!0, {}, P, {
              property: h.newPropertyName || `${P.property}${A}`,
              linked: {
                id: A,
                componentName: k,
                property: P.property
              }
            });
            s(B, i()), Ma().addHistory();
          }
        });
      },
      editProperty: (P) => {
        var L, H, J;
        const {
          schema: {
            id: A,
            componentName: k
          }
        } = ((H = (L = a.value) == null ? void 0 : L.getCurrent) == null ? void 0 : H.call(L)) || {};
        (J = t.data) != null && J.linked && o({
          componentProperty: t.data
        }), P.linked = {
          id: A,
          componentName: k,
          property: t.data.property
        };
        const B = t.data.linked || {};
        Object.assign(B, {
          ...P.linked,
          blockProperty: P.property
        }), Object.assign(t.data, {
          linked: B
        }), l(P, t.data), Ma().addHistory();
      },
      properties: f,
      openBlockSetting: () => {
        u(c.BlockManage).then((P) => {
          P.openSettingPanel({
            item: i()
          });
        });
      }
    };
  }
}, dd = (t) => (Vr("data-v-fd3ff2e0"), t = t(), zr(), t), Rg = { class: "icon-wrap bind-prop" }, Tg = { class: "icon-wrap add-prop" }, Ag = { class: "context-menu" }, Og = /* @__PURE__ */ dd(() => /* @__PURE__ */ R("span", null, "创建并链接新属性", -1)), Dg = /* @__PURE__ */ dd(() => /* @__PURE__ */ R("span", null, "打开属性面板", -1)), Lg = ["onClick"];
function Ng(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("tiny-popover");
  return C(), ue(i, {
    class: "block-link-field",
    "popper-class": "option-popper block-new-attr-popover",
    "visible-arrow": !1
  }, {
    reference: M(() => [
      R("div", null, [
        R("span", Rg, [
          O(o, { name: "block-bind-prop" })
        ]),
        R("span", Tg, [
          O(o, { name: "block-add-prop" })
        ])
      ])
    ]),
    default: M(() => [
      R("ul", Ag, [
        a.isLinked ? (C(), $("li", {
          key: 0,
          class: "menu-item",
          onClick: e[0] || (e[0] = (l) => a.unLink(r.data))
        }, "取消关联")) : (C(), $("li", {
          key: 1,
          class: "menu-item",
          onClick: e[1] || (e[1] = (l) => a.addProperty(r.data))
        }, [
          O(o, { name: "plus-circle" }),
          Og
        ])),
        R("li", {
          class: "menu-item",
          onClick: e[2] || (e[2] = (...l) => a.openBlockSetting && a.openBlockSetting(...l))
        }, [
          O(o, { name: "setting" }),
          Dg
        ]),
        (C(!0), $(Xe, null, Pt(a.properties, (l) => {
          var c, u;
          return C(), $("li", {
            key: l.property,
            class: "menu-item property"
          }, [
            R("span", null, ce(l.property), 1),
            l.property !== ((u = (c = r.data) == null ? void 0 : c.linked) == null ? void 0 : u.blockProperty) ? (C(), $("span", {
              key: 0,
              class: "link-item",
              onClick: (d) => a.editProperty(l)
            }, " 关联 ", 8, Lg)) : ee("", !0)
          ]);
        }), 128))
      ])
    ]),
    _: 1
  });
}
const lC = /* @__PURE__ */ me(Ig, [["render", Ng], ["__scopeId", "data-v-fd3ff2e0"]]);
/**
* @vue/shared v3.4.29
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const $g = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (r) => e[r] || (e[r] = t(r));
}, Mg = $g((t) => t.charAt(0).toUpperCase() + t.slice(1)), Fg = {
  components: {
    TinyPopover: ur
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(t) {
    var y, b;
    const {
      confirm: e
    } = Fs(), {
      pageState: r
    } = yr(), {
      addBlockEvent: a,
      removeEventLink: n,
      getCurrentBlock: s,
      appendEventEmit: o
    } = js(), {
      PLUGIN_NAME: i,
      activePlugin: l
    } = Hr(), {
      schema: c
    } = ((b = (y = yr()) == null ? void 0 : y.getSchema) == null ? void 0 : b.call(y)) || {}, u = (c == null ? void 0 : c.events) || [], d = Object.entries(u).map(([_, E]) => ({
      name: _,
      ...E
    }));
    return {
      isLinked: ie(() => !!t.data.linked),
      unLink: (_) => {
        e({
          title: "提示",
          message: "您确定要取消关联吗?",
          exec: () => {
            var P;
            ((P = r == null ? void 0 : r.currentSchema) == null ? void 0 : P.id) && n(_);
          }
        });
      },
      addEvent: (_) => {
        const E = yt({
          name: ""
        }), P = /^[A-Za-z]\w*?\w$/, A = {
          name: [{
            pattern: P,
            message: "首字符为字母, 其它是单字字符"
          }]
        };
        let k = "";
        const B = (L) => {
          k = L;
        };
        e({
          title: "新建区块事件",
          status: "custom",
          message: {
            render() {
              return O("div", null, [O("div", null, [Se("此新区块事件将自动链接到此组件事件")]), O("br", null, null), O($s, {
                "show-message": !0,
                "label-width": "0",
                model: E,
                rules: A
              }, {
                default: () => [O(Ns, {
                  prop: "name"
                }, {
                  default: () => [O(cn, {
                    modelValue: E.name,
                    "onUpdate:modelValue": (L) => E.name = L,
                    placeholder: "请输入事件名",
                    onChange: B
                  }, null)]
                })]
              })]);
            }
          },
          exec() {
            var q, N;
            if (!P.test(k))
              return;
            const {
              schema: {
                id: L,
                componentName: H
              }
            } = ((N = (q = yr().canvasApi.value) == null ? void 0 : q.getCurrent) == null ? void 0 : N.call(q)) || {}, J = Go(!0, {}, _.metaEvent, {
              linked: {
                id: L,
                componentName: H,
                event: _.eventName
              }
            });
            a({
              name: `on${Mg(k.replace(/^on/i, ""))}`,
              event: J
            }, s()), o({
              eventName: k,
              functionName: _.ref
            });
          }
        });
      },
      editEvent: (_, E) => {
        var L, H;
        const {
          schema: {
            id: P,
            componentName: A
          }
        } = ((H = (L = yr().canvasApi.value) == null ? void 0 : L.getCurrent) == null ? void 0 : H.call(L)) || {};
        E.linkedEventName && n(E.linkedEventName);
        const B = Go(!0, {}, E.metaEvent, {
          linked: {
            id: P,
            componentName: A,
            event: E.eventName
          }
        });
        a({
          name: _.name,
          event: B
        }, s()), o({
          eventName: _.name,
          functionName: E.ref
        });
      },
      eventsList: d,
      openBlockSetting: () => {
        l(i.BlockManage).then((_) => {
          _.openSettingPanel({
            item: s()
          });
        });
      }
    };
  }
}, jg = (t) => (Vr("data-v-1826f617"), t = t(), zr(), t), Bg = /* @__PURE__ */ jg(() => /* @__PURE__ */ R("span", { class: "link-icon" }, "+", -1)), Ug = { class: "context-menu" }, Vg = ["onClick"];
function zg(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("tiny-popover");
  return C(), ue(i, {
    "popper-class": "quick",
    "visible-arrow": !1
  }, {
    reference: M(() => [
      Bg
    ]),
    default: M(() => [
      R("ul", Ug, [
        a.isLinked ? (C(), $("li", {
          key: 0,
          class: "menu-item",
          onClick: e[0] || (e[0] = (l) => a.unLink(r.data.linkedEventName))
        }, "取消关联")) : (C(), $("li", {
          key: 1,
          class: "menu-item add-event",
          onClick: e[1] || (e[1] = (l) => a.addEvent(r.data))
        }, [
          O(o, { name: "plus-circle" }),
          Se(" 新建事件 ")
        ])),
        R("li", {
          class: "menu-item",
          onClick: e[2] || (e[2] = (...l) => a.openBlockSetting && a.openBlockSetting(...l))
        }, "管理事件"),
        (C(!0), $(Xe, null, Pt(a.eventsList, (l) => {
          var c;
          return C(), $("li", {
            key: l.name,
            class: "menu-item"
          }, [
            Se(ce(l.name) + " ", 1),
            l.name !== ((c = r.data) == null ? void 0 : c.linkedEventName) ? (C(), $("span", {
              key: 0,
              class: "link-item",
              onClick: (u) => a.editEvent(l, r.data)
            }, "关联", 8, Vg)) : ee("", !0)
          ]);
        }), 128))
      ])
    ]),
    _: 1
  });
}
const cC = /* @__PURE__ */ me(Fg, [["render", zg], ["__scopeId", "data-v-1826f617"]]), qg = {
  components: {
    MetaDescription: ud
  },
  setup() {
    const { getCurrentBlock: t } = js(), { PLUGIN_NAME: e, activePlugin: r } = Hr();
    return {
      openBlockSetting: () => {
        r(e.BlockManage).then((n) => {
          n.openSettingPanel({ item: t() });
        });
      }
    };
  }
}, Hg = (t) => (Vr("data-v-cdc0cf88"), t = t(), zr(), t), Zg = /* @__PURE__ */ Hg(() => /* @__PURE__ */ R("span", null, "设置区块暴露属性", -1));
function Wg(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("meta-description");
  return C(), ue(i, { class: "description" }, {
    content: M(() => [
      R("div", {
        class: "setting-block",
        onClick: e[0] || (e[0] = (...l) => a.openBlockSetting && a.openBlockSetting(...l))
      }, [
        O(o, { name: "block-add-prop" }),
        Zg
      ])
    ]),
    _: 1
  });
}
const uC = /* @__PURE__ */ me(qg, [["render", Wg], ["__scopeId", "data-v-cdc0cf88"]]), Jg = {
  key: 0,
  class: "table-selection"
}, Qg = { class: "block-item-img" }, Gg = ["src"], Kg = {
  key: 2,
  class: "top-left"
}, Ic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA11JREFUaEPtmUvIVVUYhp83CIJKpIsOEsSBAxEiEAwqRDGDBCmRkCwhwQQbSANDEbwNgvgzxEIUCwRBEB2EgiQR5MA/RcHImRBKkYhYaAliULzxwT6y3O1zzv735Rx+PN/srP1d3ve7rLX2PmKSiyY5fkYEhl3BUQVGFaiZgQdayPZTwOvA7Jp+2zI/C5yV9FcnQJ7AB8DetqI35HdM0qZuBL4HFjYUqC03pyUteigIPMC0rXSW8Ws77YzSFRgRKJPdMjqtVcD2DOC6pH/LAKmq0zgB2+uAXcCTwD1gs6Q9VQH2s2uDwO/A00ngv4EnJP3TD0zneZaEt4GvJB3uZdcoAdsBPAjkZaakX8sQsP0ecDDR/UhSVLRQGiUQEWzfAKYl0e4CU8rMgu0XgXMFSNdJ+rKIQRsE1gBjwDPAbWCLpH39sm97CvADMLeL7kpJR/PPGieQ9PGzkm72A57oB7i3Ev1vsstjZylmaJmkU6nP1giUBZ613U5gW2LzGzAHiEE+kKz/AbwhaTwhPtyT2PZK4EiO8MuSop1iprYAHyfPrwDLJV3Kng+PgO3ngZ9y4NdL2p9rk93Ah8naj8AKSVdbayHb0c+PASck/VkwfI8CASQd2v2S1nfZbeI8WJU8O53NzLHkmt/MZc72IWB1Fuxi9Lekk7ms5oe27wXR9rfAksTPCWAqsCBbq0/A9qfAxoIsfgJ8Lum67e3AjkQnzo55kq71Gn7bATZ6/oWc7fRGCNgO4EGgm5wJEkB+P18qKbbNvmI73smDxHMFytUrYDtaJlonldgeg9TjPZBtlPRZX+SJgu2XgJiBmKNUqhGw/RpwPBvajsMvJG2wvTQjcf9dNYkYl7X3JwK+o2v7TeDrnO0FSfM7a/mvEoX7bbYVxjDNTJwdlvRuEix2o61xtQYeydbHJb1SBXziN8inB93EKmA7hifA32cNnJIU34/+J7ajCu8AccWOgb5ch0DY2o6DbVbmZ8IEAvyyBMR54FVJd+oCK2tf+SADfgbWJoHid4D/pWzwJvSqEgiQac/fAhZLipN1oFKVQB7kEknfDRR5FqwJAoUvGoMi0wSBQWEtE6f0LlTG2TB0ehKY9J/XJ/cfHMPoh7oxR/9S1s1gXftRBepmsK79qAJ1M1jX/j/bzulAKB9d1wAAAABJRU5ErkJggg==", Yg = /* @__PURE__ */ Ls({
  __name: "PluginBlockItemImg",
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    checked: {
      type: Boolean,
      default: !1
    },
    // 是否显示多选框
    showCheckbox: {
      type: Boolean,
      default: !1
    },
    displayTable: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["check"],
  setup(t, { emit: e }) {
    const r = t, a = e, n = (s) => {
      a("check", s);
    };
    return (s, o) => {
      const i = F("svg-icon");
      return C(), $(Xe, null, [
        t.showCheckbox && t.displayTable ? (C(), $("div", Jg, [
          O(gr(Ka), {
            modelValue: r.checked,
            onChange: n
          }, null, 8, ["modelValue"])
        ])) : ee("", !0),
        R("div", Qg, [
          t.item.screenshot ? (C(), $("img", {
            key: 0,
            class: "item-image",
            src: t.item.screenshot || Ic,
            draggable: "false",
            onError: o[0] || (o[0] = (l) => l.target.src = Ic)
          }, null, 40, Gg)) : (C(), ue(i, {
            key: 1,
            class: "item-image item-default-img",
            name: "block-default"
          })),
          t.showCheckbox && !t.displayTable ? (C(), $("div", Kg, [
            O(gr(Ka), {
              modelValue: r.checked,
              onChange: n
            }, null, 8, ["modelValue"])
          ])) : ee("", !0)
        ])
      ], 64);
    };
  }
}), Xg = /* @__PURE__ */ me(Yg, [["__scopeId", "data-v-606c3cad"]]), e_ = {
  props: {
    /**
     * 控制搜索空数据显示
     */
    isShow: {
      type: Boolean,
      default: !1
    }
  }
}, t_ = (t) => (Vr("data-v-1473a6ca"), t = t(), zr(), t), r_ = {
  key: 0,
  class: "empty-wrap"
}, n_ = /* @__PURE__ */ t_(() => /* @__PURE__ */ R("p", { class: "empty-text" }, "暂无数据", -1));
function a_(t, e, r, a, n, s) {
  const o = F("svg-icon");
  return r.isShow ? (C(), $("div", r_, [
    O(o, {
      class: "empty-icon",
      name: "empty"
    }),
    n_
  ])) : ee("", !0);
}
const s_ = /* @__PURE__ */ me(e_, [["render", a_], ["__scopeId", "data-v-1473a6ca"]]), o_ = /* @__PURE__ */ Ls({
  __name: "SelectAll",
  props: {
    allItems: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    hiddenLabel: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["selectAll"],
  setup(t, { emit: e }) {
    const r = t, a = e, n = ie(() => r.allItems.filter((l) => r.selected.some((c) => l.id === c.id))), s = ie(
      () => r.selected.filter((l) => !r.allItems.some((c) => l.id === c.id))
    ), o = ie({
      get() {
        return r.allItems.length > 0 && r.allItems.length === n.value.length;
      },
      set(l) {
        if (l)
          a("selectAll", r.allItems.concat(s.value));
        else {
          if (s.value.length) {
            a("selectAll", s.value);
            return;
          }
          a("selectAll", null);
        }
      }
    }), i = ie(() => n.value.length > 0 && n.value.length !== r.allItems.length);
    return (l, c) => (C(), ue(gr(Ka), {
      class: "block-select-all",
      indeterminate: i.value,
      modelValue: o.value,
      "onUpdate:modelValue": c[0] || (c[0] = (u) => o.value = u)
    }, {
      default: M(() => [
        Se(ce(t.hiddenLabel ? "" : "全选"), 1)
      ]),
      _: 1
    }, 8, ["indeterminate", "modelValue"]));
  }
}), Rc = {
  Default: "default",
  Mini: "mini",
  List: "list"
}, i_ = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA11JREFUaEPtmUvIVVUYhp83CIJKpIsOEsSBAxEiEAwqRDGDBCmRkCwhwQQbSANDEbwNgvgzxEIUCwRBEB2EgiQR5MA/RcHImRBKkYhYaAliULzxwT6y3O1zzv735Rx+PN/srP1d3ve7rLX2PmKSiyY5fkYEhl3BUQVGFaiZgQdayPZTwOvA7Jp+2zI/C5yV9FcnQJ7AB8DetqI35HdM0qZuBL4HFjYUqC03pyUteigIPMC0rXSW8Ws77YzSFRgRKJPdMjqtVcD2DOC6pH/LAKmq0zgB2+uAXcCTwD1gs6Q9VQH2s2uDwO/A00ngv4EnJP3TD0zneZaEt4GvJB3uZdcoAdsBPAjkZaakX8sQsP0ecDDR/UhSVLRQGiUQEWzfAKYl0e4CU8rMgu0XgXMFSNdJ+rKIQRsE1gBjwDPAbWCLpH39sm97CvADMLeL7kpJR/PPGieQ9PGzkm72A57oB7i3Ev1vsstjZylmaJmkU6nP1giUBZ613U5gW2LzGzAHiEE+kKz/AbwhaTwhPtyT2PZK4EiO8MuSop1iprYAHyfPrwDLJV3Kng+PgO3ngZ9y4NdL2p9rk93Ah8naj8AKSVdbayHb0c+PASck/VkwfI8CASQd2v2S1nfZbeI8WJU8O53NzLHkmt/MZc72IWB1Fuxi9Lekk7ms5oe27wXR9rfAksTPCWAqsCBbq0/A9qfAxoIsfgJ8Lum67e3AjkQnzo55kq71Gn7bATZ6/oWc7fRGCNgO4EGgm5wJEkB+P18qKbbNvmI73smDxHMFytUrYDtaJlonldgeg9TjPZBtlPRZX+SJgu2XgJiBmKNUqhGw/RpwPBvajsMvJG2wvTQjcf9dNYkYl7X3JwK+o2v7TeDrnO0FSfM7a/mvEoX7bbYVxjDNTJwdlvRuEix2o61xtQYeydbHJb1SBXziN8inB93EKmA7hifA32cNnJIU34/+J7ajCu8AccWOgb5ch0DY2o6DbVbmZ8IEAvyyBMR54FVJd+oCK2tf+SADfgbWJoHid4D/pWzwJvSqEgiQac/fAhZLipN1oFKVQB7kEknfDRR5FqwJAoUvGoMi0wSBQWEtE6f0LlTG2TB0ehKY9J/XJ/cfHMPoh7oxR/9S1s1gXftRBepmsK79qAJ1M1jX/j/bzulAKB9d1wAAAABJRU5ErkJggg==", hl = {
  components: {
    TinyTooltip: qr,
    PluginBlockItemImg: Xg,
    SvgButton: cl,
    SearchEmpty: s_,
    SelectAll: o_
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    /*
      列表样式，可选择为 default || list || mini  默认值为 default
    */
    blockStyle: {
      type: String,
      default: Rc.Default
    },
    /*
    用于区分是否是区块管理侧的列表
    */
    isBlockManage: {
      type: Boolean,
      default: !1
    },
    /*
      是否显示新增按钮
    */
    showAddButton: {
      type: Boolean,
      default: !1
    },
    /*
      是否显示区块详情弹框
    */
    showBlockDetail: {
      type: Boolean,
      default: !1
    },
    /*
      是否显示快照
    */
    showBlockShot: {
      type: Boolean,
      default: !1
    },
    /*
    默认 ICON 的提示文字
    */
    defaultIconTip: {
      type: String,
      default: ""
    },
    // 是否显示历史备份按钮
    showSettingIcon: {
      type: Boolean,
      default: !0
    },
    // 外部传入的区块信息：不通过区块列表里点击展示，而是从外面直接调起区块面板展示的区块。
    externalBlock: {
      type: Object,
      default: null
    },
    // 是否显示多选框
    showCheckbox: {
      type: Boolean,
      default: !1
    },
    // 选中的区块
    checked: {
      type: Array,
      default: () => []
    },
    gridColumns: {
      type: Number,
      default: 2
    }
  },
  emits: ["click", "iconClick", "add", "deleteBlock", "openVersionPanel", "editBlock", "checkAll", "cancelCheckAll"],
  setup(t, { emit: e }) {
    const r = tn("panelState", {}), a = tn("blockUsers", []), n = yt({
      activeIndex: -1,
      data: ie(() => t.data),
      top: 0,
      hover: !1,
      currentBlock: {},
      hoverItemId: null,
      currentShowMenuId: null,
      timeoutId: null
    }), s = ie(() => (a == null ? void 0 : a.value) || []), o = (_) => {
      for (; _.nodeName !== "LI"; )
        _ = _.parentNode;
      return _;
    }, i = (_, E) => {
      n.currentBlock = _, n.top = `${o(E.target).getBoundingClientRect().top}px`, n.hover = !0, n.hoverItemId = _.id, n.currentShowMenuId === _.id && clearTimeout(n.timeoutId);
    }, l = ({ event: _, item: E, index: P }) => {
      n.activeIndex = P, e("editBlock", E), e("iconClick", { event: _, item: E, index: P, isOpen: !1 });
    }, c = ({ event: _, item: E, index: P }) => {
      t.isBlockManage && l({ event: _, item: E, index: P }), e("click", E);
    }, u = ({ event: _, item: E, index: P }) => {
      n.activeIndex = P, e("iconClick", { event: _, item: E, index: P, isOpen: !0 });
    }, d = () => {
      n.activeIndex = -1;
    }, h = () => {
      n.hover = !1;
    }, f = (_) => (_.groupName ? `分组: ${_.groupName + `
`}` : "") + (_.label || _.blockName), m = () => {
      n.timeoutId = setTimeout(() => {
        n.hoverItemId = null, n.currentShowMenuId = null;
      }, 200);
    }, p = () => {
      clearTimeout(n.timeoutId);
    }, v = (_) => {
      n.currentShowMenuId ? n.currentShowMenuId = null : n.currentShowMenuId = _.id;
    }, y = (_, E) => {
      const P = _.findIndex((A) => A.id === E.id);
      n.activeIndex = P;
    };
    Vt(
      () => t.data,
      async (_) => {
        _ && t.externalBlock && y(_, t.externalBlock);
      }
    ), Vt(
      () => t.externalBlock,
      async (_) => {
        var E;
        _ && ((E = n.data) != null && E.length) && y(n.data, _);
      }
    );
    const b = (_) => {
      Array.isArray(_) ? e("checkAll", _) : e("cancelCheckAll");
    };
    return {
      BlockStyles: Rc,
      isShortcutPanel: r.isShortcutPanel,
      state: n,
      users: s,
      getTitle: f,
      blockClick: c,
      iconClick: u,
      clearActive: d,
      openBlockShotPanel: i,
      iconSettingMove: h,
      defaultImg: i_,
      handleBlockItemLeave: m,
      handleSettingMouseOver: p,
      handleShowVersionMenu: v,
      editBlock: l,
      format: qu,
      handleSelectAll: b
    };
  }
}, Tc = () => {
  wh((t) => ({
    d6d2959a: t.state.top,
    "726cbdb2": t.gridColumns
  }));
}, Ac = hl.setup;
hl.setup = Ac ? (t, e) => (Tc(), Ac(t, e)) : Tc;
const zs = (t) => (Vr("data-v-1acc4069"), t = t(), zr(), t), l_ = {
  key: 0,
  class: "header"
}, c_ = { class: "col-checkbox" }, u_ = /* @__PURE__ */ zs(() => /* @__PURE__ */ R("div", { class: "col-name" }, "区块名称", -1)), d_ = /* @__PURE__ */ zs(() => /* @__PURE__ */ R("div", { class: "col-time" }, "创建时间", -1)), f_ = /* @__PURE__ */ zs(() => /* @__PURE__ */ R("div", { class: "col-created-by" }, "创建人", -1)), h_ = { class: "block-plus-icon" }, p_ = /* @__PURE__ */ zs(() => /* @__PURE__ */ R("div", { class: "item-text" }, "添加区块", -1)), m_ = ["draggable", "title", "onMousedown", "onMouseover"], v_ = { class: "item-text" }, g_ = { class: "item-name" }, __ = {
  key: 0,
  class: "item-description"
}, y_ = {
  key: 0,
  class: "publish-flag"
}, b_ = {
  key: 1,
  class: "block-detail"
}, w_ = { class: "list" }, E_ = ["onMousedown"], S_ = ["onMousedown"], P_ = { class: "list" }, x_ = ["onClick"], C_ = ["onClick"], k_ = {
  key: 1,
  class: "block-shortcut"
}, I_ = { class: "block-shortcut-title" }, R_ = {
  key: 0,
  class: "block-shortcut-description"
}, T_ = { class: "block-shortcut-image-wrapper" }, A_ = ["src"];
function O_(t, e, r, a, n, s) {
  const o = F("select-all"), i = F("svg-icon"), l = F("plugin-block-item-img"), c = F("svg-button"), u = F("tiny-tooltip"), d = F("search-empty");
  return C(), $(Xe, null, [
    r.blockStyle === a.BlockStyles.Mini && r.showCheckbox ? (C(), $("div", l_, [
      R("div", c_, [
        O(o, {
          allItems: r.data,
          selected: r.checked,
          "hidden-label": !0,
          onSelectAll: a.handleSelectAll
        }, null, 8, ["allItems", "selected", "onSelectAll"])
      ]),
      u_,
      d_,
      f_
    ])) : ee("", !0),
    a.state.data.length || r.showAddButton ? (C(), $("ul", {
      key: 1,
      class: Ye([
        "block-list",
        "lowcode-scrollbar",
        { "is-small-list": r.blockStyle === a.BlockStyles.Mini },
        { isShortcutPanel: a.isShortcutPanel }
      ]),
      onMouseleave: e[8] || (e[8] = (h) => a.state.hover = !1)
    }, [
      r.showAddButton ? (C(), $("li", {
        key: 0,
        class: "block-item block-plus",
        onClick: e[0] || (e[0] = (h) => t.$emit("add"))
      }, [
        R("span", h_, [
          O(i, { name: "add" })
        ]),
        p_
      ])) : ee("", !0),
      (C(!0), $(Xe, null, Pt(a.state.data, (h, f) => (C(), $("li", {
        key: h.blockName,
        draggable: !r.isBlockManage && r.showSettingIcon,
        class: Ye([
          "block-item",
          { "is-disabled": r.showBlockDetail },
          { "block-item-small-list": r.blockStyle === a.BlockStyles.Mini }
        ]),
        title: a.getTitle(h),
        onMousedown: er((m) => a.blockClick({ event: m, item: h, index: f }), ["stop", "left"]),
        onMouseover: er((m) => a.openBlockShotPanel(h, m), ["stop"]),
        onMouseleave: e[6] || (e[6] = (...m) => a.handleBlockItemLeave && a.handleBlockItemLeave(...m))
      }, [
        re(t.$slots, "default", { data: h }, () => {
          var m;
          return [
            O(l, {
              item: h,
              "show-checkbox": r.showCheckbox,
              checked: r.checked.some((p) => p.id === h.id),
              "display-table": r.blockStyle === a.BlockStyles.Mini
            }, null, 8, ["item", "show-checkbox", "checked", "display-table"]),
            R("div", v_, [
              R("div", g_, ce(h.name_cn || h.label || ((m = h.content) == null ? void 0 : m.fileName)), 1),
              r.blockStyle === a.BlockStyles.List ? (C(), $("div", __, ce(h.description), 1)) : ee("", !0)
            ]),
            r.isBlockManage && !h.is_published ? (C(), $("div", y_, "未发布")) : ee("", !0),
            r.isBlockManage ? (C(), $("div", b_, [
              R("div", {
                class: "setting-menu",
                onMouseover: e[2] || (e[2] = er((...p) => a.handleSettingMouseOver && a.handleSettingMouseOver(...p), ["stop"])),
                onMouseleave: e[3] || (e[3] = (...p) => a.handleBlockItemLeave && a.handleBlockItemLeave(...p))
              }, [
                R("ul", w_, [
                  R("li", {
                    class: "list-item",
                    onMousedown: er((p) => a.editBlock({ event: p, item: h, index: f }), ["stop", "left"])
                  }, [
                    O(c, {
                      class: "list-item-svg",
                      hoverBgColor: !1,
                      name: "to-edit"
                    })
                  ], 40, E_),
                  R("li", {
                    class: "list-item",
                    onMouseover: e[1] || (e[1] = er((...p) => a.iconSettingMove && a.iconSettingMove(...p), ["stop"])),
                    onMousedown: er((p) => a.iconClick({ event: p, item: h, index: f }), ["stop", "prevent"])
                  }, [
                    O(c, {
                      class: "list-item-svg",
                      hoverBgColor: !1,
                      name: "setting"
                    })
                  ], 40, S_)
                ])
              ], 32)
            ])) : r.showSettingIcon ? (C(), $("div", {
              key: 2,
              class: Ye(["block-setting", { "is-current-visible-icon": a.state.hoverItemId === h.id }]),
              title: " "
            }, [
              R("div", {
                class: "setting-menu",
                onMouseover: e[4] || (e[4] = er((...p) => a.handleSettingMouseOver && a.handleSettingMouseOver(...p), ["stop"])),
                onMouseleave: e[5] || (e[5] = (...p) => a.handleBlockItemLeave && a.handleBlockItemLeave(...p))
              }, [
                R("ul", P_, [
                  O(u, {
                    content: "版本列表",
                    placement: "top",
                    effect: "light"
                  }, {
                    default: M(() => [
                      R("li", {
                        class: "list-item",
                        onClick: er((p) => t.$emit("openVersionPanel", { item: h, index: f }), ["stop"])
                      }, [
                        O(c, {
                          class: "list-item-svg",
                          hoverBgColor: !1,
                          name: "versions"
                        })
                      ], 8, x_)
                    ]),
                    _: 2
                  }, 1024),
                  O(u, {
                    content: "移除",
                    placement: "top",
                    effect: "light"
                  }, {
                    default: M(() => [
                      R("li", {
                        class: "list-item",
                        onClick: er((p) => t.$emit("deleteBlock", h), ["stop"])
                      }, [
                        O(c, {
                          class: "list-item-svg",
                          hoverBgColor: !1,
                          name: "remove"
                        })
                      ], 8, C_)
                    ]),
                    _: 2
                  }, 1024)
                ])
              ], 32)
            ], 2)) : ee("", !0)
          ];
        }, !0)
      ], 42, m_))), 128)),
      r.showBlockShot && a.state.hover && a.state.currentBlock.screenshot ? (C(), $("div", k_, [
        R("div", I_, ce(a.state.currentBlock.label) + "预览图", 1),
        a.state.currentBlock.description ? (C(), $("div", R_, ce(a.state.currentBlock.description), 1)) : ee("", !0),
        R("div", T_, [
          R("img", {
            class: "block-shortcut-image",
            src: a.state.currentBlock.screenshot || a.defaultImg,
            onError: e[7] || (e[7] = (h) => h.target.src = a.defaultImg)
          }, null, 40, A_)
        ])
      ])) : ee("", !0)
    ], 34)) : ee("", !0),
    O(d, {
      isShow: !a.state.data.length && !r.showAddButton
    }, null, 8, ["isShow"])
  ], 64);
}
const dC = /* @__PURE__ */ me(hl, [["render", O_], ["__scopeId", "data-v-1acc4069"]]), {
  OPEN_DELAY: D_
} = Bs, L_ = {
  components: {
    TinyPopover: ur,
    TinyDialogBox: Ms,
    TinySearch: Ah,
    TinyButton: dr,
    MonacoEditor: Vs,
    SvgButton: cl,
    MetaListItems: bv,
    IconYes: Vh()
  },
  props: {
    bindLifeCycles: Object,
    isPage: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["updatePageLifeCycles", "bind"],
  setup(t, {
    emit: e
  }) {
    var p, v, y, b;
    const {
      confirm: r
    } = Fs(), {
      getPageContent: a
    } = Jh(), n = (v = ka("engine.config")) == null ? void 0 : v.lifeCyclesOptions[(p = ka("engine.config")) == null ? void 0 : p.dslMode], s = (b = ka("engine.config")) == null ? void 0 : b.lifeCycleTips[(y = ka("engine.config")) == null ? void 0 : y.dslMode], o = yt({
      showPopover: !0,
      showLifeCyclesDialog: !1,
      title: "",
      lifeCycles: n,
      bindLifeCycles: {},
      editorValue: "{}",
      hasError: !1,
      linterWorker: null,
      completionProvider: null
    });
    Sr(() => {
      o.bindLifeCycles = t.bindLifeCycles || {};
    });
    const i = (_) => {
      if (!_) {
        o.lifeCycles = n;
        return;
      }
      o.lifeCycles = n.filter((E) => (E == null ? void 0 : E.toLowerCase().indexOf(_.toLowerCase())) > -1);
    }, l = () => {
      const _ = yr().getSchema(), E = a(), {
        id: P,
        fileName: A
      } = E;
      (P === _.id || A === _.fileName) && (_.lifeCycles = o.bindLifeCycles);
    }, c = (_) => {
      r({
        title: "提示",
        message: `您确定要删除 ${_} 吗？`,
        exec: () => {
          delete o.bindLifeCycles[_], l();
        }
      });
    }, u = Ce(null), d = (_) => {
      var P, A, k;
      o.title = _;
      const E = ((P = t.bindLifeCycles) == null ? void 0 : P[_]) || ((k = (A = yr().getSchema()) == null ? void 0 : A.lifeCycles) == null ? void 0 : k[_]);
      o.editorValue = (E == null ? void 0 : E.value) || `function ${_} (${_ === "setup" ? "{ props, state, watch, onMounted }" : ""}) {} `, o.showLifeCyclesDialog = !0, setTimeout(() => {
        u.value.getEditor().trigger("anyString", "editor.action.formatDocument");
      });
    }, h = () => {
      if (o.hasError) {
        zu({
          type: "error",
          message: "代码静态检查有错误，请先修改后再保存"
        });
        return;
      }
      const E = {
        type: "JSFunction",
        value: u.value.getEditor().getValue()
      };
      o.bindLifeCycles || (o.bindLifeCycles = {}), o.bindLifeCycles[o.title] = E, o.showLifeCyclesDialog = !1, l(), t.isPage ? e("updatePageLifeCycles", o.bindLifeCycles) : e("bind", o.bindLifeCycles);
    }, f = (_) => {
      var E;
      u.value && (o.completionProvider = Yh(u.value.getMonaco(), (E = u.value.getEditor()) == null ? void 0 : E.getModel()), o.linterWorker = ep(_, u.value.getMonaco(), o));
    }, m = () => {
      if (!u.value)
        return;
      const _ = u.value.getEditor().getModel();
      Xh(_, o.linterWorker);
    };
    return nl(() => {
      var _, E, P, A;
      (E = (_ = o.completionProvider) == null ? void 0 : _.forEach) == null || E.call(_, (k) => {
        k.dispose();
      }), (A = (P = o.linterWorker) == null ? void 0 : P.terminate) == null || A.call(P);
    }), {
      state: o,
      lifeCycleTips: s,
      editorRef: u,
      searchLifeCyclesList: i,
      openLifeCyclesPanel: d,
      deleteLifeCycle: c,
      editorConfirm: h,
      editorDidMount: f,
      handleEditorChange: m,
      OPEN_DELAY: D_
    };
  }
}, N_ = { class: "life-cycle" }, $_ = { class: "popover-list" }, M_ = ["onClick"], F_ = { class: "life-cycle-tips" }, j_ = { class: "life-cycle-content-item" }, B_ = { class: "bind-dialog-title" }, U_ = { class: "bind-dialog-text" }, V_ = { class: "bind-dialog-btn" }, z_ = {
  key: 0,
  class: "dialog-content"
}, q_ = { class: "dialog-content-left" }, H_ = { class: "life-cycle-list" }, Z_ = ["onClick"], W_ = { class: "dialog-content-right" };
function J_(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("tiny-button"), l = F("tiny-popover"), c = F("svg-button"), u = F("meta-list-items"), d = F("tiny-search"), h = F("icon-yes"), f = F("monaco-editor"), m = F("tiny-dialog-box");
  return C(), $(Xe, null, [
    R("div", N_, [
      O(l, {
        modelValue: a.state.showPopover,
        "onUpdate:modelValue": e[0] || (e[0] = (p) => a.state.showPopover = p),
        placement: "bottom-end",
        trigger: "hover",
        popperClass: "option-popper",
        "open-delay": a.OPEN_DELAY.Default
      }, {
        reference: M(() => [
          O(i, { class: "life-cycle-btn" }, {
            default: M(() => [
              O(o, { name: "add" }),
              Se(ce(r.isPage ? "添加页面生命周期" : "添加区块生命周期"), 1)
            ]),
            _: 1
          })
        ]),
        default: M(() => [
          R("div", $_, [
            R("ul", null, [
              (C(!0), $(Xe, null, Pt(a.state.lifeCycles, (p, v) => (C(), $("li", {
                key: v,
                class: Ye({ existed: a.state.bindLifeCycles.hasOwnProperty(p) }),
                onClick: (y) => a.openLifeCyclesPanel(p)
              }, [
                R("div", null, ce(p), 1)
              ], 10, M_))), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["modelValue", "open-delay"])
    ]),
    R("div", F_, ce(a.lifeCycleTips), 1),
    O(u, {
      optionsList: Object.keys(a.state.bindLifeCycles),
      draggable: !1,
      class: Ye({ "life-cycle-content-list": Object.keys(a.state.bindLifeCycles).length })
    }, {
      content: M(({ data: p }) => [
        R("div", j_, ce(p), 1)
      ]),
      operate: M(({ data: p }) => [
        O(c, {
          hoverBgColor: !1,
          name: "setting",
          onClick: (v) => a.openLifeCyclesPanel(p)
        }, null, 8, ["onClick"]),
        O(c, {
          hoverBgColor: !1,
          name: "delete",
          onClick: (v) => a.deleteLifeCycle(p)
        }, null, 8, ["onClick"])
      ]),
      _: 1
    }, 8, ["optionsList", "class"]),
    O(m, {
      visible: a.state.showLifeCyclesDialog,
      "onUpdate:visible": e[2] || (e[2] = (p) => a.state.showLifeCyclesDialog = p),
      fullscreen: "",
      "show-close": !1,
      "append-to-body": !0
    }, {
      title: M(() => [
        R("div", B_, [
          R("div", U_, ce(r.isPage ? "添加页面生命周期" : "添加区块生命周期"), 1),
          R("div", V_, [
            O(i, {
              type: "info",
              onClick: a.editorConfirm
            }, {
              default: M(() => [
                Se("保存")
              ]),
              _: 1
            }, 8, ["onClick"]),
            O(c, {
              name: "close",
              onClick: e[1] || (e[1] = (p) => a.state.showLifeCyclesDialog = !1)
            })
          ])
        ])
      ]),
      footer: M(() => []),
      default: M(() => [
        a.state.showLifeCyclesDialog ? (C(), $("div", z_, [
          R("div", q_, [
            O(d, {
              placeholder: "搜索",
              "onUpdate:modelValue": a.searchLifeCyclesList
            }, null, 8, ["onUpdate:modelValue"]),
            R("ul", H_, [
              (C(!0), $(Xe, null, Pt(a.state.lifeCycles, (p, v) => (C(), $("li", {
                key: v,
                onClick: (y) => a.openLifeCyclesPanel(p)
              }, [
                R("div", {
                  class: Ye(["life-cycle-name", { "life-cycle-selected": p === a.state.title }])
                }, [
                  Se(ce(p) + " ", 1),
                  p === a.state.title ? (C(), ue(h, {
                    key: 0,
                    class: "life-cycle-selected__icon"
                  })) : ee("", !0)
                ], 2)
              ], 8, Z_))), 128))
            ])
          ]),
          R("div", W_, [
            O(f, {
              ref: "editorRef",
              class: "life-cycle-editor",
              options: {
                language: "javascript"
              },
              value: a.state.editorValue,
              onChange: a.handleEditorChange,
              onEditorDidMount: a.editorDidMount
            }, null, 8, ["value", "onChange", "onEditorDidMount"])
          ])
        ])) : ee("", !0)
      ]),
      _: 1
    }, 8, ["visible"])
  ], 64);
}
const fC = /* @__PURE__ */ me(L_, [["render", J_], ["__scopeId", "data-v-fa47fa13"]]), Q_ = {
  components: {
    IconInfo: zh()
  },
  props: {
    type: {
      type: String,
      default: ""
    }
  }
}, G_ = { class: "left" }, K_ = { class: "middle" }, Y_ = { class: "right" };
function X_(t, e, r, a, n, s) {
  const o = F("icon-info");
  return C(), $("div", {
    class: Ye(["tip", r.type])
  }, [
    R("div", G_, [
      re(t.$slots, "icon", {}, () => [
        O(o, { class: "icon" })
      ], !0)
    ]),
    R("div", K_, [
      re(t.$slots, "content", {}, void 0, !0)
    ]),
    R("div", Y_, [
      re(t.$slots, "more", {}, void 0, !0)
    ])
  ], 2);
}
const hC = /* @__PURE__ */ me(Q_, [["render", X_], ["__scopeId", "data-v-6bd86f69"]]), ey = {
  components: {
    TinySelect: Dh,
    TinyOption: Oh,
    TinyButton: dr,
    TinyInput: cn
  },
  inheritAttrs: !1,
  props: {
    currentLang: String,
    isBind: Boolean,
    langData: {
      type: [Array, Object],
      default: () => []
    },
    modelValue: {
      type: String,
      default: ""
    },
    data: [Object, String],
    locales: Array
  },
  setup(t, { emit: e }) {
    const r = Ce(t.modelValue), a = Ce(!1), n = Ce(null), s = yt({}), o = Ce([]);
    Sr(() => {
      var v;
      if (r.value = t.modelValue, t.modelValue && t.langData[t.modelValue]) {
        const y = t.langData[t.modelValue][t.currentLang] || "", b = [], _ = ((v = t == null ? void 0 : t.data) == null ? void 0 : v.params) || {};
        y.replace(/\{(.+?)\}/g, (E, P) => {
          P && b.push({ name: P, value: _[P] || "" });
        }), o.value = b;
      }
    });
    const i = (v) => {
      n.value.state.cachedOptions.forEach((b) => {
        b.state.visible = v ? b.label.indexOf(v) > -1 : !0;
      });
    }, l = (v) => {
      const y = t.langData[v] || {};
      e("bind", { ...y, key: v });
    }, { PLUGIN_NAME: c, activePlugin: u } = Hr();
    return {
      selectRef: n,
      showEditItem: a,
      filterMethod: i,
      selectI18n: l,
      selectValue: r,
      activeI18n: () => u(c.I18n),
      addBindI18n: () => {
        Jo().ensureI18n(s, !0), e("bind", { ...s }), a.value = !1;
      },
      unbindI18n: () => {
        const v = t.langData[t.modelValue];
        e("bind", v[t.currentLang]), a.value = !1;
      },
      paramsForm: o,
      paramsChange: () => {
        const v = {};
        o.value.forEach(({ name: y, value: b }) => {
          v[y] = b;
        }), e("bind", { type: dc.I18N, key: r.value, params: v });
      },
      editForm: s,
      openCreateForm: () => {
        Object.keys(s).forEach((v) => delete s[v]), s.key = "lowcode." + il.guid(), s.type = dc.I18N, a.value = !0;
      }
    };
  }
}, pl = (t) => (Vr("data-v-9e5effbd"), t = t(), zr(), t), ty = {
  ref: "languageContent",
  class: "languageContent"
}, ry = {
  key: 0,
  class: "params-form"
}, ny = /* @__PURE__ */ pl(() => /* @__PURE__ */ R("div", { class: "label" }, "国际化参数配置", -1)), ay = { class: "bottom-buttons" }, sy = /* @__PURE__ */ pl(() => /* @__PURE__ */ R("span", null, "创建新的多语言文案", -1)), oy = { class: "addNewLanguage" }, iy = { class: "tiny-input" }, ly = /* @__PURE__ */ pl(() => /* @__PURE__ */ R("label", null, "唯一键", -1)), cy = ["onUpdate:modelValue"], uy = { class: "bottom-buttons" };
function dy(t, e, r, a, n, s) {
  const o = F("tiny-option"), i = F("tiny-select"), l = F("tiny-input"), c = F("tiny-button");
  return C(), $("div", ty, [
    _r(R("div", null, [
      O(i, {
        ref: "selectRef",
        modelValue: a.selectValue,
        "onUpdate:modelValue": e[0] || (e[0] = (u) => a.selectValue = u),
        placeholder: "请选择多语言文案",
        filterable: "",
        "is-drop-inherit-width": "",
        "filter-method": a.filterMethod,
        onChange: a.selectI18n
      }, {
        default: M(() => [
          (C(!0), $(Xe, null, Pt(r.langData, (u) => (C(), ue(o, {
            key: u.key,
            label: `${u[r.currentLang]} (${u.key})`,
            value: u.key
          }, null, 8, ["label", "value"]))), 128))
        ]),
        _: 1
      }, 8, ["modelValue", "filter-method", "onChange"]),
      a.paramsForm.length ? (C(), $("div", ry, [
        ny,
        (C(!0), $(Xe, null, Pt(a.paramsForm, (u) => (C(), $("div", {
          key: u.name,
          class: "params-item"
        }, [
          R("label", null, ce(u.name), 1),
          O(l, {
            modelValue: u.value,
            "onUpdate:modelValue": [(d) => u.value = d, a.paramsChange]
          }, null, 8, ["modelValue", "onUpdate:modelValue"])
        ]))), 128))
      ])) : ee("", !0),
      re(t.$slots, "suffix", {}, () => [
        R("div", ay, [
          r.isBind ? (C(), ue(c, {
            key: 0,
            onClick: a.unbindI18n
          }, {
            default: M(() => [
              Se("解除关联")
            ]),
            _: 1
          }, 8, ["onClick"])) : ee("", !0),
          O(c, {
            type: "primary",
            onClick: a.openCreateForm
          }, {
            default: M(() => [
              sy
            ]),
            _: 1
          }, 8, ["onClick"])
        ])
      ], !0)
    ], 512), [
      [nn, !a.showEditItem]
    ]),
    _r(R("div", oy, [
      R("div", null, [
        R("div", iy, [
          ly,
          _r(R("input", {
            "onUpdate:modelValue": e[1] || (e[1] = (u) => a.editForm.key = u),
            class: "tiny-input__inner"
          }, null, 512), [
            [fc, a.editForm.key]
          ])
        ]),
        (C(!0), $(Xe, null, Pt(r.locales, (u) => (C(), $("div", {
          key: u.lang,
          class: "tiny-input"
        }, [
          R("label", null, ce(u.label), 1),
          _r(R("input", {
            "onUpdate:modelValue": (d) => a.editForm[u.lang] = d,
            class: "tiny-input__inner"
          }, null, 8, cy), [
            [fc, a.editForm[u.lang]]
          ])
        ]))), 128))
      ]),
      R("div", uy, [
        O(c, { onClick: a.activeI18n }, {
          default: M(() => [
            Se("国际化管理")
          ]),
          _: 1
        }, 8, ["onClick"]),
        O(c, {
          type: "primary",
          onClick: a.addBindI18n
        }, {
          default: M(() => [
            Se("添加并关联")
          ]),
          _: 1
        }, 8, ["onClick"])
      ])
    ], 512), [
      [nn, a.showEditItem]
    ])
  ], 512);
}
const fy = /* @__PURE__ */ me(ey, [["render", dy], ["__scopeId", "data-v-9e5effbd"]]), hy = {
  components: {
    TinyCheckbox: Ka,
    TinyButton: dr,
    TinyDialogBox: Ms,
    TinyForm: $s,
    TinyInput: cn,
    TinyFormItem: Ns,
    TinyPopover: ur,
    VueMonaco: Vs
  },
  props: {
    block: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:visible", "changeSchema"],
  setup(t, { emit: e }) {
    const { COMPONENT_NAME: r } = Bs, a = yt({
      deployInfo: "",
      version: "",
      needToSave: !0
    }), n = yt({
      compareVisible: !1,
      schemaCompare: !1,
      code: "",
      originalCode: "",
      newCode: ""
    }), s = Ce(null), o = {
      deployInfo: [{ required: !0, message: "必填", trigger: "blur" }],
      version: [
        { required: !0, message: "必填", trigger: "blur" },
        { type: "version", message: "请输入正确的X.Y.Z版本格式", trigger: "blur" }
      ]
    }, i = Ce(null), l = {
      language: "javascript",
      lineNumbers: !0,
      minimap: {
        enabled: !1
      }
    }, c = (b) => {
      const _ = b.histories || [];
      let E = "1.0.0", P = 0;
      return _.forEach((A) => {
        const k = new Date(A.created_at).getTime();
        k > P && (P = k, E = A.version);
      }), E.replace(/\d+$/, (A) => Number(A) + 1);
    };
    Vt(
      () => t.visible,
      (b) => {
        b && (a.version = c(t.block));
      }
    );
    const u = (b) => e("update:visible", b), { setSaved: d } = yr(), h = () => {
      var _;
      const b = js().getCurrentBlock();
      return ((_ = t.block) == null ? void 0 : _.id) === (b == null ? void 0 : b.id);
    }, f = async () => {
      s.value.validate((b) => {
        const { publishBlock: _ } = Tn(hc.BlockManage);
        if (b) {
          const E = {
            block: t.block,
            is_compile: !0,
            deploy_info: a.deployInfo,
            version: a.version,
            needToSave: a.needToSave
          };
          _(E), u(!1), a.needToSave && h() && d(!0), a.deployInfo = "", a.version = "", a.needToSave = !0;
        }
      });
    }, m = async (b) => {
      const _ = Tn(hc.BlockManage);
      if (b) {
        const E = t.block, P = await _.getBlockById(E == null ? void 0 : E.id), A = (P == null ? void 0 : P.content) || {};
        n.originalCode = JSON.stringify(A, null, 2), n.code = JSON.stringify((E == null ? void 0 : E.content) || {}, null, 2), n.compareVisible = !0;
      }
    }, p = (b) => {
      typeof b == "string" && (n.newCode = b);
    }, v = () => {
      n.schemaCompare = !1, n.compareVisible = !1;
    };
    return {
      formState: a,
      state: n,
      deployBlockRef: s,
      formRules: o,
      editor: i,
      editorOptions: l,
      setVisible: u,
      changeCompare: m,
      changeCode: p,
      close: v,
      save: () => {
        if (!n.newCode) {
          v();
          return;
        }
        try {
          const b = JSON.parse(n.newCode);
          e("changeSchema", { ...b, componentName: r.Block }), v();
        } catch {
          zu({
            type: "error",
            message: "代码静态检查有错误，请先修改后再保存"
          });
        }
      },
      deployBlock: f
    };
  }
};
function py(t, e, r, a, n, s) {
  const o = F("tiny-input"), i = F("tiny-form-item"), l = F("tiny-checkbox"), c = F("tiny-button"), u = F("svg-icon"), d = F("tiny-popover"), h = F("tiny-form"), f = F("vue-monaco"), m = F("tiny-dialog-box");
  return C(), ue(m, {
    visible: r.visible,
    title: "发布区块",
    width: "550px",
    "append-to-body": "",
    draggable: "",
    "onUpdate:visible": a.setVisible
  }, {
    footer: M(() => [
      O(c, {
        type: "primary",
        onClick: a.deployBlock
      }, {
        default: M(() => [
          Se(" 确定 ")
        ]),
        _: 1
      }, 8, ["onClick"]),
      O(c, {
        onClick: e[3] || (e[3] = (p) => a.setVisible(!1))
      }, {
        default: M(() => [
          Se("取消")
        ]),
        _: 1
      })
    ]),
    default: M(() => [
      O(h, {
        ref: "deployBlockRef",
        "label-position": "left",
        "label-width": "84px",
        "label-align": "",
        model: a.formState,
        rules: a.formRules,
        "validate-type": "text"
      }, {
        default: M(() => [
          O(i, {
            label: "版本号",
            prop: "version"
          }, {
            default: M(() => [
              O(o, {
                modelValue: a.formState.version,
                "onUpdate:modelValue": e[0] || (e[0] = (p) => a.formState.version = p),
                placeholder: "请输入X.Y.Z格式版本号，如1.0.0"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          O(i, {
            label: "版本描述",
            prop: "deployInfo"
          }, {
            default: M(() => [
              O(o, {
                modelValue: a.formState.deployInfo,
                "onUpdate:modelValue": e[1] || (e[1] = (p) => a.formState.deployInfo = p),
                type: "textarea",
                placeholder: "请输入此次发布的修改点"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          O(i, {
            label: "保存设置",
            prop: "needToSave",
            class: "form-item-save"
          }, {
            default: M(() => [
              O(l, {
                modelValue: a.formState.needToSave,
                "onUpdate:modelValue": e[2] || (e[2] = (p) => a.formState.needToSave = p)
              }, {
                default: M(() => [
                  Se("发布成功后保存最新数据")
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          }),
          O(i, {
            label: "schema比对",
            class: "schema-compare"
          }, {
            default: M(() => [
              O(c, {
                class: "compare-button",
                type: "text",
                onClick: a.changeCompare
              }, {
                default: M(() => [
                  Se(" 查看本次发布的改动点 ")
                ]),
                _: 1
              }, 8, ["onClick"]),
              O(d, {
                placement: "top",
                trigger: "hover",
                "append-to-body": "",
                width: 162,
                content: "区块本地schema和线上新版本schema进行比对"
              }, {
                reference: M(() => [
                  O(u, { name: "plugin-icon-plugin-help" })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["model", "rules"]),
      O(m, {
        visible: a.state.compareVisible,
        "onUpdate:visible": e[4] || (e[4] = (p) => a.state.compareVisible = p),
        class: "dialog-box",
        modal: !1,
        fullscreen: !0,
        "append-to-body": !0,
        title: "Schema 线上与本地差异"
      }, {
        footer: M(() => [
          O(c, {
            type: "primary",
            onClick: a.save
          }, {
            default: M(() => [
              Se("保存")
            ]),
            _: 1
          }, 8, ["onClick"]),
          O(c, { onClick: a.close }, {
            default: M(() => [
              Se("取消")
            ]),
            _: 1
          }, 8, ["onClick"])
        ]),
        default: M(() => [
          a.state.compareVisible ? (C(), ue(f, {
            key: 0,
            ref: "editor",
            class: "monaco-editor",
            diffEditor: !0,
            options: a.editorOptions,
            value: a.state.code,
            original: a.state.originalCode,
            onChange: a.changeCode
          }, null, 8, ["options", "value", "original", "onChange"])) : ee("", !0)
        ]),
        _: 1
      }, 8, ["visible"])
    ]),
    _: 1
  }, 8, ["visible", "onUpdate:visible"]);
}
const pC = /* @__PURE__ */ me(hy, [["render", py], ["__scopeId", "data-v-43e712fa"]]), my = {}, vy = { class: "options" }, gy = { class: "top" }, _y = { class: "title" }, yy = { class: "actions" }, by = {
  id: "options",
  class: "select-options"
}, wy = { class: "bottom" };
function Ey(t, e) {
  return C(), $("div", vy, [
    R("div", gy, [
      R("div", _y, [
        re(t.$slots, "title", {}, void 0, !0)
      ]),
      R("div", yy, [
        re(t.$slots, "actions", {}, void 0, !0)
      ])
    ]),
    R("div", by, [
      re(t.$slots, "items", {}, void 0, !0)
    ]),
    R("div", wy, [
      re(t.$slots, "bottom", {}, void 0, !0)
    ])
  ]);
}
const mC = /* @__PURE__ */ me(my, [["render", Ey], ["__scopeId", "data-v-7063dd2a"]]), vC = {
  name: "Splitpanes",
  provide() {
    return {
      onPaneClick: this.onPaneClick,
      onPaneAdd: this.onPaneAdd,
      requestUpdate: this.requestUpdate,
      onPaneRemove: this.onPaneRemove
    };
  },
  props: {
    horizontal: { type: Boolean },
    pushOtherPanes: { type: Boolean, default: !0 },
    dblClickSplitter: { type: Boolean, default: !0 },
    rtl: { type: Boolean, default: !1 },
    firstSplitter: { type: Boolean }
  },
  emits: ["ready", "resize", "resized", "pane-click", "pane-maximize", "pane-add", "pane-remove", "splitter-click"],
  data: () => ({
    ready: !1,
    container: null,
    touch: {
      dragging: !1,
      activeSplitter: null,
      mouseDown: !1
    },
    panes: [],
    lowcodeSplitterTaps: {
      timeoutId: null,
      splitter: null
    }
  }),
  computed: {
    indexedPanes() {
      return this.panes.reduce((t, e) => (t[e.id] = e, t), {});
    },
    panesCount() {
      return this.panes.length;
    }
  },
  watch: {
    horizontal() {
      this.updateLowCodePaneComponents();
    },
    panes: {
      deep: !0,
      immediate: !1,
      handler() {
        this.updateLowCodePaneComponents();
      }
    },
    firstSplitter() {
      this.redoLowCodeSplitters();
    },
    dblClickSplitter(t) {
      [...this.container.querySelectorAll(".splitpanes-lowcode__splitter")].forEach((r, a) => {
        r.ondblclick = t ? (n) => this.onSplitterDblClick(n, a) : void 0;
      });
    }
  },
  mounted() {
    this.container = this.$refs.container, this.checkLowCodeSplitpanesNodes(), this.redoLowCodeSplitters(), this.resetLowCodePaneSizes(), this.$emit("ready"), this.ready = !0;
  },
  beforeUnmount() {
    this.ready = !1;
  },
  methods: {
    updateLowCodePaneComponents() {
      this.panes.forEach((t) => {
        t.update && t.update({
          [this.horizontal ? "height" : "width"]: `${this.indexedPanes[t.id].size}%`
        });
      });
    },
    bindEvents() {
      document.addEventListener("mousemove", this.onLowCodeMouseMove, { passive: !1 }), document.addEventListener("mouseup", this.onLowCodeMouseUp);
    },
    unbindEvents() {
      document.removeEventListener("mousemove", this.onLowCodeMouseMove, { passive: !1 }), document.removeEventListener("mouseup", this.onLowCodeMouseUp);
    },
    onMouseDown(t, e) {
      this.bindEvents(), this.touch.mouseDown = !0, this.touch.activeSplitter = e;
    },
    onLowCodeMouseMove(t) {
      this.touch.mouseDown && (t.preventDefault(), this.touch.dragging = !0, this.calculatePanesSize(this.getCurrentMouseDrag(t)), this.$emit(
        "resize",
        this.panes.map((e) => ({ min: e.min, max: e.max, size: e.size }))
      ));
    },
    onLowCodeMouseUp() {
      this.touch.dragging && this.$emit(
        "resized",
        this.panes.map((t) => ({ min: t.min, max: t.max, size: t.size }))
      ), this.touch.mouseDown = !1, setTimeout(() => {
        this.touch.dragging = !1, this.unbindEvents();
      }, 100);
    },
    onSplitterClick(t, e) {
      "ontouchstart" in window && (t.preventDefault(), this.dblClickSplitter && (this.lowcodeSplitterTaps.splitter === e ? (clearTimeout(this.lowcodeSplitterTaps.timeoutId), this.lowcodeSplitterTaps.timeoutId = null, this.onSplitterDblClick(t, e), this.lowcodeSplitterTaps.splitter = null) : (this.lowcodeSplitterTaps.splitter = e, this.lowcodeSplitterTaps.timeoutId = setTimeout(() => {
        this.lowcodeSplitterTaps.splitter = null;
      }, 500)))), this.touch.dragging || this.$emit("splitter-click", this.panes[e]);
    },
    onSplitterDblClick(t, e) {
      let r = 0;
      this.panes = this.panes.map((a, n) => (a.size = n === e ? a.max : a.min, n !== e && (r += a.min), a)), this.panes[e].size -= r, this.$emit("pane-maximize", this.panes[e]);
    },
    onPaneClick(t, e) {
      this.$emit("pane-click", this.indexedPanes[e]);
    },
    getCurrentMouseDrag(t) {
      const e = this.container.getBoundingClientRect(), { clientX: r, clientY: a } = "ontouchstart" in window && t.touches ? t.touches[0] : t;
      return {
        x: r - e.left,
        y: a - e.top
      };
    },
    getCurrentDragPercentage(t) {
      var r;
      t = t[this.horizontal ? "y" : "x"];
      const e = ((r = this.container) == null ? void 0 : r[this.horizontal ? "clientHeight" : "clientWidth"]) || 0;
      return this.rtl && !this.horizontal && (t = e - t), t * 100 / e;
    },
    calculatePanesSize(t) {
      const e = this.touch.activeSplitter;
      let r = {
        prevPanesSize: this.sumLowCodePrevPanesSize(e),
        nextPanesSize: this.sumLowCodeNextPanesSize(e),
        prevLowcodeReachedMinPanes: 0,
        nextLowCodeReachedMinPanes: 0
      };
      const a = 0 + (this.pushOtherPanes ? 0 : r.prevPanesSize), n = 100 - (this.pushOtherPanes ? 0 : r.nextPanesSize), s = Math.max(
        Math.min(this.getCurrentDragPercentage(t), n),
        a
      );
      let o = [e, e + 1], i = this.panes[o[0]] || null, l = this.panes[o[1]] || null;
      const c = i.max < 100 && s >= i.max + r.prevPanesSize, u = l.max < 100 && s <= 100 - (l.max + this.sumLowCodeNextPanesSize(e + 1));
      if (c || u) {
        c ? (i.size = i.max, l.size = Math.max(100 - i.max - r.prevPanesSize - r.nextPanesSize, 0)) : (i.size = Math.max(
          100 - l.max - r.prevPanesSize - this.sumLowCodeNextPanesSize(e + 1),
          0
        ), l.size = l.max);
        return;
      }
      if (this.pushOtherPanes) {
        const d = this.doPushOtherPanes(r, s);
        if (!d) return;
        ({ sums: r, panesLowCodeToResize: o } = d), i = this.panes[o[0]] || null, l = this.panes[o[1]] || null;
      }
      i !== null && (i.size = Math.min(
        Math.max(s - r.prevPanesSize - r.prevLowcodeReachedMinPanes, i.min),
        i.max
      )), l !== null && (l.size = Math.min(
        Math.max(
          100 - s - r.nextPanesSize - r.nextLowCodeReachedMinPanes,
          l.min
        ),
        l.max
      ));
    },
    doPushOtherPanes(t, e) {
      const r = this.touch.activeSplitter, a = [r, r + 1];
      return e < t.prevPanesSize + this.panes[a[0]].min && (a[0] = this.findPrevExpandedPane(r).index, t.prevLowcodeReachedMinPanes = 0, a[0] < r && this.panes.forEach((n, s) => {
        s > a[0] && s <= r && (n.size = n.min, t.prevLowcodeReachedMinPanes += n.min);
      }), t.prevPanesSize = this.sumLowCodePrevPanesSize(a[0]), a[0] === void 0) ? (t.prevLowcodeReachedMinPanes = 0, this.panes[0].size = this.panes[0].min, this.panes.forEach((n, s) => {
        s > 0 && s <= r && (n.size = n.min, t.prevLowcodeReachedMinPanes += n.min);
      }), this.panes[a[1]].size = 100 - t.prevLowcodeReachedMinPanes - this.panes[0].min - t.prevPanesSize - t.nextPanesSize, null) : e > 100 - t.nextPanesSize - this.panes[a[1]].min && (a[1] = this.findNextExpandedPane(r).index, t.nextLowCodeReachedMinPanes = 0, a[1] > r + 1 && this.panes.forEach((n, s) => {
        s > r && s < a[1] && (n.size = n.min, t.nextLowCodeReachedMinPanes += n.min);
      }), t.nextPanesSize = this.sumLowCodeNextPanesSize(a[1] - 1), a[1] === void 0) ? (t.nextLowCodeReachedMinPanes = 0, this.panes[this.panesCount - 1].size = this.panes[this.panesCount - 1].min, this.panes.forEach((n, s) => {
        s < this.panesCount - 1 && s >= r + 1 && (n.size = n.min, t.nextLowCodeReachedMinPanes += n.min);
      }), this.panes[a[0]].size = 100 - t.prevPanesSize - t.nextLowCodeReachedMinPanes - this.panes[this.panesCount - 1].min - t.nextPanesSize, null) : { sums: t, panesLowCodeToResize: a };
    },
    sumLowCodePrevPanesSize(t) {
      return this.panes.reduce((e, r, a) => e + (a < t ? r.size : 0), 0);
    },
    sumLowCodeNextPanesSize(t) {
      return this.panes.reduce((e, r, a) => e + (a > t + 1 ? r.size : 0), 0);
    },
    findPrevExpandedPane(t) {
      return [...this.panes].reverse().find((r) => r.index < t && r.size > r.min) || {};
    },
    findNextExpandedPane(t) {
      return this.panes.find((r) => r.index > t + 1 && r.size > r.min) || {};
    },
    checkLowCodeSplitpanesNodes() {
      Array.from(this.container.children).forEach((e) => {
        const r = e.classList.contains("splitpanes__pane"), a = e.classList.contains("splitpanes-lowcode__splitter");
        if (!r && !a) {
          e.parentNode.removeChild(e);
          return;
        }
      });
    },
    addSplitter(t, e, r = !1) {
      const a = t - 1, n = document.createElement("div");
      n.classList.add("splitpanes-lowcode__splitter"), r || (n.onmousedown = (s) => this.onMouseDown(s, a), typeof window < "u" && "ontouchstart" in window && (n.ontouchstart = (s) => this.onMouseDown(s, a)), n.onclick = (s) => this.onSplitterClick(s, a + 1)), this.dblClickSplitter && (n.ondblclick = (s) => this.onSplitterDblClick(s, a + 1)), e.parentNode.insertBefore(n, e);
    },
    removeSplitter(t) {
      t.onmousedown = void 0, t.onclick = void 0, t.ondblclick = void 0, t.parentNode.removeChild(t);
    },
    redoLowCodeSplitters() {
      const t = Array.from(this.container.children);
      t.forEach((r) => {
        r.className.includes("splitpanes-lowcode__splitter") && this.removeSplitter(r);
      });
      let e = 0;
      t.forEach((r) => {
        r.className.includes("splitpanes__pane") && (!e && this.firstSplitter ? this.addSplitter(e, r, !0) : e && this.addSplitter(e, r), e++);
      });
    },
    requestUpdate({ target: t, ...e }) {
      const r = this.indexedPanes[t._.uid];
      Object.entries(e).forEach(([a, n]) => {
        r[a] = n;
      });
    },
    onPaneAdd(t) {
      let e = -1;
      Array.from(t.$el.parentNode.children).some((n) => (n.className.includes("splitpanes__pane") && e++, n === t.$el));
      const r = parseFloat(t.minSize), a = parseFloat(t.maxSize);
      this.panes.splice(e, 0, {
        index: e,
        id: t._.uid,
        max: isNaN(a) ? 100 : a,
        min: isNaN(r) ? 0 : r,
        givenSize: t.size,
        size: t.size === null ? null : parseFloat(t.size),
        update: t.update
      }), this.panes.forEach((n, s) => {
        n.index = s;
      }), this.ready && this.$nextTick(() => {
        this.redoLowCodeSplitters(), this.resetLowCodePaneSizes({ addedPane: this.panes[e] }), this.$emit("pane-add", {
          index: e,
          panes: this.panes.map((n) => ({ min: n.min, max: n.max, size: n.size }))
        });
      });
    },
    onPaneRemove(t) {
      const e = this.panes.findIndex((a) => a.id === t._.uid), r = this.panes.splice(e, 1)[0];
      this.panes.forEach((a, n) => {
        a.index = n;
      }), this.$nextTick(() => {
        this.redoLowCodeSplitters(), this.resetLowCodePaneSizes({ removedPane: { ...r, index: e } }), this.$emit("pane-remove", {
          removed: r,
          panes: this.panes.map((a) => ({ min: a.min, max: a.max, size: a.size }))
        });
      });
    },
    resetLowCodePaneSizes(t = {}) {
      !t.addedPane && !t.removedPane ? this.initialPanesSizing() : this.panes.some((e) => e.givenSize !== null || e.min || e.max < 100) ? this.equalizeAfterAddOrRemove(t) : this.equalize(), this.ready && this.$emit(
        "resized",
        this.panes.map((e) => ({ min: e.min, max: e.max, size: e.size }))
      );
    },
    equalize() {
      const t = 100 / this.panesCount;
      let e = 0;
      const r = [], a = [];
      this.panes.forEach((n) => {
        n.size = Math.max(Math.min(t, n.max), n.min), e -= n.size, n.size >= n.max && r.push(n.id), n.size <= n.min && a.push(n.id);
      }), e > 0.1 && this.readjustSizes(e, r, a);
    },
    initialPanesSizing() {
      let t = 100;
      const e = [], r = [];
      let a = 0;
      this.panes.forEach((s) => {
        t -= s.size, s.size !== null && a++, s.size >= s.max && e.push(s.id), s.size <= s.min && r.push(s.id);
      });
      let n = 100;
      t > 0.1 && (this.panes.forEach((s) => {
        s.size === null && (s.size = Math.max(Math.min(t / (this.panesCount - a), s.max), s.min)), n -= s.size;
      }), n > 0.1 && this.readjustSizes(t, e, r));
    },
    equalizeAfterAddOrRemove({ addedPane: t } = {}) {
      let e = 100 / this.panesCount, r = 0;
      const a = [], n = [];
      t && t.givenSize !== null && (e = (100 - t.givenSize) / (this.panesCount - 1)), this.panes.forEach((s) => {
        r -= s.size, s.size >= s.max && a.push(s.id), s.size <= s.min && n.push(s.id);
      }), !(Math.abs(r) < 0.1) && (this.panes.forEach((s) => {
        t && t.givenSize !== null && t.id === s.id || (s.size = Math.max(Math.min(e, s.max), s.min)), r -= s.size, s.size >= s.max && a.push(s.id), s.size <= s.min && n.push(s.id);
      }), r > 0.1 && this.readjustSizes(r, a, n));
    },
    readjustSizes(t, e, r) {
      let a;
      t > 0 ? a = t / (this.panesCount - e.length) : a = t / (this.panesCount - r.length), this.panes.forEach((n) => {
        if (t > 0 && !e.includes(n.id)) {
          const s = Math.max(Math.min(n.size + a, n.max), n.min), o = s - n.size;
          t -= o, n.size = s;
        } else if (!r.includes(n.id)) {
          const s = Math.max(Math.min(n.size + a, n.max), n.min), o = s - n.size;
          t -= o, n.size = s;
        }
        n.update({
          [this.horizontal ? "height" : "width"]: `${this.indexedPanes[n.id].size}%`
        });
      }), Math.abs(t) > 0.1 && this.$nextTick(() => {
        this.ready && console.warn("Splitpanes: Could not resize panes correctly due to their constraints.");
      });
    }
  },
  render() {
    return Ga(
      "div",
      {
        class: [
          `splitpanes--${this.horizontal ? "horizontal" : "vertical"}`,
          "splitpanes",
          {
            "splitpanes--dragging": this.touch.dragging
          }
        ],
        ref: "container"
      },
      this.$slots.default()
    );
  }
}, Sy = {
  name: "Pane",
  inject: ["requestUpdate", "onPaneAdd", "onPaneRemove", "onPaneClick"],
  props: {
    size: { type: [Number, String], default: null },
    minSize: { type: [Number, String], default: 0 },
    maxSize: { type: [Number, String], default: 100 }
  },
  data: () => ({
    style: {}
  }),
  computed: {
    sizeNumber() {
      return this.size || this.size === 0 ? parseFloat(this.size) : null;
    },
    minSizeNumber() {
      return parseFloat(this.minSize);
    },
    maxSizeNumber() {
      return parseFloat(this.maxSize);
    }
  },
  watch: {
    sizeNumber(t) {
      this.requestUpdate({ target: this, size: t });
    },
    minSizeNumber(t) {
      this.requestUpdate({ target: this, min: t });
    },
    maxSizeNumber(t) {
      this.requestUpdate({ target: this, max: t });
    }
  },
  mounted() {
    this.onPaneAdd(this);
  },
  beforeUnmount() {
    this.onPaneRemove(this);
  },
  methods: {
    // Called from the splitpanes component.
    update(t) {
      this.style = t;
    }
  }
};
function Py(t, e, r, a, n, s) {
  return C(), $("div", {
    class: "splitpanes__pane",
    style: Fn(t.style),
    onClick: e[0] || (e[0] = (o) => s.onPaneClick(o, t._.uid))
  }, [
    re(t.$slots, "default")
  ], 4);
}
const gC = /* @__PURE__ */ me(Sy, [["render", Py]]), xy = {
  name: "I18nInput",
  components: {
    TinyInput: cn,
    BindI18n: fy,
    TinyPopover: ur,
    IconClose: qh()
  },
  inheritAttrs: !1,
  props: {
    modelValue: {
      type: [String, Object],
      default: ""
    }
  },
  setup(t, { emit: e }) {
    var p;
    const { currentLanguage: r, getLangs: a, i18nResource: n } = Jo(), s = ie(() => a()), o = ie(() => {
      var v;
      return ((v = t.modelValue) == null ? void 0 : v.type) === "i18n";
    }), i = Ce(""), l = Ce(((p = t.modelValue) == null ? void 0 : p.key) || ""), c = Ce(null), u = Ce(null);
    return Sr(() => {
      var v;
      l.value = ((v = t.modelValue) == null ? void 0 : v.key) || "", i.value = Jo().translate(t.modelValue);
    }), {
      isBind: o,
      inputValue: i,
      inputChange: (v) => {
        e("update:modelValue", v.target.value);
      },
      langs: s,
      i18nValue: l,
      currentLanguage: r,
      i18nResource: n,
      setI18n: (v) => {
        e("update:modelValue", v);
      },
      addI1i8nRef: c,
      onHide: () => {
        c.value && (c.value.showEditItem = !1);
      },
      closePopover: () => {
        u.value.state.showPopper = !1;
      },
      popoverRef: u
    };
  }
}, Cy = (t) => (Vr("data-v-4fd7d943"), t = t(), zr(), t), ky = { class: "text-input" }, Iy = { class: "popover-content" }, Ry = /* @__PURE__ */ Cy(() => /* @__PURE__ */ R("h3", { class: "title" }, "绑定国际化", -1));
function Ty(t, e, r, a, n, s) {
  const o = F("icon-close"), i = F("bind-i18n"), l = F("svg-icon"), c = F("tiny-popover"), u = F("tiny-input");
  return C(), $("div", ky, [
    O(u, Rn({
      modelValue: a.inputValue,
      placeholder: "请输入内容"
    }, t.$attrs, { onInput: a.inputChange }), {
      suffix: M(() => [
        O(c, {
          ref: "popoverRef",
          width: "340",
          trigger: "click",
          "visible-arrow": !1,
          "popper-class": "i18n-input-popover",
          onHide: a.onHide
        }, {
          reference: M(() => [
            O(l, {
              name: "internationalization",
              class: Ye(["icon-language", { isBind: a.isBind }])
            }, null, 8, ["class"])
          ]),
          default: M(() => [
            R("div", Iy, [
              Ry,
              O(o, {
                class: "icon-close",
                onClick: a.closePopover
              }, null, 8, ["onClick"]),
              O(i, {
                ref: "addI1i8nRef",
                modelValue: a.i18nValue,
                "onUpdate:modelValue": e[0] || (e[0] = (d) => a.i18nValue = d),
                "lang-data": a.langs,
                "is-bind": a.isBind,
                currentLang: a.currentLanguage,
                data: r.modelValue,
                locales: a.i18nResource.locales,
                onBind: a.setI18n
              }, null, 8, ["modelValue", "lang-data", "is-bind", "currentLang", "data", "locales", "onBind"])
            ])
          ]),
          _: 1
        }, 8, ["onHide"])
      ]),
      _: 1
    }, 16, ["modelValue", "onInput"])
  ]);
}
const _C = /* @__PURE__ */ me(xy, [["render", Ty], ["__scopeId", "data-v-4fd7d943"]]), { deepClone: Oc } = il, Ay = {
  props: {
    data: Object
  },
  emits: ["click"],
  setup(t, { emit: e }) {
    const r = Tn("engine.canvas").canvasApi;
    return {
      dragstart: (o) => {
        var i;
        if (t.data && ((i = r.value) != null && i.dragStart)) {
          const l = Oc(t.data);
          r.value.dragStart(l);
          const c = o.target.querySelector(".component-item-component");
          o.dataTransfer.effectAllowed = "move", o.dataTransfer.setDragImage(c, 10, 10);
        }
      },
      dragend: (o) => {
        var i, l, c;
        ((i = o.dataTransfer) == null ? void 0 : i.dropEffect) === "none" && ((c = (l = r.value) == null ? void 0 : l.dragEnd) == null || c.call(l));
      },
      handleClick: () => {
        if (t.data) {
          const o = Oc(t.data);
          e("click", o);
        }
      }
    };
  }
};
function Oy(t, e, r, a, n, s) {
  return C(), $("div", {
    draggable: "true",
    class: "drag-item",
    onDragstart: e[0] || (e[0] = (...o) => a.dragstart && a.dragstart(...o)),
    onDragend: e[1] || (e[1] = (...o) => a.dragend && a.dragend(...o)),
    onClick: e[2] || (e[2] = (...o) => a.handleClick && a.handleClick(...o))
  }, [
    re(t.$slots, "default")
  ], 32);
}
const yC = /* @__PURE__ */ me(Ay, [["render", Oy]]), Dy = {
  components: {
    TinyPopover: ur
  },
  props: {
    icon: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    options: {
      type: Object,
      default: () => ({})
    }
  }
}, Ly = { class: "icon" }, Ny = {
  key: 0,
  class: "dots"
};
function $y(t, e, r, a, n, s) {
  const o = F("svg-icon"), i = F("tiny-popover");
  return C(), ue(i, {
    trigger: "hover",
    "open-delay": 1e3,
    "popper-class": "toolbar-right-popover",
    "append-to-body": "",
    content: r.content
  }, {
    reference: M(() => {
      var l;
      return [
        R("span", Ly, [
          R("span", Rn({ class: "icon-hides" }, t.$attrs), [
            O(o, { name: r.icon }, null, 8, ["name"]),
            (l = r.options) != null && l.showDots ? (C(), $("span", Ny)) : ee("", !0)
          ], 16)
        ])
      ];
    }),
    _: 1
  }, 8, ["content"]);
}
const Dc = /* @__PURE__ */ me(Dy, [["render", $y], ["__scopeId", "data-v-f4eb2aab"]]), My = {
  components: {
    TinyButton: dr
  },
  props: {
    icon: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    options: {
      type: Object,
      default: () => ({})
    }
  }
}, Fy = { class: "svg-wrap" }, jy = {
  key: 0,
  class: "dot"
}, By = { class: "save-title" };
function Uy(t, e, r, a, n, s) {
  var l;
  const o = F("svg-icon"), i = F("tiny-button");
  return C(), $("div", Fy, [
    (l = r.options) != null && l.showDots ? (C(), $("span", jy)) : ee("", !0),
    O(i, { class: "toolbar-button" }, {
      default: M(() => [
        r.icon ? (C(), ue(o, {
          key: 0,
          name: r.icon
        }, null, 8, ["name"])) : ee("", !0),
        R("span", By, ce(r.content), 1),
        re(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    })
  ]);
}
const Lc = /* @__PURE__ */ me(My, [["render", Uy], ["__scopeId", "data-v-beab2611"]]), Vy = {
  components: {
    ToolbarBaseIcon: Dc,
    ToolbarBaseButton: Lc
  },
  props: {
    icon: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["click-api"],
  setup(t, { emit: e }) {
    return {
      state: yt({
        icon: ie(() => t.icon),
        content: ie(() => t.content),
        options: ie(() => t.options)
      }),
      click: () => {
        e("click-api");
      },
      getRender: () => t.options.renderType === "button" ? Lc : t.options.renderType === "icon" ? Dc : !1
    };
  }
}, zy = { key: 0 };
function qy(t, e, r, a, n, s) {
  var o;
  return C(), $("span", {
    class: "toolbar-item-wrap",
    onClick: e[0] || (e[0] = (...i) => a.click && a.click(...i))
  }, [
    (C(), ue(ar(a.getRender()), Eh(Sh(a.state)), {
      default: M(() => [
        re(t.$slots, "button", {}, void 0, !0)
      ]),
      _: 3
    }, 16)),
    re(t.$slots, "default", {}, void 0, !0),
    (o = a.state.options) != null && o.collapsed && r.content ? (C(), $("span", zy, ce(a.state.content), 1)) : ee("", !0)
  ]);
}
const bC = /* @__PURE__ */ me(Vy, [["render", qy], ["__scopeId", "data-v-20ae01bf"]]), Hy = ({
  title: t,
  status: e,
  message: r,
  exec: a,
  cancel: n,
  showFooter: s = !0
}) => {
  al.confirm({
    title: t,
    status: e,
    showFooter: s,
    message: () => O("div", {
      class: "modal-content"
    }, [O("div", {
      class: "wrap"
    }, [typeof r == "string" ? r : O(r, null, null)])])
  }).then((o) => {
    o === "confirm" && typeof a == "function" ? a() : typeof n == "function" && n();
  });
}, fd = ({
  title: t,
  status: e,
  message: r,
  exec: a,
  width: n = "400"
}) => {
  al.alert({
    title: t,
    status: e,
    "confirm-btn-props": {
      text: "确定"
    },
    width: n,
    message() {
      return O("div", {
        div: !0,
        class: "modal-content"
      }, [O("div", {
        class: "wrap"
      }, [typeof r == "string" ? r : O(r, null, null)])]);
    }
  }).then(() => {
    typeof a == "function" && a();
  });
}, hd = (t) => {
  const e = {
    ...t,
    modelValue: !0
  };
  let r = Ga(al, e);
  const a = document.createElement("div"), n = () => {
    var s;
    (s = r.el) == null || s.remove(), r = null;
  };
  return Ph(r, a), {
    TopBox: r,
    close: n
  };
};
window.topbox = hd;
window.message = fd;
const wC = {
  confirm: Hy,
  message: fd,
  topbox: hd
}, Zy = {
  info: 5e3,
  success: 5e3,
  warning: 1e4,
  error: 1e4
}, EC = (t) => {
  const {
    customClass: e,
    title: r,
    type: a = "info",
    position: n = "top-right",
    ...s
  } = t;
  Lh({
    duration: Zy[a],
    ...s,
    position: n,
    title: r,
    type: a,
    customClass: `${e}`,
    verticalOffset: 46
  });
}, SC = {
  install: (t) => {
    Object.entries({
      ConfigGroup: Ju,
      ConfigItem: ll
    }).forEach(([r, a]) => {
      t.component(r, a);
    });
  }
}, Wy = {
  pluginConfig: {
    formatCode: {
      // 默认格式化配置
      ...np
    }
  }
}, Jy = async (t, e = {}) => tp({ ...Wy, ...e }).generate(t), Qy = (...t) => rp(...t), pd = async (t, e, r = /* @__PURE__ */ new Set()) => {
  const a = [], n = Hu(t), s = n.filter((l) => r.has(l) ? !1 : (r.add(l), !0)).map((l) => e(l)), o = await Promise.allSettled(s), i = [];
  return o.forEach((l) => {
    var f, m, p;
    const c = (f = l.value) == null ? void 0 : f[0];
    if (l.status !== "fulfilled" || !c)
      return;
    const u = c == null ? void 0 : c.current_history, d = (p = (m = c == null ? void 0 : c.histories) == null ? void 0 : m.find) == null ? void 0 : p.call(m, (v) => (v == null ? void 0 : v.id) === u);
    let h = null;
    u && (d != null && d.content) ? h = d.content : h = c == null ? void 0 : c.content, h && (h.version = u || "", h.subBlockDeps = n, a.push(h), i.push(pd(h, e, r)));
  }), (await Promise.allSettled(i)).forEach((l) => {
    l.status === "fulfilled" && l.value && a.push(...l.value);
  }), a;
}, PC = {
  id: "engine.service.generateCode",
  type: "MetaService",
  options: {},
  apis: {
    parseRequiredBlocks: Hu,
    getAllNestedBlocksSchema: pd,
    generatePageCode: Qy,
    generateAppCode: Jy
  }
}, Gy = () => {
  const t = new URLSearchParams(location.search), e = t.get("id"), r = t.get("blockid"), a = t.get("pageid"), n = t.get("previewid"), s = t.get("type"), o = t.get("version");
  return {
    type: s || "app",
    id: e,
    pageId: a,
    previewId: n,
    blockId: r,
    version: o
  };
}, Ky = {
  userInfo: null,
  // 当前应用
  appInfo: {
    id: "",
    name: "",
    app_desc: "",
    app_website: "",
    obs_url: null,
    published_at: "",
    created_at: "",
    updated_at: "",
    platform: "",
    state: null,
    published: !1,
    tenant: null,
    editor_url: ""
  },
  // 应用列表
  appList: []
}, Yy = () => Tn(jn.Http).get("/platform-center/api/user/me").catch((t) => {
  Fs().message({ message: t.message, status: "error" });
}), Xy = (t) => Tn(jn.Http).get(`/app-center/api/apps/detail/${t}`), e0 = (t) => Tn(jn.Http).get(`/app-center/api/apps/list/${t}`), { subscribe: Nc, publish: za } = sl(), md = (t) => za({ topic: "locationHistoryChanged", data: t }), t0 = (t) => {
  const e = ["pageId", "blockId", "previewId"].reduce((o, i) => (o[i] = i.toLowerCase(), o), {}), r = Object.keys(t), a = new URL(window.location.href), n = {};
  Object.entries(e).forEach(([o, i]) => {
    r.includes(o) && t[o] !== a.searchParams.get(i) && (n[o] = t[o]);
  });
  const s = Object.keys(n);
  return s.includes("pageId") && s.includes("blockId") && delete n.blockId, n;
}, qs = (t, e = !1) => {
  const r = t0(t), a = new URL(window.location.href), { pageId: n, blockId: s, previewId: o } = r, i = Object.keys(r);
  i.length !== 0 && (i.includes("pageId") ? (a.searchParams.delete("blockid"), a.searchParams.set("pageid", n)) : i.includes("blockId") && (a.searchParams.delete("pageid"), a.searchParams.set("blockid", s)), i.includes("previewId") && (o ? a.searchParams.set("previewid", o) : a.searchParams.delete("previewid")), e ? window.history.replaceState({}, "", a) : window.history.pushState({}, "", a), md(r));
}, r0 = (t) => {
  qs({ pageId: t });
}, n0 = (t) => {
  qs({ blockId: t });
}, a0 = (t, e = !1) => {
  qs({ previewId: t }, e);
}, xC = ol({
  id: jn.GlobalService,
  type: "MetaService",
  options: {
    enableTitleUpdate: !0
  },
  initialState: Ky,
  init: ({ state: t, options: e }) => {
    Vt(
      () => t.appInfo,
      (r) => {
        za({ topic: "app_info_changed", data: r });
      }
    ), Vt(
      () => t.appList,
      (r) => {
        za({ topic: "app_list_changed", data: r });
      }
    ), Nc({
      topic: "app_id_changed",
      callback: (r) => {
        if (!r) {
          console.error("Invalid appId received in app_id_changed event");
          return;
        }
        Xy(r).then((a) => {
          t.appInfo = a, e.enableTitleUpdate && (document.title = `${a.name} —— TinyEngine 前端可视化设计器`);
        });
      }
    }), Nc({
      topic: "platform_id_changed",
      callback: (r) => {
        if (!r) {
          console.error("Received platform_id_changed event with no platformId");
          return;
        }
        e0(r).then((a) => {
          t.appList = a;
        });
      }
    }), Yy().then((r) => {
      r && (t.userInfo = r), za({ topic: "global_service_init_finish" });
    });
  },
  apis: () => ({
    getBaseInfo: Gy,
    postLocationHistoryChanged: md,
    updateParams: qs,
    updatePageId: r0,
    updateBlockId: n0,
    updatePreviewId: a0
  })
});
var ml = { exports: {} }, vd = function(e, r) {
  return function() {
    return e.apply(r, arguments);
  };
}, s0 = vd, vl = Object.prototype.toString, gl = /* @__PURE__ */ function(t) {
  return function(e) {
    var r = vl.call(e);
    return t[r] || (t[r] = r.slice(8, -1).toLowerCase());
  };
}(/* @__PURE__ */ Object.create(null));
function Zr(t) {
  return t = t.toLowerCase(), function(r) {
    return gl(r) === t;
  };
}
function Hs(t) {
  return Array.isArray(t);
}
function ai(t) {
  return typeof t > "u";
}
function o0(t) {
  return t !== null && !ai(t) && t.constructor !== null && !ai(t.constructor) && typeof t.constructor.isBuffer == "function" && t.constructor.isBuffer(t);
}
var gd = Zr("ArrayBuffer");
function i0(t) {
  var e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(t) : e = t && t.buffer && gd(t.buffer), e;
}
function l0(t) {
  return typeof t == "string";
}
function _d(t) {
  return typeof t == "number";
}
function yd(t) {
  return t !== null && typeof t == "object";
}
function qa(t) {
  if (gl(t) !== "object")
    return !1;
  var e = Object.getPrototypeOf(t);
  return e === null || e === Object.prototype;
}
function c0(t) {
  return t && Object.keys(t).length === 0 && Object.getPrototypeOf(t) === Object.prototype;
}
var u0 = Zr("Date"), d0 = Zr("File"), f0 = Zr("Blob"), h0 = Zr("FileList");
function _l(t) {
  return vl.call(t) === "[object Function]";
}
function p0(t) {
  return yd(t) && _l(t.pipe);
}
function m0(t) {
  var e = "[object FormData]";
  return t && (typeof FormData == "function" && t instanceof FormData || vl.call(t) === e || _l(t.toString) && t.toString() === e);
}
var v0 = Zr("URLSearchParams");
function g0(t) {
  return t.trim ? t.trim() : t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
function _0() {
  var t;
  return typeof navigator < "u" && ((t = navigator.product) === "ReactNative" || t === "NativeScript" || t === "NS") ? !1 : typeof window < "u" && typeof document < "u";
}
function yl(t, e) {
  if (!(t === null || typeof t > "u"))
    if (typeof t != "object" && (t = [t]), Hs(t))
      for (var r = 0, a = t.length; r < a; r++)
        e.call(null, t[r], r, t);
    else
      for (var n in t)
        Object.prototype.hasOwnProperty.call(t, n) && e.call(null, t[n], n, t);
}
function si() {
  var t = {};
  function e(n, s) {
    qa(t[s]) && qa(n) ? t[s] = si(t[s], n) : qa(n) ? t[s] = si({}, n) : Hs(n) ? t[s] = n.slice() : t[s] = n;
  }
  for (var r = 0, a = arguments.length; r < a; r++)
    yl(arguments[r], e);
  return t;
}
function y0(t, e, r) {
  return yl(e, function(n, s) {
    r && typeof n == "function" ? t[s] = s0(n, r) : t[s] = n;
  }), t;
}
function b0(t) {
  return t.charCodeAt(0) === 65279 && (t = t.slice(1)), t;
}
function w0(t, e, r, a) {
  t.prototype = Object.create(e.prototype, a), t.prototype.constructor = t, r && Object.assign(t.prototype, r);
}
function E0(t, e, r, a) {
  var n, s, o, i = {};
  if (e = e || {}, t == null) return e;
  do {
    for (n = Object.getOwnPropertyNames(t), s = n.length; s-- > 0; )
      o = n[s], (!a || a(o, t, e)) && !i[o] && (e[o] = t[o], i[o] = !0);
    t = r !== !1 && Object.getPrototypeOf(t);
  } while (t && (!r || r(t, e)) && t !== Object.prototype);
  return e;
}
function S0(t, e, r) {
  t = String(t), (r === void 0 || r > t.length) && (r = t.length), r -= e.length;
  var a = t.indexOf(e, r);
  return a !== -1 && a === r;
}
function P0(t) {
  if (!t) return null;
  if (Hs(t)) return t;
  var e = t.length;
  if (!_d(e)) return null;
  for (var r = new Array(e); e-- > 0; )
    r[e] = t[e];
  return r;
}
var x0 = /* @__PURE__ */ function(t) {
  return function(e) {
    return t && e instanceof t;
  };
}(typeof Uint8Array < "u" && Object.getPrototypeOf(Uint8Array));
function C0(t, e) {
  for (var r = t && t[Symbol.iterator], a = r.call(t), n; (n = a.next()) && !n.done; ) {
    var s = n.value;
    e.call(t, s[0], s[1]);
  }
}
function k0(t, e) {
  for (var r, a = []; (r = t.exec(e)) !== null; )
    a.push(r);
  return a;
}
var I0 = Zr("HTMLFormElement"), R0 = /* @__PURE__ */ function(e) {
  return function(r, a) {
    return e.call(r, a);
  };
}(Object.prototype.hasOwnProperty), pt = {
  isArray: Hs,
  isArrayBuffer: gd,
  isBuffer: o0,
  isFormData: m0,
  isArrayBufferView: i0,
  isString: l0,
  isNumber: _d,
  isObject: yd,
  isPlainObject: qa,
  isEmptyObject: c0,
  isUndefined: ai,
  isDate: u0,
  isFile: d0,
  isBlob: f0,
  isFunction: _l,
  isStream: p0,
  isURLSearchParams: v0,
  isStandardBrowserEnv: _0,
  forEach: yl,
  merge: si,
  extend: y0,
  trim: g0,
  stripBOM: b0,
  inherits: w0,
  toFlatObject: E0,
  kindOf: gl,
  kindOfTest: Zr,
  endsWith: S0,
  toArray: P0,
  isTypedArray: x0,
  isFileList: h0,
  forEachEntry: C0,
  matchAll: k0,
  isHTMLForm: I0,
  hasOwnProperty: R0
}, bd = pt;
function On(t, e, r, a, n) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = t, this.name = "AxiosError", e && (this.code = e), r && (this.config = r), a && (this.request = a), n && (this.response = n);
}
bd.inherits(On, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
var wd = On.prototype, Ed = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach(function(t) {
  Ed[t] = { value: t };
});
Object.defineProperties(On, Ed);
Object.defineProperty(wd, "isAxiosError", { value: !0 });
On.from = function(t, e, r, a, n, s) {
  var o = Object.create(wd);
  return bd.toFlatObject(t, o, function(l) {
    return l !== Error.prototype;
  }), On.call(o, t.message, e, r, a, n), o.cause = t, o.name = t.name, s && Object.assign(o, s), o;
};
var un = On, T0 = typeof self == "object" ? self.FormData : window.FormData, A0 = T0, Ve = pt, O0 = un, D0 = A0;
function oi(t) {
  return Ve.isPlainObject(t) || Ve.isArray(t);
}
function Sd(t) {
  return Ve.endsWith(t, "[]") ? t.slice(0, -2) : t;
}
function $c(t, e, r) {
  return t ? t.concat(e).map(function(n, s) {
    return n = Sd(n), !r && s ? "[" + n + "]" : n;
  }).join(r ? "." : "") : e;
}
function L0(t) {
  return Ve.isArray(t) && !t.some(oi);
}
var N0 = Ve.toFlatObject(Ve, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function $0(t) {
  return t && Ve.isFunction(t.append) && t[Symbol.toStringTag] === "FormData" && t[Symbol.iterator];
}
function M0(t, e, r) {
  if (!Ve.isObject(t))
    throw new TypeError("target must be an object");
  e = e || new (D0 || FormData)(), r = Ve.toFlatObject(r, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(p, v) {
    return !Ve.isUndefined(v[p]);
  });
  var a = r.metaTokens, n = r.visitor || u, s = r.dots, o = r.indexes, i = r.Blob || typeof Blob < "u" && Blob, l = i && $0(e);
  if (!Ve.isFunction(n))
    throw new TypeError("visitor must be a function");
  function c(m) {
    if (m === null) return "";
    if (Ve.isDate(m))
      return m.toISOString();
    if (!l && Ve.isBlob(m))
      throw new O0("Blob is not supported. Use a Buffer instead.");
    return Ve.isArrayBuffer(m) || Ve.isTypedArray(m) ? l && typeof Blob == "function" ? new Blob([m]) : Buffer.from(m) : m;
  }
  function u(m, p, v) {
    var y = m;
    if (m && !v && typeof m == "object") {
      if (Ve.endsWith(p, "{}"))
        p = a ? p : p.slice(0, -2), m = JSON.stringify(m);
      else if (Ve.isArray(m) && L0(m) || Ve.isFileList(m) || Ve.endsWith(p, "[]") && (y = Ve.toArray(m)))
        return p = Sd(p), y.forEach(function(_, E) {
          !Ve.isUndefined(_) && e.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? $c([p], E, s) : o === null ? p : p + "[]",
            c(_)
          );
        }), !1;
    }
    return oi(m) ? !0 : (e.append($c(v, p, s), c(m)), !1);
  }
  var d = [], h = Object.assign(N0, {
    defaultVisitor: u,
    convertValue: c,
    isVisitable: oi
  });
  function f(m, p) {
    if (!Ve.isUndefined(m)) {
      if (d.indexOf(m) !== -1)
        throw Error("Circular reference detected in " + p.join("."));
      d.push(m), Ve.forEach(m, function(y, b) {
        var _ = !Ve.isUndefined(y) && n.call(
          e,
          y,
          Ve.isString(b) ? b.trim() : b,
          p,
          h
        );
        _ === !0 && f(y, p ? p.concat(b) : [b]);
      }), d.pop();
    }
  }
  if (!Ve.isObject(t))
    throw new TypeError("data must be an object");
  return f(t), e;
}
var Zs = M0, F0 = Zs;
function Mc(t) {
  var e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(t).replace(/[!'\(\)~]|%20|%00/g, function(a) {
    return e[a];
  });
}
function Pd(t, e) {
  this._pairs = [], t && F0(t, this, e);
}
var xd = Pd.prototype;
xd.append = function(e, r) {
  this._pairs.push([e, r]);
};
xd.toString = function(e) {
  var r = e ? function(a) {
    return e.call(this, a, Mc);
  } : Mc;
  return this._pairs.map(function(n) {
    return r(n[0]) + "=" + r(n[1]);
  }, "").join("&");
};
var Cd = Pd, j0 = pt, B0 = Cd;
function U0(t) {
  return encodeURIComponent(t).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var kd = function(e, r, a) {
  if (!r)
    return e;
  var n = e.indexOf("#");
  n !== -1 && (e = e.slice(0, n));
  var s = a && a.encode || U0, o = j0.isURLSearchParams(r) ? r.toString() : new B0(r, a).toString(s);
  return o && (e += (e.indexOf("?") === -1 ? "?" : "&") + o), e;
}, V0 = pt;
function pa() {
  this.handlers = [];
}
pa.prototype.use = function(e, r, a) {
  return this.handlers.push({
    fulfilled: e,
    rejected: r,
    synchronous: a ? a.synchronous : !1,
    runWhen: a ? a.runWhen : null
  }), this.handlers.length - 1;
};
pa.prototype.eject = function(e) {
  this.handlers[e] && (this.handlers[e] = null);
};
pa.prototype.clear = function() {
  this.handlers && (this.handlers = []);
};
pa.prototype.forEach = function(e) {
  V0.forEach(this.handlers, function(a) {
    a !== null && e(a);
  });
};
var z0 = pa, q0 = pt, Id = function(e, r) {
  q0.forEach(e, function(n, s) {
    s !== r && s.toUpperCase() === r.toUpperCase() && (e[r] = n, delete e[s]);
  });
}, Rd = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, H0 = Cd, Z0 = typeof URLSearchParams < "u" ? URLSearchParams : H0, W0 = FormData, J0 = {
  classes: {
    URLSearchParams: Z0,
    FormData: W0,
    Blob
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, bl = J0, Q0 = pt, G0 = Zs, Fc = bl, K0 = function(e, r) {
  return G0(e, new Fc.classes.URLSearchParams(), Object.assign({
    visitor: function(a, n, s, o) {
      return Fc.isNode && Q0.isBuffer(a) ? (this.append(n, a.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    }
  }, r));
}, Ar = pt;
function Y0(t) {
  return Ar.matchAll(/\w+|\[(\w*)]/g, t).map(function(e) {
    return e[0] === "[]" ? "" : e[1] || e[0];
  });
}
function X0(t) {
  var e = {}, r = Object.keys(t), a, n = r.length, s;
  for (a = 0; a < n; a++)
    s = r[a], e[s] = t[s];
  return e;
}
function eb(t) {
  function e(a, n, s, o) {
    var i = a[o++], l = Number.isFinite(+i), c = o >= a.length;
    if (i = !i && Ar.isArray(s) ? s.length : i, c)
      return Ar.hasOwnProperty(s, i) ? s[i] = [s[i], n] : s[i] = n, !l;
    (!s[i] || !Ar.isObject(s[i])) && (s[i] = []);
    var u = e(a, n, s[i], o);
    return u && Ar.isArray(s[i]) && (s[i] = X0(s[i])), !l;
  }
  if (Ar.isFormData(t) && Ar.isFunction(t.entries)) {
    var r = {};
    return Ar.forEachEntry(t, function(a, n) {
      e(Y0(a), n, r, 0);
    }), r;
  }
  return null;
}
var Td = eb, So, jc;
function tb() {
  if (jc) return So;
  jc = 1;
  var t = un;
  return So = function(r, a, n) {
    var s = n.config.validateStatus;
    !n.status || !s || s(n.status) ? r(n) : a(new t(
      "Request failed with status code " + n.status,
      [t.ERR_BAD_REQUEST, t.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
      n.config,
      n.request,
      n
    ));
  }, So;
}
var Po, Bc;
function rb() {
  if (Bc) return Po;
  Bc = 1;
  var t = pt;
  return Po = t.isStandardBrowserEnv() ? (
    // Standard browser envs support document.cookie
    /* @__PURE__ */ function() {
      return {
        write: function(a, n, s, o, i, l) {
          var c = [];
          c.push(a + "=" + encodeURIComponent(n)), t.isNumber(s) && c.push("expires=" + new Date(s).toGMTString()), t.isString(o) && c.push("path=" + o), t.isString(i) && c.push("domain=" + i), l === !0 && c.push("secure"), document.cookie = c.join("; ");
        },
        read: function(a) {
          var n = document.cookie.match(new RegExp("(^|;\\s*)(" + a + ")=([^;]*)"));
          return n ? decodeURIComponent(n[3]) : null;
        },
        remove: function(a) {
          this.write(a, "", Date.now() - 864e5);
        }
      };
    }()
  ) : (
    // Non standard browser env (web workers, react-native) lack needed support.
    /* @__PURE__ */ function() {
      return {
        write: function() {
        },
        read: function() {
          return null;
        },
        remove: function() {
        }
      };
    }()
  ), Po;
}
var nb = function(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}, ab = function(e, r) {
  return r ? e.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : e;
}, sb = nb, ob = ab, Ad = function(e, r) {
  return e && !sb(r) ? ob(e, r) : r;
}, xo, Uc;
function ib() {
  if (Uc) return xo;
  Uc = 1;
  var t = pt, e = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  return xo = function(a) {
    var n = {}, s, o, i;
    return a && t.forEach(a.split(`
`), function(c) {
      if (i = c.indexOf(":"), s = t.trim(c.slice(0, i)).toLowerCase(), o = t.trim(c.slice(i + 1)), s) {
        if (n[s] && e.indexOf(s) >= 0)
          return;
        s === "set-cookie" ? n[s] = (n[s] ? n[s] : []).concat([o]) : n[s] = n[s] ? n[s] + ", " + o : o;
      }
    }), n;
  }, xo;
}
var Co, Vc;
function lb() {
  if (Vc) return Co;
  Vc = 1;
  var t = pt;
  return Co = t.isStandardBrowserEnv() ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function() {
      var r = /(msie|trident)/i.test(navigator.userAgent), a = document.createElement("a"), n;
      function s(o) {
        var i = o;
        return r && (a.setAttribute("href", i), i = a.href), a.setAttribute("href", i), {
          href: a.href,
          protocol: a.protocol ? a.protocol.replace(/:$/, "") : "",
          host: a.host,
          search: a.search ? a.search.replace(/^\?/, "") : "",
          hash: a.hash ? a.hash.replace(/^#/, "") : "",
          hostname: a.hostname,
          port: a.port,
          pathname: a.pathname.charAt(0) === "/" ? a.pathname : "/" + a.pathname
        };
      }
      return n = s(window.location.href), function(i) {
        var l = t.isString(i) ? s(i) : i;
        return l.protocol === n.protocol && l.host === n.host;
      };
    }()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    /* @__PURE__ */ function() {
      return function() {
        return !0;
      };
    }()
  ), Co;
}
var ko, zc;
function Ws() {
  if (zc) return ko;
  zc = 1;
  var t = un, e = pt;
  function r(a, n, s) {
    t.call(this, a ?? "canceled", t.ERR_CANCELED, n, s), this.name = "CanceledError";
  }
  return e.inherits(r, t, {
    __CANCEL__: !0
  }), ko = r, ko;
}
var Io, qc;
function cb() {
  return qc || (qc = 1, Io = function(e) {
    var r = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
    return r && r[1] || "";
  }), Io;
}
var Ro, Hc;
function Zc() {
  if (Hc) return Ro;
  Hc = 1;
  var t = pt, e = tb(), r = rb(), a = kd, n = Ad, s = ib(), o = lb(), i = Rd, l = un, c = Ws(), u = cb(), d = bl;
  return Ro = function(f) {
    return new Promise(function(p, v) {
      var y = f.data, b = f.headers, _ = f.responseType, E = f.withXSRFToken, P;
      function A() {
        f.cancelToken && f.cancelToken.unsubscribe(P), f.signal && f.signal.removeEventListener("abort", P);
      }
      t.isFormData(y) && t.isStandardBrowserEnv() && delete b["Content-Type"];
      var k = new XMLHttpRequest();
      if (f.auth) {
        var B = f.auth.username || "", L = f.auth.password ? unescape(encodeURIComponent(f.auth.password)) : "";
        b.Authorization = "Basic " + btoa(B + ":" + L);
      }
      var H = n(f.baseURL, f.url);
      k.open(f.method.toUpperCase(), a(H, f.params, f.paramsSerializer), !0), k.timeout = f.timeout;
      function J() {
        if (k) {
          var D = "getAllResponseHeaders" in k ? s(k.getAllResponseHeaders()) : null, Q = !_ || _ === "text" || _ === "json" ? k.responseText : k.response, ae = {
            data: Q,
            status: k.status,
            statusText: k.statusText,
            headers: D,
            config: f,
            request: k
          };
          e(function(le) {
            p(le), A();
          }, function(le) {
            v(le), A();
          }, ae), k = null;
        }
      }
      if ("onloadend" in k ? k.onloadend = J : k.onreadystatechange = function() {
        !k || k.readyState !== 4 || k.status === 0 && !(k.responseURL && k.responseURL.indexOf("file:") === 0) || setTimeout(J);
      }, k.onabort = function() {
        k && (v(new l("Request aborted", l.ECONNABORTED, f, k)), k = null);
      }, k.onerror = function() {
        v(new l("Network Error", l.ERR_NETWORK, f, k)), k = null;
      }, k.ontimeout = function() {
        var Q = f.timeout ? "timeout of " + f.timeout + "ms exceeded" : "timeout exceeded", ae = f.transitional || i;
        f.timeoutErrorMessage && (Q = f.timeoutErrorMessage), v(new l(
          Q,
          ae.clarifyTimeoutError ? l.ETIMEDOUT : l.ECONNABORTED,
          f,
          k
        )), k = null;
      }, t.isStandardBrowserEnv() && (E && t.isFunction(E) && (E = E(f)), E || E !== !1 && o(H))) {
        var q = f.xsrfHeaderName && f.xsrfCookieName && r.read(f.xsrfCookieName);
        q && (b[f.xsrfHeaderName] = q);
      }
      "setRequestHeader" in k && t.forEach(b, function(Q, ae) {
        typeof y > "u" && ae.toLowerCase() === "content-type" ? delete b[ae] : k.setRequestHeader(ae, Q);
      }), t.isUndefined(f.withCredentials) || (k.withCredentials = !!f.withCredentials), _ && _ !== "json" && (k.responseType = f.responseType), typeof f.onDownloadProgress == "function" && k.addEventListener("progress", f.onDownloadProgress), typeof f.onUploadProgress == "function" && k.upload && k.upload.addEventListener("progress", f.onUploadProgress), (f.cancelToken || f.signal) && (P = function(D) {
        k && (v(!D || D.type ? new c(null, f, req) : D), k.abort(), k = null);
      }, f.cancelToken && f.cancelToken.subscribe(P), f.signal && (f.signal.aborted ? P() : f.signal.addEventListener("abort", P))), !y && y !== !1 && y !== 0 && y !== "" && (y = null);
      var N = u(H);
      if (N && d.protocols.indexOf(N) === -1) {
        v(new l("Unsupported protocol " + N + ":", l.ERR_BAD_REQUEST, f));
        return;
      }
      k.send(y);
    });
  }, Ro;
}
var dt = pt, Wc = Id, Jc = un, ub = Rd, db = Zs, fb = K0, Qc = bl, hb = Td, pb = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function Gc(t, e) {
  !dt.isUndefined(t) && dt.isUndefined(t["Content-Type"]) && (t["Content-Type"] = e);
}
function mb() {
  var t;
  return (typeof XMLHttpRequest < "u" || typeof process < "u" && Object.prototype.toString.call(process) === "[object process]") && (t = Zc()), t;
}
function vb(t, e, r) {
  if (dt.isString(t))
    try {
      return (e || JSON.parse)(t), dt.trim(t);
    } catch (a) {
      if (a.name !== "SyntaxError")
        throw a;
    }
  return (r || JSON.stringify)(t);
}
var Js = {
  transitional: ub,
  adapter: mb(),
  transformRequest: [function(e, r) {
    Wc(r, "Accept"), Wc(r, "Content-Type");
    var a = r && r["Content-Type"] || "", n = a.indexOf("application/json") > -1, s = dt.isObject(e);
    s && dt.isHTMLForm(e) && (e = new FormData(e));
    var o = dt.isFormData(e);
    if (o)
      return n ? JSON.stringify(hb(e)) : e;
    if (dt.isArrayBuffer(e) || dt.isBuffer(e) || dt.isStream(e) || dt.isFile(e) || dt.isBlob(e))
      return e;
    if (dt.isArrayBufferView(e))
      return e.buffer;
    if (dt.isURLSearchParams(e))
      return Gc(r, "application/x-www-form-urlencoded;charset=utf-8"), e.toString();
    var i;
    if (s) {
      if (a.indexOf("application/x-www-form-urlencoded") !== -1)
        return fb(e, this.formSerializer).toString();
      if ((i = dt.isFileList(e)) || a.indexOf("multipart/form-data") > -1) {
        var l = this.env && this.env.FormData;
        return db(
          i ? { "files[]": e } : e,
          l && new l(),
          this.formSerializer
        );
      }
    }
    return s || n ? (Gc(r, "application/json"), vb(e)) : e;
  }],
  transformResponse: [function(e) {
    var r = this.transitional || Js.transitional, a = r && r.forcedJSONParsing, n = this.responseType === "json";
    if (e && dt.isString(e) && (a && !this.responseType || n)) {
      var s = r && r.silentJSONParsing, o = !s && n;
      try {
        return JSON.parse(e);
      } catch (i) {
        if (o)
          throw i.name === "SyntaxError" ? Jc.from(i, Jc.ERR_BAD_RESPONSE, this, null, this.response) : i;
      }
    }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: Qc.classes.FormData,
    Blob: Qc.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*"
    }
  }
};
dt.forEach(["delete", "get", "head"], function(e) {
  Js.headers[e] = {};
});
dt.forEach(["post", "put", "patch"], function(e) {
  Js.headers[e] = dt.merge(pb);
});
var wl = Js, gb = pt, _b = wl, yb = function(e, r, a, n) {
  var s = this || _b;
  return gb.forEach(n, function(i) {
    e = i.call(s, e, r, a);
  }), e;
}, To, Kc;
function Od() {
  return Kc || (Kc = 1, To = function(e) {
    return !!(e && e.__CANCEL__);
  }), To;
}
var Yc = pt, Ao = yb, bb = Od(), wb = wl, Eb = Ws(), Xc = Id;
function Oo(t) {
  if (t.cancelToken && t.cancelToken.throwIfRequested(), t.signal && t.signal.aborted)
    throw new Eb();
}
var Sb = function(e) {
  Oo(e), e.headers = e.headers || {}, e.data = Ao.call(
    e,
    e.data,
    e.headers,
    null,
    e.transformRequest
  ), Xc(e.headers, "Accept"), Xc(e.headers, "Content-Type"), e.headers = Yc.merge(
    e.headers.common || {},
    e.headers[e.method] || {},
    e.headers
  ), Yc.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function(n) {
      delete e.headers[n];
    }
  );
  var r = e.adapter || wb.adapter;
  return r(e).then(function(n) {
    return Oo(e), n.data = Ao.call(
      e,
      n.data,
      n.headers,
      n.status,
      e.transformResponse
    ), n;
  }, function(n) {
    return bb(n) || (Oo(e), n && n.response && (n.response.data = Ao.call(
      e,
      n.response.data,
      n.response.headers,
      n.response.status,
      e.transformResponse
    ))), Promise.reject(n);
  });
}, xt = pt, Dd = function(e, r) {
  r = r || {};
  var a = {};
  function n(u, d) {
    return xt.isPlainObject(u) && xt.isPlainObject(d) ? xt.merge(u, d) : xt.isEmptyObject(d) ? xt.merge({}, u) : xt.isPlainObject(d) ? xt.merge({}, d) : xt.isArray(d) ? d.slice() : d;
  }
  function s(u) {
    if (xt.isUndefined(r[u])) {
      if (!xt.isUndefined(e[u]))
        return n(void 0, e[u]);
    } else return n(e[u], r[u]);
  }
  function o(u) {
    if (!xt.isUndefined(r[u]))
      return n(void 0, r[u]);
  }
  function i(u) {
    if (xt.isUndefined(r[u])) {
      if (!xt.isUndefined(e[u]))
        return n(void 0, e[u]);
    } else return n(void 0, r[u]);
  }
  function l(u) {
    if (u in r)
      return n(e[u], r[u]);
    if (u in e)
      return n(void 0, e[u]);
  }
  var c = {
    url: o,
    method: o,
    data: o,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    withXSRFToken: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    beforeRedirect: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    responseEncoding: i,
    validateStatus: l
  };
  return xt.forEach(Object.keys(e).concat(Object.keys(r)), function(d) {
    var h = c[d] || s, f = h(d);
    xt.isUndefined(f) && h !== l || (a[d] = f);
  }), a;
}, Do, eu;
function Ld() {
  return eu || (eu = 1, Do = {
    version: "0.28.0"
  }), Do;
}
var Pb = Ld().version, Dr = un, El = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function(t, e) {
  El[t] = function(a) {
    return typeof a === t || "a" + (e < 1 ? "n " : " ") + t;
  };
});
var tu = {};
El.transitional = function(e, r, a) {
  function n(s, o) {
    return "[Axios v" + Pb + "] Transitional option '" + s + "'" + o + (a ? ". " + a : "");
  }
  return function(s, o, i) {
    if (e === !1)
      throw new Dr(
        n(o, " has been removed" + (r ? " in " + r : "")),
        Dr.ERR_DEPRECATED
      );
    return r && !tu[o] && (tu[o] = !0, console.warn(
      n(
        o,
        " has been deprecated since v" + r + " and will be removed in the near future"
      )
    )), e ? e(s, o, i) : !0;
  };
};
function xb(t, e, r) {
  if (typeof t != "object")
    throw new Dr("options must be an object", Dr.ERR_BAD_OPTION_VALUE);
  for (var a = Object.keys(t), n = a.length; n-- > 0; ) {
    var s = a[n], o = e[s];
    if (o) {
      var i = t[s], l = i === void 0 || o(i, s, t);
      if (l !== !0)
        throw new Dr("option " + s + " must be " + l, Dr.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (r !== !0)
      throw new Dr("Unknown option " + s, Dr.ERR_BAD_OPTION);
  }
}
var Cb = {
  assertOptions: xb,
  validators: El
}, Sl = pt, kb = kd, ru = z0, nu = Sb, Qs = Dd, Ib = Ad, Nd = Cb, gn = Nd.validators;
function Dn(t) {
  this.defaults = t, this.interceptors = {
    request: new ru(),
    response: new ru()
  };
}
Dn.prototype.request = function(e, r) {
  typeof e == "string" ? (r = r || {}, r.url = e) : r = e || {}, r = Qs(this.defaults, r), r.method ? r.method = r.method.toLowerCase() : this.defaults.method ? r.method = this.defaults.method.toLowerCase() : r.method = "get";
  var a = r.transitional;
  a !== void 0 && Nd.assertOptions(a, {
    silentJSONParsing: gn.transitional(gn.boolean),
    forcedJSONParsing: gn.transitional(gn.boolean),
    clarifyTimeoutError: gn.transitional(gn.boolean)
  }, !1);
  var n = r.paramsSerializer;
  Sl.isFunction(n) && (r.paramsSerializer = { serialize: n });
  var s = [], o = !0;
  this.interceptors.request.forEach(function(m) {
    typeof m.runWhen == "function" && m.runWhen(r) === !1 || (o = o && m.synchronous, s.unshift(m.fulfilled, m.rejected));
  });
  var i = [];
  this.interceptors.response.forEach(function(m) {
    i.push(m.fulfilled, m.rejected);
  });
  var l;
  if (!o) {
    var c = [nu, void 0];
    for (Array.prototype.unshift.apply(c, s), c = c.concat(i), l = Promise.resolve(r); c.length; )
      l = l.then(c.shift(), c.shift());
    return l;
  }
  for (var u = r; s.length; ) {
    var d = s.shift(), h = s.shift();
    try {
      u = d(u);
    } catch (f) {
      h(f);
      break;
    }
  }
  try {
    l = nu(u);
  } catch (f) {
    return Promise.reject(f);
  }
  for (; i.length; )
    l = l.then(i.shift(), i.shift());
  return l;
};
Dn.prototype.getUri = function(e) {
  e = Qs(this.defaults, e);
  var r = Ib(e.baseURL, e.url);
  return kb(r, e.params, e.paramsSerializer);
};
Sl.forEach(["delete", "get", "head", "options"], function(e) {
  Dn.prototype[e] = function(r, a) {
    return this.request(Qs(a || {}, {
      method: e,
      url: r,
      data: (a || {}).data
    }));
  };
});
Sl.forEach(["post", "put", "patch"], function(e) {
  function r(a) {
    return function(s, o, i) {
      return this.request(Qs(i || {}, {
        method: e,
        headers: a ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: s,
        data: o
      }));
    };
  }
  Dn.prototype[e] = r(), Dn.prototype[e + "Form"] = r(!0);
});
var Rb = Dn, Lo, au;
function Tb() {
  if (au) return Lo;
  au = 1;
  var t = Ws();
  function e(r) {
    if (typeof r != "function")
      throw new TypeError("executor must be a function.");
    var a;
    this.promise = new Promise(function(o) {
      a = o;
    });
    var n = this;
    this.promise.then(function(s) {
      if (n._listeners) {
        for (var o = n._listeners.length; o-- > 0; )
          n._listeners[o](s);
        n._listeners = null;
      }
    }), this.promise.then = function(s) {
      var o, i = new Promise(function(l) {
        n.subscribe(l), o = l;
      }).then(s);
      return i.cancel = function() {
        n.unsubscribe(o);
      }, i;
    }, r(function(o, i, l) {
      n.reason || (n.reason = new t(o, i, l), a(n.reason));
    });
  }
  return e.prototype.throwIfRequested = function() {
    if (this.reason)
      throw this.reason;
  }, e.prototype.subscribe = function(a) {
    if (this.reason) {
      a(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(a) : this._listeners = [a];
  }, e.prototype.unsubscribe = function(a) {
    if (this._listeners) {
      var n = this._listeners.indexOf(a);
      n !== -1 && this._listeners.splice(n, 1);
    }
  }, e.source = function() {
    var a, n = new e(function(o) {
      a = o;
    });
    return {
      token: n,
      cancel: a
    };
  }, Lo = e, Lo;
}
var No, su;
function Ab() {
  return su || (su = 1, No = function(e) {
    return function(a) {
      return e.apply(null, a);
    };
  }), No;
}
var $o, ou;
function Ob() {
  if (ou) return $o;
  ou = 1;
  var t = pt;
  return $o = function(r) {
    return t.isObject(r) && r.isAxiosError === !0;
  }, $o;
}
var ii = pt, Db = vd, Ha = Rb, Lb = Dd, Nb = wl, $b = Td;
function $d(t) {
  var e = new Ha(t), r = Db(Ha.prototype.request, e);
  return ii.extend(r, Ha.prototype, e), ii.extend(r, e), r.create = function(n) {
    return $d(Lb(t, n));
  }, r;
}
var It = $d(Nb);
It.Axios = Ha;
It.CanceledError = Ws();
It.CancelToken = Tb();
It.isCancel = Od();
It.VERSION = Ld().version;
It.toFormData = Zs;
It.AxiosError = un;
It.Cancel = It.CanceledError;
It.all = function(e) {
  return Promise.all(e);
};
It.spread = Ab();
It.isAxiosError = Ob();
It.formToJSON = function(t) {
  return $b(ii.isHTMLForm(t) ? new FormData(t) : t);
};
ml.exports = It;
ml.exports.default = It;
var Mb = ml.exports, Fb = Mb;
const jb = /* @__PURE__ */ Zu(Fb);
let gt = null;
const Bb = (t) => ({ data: e, type: r }) => {
  if (typeof e == "function") {
    t.interceptors[r].use(e);
    return;
  }
  Array.isArray(e) && e.forEach((a) => {
    if (a) {
      if (Array.isArray(a)) {
        t.interceptors[r].use(...a);
        return;
      }
      typeof a == "function" && t.interceptors[r].use(a);
    }
  });
}, CC = ol({
  id: jn.Http,
  type: "MetaService",
  options: {
    axiosConfig: {
      // axios 配置
      baseURL: "",
      withCredentials: !1,
      // 跨域请求时是否需要使用凭证
      headers: {}
      // 请求头
    },
    interceptors: {
      // 拦截器
      request: [],
      // 支持配置多个请求拦截器，先注册后执行
      response: []
      // 支持配置多个响应拦截器，先注册先执行
    }
  },
  init: ({ options: t = {} }) => {
    const { axiosConfig: e = {}, interceptors: r = {} } = t, { request: a = [], response: n = [] } = r;
    gt = jb.create(e);
    const s = Bb(gt);
    s({ data: a, type: "request" }), s({ data: n, type: "response" });
  },
  apis: () => ({
    getHttp: () => gt,
    get: (...t) => gt == null ? void 0 : gt.get(...t),
    post: (...t) => gt == null ? void 0 : gt.post(...t),
    request: (...t) => gt == null ? void 0 : gt.request(...t),
    put: (...t) => gt == null ? void 0 : gt.put(...t),
    delete: (...t) => gt == null ? void 0 : gt.delete(...t)
  })
});
var Le;
(function(t) {
  t.assertEqual = (n) => {
  };
  function e(n) {
  }
  t.assertIs = e;
  function r(n) {
    throw new Error();
  }
  t.assertNever = r, t.arrayToEnum = (n) => {
    const s = {};
    for (const o of n)
      s[o] = o;
    return s;
  }, t.getValidEnumValues = (n) => {
    const s = t.objectKeys(n).filter((i) => typeof n[n[i]] != "number"), o = {};
    for (const i of s)
      o[i] = n[i];
    return t.objectValues(o);
  }, t.objectValues = (n) => t.objectKeys(n).map(function(s) {
    return n[s];
  }), t.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    const s = [];
    for (const o in n)
      Object.prototype.hasOwnProperty.call(n, o) && s.push(o);
    return s;
  }, t.find = (n, s) => {
    for (const o of n)
      if (s(o))
        return o;
  }, t.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && Number.isFinite(n) && Math.floor(n) === n;
  function a(n, s = " | ") {
    return n.map((o) => typeof o == "string" ? `'${o}'` : o).join(s);
  }
  t.joinValues = a, t.jsonStringifyReplacer = (n, s) => typeof s == "bigint" ? s.toString() : s;
})(Le || (Le = {}));
var iu;
(function(t) {
  t.mergeShapes = (e, r) => ({
    ...e,
    ...r
    // second overwrites first
  });
})(iu || (iu = {}));
const Y = Le.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), Lr = (t) => {
  switch (typeof t) {
    case "undefined":
      return Y.undefined;
    case "string":
      return Y.string;
    case "number":
      return Number.isNaN(t) ? Y.nan : Y.number;
    case "boolean":
      return Y.boolean;
    case "function":
      return Y.function;
    case "bigint":
      return Y.bigint;
    case "symbol":
      return Y.symbol;
    case "object":
      return Array.isArray(t) ? Y.array : t === null ? Y.null : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function" ? Y.promise : typeof Map < "u" && t instanceof Map ? Y.map : typeof Set < "u" && t instanceof Set ? Y.set : typeof Date < "u" && t instanceof Date ? Y.date : Y.object;
    default:
      return Y.unknown;
  }
}, V = Le.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class xr extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (a) => {
      this.issues = [...this.issues, a];
    }, this.addIssues = (a = []) => {
      this.issues = [...this.issues, ...a];
    };
    const r = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : this.__proto__ = r, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const r = e || function(s) {
      return s.message;
    }, a = { _errors: [] }, n = (s) => {
      for (const o of s.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(n);
        else if (o.code === "invalid_return_type")
          n(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          n(o.argumentsError);
        else if (o.path.length === 0)
          a._errors.push(r(o));
        else {
          let i = a, l = 0;
          for (; l < o.path.length; ) {
            const c = o.path[l];
            l === o.path.length - 1 ? (i[c] = i[c] || { _errors: [] }, i[c]._errors.push(r(o))) : i[c] = i[c] || { _errors: [] }, i = i[c], l++;
          }
        }
    };
    return n(this), a;
  }
  static assert(e) {
    if (!(e instanceof xr))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, Le.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (r) => r.message) {
    const r = {}, a = [];
    for (const n of this.issues)
      if (n.path.length > 0) {
        const s = n.path[0];
        r[s] = r[s] || [], r[s].push(e(n));
      } else
        a.push(e(n));
    return { formErrors: a, fieldErrors: r };
  }
  get formErrors() {
    return this.flatten();
  }
}
xr.create = (t) => new xr(t);
const li = (t, e) => {
  let r;
  switch (t.code) {
    case V.invalid_type:
      t.received === Y.undefined ? r = "Required" : r = `Expected ${t.expected}, received ${t.received}`;
      break;
    case V.invalid_literal:
      r = `Invalid literal value, expected ${JSON.stringify(t.expected, Le.jsonStringifyReplacer)}`;
      break;
    case V.unrecognized_keys:
      r = `Unrecognized key(s) in object: ${Le.joinValues(t.keys, ", ")}`;
      break;
    case V.invalid_union:
      r = "Invalid input";
      break;
    case V.invalid_union_discriminator:
      r = `Invalid discriminator value. Expected ${Le.joinValues(t.options)}`;
      break;
    case V.invalid_enum_value:
      r = `Invalid enum value. Expected ${Le.joinValues(t.options)}, received '${t.received}'`;
      break;
    case V.invalid_arguments:
      r = "Invalid function arguments";
      break;
    case V.invalid_return_type:
      r = "Invalid function return type";
      break;
    case V.invalid_date:
      r = "Invalid date";
      break;
    case V.invalid_string:
      typeof t.validation == "object" ? "includes" in t.validation ? (r = `Invalid input: must include "${t.validation.includes}"`, typeof t.validation.position == "number" && (r = `${r} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? r = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? r = `Invalid input: must end with "${t.validation.endsWith}"` : Le.assertNever(t.validation) : t.validation !== "regex" ? r = `Invalid ${t.validation}` : r = "Invalid";
      break;
    case V.too_small:
      t.type === "array" ? r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" ? r = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "bigint" ? r = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? r = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : r = "Invalid input";
      break;
    case V.too_big:
      t.type === "array" ? r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? r = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "bigint" ? r = `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? r = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : r = "Invalid input";
      break;
    case V.custom:
      r = "Invalid input";
      break;
    case V.invalid_intersection_types:
      r = "Intersection results could not be merged";
      break;
    case V.not_multiple_of:
      r = `Number must be a multiple of ${t.multipleOf}`;
      break;
    case V.not_finite:
      r = "Number must be finite";
      break;
    default:
      r = e.defaultError, Le.assertNever(t);
  }
  return { message: r };
};
let Ub = li;
function Vb() {
  return Ub;
}
const zb = (t) => {
  const { data: e, path: r, errorMaps: a, issueData: n } = t, s = [...r, ...n.path || []], o = {
    ...n,
    path: s
  };
  if (n.message !== void 0)
    return {
      ...n,
      path: s,
      message: n.message
    };
  let i = "";
  const l = a.filter((c) => !!c).slice().reverse();
  for (const c of l)
    i = c(o, { data: e, defaultError: i }).message;
  return {
    ...n,
    path: s,
    message: i
  };
};
function G(t, e) {
  const r = Vb(), a = zb({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [
      t.common.contextualErrorMap,
      // contextual error map is first priority
      t.schemaErrorMap,
      // then schema-bound map if available
      r,
      // then global override map
      r === li ? void 0 : li
      // then global default map
    ].filter((n) => !!n)
  });
  t.common.issues.push(a);
}
class Rt {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, r) {
    const a = [];
    for (const n of r) {
      if (n.status === "aborted")
        return pe;
      n.status === "dirty" && e.dirty(), a.push(n.value);
    }
    return { status: e.value, value: a };
  }
  static async mergeObjectAsync(e, r) {
    const a = [];
    for (const n of r) {
      const s = await n.key, o = await n.value;
      a.push({
        key: s,
        value: o
      });
    }
    return Rt.mergeObjectSync(e, a);
  }
  static mergeObjectSync(e, r) {
    const a = {};
    for (const n of r) {
      const { key: s, value: o } = n;
      if (s.status === "aborted" || o.status === "aborted")
        return pe;
      s.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), s.value !== "__proto__" && (typeof o.value < "u" || n.alwaysSet) && (a[s.value] = o.value);
    }
    return { status: e.value, value: a };
  }
}
const pe = Object.freeze({
  status: "aborted"
}), Yn = (t) => ({ status: "dirty", value: t }), zt = (t) => ({ status: "valid", value: t }), lu = (t) => t.status === "aborted", cu = (t) => t.status === "dirty", Ln = (t) => t.status === "valid", ns = (t) => typeof Promise < "u" && t instanceof Promise;
var te;
(function(t) {
  t.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, t.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(te || (te = {}));
class lr {
  constructor(e, r, a, n) {
    this._cachedPath = [], this.parent = e, this.data = r, this._path = a, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const uu = (t, e) => {
  if (Ln(e))
    return { success: !0, data: e.value };
  if (!t.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const r = new xr(t.common.issues);
      return this._error = r, this._error;
    }
  };
};
function be(t) {
  if (!t)
    return {};
  const { errorMap: e, invalid_type_error: r, required_error: a, description: n } = t;
  if (e && (r || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (o, i) => {
    const { message: l } = t;
    return o.code === "invalid_enum_value" ? { message: l ?? i.defaultError } : typeof i.data > "u" ? { message: l ?? a ?? i.defaultError } : o.code !== "invalid_type" ? { message: i.defaultError } : { message: l ?? r ?? i.defaultError };
  }, description: n };
}
class ke {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Lr(e.data);
  }
  _getOrReturnCtx(e, r) {
    return r || {
      common: e.parent.common,
      data: e.data,
      parsedType: Lr(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new Rt(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Lr(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const r = this._parse(e);
    if (ns(r))
      throw new Error("Synchronous parse encountered promise.");
    return r;
  }
  _parseAsync(e) {
    const r = this._parse(e);
    return Promise.resolve(r);
  }
  parse(e, r) {
    const a = this.safeParse(e, r);
    if (a.success)
      return a.data;
    throw a.error;
  }
  safeParse(e, r) {
    const a = {
      common: {
        issues: [],
        async: (r == null ? void 0 : r.async) ?? !1,
        contextualErrorMap: r == null ? void 0 : r.errorMap
      },
      path: (r == null ? void 0 : r.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Lr(e)
    }, n = this._parseSync({ data: e, path: a.path, parent: a });
    return uu(a, n);
  }
  "~validate"(e) {
    var a, n;
    const r = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Lr(e)
    };
    if (!this["~standard"].async)
      try {
        const s = this._parseSync({ data: e, path: [], parent: r });
        return Ln(s) ? {
          value: s.value
        } : {
          issues: r.common.issues
        };
      } catch (s) {
        (n = (a = s == null ? void 0 : s.message) == null ? void 0 : a.toLowerCase()) != null && n.includes("encountered") && (this["~standard"].async = !0), r.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: r }).then((s) => Ln(s) ? {
      value: s.value
    } : {
      issues: r.common.issues
    });
  }
  async parseAsync(e, r) {
    const a = await this.safeParseAsync(e, r);
    if (a.success)
      return a.data;
    throw a.error;
  }
  async safeParseAsync(e, r) {
    const a = {
      common: {
        issues: [],
        contextualErrorMap: r == null ? void 0 : r.errorMap,
        async: !0
      },
      path: (r == null ? void 0 : r.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Lr(e)
    }, n = this._parse({ data: e, path: a.path, parent: a }), s = await (ns(n) ? n : Promise.resolve(n));
    return uu(a, s);
  }
  refine(e, r) {
    const a = (n) => typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(n) : r;
    return this._refinement((n, s) => {
      const o = e(n), i = () => s.addIssue({
        code: V.custom,
        ...a(n)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((l) => l ? !0 : (i(), !1)) : o ? !0 : (i(), !1);
    });
  }
  refinement(e, r) {
    return this._refinement((a, n) => e(a) ? !0 : (n.addIssue(typeof r == "function" ? r(a, n) : r), !1));
  }
  _refinement(e) {
    return new on({
      schema: this,
      typeName: z.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (r) => this["~validate"](r)
    };
  }
  optional() {
    return Er.create(this, this._def);
  }
  nullable() {
    return ln.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return or.create(this);
  }
  promise() {
    return cs.create(this, this._def);
  }
  or(e) {
    return ss.create([this, e], this._def);
  }
  and(e) {
    return os.create(this, e, this._def);
  }
  transform(e) {
    return new on({
      ...be(this._def),
      schema: this,
      typeName: z.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const r = typeof e == "function" ? e : () => e;
    return new us({
      ...be(this._def),
      innerType: this,
      defaultValue: r,
      typeName: z.ZodDefault
    });
  }
  brand() {
    return new Bd({
      typeName: z.ZodBranded,
      type: this,
      ...be(this._def)
    });
  }
  catch(e) {
    const r = typeof e == "function" ? e : () => e;
    return new ds({
      ...be(this._def),
      innerType: this,
      catchValue: r,
      typeName: z.ZodCatch
    });
  }
  describe(e) {
    const r = this.constructor;
    return new r({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return xl.create(this, e);
  }
  readonly() {
    return fs.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const qb = /^c[^\s-]{8,}$/i, Hb = /^[0-9a-z]+$/, Zb = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Wb = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Jb = /^[a-z0-9_-]{21}$/i, Qb = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Gb = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Kb = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Yb = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Mo;
const Xb = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ew = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, tw = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, rw = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, nw = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, aw = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Md = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", sw = new RegExp(`^${Md}$`);
function Fd(t) {
  let e = "[0-5]\\d";
  t.precision ? e = `${e}\\.\\d{${t.precision}}` : t.precision == null && (e = `${e}(\\.\\d+)?`);
  const r = t.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${r}`;
}
function ow(t) {
  return new RegExp(`^${Fd(t)}$`);
}
function iw(t) {
  let e = `${Md}T${Fd(t)}`;
  const r = [];
  return r.push(t.local ? "Z?" : "Z"), t.offset && r.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${r.join("|")})`, new RegExp(`^${e}$`);
}
function lw(t, e) {
  return !!((e === "v4" || !e) && Xb.test(t) || (e === "v6" || !e) && tw.test(t));
}
function cw(t, e) {
  if (!Qb.test(t))
    return !1;
  try {
    const [r] = t.split(".");
    if (!r)
      return !1;
    const a = r.replace(/-/g, "+").replace(/_/g, "/").padEnd(r.length + (4 - r.length % 4) % 4, "="), n = JSON.parse(atob(a));
    return !(typeof n != "object" || n === null || "typ" in n && (n == null ? void 0 : n.typ) !== "JWT" || !n.alg || e && n.alg !== e);
  } catch {
    return !1;
  }
}
function uw(t, e) {
  return !!((e === "v4" || !e) && ew.test(t) || (e === "v6" || !e) && rw.test(t));
}
class br extends ke {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== Y.string) {
      const s = this._getOrReturnCtx(e);
      return G(s, {
        code: V.invalid_type,
        expected: Y.string,
        received: s.parsedType
      }), pe;
    }
    const a = new Rt();
    let n;
    for (const s of this._def.checks)
      if (s.kind === "min")
        e.data.length < s.value && (n = this._getOrReturnCtx(e, n), G(n, {
          code: V.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), a.dirty());
      else if (s.kind === "max")
        e.data.length > s.value && (n = this._getOrReturnCtx(e, n), G(n, {
          code: V.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: s.message
        }), a.dirty());
      else if (s.kind === "length") {
        const o = e.data.length > s.value, i = e.data.length < s.value;
        (o || i) && (n = this._getOrReturnCtx(e, n), o ? G(n, {
          code: V.too_big,
          maximum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }) : i && G(n, {
          code: V.too_small,
          minimum: s.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: s.message
        }), a.dirty());
      } else if (s.kind === "email")
        Kb.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
          validation: "email",
          code: V.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "emoji")
        Mo || (Mo = new RegExp(Yb, "u")), Mo.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
          validation: "emoji",
          code: V.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "uuid")
        Wb.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
          validation: "uuid",
          code: V.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "nanoid")
        Jb.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
          validation: "nanoid",
          code: V.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "cuid")
        qb.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
          validation: "cuid",
          code: V.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "cuid2")
        Hb.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
          validation: "cuid2",
          code: V.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "ulid")
        Zb.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
          validation: "ulid",
          code: V.invalid_string,
          message: s.message
        }), a.dirty());
      else if (s.kind === "url")
        try {
          new URL(e.data);
        } catch {
          n = this._getOrReturnCtx(e, n), G(n, {
            validation: "url",
            code: V.invalid_string,
            message: s.message
          }), a.dirty();
        }
      else s.kind === "regex" ? (s.regex.lastIndex = 0, s.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
        validation: "regex",
        code: V.invalid_string,
        message: s.message
      }), a.dirty())) : s.kind === "trim" ? e.data = e.data.trim() : s.kind === "includes" ? e.data.includes(s.value, s.position) || (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.invalid_string,
        validation: { includes: s.value, position: s.position },
        message: s.message
      }), a.dirty()) : s.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : s.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : s.kind === "startsWith" ? e.data.startsWith(s.value) || (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.invalid_string,
        validation: { startsWith: s.value },
        message: s.message
      }), a.dirty()) : s.kind === "endsWith" ? e.data.endsWith(s.value) || (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.invalid_string,
        validation: { endsWith: s.value },
        message: s.message
      }), a.dirty()) : s.kind === "datetime" ? iw(s).test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.invalid_string,
        validation: "datetime",
        message: s.message
      }), a.dirty()) : s.kind === "date" ? sw.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.invalid_string,
        validation: "date",
        message: s.message
      }), a.dirty()) : s.kind === "time" ? ow(s).test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.invalid_string,
        validation: "time",
        message: s.message
      }), a.dirty()) : s.kind === "duration" ? Gb.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
        validation: "duration",
        code: V.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "ip" ? lw(e.data, s.version) || (n = this._getOrReturnCtx(e, n), G(n, {
        validation: "ip",
        code: V.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "jwt" ? cw(e.data, s.alg) || (n = this._getOrReturnCtx(e, n), G(n, {
        validation: "jwt",
        code: V.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "cidr" ? uw(e.data, s.version) || (n = this._getOrReturnCtx(e, n), G(n, {
        validation: "cidr",
        code: V.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "base64" ? nw.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
        validation: "base64",
        code: V.invalid_string,
        message: s.message
      }), a.dirty()) : s.kind === "base64url" ? aw.test(e.data) || (n = this._getOrReturnCtx(e, n), G(n, {
        validation: "base64url",
        code: V.invalid_string,
        message: s.message
      }), a.dirty()) : Le.assertNever(s);
    return { status: a.value, value: e.data };
  }
  _regex(e, r, a) {
    return this.refinement((n) => e.test(n), {
      validation: r,
      code: V.invalid_string,
      ...te.errToObj(a)
    });
  }
  _addCheck(e) {
    return new br({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...te.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...te.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...te.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...te.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...te.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...te.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...te.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...te.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...te.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...te.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...te.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...te.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...te.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ...te.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...te.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...te.errToObj(e) });
  }
  regex(e, r) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...te.errToObj(r)
    });
  }
  includes(e, r) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: r == null ? void 0 : r.position,
      ...te.errToObj(r == null ? void 0 : r.message)
    });
  }
  startsWith(e, r) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...te.errToObj(r)
    });
  }
  endsWith(e, r) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...te.errToObj(r)
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...te.errToObj(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...te.errToObj(r)
    });
  }
  length(e, r) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...te.errToObj(r)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, te.errToObj(e));
  }
  trim() {
    return new br({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new br({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new br({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
}
br.create = (t) => new br({
  checks: [],
  typeName: z.ZodString,
  coerce: (t == null ? void 0 : t.coerce) ?? !1,
  ...be(t)
});
function dw(t, e) {
  const r = (t.toString().split(".")[1] || "").length, a = (e.toString().split(".")[1] || "").length, n = r > a ? r : a, s = Number.parseInt(t.toFixed(n).replace(".", "")), o = Number.parseInt(e.toFixed(n).replace(".", ""));
  return s % o / 10 ** n;
}
class Nn extends ke {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== Y.number) {
      const s = this._getOrReturnCtx(e);
      return G(s, {
        code: V.invalid_type,
        expected: Y.number,
        received: s.parsedType
      }), pe;
    }
    let a;
    const n = new Rt();
    for (const s of this._def.checks)
      s.kind === "int" ? Le.isInteger(e.data) || (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.invalid_type,
        expected: "integer",
        received: "float",
        message: s.message
      }), n.dirty()) : s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.too_small,
        minimum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), n.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.too_big,
        maximum: s.value,
        type: "number",
        inclusive: s.inclusive,
        exact: !1,
        message: s.message
      }), n.dirty()) : s.kind === "multipleOf" ? dw(e.data, s.value) !== 0 && (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), n.dirty()) : s.kind === "finite" ? Number.isFinite(e.data) || (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.not_finite,
        message: s.message
      }), n.dirty()) : Le.assertNever(s);
    return { status: n.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, te.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, te.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, te.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, te.toString(r));
  }
  setLimit(e, r, a, n) {
    return new Nn({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: r,
          inclusive: a,
          message: te.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Nn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: te.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: te.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: te.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: te.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: te.toString(e)
    });
  }
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: te.toString(r)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: te.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: te.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: te.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && Le.isInteger(e.value));
  }
  get isFinite() {
    let e = null, r = null;
    for (const a of this._def.checks) {
      if (a.kind === "finite" || a.kind === "int" || a.kind === "multipleOf")
        return !0;
      a.kind === "min" ? (r === null || a.value > r) && (r = a.value) : a.kind === "max" && (e === null || a.value < e) && (e = a.value);
    }
    return Number.isFinite(r) && Number.isFinite(e);
  }
}
Nn.create = (t) => new Nn({
  checks: [],
  typeName: z.ZodNumber,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...be(t)
});
class ua extends ke {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== Y.bigint)
      return this._getInvalidInput(e);
    let a;
    const n = new Rt();
    for (const s of this._def.checks)
      s.kind === "min" ? (s.inclusive ? e.data < s.value : e.data <= s.value) && (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.too_small,
        type: "bigint",
        minimum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), n.dirty()) : s.kind === "max" ? (s.inclusive ? e.data > s.value : e.data >= s.value) && (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.too_big,
        type: "bigint",
        maximum: s.value,
        inclusive: s.inclusive,
        message: s.message
      }), n.dirty()) : s.kind === "multipleOf" ? e.data % s.value !== BigInt(0) && (a = this._getOrReturnCtx(e, a), G(a, {
        code: V.not_multiple_of,
        multipleOf: s.value,
        message: s.message
      }), n.dirty()) : Le.assertNever(s);
    return { status: n.value, value: e.data };
  }
  _getInvalidInput(e) {
    const r = this._getOrReturnCtx(e);
    return G(r, {
      code: V.invalid_type,
      expected: Y.bigint,
      received: r.parsedType
    }), pe;
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, te.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, te.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, te.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, te.toString(r));
  }
  setLimit(e, r, a, n) {
    return new ua({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: r,
          inclusive: a,
          message: te.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ua({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: te.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: te.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: te.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: te.toString(e)
    });
  }
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: te.toString(r)
    });
  }
  get minValue() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
}
ua.create = (t) => new ua({
  checks: [],
  typeName: z.ZodBigInt,
  coerce: (t == null ? void 0 : t.coerce) ?? !1,
  ...be(t)
});
class ci extends ke {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== Y.boolean) {
      const a = this._getOrReturnCtx(e);
      return G(a, {
        code: V.invalid_type,
        expected: Y.boolean,
        received: a.parsedType
      }), pe;
    }
    return zt(e.data);
  }
}
ci.create = (t) => new ci({
  typeName: z.ZodBoolean,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...be(t)
});
class as extends ke {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== Y.date) {
      const s = this._getOrReturnCtx(e);
      return G(s, {
        code: V.invalid_type,
        expected: Y.date,
        received: s.parsedType
      }), pe;
    }
    if (Number.isNaN(e.data.getTime())) {
      const s = this._getOrReturnCtx(e);
      return G(s, {
        code: V.invalid_date
      }), pe;
    }
    const a = new Rt();
    let n;
    for (const s of this._def.checks)
      s.kind === "min" ? e.data.getTime() < s.value && (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.too_small,
        message: s.message,
        inclusive: !0,
        exact: !1,
        minimum: s.value,
        type: "date"
      }), a.dirty()) : s.kind === "max" ? e.data.getTime() > s.value && (n = this._getOrReturnCtx(e, n), G(n, {
        code: V.too_big,
        message: s.message,
        inclusive: !0,
        exact: !1,
        maximum: s.value,
        type: "date"
      }), a.dirty()) : Le.assertNever(s);
    return {
      status: a.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new as({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: te.toString(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: te.toString(r)
    });
  }
  get minDate() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
}
as.create = (t) => new as({
  checks: [],
  coerce: (t == null ? void 0 : t.coerce) || !1,
  typeName: z.ZodDate,
  ...be(t)
});
class du extends ke {
  _parse(e) {
    if (this._getType(e) !== Y.symbol) {
      const a = this._getOrReturnCtx(e);
      return G(a, {
        code: V.invalid_type,
        expected: Y.symbol,
        received: a.parsedType
      }), pe;
    }
    return zt(e.data);
  }
}
du.create = (t) => new du({
  typeName: z.ZodSymbol,
  ...be(t)
});
class ui extends ke {
  _parse(e) {
    if (this._getType(e) !== Y.undefined) {
      const a = this._getOrReturnCtx(e);
      return G(a, {
        code: V.invalid_type,
        expected: Y.undefined,
        received: a.parsedType
      }), pe;
    }
    return zt(e.data);
  }
}
ui.create = (t) => new ui({
  typeName: z.ZodUndefined,
  ...be(t)
});
class di extends ke {
  _parse(e) {
    if (this._getType(e) !== Y.null) {
      const a = this._getOrReturnCtx(e);
      return G(a, {
        code: V.invalid_type,
        expected: Y.null,
        received: a.parsedType
      }), pe;
    }
    return zt(e.data);
  }
}
di.create = (t) => new di({
  typeName: z.ZodNull,
  ...be(t)
});
class fi extends ke {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return zt(e.data);
  }
}
fi.create = (t) => new fi({
  typeName: z.ZodAny,
  ...be(t)
});
class hi extends ke {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return zt(e.data);
  }
}
hi.create = (t) => new hi({
  typeName: z.ZodUnknown,
  ...be(t)
});
class Ur extends ke {
  _parse(e) {
    const r = this._getOrReturnCtx(e);
    return G(r, {
      code: V.invalid_type,
      expected: Y.never,
      received: r.parsedType
    }), pe;
  }
}
Ur.create = (t) => new Ur({
  typeName: z.ZodNever,
  ...be(t)
});
class fu extends ke {
  _parse(e) {
    if (this._getType(e) !== Y.undefined) {
      const a = this._getOrReturnCtx(e);
      return G(a, {
        code: V.invalid_type,
        expected: Y.void,
        received: a.parsedType
      }), pe;
    }
    return zt(e.data);
  }
}
fu.create = (t) => new fu({
  typeName: z.ZodVoid,
  ...be(t)
});
class or extends ke {
  _parse(e) {
    const { ctx: r, status: a } = this._processInputParams(e), n = this._def;
    if (r.parsedType !== Y.array)
      return G(r, {
        code: V.invalid_type,
        expected: Y.array,
        received: r.parsedType
      }), pe;
    if (n.exactLength !== null) {
      const o = r.data.length > n.exactLength.value, i = r.data.length < n.exactLength.value;
      (o || i) && (G(r, {
        code: o ? V.too_big : V.too_small,
        minimum: i ? n.exactLength.value : void 0,
        maximum: o ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), a.dirty());
    }
    if (n.minLength !== null && r.data.length < n.minLength.value && (G(r, {
      code: V.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), a.dirty()), n.maxLength !== null && r.data.length > n.maxLength.value && (G(r, {
      code: V.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), a.dirty()), r.common.async)
      return Promise.all([...r.data].map((o, i) => n.type._parseAsync(new lr(r, o, r.path, i)))).then((o) => Rt.mergeArray(a, o));
    const s = [...r.data].map((o, i) => n.type._parseSync(new lr(r, o, r.path, i)));
    return Rt.mergeArray(a, s);
  }
  get element() {
    return this._def.type;
  }
  min(e, r) {
    return new or({
      ...this._def,
      minLength: { value: e, message: te.toString(r) }
    });
  }
  max(e, r) {
    return new or({
      ...this._def,
      maxLength: { value: e, message: te.toString(r) }
    });
  }
  length(e, r) {
    return new or({
      ...this._def,
      exactLength: { value: e, message: te.toString(r) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
or.create = (t, e) => new or({
  type: t,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: z.ZodArray,
  ...be(e)
});
function yn(t) {
  if (t instanceof it) {
    const e = {};
    for (const r in t.shape) {
      const a = t.shape[r];
      e[r] = Er.create(yn(a));
    }
    return new it({
      ...t._def,
      shape: () => e
    });
  } else return t instanceof or ? new or({
    ...t._def,
    type: yn(t.element)
  }) : t instanceof Er ? Er.create(yn(t.unwrap())) : t instanceof ln ? ln.create(yn(t.unwrap())) : t instanceof an ? an.create(t.items.map((e) => yn(e))) : t;
}
class it extends ke {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), r = Le.objectKeys(e);
    return this._cached = { shape: e, keys: r }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== Y.object) {
      const c = this._getOrReturnCtx(e);
      return G(c, {
        code: V.invalid_type,
        expected: Y.object,
        received: c.parsedType
      }), pe;
    }
    const { status: a, ctx: n } = this._processInputParams(e), { shape: s, keys: o } = this._getCached(), i = [];
    if (!(this._def.catchall instanceof Ur && this._def.unknownKeys === "strip"))
      for (const c in n.data)
        o.includes(c) || i.push(c);
    const l = [];
    for (const c of o) {
      const u = s[c], d = n.data[c];
      l.push({
        key: { status: "valid", value: c },
        value: u._parse(new lr(n, d, n.path, c)),
        alwaysSet: c in n.data
      });
    }
    if (this._def.catchall instanceof Ur) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const u of i)
          l.push({
            key: { status: "valid", value: u },
            value: { status: "valid", value: n.data[u] }
          });
      else if (c === "strict")
        i.length > 0 && (G(n, {
          code: V.unrecognized_keys,
          keys: i
        }), a.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const u of i) {
        const d = n.data[u];
        l.push({
          key: { status: "valid", value: u },
          value: c._parse(
            new lr(n, d, n.path, u)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: u in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const u of l) {
        const d = await u.key, h = await u.value;
        c.push({
          key: d,
          value: h,
          alwaysSet: u.alwaysSet
        });
      }
      return c;
    }).then((c) => Rt.mergeObjectSync(a, c)) : Rt.mergeObjectSync(a, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return te.errToObj, new it({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (r, a) => {
          var s, o;
          const n = ((o = (s = this._def).errorMap) == null ? void 0 : o.call(s, r, a).message) ?? a.defaultError;
          return r.code === "unrecognized_keys" ? {
            message: te.errToObj(e).message ?? n
          } : {
            message: n
          };
        }
      } : {}
    });
  }
  strip() {
    return new it({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new it({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new it({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new it({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: z.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, r) {
    return this.augment({ [e]: r });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new it({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const r = {};
    for (const a of Le.objectKeys(e))
      e[a] && this.shape[a] && (r[a] = this.shape[a]);
    return new it({
      ...this._def,
      shape: () => r
    });
  }
  omit(e) {
    const r = {};
    for (const a of Le.objectKeys(this.shape))
      e[a] || (r[a] = this.shape[a]);
    return new it({
      ...this._def,
      shape: () => r
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return yn(this);
  }
  partial(e) {
    const r = {};
    for (const a of Le.objectKeys(this.shape)) {
      const n = this.shape[a];
      e && !e[a] ? r[a] = n : r[a] = n.optional();
    }
    return new it({
      ...this._def,
      shape: () => r
    });
  }
  required(e) {
    const r = {};
    for (const a of Le.objectKeys(this.shape))
      if (e && !e[a])
        r[a] = this.shape[a];
      else {
        let s = this.shape[a];
        for (; s instanceof Er; )
          s = s._def.innerType;
        r[a] = s;
      }
    return new it({
      ...this._def,
      shape: () => r
    });
  }
  keyof() {
    return jd(Le.objectKeys(this.shape));
  }
}
it.create = (t, e) => new it({
  shape: () => t,
  unknownKeys: "strip",
  catchall: Ur.create(),
  typeName: z.ZodObject,
  ...be(e)
});
it.strictCreate = (t, e) => new it({
  shape: () => t,
  unknownKeys: "strict",
  catchall: Ur.create(),
  typeName: z.ZodObject,
  ...be(e)
});
it.lazycreate = (t, e) => new it({
  shape: t,
  unknownKeys: "strip",
  catchall: Ur.create(),
  typeName: z.ZodObject,
  ...be(e)
});
class ss extends ke {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = this._def.options;
    function n(s) {
      for (const i of s)
        if (i.result.status === "valid")
          return i.result;
      for (const i of s)
        if (i.result.status === "dirty")
          return r.common.issues.push(...i.ctx.common.issues), i.result;
      const o = s.map((i) => new xr(i.ctx.common.issues));
      return G(r, {
        code: V.invalid_union,
        unionErrors: o
      }), pe;
    }
    if (r.common.async)
      return Promise.all(a.map(async (s) => {
        const o = {
          ...r,
          common: {
            ...r.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await s._parseAsync({
            data: r.data,
            path: r.path,
            parent: o
          }),
          ctx: o
        };
      })).then(n);
    {
      let s;
      const o = [];
      for (const l of a) {
        const c = {
          ...r,
          common: {
            ...r.common,
            issues: []
          },
          parent: null
        }, u = l._parseSync({
          data: r.data,
          path: r.path,
          parent: c
        });
        if (u.status === "valid")
          return u;
        u.status === "dirty" && !s && (s = { result: u, ctx: c }), c.common.issues.length && o.push(c.common.issues);
      }
      if (s)
        return r.common.issues.push(...s.ctx.common.issues), s.result;
      const i = o.map((l) => new xr(l));
      return G(r, {
        code: V.invalid_union,
        unionErrors: i
      }), pe;
    }
  }
  get options() {
    return this._def.options;
  }
}
ss.create = (t, e) => new ss({
  options: t,
  typeName: z.ZodUnion,
  ...be(e)
});
const mr = (t) => t instanceof mi ? mr(t.schema) : t instanceof on ? mr(t.innerType()) : t instanceof ls ? [t.value] : t instanceof sn ? t.options : t instanceof vi ? Le.objectValues(t.enum) : t instanceof us ? mr(t._def.innerType) : t instanceof ui ? [void 0] : t instanceof di ? [null] : t instanceof Er ? [void 0, ...mr(t.unwrap())] : t instanceof ln ? [null, ...mr(t.unwrap())] : t instanceof Bd || t instanceof fs ? mr(t.unwrap()) : t instanceof ds ? mr(t._def.innerType) : [];
class Pl extends ke {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== Y.object)
      return G(r, {
        code: V.invalid_type,
        expected: Y.object,
        received: r.parsedType
      }), pe;
    const a = this.discriminator, n = r.data[a], s = this.optionsMap.get(n);
    return s ? r.common.async ? s._parseAsync({
      data: r.data,
      path: r.path,
      parent: r
    }) : s._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }) : (G(r, {
      code: V.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [a]
    }), pe);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, r, a) {
    const n = /* @__PURE__ */ new Map();
    for (const s of r) {
      const o = mr(s.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const i of o) {
        if (n.has(i))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(i)}`);
        n.set(i, s);
      }
    }
    return new Pl({
      typeName: z.ZodDiscriminatedUnion,
      discriminator: e,
      options: r,
      optionsMap: n,
      ...be(a)
    });
  }
}
function pi(t, e) {
  const r = Lr(t), a = Lr(e);
  if (t === e)
    return { valid: !0, data: t };
  if (r === Y.object && a === Y.object) {
    const n = Le.objectKeys(e), s = Le.objectKeys(t).filter((i) => n.indexOf(i) !== -1), o = { ...t, ...e };
    for (const i of s) {
      const l = pi(t[i], e[i]);
      if (!l.valid)
        return { valid: !1 };
      o[i] = l.data;
    }
    return { valid: !0, data: o };
  } else if (r === Y.array && a === Y.array) {
    if (t.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let s = 0; s < t.length; s++) {
      const o = t[s], i = e[s], l = pi(o, i);
      if (!l.valid)
        return { valid: !1 };
      n.push(l.data);
    }
    return { valid: !0, data: n };
  } else return r === Y.date && a === Y.date && +t == +e ? { valid: !0, data: t } : { valid: !1 };
}
class os extends ke {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e), n = (s, o) => {
      if (lu(s) || lu(o))
        return pe;
      const i = pi(s.value, o.value);
      return i.valid ? ((cu(s) || cu(o)) && r.dirty(), { status: r.value, value: i.data }) : (G(a, {
        code: V.invalid_intersection_types
      }), pe);
    };
    return a.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      }),
      this._def.right._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      })
    ]).then(([s, o]) => n(s, o)) : n(this._def.left._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }), this._def.right._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }));
  }
}
os.create = (t, e, r) => new os({
  left: t,
  right: e,
  typeName: z.ZodIntersection,
  ...be(r)
});
class an extends ke {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== Y.array)
      return G(a, {
        code: V.invalid_type,
        expected: Y.array,
        received: a.parsedType
      }), pe;
    if (a.data.length < this._def.items.length)
      return G(a, {
        code: V.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), pe;
    !this._def.rest && a.data.length > this._def.items.length && (G(a, {
      code: V.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), r.dirty());
    const s = [...a.data].map((o, i) => {
      const l = this._def.items[i] || this._def.rest;
      return l ? l._parse(new lr(a, o, a.path, i)) : null;
    }).filter((o) => !!o);
    return a.common.async ? Promise.all(s).then((o) => Rt.mergeArray(r, o)) : Rt.mergeArray(r, s);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new an({
      ...this._def,
      rest: e
    });
  }
}
an.create = (t, e) => {
  if (!Array.isArray(t))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new an({
    items: t,
    typeName: z.ZodTuple,
    rest: null,
    ...be(e)
  });
};
class is extends ke {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== Y.object)
      return G(a, {
        code: V.invalid_type,
        expected: Y.object,
        received: a.parsedType
      }), pe;
    const n = [], s = this._def.keyType, o = this._def.valueType;
    for (const i in a.data)
      n.push({
        key: s._parse(new lr(a, i, a.path, i)),
        value: o._parse(new lr(a, a.data[i], a.path, i)),
        alwaysSet: i in a.data
      });
    return a.common.async ? Rt.mergeObjectAsync(r, n) : Rt.mergeObjectSync(r, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, r, a) {
    return r instanceof ke ? new is({
      keyType: e,
      valueType: r,
      typeName: z.ZodRecord,
      ...be(a)
    }) : new is({
      keyType: br.create(),
      valueType: e,
      typeName: z.ZodRecord,
      ...be(r)
    });
  }
}
class hu extends ke {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== Y.map)
      return G(a, {
        code: V.invalid_type,
        expected: Y.map,
        received: a.parsedType
      }), pe;
    const n = this._def.keyType, s = this._def.valueType, o = [...a.data.entries()].map(([i, l], c) => ({
      key: n._parse(new lr(a, i, a.path, [c, "key"])),
      value: s._parse(new lr(a, l, a.path, [c, "value"]))
    }));
    if (a.common.async) {
      const i = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of o) {
          const c = await l.key, u = await l.value;
          if (c.status === "aborted" || u.status === "aborted")
            return pe;
          (c.status === "dirty" || u.status === "dirty") && r.dirty(), i.set(c.value, u.value);
        }
        return { status: r.value, value: i };
      });
    } else {
      const i = /* @__PURE__ */ new Map();
      for (const l of o) {
        const c = l.key, u = l.value;
        if (c.status === "aborted" || u.status === "aborted")
          return pe;
        (c.status === "dirty" || u.status === "dirty") && r.dirty(), i.set(c.value, u.value);
      }
      return { status: r.value, value: i };
    }
  }
}
hu.create = (t, e, r) => new hu({
  valueType: e,
  keyType: t,
  typeName: z.ZodMap,
  ...be(r)
});
class da extends ke {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== Y.set)
      return G(a, {
        code: V.invalid_type,
        expected: Y.set,
        received: a.parsedType
      }), pe;
    const n = this._def;
    n.minSize !== null && a.data.size < n.minSize.value && (G(a, {
      code: V.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), r.dirty()), n.maxSize !== null && a.data.size > n.maxSize.value && (G(a, {
      code: V.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
    }), r.dirty());
    const s = this._def.valueType;
    function o(l) {
      const c = /* @__PURE__ */ new Set();
      for (const u of l) {
        if (u.status === "aborted")
          return pe;
        u.status === "dirty" && r.dirty(), c.add(u.value);
      }
      return { status: r.value, value: c };
    }
    const i = [...a.data.values()].map((l, c) => s._parse(new lr(a, l, a.path, c)));
    return a.common.async ? Promise.all(i).then((l) => o(l)) : o(i);
  }
  min(e, r) {
    return new da({
      ...this._def,
      minSize: { value: e, message: te.toString(r) }
    });
  }
  max(e, r) {
    return new da({
      ...this._def,
      maxSize: { value: e, message: te.toString(r) }
    });
  }
  size(e, r) {
    return this.min(e, r).max(e, r);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
da.create = (t, e) => new da({
  valueType: t,
  minSize: null,
  maxSize: null,
  typeName: z.ZodSet,
  ...be(e)
});
class mi extends ke {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    return this._def.getter()._parse({ data: r.data, path: r.path, parent: r });
  }
}
mi.create = (t, e) => new mi({
  getter: t,
  typeName: z.ZodLazy,
  ...be(e)
});
class ls extends ke {
  _parse(e) {
    if (e.data !== this._def.value) {
      const r = this._getOrReturnCtx(e);
      return G(r, {
        received: r.data,
        code: V.invalid_literal,
        expected: this._def.value
      }), pe;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
ls.create = (t, e) => new ls({
  value: t,
  typeName: z.ZodLiteral,
  ...be(e)
});
function jd(t, e) {
  return new sn({
    values: t,
    typeName: z.ZodEnum,
    ...be(e)
  });
}
class sn extends ke {
  _parse(e) {
    if (typeof e.data != "string") {
      const r = this._getOrReturnCtx(e), a = this._def.values;
      return G(r, {
        expected: Le.joinValues(a),
        received: r.parsedType,
        code: V.invalid_type
      }), pe;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const r = this._getOrReturnCtx(e), a = this._def.values;
      return G(r, {
        received: r.data,
        code: V.invalid_enum_value,
        options: a
      }), pe;
    }
    return zt(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const r of this._def.values)
      e[r] = r;
    return e;
  }
  get Values() {
    const e = {};
    for (const r of this._def.values)
      e[r] = r;
    return e;
  }
  get Enum() {
    const e = {};
    for (const r of this._def.values)
      e[r] = r;
    return e;
  }
  extract(e, r = this._def) {
    return sn.create(e, {
      ...this._def,
      ...r
    });
  }
  exclude(e, r = this._def) {
    return sn.create(this.options.filter((a) => !e.includes(a)), {
      ...this._def,
      ...r
    });
  }
}
sn.create = jd;
class vi extends ke {
  _parse(e) {
    const r = Le.getValidEnumValues(this._def.values), a = this._getOrReturnCtx(e);
    if (a.parsedType !== Y.string && a.parsedType !== Y.number) {
      const n = Le.objectValues(r);
      return G(a, {
        expected: Le.joinValues(n),
        received: a.parsedType,
        code: V.invalid_type
      }), pe;
    }
    if (this._cache || (this._cache = new Set(Le.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const n = Le.objectValues(r);
      return G(a, {
        received: a.data,
        code: V.invalid_enum_value,
        options: n
      }), pe;
    }
    return zt(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
vi.create = (t, e) => new vi({
  values: t,
  typeName: z.ZodNativeEnum,
  ...be(e)
});
class cs extends ke {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== Y.promise && r.common.async === !1)
      return G(r, {
        code: V.invalid_type,
        expected: Y.promise,
        received: r.parsedType
      }), pe;
    const a = r.parsedType === Y.promise ? r.data : Promise.resolve(r.data);
    return zt(a.then((n) => this._def.type.parseAsync(n, {
      path: r.path,
      errorMap: r.common.contextualErrorMap
    })));
  }
}
cs.create = (t, e) => new cs({
  type: t,
  typeName: z.ZodPromise,
  ...be(e)
});
class on extends ke {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === z.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e), n = this._def.effect || null, s = {
      addIssue: (o) => {
        G(a, o), o.fatal ? r.abort() : r.dirty();
      },
      get path() {
        return a.path;
      }
    };
    if (s.addIssue = s.addIssue.bind(s), n.type === "preprocess") {
      const o = n.transform(a.data, s);
      if (a.common.async)
        return Promise.resolve(o).then(async (i) => {
          if (r.value === "aborted")
            return pe;
          const l = await this._def.schema._parseAsync({
            data: i,
            path: a.path,
            parent: a
          });
          return l.status === "aborted" ? pe : l.status === "dirty" || r.value === "dirty" ? Yn(l.value) : l;
        });
      {
        if (r.value === "aborted")
          return pe;
        const i = this._def.schema._parseSync({
          data: o,
          path: a.path,
          parent: a
        });
        return i.status === "aborted" ? pe : i.status === "dirty" || r.value === "dirty" ? Yn(i.value) : i;
      }
    }
    if (n.type === "refinement") {
      const o = (i) => {
        const l = n.refinement(i, s);
        if (a.common.async)
          return Promise.resolve(l);
        if (l instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return i;
      };
      if (a.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return i.status === "aborted" ? pe : (i.status === "dirty" && r.dirty(), o(i.value), { status: r.value, value: i.value });
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((i) => i.status === "aborted" ? pe : (i.status === "dirty" && r.dirty(), o(i.value).then(() => ({ status: r.value, value: i.value }))));
    }
    if (n.type === "transform")
      if (a.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        if (!Ln(o))
          return pe;
        const i = n.transform(o.value, s);
        if (i instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: r.value, value: i };
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((o) => Ln(o) ? Promise.resolve(n.transform(o.value, s)).then((i) => ({
          status: r.value,
          value: i
        })) : pe);
    Le.assertNever(n);
  }
}
on.create = (t, e, r) => new on({
  schema: t,
  typeName: z.ZodEffects,
  effect: e,
  ...be(r)
});
on.createWithPreprocess = (t, e, r) => new on({
  schema: e,
  effect: { type: "preprocess", transform: t },
  typeName: z.ZodEffects,
  ...be(r)
});
class Er extends ke {
  _parse(e) {
    return this._getType(e) === Y.undefined ? zt(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Er.create = (t, e) => new Er({
  innerType: t,
  typeName: z.ZodOptional,
  ...be(e)
});
class ln extends ke {
  _parse(e) {
    return this._getType(e) === Y.null ? zt(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ln.create = (t, e) => new ln({
  innerType: t,
  typeName: z.ZodNullable,
  ...be(e)
});
class us extends ke {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    let a = r.data;
    return r.parsedType === Y.undefined && (a = this._def.defaultValue()), this._def.innerType._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
us.create = (t, e) => new us({
  innerType: t,
  typeName: z.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...be(e)
});
class ds extends ke {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = {
      ...r,
      common: {
        ...r.common,
        issues: []
      }
    }, n = this._def.innerType._parse({
      data: a.data,
      path: a.path,
      parent: {
        ...a
      }
    });
    return ns(n) ? n.then((s) => ({
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new xr(a.common.issues);
        },
        input: a.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new xr(a.common.issues);
        },
        input: a.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ds.create = (t, e) => new ds({
  innerType: t,
  typeName: z.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...be(e)
});
class pu extends ke {
  _parse(e) {
    if (this._getType(e) !== Y.nan) {
      const a = this._getOrReturnCtx(e);
      return G(a, {
        code: V.invalid_type,
        expected: Y.nan,
        received: a.parsedType
      }), pe;
    }
    return { status: "valid", value: e.data };
  }
}
pu.create = (t) => new pu({
  typeName: z.ZodNaN,
  ...be(t)
});
class Bd extends ke {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = r.data;
    return this._def.type._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class xl extends ke {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.common.async)
      return (async () => {
        const s = await this._def.in._parseAsync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return s.status === "aborted" ? pe : s.status === "dirty" ? (r.dirty(), Yn(s.value)) : this._def.out._parseAsync({
          data: s.value,
          path: a.path,
          parent: a
        });
      })();
    {
      const n = this._def.in._parseSync({
        data: a.data,
        path: a.path,
        parent: a
      });
      return n.status === "aborted" ? pe : n.status === "dirty" ? (r.dirty(), {
        status: "dirty",
        value: n.value
      }) : this._def.out._parseSync({
        data: n.value,
        path: a.path,
        parent: a
      });
    }
  }
  static create(e, r) {
    return new xl({
      in: e,
      out: r,
      typeName: z.ZodPipeline
    });
  }
}
class fs extends ke {
  _parse(e) {
    const r = this._def.innerType._parse(e), a = (n) => (Ln(n) && (n.value = Object.freeze(n.value)), n);
    return ns(r) ? r.then((n) => a(n)) : a(r);
  }
  unwrap() {
    return this._def.innerType;
  }
}
fs.create = (t, e) => new fs({
  innerType: t,
  typeName: z.ZodReadonly,
  ...be(e)
});
var z;
(function(t) {
  t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline", t.ZodReadonly = "ZodReadonly";
})(z || (z = {}));
const x = br.create, _t = Nn.create, ht = ci.create, fw = fi.create, ma = hi.create;
Ur.create;
const X = or.create, W = it.create, Tt = ss.create, hw = Pl.create;
os.create;
an.create;
const va = is.create, ye = ls.create, Cr = sn.create;
cs.create;
const U = Er.create;
ln.create;
const ga = "2025-06-18", Ud = [
  ga,
  "2025-03-26",
  "2024-11-05",
  "2024-10-07"
], Gs = "2.0", Vd = Tt([x(), _t().int()]), zd = x(), pw = W({
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: U(Vd)
}).passthrough(), qt = W({
  _meta: U(pw)
}).passthrough(), $t = W({
  method: x(),
  params: U(qt)
}), _a = W({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), fr = W({
  method: x(),
  params: U(_a)
}), Ht = W({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), Ks = Tt([x(), _t().int()]), qd = W({
  jsonrpc: ye(Gs),
  id: Ks
}).merge($t).strict(), Hd = (t) => qd.safeParse(t).success, Zd = W({
  jsonrpc: ye(Gs)
}).merge(fr).strict(), mw = (t) => Zd.safeParse(t).success, Wd = W({
  jsonrpc: ye(Gs),
  id: Ks,
  result: Ht
}).strict(), gi = (t) => Wd.safeParse(t).success;
var ze;
(function(t) {
  t[t.ConnectionClosed = -32e3] = "ConnectionClosed", t[t.RequestTimeout = -32001] = "RequestTimeout", t[t.ParseError = -32700] = "ParseError", t[t.InvalidRequest = -32600] = "InvalidRequest", t[t.MethodNotFound = -32601] = "MethodNotFound", t[t.InvalidParams = -32602] = "InvalidParams", t[t.InternalError = -32603] = "InternalError";
})(ze || (ze = {}));
const Jd = W({
  jsonrpc: ye(Gs),
  id: Ks,
  error: W({
    /**
     * The error type that occurred.
     */
    code: _t().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: x(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: U(ma())
  })
}).strict(), vw = (t) => Jd.safeParse(t).success, oa = Tt([
  qd,
  Zd,
  Wd,
  Jd
]), Fr = Ht.strict(), Cl = fr.extend({
  method: ye("notifications/cancelled"),
  params: _a.extend({
    /**
     * The ID of the request to cancel.
     *
     * This MUST correspond to the ID of a request previously issued in the same direction.
     */
    requestId: Ks,
    /**
     * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
     */
    reason: x().optional()
  })
}), ya = W({
  /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
  name: x(),
  /**
  * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
  * even by those unfamiliar with domain-specific terminology.
  *
  * If not provided, the name should be used for display (except for Tool,
  * where `annotations.title` should be given precedence over using `name`,
  * if present).
  */
  title: U(x())
}).passthrough(), Qd = ya.extend({
  version: x()
}), gw = W({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: U(W({}).passthrough()),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: U(W({}).passthrough()),
  /**
   * Present if the client supports eliciting user input.
   */
  elicitation: U(W({}).passthrough()),
  /**
   * Present if the client supports listing roots.
   */
  roots: U(W({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: U(ht())
  }).passthrough())
}).passthrough(), Gd = $t.extend({
  method: ye("initialize"),
  params: qt.extend({
    /**
     * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
     */
    protocolVersion: x(),
    capabilities: gw,
    clientInfo: Qd
  })
}), _w = W({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: U(W({}).passthrough()),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: U(W({}).passthrough()),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: U(W({}).passthrough()),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: U(W({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: U(ht())
  }).passthrough()),
  /**
   * Present if the server offers any resources to read.
   */
  resources: U(W({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: U(ht()),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: U(ht())
  }).passthrough()),
  /**
   * Present if the server offers any tools to call.
   */
  tools: U(W({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: U(ht())
  }).passthrough())
}).passthrough(), Kd = Ht.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: x(),
  capabilities: _w,
  serverInfo: Qd,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: U(x())
}), kl = fr.extend({
  method: ye("notifications/initialized")
}), yw = (t) => kl.safeParse(t).success, Il = $t.extend({
  method: ye("ping")
}), bw = W({
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: _t(),
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total: U(_t()),
  /**
   * An optional message describing the current progress.
   */
  message: U(x())
}).passthrough(), Rl = fr.extend({
  method: ye("notifications/progress"),
  params: _a.merge(bw).extend({
    /**
     * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
     */
    progressToken: Vd
  })
}), Ys = $t.extend({
  params: qt.extend({
    /**
     * An opaque token representing the current pagination position.
     * If provided, the server should return results starting after this cursor.
     */
    cursor: U(zd)
  }).optional()
}), Xs = Ht.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: U(zd)
}), Yd = W({
  /**
   * The URI of this resource.
   */
  uri: x(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: U(x()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), Xd = Yd.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: x()
}), Tl = x().refine((t) => {
  try {
    return atob(t), !0;
  } catch {
    return !1;
  }
}, { message: "Invalid Base64 string" }), ef = Yd.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: Tl
}), tf = ya.extend({
  /**
   * The URI of this resource.
   */
  uri: x(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: U(x()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: U(x()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}), ww = ya.extend({
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: x(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: U(x()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: U(x()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}), _i = Ys.extend({
  method: ye("resources/list")
}), rf = Xs.extend({
  resources: X(tf)
}), yi = Ys.extend({
  method: ye("resources/templates/list")
}), nf = Xs.extend({
  resourceTemplates: X(ww)
}), bi = $t.extend({
  method: ye("resources/read"),
  params: qt.extend({
    /**
     * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: x()
  })
}), af = Ht.extend({
  contents: X(Tt([Xd, ef]))
}), Ew = fr.extend({
  method: ye("notifications/resources/list_changed")
}), Sw = $t.extend({
  method: ye("resources/subscribe"),
  params: qt.extend({
    /**
     * The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: x()
  })
}), Pw = $t.extend({
  method: ye("resources/unsubscribe"),
  params: qt.extend({
    /**
     * The URI of the resource to unsubscribe from.
     */
    uri: x()
  })
}), xw = fr.extend({
  method: ye("notifications/resources/updated"),
  params: _a.extend({
    /**
     * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
     */
    uri: x()
  })
}), Cw = W({
  /**
   * The name of the argument.
   */
  name: x(),
  /**
   * A human-readable description of the argument.
   */
  description: U(x()),
  /**
   * Whether this argument must be provided.
   */
  required: U(ht())
}).passthrough(), kw = ya.extend({
  /**
   * An optional description of what this prompt provides
   */
  description: U(x()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: U(X(Cw)),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}), wi = Ys.extend({
  method: ye("prompts/list")
}), sf = Xs.extend({
  prompts: X(kw)
}), Ei = $t.extend({
  method: ye("prompts/get"),
  params: qt.extend({
    /**
     * The name of the prompt or prompt template.
     */
    name: x(),
    /**
     * Arguments to use for templating the prompt.
     */
    arguments: U(va(x()))
  })
}), Al = W({
  type: ye("text"),
  /**
   * The text content of the message.
   */
  text: x(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), Ol = W({
  type: ye("image"),
  /**
   * The base64-encoded image data.
   */
  data: Tl,
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: x(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), Dl = W({
  type: ye("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: Tl,
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: x(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), Iw = W({
  type: ye("resource"),
  resource: Tt([Xd, ef]),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), Rw = tf.extend({
  type: ye("resource_link")
}), of = Tt([
  Al,
  Ol,
  Dl,
  Rw,
  Iw
]), Tw = W({
  role: Cr(["user", "assistant"]),
  content: of
}).passthrough(), lf = Ht.extend({
  /**
   * An optional description for the prompt.
   */
  description: U(x()),
  messages: X(Tw)
}), Aw = fr.extend({
  method: ye("notifications/prompts/list_changed")
}), Ow = W({
  /**
   * A human-readable title for the tool.
   */
  title: U(x()),
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint: U(ht()),
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint: U(ht()),
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint: U(ht()),
  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint: U(ht())
}).passthrough(), Dw = ya.extend({
  /**
   * A human-readable description of the tool.
   */
  description: U(x()),
  /**
   * A JSON Schema object defining the expected parameters for the tool.
   */
  inputSchema: W({
    type: ye("object"),
    properties: U(W({}).passthrough()),
    required: U(X(x()))
  }).passthrough(),
  /**
   * An optional JSON Schema object defining the structure of the tool's output returned in
   * the structuredContent field of a CallToolResult.
   */
  outputSchema: U(W({
    type: ye("object"),
    properties: U(W({}).passthrough()),
    required: U(X(x()))
  }).passthrough()),
  /**
   * Optional additional tool information.
   */
  annotations: U(Ow),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}), Si = Ys.extend({
  method: ye("tools/list")
}), cf = Xs.extend({
  tools: X(Dw)
}), Ll = Ht.extend({
  /**
   * A list of content objects that represent the result of the tool call.
   *
   * If the Tool does not define an outputSchema, this field MUST be present in the result.
   * For backwards compatibility, this field is always present, but it may be empty.
   */
  content: X(of).default([]),
  /**
   * An object containing structured tool output.
   *
   * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
   */
  structuredContent: W({}).passthrough().optional(),
  /**
   * Whether the tool call ended in an error.
   *
   * If not set, this is assumed to be false (the call was successful).
   *
   * Any errors that originate from the tool SHOULD be reported inside the result
   * object, with `isError` set to true, _not_ as an MCP protocol-level error
   * response. Otherwise, the LLM would not be able to see that an error occurred
   * and self-correct.
   *
   * However, any errors in _finding_ the tool, an error indicating that the
   * server does not support tool calls, or any other exceptional conditions,
   * should be reported as an MCP error response.
   */
  isError: U(ht())
});
Ll.or(Ht.extend({
  toolResult: ma()
}));
const Pi = $t.extend({
  method: ye("tools/call"),
  params: qt.extend({
    name: x(),
    arguments: U(va(ma()))
  })
}), Lw = fr.extend({
  method: ye("notifications/tools/list_changed")
}), uf = Cr([
  "debug",
  "info",
  "notice",
  "warning",
  "error",
  "critical",
  "alert",
  "emergency"
]), Nw = $t.extend({
  method: ye("logging/setLevel"),
  params: qt.extend({
    /**
     * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
     */
    level: uf
  })
}), $w = fr.extend({
  method: ye("notifications/message"),
  params: _a.extend({
    /**
     * The severity of this log message.
     */
    level: uf,
    /**
     * An optional name of the logger issuing this message.
     */
    logger: U(x()),
    /**
     * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
     */
    data: ma()
  })
}), Mw = W({
  /**
   * A hint for a model name.
   */
  name: x().optional()
}).passthrough(), Fw = W({
  /**
   * Optional hints to use for model selection.
   */
  hints: U(X(Mw)),
  /**
   * How much to prioritize cost when selecting a model.
   */
  costPriority: U(_t().min(0).max(1)),
  /**
   * How much to prioritize sampling speed (latency) when selecting a model.
   */
  speedPriority: U(_t().min(0).max(1)),
  /**
   * How much to prioritize intelligence and capabilities when selecting a model.
   */
  intelligencePriority: U(_t().min(0).max(1))
}).passthrough(), jw = W({
  role: Cr(["user", "assistant"]),
  content: Tt([Al, Ol, Dl])
}).passthrough(), Bw = $t.extend({
  method: ye("sampling/createMessage"),
  params: qt.extend({
    messages: X(jw),
    /**
     * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
     */
    systemPrompt: U(x()),
    /**
     * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.
     */
    includeContext: U(Cr(["none", "thisServer", "allServers"])),
    temperature: U(_t()),
    /**
     * The maximum number of tokens to sample, as requested by the server. The client MAY choose to sample fewer tokens than requested.
     */
    maxTokens: _t().int(),
    stopSequences: U(X(x())),
    /**
     * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
     */
    metadata: U(W({}).passthrough()),
    /**
     * The server's preferences for which model to select.
     */
    modelPreferences: U(Fw)
  })
}), Nl = Ht.extend({
  /**
   * The name of the model that generated the message.
   */
  model: x(),
  /**
   * The reason why sampling stopped.
   */
  stopReason: U(Cr(["endTurn", "stopSequence", "maxTokens"]).or(x())),
  role: Cr(["user", "assistant"]),
  content: hw("type", [
    Al,
    Ol,
    Dl
  ])
}), Uw = W({
  type: ye("boolean"),
  title: U(x()),
  description: U(x()),
  default: U(ht())
}).passthrough(), Vw = W({
  type: ye("string"),
  title: U(x()),
  description: U(x()),
  minLength: U(_t()),
  maxLength: U(_t()),
  format: U(Cr(["email", "uri", "date", "date-time"]))
}).passthrough(), zw = W({
  type: Cr(["number", "integer"]),
  title: U(x()),
  description: U(x()),
  minimum: U(_t()),
  maximum: U(_t())
}).passthrough(), qw = W({
  type: ye("string"),
  title: U(x()),
  description: U(x()),
  enum: X(x()),
  enumNames: U(X(x()))
}).passthrough(), Hw = Tt([
  Uw,
  Vw,
  zw,
  qw
]), Zw = $t.extend({
  method: ye("elicitation/create"),
  params: qt.extend({
    /**
     * The message to present to the user.
     */
    message: x(),
    /**
     * The schema for the requested user input.
     */
    requestedSchema: W({
      type: ye("object"),
      properties: va(x(), Hw),
      required: U(X(x()))
    }).passthrough()
  })
}), df = Ht.extend({
  /**
   * The user's response action.
   */
  action: Cr(["accept", "decline", "cancel"]),
  /**
   * The collected user input content (only present if action is "accept").
   */
  content: U(va(x(), ma()))
}), Ww = W({
  type: ye("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: x()
}).passthrough(), Jw = W({
  type: ye("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: x()
}).passthrough(), xi = $t.extend({
  method: ye("completion/complete"),
  params: qt.extend({
    ref: Tt([Jw, Ww]),
    /**
     * The argument's information
     */
    argument: W({
      /**
       * The name of the argument
       */
      name: x(),
      /**
       * The value of the argument to use for completion matching.
       */
      value: x()
    }).passthrough(),
    context: U(W({
      /**
       * Previously-resolved variables in a URI template or prompt.
       */
      arguments: U(va(x(), x()))
    }))
  })
}), ff = Ht.extend({
  completion: W({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: X(x()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: U(_t().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: U(ht())
  }).passthrough()
}), Qw = W({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: x().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: U(x()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: U(W({}).passthrough())
}).passthrough(), Gw = $t.extend({
  method: ye("roots/list")
}), $l = Ht.extend({
  roots: X(Qw)
}), Kw = fr.extend({
  method: ye("notifications/roots/list_changed")
});
Tt([
  Il,
  Gd,
  xi,
  Nw,
  Ei,
  wi,
  _i,
  yi,
  bi,
  Sw,
  Pw,
  Pi,
  Si
]);
Tt([
  Cl,
  Rl,
  kl,
  Kw
]);
Tt([
  Fr,
  Nl,
  df,
  $l
]);
Tt([
  Il,
  Bw,
  Zw,
  Gw
]);
Tt([
  Cl,
  Rl,
  $w,
  xw,
  Ew,
  Lw,
  Aw
]);
Tt([
  Fr,
  Kd,
  ff,
  lf,
  sf,
  rf,
  nf,
  af,
  Ll,
  cf
]);
class Ze extends Error {
  constructor(e, r, a) {
    super(`MCP error ${e}: ${r}`), this.code = e, this.data = a, this.name = "McpError";
  }
}
const Yw = 6e4;
class hf {
  constructor(e) {
    this._options = e, this._requestMessageId = 0, this._requestHandlers = /* @__PURE__ */ new Map(), this._requestHandlerAbortControllers = /* @__PURE__ */ new Map(), this._notificationHandlers = /* @__PURE__ */ new Map(), this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers = /* @__PURE__ */ new Map(), this._timeoutInfo = /* @__PURE__ */ new Map(), this._pendingDebouncedNotifications = /* @__PURE__ */ new Set(), this.setNotificationHandler(Cl, (r) => {
      const a = this._requestHandlerAbortControllers.get(r.params.requestId);
      a == null || a.abort(r.params.reason);
    }), this.setNotificationHandler(Rl, (r) => {
      this._onprogress(r);
    }), this.setRequestHandler(
      Il,
      // Automatic pong by default.
      (r) => ({})
    );
  }
  _setupTimeout(e, r, a, n, s = !1) {
    this._timeoutInfo.set(e, {
      timeoutId: setTimeout(n, r),
      startTime: Date.now(),
      timeout: r,
      maxTotalTimeout: a,
      resetTimeoutOnProgress: s,
      onTimeout: n
    });
  }
  _resetTimeout(e) {
    const r = this._timeoutInfo.get(e);
    if (!r)
      return !1;
    const a = Date.now() - r.startTime;
    if (r.maxTotalTimeout && a >= r.maxTotalTimeout)
      throw this._timeoutInfo.delete(e), new Ze(ze.RequestTimeout, "Maximum total timeout exceeded", { maxTotalTimeout: r.maxTotalTimeout, totalElapsed: a });
    return clearTimeout(r.timeoutId), r.timeoutId = setTimeout(r.onTimeout, r.timeout), !0;
  }
  _cleanupTimeout(e) {
    const r = this._timeoutInfo.get(e);
    r && (clearTimeout(r.timeoutId), this._timeoutInfo.delete(e));
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(e) {
    var r, a, n;
    this._transport = e;
    const s = (r = this.transport) === null || r === void 0 ? void 0 : r.onclose;
    this._transport.onclose = () => {
      s == null || s(), this._onclose();
    };
    const o = (a = this.transport) === null || a === void 0 ? void 0 : a.onerror;
    this._transport.onerror = (l) => {
      o == null || o(l), this._onerror(l);
    };
    const i = (n = this._transport) === null || n === void 0 ? void 0 : n.onmessage;
    this._transport.onmessage = (l, c) => {
      i == null || i(l, c), gi(l) || vw(l) ? this._onresponse(l) : Hd(l) ? this._onrequest(l, c) : mw(l) ? this._onnotification(l) : this._onerror(new Error(`Unknown message type: ${JSON.stringify(l)}`));
    }, await this._transport.start();
  }
  _onclose() {
    var e;
    const r = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers.clear(), this._pendingDebouncedNotifications.clear(), this._transport = void 0, (e = this.onclose) === null || e === void 0 || e.call(this);
    const a = new Ze(ze.ConnectionClosed, "Connection closed");
    for (const n of r.values())
      n(a);
  }
  _onerror(e) {
    var r;
    (r = this.onerror) === null || r === void 0 || r.call(this, e);
  }
  _onnotification(e) {
    var r;
    const a = (r = this._notificationHandlers.get(e.method)) !== null && r !== void 0 ? r : this.fallbackNotificationHandler;
    a !== void 0 && Promise.resolve().then(() => a(e)).catch((n) => this._onerror(new Error(`Uncaught error in notification handler: ${n}`)));
  }
  _onrequest(e, r) {
    var a, n, s, o;
    const i = (a = this._requestHandlers.get(e.method)) !== null && a !== void 0 ? a : this.fallbackRequestHandler;
    if (i === void 0) {
      (n = this._transport) === null || n === void 0 || n.send({
        jsonrpc: "2.0",
        id: e.id,
        error: {
          code: ze.MethodNotFound,
          message: "Method not found"
        }
      }).catch((u) => this._onerror(new Error(`Failed to send an error response: ${u}`)));
      return;
    }
    const l = new AbortController();
    this._requestHandlerAbortControllers.set(e.id, l);
    const c = {
      signal: l.signal,
      sessionId: (s = this._transport) === null || s === void 0 ? void 0 : s.sessionId,
      _meta: (o = e.params) === null || o === void 0 ? void 0 : o._meta,
      sendNotification: (u) => this.notification(u, { relatedRequestId: e.id }),
      sendRequest: (u, d, h) => this.request(u, d, { ...h, relatedRequestId: e.id }),
      authInfo: r == null ? void 0 : r.authInfo,
      requestId: e.id,
      requestInfo: r == null ? void 0 : r.requestInfo
    };
    Promise.resolve().then(() => i(e, c)).then((u) => {
      var d;
      if (!l.signal.aborted)
        return (d = this._transport) === null || d === void 0 ? void 0 : d.send({
          result: u,
          jsonrpc: "2.0",
          id: e.id
        });
    }, (u) => {
      var d, h;
      if (!l.signal.aborted)
        return (d = this._transport) === null || d === void 0 ? void 0 : d.send({
          jsonrpc: "2.0",
          id: e.id,
          error: {
            code: Number.isSafeInteger(u.code) ? u.code : ze.InternalError,
            message: (h = u.message) !== null && h !== void 0 ? h : "Internal error"
          }
        });
    }).catch((u) => this._onerror(new Error(`Failed to send response: ${u}`))).finally(() => {
      this._requestHandlerAbortControllers.delete(e.id);
    });
  }
  _onprogress(e) {
    const { progressToken: r, ...a } = e.params, n = Number(r), s = this._progressHandlers.get(n);
    if (!s) {
      this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));
      return;
    }
    const o = this._responseHandlers.get(n), i = this._timeoutInfo.get(n);
    if (i && o && i.resetTimeoutOnProgress)
      try {
        this._resetTimeout(n);
      } catch (l) {
        o(l);
        return;
      }
    s(a);
  }
  _onresponse(e) {
    const r = Number(e.id), a = this._responseHandlers.get(r);
    if (a === void 0) {
      this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`));
      return;
    }
    if (this._responseHandlers.delete(r), this._progressHandlers.delete(r), this._cleanupTimeout(r), gi(e))
      a(e);
    else {
      const n = new Ze(e.error.code, e.error.message, e.error.data);
      a(n);
    }
  }
  get transport() {
    return this._transport;
  }
  /**
   * Closes the connection.
   */
  async close() {
    var e;
    await ((e = this._transport) === null || e === void 0 ? void 0 : e.close());
  }
  /**
   * Sends a request and wait for a response.
   *
   * Do not use this method to emit notifications! Use notification() instead.
   */
  request(e, r, a) {
    const { relatedRequestId: n, resumptionToken: s, onresumptiontoken: o } = a ?? {};
    return new Promise((i, l) => {
      var c, u, d, h, f, m;
      if (!this._transport) {
        l(new Error("Not connected"));
        return;
      }
      ((c = this._options) === null || c === void 0 ? void 0 : c.enforceStrictCapabilities) === !0 && this.assertCapabilityForMethod(e.method), (u = a == null ? void 0 : a.signal) === null || u === void 0 || u.throwIfAborted();
      const p = this._requestMessageId++, v = {
        ...e,
        jsonrpc: "2.0",
        id: p
      };
      a != null && a.onprogress && (this._progressHandlers.set(p, a.onprogress), v.params = {
        ...e.params,
        _meta: {
          ...((d = e.params) === null || d === void 0 ? void 0 : d._meta) || {},
          progressToken: p
        }
      });
      const y = (E) => {
        var P;
        this._responseHandlers.delete(p), this._progressHandlers.delete(p), this._cleanupTimeout(p), (P = this._transport) === null || P === void 0 || P.send({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: p,
            reason: String(E)
          }
        }, { relatedRequestId: n, resumptionToken: s, onresumptiontoken: o }).catch((A) => this._onerror(new Error(`Failed to send cancellation: ${A}`))), l(E);
      };
      this._responseHandlers.set(p, (E) => {
        var P;
        if (!(!((P = a == null ? void 0 : a.signal) === null || P === void 0) && P.aborted)) {
          if (E instanceof Error)
            return l(E);
          try {
            const A = r.parse(E.result);
            i(A);
          } catch (A) {
            l(A);
          }
        }
      }), (h = a == null ? void 0 : a.signal) === null || h === void 0 || h.addEventListener("abort", () => {
        var E;
        y((E = a == null ? void 0 : a.signal) === null || E === void 0 ? void 0 : E.reason);
      });
      const b = (f = a == null ? void 0 : a.timeout) !== null && f !== void 0 ? f : Yw, _ = () => y(new Ze(ze.RequestTimeout, "Request timed out", { timeout: b }));
      this._setupTimeout(p, b, a == null ? void 0 : a.maxTotalTimeout, _, (m = a == null ? void 0 : a.resetTimeoutOnProgress) !== null && m !== void 0 ? m : !1), this._transport.send(v, { relatedRequestId: n, resumptionToken: s, onresumptiontoken: o }).catch((E) => {
        this._cleanupTimeout(p), l(E);
      });
    });
  }
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  async notification(e, r) {
    var a, n;
    if (!this._transport)
      throw new Error("Not connected");
    if (this.assertNotificationCapability(e.method), ((n = (a = this._options) === null || a === void 0 ? void 0 : a.debouncedNotificationMethods) !== null && n !== void 0 ? n : []).includes(e.method) && !e.params && !(r != null && r.relatedRequestId)) {
      if (this._pendingDebouncedNotifications.has(e.method))
        return;
      this._pendingDebouncedNotifications.add(e.method), Promise.resolve().then(() => {
        var l;
        if (this._pendingDebouncedNotifications.delete(e.method), !this._transport)
          return;
        const c = {
          ...e,
          jsonrpc: "2.0"
        };
        (l = this._transport) === null || l === void 0 || l.send(c, r).catch((u) => this._onerror(u));
      });
      return;
    }
    const i = {
      ...e,
      jsonrpc: "2.0"
    };
    await this._transport.send(i, r);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a request with the given method.
   *
   * Note that this will replace any previous request handler for the same method.
   */
  setRequestHandler(e, r) {
    const a = e.shape.method.value;
    this.assertRequestHandlerCapability(a), this._requestHandlers.set(a, (n, s) => Promise.resolve(r(e.parse(n), s)));
  }
  /**
   * Removes the request handler for the given method.
   */
  removeRequestHandler(e) {
    this._requestHandlers.delete(e);
  }
  /**
   * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
   */
  assertCanSetRequestHandler(e) {
    if (this._requestHandlers.has(e))
      throw new Error(`A request handler for ${e} already exists, which would be overridden`);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a notification with the given method.
   *
   * Note that this will replace any previous notification handler for the same method.
   */
  setNotificationHandler(e, r) {
    this._notificationHandlers.set(e.shape.method.value, (a) => Promise.resolve(r(e.parse(a))));
  }
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(e) {
    this._notificationHandlers.delete(e);
  }
}
function pf(t, e) {
  return Object.entries(e).reduce((r, [a, n]) => (n && typeof n == "object" ? r[a] = r[a] ? { ...r[a], ...n } : n : r[a] = n, r), { ...t });
}
var Ci = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(t, e) {
  (function(r, a) {
    a(e);
  })(ap, function(r) {
    function a() {
      for (var w = arguments.length, g = Array(w), S = 0; S < w; S++)
        g[S] = arguments[S];
      if (g.length > 1) {
        g[0] = g[0].slice(0, -1);
        for (var T = g.length - 1, I = 1; I < T; ++I)
          g[I] = g[I].slice(1, -1);
        return g[T] = g[T].slice(1), g.join("");
      } else
        return g[0];
    }
    function n(w) {
      return "(?:" + w + ")";
    }
    function s(w) {
      return w === void 0 ? "undefined" : w === null ? "null" : Object.prototype.toString.call(w).split(" ").pop().split("]").shift().toLowerCase();
    }
    function o(w) {
      return w.toUpperCase();
    }
    function i(w) {
      return w != null ? w instanceof Array ? w : typeof w.length != "number" || w.split || w.setInterval || w.call ? [w] : Array.prototype.slice.call(w) : [];
    }
    function l(w, g) {
      var S = w;
      if (g)
        for (var T in g)
          S[T] = g[T];
      return S;
    }
    function c(w) {
      var g = "[A-Za-z]", S = "[0-9]", T = a(S, "[A-Fa-f]"), I = n(n("%[EFef]" + T + "%" + T + T + "%" + T + T) + "|" + n("%[89A-Fa-f]" + T + "%" + T + T) + "|" + n("%" + T + T)), ne = "[\\:\\/\\?\\#\\[\\]\\@]", oe = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", Ae = a(ne, oe), He = w ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", nt = w ? "[\\uE000-\\uF8FF]" : "[]", Re = a(g, S, "[\\-\\.\\_\\~]", He);
      n(g + a(g, S, "[\\+\\-\\.]") + "*"), n(n(I + "|" + a(Re, oe, "[\\:]")) + "*");
      var Ue = n(n("25[0-5]") + "|" + n("2[0-4]" + S) + "|" + n("1" + S + S) + "|" + n("0?[1-9]" + S) + "|0?0?" + S), at = n(Ue + "\\." + Ue + "\\." + Ue + "\\." + Ue), ve = n(T + "{1,4}"), We = n(n(ve + "\\:" + ve) + "|" + at), st = n(n(ve + "\\:") + "{6}" + We), Je = n("\\:\\:" + n(ve + "\\:") + "{5}" + We), Tr = n(n(ve) + "?\\:\\:" + n(ve + "\\:") + "{4}" + We), Kt = n(n(n(ve + "\\:") + "{0,1}" + ve) + "?\\:\\:" + n(ve + "\\:") + "{3}" + We), Yt = n(n(n(ve + "\\:") + "{0,2}" + ve) + "?\\:\\:" + n(ve + "\\:") + "{2}" + We), hn = n(n(n(ve + "\\:") + "{0,3}" + ve) + "?\\:\\:" + ve + "\\:" + We), Qr = n(n(n(ve + "\\:") + "{0,4}" + ve) + "?\\:\\:" + We), Bt = n(n(n(ve + "\\:") + "{0,5}" + ve) + "?\\:\\:" + ve), Xt = n(n(n(ve + "\\:") + "{0,6}" + ve) + "?\\:\\:"), Gr = n([st, Je, Tr, Kt, Yt, hn, Qr, Bt, Xt].join("|")), pr = n(n(Re + "|" + I) + "+");
      n("[vV]" + T + "+\\." + a(Re, oe, "[\\:]") + "+"), n(n(I + "|" + a(Re, oe)) + "*");
      var qn = n(I + "|" + a(Re, oe, "[\\:\\@]"));
      return n(n(I + "|" + a(Re, oe, "[\\@]")) + "+"), n(n(qn + "|" + a("[\\/\\?]", nt)) + "*"), {
        NOT_SCHEME: new RegExp(a("[^]", g, S, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(a("[^\\%\\:]", Re, oe), "g"),
        NOT_HOST: new RegExp(a("[^\\%\\[\\]\\:]", Re, oe), "g"),
        NOT_PATH: new RegExp(a("[^\\%\\/\\:\\@]", Re, oe), "g"),
        NOT_PATH_NOSCHEME: new RegExp(a("[^\\%\\/\\@]", Re, oe), "g"),
        NOT_QUERY: new RegExp(a("[^\\%]", Re, oe, "[\\:\\@\\/\\?]", nt), "g"),
        NOT_FRAGMENT: new RegExp(a("[^\\%]", Re, oe, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(a("[^]", Re, oe), "g"),
        UNRESERVED: new RegExp(Re, "g"),
        OTHER_CHARS: new RegExp(a("[^\\%]", Re, Ae), "g"),
        PCT_ENCODED: new RegExp(I, "g"),
        IPV4ADDRESS: new RegExp("^(" + at + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + Gr + ")" + n(n("\\%25|\\%(?!" + T + "{2})") + "(" + pr + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var u = c(!1), d = c(!0), h = /* @__PURE__ */ function() {
      function w(g, S) {
        var T = [], I = !0, ne = !1, oe = void 0;
        try {
          for (var Ae = g[Symbol.iterator](), He; !(I = (He = Ae.next()).done) && (T.push(He.value), !(S && T.length === S)); I = !0)
            ;
        } catch (nt) {
          ne = !0, oe = nt;
        } finally {
          try {
            !I && Ae.return && Ae.return();
          } finally {
            if (ne) throw oe;
          }
        }
        return T;
      }
      return function(g, S) {
        if (Array.isArray(g))
          return g;
        if (Symbol.iterator in Object(g))
          return w(g, S);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), f = function(w) {
      if (Array.isArray(w)) {
        for (var g = 0, S = Array(w.length); g < w.length; g++) S[g] = w[g];
        return S;
      } else
        return Array.from(w);
    }, m = 2147483647, p = 36, v = 1, y = 26, b = 38, _ = 700, E = 72, P = 128, A = "-", k = /^xn--/, B = /[^\0-\x7E]/, L = /[\x2E\u3002\uFF0E\uFF61]/g, H = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, J = p - v, q = Math.floor, N = String.fromCharCode;
    function D(w) {
      throw new RangeError(H[w]);
    }
    function Q(w, g) {
      for (var S = [], T = w.length; T--; )
        S[T] = g(w[T]);
      return S;
    }
    function ae(w, g) {
      var S = w.split("@"), T = "";
      S.length > 1 && (T = S[0] + "@", w = S[1]), w = w.replace(L, ".");
      var I = w.split("."), ne = Q(I, g).join(".");
      return T + ne;
    }
    function de(w) {
      for (var g = [], S = 0, T = w.length; S < T; ) {
        var I = w.charCodeAt(S++);
        if (I >= 55296 && I <= 56319 && S < T) {
          var ne = w.charCodeAt(S++);
          (ne & 64512) == 56320 ? g.push(((I & 1023) << 10) + (ne & 1023) + 65536) : (g.push(I), S--);
        } else
          g.push(I);
      }
      return g;
    }
    var le = function(g) {
      return String.fromCodePoint.apply(String, f(g));
    }, ge = function(g) {
      return g - 48 < 10 ? g - 22 : g - 65 < 26 ? g - 65 : g - 97 < 26 ? g - 97 : p;
    }, se = function(g, S) {
      return g + 22 + 75 * (g < 26) - ((S != 0) << 5);
    }, je = function(g, S, T) {
      var I = 0;
      for (
        g = T ? q(g / _) : g >> 1, g += q(g / S);
        /* no initialization */
        g > J * y >> 1;
        I += p
      )
        g = q(g / J);
      return q(I + (J + 1) * g / (g + b));
    }, Te = function(g) {
      var S = [], T = g.length, I = 0, ne = P, oe = E, Ae = g.lastIndexOf(A);
      Ae < 0 && (Ae = 0);
      for (var He = 0; He < Ae; ++He)
        g.charCodeAt(He) >= 128 && D("not-basic"), S.push(g.charCodeAt(He));
      for (var nt = Ae > 0 ? Ae + 1 : 0; nt < T; ) {
        for (
          var Re = I, Ue = 1, at = p;
          ;
          /* no condition */
          at += p
        ) {
          nt >= T && D("invalid-input");
          var ve = ge(g.charCodeAt(nt++));
          (ve >= p || ve > q((m - I) / Ue)) && D("overflow"), I += ve * Ue;
          var We = at <= oe ? v : at >= oe + y ? y : at - oe;
          if (ve < We)
            break;
          var st = p - We;
          Ue > q(m / st) && D("overflow"), Ue *= st;
        }
        var Je = S.length + 1;
        oe = je(I - Re, Je, Re == 0), q(I / Je) > m - ne && D("overflow"), ne += q(I / Je), I %= Je, S.splice(I++, 0, ne);
      }
      return String.fromCodePoint.apply(String, S);
    }, j = function(g) {
      var S = [];
      g = de(g);
      var T = g.length, I = P, ne = 0, oe = E, Ae = !0, He = !1, nt = void 0;
      try {
        for (var Re = g[Symbol.iterator](), Ue; !(Ae = (Ue = Re.next()).done); Ae = !0) {
          var at = Ue.value;
          at < 128 && S.push(N(at));
        }
      } catch (Hn) {
        He = !0, nt = Hn;
      } finally {
        try {
          !Ae && Re.return && Re.return();
        } finally {
          if (He)
            throw nt;
        }
      }
      var ve = S.length, We = ve;
      for (ve && S.push(A); We < T; ) {
        var st = m, Je = !0, Tr = !1, Kt = void 0;
        try {
          for (var Yt = g[Symbol.iterator](), hn; !(Je = (hn = Yt.next()).done); Je = !0) {
            var Qr = hn.value;
            Qr >= I && Qr < st && (st = Qr);
          }
        } catch (Hn) {
          Tr = !0, Kt = Hn;
        } finally {
          try {
            !Je && Yt.return && Yt.return();
          } finally {
            if (Tr)
              throw Kt;
          }
        }
        var Bt = We + 1;
        st - I > q((m - ne) / Bt) && D("overflow"), ne += (st - I) * Bt, I = st;
        var Xt = !0, Gr = !1, pr = void 0;
        try {
          for (var qn = g[Symbol.iterator](), sc; !(Xt = (sc = qn.next()).done); Xt = !0) {
            var oc = sc.value;
            if (oc < I && ++ne > m && D("overflow"), oc == I) {
              for (
                var Ea = ne, Sa = p;
                ;
                /* no condition */
                Sa += p
              ) {
                var Pa = Sa <= oe ? v : Sa >= oe + y ? y : Sa - oe;
                if (Ea < Pa)
                  break;
                var ic = Ea - Pa, lc = p - Pa;
                S.push(N(se(Pa + ic % lc, 0))), Ea = q(ic / lc);
              }
              S.push(N(se(Ea, 0))), oe = je(ne, Bt, We == ve), ne = 0, ++We;
            }
          }
        } catch (Hn) {
          Gr = !0, pr = Hn;
        } finally {
          try {
            !Xt && qn.return && qn.return();
          } finally {
            if (Gr)
              throw pr;
          }
        }
        ++ne, ++I;
      }
      return S.join("");
    }, K = function(g) {
      return ae(g, function(S) {
        return k.test(S) ? Te(S.slice(4).toLowerCase()) : S;
      });
    }, Ee = function(g) {
      return ae(g, function(S) {
        return B.test(S) ? "xn--" + j(S) : S;
      });
    }, Ne = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "2.1.0",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: de,
        encode: le
      },
      decode: Te,
      encode: j,
      toASCII: Ee,
      toUnicode: K
    }, we = {};
    function Oe(w) {
      var g = w.charCodeAt(0), S = void 0;
      return g < 16 ? S = "%0" + g.toString(16).toUpperCase() : g < 128 ? S = "%" + g.toString(16).toUpperCase() : g < 2048 ? S = "%" + (g >> 6 | 192).toString(16).toUpperCase() + "%" + (g & 63 | 128).toString(16).toUpperCase() : S = "%" + (g >> 12 | 224).toString(16).toUpperCase() + "%" + (g >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (g & 63 | 128).toString(16).toUpperCase(), S;
    }
    function Be(w) {
      for (var g = "", S = 0, T = w.length; S < T; ) {
        var I = parseInt(w.substr(S + 1, 2), 16);
        if (I < 128)
          g += String.fromCharCode(I), S += 3;
        else if (I >= 194 && I < 224) {
          if (T - S >= 6) {
            var ne = parseInt(w.substr(S + 4, 2), 16);
            g += String.fromCharCode((I & 31) << 6 | ne & 63);
          } else
            g += w.substr(S, 6);
          S += 6;
        } else if (I >= 224) {
          if (T - S >= 9) {
            var oe = parseInt(w.substr(S + 4, 2), 16), Ae = parseInt(w.substr(S + 7, 2), 16);
            g += String.fromCharCode((I & 15) << 12 | (oe & 63) << 6 | Ae & 63);
          } else
            g += w.substr(S, 9);
          S += 9;
        } else
          g += w.substr(S, 3), S += 3;
      }
      return g;
    }
    function Pe(w, g) {
      function S(T) {
        var I = Be(T);
        return I.match(g.UNRESERVED) ? I : T;
      }
      return w.scheme && (w.scheme = String(w.scheme).replace(g.PCT_ENCODED, S).toLowerCase().replace(g.NOT_SCHEME, "")), w.userinfo !== void 0 && (w.userinfo = String(w.userinfo).replace(g.PCT_ENCODED, S).replace(g.NOT_USERINFO, Oe).replace(g.PCT_ENCODED, o)), w.host !== void 0 && (w.host = String(w.host).replace(g.PCT_ENCODED, S).toLowerCase().replace(g.NOT_HOST, Oe).replace(g.PCT_ENCODED, o)), w.path !== void 0 && (w.path = String(w.path).replace(g.PCT_ENCODED, S).replace(w.scheme ? g.NOT_PATH : g.NOT_PATH_NOSCHEME, Oe).replace(g.PCT_ENCODED, o)), w.query !== void 0 && (w.query = String(w.query).replace(g.PCT_ENCODED, S).replace(g.NOT_QUERY, Oe).replace(g.PCT_ENCODED, o)), w.fragment !== void 0 && (w.fragment = String(w.fragment).replace(g.PCT_ENCODED, S).replace(g.NOT_FRAGMENT, Oe).replace(g.PCT_ENCODED, o)), w;
    }
    function Ie(w) {
      return w.replace(/^0*(.*)/, "$1") || "0";
    }
    function At(w, g) {
      var S = w.match(g.IPV4ADDRESS) || [], T = h(S, 2), I = T[1];
      return I ? I.split(".").map(Ie).join(".") : w;
    }
    function mt(w, g) {
      var S = w.match(g.IPV6ADDRESS) || [], T = h(S, 3), I = T[1], ne = T[2];
      if (I) {
        for (var oe = I.toLowerCase().split("::").reverse(), Ae = h(oe, 2), He = Ae[0], nt = Ae[1], Re = nt ? nt.split(":").map(Ie) : [], Ue = He.split(":").map(Ie), at = g.IPV4ADDRESS.test(Ue[Ue.length - 1]), ve = at ? 7 : 8, We = Ue.length - ve, st = Array(ve), Je = 0; Je < ve; ++Je)
          st[Je] = Re[Je] || Ue[We + Je] || "";
        at && (st[ve - 1] = At(st[ve - 1], g));
        var Tr = st.reduce(function(Bt, Xt, Gr) {
          if (!Xt || Xt === "0") {
            var pr = Bt[Bt.length - 1];
            pr && pr.index + pr.length === Gr ? pr.length++ : Bt.push({ index: Gr, length: 1 });
          }
          return Bt;
        }, []), Kt = Tr.sort(function(Bt, Xt) {
          return Xt.length - Bt.length;
        })[0], Yt = void 0;
        if (Kt && Kt.length > 1) {
          var hn = st.slice(0, Kt.index), Qr = st.slice(Kt.index + Kt.length);
          Yt = hn.join(":") + "::" + Qr.join(":");
        } else
          Yt = st.join(":");
        return ne && (Yt += "%" + ne), Yt;
      } else
        return w;
    }
    var Ke = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Ir = "".match(/(){0}/)[1] === void 0;
    function Et(w) {
      var g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, S = {}, T = g.iri !== !1 ? d : u;
      g.reference === "suffix" && (w = (g.scheme ? g.scheme + ":" : "") + "//" + w);
      var I = w.match(Ke);
      if (I) {
        Ir ? (S.scheme = I[1], S.userinfo = I[3], S.host = I[4], S.port = parseInt(I[5], 10), S.path = I[6] || "", S.query = I[7], S.fragment = I[8], isNaN(S.port) && (S.port = I[5])) : (S.scheme = I[1] || void 0, S.userinfo = w.indexOf("@") !== -1 ? I[3] : void 0, S.host = w.indexOf("//") !== -1 ? I[4] : void 0, S.port = parseInt(I[5], 10), S.path = I[6] || "", S.query = w.indexOf("?") !== -1 ? I[7] : void 0, S.fragment = w.indexOf("#") !== -1 ? I[8] : void 0, isNaN(S.port) && (S.port = w.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? I[4] : void 0)), S.host && (S.host = mt(At(S.host, T), T)), S.scheme === void 0 && S.userinfo === void 0 && S.host === void 0 && S.port === void 0 && !S.path && S.query === void 0 ? S.reference = "same-document" : S.scheme === void 0 ? S.reference = "relative" : S.fragment === void 0 ? S.reference = "absolute" : S.reference = "uri", g.reference && g.reference !== "suffix" && g.reference !== S.reference && (S.error = S.error || "URI is not a " + g.reference + " reference.");
        var ne = we[(g.scheme || S.scheme || "").toLowerCase()];
        if (!g.unicodeSupport && (!ne || !ne.unicodeSupport)) {
          if (S.host && (g.domainHost || ne && ne.domainHost))
            try {
              S.host = Ne.toASCII(S.host.replace(T.PCT_ENCODED, Be).toLowerCase());
            } catch (oe) {
              S.error = S.error || "Host's domain name can not be converted to ASCII via punycode: " + oe;
            }
          Pe(S, u);
        } else
          Pe(S, T);
        ne && ne.parse && ne.parse(S, g);
      } else
        S.error = S.error || "URI can not be parsed.";
      return S;
    }
    function dn(w, g) {
      var S = g.iri !== !1 ? d : u, T = [];
      return w.userinfo !== void 0 && (T.push(w.userinfo), T.push("@")), w.host !== void 0 && T.push(mt(At(String(w.host), S), S).replace(S.IPV6ADDRESS, function(I, ne, oe) {
        return "[" + ne + (oe ? "%25" + oe : "") + "]";
      })), (typeof w.port == "number" || typeof w.port == "string") && (T.push(":"), T.push(String(w.port))), T.length ? T.join("") : void 0;
    }
    var Jr = /^\.\.?\//, vt = /^\/\.(\/|$)/, Rr = /^\/\.\.(\/|$)/, Un = /^\/?(?:.|\n)*?(?=\/|$)/;
    function lt(w) {
      for (var g = []; w.length; )
        if (w.match(Jr))
          w = w.replace(Jr, "");
        else if (w.match(vt))
          w = w.replace(vt, "/");
        else if (w.match(Rr))
          w = w.replace(Rr, "/"), g.pop();
        else if (w === "." || w === "..")
          w = "";
        else {
          var S = w.match(Un);
          if (S) {
            var T = S[0];
            w = w.slice(T.length), g.push(T);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return g.join("");
    }
    function ct(w) {
      var g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, S = g.iri ? d : u, T = [], I = we[(g.scheme || w.scheme || "").toLowerCase()];
      if (I && I.serialize && I.serialize(w, g), w.host && !S.IPV6ADDRESS.test(w.host)) {
        if (g.domainHost || I && I.domainHost)
          try {
            w.host = g.iri ? Ne.toUnicode(w.host) : Ne.toASCII(w.host.replace(S.PCT_ENCODED, Be).toLowerCase());
          } catch (Ae) {
            w.error = w.error || "Host's domain name can not be converted to " + (g.iri ? "Unicode" : "ASCII") + " via punycode: " + Ae;
          }
      }
      Pe(w, S), g.reference !== "suffix" && w.scheme && (T.push(w.scheme), T.push(":"));
      var ne = dn(w, g);
      if (ne !== void 0 && (g.reference !== "suffix" && T.push("//"), T.push(ne), w.path && w.path.charAt(0) !== "/" && T.push("/")), w.path !== void 0) {
        var oe = w.path;
        !g.absolutePath && (!I || !I.absolutePath) && (oe = lt(oe)), ne === void 0 && (oe = oe.replace(/^\/\//, "/%2F")), T.push(oe);
      }
      return w.query !== void 0 && (T.push("?"), T.push(w.query)), w.fragment !== void 0 && (T.push("#"), T.push(w.fragment)), T.join("");
    }
    function Ot(w, g) {
      var S = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, T = arguments[3], I = {};
      return T || (w = Et(ct(w, S), S), g = Et(ct(g, S), S)), S = S || {}, !S.tolerant && g.scheme ? (I.scheme = g.scheme, I.userinfo = g.userinfo, I.host = g.host, I.port = g.port, I.path = lt(g.path || ""), I.query = g.query) : (g.userinfo !== void 0 || g.host !== void 0 || g.port !== void 0 ? (I.userinfo = g.userinfo, I.host = g.host, I.port = g.port, I.path = lt(g.path || ""), I.query = g.query) : (g.path ? (g.path.charAt(0) === "/" ? I.path = lt(g.path) : ((w.userinfo !== void 0 || w.host !== void 0 || w.port !== void 0) && !w.path ? I.path = "/" + g.path : w.path ? I.path = w.path.slice(0, w.path.lastIndexOf("/") + 1) + g.path : I.path = g.path, I.path = lt(I.path)), I.query = g.query) : (I.path = w.path, g.query !== void 0 ? I.query = g.query : I.query = w.query), I.userinfo = w.userinfo, I.host = w.host, I.port = w.port), I.scheme = w.scheme), I.fragment = g.fragment, I;
    }
    function wa(w, g, S) {
      var T = l({ scheme: "null" }, S);
      return ct(Ot(Et(w, T), Et(g, T), T, !0), T);
    }
    function oo(w, g) {
      return typeof w == "string" ? w = ct(Et(w, g), g) : s(w) === "object" && (w = Et(ct(w, g), g)), w;
    }
    function io(w, g, S) {
      return typeof w == "string" ? w = ct(Et(w, S), S) : s(w) === "object" && (w = ct(w, S)), typeof g == "string" ? g = ct(Et(g, S), S) : s(g) === "object" && (g = ct(g, S)), w === g;
    }
    function ah(w, g) {
      return w && w.toString().replace(!g || !g.iri ? u.ESCAPE : d.ESCAPE, Oe);
    }
    function hr(w, g) {
      return w && w.toString().replace(!g || !g.iri ? u.PCT_ENCODED : d.PCT_ENCODED, Be);
    }
    var Vn = {
      scheme: "http",
      domainHost: !0,
      parse: function(g, S) {
        return g.host || (g.error = g.error || "HTTP URIs must have a host."), g;
      },
      serialize: function(g, S) {
        var T = String(g.scheme).toLowerCase() === "https";
        return (g.port === (T ? 443 : 80) || g.port === "") && (g.port = void 0), g.path || (g.path = "/"), g;
      }
    }, Kl = {
      scheme: "https",
      domainHost: Vn.domainHost,
      parse: Vn.parse,
      serialize: Vn.serialize
    };
    function Yl(w) {
      return typeof w.secure == "boolean" ? w.secure : String(w.scheme).toLowerCase() === "wss";
    }
    var zn = {
      scheme: "ws",
      domainHost: !0,
      parse: function(g, S) {
        var T = g;
        return T.secure = Yl(T), T.resourceName = (T.path || "/") + (T.query ? "?" + T.query : ""), T.path = void 0, T.query = void 0, T;
      },
      serialize: function(g, S) {
        if ((g.port === (Yl(g) ? 443 : 80) || g.port === "") && (g.port = void 0), typeof g.secure == "boolean" && (g.scheme = g.secure ? "wss" : "ws", g.secure = void 0), g.resourceName) {
          var T = g.resourceName.split("?"), I = h(T, 2), ne = I[0], oe = I[1];
          g.path = ne && ne !== "/" ? ne : void 0, g.query = oe, g.resourceName = void 0;
        }
        return g.fragment = void 0, g;
      }
    }, Xl = {
      scheme: "wss",
      domainHost: zn.domainHost,
      parse: zn.parse,
      serialize: zn.serialize
    }, sh = {}, ec = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Gt = "[0-9A-Fa-f]", oh = n(n("%[EFef]" + Gt + "%" + Gt + Gt + "%" + Gt + Gt) + "|" + n("%[89A-Fa-f]" + Gt + "%" + Gt + Gt) + "|" + n("%" + Gt + Gt)), ih = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", lh = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", ch = a(lh, '[\\"\\\\]'), uh = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", dh = new RegExp(ec, "g"), fn = new RegExp(oh, "g"), fh = new RegExp(a("[^]", ih, "[\\.]", '[\\"]', ch), "g"), tc = new RegExp(a("[^]", ec, uh), "g"), hh = tc;
    function lo(w) {
      var g = Be(w);
      return g.match(dh) ? g : w;
    }
    var rc = {
      scheme: "mailto",
      parse: function(g, S) {
        var T = g, I = T.to = T.path ? T.path.split(",") : [];
        if (T.path = void 0, T.query) {
          for (var ne = !1, oe = {}, Ae = T.query.split("&"), He = 0, nt = Ae.length; He < nt; ++He) {
            var Re = Ae[He].split("=");
            switch (Re[0]) {
              case "to":
                for (var Ue = Re[1].split(","), at = 0, ve = Ue.length; at < ve; ++at)
                  I.push(Ue[at]);
                break;
              case "subject":
                T.subject = hr(Re[1], S);
                break;
              case "body":
                T.body = hr(Re[1], S);
                break;
              default:
                ne = !0, oe[hr(Re[0], S)] = hr(Re[1], S);
                break;
            }
          }
          ne && (T.headers = oe);
        }
        T.query = void 0;
        for (var We = 0, st = I.length; We < st; ++We) {
          var Je = I[We].split("@");
          if (Je[0] = hr(Je[0]), S.unicodeSupport)
            Je[1] = hr(Je[1], S).toLowerCase();
          else
            try {
              Je[1] = Ne.toASCII(hr(Je[1], S).toLowerCase());
            } catch (Tr) {
              T.error = T.error || "Email address's domain name can not be converted to ASCII via punycode: " + Tr;
            }
          I[We] = Je.join("@");
        }
        return T;
      },
      serialize: function(g, S) {
        var T = g, I = i(g.to);
        if (I) {
          for (var ne = 0, oe = I.length; ne < oe; ++ne) {
            var Ae = String(I[ne]), He = Ae.lastIndexOf("@"), nt = Ae.slice(0, He).replace(fn, lo).replace(fn, o).replace(fh, Oe), Re = Ae.slice(He + 1);
            try {
              Re = S.iri ? Ne.toUnicode(Re) : Ne.toASCII(hr(Re, S).toLowerCase());
            } catch (We) {
              T.error = T.error || "Email address's domain name can not be converted to " + (S.iri ? "Unicode" : "ASCII") + " via punycode: " + We;
            }
            I[ne] = nt + "@" + Re;
          }
          T.path = I.join(",");
        }
        var Ue = g.headers = g.headers || {};
        g.subject && (Ue.subject = g.subject), g.body && (Ue.body = g.body);
        var at = [];
        for (var ve in Ue)
          Ue[ve] !== sh[ve] && at.push(ve.replace(fn, lo).replace(fn, o).replace(tc, Oe) + "=" + Ue[ve].replace(fn, lo).replace(fn, o).replace(hh, Oe));
        return at.length && (T.query = at.join("&")), T;
      }
    }, ph = /^([^\:]+)\:(.*)/, nc = {
      scheme: "urn",
      parse: function(g, S) {
        var T = g.path && g.path.match(ph), I = g;
        if (T) {
          var ne = S.scheme || I.scheme || "urn", oe = T[1].toLowerCase(), Ae = T[2], He = ne + ":" + (S.nid || oe), nt = we[He];
          I.nid = oe, I.nss = Ae, I.path = void 0, nt && (I = nt.parse(I, S));
        } else
          I.error = I.error || "URN can not be parsed.";
        return I;
      },
      serialize: function(g, S) {
        var T = S.scheme || g.scheme || "urn", I = g.nid, ne = T + ":" + (S.nid || I), oe = we[ne];
        oe && (g = oe.serialize(g, S));
        var Ae = g, He = g.nss;
        return Ae.path = (I || S.nid) + ":" + He, Ae;
      }
    }, mh = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, ac = {
      scheme: "urn:uuid",
      parse: function(g, S) {
        var T = g;
        return T.uuid = T.nss, T.nss = void 0, !S.tolerant && (!T.uuid || !T.uuid.match(mh)) && (T.error = T.error || "UUID is not valid."), T;
      },
      serialize: function(g, S) {
        var T = g;
        return T.nss = (g.uuid || "").toLowerCase(), T;
      }
    };
    we[Vn.scheme] = Vn, we[Kl.scheme] = Kl, we[zn.scheme] = zn, we[Xl.scheme] = Xl, we[rc.scheme] = rc, we[nc.scheme] = nc, we[ac.scheme] = ac, r.SCHEMES = we, r.pctEncChar = Oe, r.pctDecChars = Be, r.parse = Et, r.removeDotSegments = lt, r.serialize = ct, r.resolveComponents = Ot, r.resolve = wa, r.normalize = oo, r.equal = io, r.escapeComponent = ah, r.unescapeComponent = hr, Object.defineProperty(r, "__esModule", { value: !0 });
  });
})(Ci, Ci.exports);
var Xw = Ci.exports, Ml = function t(e, r) {
  if (e === r) return !0;
  if (e && r && typeof e == "object" && typeof r == "object") {
    if (e.constructor !== r.constructor) return !1;
    var a, n, s;
    if (Array.isArray(e)) {
      if (a = e.length, a != r.length) return !1;
      for (n = a; n-- !== 0; )
        if (!t(e[n], r[n])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
    if (s = Object.keys(e), a = s.length, a !== Object.keys(r).length) return !1;
    for (n = a; n-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, s[n])) return !1;
    for (n = a; n-- !== 0; ) {
      var o = s[n];
      if (!t(e[o], r[o])) return !1;
    }
    return !0;
  }
  return e !== e && r !== r;
}, e1 = function(e) {
  for (var r = 0, a = e.length, n = 0, s; n < a; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < a && (s = e.charCodeAt(n), (s & 64512) == 56320 && n++);
  return r;
}, Bn = {
  copy: t1,
  checkDataType: ki,
  checkDataTypes: r1,
  coerceToTypes: n1,
  toHash: Fl,
  getProperty: jl,
  escapeQuotes: Bl,
  equal: Ml,
  ucs2length: e1,
  varOccurences: o1,
  varReplace: i1,
  schemaHasRules: l1,
  schemaHasRulesExcept: c1,
  schemaUnknownRules: u1,
  toQuotedString: Ii,
  getPathExpr: d1,
  getPath: f1,
  getData: m1,
  unescapeFragment: v1,
  unescapeJsonPointer: Vl,
  escapeFragment: g1,
  escapeJsonPointer: Ul
};
function t1(t, e) {
  e = e || {};
  for (var r in t) e[r] = t[r];
  return e;
}
function ki(t, e, r, a) {
  var n = a ? " !== " : " === ", s = a ? " || " : " && ", o = a ? "!" : "", i = a ? "" : "!";
  switch (t) {
    case "null":
      return e + n + "null";
    case "array":
      return o + "Array.isArray(" + e + ")";
    case "object":
      return "(" + o + e + s + "typeof " + e + n + '"object"' + s + i + "Array.isArray(" + e + "))";
    case "integer":
      return "(typeof " + e + n + '"number"' + s + i + "(" + e + " % 1)" + s + e + n + e + (r ? s + o + "isFinite(" + e + ")" : "") + ")";
    case "number":
      return "(typeof " + e + n + '"' + t + '"' + (r ? s + o + "isFinite(" + e + ")" : "") + ")";
    default:
      return "typeof " + e + n + '"' + t + '"';
  }
}
function r1(t, e, r) {
  switch (t.length) {
    case 1:
      return ki(t[0], e, r, !0);
    default:
      var a = "", n = Fl(t);
      n.array && n.object && (a = n.null ? "(" : "(!" + e + " || ", a += "typeof " + e + ' !== "object")', delete n.null, delete n.array, delete n.object), n.number && delete n.integer;
      for (var s in n)
        a += (a ? " && " : "") + ki(s, e, r, !0);
      return a;
  }
}
var mu = Fl(["string", "number", "integer", "boolean", "null"]);
function n1(t, e) {
  if (Array.isArray(e)) {
    for (var r = [], a = 0; a < e.length; a++) {
      var n = e[a];
      (mu[n] || t === "array" && n === "array") && (r[r.length] = n);
    }
    if (r.length) return r;
  } else {
    if (mu[e])
      return [e];
    if (t === "array" && e === "array")
      return ["array"];
  }
}
function Fl(t) {
  for (var e = {}, r = 0; r < t.length; r++) e[t[r]] = !0;
  return e;
}
var a1 = /^[a-z$_][a-z$_0-9]*$/i, s1 = /'|\\/g;
function jl(t) {
  return typeof t == "number" ? "[" + t + "]" : a1.test(t) ? "." + t : "['" + Bl(t) + "']";
}
function Bl(t) {
  return t.replace(s1, "\\$&").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\f/g, "\\f").replace(/\t/g, "\\t");
}
function o1(t, e) {
  e += "[^0-9]";
  var r = t.match(new RegExp(e, "g"));
  return r ? r.length : 0;
}
function i1(t, e, r) {
  return e += "([^0-9])", r = r.replace(/\$/g, "$$$$"), t.replace(new RegExp(e, "g"), r + "$1");
}
function l1(t, e) {
  if (typeof t == "boolean") return !t;
  for (var r in t) if (e[r]) return !0;
}
function c1(t, e, r) {
  if (typeof t == "boolean") return !t && r != "not";
  for (var a in t) if (a != r && e[a]) return !0;
}
function u1(t, e) {
  if (typeof t != "boolean") {
    for (var r in t) if (!e[r]) return r;
  }
}
function Ii(t) {
  return "'" + Bl(t) + "'";
}
function d1(t, e, r, a) {
  var n = r ? "'/' + " + e + (a ? "" : ".replace(/~/g, '~0').replace(/\\//g, '~1')") : a ? "'[' + " + e + " + ']'" : "'[\\'' + " + e + " + '\\']'";
  return mf(t, n);
}
function f1(t, e, r) {
  var a = Ii(r ? "/" + Ul(e) : jl(e));
  return mf(t, a);
}
var h1 = /^\/(?:[^~]|~0|~1)*$/, p1 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function m1(t, e, r) {
  var a, n, s, o;
  if (t === "") return "rootData";
  if (t[0] == "/") {
    if (!h1.test(t)) throw new Error("Invalid JSON-pointer: " + t);
    n = t, s = "rootData";
  } else {
    if (o = t.match(p1), !o) throw new Error("Invalid JSON-pointer: " + t);
    if (a = +o[1], n = o[2], n == "#") {
      if (a >= e) throw new Error("Cannot access property/index " + a + " levels up, current level is " + e);
      return r[e - a];
    }
    if (a > e) throw new Error("Cannot access data " + a + " levels up, current level is " + e);
    if (s = "data" + (e - a || ""), !n) return s;
  }
  for (var i = s, l = n.split("/"), c = 0; c < l.length; c++) {
    var u = l[c];
    u && (s += jl(Vl(u)), i += " && " + s);
  }
  return i;
}
function mf(t, e) {
  return t == '""' ? e : (t + " + " + e).replace(/([^\\])' \+ '/g, "$1");
}
function v1(t) {
  return Vl(decodeURIComponent(t));
}
function g1(t) {
  return encodeURIComponent(Ul(t));
}
function Ul(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Vl(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
var _1 = Bn, vf = y1;
function y1(t) {
  _1.copy(t, this);
}
var gf = { exports: {} }, jr = gf.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var a = typeof r == "function" ? r : r.pre || function() {
  }, n = r.post || function() {
  };
  Za(e, a, n, t, "", t);
};
jr.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0
};
jr.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
jr.propsKeywords = {
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
jr.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Za(t, e, r, a, n, s, o, i, l, c) {
  if (a && typeof a == "object" && !Array.isArray(a)) {
    e(a, n, s, o, i, l, c);
    for (var u in a) {
      var d = a[u];
      if (Array.isArray(d)) {
        if (u in jr.arrayKeywords)
          for (var h = 0; h < d.length; h++)
            Za(t, e, r, d[h], n + "/" + u + "/" + h, s, n, u, a, h);
      } else if (u in jr.propsKeywords) {
        if (d && typeof d == "object")
          for (var f in d)
            Za(t, e, r, d[f], n + "/" + u + "/" + b1(f), s, n, u, a, f);
      } else (u in jr.keywords || t.allKeys && !(u in jr.skipKeywords)) && Za(t, e, r, d, n + "/" + u, s, n, u, a);
    }
    r(a, n, s, o, i, l, c);
  }
}
function b1(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var w1 = gf.exports, ba = Xw, vu = Ml, eo = Bn, hs = vf, E1 = w1, zl = Wr;
Wr.normalizeId = Br;
Wr.fullPath = ps;
Wr.url = ms;
Wr.ids = k1;
Wr.inlineRef = Ri;
Wr.schema = to;
function Wr(t, e, r) {
  var a = this._refs[r];
  if (typeof a == "string")
    if (this._refs[a]) a = this._refs[a];
    else return Wr.call(this, t, e, a);
  if (a = a || this._schemas[r], a instanceof hs)
    return Ri(a.schema, this._opts.inlineRefs) ? a.schema : a.validate || this._compile(a);
  var n = to.call(this, e, r), s, o, i;
  return n && (s = n.schema, e = n.root, i = n.baseId), s instanceof hs ? o = s.validate || t.call(this, s.schema, e, void 0, i) : s !== void 0 && (o = Ri(s, this._opts.inlineRefs) ? s : t.call(this, s, e, void 0, i)), o;
}
function to(t, e) {
  var r = ba.parse(e), a = yf(r), n = ps(this._getId(t.schema));
  if (Object.keys(t.schema).length === 0 || a !== n) {
    var s = Br(a), o = this._refs[s];
    if (typeof o == "string")
      return S1.call(this, t, o, r);
    if (o instanceof hs)
      o.validate || this._compile(o), t = o;
    else if (o = this._schemas[s], o instanceof hs) {
      if (o.validate || this._compile(o), s == Br(e))
        return { schema: o, root: t, baseId: n };
      t = o;
    } else
      return;
    if (!t.schema) return;
    n = ps(this._getId(t.schema));
  }
  return _f.call(this, r, n, t.schema, t);
}
function S1(t, e, r) {
  var a = to.call(this, t, e);
  if (a) {
    var n = a.schema, s = a.baseId;
    t = a.root;
    var o = this._getId(n);
    return o && (s = ms(s, o)), _f.call(this, r, s, n, t);
  }
}
var P1 = eo.toHash(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
function _f(t, e, r, a) {
  if (t.fragment = t.fragment || "", t.fragment.slice(0, 1) == "/") {
    for (var n = t.fragment.split("/"), s = 1; s < n.length; s++) {
      var o = n[s];
      if (o) {
        if (o = eo.unescapeFragment(o), r = r[o], r === void 0) break;
        var i;
        if (!P1[o] && (i = this._getId(r), i && (e = ms(e, i)), r.$ref)) {
          var l = ms(e, r.$ref), c = to.call(this, a, l);
          c && (r = c.schema, a = c.root, e = c.baseId);
        }
      }
    }
    if (r !== void 0 && r !== a.schema)
      return { schema: r, root: a, baseId: e };
  }
}
var x1 = eo.toHash([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum"
]);
function Ri(t, e) {
  if (e === !1) return !1;
  if (e === void 0 || e === !0) return Ti(t);
  if (e) return Ai(t) <= e;
}
function Ti(t) {
  var e;
  if (Array.isArray(t)) {
    for (var r = 0; r < t.length; r++)
      if (e = t[r], typeof e == "object" && !Ti(e)) return !1;
  } else
    for (var a in t)
      if (a == "$ref" || (e = t[a], typeof e == "object" && !Ti(e))) return !1;
  return !0;
}
function Ai(t) {
  var e = 0, r;
  if (Array.isArray(t)) {
    for (var a = 0; a < t.length; a++)
      if (r = t[a], typeof r == "object" && (e += Ai(r)), e == 1 / 0) return 1 / 0;
  } else
    for (var n in t) {
      if (n == "$ref") return 1 / 0;
      if (x1[n])
        e++;
      else if (r = t[n], typeof r == "object" && (e += Ai(r) + 1), e == 1 / 0) return 1 / 0;
    }
  return e;
}
function ps(t, e) {
  e !== !1 && (t = Br(t));
  var r = ba.parse(t);
  return yf(r);
}
function yf(t) {
  return ba.serialize(t).split("#")[0] + "#";
}
var C1 = /#\/?$/;
function Br(t) {
  return t ? t.replace(C1, "") : "";
}
function ms(t, e) {
  return e = Br(e), ba.resolve(t, e);
}
function k1(t) {
  var e = Br(this._getId(t)), r = { "": e }, a = { "": ps(e, !1) }, n = {}, s = this;
  return E1(t, { allKeys: !0 }, function(o, i, l, c, u, d, h) {
    if (i !== "") {
      var f = s._getId(o), m = r[c], p = a[c] + "/" + u;
      if (h !== void 0 && (p += "/" + (typeof h == "number" ? h : eo.escapeFragment(h))), typeof f == "string") {
        f = m = Br(m ? ba.resolve(m, f) : f);
        var v = s._refs[f];
        if (typeof v == "string" && (v = s._refs[v]), v && v.schema) {
          if (!vu(o, v.schema))
            throw new Error('id "' + f + '" resolves to more than one schema');
        } else if (f != Br(p))
          if (f[0] == "#") {
            if (n[f] && !vu(o, n[f]))
              throw new Error('id "' + f + '" resolves to more than one schema');
            n[f] = o;
          } else
            s._refs[f] = p;
      }
      r[i] = m, a[i] = p;
    }
  }), n;
}
var Fo = zl, ql = {
  Validation: gu(I1),
  MissingRef: gu(Hl)
};
function I1(t) {
  this.message = "validation failed", this.errors = t, this.ajv = this.validation = !0;
}
Hl.message = function(t, e) {
  return "can't resolve reference " + e + " from id " + t;
};
function Hl(t, e, r) {
  this.message = r || Hl.message(t, e), this.missingRef = Fo.url(t, e), this.missingSchema = Fo.normalizeId(Fo.fullPath(this.missingRef));
}
function gu(t) {
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var bf = function(t, e) {
  e || (e = {}), typeof e == "function" && (e = { cmp: e });
  var r = typeof e.cycles == "boolean" ? e.cycles : !1, a = e.cmp && /* @__PURE__ */ function(s) {
    return function(o) {
      return function(i, l) {
        var c = { key: i, value: o[i] }, u = { key: l, value: o[l] };
        return s(c, u);
      };
    };
  }(e.cmp), n = [];
  return function s(o) {
    if (o && o.toJSON && typeof o.toJSON == "function" && (o = o.toJSON()), o !== void 0) {
      if (typeof o == "number") return isFinite(o) ? "" + o : "null";
      if (typeof o != "object") return JSON.stringify(o);
      var i, l;
      if (Array.isArray(o)) {
        for (l = "[", i = 0; i < o.length; i++)
          i && (l += ","), l += s(o[i]) || "null";
        return l + "]";
      }
      if (o === null) return "null";
      if (n.indexOf(o) !== -1) {
        if (r) return JSON.stringify("__cycle__");
        throw new TypeError("Converting circular structure to JSON");
      }
      var c = n.push(o) - 1, u = Object.keys(o).sort(a && a(o));
      for (l = "", i = 0; i < u.length; i++) {
        var d = u[i], h = s(o[d]);
        h && (l && (l += ","), l += JSON.stringify(d) + ":" + h);
      }
      return n.splice(c, 1), "{" + l + "}";
    }
  }(t);
}, wf = function(e, r, a) {
  var n = "", s = e.schema.$async === !0, o = e.util.schemaHasRulesExcept(e.schema, e.RULES.all, "$ref"), i = e.self._getId(e.schema);
  if (e.opts.strictKeywords) {
    var l = e.util.schemaUnknownRules(e.schema, e.RULES.keywords);
    if (l) {
      var c = "unknown keyword: " + l;
      if (e.opts.strictKeywords === "log") e.logger.warn(c);
      else throw new Error(c);
    }
  }
  if (e.isTop && (n += " var validate = ", s && (e.async = !0, n += "async "), n += "function(data, dataPath, parentData, parentDataProperty, rootData) { 'use strict'; ", i && (e.opts.sourceCode || e.opts.processCode) && (n += " " + ("/*# sourceURL=" + i + " */") + " ")), typeof e.schema == "boolean" || !(o || e.schema.$ref)) {
    var r = "false schema", u = e.level, d = e.dataLevel, h = e.schema[r], f = e.schemaPath + e.util.getProperty(r), m = e.errSchemaPath + "/" + r, P = !e.opts.allErrors, B, p = "data" + (d || ""), E = "valid" + u;
    if (e.schema === !1) {
      e.isTop ? P = !0 : n += " var " + E + " = false; ";
      var v = v || [];
      v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (B || "false schema") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(m) + " , params: {} ", e.opts.messages !== !1 && (n += " , message: 'boolean schema is false' "), e.opts.verbose && (n += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + p + " "), n += " } ") : n += " {} ";
      var y = n;
      n = v.pop(), !e.compositeRule && P ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
    } else
      e.isTop ? s ? n += " return data; " : n += " validate.errors = null; return true; " : n += " var " + E + " = true; ";
    return e.isTop && (n += " }; return validate; "), n;
  }
  if (e.isTop) {
    var b = e.isTop, u = e.level = 0, d = e.dataLevel = 0, p = "data";
    if (e.rootId = e.resolve.fullPath(e.self._getId(e.root.schema)), e.baseId = e.baseId || e.rootId, delete e.isTop, e.dataPathArr = [""], e.schema.default !== void 0 && e.opts.useDefaults && e.opts.strictDefaults) {
      var _ = "default is ignored in the schema root";
      if (e.opts.strictDefaults === "log") e.logger.warn(_);
      else throw new Error(_);
    }
    n += " var vErrors = null; ", n += " var errors = 0;     ", n += " if (rootData === undefined) rootData = data; ";
  } else {
    var u = e.level, d = e.dataLevel, p = "data" + (d || "");
    if (i && (e.baseId = e.resolve.url(e.baseId, i)), s && !e.async) throw new Error("async schema in sync schema");
    n += " var errs_" + u + " = errors;";
  }
  var E = "valid" + u, P = !e.opts.allErrors, A = "", k = "", B, L = e.schema.type, H = Array.isArray(L);
  if (L && e.opts.nullable && e.schema.nullable === !0 && (H ? L.indexOf("null") == -1 && (L = L.concat("null")) : L != "null" && (L = [L, "null"], H = !0)), H && L.length == 1 && (L = L[0], H = !1), e.schema.$ref && o) {
    if (e.opts.extendRefs == "fail")
      throw new Error('$ref: validation keywords used in schema at path "' + e.errSchemaPath + '" (see option extendRefs)');
    e.opts.extendRefs !== !0 && (o = !1, e.logger.warn('$ref: keywords ignored in schema at path "' + e.errSchemaPath + '"'));
  }
  if (e.schema.$comment && e.opts.$comment && (n += " " + e.RULES.all.$comment.code(e, "$comment")), L) {
    if (e.opts.coerceTypes)
      var J = e.util.coerceToTypes(e.opts.coerceTypes, L);
    var q = e.RULES.types[L];
    if (J || H || q === !0 || q && !vt(q)) {
      var f = e.schemaPath + ".type", m = e.errSchemaPath + "/type", f = e.schemaPath + ".type", m = e.errSchemaPath + "/type", N = H ? "checkDataTypes" : "checkDataType";
      if (n += " if (" + e.util[N](L, p, e.opts.strictNumbers, !0) + ") { ", J) {
        var D = "dataType" + u, Q = "coerced" + u;
        n += " var " + D + " = typeof " + p + "; var " + Q + " = undefined; ", e.opts.coerceTypes == "array" && (n += " if (" + D + " == 'object' && Array.isArray(" + p + ") && " + p + ".length == 1) { " + p + " = " + p + "[0]; " + D + " = typeof " + p + "; if (" + e.util.checkDataType(e.schema.type, p, e.opts.strictNumbers) + ") " + Q + " = " + p + "; } "), n += " if (" + Q + " !== undefined) ; ";
        var ae = J;
        if (ae)
          for (var de, le = -1, ge = ae.length - 1; le < ge; )
            de = ae[le += 1], de == "string" ? n += " else if (" + D + " == 'number' || " + D + " == 'boolean') " + Q + " = '' + " + p + "; else if (" + p + " === null) " + Q + " = ''; " : de == "number" || de == "integer" ? (n += " else if (" + D + " == 'boolean' || " + p + " === null || (" + D + " == 'string' && " + p + " && " + p + " == +" + p + " ", de == "integer" && (n += " && !(" + p + " % 1)"), n += ")) " + Q + " = +" + p + "; ") : de == "boolean" ? n += " else if (" + p + " === 'false' || " + p + " === 0 || " + p + " === null) " + Q + " = false; else if (" + p + " === 'true' || " + p + " === 1) " + Q + " = true; " : de == "null" ? n += " else if (" + p + " === '' || " + p + " === 0 || " + p + " === false) " + Q + " = null; " : e.opts.coerceTypes == "array" && de == "array" && (n += " else if (" + D + " == 'string' || " + D + " == 'number' || " + D + " == 'boolean' || " + p + " == null) " + Q + " = [" + p + "]; ");
        n += " else {   ";
        var v = v || [];
        v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (B || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(m) + " , params: { type: '", H ? n += "" + L.join(",") : n += "" + L, n += "' } ", e.opts.messages !== !1 && (n += " , message: 'should be ", H ? n += "" + L.join(",") : n += "" + L, n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + f + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + p + " "), n += " } ") : n += " {} ";
        var y = n;
        n = v.pop(), !e.compositeRule && P ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } if (" + Q + " !== undefined) {  ";
        var se = d ? "data" + (d - 1 || "") : "parentData", je = d ? e.dataPathArr[d] : "parentDataProperty";
        n += " " + p + " = " + Q + "; ", d || (n += "if (" + se + " !== undefined)"), n += " " + se + "[" + je + "] = " + Q + "; } ";
      } else {
        var v = v || [];
        v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (B || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(m) + " , params: { type: '", H ? n += "" + L.join(",") : n += "" + L, n += "' } ", e.opts.messages !== !1 && (n += " , message: 'should be ", H ? n += "" + L.join(",") : n += "" + L, n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + f + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + p + " "), n += " } ") : n += " {} ";
        var y = n;
        n = v.pop(), !e.compositeRule && P ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      }
      n += " } ";
    }
  }
  if (e.schema.$ref && !o)
    n += " " + e.RULES.all.$ref.code(e, "$ref") + " ", P && (n += " } if (errors === ", b ? n += "0" : n += "errs_" + u, n += ") { ", k += "}");
  else {
    var Te = e.RULES;
    if (Te) {
      for (var q, j = -1, K = Te.length - 1; j < K; )
        if (q = Te[j += 1], vt(q)) {
          if (q.type && (n += " if (" + e.util.checkDataType(q.type, p, e.opts.strictNumbers) + ") { "), e.opts.useDefaults) {
            if (q.type == "object" && e.schema.properties) {
              var h = e.schema.properties, Ee = Object.keys(h), Ne = Ee;
              if (Ne)
                for (var we, Oe = -1, Be = Ne.length - 1; Oe < Be; ) {
                  we = Ne[Oe += 1];
                  var Pe = h[we];
                  if (Pe.default !== void 0) {
                    var Ie = p + e.util.getProperty(we);
                    if (e.compositeRule) {
                      if (e.opts.strictDefaults) {
                        var _ = "default is ignored for: " + Ie;
                        if (e.opts.strictDefaults === "log") e.logger.warn(_);
                        else throw new Error(_);
                      }
                    } else
                      n += " if (" + Ie + " === undefined ", e.opts.useDefaults == "empty" && (n += " || " + Ie + " === null || " + Ie + " === '' "), n += " ) " + Ie + " = ", e.opts.useDefaults == "shared" ? n += " " + e.useDefault(Pe.default) + " " : n += " " + JSON.stringify(Pe.default) + " ", n += "; ";
                  }
                }
            } else if (q.type == "array" && Array.isArray(e.schema.items)) {
              var At = e.schema.items;
              if (At) {
                for (var Pe, le = -1, mt = At.length - 1; le < mt; )
                  if (Pe = At[le += 1], Pe.default !== void 0) {
                    var Ie = p + "[" + le + "]";
                    if (e.compositeRule) {
                      if (e.opts.strictDefaults) {
                        var _ = "default is ignored for: " + Ie;
                        if (e.opts.strictDefaults === "log") e.logger.warn(_);
                        else throw new Error(_);
                      }
                    } else
                      n += " if (" + Ie + " === undefined ", e.opts.useDefaults == "empty" && (n += " || " + Ie + " === null || " + Ie + " === '' "), n += " ) " + Ie + " = ", e.opts.useDefaults == "shared" ? n += " " + e.useDefault(Pe.default) + " " : n += " " + JSON.stringify(Pe.default) + " ", n += "; ";
                  }
              }
            }
          }
          var Ke = q.rules;
          if (Ke) {
            for (var Ir, Et = -1, dn = Ke.length - 1; Et < dn; )
              if (Ir = Ke[Et += 1], Rr(Ir)) {
                var Jr = Ir.code(e, Ir.keyword, q.type);
                Jr && (n += " " + Jr + " ", P && (A += "}"));
              }
          }
          if (P && (n += " " + A + " ", A = ""), q.type && (n += " } ", L && L === q.type && !J)) {
            n += " else { ";
            var f = e.schemaPath + ".type", m = e.errSchemaPath + "/type", v = v || [];
            v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (B || "type") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(m) + " , params: { type: '", H ? n += "" + L.join(",") : n += "" + L, n += "' } ", e.opts.messages !== !1 && (n += " , message: 'should be ", H ? n += "" + L.join(",") : n += "" + L, n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + f + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + p + " "), n += " } ") : n += " {} ";
            var y = n;
            n = v.pop(), !e.compositeRule && P ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } ";
          }
          P && (n += " if (errors === ", b ? n += "0" : n += "errs_" + u, n += ") { ", k += "}");
        }
    }
  }
  P && (n += " " + k + " "), b ? (s ? (n += " if (errors === 0) return data;           ", n += " else throw new ValidationError(vErrors); ") : (n += " validate.errors = vErrors; ", n += " return errors === 0;       "), n += " }; return validate;") : n += " var " + E + " = errors === errs_" + u + ";";
  function vt(lt) {
    for (var ct = lt.rules, Ot = 0; Ot < ct.length; Ot++)
      if (Rr(ct[Ot])) return !0;
  }
  function Rr(lt) {
    return e.schema[lt.keyword] !== void 0 || lt.implements && Un(lt);
  }
  function Un(lt) {
    for (var ct = lt.implements, Ot = 0; Ot < ct.length; Ot++)
      if (e.schema[ct[Ot]] !== void 0) return !0;
  }
  return n;
}, Oa = zl, vs = Bn, Ef = ql, R1 = bf, _u = wf, T1 = vs.ucs2length, A1 = Ml, O1 = Ef.Validation, D1 = Oi;
function Oi(t, e, r, a) {
  var n = this, s = this._opts, o = [void 0], i = {}, l = [], c = {}, u = [], d = {}, h = [];
  e = e || { schema: t, refVal: o, refs: i };
  var f = L1.call(this, t, e, a), m = this._compilations[f.index];
  if (f.compiling) return m.callValidate = _;
  var p = this._formats, v = this.RULES;
  try {
    var y = E(t, e, r, a);
    m.validate = y;
    var b = m.callValidate;
    return b && (b.schema = y.schema, b.errors = null, b.refs = y.refs, b.refVal = y.refVal, b.root = y.root, b.$async = y.$async, s.sourceCode && (b.source = y.source)), y;
  } finally {
    N1.call(this, t, e, a);
  }
  function _() {
    var N = m.validate, D = N.apply(this, arguments);
    return _.errors = N.errors, D;
  }
  function E(N, D, Q, ae) {
    var de = !D || D && D.schema == N;
    if (D.schema != e.schema)
      return Oi.call(n, N, D, Q, ae);
    var le = N.$async === !0, ge = _u({
      isTop: !0,
      schema: N,
      isRoot: de,
      baseId: ae,
      root: D,
      schemaPath: "",
      errSchemaPath: "#",
      errorPath: '""',
      MissingRefError: Ef.MissingRef,
      RULES: v,
      validate: _u,
      util: vs,
      resolve: Oa,
      resolveRef: P,
      usePattern: H,
      useDefault: J,
      useCustomRule: q,
      opts: s,
      formats: p,
      logger: n.logger,
      self: n
    });
    ge = Da(o, F1) + Da(l, $1) + Da(u, M1) + Da(h, j1) + ge, s.processCode && (ge = s.processCode(ge, N));
    var se;
    try {
      var je = new Function(
        "self",
        "RULES",
        "formats",
        "root",
        "refVal",
        "defaults",
        "customRules",
        "equal",
        "ucs2length",
        "ValidationError",
        ge
      );
      se = je(
        n,
        v,
        p,
        e,
        o,
        u,
        h,
        A1,
        T1,
        O1
      ), o[0] = se;
    } catch (Te) {
      throw n.logger.error("Error compiling schema, function code:", ge), Te;
    }
    return se.schema = N, se.errors = null, se.refs = i, se.refVal = o, se.root = de ? se : D, le && (se.$async = !0), s.sourceCode === !0 && (se.source = {
      code: ge,
      patterns: l,
      defaults: u
    }), se;
  }
  function P(N, D, Q) {
    D = Oa.url(N, D);
    var ae = i[D], de, le;
    if (ae !== void 0)
      return de = o[ae], le = "refVal[" + ae + "]", L(de, le);
    if (!Q && e.refs) {
      var ge = e.refs[D];
      if (ge !== void 0)
        return de = e.refVal[ge], le = A(D, de), L(de, le);
    }
    le = A(D);
    var se = Oa.call(n, E, e, D);
    if (se === void 0) {
      var je = r && r[D];
      je && (se = Oa.inlineRef(je, s.inlineRefs) ? je : Oi.call(n, je, e, r, N));
    }
    if (se === void 0)
      k(D);
    else
      return B(D, se), L(se, le);
  }
  function A(N, D) {
    var Q = o.length;
    return o[Q] = D, i[N] = Q, "refVal" + Q;
  }
  function k(N) {
    delete i[N];
  }
  function B(N, D) {
    var Q = i[N];
    o[Q] = D;
  }
  function L(N, D) {
    return typeof N == "object" || typeof N == "boolean" ? { code: D, schema: N, inline: !0 } : { code: D, $async: N && !!N.$async };
  }
  function H(N) {
    var D = c[N];
    return D === void 0 && (D = c[N] = l.length, l[D] = N), "pattern" + D;
  }
  function J(N) {
    switch (typeof N) {
      case "boolean":
      case "number":
        return "" + N;
      case "string":
        return vs.toQuotedString(N);
      case "object":
        if (N === null) return "null";
        var D = R1(N), Q = d[D];
        return Q === void 0 && (Q = d[D] = u.length, u[Q] = N), "default" + Q;
    }
  }
  function q(N, D, Q, ae) {
    if (n._opts.validateSchema !== !1) {
      var de = N.definition.dependencies;
      if (de && !de.every(function(Ne) {
        return Object.prototype.hasOwnProperty.call(Q, Ne);
      }))
        throw new Error("parent schema must have all required keywords: " + de.join(","));
      var le = N.definition.validateSchema;
      if (le) {
        var ge = le(D);
        if (!ge) {
          var se = "keyword schema is invalid: " + n.errorsText(le.errors);
          if (n._opts.validateSchema == "log") n.logger.error(se);
          else throw new Error(se);
        }
      }
    }
    var je = N.definition.compile, Te = N.definition.inline, j = N.definition.macro, K;
    if (je)
      K = je.call(n, D, Q, ae);
    else if (j)
      K = j.call(n, D, Q, ae), s.validateSchema !== !1 && n.validateSchema(K, !0);
    else if (Te)
      K = Te.call(n, ae, N.keyword, D, Q);
    else if (K = N.definition.validate, !K) return;
    if (K === void 0)
      throw new Error('custom keyword "' + N.keyword + '"failed to compile');
    var Ee = h.length;
    return h[Ee] = K, {
      code: "customRule" + Ee,
      validate: K
    };
  }
}
function L1(t, e, r) {
  var a = Sf.call(this, t, e, r);
  return a >= 0 ? { index: a, compiling: !0 } : (a = this._compilations.length, this._compilations[a] = {
    schema: t,
    root: e,
    baseId: r
  }, { index: a, compiling: !1 });
}
function N1(t, e, r) {
  var a = Sf.call(this, t, e, r);
  a >= 0 && this._compilations.splice(a, 1);
}
function Sf(t, e, r) {
  for (var a = 0; a < this._compilations.length; a++) {
    var n = this._compilations[a];
    if (n.schema == t && n.root == e && n.baseId == r) return a;
  }
  return -1;
}
function $1(t, e) {
  return "var pattern" + t + " = new RegExp(" + vs.toQuotedString(e[t]) + ");";
}
function M1(t) {
  return "var default" + t + " = defaults[" + t + "];";
}
function F1(t, e) {
  return e[t] === void 0 ? "" : "var refVal" + t + " = refVal[" + t + "];";
}
function j1(t) {
  return "var customRule" + t + " = customRules[" + t + "];";
}
function Da(t, e) {
  if (!t.length) return "";
  for (var r = "", a = 0; a < t.length; a++)
    r += e(a, t);
  return r;
}
var Pf = { exports: {} }, ro = Pf.exports = function() {
  this._cache = {};
};
ro.prototype.put = function(e, r) {
  this._cache[e] = r;
};
ro.prototype.get = function(e) {
  return this._cache[e];
};
ro.prototype.del = function(e) {
  delete this._cache[e];
};
ro.prototype.clear = function() {
  this._cache = {};
};
var B1 = Pf.exports, U1 = Bn, V1 = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, z1 = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], q1 = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i, xf = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i, H1 = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, Z1 = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i, Cf = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i, kf = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i, If = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i, Rf = /^(?:\/(?:[^~/]|~0|~1)*)*$/, Tf = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i, Af = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/, W1 = no;
function no(t) {
  return t = t == "full" ? "full" : "fast", U1.copy(no[t]);
}
no.fast = {
  // date: http://tools.ietf.org/html/rfc3339#section-5.6
  date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
  // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
  time: /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
  "date-time": /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
  // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
  uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
  "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
  "uri-template": Cf,
  url: kf,
  // email (sources from jsen validator):
  // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
  // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
  email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  hostname: xf,
  // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: Lf,
  // uuid: http://tools.ietf.org/html/rfc4122
  uuid: If,
  // JSON-pointer: https://tools.ietf.org/html/rfc6901
  // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
  "json-pointer": Rf,
  "json-pointer-uri-fragment": Tf,
  // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
  "relative-json-pointer": Af
};
no.full = {
  date: Of,
  time: Df,
  "date-time": G1,
  uri: Y1,
  "uri-reference": Z1,
  "uri-template": Cf,
  url: kf,
  email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  hostname: xf,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: Lf,
  uuid: If,
  "json-pointer": Rf,
  "json-pointer-uri-fragment": Tf,
  "relative-json-pointer": Af
};
function J1(t) {
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
}
function Of(t) {
  var e = t.match(V1);
  if (!e) return !1;
  var r = +e[1], a = +e[2], n = +e[3];
  return a >= 1 && a <= 12 && n >= 1 && n <= (a == 2 && J1(r) ? 29 : z1[a]);
}
function Df(t, e) {
  var r = t.match(q1);
  if (!r) return !1;
  var a = r[1], n = r[2], s = r[3], o = r[5];
  return (a <= 23 && n <= 59 && s <= 59 || a == 23 && n == 59 && s == 60) && (!e || o);
}
var Q1 = /t|\s/i;
function G1(t) {
  var e = t.split(Q1);
  return e.length == 2 && Of(e[0]) && Df(e[1], !0);
}
var K1 = /\/|:/;
function Y1(t) {
  return K1.test(t) && H1.test(t);
}
var X1 = /[^\\]\\Z/;
function Lf(t) {
  if (X1.test(t)) return !1;
  try {
    return new RegExp(t), !0;
  } catch {
    return !1;
  }
}
var eE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.errSchemaPath + "/" + r, c = !e.opts.allErrors, u = "data" + (o || ""), d = "valid" + s, h, f;
  if (i == "#" || i == "#/")
    e.isRoot ? (h = e.async, f = "validate") : (h = e.root.schema.$async === !0, f = "root.refVal[0]");
  else {
    var m = e.resolveRef(e.baseId, i, e.isRoot);
    if (m === void 0) {
      var p = e.MissingRefError.message(e.baseId, i);
      if (e.opts.missingRefs == "fail") {
        e.logger.error(p);
        var v = v || [];
        v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '$ref' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(l) + " , params: { ref: '" + e.util.escapeQuotes(i) + "' } ", e.opts.messages !== !1 && (n += " , message: 'can\\'t resolve reference " + e.util.escapeQuotes(i) + "' "), e.opts.verbose && (n += " , schema: " + e.util.toQuotedString(i) + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + u + " "), n += " } ") : n += " {} ";
        var y = n;
        n = v.pop(), !e.compositeRule && c ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", c && (n += " if (false) { ");
      } else if (e.opts.missingRefs == "ignore")
        e.logger.warn(p), c && (n += " if (true) { ");
      else
        throw new e.MissingRefError(e.baseId, i, p);
    } else if (m.inline) {
      var b = e.util.copy(e);
      b.level++;
      var _ = "valid" + b.level;
      b.schema = m.schema, b.schemaPath = "", b.errSchemaPath = i;
      var E = e.validate(b).replace(/validate\.schema/g, m.code);
      n += " " + E + " ", c && (n += " if (" + _ + ") { ");
    } else
      h = m.$async === !0 || e.async && m.$async !== !1, f = m.code;
  }
  if (f) {
    var v = v || [];
    v.push(n), n = "", e.opts.passContext ? n += " " + f + ".call(this, " : n += " " + f + "( ", n += " " + u + ", (dataPath || '')", e.errorPath != '""' && (n += " + " + e.errorPath);
    var P = o ? "data" + (o - 1 || "") : "parentData", A = o ? e.dataPathArr[o] : "parentDataProperty";
    n += " , " + P + " , " + A + ", rootData)  ";
    var k = n;
    if (n = v.pop(), h) {
      if (!e.async) throw new Error("async schema referenced by sync schema");
      c && (n += " var " + d + "; "), n += " try { await " + k + "; ", c && (n += " " + d + " = true; "), n += " } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ", c && (n += " " + d + " = false; "), n += " } ", c && (n += " if (" + d + ") { ");
    } else
      n += " if (!" + k + ") { if (vErrors === null) vErrors = " + f + ".errors; else vErrors = vErrors.concat(" + f + ".errors); errors = vErrors.length; } ", c && (n += " else { ");
  }
  return n;
}, tE = function(e, r, a) {
  var n = " ", s = e.schema[r], o = e.schemaPath + e.util.getProperty(r), i = e.errSchemaPath + "/" + r, l = !e.opts.allErrors, c = e.util.copy(e), u = "";
  c.level++;
  var d = "valid" + c.level, h = c.baseId, f = !0, m = s;
  if (m)
    for (var p, v = -1, y = m.length - 1; v < y; )
      p = m[v += 1], (e.opts.strictKeywords ? typeof p == "object" && Object.keys(p).length > 0 || p === !1 : e.util.schemaHasRules(p, e.RULES.all)) && (f = !1, c.schema = p, c.schemaPath = o + "[" + v + "]", c.errSchemaPath = i + "/" + v, n += "  " + e.validate(c) + " ", c.baseId = h, l && (n += " if (" + d + ") { ", u += "}"));
  return l && (f ? n += " if (true) { " : n += " " + u.slice(0, -1) + " "), n;
}, rE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = "errs__" + s, m = e.util.copy(e), p = "";
  m.level++;
  var v = "valid" + m.level, y = i.every(function(B) {
    return e.opts.strictKeywords ? typeof B == "object" && Object.keys(B).length > 0 || B === !1 : e.util.schemaHasRules(B, e.RULES.all);
  });
  if (y) {
    var b = m.baseId;
    n += " var " + f + " = errors; var " + h + " = false;  ";
    var _ = e.compositeRule;
    e.compositeRule = m.compositeRule = !0;
    var E = i;
    if (E)
      for (var P, A = -1, k = E.length - 1; A < k; )
        P = E[A += 1], m.schema = P, m.schemaPath = l + "[" + A + "]", m.errSchemaPath = c + "/" + A, n += "  " + e.validate(m) + " ", m.baseId = b, n += " " + h + " = " + h + " || " + v + "; if (!" + h + ") { ", p += "}";
    e.compositeRule = m.compositeRule = _, n += " " + p + " if (!" + h + ") {   var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'anyOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: {} ", e.opts.messages !== !1 && (n += " , message: 'should match some schema in anyOf' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? n += " throw new ValidationError(vErrors); " : n += " validate.errors = vErrors; return false; "), n += " } else {  errors = " + f + "; if (vErrors !== null) { if (" + f + ") vErrors.length = " + f + "; else vErrors = null; } ", e.opts.allErrors && (n += " } ");
  } else
    u && (n += " if (true) { ");
  return n;
}, nE = function(e, r, a) {
  var n = " ", s = e.schema[r], o = e.errSchemaPath + "/" + r;
  e.opts.allErrors;
  var i = e.util.toQuotedString(s);
  return e.opts.$comment === !0 ? n += " console.log(" + i + ");" : typeof e.opts.$comment == "function" && (n += " self._opts.$comment(" + i + ", " + e.util.toQuotedString(o) + ", validate.root.schema);"), n;
}, aE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = e.opts.$data && i && i.$data;
  f && (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; "), f || (n += " var schema" + s + " = validate.schema" + l + ";"), n += "var " + h + " = equal(" + d + ", schema" + s + "); if (!" + h + ") {   ";
  var m = m || [];
  m.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'const' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { allowedValue: schema" + s + " } ", e.opts.messages !== !1 && (n += " , message: 'should be equal to constant' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var p = n;
  return n = m.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + p + "]); " : n += " validate.errors = [" + p + "]; return false; " : n += " var err = " + p + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " }", u && (n += " else { "), n;
}, sE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = "errs__" + s, m = e.util.copy(e), p = "";
  m.level++;
  var v = "valid" + m.level, y = "i" + s, b = m.dataLevel = e.dataLevel + 1, _ = "data" + b, E = e.baseId, P = e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all);
  if (n += "var " + f + " = errors;var " + h + ";", P) {
    var A = e.compositeRule;
    e.compositeRule = m.compositeRule = !0, m.schema = i, m.schemaPath = l, m.errSchemaPath = c, n += " var " + v + " = false; for (var " + y + " = 0; " + y + " < " + d + ".length; " + y + "++) { ", m.errorPath = e.util.getPathExpr(e.errorPath, y, e.opts.jsonPointers, !0);
    var k = d + "[" + y + "]";
    m.dataPathArr[b] = y;
    var B = e.validate(m);
    m.baseId = E, e.util.varOccurences(B, _) < 2 ? n += " " + e.util.varReplace(B, _, k) + " " : n += " var " + _ + " = " + k + "; " + B + " ", n += " if (" + v + ") break; }  ", e.compositeRule = m.compositeRule = A, n += " " + p + " if (!" + v + ") {";
  } else
    n += " if (" + d + ".length == 0) {";
  var L = L || [];
  L.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'contains' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: {} ", e.opts.messages !== !1 && (n += " , message: 'should contain a valid item' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var H = n;
  return n = L.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + H + "]); " : n += " validate.errors = [" + H + "]; return false; " : n += " var err = " + H + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } else { ", P && (n += "  errors = " + f + "; if (vErrors !== null) { if (" + f + ") vErrors.length = " + f + "; else vErrors = null; } "), e.opts.allErrors && (n += " } "), n;
}, oE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "errs__" + s, f = e.util.copy(e), m = "";
  f.level++;
  var p = "valid" + f.level, v = {}, y = {}, b = e.opts.ownProperties;
  for (A in i)
    if (A != "__proto__") {
      var _ = i[A], E = Array.isArray(_) ? y : v;
      E[A] = _;
    }
  n += "var " + h + " = errors;";
  var P = e.errorPath;
  n += "var missing" + s + ";";
  for (var A in y)
    if (E = y[A], E.length) {
      if (n += " if ( " + d + e.util.getProperty(A) + " !== undefined ", b && (n += " && Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(A) + "') "), u) {
        n += " && ( ";
        var k = E;
        if (k)
          for (var B, L = -1, H = k.length - 1; L < H; ) {
            B = k[L += 1], L && (n += " || ");
            var J = e.util.getProperty(B), q = d + J;
            n += " ( ( " + q + " === undefined ", b && (n += " || ! Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(B) + "') "), n += ") && (missing" + s + " = " + e.util.toQuotedString(e.opts.jsonPointers ? B : J) + ") ) ";
          }
        n += ")) {  ";
        var N = "missing" + s, D = "' + " + N + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(P, N, !0) : P + " + " + N);
        var Q = Q || [];
        Q.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { property: '" + e.util.escapeQuotes(A) + "', missingProperty: '" + D + "', depsCount: " + E.length + ", deps: '" + e.util.escapeQuotes(E.length == 1 ? E[0] : E.join(", ")) + "' } ", e.opts.messages !== !1 && (n += " , message: 'should have ", E.length == 1 ? n += "property " + e.util.escapeQuotes(E[0]) : n += "properties " + e.util.escapeQuotes(E.join(", ")), n += " when property " + e.util.escapeQuotes(A) + " is present' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
        var ae = n;
        n = Q.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + ae + "]); " : n += " validate.errors = [" + ae + "]; return false; " : n += " var err = " + ae + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
      } else {
        n += " ) { ";
        var de = E;
        if (de)
          for (var B, le = -1, ge = de.length - 1; le < ge; ) {
            B = de[le += 1];
            var J = e.util.getProperty(B), D = e.util.escapeQuotes(B), q = d + J;
            e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(P, B, e.opts.jsonPointers)), n += " if ( " + q + " === undefined ", b && (n += " || ! Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(B) + "') "), n += ") {  var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { property: '" + e.util.escapeQuotes(A) + "', missingProperty: '" + D + "', depsCount: " + E.length + ", deps: '" + e.util.escapeQuotes(E.length == 1 ? E[0] : E.join(", ")) + "' } ", e.opts.messages !== !1 && (n += " , message: 'should have ", E.length == 1 ? n += "property " + e.util.escapeQuotes(E[0]) : n += "properties " + e.util.escapeQuotes(E.join(", ")), n += " when property " + e.util.escapeQuotes(A) + " is present' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
          }
      }
      n += " }   ", u && (m += "}", n += " else { ");
    }
  e.errorPath = P;
  var se = f.baseId;
  for (var A in v) {
    var _ = v[A];
    (e.opts.strictKeywords ? typeof _ == "object" && Object.keys(_).length > 0 || _ === !1 : e.util.schemaHasRules(_, e.RULES.all)) && (n += " " + p + " = true; if ( " + d + e.util.getProperty(A) + " !== undefined ", b && (n += " && Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(A) + "') "), n += ") { ", f.schema = _, f.schemaPath = l + e.util.getProperty(A), f.errSchemaPath = c + "/" + e.util.escapeFragment(A), n += "  " + e.validate(f) + " ", f.baseId = se, n += " }  ", u && (n += " if (" + p + ") { ", m += "}"));
  }
  return u && (n += "   " + m + " if (" + h + " == errors) {"), n;
}, iE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = e.opts.$data && i && i.$data;
  f && (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ");
  var m = "i" + s, p = "schema" + s;
  f || (n += " var " + p + " = validate.schema" + l + ";"), n += "var " + h + ";", f && (n += " if (schema" + s + " === undefined) " + h + " = true; else if (!Array.isArray(schema" + s + ")) " + h + " = false; else {"), n += "" + h + " = false;for (var " + m + "=0; " + m + "<" + p + ".length; " + m + "++) if (equal(" + d + ", " + p + "[" + m + "])) { " + h + " = true; break; }", f && (n += "  }  "), n += " if (!" + h + ") {   ";
  var v = v || [];
  v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'enum' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { allowedValues: schema" + s + " } ", e.opts.messages !== !1 && (n += " , message: 'should be equal to one of the allowed values' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var y = n;
  return n = v.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " }", u && (n += " else { "), n;
}, lE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || "");
  if (e.opts.format === !1)
    return u && (n += " if (true) { "), n;
  var h = e.opts.$data && i && i.$data, f;
  h ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", f = "schema" + s) : f = i;
  var m = e.opts.unknownFormats, p = Array.isArray(m);
  if (h) {
    var v = "format" + s, y = "isObject" + s, b = "formatType" + s;
    n += " var " + v + " = formats[" + f + "]; var " + y + " = typeof " + v + " == 'object' && !(" + v + " instanceof RegExp) && " + v + ".validate; var " + b + " = " + y + " && " + v + ".type || 'string'; if (" + y + ") { ", e.async && (n += " var async" + s + " = " + v + ".async; "), n += " " + v + " = " + v + ".validate; } if (  ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'string') || "), n += " (", m != "ignore" && (n += " (" + f + " && !" + v + " ", p && (n += " && self._opts.unknownFormats.indexOf(" + f + ") == -1 "), n += ") || "), n += " (" + v + " && " + b + " == '" + a + "' && !(typeof " + v + " == 'function' ? ", e.async ? n += " (async" + s + " ? await " + v + "(" + d + ") : " + v + "(" + d + ")) " : n += " " + v + "(" + d + ") ", n += " : " + v + ".test(" + d + "))))) {";
  } else {
    var v = e.formats[i];
    if (!v) {
      if (m == "ignore")
        return e.logger.warn('unknown format "' + i + '" ignored in schema at path "' + e.errSchemaPath + '"'), u && (n += " if (true) { "), n;
      if (p && m.indexOf(i) >= 0)
        return u && (n += " if (true) { "), n;
      throw new Error('unknown format "' + i + '" is used in schema at path "' + e.errSchemaPath + '"');
    }
    var y = typeof v == "object" && !(v instanceof RegExp) && v.validate, b = y && v.type || "string";
    if (y) {
      var _ = v.async === !0;
      v = v.validate;
    }
    if (b != a)
      return u && (n += " if (true) { "), n;
    if (_) {
      if (!e.async) throw new Error("async format in sync schema");
      var E = "formats" + e.util.getProperty(i) + ".validate";
      n += " if (!(await " + E + "(" + d + "))) { ";
    } else {
      n += " if (! ";
      var E = "formats" + e.util.getProperty(i);
      y && (E += ".validate"), typeof v == "function" ? n += " " + E + "(" + d + ") " : n += " " + E + ".test(" + d + ") ", n += ") { ";
    }
  }
  var P = P || [];
  P.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'format' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { format:  ", h ? n += "" + f : n += "" + e.util.toQuotedString(i), n += "  } ", e.opts.messages !== !1 && (n += ` , message: 'should match format "`, h ? n += "' + " + f + " + '" : n += "" + e.util.escapeQuotes(i), n += `"' `), e.opts.verbose && (n += " , schema:  ", h ? n += "validate.schema" + l : n += "" + e.util.toQuotedString(i), n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var A = n;
  return n = P.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + A + "]); " : n += " validate.errors = [" + A + "]; return false; " : n += " var err = " + A + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } ", u && (n += " else { "), n;
}, cE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = "errs__" + s, m = e.util.copy(e);
  m.level++;
  var p = "valid" + m.level, v = e.schema.then, y = e.schema.else, b = v !== void 0 && (e.opts.strictKeywords ? typeof v == "object" && Object.keys(v).length > 0 || v === !1 : e.util.schemaHasRules(v, e.RULES.all)), _ = y !== void 0 && (e.opts.strictKeywords ? typeof y == "object" && Object.keys(y).length > 0 || y === !1 : e.util.schemaHasRules(y, e.RULES.all)), E = m.baseId;
  if (b || _) {
    var P;
    m.createErrors = !1, m.schema = i, m.schemaPath = l, m.errSchemaPath = c, n += " var " + f + " = errors; var " + h + " = true;  ";
    var A = e.compositeRule;
    e.compositeRule = m.compositeRule = !0, n += "  " + e.validate(m) + " ", m.baseId = E, m.createErrors = !0, n += "  errors = " + f + "; if (vErrors !== null) { if (" + f + ") vErrors.length = " + f + "; else vErrors = null; }  ", e.compositeRule = m.compositeRule = A, b ? (n += " if (" + p + ") {  ", m.schema = e.schema.then, m.schemaPath = e.schemaPath + ".then", m.errSchemaPath = e.errSchemaPath + "/then", n += "  " + e.validate(m) + " ", m.baseId = E, n += " " + h + " = " + p + "; ", b && _ ? (P = "ifClause" + s, n += " var " + P + " = 'then'; ") : P = "'then'", n += " } ", _ && (n += " else { ")) : n += " if (!" + p + ") { ", _ && (m.schema = e.schema.else, m.schemaPath = e.schemaPath + ".else", m.errSchemaPath = e.errSchemaPath + "/else", n += "  " + e.validate(m) + " ", m.baseId = E, n += " " + h + " = " + p + "; ", b && _ ? (P = "ifClause" + s, n += " var " + P + " = 'else'; ") : P = "'else'", n += " } "), n += " if (!" + h + ") {   var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'if' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { failingKeyword: " + P + " } ", e.opts.messages !== !1 && (n += ` , message: 'should match "' + ` + P + ` + '" schema' `), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? n += " throw new ValidationError(vErrors); " : n += " validate.errors = vErrors; return false; "), n += " }   ", u && (n += " else { ");
  } else
    u && (n += " if (true) { ");
  return n;
}, uE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = "errs__" + s, m = e.util.copy(e), p = "";
  m.level++;
  var v = "valid" + m.level, y = "i" + s, b = m.dataLevel = e.dataLevel + 1, _ = "data" + b, E = e.baseId;
  if (n += "var " + f + " = errors;var " + h + ";", Array.isArray(i)) {
    var P = e.schema.additionalItems;
    if (P === !1) {
      n += " " + h + " = " + d + ".length <= " + i.length + "; ";
      var A = c;
      c = e.errSchemaPath + "/additionalItems", n += "  if (!" + h + ") {   ";
      var k = k || [];
      k.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'additionalItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { limit: " + i.length + " } ", e.opts.messages !== !1 && (n += " , message: 'should NOT have more than " + i.length + " items' "), e.opts.verbose && (n += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
      var B = n;
      n = k.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + B + "]); " : n += " validate.errors = [" + B + "]; return false; " : n += " var err = " + B + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } ", c = A, u && (p += "}", n += " else { ");
    }
    var L = i;
    if (L) {
      for (var H, J = -1, q = L.length - 1; J < q; )
        if (H = L[J += 1], e.opts.strictKeywords ? typeof H == "object" && Object.keys(H).length > 0 || H === !1 : e.util.schemaHasRules(H, e.RULES.all)) {
          n += " " + v + " = true; if (" + d + ".length > " + J + ") { ";
          var N = d + "[" + J + "]";
          m.schema = H, m.schemaPath = l + "[" + J + "]", m.errSchemaPath = c + "/" + J, m.errorPath = e.util.getPathExpr(e.errorPath, J, e.opts.jsonPointers, !0), m.dataPathArr[b] = J;
          var D = e.validate(m);
          m.baseId = E, e.util.varOccurences(D, _) < 2 ? n += " " + e.util.varReplace(D, _, N) + " " : n += " var " + _ + " = " + N + "; " + D + " ", n += " }  ", u && (n += " if (" + v + ") { ", p += "}");
        }
    }
    if (typeof P == "object" && (e.opts.strictKeywords ? typeof P == "object" && Object.keys(P).length > 0 || P === !1 : e.util.schemaHasRules(P, e.RULES.all))) {
      m.schema = P, m.schemaPath = e.schemaPath + ".additionalItems", m.errSchemaPath = e.errSchemaPath + "/additionalItems", n += " " + v + " = true; if (" + d + ".length > " + i.length + ") {  for (var " + y + " = " + i.length + "; " + y + " < " + d + ".length; " + y + "++) { ", m.errorPath = e.util.getPathExpr(e.errorPath, y, e.opts.jsonPointers, !0);
      var N = d + "[" + y + "]";
      m.dataPathArr[b] = y;
      var D = e.validate(m);
      m.baseId = E, e.util.varOccurences(D, _) < 2 ? n += " " + e.util.varReplace(D, _, N) + " " : n += " var " + _ + " = " + N + "; " + D + " ", u && (n += " if (!" + v + ") break; "), n += " } }  ", u && (n += " if (" + v + ") { ", p += "}");
    }
  } else if (e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all)) {
    m.schema = i, m.schemaPath = l, m.errSchemaPath = c, n += "  for (var " + y + " = 0; " + y + " < " + d + ".length; " + y + "++) { ", m.errorPath = e.util.getPathExpr(e.errorPath, y, e.opts.jsonPointers, !0);
    var N = d + "[" + y + "]";
    m.dataPathArr[b] = y;
    var D = e.validate(m);
    m.baseId = E, e.util.varOccurences(D, _) < 2 ? n += " " + e.util.varReplace(D, _, N) + " " : n += " var " + _ + " = " + N + "; " + D + " ", u && (n += " if (!" + v + ") break; "), n += " }";
  }
  return u && (n += " " + p + " if (" + f + " == errors) {"), n;
}, yu = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, E, d = "data" + (o || ""), h = e.opts.$data && i && i.$data, f;
  h ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", f = "schema" + s) : f = i;
  var m = r == "maximum", p = m ? "exclusiveMaximum" : "exclusiveMinimum", v = e.schema[p], y = e.opts.$data && v && v.$data, b = m ? "<" : ">", _ = m ? ">" : "<", E = void 0;
  if (!(h || typeof i == "number" || i === void 0))
    throw new Error(r + " must be number");
  if (!(y || v === void 0 || typeof v == "number" || typeof v == "boolean"))
    throw new Error(p + " must be number or boolean");
  if (y) {
    var P = e.util.getData(v.$data, o, e.dataPathArr), A = "exclusive" + s, k = "exclType" + s, B = "exclIsNumber" + s, L = "op" + s, H = "' + " + L + " + '";
    n += " var schemaExcl" + s + " = " + P + "; ", P = "schemaExcl" + s, n += " var " + A + "; var " + k + " = typeof " + P + "; if (" + k + " != 'boolean' && " + k + " != 'undefined' && " + k + " != 'number') { ";
    var E = p, J = J || [];
    J.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (E || "_exclusiveLimit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: {} ", e.opts.messages !== !1 && (n += " , message: '" + p + " should be boolean' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
    var q = n;
    n = J.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + q + "]); " : n += " validate.errors = [" + q + "]; return false; " : n += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } else if ( ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'number') || "), n += " " + k + " == 'number' ? ( (" + A + " = " + f + " === undefined || " + P + " " + b + "= " + f + ") ? " + d + " " + _ + "= " + P + " : " + d + " " + _ + " " + f + " ) : ( (" + A + " = " + P + " === true) ? " + d + " " + _ + "= " + f + " : " + d + " " + _ + " " + f + " ) || " + d + " !== " + d + ") { var op" + s + " = " + A + " ? '" + b + "' : '" + b + "='; ", i === void 0 && (E = p, c = e.errSchemaPath + "/" + p, f = P, h = y);
  } else {
    var B = typeof v == "number", H = b;
    if (B && h) {
      var L = "'" + H + "'";
      n += " if ( ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'number') || "), n += " ( " + f + " === undefined || " + v + " " + b + "= " + f + " ? " + d + " " + _ + "= " + v + " : " + d + " " + _ + " " + f + " ) || " + d + " !== " + d + ") { ";
    } else {
      B && i === void 0 ? (A = !0, E = p, c = e.errSchemaPath + "/" + p, f = v, _ += "=") : (B && (f = Math[m ? "min" : "max"](v, i)), v === (B ? f : !0) ? (A = !0, E = p, c = e.errSchemaPath + "/" + p, _ += "=") : (A = !1, H += "="));
      var L = "'" + H + "'";
      n += " if ( ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'number') || "), n += " " + d + " " + _ + " " + f + " || " + d + " !== " + d + ") { ";
    }
  }
  E = E || r;
  var J = J || [];
  J.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (E || "_limit") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { comparison: " + L + ", limit: " + f + ", exclusive: " + A + " } ", e.opts.messages !== !1 && (n += " , message: 'should be " + H + " ", h ? n += "' + " + f : n += "" + f + "'"), e.opts.verbose && (n += " , schema:  ", h ? n += "validate.schema" + l : n += "" + i, n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var q = n;
  return n = J.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + q + "]); " : n += " validate.errors = [" + q + "]; return false; " : n += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } ", u && (n += " else { "), n;
}, bu = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, p, d = "data" + (o || ""), h = e.opts.$data && i && i.$data, f;
  if (h ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", f = "schema" + s) : f = i, !(h || typeof i == "number"))
    throw new Error(r + " must be number");
  var m = r == "maxItems" ? ">" : "<";
  n += "if ( ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'number') || "), n += " " + d + ".length " + m + " " + f + ") { ";
  var p = r, v = v || [];
  v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (p || "_limitItems") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { limit: " + f + " } ", e.opts.messages !== !1 && (n += " , message: 'should NOT have ", r == "maxItems" ? n += "more" : n += "fewer", n += " than ", h ? n += "' + " + f + " + '" : n += "" + i, n += " items' "), e.opts.verbose && (n += " , schema:  ", h ? n += "validate.schema" + l : n += "" + i, n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var y = n;
  return n = v.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += "} ", u && (n += " else { "), n;
}, wu = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, p, d = "data" + (o || ""), h = e.opts.$data && i && i.$data, f;
  if (h ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", f = "schema" + s) : f = i, !(h || typeof i == "number"))
    throw new Error(r + " must be number");
  var m = r == "maxLength" ? ">" : "<";
  n += "if ( ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'number') || "), e.opts.unicode === !1 ? n += " " + d + ".length " : n += " ucs2length(" + d + ") ", n += " " + m + " " + f + ") { ";
  var p = r, v = v || [];
  v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (p || "_limitLength") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { limit: " + f + " } ", e.opts.messages !== !1 && (n += " , message: 'should NOT be ", r == "maxLength" ? n += "longer" : n += "shorter", n += " than ", h ? n += "' + " + f + " + '" : n += "" + i, n += " characters' "), e.opts.verbose && (n += " , schema:  ", h ? n += "validate.schema" + l : n += "" + i, n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var y = n;
  return n = v.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += "} ", u && (n += " else { "), n;
}, Eu = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, p, d = "data" + (o || ""), h = e.opts.$data && i && i.$data, f;
  if (h ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", f = "schema" + s) : f = i, !(h || typeof i == "number"))
    throw new Error(r + " must be number");
  var m = r == "maxProperties" ? ">" : "<";
  n += "if ( ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'number') || "), n += " Object.keys(" + d + ").length " + m + " " + f + ") { ";
  var p = r, v = v || [];
  v.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (p || "_limitProperties") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { limit: " + f + " } ", e.opts.messages !== !1 && (n += " , message: 'should NOT have ", r == "maxProperties" ? n += "more" : n += "fewer", n += " than ", h ? n += "' + " + f + " + '" : n += "" + i, n += " properties' "), e.opts.verbose && (n += " , schema:  ", h ? n += "validate.schema" + l : n += "" + i, n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var y = n;
  return n = v.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + y + "]); " : n += " validate.errors = [" + y + "]; return false; " : n += " var err = " + y + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += "} ", u && (n += " else { "), n;
}, dE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = e.opts.$data && i && i.$data, f;
  if (h ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", f = "schema" + s) : f = i, !(h || typeof i == "number"))
    throw new Error(r + " must be number");
  n += "var division" + s + ";if (", h && (n += " " + f + " !== undefined && ( typeof " + f + " != 'number' || "), n += " (division" + s + " = " + d + " / " + f + ", ", e.opts.multipleOfPrecision ? n += " Math.abs(Math.round(division" + s + ") - division" + s + ") > 1e-" + e.opts.multipleOfPrecision + " " : n += " division" + s + " !== parseInt(division" + s + ") ", n += " ) ", h && (n += "  )  "), n += " ) {   ";
  var m = m || [];
  m.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'multipleOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { multipleOf: " + f + " } ", e.opts.messages !== !1 && (n += " , message: 'should be multiple of ", h ? n += "' + " + f : n += "" + f + "'"), e.opts.verbose && (n += " , schema:  ", h ? n += "validate.schema" + l : n += "" + i, n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var p = n;
  return n = m.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + p + "]); " : n += " validate.errors = [" + p + "]; return false; " : n += " var err = " + p + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += "} ", u && (n += " else { "), n;
}, fE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "errs__" + s, f = e.util.copy(e);
  f.level++;
  var m = "valid" + f.level;
  if (e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all)) {
    f.schema = i, f.schemaPath = l, f.errSchemaPath = c, n += " var " + h + " = errors;  ";
    var p = e.compositeRule;
    e.compositeRule = f.compositeRule = !0, f.createErrors = !1;
    var v;
    f.opts.allErrors && (v = f.opts.allErrors, f.opts.allErrors = !1), n += " " + e.validate(f) + " ", f.createErrors = !0, v && (f.opts.allErrors = v), e.compositeRule = f.compositeRule = p, n += " if (" + m + ") {   ";
    var y = y || [];
    y.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: {} ", e.opts.messages !== !1 && (n += " , message: 'should NOT be valid' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
    var b = n;
    n = y.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + b + "]); " : n += " validate.errors = [" + b + "]; return false; " : n += " var err = " + b + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } else {  errors = " + h + "; if (vErrors !== null) { if (" + h + ") vErrors.length = " + h + "; else vErrors = null; } ", e.opts.allErrors && (n += " } ");
  } else
    n += "  var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'not' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: {} ", e.opts.messages !== !1 && (n += " , message: 'should NOT be valid' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", u && (n += " if (false) { ");
  return n;
}, hE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = "errs__" + s, m = e.util.copy(e), p = "";
  m.level++;
  var v = "valid" + m.level, y = m.baseId, b = "prevValid" + s, _ = "passingSchemas" + s;
  n += "var " + f + " = errors , " + b + " = false , " + h + " = false , " + _ + " = null; ";
  var E = e.compositeRule;
  e.compositeRule = m.compositeRule = !0;
  var P = i;
  if (P)
    for (var A, k = -1, B = P.length - 1; k < B; )
      A = P[k += 1], (e.opts.strictKeywords ? typeof A == "object" && Object.keys(A).length > 0 || A === !1 : e.util.schemaHasRules(A, e.RULES.all)) ? (m.schema = A, m.schemaPath = l + "[" + k + "]", m.errSchemaPath = c + "/" + k, n += "  " + e.validate(m) + " ", m.baseId = y) : n += " var " + v + " = true; ", k && (n += " if (" + v + " && " + b + ") { " + h + " = false; " + _ + " = [" + _ + ", " + k + "]; } else { ", p += "}"), n += " if (" + v + ") { " + h + " = " + b + " = true; " + _ + " = " + k + "; }";
  return e.compositeRule = m.compositeRule = E, n += "" + p + "if (!" + h + ") {   var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'oneOf' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { passingSchemas: " + _ + " } ", e.opts.messages !== !1 && (n += " , message: 'should match exactly one schema in oneOf' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? n += " throw new ValidationError(vErrors); " : n += " validate.errors = vErrors; return false; "), n += "} else {  errors = " + f + "; if (vErrors !== null) { if (" + f + ") vErrors.length = " + f + "; else vErrors = null; }", e.opts.allErrors && (n += " } "), n;
}, pE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = e.opts.$data && i && i.$data, f;
  h ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", f = "schema" + s) : f = i;
  var m = h ? "(new RegExp(" + f + "))" : e.usePattern(i);
  n += "if ( ", h && (n += " (" + f + " !== undefined && typeof " + f + " != 'string') || "), n += " !" + m + ".test(" + d + ") ) {   ";
  var p = p || [];
  p.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'pattern' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { pattern:  ", h ? n += "" + f : n += "" + e.util.toQuotedString(i), n += "  } ", e.opts.messages !== !1 && (n += ` , message: 'should match pattern "`, h ? n += "' + " + f + " + '" : n += "" + e.util.escapeQuotes(i), n += `"' `), e.opts.verbose && (n += " , schema:  ", h ? n += "validate.schema" + l : n += "" + e.util.toQuotedString(i), n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
  var v = n;
  return n = p.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + v + "]); " : n += " validate.errors = [" + v + "]; return false; " : n += " var err = " + v + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += "} ", u && (n += " else { "), n;
}, mE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "errs__" + s, f = e.util.copy(e), m = "";
  f.level++;
  var p = "valid" + f.level, v = "key" + s, y = "idx" + s, b = f.dataLevel = e.dataLevel + 1, _ = "data" + b, E = "dataProperties" + s, P = Object.keys(i || {}).filter(le), A = e.schema.patternProperties || {}, k = Object.keys(A).filter(le), B = e.schema.additionalProperties, L = P.length || k.length, H = B === !1, J = typeof B == "object" && Object.keys(B).length, q = e.opts.removeAdditional, N = H || J || q, D = e.opts.ownProperties, Q = e.baseId, ae = e.schema.required;
  if (ae && !(e.opts.$data && ae.$data) && ae.length < e.opts.loopRequired)
    var de = e.util.toHash(ae);
  function le(io) {
    return io !== "__proto__";
  }
  if (n += "var " + h + " = errors;var " + p + " = true;", D && (n += " var " + E + " = undefined;"), N) {
    if (D ? n += " " + E + " = " + E + " || Object.keys(" + d + "); for (var " + y + "=0; " + y + "<" + E + ".length; " + y + "++) { var " + v + " = " + E + "[" + y + "]; " : n += " for (var " + v + " in " + d + ") { ", L) {
      if (n += " var isAdditional" + s + " = !(false ", P.length)
        if (P.length > 8)
          n += " || validate.schema" + l + ".hasOwnProperty(" + v + ") ";
        else {
          var ge = P;
          if (ge)
            for (var se, je = -1, Te = ge.length - 1; je < Te; )
              se = ge[je += 1], n += " || " + v + " == " + e.util.toQuotedString(se) + " ";
        }
      if (k.length) {
        var j = k;
        if (j)
          for (var K, Ee = -1, Ne = j.length - 1; Ee < Ne; )
            K = j[Ee += 1], n += " || " + e.usePattern(K) + ".test(" + v + ") ";
      }
      n += " ); if (isAdditional" + s + ") { ";
    }
    if (q == "all")
      n += " delete " + d + "[" + v + "]; ";
    else {
      var we = e.errorPath, Oe = "' + " + v + " + '";
      if (e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers)), H)
        if (q)
          n += " delete " + d + "[" + v + "]; ";
        else {
          n += " " + p + " = false; ";
          var Be = c;
          c = e.errSchemaPath + "/additionalProperties";
          var Pe = Pe || [];
          Pe.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'additionalProperties' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { additionalProperty: '" + Oe + "' } ", e.opts.messages !== !1 && (n += " , message: '", e.opts._errorDataPathProperty ? n += "is an invalid additional property" : n += "should NOT have additional properties", n += "' "), e.opts.verbose && (n += " , schema: false , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
          var Ie = n;
          n = Pe.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + Ie + "]); " : n += " validate.errors = [" + Ie + "]; return false; " : n += " var err = " + Ie + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", c = Be, u && (n += " break; ");
        }
      else if (J)
        if (q == "failing") {
          n += " var " + h + " = errors;  ";
          var At = e.compositeRule;
          e.compositeRule = f.compositeRule = !0, f.schema = B, f.schemaPath = e.schemaPath + ".additionalProperties", f.errSchemaPath = e.errSchemaPath + "/additionalProperties", f.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers);
          var mt = d + "[" + v + "]";
          f.dataPathArr[b] = v;
          var Ke = e.validate(f);
          f.baseId = Q, e.util.varOccurences(Ke, _) < 2 ? n += " " + e.util.varReplace(Ke, _, mt) + " " : n += " var " + _ + " = " + mt + "; " + Ke + " ", n += " if (!" + p + ") { errors = " + h + "; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete " + d + "[" + v + "]; }  ", e.compositeRule = f.compositeRule = At;
        } else {
          f.schema = B, f.schemaPath = e.schemaPath + ".additionalProperties", f.errSchemaPath = e.errSchemaPath + "/additionalProperties", f.errorPath = e.opts._errorDataPathProperty ? e.errorPath : e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers);
          var mt = d + "[" + v + "]";
          f.dataPathArr[b] = v;
          var Ke = e.validate(f);
          f.baseId = Q, e.util.varOccurences(Ke, _) < 2 ? n += " " + e.util.varReplace(Ke, _, mt) + " " : n += " var " + _ + " = " + mt + "; " + Ke + " ", u && (n += " if (!" + p + ") break; ");
        }
      e.errorPath = we;
    }
    L && (n += " } "), n += " }  ", u && (n += " if (" + p + ") { ", m += "}");
  }
  var Ir = e.opts.useDefaults && !e.compositeRule;
  if (P.length) {
    var Et = P;
    if (Et)
      for (var se, dn = -1, Jr = Et.length - 1; dn < Jr; ) {
        se = Et[dn += 1];
        var vt = i[se];
        if (e.opts.strictKeywords ? typeof vt == "object" && Object.keys(vt).length > 0 || vt === !1 : e.util.schemaHasRules(vt, e.RULES.all)) {
          var Rr = e.util.getProperty(se), mt = d + Rr, Un = Ir && vt.default !== void 0;
          f.schema = vt, f.schemaPath = l + Rr, f.errSchemaPath = c + "/" + e.util.escapeFragment(se), f.errorPath = e.util.getPath(e.errorPath, se, e.opts.jsonPointers), f.dataPathArr[b] = e.util.toQuotedString(se);
          var Ke = e.validate(f);
          if (f.baseId = Q, e.util.varOccurences(Ke, _) < 2) {
            Ke = e.util.varReplace(Ke, _, mt);
            var lt = mt;
          } else {
            var lt = _;
            n += " var " + _ + " = " + mt + "; ";
          }
          if (Un)
            n += " " + Ke + " ";
          else {
            if (de && de[se]) {
              n += " if ( " + lt + " === undefined ", D && (n += " || ! Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(se) + "') "), n += ") { " + p + " = false; ";
              var we = e.errorPath, Be = c, ct = e.util.escapeQuotes(se);
              e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(we, se, e.opts.jsonPointers)), c = e.errSchemaPath + "/required";
              var Pe = Pe || [];
              Pe.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { missingProperty: '" + ct + "' } ", e.opts.messages !== !1 && (n += " , message: '", e.opts._errorDataPathProperty ? n += "is a required property" : n += "should have required property \\'" + ct + "\\'", n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
              var Ie = n;
              n = Pe.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + Ie + "]); " : n += " validate.errors = [" + Ie + "]; return false; " : n += " var err = " + Ie + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", c = Be, e.errorPath = we, n += " } else { ";
            } else
              u ? (n += " if ( " + lt + " === undefined ", D && (n += " || ! Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(se) + "') "), n += ") { " + p + " = true; } else { ") : (n += " if (" + lt + " !== undefined ", D && (n += " &&   Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(se) + "') "), n += " ) { ");
            n += " " + Ke + " } ";
          }
        }
        u && (n += " if (" + p + ") { ", m += "}");
      }
  }
  if (k.length) {
    var Ot = k;
    if (Ot)
      for (var K, wa = -1, oo = Ot.length - 1; wa < oo; ) {
        K = Ot[wa += 1];
        var vt = A[K];
        if (e.opts.strictKeywords ? typeof vt == "object" && Object.keys(vt).length > 0 || vt === !1 : e.util.schemaHasRules(vt, e.RULES.all)) {
          f.schema = vt, f.schemaPath = e.schemaPath + ".patternProperties" + e.util.getProperty(K), f.errSchemaPath = e.errSchemaPath + "/patternProperties/" + e.util.escapeFragment(K), D ? n += " " + E + " = " + E + " || Object.keys(" + d + "); for (var " + y + "=0; " + y + "<" + E + ".length; " + y + "++) { var " + v + " = " + E + "[" + y + "]; " : n += " for (var " + v + " in " + d + ") { ", n += " if (" + e.usePattern(K) + ".test(" + v + ")) { ", f.errorPath = e.util.getPathExpr(e.errorPath, v, e.opts.jsonPointers);
          var mt = d + "[" + v + "]";
          f.dataPathArr[b] = v;
          var Ke = e.validate(f);
          f.baseId = Q, e.util.varOccurences(Ke, _) < 2 ? n += " " + e.util.varReplace(Ke, _, mt) + " " : n += " var " + _ + " = " + mt + "; " + Ke + " ", u && (n += " if (!" + p + ") break; "), n += " } ", u && (n += " else " + p + " = true; "), n += " }  ", u && (n += " if (" + p + ") { ", m += "}");
        }
      }
  }
  return u && (n += " " + m + " if (" + h + " == errors) {"), n;
}, vE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "errs__" + s, f = e.util.copy(e), m = "";
  f.level++;
  var p = "valid" + f.level;
  if (n += "var " + h + " = errors;", e.opts.strictKeywords ? typeof i == "object" && Object.keys(i).length > 0 || i === !1 : e.util.schemaHasRules(i, e.RULES.all)) {
    f.schema = i, f.schemaPath = l, f.errSchemaPath = c;
    var v = "key" + s, y = "idx" + s, b = "i" + s, _ = "' + " + v + " + '", E = f.dataLevel = e.dataLevel + 1, P = "data" + E, A = "dataProperties" + s, k = e.opts.ownProperties, B = e.baseId;
    k && (n += " var " + A + " = undefined; "), k ? n += " " + A + " = " + A + " || Object.keys(" + d + "); for (var " + y + "=0; " + y + "<" + A + ".length; " + y + "++) { var " + v + " = " + A + "[" + y + "]; " : n += " for (var " + v + " in " + d + ") { ", n += " var startErrs" + s + " = errors; ";
    var L = v, H = e.compositeRule;
    e.compositeRule = f.compositeRule = !0;
    var J = e.validate(f);
    f.baseId = B, e.util.varOccurences(J, P) < 2 ? n += " " + e.util.varReplace(J, P, L) + " " : n += " var " + P + " = " + L + "; " + J + " ", e.compositeRule = f.compositeRule = H, n += " if (!" + p + ") { for (var " + b + "=startErrs" + s + "; " + b + "<errors; " + b + "++) { vErrors[" + b + "].propertyName = " + v + "; }   var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'propertyNames' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { propertyName: '" + _ + "' } ", e.opts.messages !== !1 && (n += " , message: 'property name \\'" + _ + "\\' is invalid' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? n += " throw new ValidationError(vErrors); " : n += " validate.errors = vErrors; return false; "), u && (n += " break; "), n += " } }";
  }
  return u && (n += " " + m + " if (" + h + " == errors) {"), n;
}, gE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = e.opts.$data && i && i.$data;
  f && (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ");
  var m = "schema" + s;
  if (!f)
    if (i.length < e.opts.loopRequired && e.schema.properties && Object.keys(e.schema.properties).length) {
      var p = [], v = i;
      if (v)
        for (var y, b = -1, _ = v.length - 1; b < _; ) {
          y = v[b += 1];
          var E = e.schema.properties[y];
          E && (e.opts.strictKeywords ? typeof E == "object" && Object.keys(E).length > 0 || E === !1 : e.util.schemaHasRules(E, e.RULES.all)) || (p[p.length] = y);
        }
    } else
      var p = i;
  if (f || p.length) {
    var P = e.errorPath, A = f || p.length >= e.opts.loopRequired, k = e.opts.ownProperties;
    if (u)
      if (n += " var missing" + s + "; ", A) {
        f || (n += " var " + m + " = validate.schema" + l + "; ");
        var B = "i" + s, L = "schema" + s + "[" + B + "]", H = "' + " + L + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(P, L, e.opts.jsonPointers)), n += " var " + h + " = true; ", f && (n += " if (schema" + s + " === undefined) " + h + " = true; else if (!Array.isArray(schema" + s + ")) " + h + " = false; else {"), n += " for (var " + B + " = 0; " + B + " < " + m + ".length; " + B + "++) { " + h + " = " + d + "[" + m + "[" + B + "]] !== undefined ", k && (n += " &&   Object.prototype.hasOwnProperty.call(" + d + ", " + m + "[" + B + "]) "), n += "; if (!" + h + ") break; } ", f && (n += "  }  "), n += "  if (!" + h + ") {   ";
        var J = J || [];
        J.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { missingProperty: '" + H + "' } ", e.opts.messages !== !1 && (n += " , message: '", e.opts._errorDataPathProperty ? n += "is a required property" : n += "should have required property \\'" + H + "\\'", n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
        var q = n;
        n = J.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + q + "]); " : n += " validate.errors = [" + q + "]; return false; " : n += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } else { ";
      } else {
        n += " if ( ";
        var N = p;
        if (N)
          for (var D, B = -1, Q = N.length - 1; B < Q; ) {
            D = N[B += 1], B && (n += " || ");
            var ae = e.util.getProperty(D), de = d + ae;
            n += " ( ( " + de + " === undefined ", k && (n += " || ! Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(D) + "') "), n += ") && (missing" + s + " = " + e.util.toQuotedString(e.opts.jsonPointers ? D : ae) + ") ) ";
          }
        n += ") {  ";
        var L = "missing" + s, H = "' + " + L + " + '";
        e.opts._errorDataPathProperty && (e.errorPath = e.opts.jsonPointers ? e.util.getPathExpr(P, L, !0) : P + " + " + L);
        var J = J || [];
        J.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { missingProperty: '" + H + "' } ", e.opts.messages !== !1 && (n += " , message: '", e.opts._errorDataPathProperty ? n += "is a required property" : n += "should have required property \\'" + H + "\\'", n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
        var q = n;
        n = J.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + q + "]); " : n += " validate.errors = [" + q + "]; return false; " : n += " var err = " + q + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } else { ";
      }
    else if (A) {
      f || (n += " var " + m + " = validate.schema" + l + "; ");
      var B = "i" + s, L = "schema" + s + "[" + B + "]", H = "' + " + L + " + '";
      e.opts._errorDataPathProperty && (e.errorPath = e.util.getPathExpr(P, L, e.opts.jsonPointers)), f && (n += " if (" + m + " && !Array.isArray(" + m + ")) {  var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { missingProperty: '" + H + "' } ", e.opts.messages !== !1 && (n += " , message: '", e.opts._errorDataPathProperty ? n += "is a required property" : n += "should have required property \\'" + H + "\\'", n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (" + m + " !== undefined) { "), n += " for (var " + B + " = 0; " + B + " < " + m + ".length; " + B + "++) { if (" + d + "[" + m + "[" + B + "]] === undefined ", k && (n += " || ! Object.prototype.hasOwnProperty.call(" + d + ", " + m + "[" + B + "]) "), n += ") {  var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { missingProperty: '" + H + "' } ", e.opts.messages !== !1 && (n += " , message: '", e.opts._errorDataPathProperty ? n += "is a required property" : n += "should have required property \\'" + H + "\\'", n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ", f && (n += "  }  ");
    } else {
      var le = p;
      if (le)
        for (var D, ge = -1, se = le.length - 1; ge < se; ) {
          D = le[ge += 1];
          var ae = e.util.getProperty(D), H = e.util.escapeQuotes(D), de = d + ae;
          e.opts._errorDataPathProperty && (e.errorPath = e.util.getPath(P, D, e.opts.jsonPointers)), n += " if ( " + de + " === undefined ", k && (n += " || ! Object.prototype.hasOwnProperty.call(" + d + ", '" + e.util.escapeQuotes(D) + "') "), n += ") {  var err =   ", e.createErrors !== !1 ? (n += " { keyword: 'required' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { missingProperty: '" + H + "' } ", e.opts.messages !== !1 && (n += " , message: '", e.opts._errorDataPathProperty ? n += "is a required property" : n += "should have required property \\'" + H + "\\'", n += "' "), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ";
        }
    }
    e.errorPath = P;
  } else u && (n += " if (true) {");
  return n;
}, _E = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d = "data" + (o || ""), h = "valid" + s, f = e.opts.$data && i && i.$data, m;
  if (f ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", m = "schema" + s) : m = i, (i || f) && e.opts.uniqueItems !== !1) {
    f && (n += " var " + h + "; if (" + m + " === false || " + m + " === undefined) " + h + " = true; else if (typeof " + m + " != 'boolean') " + h + " = false; else { "), n += " var i = " + d + ".length , " + h + " = true , j; if (i > 1) { ";
    var p = e.schema.items && e.schema.items.type, v = Array.isArray(p);
    if (!p || p == "object" || p == "array" || v && (p.indexOf("object") >= 0 || p.indexOf("array") >= 0))
      n += " outer: for (;i--;) { for (j = i; j--;) { if (equal(" + d + "[i], " + d + "[j])) { " + h + " = false; break outer; } } } ";
    else {
      n += " var itemIndices = {}, item; for (;i--;) { var item = " + d + "[i]; ";
      var y = "checkDataType" + (v ? "s" : "");
      n += " if (" + e.util[y](p, "item", e.opts.strictNumbers, !0) + ") continue; ", v && (n += ` if (typeof item == 'string') item = '"' + item; `), n += " if (typeof itemIndices[item] == 'number') { " + h + " = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ";
    }
    n += " } ", f && (n += "  }  "), n += " if (!" + h + ") {   ";
    var b = b || [];
    b.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: 'uniqueItems' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { i: i, j: j } ", e.opts.messages !== !1 && (n += " , message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)' "), e.opts.verbose && (n += " , schema:  ", f ? n += "validate.schema" + l : n += "" + i, n += "         , parentSchema: validate.schema" + e.schemaPath + " , data: " + d + " "), n += " } ") : n += " {} ";
    var _ = n;
    n = b.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + _ + "]); " : n += " validate.errors = [" + _ + "]; return false; " : n += " var err = " + _ + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", n += " } ", u && (n += " else { ");
  } else
    u && (n += " if (true) { ");
  return n;
}, yE = {
  $ref: eE,
  allOf: tE,
  anyOf: rE,
  $comment: nE,
  const: aE,
  contains: sE,
  dependencies: oE,
  enum: iE,
  format: lE,
  if: cE,
  items: uE,
  maximum: yu,
  minimum: yu,
  maxItems: bu,
  minItems: bu,
  maxLength: wu,
  minLength: wu,
  maxProperties: Eu,
  minProperties: Eu,
  multipleOf: dE,
  not: fE,
  oneOf: hE,
  pattern: pE,
  properties: mE,
  propertyNames: vE,
  required: gE,
  uniqueItems: _E,
  validate: wf
}, Su = yE, jo = Bn.toHash, bE = function() {
  var e = [
    {
      type: "number",
      rules: [
        { maximum: ["exclusiveMaximum"] },
        { minimum: ["exclusiveMinimum"] },
        "multipleOf",
        "format"
      ]
    },
    {
      type: "string",
      rules: ["maxLength", "minLength", "pattern", "format"]
    },
    {
      type: "array",
      rules: ["maxItems", "minItems", "items", "contains", "uniqueItems"]
    },
    {
      type: "object",
      rules: [
        "maxProperties",
        "minProperties",
        "required",
        "dependencies",
        "propertyNames",
        { properties: ["additionalProperties", "patternProperties"] }
      ]
    },
    { rules: ["$ref", "const", "enum", "not", "anyOf", "oneOf", "allOf", "if"] }
  ], r = ["type", "$comment"], a = [
    "$schema",
    "$id",
    "id",
    "$data",
    "$async",
    "title",
    "description",
    "default",
    "definitions",
    "examples",
    "readOnly",
    "writeOnly",
    "contentMediaType",
    "contentEncoding",
    "additionalItems",
    "then",
    "else"
  ], n = ["number", "integer", "string", "array", "object", "boolean", "null"];
  return e.all = jo(r), e.types = jo(n), e.forEach(function(s) {
    s.rules = s.rules.map(function(o) {
      var i;
      if (typeof o == "object") {
        var l = Object.keys(o)[0];
        i = o[l], o = l, i.forEach(function(u) {
          r.push(u), e.all[u] = !0;
        });
      }
      r.push(o);
      var c = e.all[o] = {
        keyword: o,
        code: Su[o],
        implements: i
      };
      return c;
    }), e.all.$comment = {
      keyword: "$comment",
      code: Su.$comment
    }, s.type && (e.types[s.type] = s);
  }), e.keywords = jo(r.concat(a)), e.custom = {}, e;
}, Pu = [
  "multipleOf",
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
  "maxLength",
  "minLength",
  "pattern",
  "additionalItems",
  "maxItems",
  "minItems",
  "uniqueItems",
  "maxProperties",
  "minProperties",
  "required",
  "additionalProperties",
  "enum",
  "format",
  "const"
], wE = function(t, e) {
  for (var r = 0; r < e.length; r++) {
    t = JSON.parse(JSON.stringify(t));
    var a = e[r].split("/"), n = t, s;
    for (s = 1; s < a.length; s++)
      n = n[a[s]];
    for (s = 0; s < Pu.length; s++) {
      var o = Pu[s], i = n[o];
      i && (n[o] = {
        anyOf: [
          i,
          { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
        ]
      });
    }
  }
  return t;
}, EE = ql.MissingRef, SE = Nf;
function Nf(t, e, r) {
  var a = this;
  if (typeof this._opts.loadSchema != "function")
    throw new Error("options.loadSchema should be a function");
  typeof e == "function" && (r = e, e = void 0);
  var n = s(t).then(function() {
    var i = a._addSchema(t, void 0, e);
    return i.validate || o(i);
  });
  return r && n.then(
    function(i) {
      r(null, i);
    },
    r
  ), n;
  function s(i) {
    var l = i.$schema;
    return l && !a.getSchema(l) ? Nf.call(a, { $ref: l }, !0) : Promise.resolve();
  }
  function o(i) {
    try {
      return a._compile(i);
    } catch (c) {
      if (c instanceof EE) return l(c);
      throw c;
    }
    function l(c) {
      var u = c.missingSchema;
      if (f(u)) throw new Error("Schema " + u + " is loaded but " + c.missingRef + " cannot be resolved");
      var d = a._loadingSchemas[u];
      return d || (d = a._loadingSchemas[u] = a._opts.loadSchema(u), d.then(h, h)), d.then(function(m) {
        if (!f(u))
          return s(m).then(function() {
            f(u) || a.addSchema(m, u, void 0, e);
          });
      }).then(function() {
        return o(i);
      });
      function h() {
        delete a._loadingSchemas[u];
      }
      function f(m) {
        return a._refs[m] || a._schemas[m];
      }
    }
  }
}
var PE = function(e, r, a) {
  var n = " ", s = e.level, o = e.dataLevel, i = e.schema[r], l = e.schemaPath + e.util.getProperty(r), c = e.errSchemaPath + "/" + r, u = !e.opts.allErrors, d, h = "data" + (o || ""), f = "valid" + s, m = "errs__" + s, p = e.opts.$data && i && i.$data, v;
  p ? (n += " var schema" + s + " = " + e.util.getData(i.$data, o, e.dataPathArr) + "; ", v = "schema" + s) : v = i;
  var y = this, b = "definition" + s, _ = y.definition, E = "", P, A, k, B, L;
  if (p && _.$data) {
    L = "keywordValidate" + s;
    var H = _.validateSchema;
    n += " var " + b + " = RULES.custom['" + r + "'].definition; var " + L + " = " + b + ".validate;";
  } else {
    if (B = e.useCustomRule(y, i, e.schema, e), !B) return;
    v = "validate.schema" + l, L = B.code, P = _.compile, A = _.inline, k = _.macro;
  }
  var J = L + ".errors", q = "i" + s, N = "ruleErr" + s, D = _.async;
  if (D && !e.async) throw new Error("async keyword in sync schema");
  if (A || k || (n += "" + J + " = null;"), n += "var " + m + " = errors;var " + f + ";", p && _.$data && (E += "}", n += " if (" + v + " === undefined) { " + f + " = true; } else { ", H && (E += "}", n += " " + f + " = " + b + ".validateSchema(" + v + "); if (" + f + ") { ")), A)
    _.statements ? n += " " + B.validate + " " : n += " " + f + " = " + B.validate + "; ";
  else if (k) {
    var Q = e.util.copy(e), E = "";
    Q.level++;
    var ae = "valid" + Q.level;
    Q.schema = B.validate, Q.schemaPath = "";
    var de = e.compositeRule;
    e.compositeRule = Q.compositeRule = !0;
    var le = e.validate(Q).replace(/validate\.schema/g, L);
    e.compositeRule = Q.compositeRule = de, n += " " + le;
  } else {
    var ge = ge || [];
    ge.push(n), n = "", n += "  " + L + ".call( ", e.opts.passContext ? n += "this" : n += "self", P || _.schema === !1 ? n += " , " + h + " " : n += " , " + v + " , " + h + " , validate.schema" + e.schemaPath + " ", n += " , (dataPath || '')", e.errorPath != '""' && (n += " + " + e.errorPath);
    var se = o ? "data" + (o - 1 || "") : "parentData", je = o ? e.dataPathArr[o] : "parentDataProperty";
    n += " , " + se + " , " + je + " , rootData )  ";
    var Te = n;
    n = ge.pop(), _.errors === !1 ? (n += " " + f + " = ", D && (n += "await "), n += "" + Te + "; ") : D ? (J = "customErrors" + s, n += " var " + J + " = null; try { " + f + " = await " + Te + "; } catch (e) { " + f + " = false; if (e instanceof ValidationError) " + J + " = e.errors; else throw e; } ") : n += " " + J + " = null; " + f + " = " + Te + "; ";
  }
  if (_.modifying && (n += " if (" + se + ") " + h + " = " + se + "[" + je + "];"), n += "" + E, _.valid)
    u && (n += " if (true) { ");
  else {
    n += " if ( ", _.valid === void 0 ? (n += " !", k ? n += "" + ae : n += "" + f) : n += " " + !_.valid + " ", n += ") { ", d = y.keyword;
    var ge = ge || [];
    ge.push(n), n = "";
    var ge = ge || [];
    ge.push(n), n = "", e.createErrors !== !1 ? (n += " { keyword: '" + (d || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { keyword: '" + y.keyword + "' } ", e.opts.messages !== !1 && (n += ` , message: 'should pass "` + y.keyword + `" keyword validation' `), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + h + " "), n += " } ") : n += " {} ";
    var j = n;
    n = ge.pop(), !e.compositeRule && u ? e.async ? n += " throw new ValidationError([" + j + "]); " : n += " validate.errors = [" + j + "]; return false; " : n += " var err = " + j + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
    var K = n;
    n = ge.pop(), A ? _.errors ? _.errors != "full" && (n += "  for (var " + q + "=" + m + "; " + q + "<errors; " + q + "++) { var " + N + " = vErrors[" + q + "]; if (" + N + ".dataPath === undefined) " + N + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + N + ".schemaPath === undefined) { " + N + '.schemaPath = "' + c + '"; } ', e.opts.verbose && (n += " " + N + ".schema = " + v + "; " + N + ".data = " + h + "; "), n += " } ") : _.errors === !1 ? n += " " + K + " " : (n += " if (" + m + " == errors) { " + K + " } else {  for (var " + q + "=" + m + "; " + q + "<errors; " + q + "++) { var " + N + " = vErrors[" + q + "]; if (" + N + ".dataPath === undefined) " + N + ".dataPath = (dataPath || '') + " + e.errorPath + "; if (" + N + ".schemaPath === undefined) { " + N + '.schemaPath = "' + c + '"; } ', e.opts.verbose && (n += " " + N + ".schema = " + v + "; " + N + ".data = " + h + "; "), n += " } } ") : k ? (n += "   var err =   ", e.createErrors !== !1 ? (n += " { keyword: '" + (d || "custom") + "' , dataPath: (dataPath || '') + " + e.errorPath + " , schemaPath: " + e.util.toQuotedString(c) + " , params: { keyword: '" + y.keyword + "' } ", e.opts.messages !== !1 && (n += ` , message: 'should pass "` + y.keyword + `" keyword validation' `), e.opts.verbose && (n += " , schema: validate.schema" + l + " , parentSchema: validate.schema" + e.schemaPath + " , data: " + h + " "), n += " } ") : n += " {} ", n += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", !e.compositeRule && u && (e.async ? n += " throw new ValidationError(vErrors); " : n += " validate.errors = vErrors; return false; ")) : _.errors === !1 ? n += " " + K + " " : (n += " if (Array.isArray(" + J + ")) { if (vErrors === null) vErrors = " + J + "; else vErrors = vErrors.concat(" + J + "); errors = vErrors.length;  for (var " + q + "=" + m + "; " + q + "<errors; " + q + "++) { var " + N + " = vErrors[" + q + "]; if (" + N + ".dataPath === undefined) " + N + ".dataPath = (dataPath || '') + " + e.errorPath + ";  " + N + '.schemaPath = "' + c + '";  ', e.opts.verbose && (n += " " + N + ".schema = " + v + "; " + N + ".data = " + h + "; "), n += " } } else { " + K + " } "), n += " } ", u && (n += " else { ");
  }
  return n;
};
const xE = "http://json-schema.org/draft-07/schema#", CE = "http://json-schema.org/draft-07/schema#", kE = "Core schema meta-schema", IE = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, RE = [
  "object",
  "boolean"
], TE = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, $f = {
  $schema: xE,
  $id: CE,
  title: kE,
  definitions: IE,
  type: RE,
  properties: TE,
  default: !0
};
var xu = $f, AE = {
  $id: "https://github.com/ajv-validator/ajv/blob/master/lib/definition_schema.js",
  definitions: {
    simpleTypes: xu.definitions.simpleTypes
  },
  type: "object",
  dependencies: {
    schema: ["validate"],
    $data: ["validate"],
    statements: ["inline"],
    valid: { not: { required: ["macro"] } }
  },
  properties: {
    type: xu.properties.type,
    schema: { type: "boolean" },
    statements: { type: "boolean" },
    dependencies: {
      type: "array",
      items: { type: "string" }
    },
    metaSchema: { type: "object" },
    modifying: { type: "boolean" },
    valid: { type: "boolean" },
    $data: { type: "boolean" },
    async: { type: "boolean" },
    errors: {
      anyOf: [
        { type: "boolean" },
        { const: "full" }
      ]
    }
  }
}, OE = /^[a-z_$][a-z0-9_$-]*$/i, DE = PE, LE = AE, NE = {
  add: $E,
  get: ME,
  remove: FE,
  validate: Di
};
function $E(t, e) {
  var r = this.RULES;
  if (r.keywords[t])
    throw new Error("Keyword " + t + " is already defined");
  if (!OE.test(t))
    throw new Error("Keyword " + t + " is not a valid identifier");
  if (e) {
    this.validateKeyword(e, !0);
    var a = e.type;
    if (Array.isArray(a))
      for (var n = 0; n < a.length; n++)
        o(t, a[n], e);
    else
      o(t, a, e);
    var s = e.metaSchema;
    s && (e.$data && this._opts.$data && (s = {
      anyOf: [
        s,
        { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" }
      ]
    }), e.validateSchema = this.compile(s, !0));
  }
  r.keywords[t] = r.all[t] = !0;
  function o(i, l, c) {
    for (var u, d = 0; d < r.length; d++) {
      var h = r[d];
      if (h.type == l) {
        u = h;
        break;
      }
    }
    u || (u = { type: l, rules: [] }, r.push(u));
    var f = {
      keyword: i,
      definition: c,
      custom: !0,
      code: DE,
      implements: c.implements
    };
    u.rules.push(f), r.custom[i] = f;
  }
  return this;
}
function ME(t) {
  var e = this.RULES.custom[t];
  return e ? e.definition : this.RULES.keywords[t] || !1;
}
function FE(t) {
  var e = this.RULES;
  delete e.keywords[t], delete e.all[t], delete e.custom[t];
  for (var r = 0; r < e.length; r++)
    for (var a = e[r].rules, n = 0; n < a.length; n++)
      if (a[n].keyword == t) {
        a.splice(n, 1);
        break;
      }
  return this;
}
function Di(t, e) {
  Di.errors = null;
  var r = this._validateKeyword = this._validateKeyword || this.compile(LE, !0);
  if (r(t)) return !0;
  if (Di.errors = r.errors, e)
    throw new Error("custom keyword definition is invalid: " + this.errorsText(r.errors));
  return !1;
}
const jE = "http://json-schema.org/draft-07/schema#", BE = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", UE = "Meta-schema for $data reference (JSON Schema extension proposal)", VE = "object", zE = [
  "$data"
], qE = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, HE = !1, ZE = {
  $schema: jE,
  $id: BE,
  description: UE,
  type: VE,
  required: zE,
  properties: qE,
  additionalProperties: HE
};
var Mf = D1, rn = zl, WE = B1, Ff = vf, JE = bf, QE = W1, GE = bE, jf = wE, Bf = Bn, KE = rt;
rt.prototype.validate = XE;
rt.prototype.compile = eS;
rt.prototype.addSchema = tS;
rt.prototype.addMetaSchema = rS;
rt.prototype.validateSchema = nS;
rt.prototype.getSchema = sS;
rt.prototype.removeSchema = iS;
rt.prototype.addFormat = mS;
rt.prototype.errorsText = pS;
rt.prototype._addSchema = lS;
rt.prototype._compile = cS;
rt.prototype.compileAsync = SE;
var ao = NE;
rt.prototype.addKeyword = ao.add;
rt.prototype.getKeyword = ao.get;
rt.prototype.removeKeyword = ao.remove;
rt.prototype.validateKeyword = ao.validate;
var Uf = ql;
rt.ValidationError = Uf.Validation;
rt.MissingRefError = Uf.MissingRef;
rt.$dataMetaSchema = jf;
var gs = "http://json-schema.org/draft-07/schema", Cu = ["removeAdditional", "useDefaults", "coerceTypes", "strictDefaults"], YE = ["/properties"];
function rt(t) {
  if (!(this instanceof rt)) return new rt(t);
  t = this._opts = Bf.copy(t) || {}, wS(this), this._schemas = {}, this._refs = {}, this._fragments = {}, this._formats = QE(t.format), this._cache = t.cache || new WE(), this._loadingSchemas = {}, this._compilations = [], this.RULES = GE(), this._getId = uS(t), t.loopRequired = t.loopRequired || 1 / 0, t.errorDataPath == "property" && (t._errorDataPathProperty = !0), t.serialize === void 0 && (t.serialize = JE), this._metaOpts = bS(this), t.formats && _S(this), t.keywords && yS(this), vS(this), typeof t.meta == "object" && this.addMetaSchema(t.meta), t.nullable && this.addKeyword("nullable", { metaSchema: { type: "boolean" } }), gS(this);
}
function XE(t, e) {
  var r;
  if (typeof t == "string") {
    if (r = this.getSchema(t), !r) throw new Error('no schema with key or ref "' + t + '"');
  } else {
    var a = this._addSchema(t);
    r = a.validate || this._compile(a);
  }
  var n = r(e);
  return r.$async !== !0 && (this.errors = r.errors), n;
}
function eS(t, e) {
  var r = this._addSchema(t, void 0, e);
  return r.validate || this._compile(r);
}
function tS(t, e, r, a) {
  if (Array.isArray(t)) {
    for (var n = 0; n < t.length; n++) this.addSchema(t[n], void 0, r, a);
    return this;
  }
  var s = this._getId(t);
  if (s !== void 0 && typeof s != "string")
    throw new Error("schema id must be string");
  return e = rn.normalizeId(e || s), zf(this, e), this._schemas[e] = this._addSchema(t, r, a, !0), this;
}
function rS(t, e, r) {
  return this.addSchema(t, e, r, !0), this;
}
function nS(t, e) {
  var r = t.$schema;
  if (r !== void 0 && typeof r != "string")
    throw new Error("$schema must be a string");
  if (r = r || this._opts.defaultMeta || aS(this), !r)
    return this.logger.warn("meta-schema not available"), this.errors = null, !0;
  var a = this.validate(r, t);
  if (!a && e) {
    var n = "schema is invalid: " + this.errorsText();
    if (this._opts.validateSchema == "log") this.logger.error(n);
    else throw new Error(n);
  }
  return a;
}
function aS(t) {
  var e = t._opts.meta;
  return t._opts.defaultMeta = typeof e == "object" ? t._getId(e) || e : t.getSchema(gs) ? gs : void 0, t._opts.defaultMeta;
}
function sS(t) {
  var e = Vf(this, t);
  switch (typeof e) {
    case "object":
      return e.validate || this._compile(e);
    case "string":
      return this.getSchema(e);
    case "undefined":
      return oS(this, t);
  }
}
function oS(t, e) {
  var r = rn.schema.call(t, { schema: {} }, e);
  if (r) {
    var a = r.schema, n = r.root, s = r.baseId, o = Mf.call(t, a, n, void 0, s);
    return t._fragments[e] = new Ff({
      ref: e,
      fragment: !0,
      schema: a,
      root: n,
      baseId: s,
      validate: o
    }), o;
  }
}
function Vf(t, e) {
  return e = rn.normalizeId(e), t._schemas[e] || t._refs[e] || t._fragments[e];
}
function iS(t) {
  if (t instanceof RegExp)
    return La(this, this._schemas, t), La(this, this._refs, t), this;
  switch (typeof t) {
    case "undefined":
      return La(this, this._schemas), La(this, this._refs), this._cache.clear(), this;
    case "string":
      var e = Vf(this, t);
      return e && this._cache.del(e.cacheKey), delete this._schemas[t], delete this._refs[t], this;
    case "object":
      var r = this._opts.serialize, a = r ? r(t) : t;
      this._cache.del(a);
      var n = this._getId(t);
      n && (n = rn.normalizeId(n), delete this._schemas[n], delete this._refs[n]);
  }
  return this;
}
function La(t, e, r) {
  for (var a in e) {
    var n = e[a];
    !n.meta && (!r || r.test(a)) && (t._cache.del(n.cacheKey), delete e[a]);
  }
}
function lS(t, e, r, a) {
  if (typeof t != "object" && typeof t != "boolean")
    throw new Error("schema should be object or boolean");
  var n = this._opts.serialize, s = n ? n(t) : t, o = this._cache.get(s);
  if (o) return o;
  a = a || this._opts.addUsedSchema !== !1;
  var i = rn.normalizeId(this._getId(t));
  i && a && zf(this, i);
  var l = this._opts.validateSchema !== !1 && !e, c;
  l && !(c = i && i == rn.normalizeId(t.$schema)) && this.validateSchema(t, !0);
  var u = rn.ids.call(this, t), d = new Ff({
    id: i,
    schema: t,
    localRefs: u,
    cacheKey: s,
    meta: r
  });
  return i[0] != "#" && a && (this._refs[i] = d), this._cache.put(s, d), l && c && this.validateSchema(t, !0), d;
}
function cS(t, e) {
  if (t.compiling)
    return t.validate = n, n.schema = t.schema, n.errors = null, n.root = e || n, t.schema.$async === !0 && (n.$async = !0), n;
  t.compiling = !0;
  var r;
  t.meta && (r = this._opts, this._opts = this._metaOpts);
  var a;
  try {
    a = Mf.call(this, t.schema, e, t.localRefs);
  } catch (s) {
    throw delete t.validate, s;
  } finally {
    t.compiling = !1, t.meta && (this._opts = r);
  }
  return t.validate = a, t.refs = a.refs, t.refVal = a.refVal, t.root = a.root, a;
  function n() {
    var s = t.validate, o = s.apply(this, arguments);
    return n.errors = s.errors, o;
  }
}
function uS(t) {
  switch (t.schemaId) {
    case "auto":
      return hS;
    case "id":
      return dS;
    default:
      return fS;
  }
}
function dS(t) {
  return t.$id && this.logger.warn("schema $id ignored", t.$id), t.id;
}
function fS(t) {
  return t.id && this.logger.warn("schema id ignored", t.id), t.$id;
}
function hS(t) {
  if (t.$id && t.id && t.$id != t.id)
    throw new Error("schema $id is different from id");
  return t.$id || t.id;
}
function pS(t, e) {
  if (t = t || this.errors, !t) return "No errors";
  e = e || {};
  for (var r = e.separator === void 0 ? ", " : e.separator, a = e.dataVar === void 0 ? "data" : e.dataVar, n = "", s = 0; s < t.length; s++) {
    var o = t[s];
    o && (n += a + o.dataPath + " " + o.message + r);
  }
  return n.slice(0, -r.length);
}
function mS(t, e) {
  return typeof e == "string" && (e = new RegExp(e)), this._formats[t] = e, this;
}
function vS(t) {
  var e;
  if (t._opts.$data && (e = ZE, t.addMetaSchema(e, e.$id, !0)), t._opts.meta !== !1) {
    var r = $f;
    t._opts.$data && (r = jf(r, YE)), t.addMetaSchema(r, gs, !0), t._refs["http://json-schema.org/schema"] = gs;
  }
}
function gS(t) {
  var e = t._opts.schemas;
  if (e)
    if (Array.isArray(e)) t.addSchema(e);
    else for (var r in e) t.addSchema(e[r], r);
}
function _S(t) {
  for (var e in t._opts.formats) {
    var r = t._opts.formats[e];
    t.addFormat(e, r);
  }
}
function yS(t) {
  for (var e in t._opts.keywords) {
    var r = t._opts.keywords[e];
    t.addKeyword(e, r);
  }
}
function zf(t, e) {
  if (t._schemas[e] || t._refs[e])
    throw new Error('schema with key or id "' + e + '" already exists');
}
function bS(t) {
  for (var e = Bf.copy(t._opts), r = 0; r < Cu.length; r++)
    delete e[Cu[r]];
  return e;
}
function wS(t) {
  var e = t._opts.logger;
  if (e === !1)
    t.logger = { log: Bo, warn: Bo, error: Bo };
  else {
    if (e === void 0 && (e = console), !(typeof e == "object" && e.log && e.warn && e.error))
      throw new Error("logger must implement log, warn and error methods");
    t.logger = e;
  }
}
function Bo() {
}
const qf = /* @__PURE__ */ Zu(KE);
class Hf extends hf {
  /**
   * Initializes this client with the given name and version information.
   */
  constructor(e, r) {
    var a;
    super(r), this._clientInfo = e, this._cachedToolOutputValidators = /* @__PURE__ */ new Map(), this._capabilities = (a = r == null ? void 0 : r.capabilities) !== null && a !== void 0 ? a : {}, this._ajv = new qf();
  }
  /**
   * Registers new capabilities. This can only be called before connecting to a transport.
   *
   * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
   */
  registerCapabilities(e) {
    if (this.transport)
      throw new Error("Cannot register capabilities after connecting to transport");
    this._capabilities = pf(this._capabilities, e);
  }
  assertCapability(e, r) {
    var a;
    if (!(!((a = this._serverCapabilities) === null || a === void 0) && a[e]))
      throw new Error(`Server does not support ${e} (required for ${r})`);
  }
  async connect(e, r) {
    if (await super.connect(e), e.sessionId === void 0)
      try {
        const a = await this.request({
          method: "initialize",
          params: {
            protocolVersion: ga,
            capabilities: this._capabilities,
            clientInfo: this._clientInfo
          }
        }, Kd, r);
        if (a === void 0)
          throw new Error(`Server sent invalid initialize result: ${a}`);
        if (!Ud.includes(a.protocolVersion))
          throw new Error(`Server's protocol version is not supported: ${a.protocolVersion}`);
        this._serverCapabilities = a.capabilities, this._serverVersion = a.serverInfo, e.setProtocolVersion && e.setProtocolVersion(a.protocolVersion), this._instructions = a.instructions, await this.notification({
          method: "notifications/initialized"
        });
      } catch (a) {
        throw this.close(), a;
      }
  }
  /**
   * After initialization has completed, this will be populated with the server's reported capabilities.
   */
  getServerCapabilities() {
    return this._serverCapabilities;
  }
  /**
   * After initialization has completed, this will be populated with information about the server's name and version.
   */
  getServerVersion() {
    return this._serverVersion;
  }
  /**
   * After initialization has completed, this may be populated with information about the server's instructions.
   */
  getInstructions() {
    return this._instructions;
  }
  assertCapabilityForMethod(e) {
    var r, a, n, s, o;
    switch (e) {
      case "logging/setLevel":
        if (!(!((r = this._serverCapabilities) === null || r === void 0) && r.logging))
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "prompts/get":
      case "prompts/list":
        if (!(!((a = this._serverCapabilities) === null || a === void 0) && a.prompts))
          throw new Error(`Server does not support prompts (required for ${e})`);
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
      case "resources/subscribe":
      case "resources/unsubscribe":
        if (!(!((n = this._serverCapabilities) === null || n === void 0) && n.resources))
          throw new Error(`Server does not support resources (required for ${e})`);
        if (e === "resources/subscribe" && !this._serverCapabilities.resources.subscribe)
          throw new Error(`Server does not support resource subscriptions (required for ${e})`);
        break;
      case "tools/call":
      case "tools/list":
        if (!(!((s = this._serverCapabilities) === null || s === void 0) && s.tools))
          throw new Error(`Server does not support tools (required for ${e})`);
        break;
      case "completion/complete":
        if (!(!((o = this._serverCapabilities) === null || o === void 0) && o.completions))
          throw new Error(`Server does not support completions (required for ${e})`);
        break;
    }
  }
  assertNotificationCapability(e) {
    var r;
    switch (e) {
      case "notifications/roots/list_changed":
        if (!(!((r = this._capabilities.roots) === null || r === void 0) && r.listChanged))
          throw new Error(`Client does not support roots list changed notifications (required for ${e})`);
        break;
    }
  }
  assertRequestHandlerCapability(e) {
    switch (e) {
      case "sampling/createMessage":
        if (!this._capabilities.sampling)
          throw new Error(`Client does not support sampling capability (required for ${e})`);
        break;
      case "elicitation/create":
        if (!this._capabilities.elicitation)
          throw new Error(`Client does not support elicitation capability (required for ${e})`);
        break;
      case "roots/list":
        if (!this._capabilities.roots)
          throw new Error(`Client does not support roots capability (required for ${e})`);
        break;
    }
  }
  async ping(e) {
    return this.request({ method: "ping" }, Fr, e);
  }
  async complete(e, r) {
    return this.request({ method: "completion/complete", params: e }, ff, r);
  }
  async setLoggingLevel(e, r) {
    return this.request({ method: "logging/setLevel", params: { level: e } }, Fr, r);
  }
  async getPrompt(e, r) {
    return this.request({ method: "prompts/get", params: e }, lf, r);
  }
  async listPrompts(e, r) {
    return this.request({ method: "prompts/list", params: e }, sf, r);
  }
  async listResources(e, r) {
    return this.request({ method: "resources/list", params: e }, rf, r);
  }
  async listResourceTemplates(e, r) {
    return this.request({ method: "resources/templates/list", params: e }, nf, r);
  }
  async readResource(e, r) {
    return this.request({ method: "resources/read", params: e }, af, r);
  }
  async subscribeResource(e, r) {
    return this.request({ method: "resources/subscribe", params: e }, Fr, r);
  }
  async unsubscribeResource(e, r) {
    return this.request({ method: "resources/unsubscribe", params: e }, Fr, r);
  }
  async callTool(e, r = Ll, a) {
    const n = await this.request({ method: "tools/call", params: e }, r, a), s = this.getToolOutputValidator(e.name);
    if (s) {
      if (!n.structuredContent && !n.isError)
        throw new Ze(ze.InvalidRequest, `Tool ${e.name} has an output schema but did not return structured content`);
      if (n.structuredContent)
        try {
          if (!s(n.structuredContent))
            throw new Ze(ze.InvalidParams, `Structured content does not match the tool's output schema: ${this._ajv.errorsText(s.errors)}`);
        } catch (o) {
          throw o instanceof Ze ? o : new Ze(ze.InvalidParams, `Failed to validate structured content: ${o instanceof Error ? o.message : String(o)}`);
        }
    }
    return n;
  }
  cacheToolOutputSchemas(e) {
    this._cachedToolOutputValidators.clear();
    for (const r of e)
      if (r.outputSchema)
        try {
          const a = this._ajv.compile(r.outputSchema);
          this._cachedToolOutputValidators.set(r.name, a);
        } catch {
        }
  }
  getToolOutputValidator(e) {
    return this._cachedToolOutputValidators.get(e);
  }
  async listTools(e, r) {
    const a = await this.request({ method: "tools/list", params: e }, cf, r);
    return this.cacheToolOutputSchemas(a.tools), a;
  }
  async sendRootsListChanged() {
    return this.notification({ method: "notifications/roots/list_changed" });
  }
}
class ku extends Error {
  constructor(e, r) {
    super(e), this.name = "ParseError", this.type = r.type, this.field = r.field, this.value = r.value, this.line = r.line;
  }
}
function Uo(t) {
}
function Zf(t) {
  if (typeof t == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent: e = Uo, onError: r = Uo, onRetry: a = Uo, onComment: n } = t;
  let s = "", o = !0, i, l = "", c = "";
  function u(p) {
    const v = o ? p.replace(/^\xEF\xBB\xBF/, "") : p, [y, b] = ES(`${s}${v}`);
    for (const _ of y)
      d(_);
    s = b, o = !1;
  }
  function d(p) {
    if (p === "") {
      f();
      return;
    }
    if (p.startsWith(":")) {
      n && n(p.slice(p.startsWith(": ") ? 2 : 1));
      return;
    }
    const v = p.indexOf(":");
    if (v !== -1) {
      const y = p.slice(0, v), b = p[v + 1] === " " ? 2 : 1, _ = p.slice(v + b);
      h(y, _, p);
      return;
    }
    h(p, "", p);
  }
  function h(p, v, y) {
    switch (p) {
      case "event":
        c = v;
        break;
      case "data":
        l = `${l}${v}
`;
        break;
      case "id":
        i = v.includes("\0") ? void 0 : v;
        break;
      case "retry":
        /^\d+$/.test(v) ? a(parseInt(v, 10)) : r(
          new ku(`Invalid \`retry\` value: "${v}"`, {
            type: "invalid-retry",
            value: v,
            line: y
          })
        );
        break;
      default:
        r(
          new ku(
            `Unknown field "${p.length > 20 ? `${p.slice(0, 20)}…` : p}"`,
            { type: "unknown-field", field: p, value: v, line: y }
          )
        );
        break;
    }
  }
  function f() {
    l.length > 0 && e({
      id: i,
      event: c || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: l.endsWith(`
`) ? l.slice(0, -1) : l
    }), i = void 0, l = "", c = "";
  }
  function m(p = {}) {
    s && p.consume && d(s), o = !0, i = void 0, l = "", c = "", s = "";
  }
  return { feed: u, reset: m };
}
function ES(t) {
  const e = [];
  let r = "", a = 0;
  for (; a < t.length; ) {
    const n = t.indexOf("\r", a), s = t.indexOf(`
`, a);
    let o = -1;
    if (n !== -1 && s !== -1 ? o = Math.min(n, s) : n !== -1 ? o = n : s !== -1 && (o = s), o === -1) {
      r = t.slice(a);
      break;
    } else {
      const i = t.slice(a, o);
      e.push(i), a = o + 1, t[a - 1] === "\r" && t[a] === `
` && a++;
    }
  }
  return [e, r];
}
class Iu extends Event {
  /**
   * Constructs a new `ErrorEvent` instance. This is typically not called directly,
   * but rather emitted by the `EventSource` object when an error occurs.
   *
   * @param type - The type of the event (should be "error")
   * @param errorEventInitDict - Optional properties to include in the error event
   */
  constructor(e, r) {
    var a, n;
    super(e), this.code = (a = r == null ? void 0 : r.code) != null ? a : void 0, this.message = (n = r == null ? void 0 : r.message) != null ? n : void 0;
  }
  /**
   * Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Node.js when you `console.log` an instance of this class.
   *
   * @param _depth - The current depth
   * @param options - The options passed to `util.inspect`
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @returns A string representation of the error
   */
  [Symbol.for("nodejs.util.inspect.custom")](e, r, a) {
    return a(Ru(this), r);
  }
  /**
   * Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Deno when you `console.log` an instance of this class.
   *
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @param options - The options passed to `Deno.inspect`
   * @returns A string representation of the error
   */
  [Symbol.for("Deno.customInspect")](e, r) {
    return e(Ru(this), r);
  }
}
function SS(t) {
  const e = globalThis.DOMException;
  return typeof e == "function" ? new e(t, "SyntaxError") : new SyntaxError(t);
}
function Li(t) {
  return t instanceof Error ? "errors" in t && Array.isArray(t.errors) ? t.errors.map(Li).join(", ") : "cause" in t && t.cause instanceof Error ? `${t}: ${Li(t.cause)}` : t.message : `${t}`;
}
function Ru(t) {
  return {
    type: t.type,
    message: t.message,
    code: t.code,
    defaultPrevented: t.defaultPrevented,
    cancelable: t.cancelable,
    timeStamp: t.timeStamp
  };
}
var Wf = (t) => {
  throw TypeError(t);
}, Zl = (t, e, r) => e.has(t) || Wf("Cannot " + r), xe = (t, e, r) => (Zl(t, e, "read from private field"), r ? r.call(t) : e.get(t)), ut = (t, e, r) => e.has(t) ? Wf("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), Ge = (t, e, r, a) => (Zl(t, e, "write to private field"), e.set(t, r), r), vr = (t, e, r) => (Zl(t, e, "access private method"), r), Lt, en, bn, Wa, _s, ia, Pn, la, $r, wn, Cn, En, Xn, Qt, Ni, $i, Mi, Tu, Fi, ji, ea, Bi, Ui;
class Ja extends EventTarget {
  constructor(e, r) {
    var a, n;
    super(), ut(this, Qt), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, ut(this, Lt), ut(this, en), ut(this, bn), ut(this, Wa), ut(this, _s), ut(this, ia), ut(this, Pn), ut(this, la, null), ut(this, $r), ut(this, wn), ut(this, Cn, null), ut(this, En, null), ut(this, Xn, null), ut(this, $i, async (s) => {
      var o;
      xe(this, wn).reset();
      const { body: i, redirected: l, status: c, headers: u } = s;
      if (c === 204) {
        vr(this, Qt, ea).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
        return;
      }
      if (l ? Ge(this, bn, new URL(s.url)) : Ge(this, bn, void 0), c !== 200) {
        vr(this, Qt, ea).call(this, `Non-200 status code (${c})`, c);
        return;
      }
      if (!(u.get("content-type") || "").startsWith("text/event-stream")) {
        vr(this, Qt, ea).call(this, 'Invalid content type, expected "text/event-stream"', c);
        return;
      }
      if (xe(this, Lt) === this.CLOSED)
        return;
      Ge(this, Lt, this.OPEN);
      const d = new Event("open");
      if ((o = xe(this, Xn)) == null || o.call(this, d), this.dispatchEvent(d), typeof i != "object" || !i || !("getReader" in i)) {
        vr(this, Qt, ea).call(this, "Invalid response body, expected a web ReadableStream", c), this.close();
        return;
      }
      const h = new TextDecoder(), f = i.getReader();
      let m = !0;
      do {
        const { done: p, value: v } = await f.read();
        v && xe(this, wn).feed(h.decode(v, { stream: !p })), p && (m = !1, xe(this, wn).reset(), vr(this, Qt, Bi).call(this));
      } while (m);
    }), ut(this, Mi, (s) => {
      Ge(this, $r, void 0), !(s.name === "AbortError" || s.type === "aborted") && vr(this, Qt, Bi).call(this, Li(s));
    }), ut(this, Fi, (s) => {
      typeof s.id == "string" && Ge(this, la, s.id);
      const o = new MessageEvent(s.event || "message", {
        data: s.data,
        origin: xe(this, bn) ? xe(this, bn).origin : xe(this, en).origin,
        lastEventId: s.id || ""
      });
      xe(this, En) && (!s.event || s.event === "message") && xe(this, En).call(this, o), this.dispatchEvent(o);
    }), ut(this, ji, (s) => {
      Ge(this, ia, s);
    }), ut(this, Ui, () => {
      Ge(this, Pn, void 0), xe(this, Lt) === this.CONNECTING && vr(this, Qt, Ni).call(this);
    });
    try {
      if (e instanceof URL)
        Ge(this, en, e);
      else if (typeof e == "string")
        Ge(this, en, new URL(e, PS()));
      else
        throw new Error("Invalid URL");
    } catch {
      throw SS("An invalid or illegal string was specified");
    }
    Ge(this, wn, Zf({
      onEvent: xe(this, Fi),
      onRetry: xe(this, ji)
    })), Ge(this, Lt, this.CONNECTING), Ge(this, ia, 3e3), Ge(this, _s, (a = r == null ? void 0 : r.fetch) != null ? a : globalThis.fetch), Ge(this, Wa, (n = r == null ? void 0 : r.withCredentials) != null ? n : !1), vr(this, Qt, Ni).call(this);
  }
  /**
   * Returns the state of this EventSource object's connection. It can have the values described below.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/readyState)
   *
   * Note: typed as `number` instead of `0 | 1 | 2` for compatibility with the `EventSource` interface,
   * defined in the TypeScript `dom` library.
   *
   * @public
   */
  get readyState() {
    return xe(this, Lt);
  }
  /**
   * Returns the URL providing the event stream.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/url)
   *
   * @public
   */
  get url() {
    return xe(this, en).href;
  }
  /**
   * Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/withCredentials)
   */
  get withCredentials() {
    return xe(this, Wa);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/error_event) */
  get onerror() {
    return xe(this, Cn);
  }
  set onerror(e) {
    Ge(this, Cn, e);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/message_event) */
  get onmessage() {
    return xe(this, En);
  }
  set onmessage(e) {
    Ge(this, En, e);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/open_event) */
  get onopen() {
    return xe(this, Xn);
  }
  set onopen(e) {
    Ge(this, Xn, e);
  }
  addEventListener(e, r, a) {
    const n = r;
    super.addEventListener(e, n, a);
  }
  removeEventListener(e, r, a) {
    const n = r;
    super.removeEventListener(e, n, a);
  }
  /**
   * Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/close)
   *
   * @public
   */
  close() {
    xe(this, Pn) && clearTimeout(xe(this, Pn)), xe(this, Lt) !== this.CLOSED && (xe(this, $r) && xe(this, $r).abort(), Ge(this, Lt, this.CLOSED), Ge(this, $r, void 0));
  }
}
Lt = /* @__PURE__ */ new WeakMap(), en = /* @__PURE__ */ new WeakMap(), bn = /* @__PURE__ */ new WeakMap(), Wa = /* @__PURE__ */ new WeakMap(), _s = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakMap(), Pn = /* @__PURE__ */ new WeakMap(), la = /* @__PURE__ */ new WeakMap(), $r = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ new WeakMap(), En = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), Qt = /* @__PURE__ */ new WeakSet(), /**
* Connect to the given URL and start receiving events
*
* @internal
*/
Ni = function() {
  Ge(this, Lt, this.CONNECTING), Ge(this, $r, new AbortController()), xe(this, _s)(xe(this, en), vr(this, Qt, Tu).call(this)).then(xe(this, $i)).catch(xe(this, Mi));
}, $i = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap(), /**
* Get request options for the `fetch()` request
*
* @returns The request options
* @internal
*/
Tu = function() {
  var t;
  const e = {
    // [spec] Let `corsAttributeState` be `Anonymous`…
    // [spec] …will have their mode set to "cors"…
    mode: "cors",
    redirect: "follow",
    headers: { Accept: "text/event-stream", ...xe(this, la) ? { "Last-Event-ID": xe(this, la) } : void 0 },
    cache: "no-store",
    signal: (t = xe(this, $r)) == null ? void 0 : t.signal
  };
  return "window" in globalThis && (e.credentials = this.withCredentials ? "include" : "same-origin"), e;
}, Fi = /* @__PURE__ */ new WeakMap(), ji = /* @__PURE__ */ new WeakMap(), /**
* Handles the process referred to in the EventSource specification as "failing a connection".
*
* @param error - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
ea = function(t, e) {
  var r;
  xe(this, Lt) !== this.CLOSED && Ge(this, Lt, this.CLOSED);
  const a = new Iu("error", { code: e, message: t });
  (r = xe(this, Cn)) == null || r.call(this, a), this.dispatchEvent(a);
}, /**
* Schedules a reconnection attempt against the EventSource endpoint.
*
* @param message - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
Bi = function(t, e) {
  var r;
  if (xe(this, Lt) === this.CLOSED)
    return;
  Ge(this, Lt, this.CONNECTING);
  const a = new Iu("error", { code: e, message: t });
  (r = xe(this, Cn)) == null || r.call(this, a), this.dispatchEvent(a), Ge(this, Pn, setTimeout(xe(this, Ui), xe(this, ia)));
}, Ui = /* @__PURE__ */ new WeakMap(), /**
* ReadyState representing an EventSource currently trying to connect
*
* @public
*/
Ja.CONNECTING = 0, /**
* ReadyState representing an EventSource connection that is open (eg connected)
*
* @public
*/
Ja.OPEN = 1, /**
* ReadyState representing an EventSource connection that is closed (eg disconnected)
*
* @public
*/
Ja.CLOSED = 2;
function PS() {
  const t = "document" in globalThis ? globalThis.document : void 0;
  return t && typeof t == "object" && "baseURI" in t && typeof t.baseURI == "string" ? t.baseURI : void 0;
}
let Wl;
Wl = globalThis.crypto;
async function xS(t) {
  return (await Wl).getRandomValues(new Uint8Array(t));
}
async function CS(t) {
  const e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  let r = "";
  const a = await xS(t);
  for (let n = 0; n < t; n++) {
    const s = a[n] % e.length;
    r += e[s];
  }
  return r;
}
async function kS(t) {
  return await CS(t);
}
async function IS(t) {
  const e = await (await Wl).subtle.digest("SHA-256", new TextEncoder().encode(t));
  return btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
}
async function RS(t) {
  if (t || (t = 43), t < 43 || t > 128)
    throw `Expected a length between 43 and 128. Received ${t}.`;
  const e = await kS(t), r = await IS(e);
  return {
    code_verifier: e,
    code_challenge: r
  };
}
const TS = W({
  resource: x().url(),
  authorization_servers: X(x().url()).optional(),
  jwks_uri: x().url().optional(),
  scopes_supported: X(x()).optional(),
  bearer_methods_supported: X(x()).optional(),
  resource_signing_alg_values_supported: X(x()).optional(),
  resource_name: x().optional(),
  resource_documentation: x().optional(),
  resource_policy_uri: x().url().optional(),
  resource_tos_uri: x().url().optional(),
  tls_client_certificate_bound_access_tokens: ht().optional(),
  authorization_details_types_supported: X(x()).optional(),
  dpop_signing_alg_values_supported: X(x()).optional(),
  dpop_bound_access_tokens_required: ht().optional()
}).passthrough(), Jf = W({
  issuer: x(),
  authorization_endpoint: x(),
  token_endpoint: x(),
  registration_endpoint: x().optional(),
  scopes_supported: X(x()).optional(),
  response_types_supported: X(x()),
  response_modes_supported: X(x()).optional(),
  grant_types_supported: X(x()).optional(),
  token_endpoint_auth_methods_supported: X(x()).optional(),
  token_endpoint_auth_signing_alg_values_supported: X(x()).optional(),
  service_documentation: x().optional(),
  revocation_endpoint: x().optional(),
  revocation_endpoint_auth_methods_supported: X(x()).optional(),
  revocation_endpoint_auth_signing_alg_values_supported: X(x()).optional(),
  introspection_endpoint: x().optional(),
  introspection_endpoint_auth_methods_supported: X(x()).optional(),
  introspection_endpoint_auth_signing_alg_values_supported: X(x()).optional(),
  code_challenge_methods_supported: X(x()).optional()
}).passthrough(), AS = W({
  issuer: x(),
  authorization_endpoint: x(),
  token_endpoint: x(),
  userinfo_endpoint: x().optional(),
  jwks_uri: x(),
  registration_endpoint: x().optional(),
  scopes_supported: X(x()).optional(),
  response_types_supported: X(x()),
  response_modes_supported: X(x()).optional(),
  grant_types_supported: X(x()).optional(),
  acr_values_supported: X(x()).optional(),
  subject_types_supported: X(x()),
  id_token_signing_alg_values_supported: X(x()),
  id_token_encryption_alg_values_supported: X(x()).optional(),
  id_token_encryption_enc_values_supported: X(x()).optional(),
  userinfo_signing_alg_values_supported: X(x()).optional(),
  userinfo_encryption_alg_values_supported: X(x()).optional(),
  userinfo_encryption_enc_values_supported: X(x()).optional(),
  request_object_signing_alg_values_supported: X(x()).optional(),
  request_object_encryption_alg_values_supported: X(x()).optional(),
  request_object_encryption_enc_values_supported: X(x()).optional(),
  token_endpoint_auth_methods_supported: X(x()).optional(),
  token_endpoint_auth_signing_alg_values_supported: X(x()).optional(),
  display_values_supported: X(x()).optional(),
  claim_types_supported: X(x()).optional(),
  claims_supported: X(x()).optional(),
  service_documentation: x().optional(),
  claims_locales_supported: X(x()).optional(),
  ui_locales_supported: X(x()).optional(),
  claims_parameter_supported: ht().optional(),
  request_parameter_supported: ht().optional(),
  request_uri_parameter_supported: ht().optional(),
  require_request_uri_registration: ht().optional(),
  op_policy_uri: x().optional(),
  op_tos_uri: x().optional()
}).passthrough(), OS = AS.merge(Jf.pick({
  code_challenge_methods_supported: !0
})), Qf = W({
  access_token: x(),
  id_token: x().optional(),
  // Optional for OAuth 2.1, but necessary in OpenID Connect
  token_type: x(),
  expires_in: _t().optional(),
  scope: x().optional(),
  refresh_token: x().optional()
}).strip(), DS = W({
  error: x(),
  error_description: x().optional(),
  error_uri: x().optional()
}), LS = W({
  redirect_uris: X(x()).refine((t) => t.every((e) => URL.canParse(e)), { message: "redirect_uris must contain valid URLs" }),
  token_endpoint_auth_method: x().optional(),
  grant_types: X(x()).optional(),
  response_types: X(x()).optional(),
  client_name: x().optional(),
  client_uri: x().optional(),
  logo_uri: x().optional(),
  scope: x().optional(),
  contacts: X(x()).optional(),
  tos_uri: x().optional(),
  policy_uri: x().optional(),
  jwks_uri: x().optional(),
  jwks: fw().optional(),
  software_id: x().optional(),
  software_version: x().optional(),
  software_statement: x().optional()
}).strip(), NS = W({
  client_id: x(),
  client_secret: x().optional(),
  client_id_issued_at: _t().optional(),
  client_secret_expires_at: _t().optional()
}).strip(), $S = LS.merge(NS);
W({
  error: x(),
  error_description: x().optional()
}).strip();
W({
  token: x(),
  token_type_hint: x().optional()
}).strip();
function MS(t) {
  const e = typeof t == "string" ? new URL(t) : new URL(t.href);
  return e.hash = "", e;
}
function FS({ requestedResource: t, configuredResource: e }) {
  const r = typeof t == "string" ? new URL(t) : new URL(t.href), a = typeof e == "string" ? new URL(e) : new URL(e.href);
  if (r.origin !== a.origin || r.pathname.length < a.pathname.length)
    return !1;
  const n = r.pathname.endsWith("/") ? r.pathname : r.pathname + "/", s = a.pathname.endsWith("/") ? a.pathname : a.pathname + "/";
  return n.startsWith(s);
}
class wt extends Error {
  constructor(e, r) {
    super(e), this.errorUri = r, this.name = this.constructor.name;
  }
  /**
   * Converts the error to a standard OAuth error response object
   */
  toResponseObject() {
    const e = {
      error: this.errorCode,
      error_description: this.message
    };
    return this.errorUri && (e.error_uri = this.errorUri), e;
  }
  get errorCode() {
    return this.constructor.errorCode;
  }
}
class Vi extends wt {
}
Vi.errorCode = "invalid_request";
class ys extends wt {
}
ys.errorCode = "invalid_client";
class bs extends wt {
}
bs.errorCode = "invalid_grant";
class ws extends wt {
}
ws.errorCode = "unauthorized_client";
class zi extends wt {
}
zi.errorCode = "unsupported_grant_type";
class qi extends wt {
}
qi.errorCode = "invalid_scope";
class Hi extends wt {
}
Hi.errorCode = "access_denied";
class $n extends wt {
}
$n.errorCode = "server_error";
class Zi extends wt {
}
Zi.errorCode = "temporarily_unavailable";
class Wi extends wt {
}
Wi.errorCode = "unsupported_response_type";
class Ji extends wt {
}
Ji.errorCode = "unsupported_token_type";
class Qi extends wt {
}
Qi.errorCode = "invalid_token";
class Gi extends wt {
}
Gi.errorCode = "method_not_allowed";
class Ki extends wt {
}
Ki.errorCode = "too_many_requests";
class Yi extends wt {
}
Yi.errorCode = "invalid_client_metadata";
class Xi extends wt {
}
Xi.errorCode = "insufficient_scope";
const jS = {
  [Vi.errorCode]: Vi,
  [ys.errorCode]: ys,
  [bs.errorCode]: bs,
  [ws.errorCode]: ws,
  [zi.errorCode]: zi,
  [qi.errorCode]: qi,
  [Hi.errorCode]: Hi,
  [$n.errorCode]: $n,
  [Zi.errorCode]: Zi,
  [Wi.errorCode]: Wi,
  [Ji.errorCode]: Ji,
  [Qi.errorCode]: Qi,
  [Gi.errorCode]: Gi,
  [Ki.errorCode]: Ki,
  [Yi.errorCode]: Yi,
  [Xi.errorCode]: Xi
};
class rr extends Error {
  constructor(e) {
    super(e ?? "Unauthorized");
  }
}
function Gf(t, e) {
  const r = t.client_secret !== void 0;
  return e.length === 0 ? r ? "client_secret_post" : "none" : r && e.includes("client_secret_basic") ? "client_secret_basic" : r && e.includes("client_secret_post") ? "client_secret_post" : e.includes("none") ? "none" : r ? "client_secret_post" : "none";
}
function Kf(t, e, r, a) {
  const { client_id: n, client_secret: s } = e;
  switch (t) {
    case "client_secret_basic":
      BS(n, s, r);
      return;
    case "client_secret_post":
      US(n, s, a);
      return;
    case "none":
      VS(n, a);
      return;
    default:
      throw new Error(`Unsupported client authentication method: ${t}`);
  }
}
function BS(t, e, r) {
  if (!e)
    throw new Error("client_secret_basic authentication requires a client_secret");
  const a = btoa(`${t}:${e}`);
  r.set("Authorization", `Basic ${a}`);
}
function US(t, e, r) {
  r.set("client_id", t), e && r.set("client_secret", e);
}
function VS(t, e) {
  e.set("client_id", t);
}
async function Jl(t) {
  const e = t instanceof Response ? t.status : void 0, r = t instanceof Response ? await t.text() : t;
  try {
    const a = DS.parse(JSON.parse(r)), { error: n, error_description: s, error_uri: o } = a, i = jS[n] || $n;
    return new i(s || "", o);
  } catch (a) {
    const n = `${e ? `HTTP ${e}: ` : ""}Invalid OAuth error response: ${a}. Raw body: ${r}`;
    return new $n(n);
  }
}
async function kn(t, e) {
  var r, a;
  try {
    return await Vo(t, e);
  } catch (n) {
    if (n instanceof ys || n instanceof ws)
      return await ((r = t.invalidateCredentials) === null || r === void 0 ? void 0 : r.call(t, "all")), await Vo(t, e);
    if (n instanceof bs)
      return await ((a = t.invalidateCredentials) === null || a === void 0 ? void 0 : a.call(t, "tokens")), await Vo(t, e);
    throw n;
  }
}
async function Vo(t, { serverUrl: e, authorizationCode: r, scope: a, resourceMetadataUrl: n, fetchFn: s }) {
  let o, i;
  try {
    o = await qS(e, { resourceMetadataUrl: n }, s), o.authorization_servers && o.authorization_servers.length > 0 && (i = o.authorization_servers[0]);
  } catch {
  }
  i || (i = e);
  const l = await zS(e, t, o), c = await QS(i, {
    fetchFn: s
  });
  let u = await Promise.resolve(t.clientInformation());
  if (!u) {
    if (r !== void 0)
      throw new Error("Existing OAuth client information is required when exchanging an authorization code");
    if (!t.saveClientInformation)
      throw new Error("OAuth client information must be saveable for dynamic registration");
    const p = await XS(i, {
      metadata: c,
      clientMetadata: t.clientMetadata
    });
    await t.saveClientInformation(p), u = p;
  }
  if (r !== void 0) {
    const p = await t.codeVerifier(), v = await KS(i, {
      metadata: c,
      clientInformation: u,
      authorizationCode: r,
      codeVerifier: p,
      redirectUri: t.redirectUrl,
      resource: l,
      addClientAuthentication: t.addClientAuthentication,
      fetchFn: s
    });
    return await t.saveTokens(v), "AUTHORIZED";
  }
  const d = await t.tokens();
  if (d != null && d.refresh_token)
    try {
      const p = await YS(i, {
        metadata: c,
        clientInformation: u,
        refreshToken: d.refresh_token,
        resource: l,
        addClientAuthentication: t.addClientAuthentication
      });
      return await t.saveTokens(p), "AUTHORIZED";
    } catch (p) {
      if (!(!(p instanceof wt) || p instanceof $n)) throw p;
    }
  const h = t.state ? await t.state() : void 0, { authorizationUrl: f, codeVerifier: m } = await GS(i, {
    metadata: c,
    clientInformation: u,
    state: h,
    redirectUrl: t.redirectUrl,
    scope: a || t.clientMetadata.scope,
    resource: l
  });
  return await t.saveCodeVerifier(m), await t.redirectToAuthorization(f), "REDIRECT";
}
async function zS(t, e, r) {
  const a = MS(t);
  if (e.validateResourceURL)
    return await e.validateResourceURL(a, r == null ? void 0 : r.resource);
  if (r) {
    if (!FS({ requestedResource: a, configuredResource: r.resource }))
      throw new Error(`Protected resource ${r.resource} does not match expected ${a} (or origin)`);
    return new URL(r.resource);
  }
}
function el(t) {
  const e = t.headers.get("WWW-Authenticate");
  if (!e)
    return;
  const [r, a] = e.split(" ");
  if (r.toLowerCase() !== "bearer" || !a)
    return;
  const s = /resource_metadata="([^"]*)"/.exec(e);
  if (s)
    try {
      return new URL(s[1]);
    } catch {
      return;
    }
}
async function qS(t, e, r = fetch) {
  const a = await WS(t, "oauth-protected-resource", r, {
    protocolVersion: e == null ? void 0 : e.protocolVersion,
    metadataUrl: e == null ? void 0 : e.resourceMetadataUrl
  });
  if (!a || a.status === 404)
    throw new Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
  if (!a.ok)
    throw new Error(`HTTP ${a.status} trying to load well-known OAuth protected resource metadata.`);
  return TS.parse(await a.json());
}
async function Ql(t, e, r = fetch) {
  try {
    return await r(t, { headers: e });
  } catch (a) {
    if (a instanceof TypeError)
      return e ? Ql(t, void 0, r) : void 0;
    throw a;
  }
}
function HS(t, e = "", r = {}) {
  return e.endsWith("/") && (e = e.slice(0, -1)), r.prependPathname ? `${e}/.well-known/${t}` : `/.well-known/${t}${e}`;
}
async function Au(t, e, r = fetch) {
  return await Ql(t, {
    "MCP-Protocol-Version": e
  }, r);
}
function ZS(t, e) {
  return !t || t.status === 404 && e !== "/";
}
async function WS(t, e, r, a) {
  var n, s;
  const o = new URL(t), i = (n = a == null ? void 0 : a.protocolVersion) !== null && n !== void 0 ? n : ga;
  let l;
  if (a != null && a.metadataUrl)
    l = new URL(a.metadataUrl);
  else {
    const u = HS(e, o.pathname);
    l = new URL(u, (s = a == null ? void 0 : a.metadataServerUrl) !== null && s !== void 0 ? s : o), l.search = o.search;
  }
  let c = await Au(l, i, r);
  if (!(a != null && a.metadataUrl) && ZS(c, o.pathname)) {
    const u = new URL(`/.well-known/${e}`, o);
    c = await Au(u, i, r);
  }
  return c;
}
function JS(t) {
  const e = typeof t == "string" ? new URL(t) : t, r = e.pathname !== "/", a = [];
  if (!r)
    return a.push({
      url: new URL("/.well-known/oauth-authorization-server", e.origin),
      type: "oauth"
    }), a.push({
      url: new URL("/.well-known/openid-configuration", e.origin),
      type: "oidc"
    }), a;
  let n = e.pathname;
  return n.endsWith("/") && (n = n.slice(0, -1)), a.push({
    url: new URL(`/.well-known/oauth-authorization-server${n}`, e.origin),
    type: "oauth"
  }), a.push({
    url: new URL("/.well-known/oauth-authorization-server", e.origin),
    type: "oauth"
  }), a.push({
    url: new URL(`/.well-known/openid-configuration${n}`, e.origin),
    type: "oidc"
  }), a.push({
    url: new URL(`${n}/.well-known/openid-configuration`, e.origin),
    type: "oidc"
  }), a;
}
async function QS(t, { fetchFn: e = fetch, protocolVersion: r = ga } = {}) {
  var a;
  const n = { "MCP-Protocol-Version": r }, s = JS(t);
  for (const { url: o, type: i } of s) {
    const l = await Ql(o, n, e);
    if (!l)
      throw new Error(`CORS error trying to load ${i === "oauth" ? "OAuth" : "OpenID provider"} metadata from ${o}`);
    if (!l.ok) {
      if (l.status >= 400 && l.status < 500)
        continue;
      throw new Error(`HTTP ${l.status} trying to load ${i === "oauth" ? "OAuth" : "OpenID provider"} metadata from ${o}`);
    }
    if (i === "oauth")
      return Jf.parse(await l.json());
    {
      const c = OS.parse(await l.json());
      if (!(!((a = c.code_challenge_methods_supported) === null || a === void 0) && a.includes("S256")))
        throw new Error(`Incompatible OIDC provider at ${o}: does not support S256 code challenge method required by MCP specification`);
      return c;
    }
  }
}
async function GS(t, { metadata: e, clientInformation: r, redirectUrl: a, scope: n, state: s, resource: o }) {
  const i = "code", l = "S256";
  let c;
  if (e) {
    if (c = new URL(e.authorization_endpoint), !e.response_types_supported.includes(i))
      throw new Error(`Incompatible auth server: does not support response type ${i}`);
    if (!e.code_challenge_methods_supported || !e.code_challenge_methods_supported.includes(l))
      throw new Error(`Incompatible auth server: does not support code challenge method ${l}`);
  } else
    c = new URL("/authorize", t);
  const u = await RS(), d = u.code_verifier, h = u.code_challenge;
  return c.searchParams.set("response_type", i), c.searchParams.set("client_id", r.client_id), c.searchParams.set("code_challenge", h), c.searchParams.set("code_challenge_method", l), c.searchParams.set("redirect_uri", String(a)), s && c.searchParams.set("state", s), n && c.searchParams.set("scope", n), n != null && n.includes("offline_access") && c.searchParams.append("prompt", "consent"), o && c.searchParams.set("resource", o.href), { authorizationUrl: c, codeVerifier: d };
}
async function KS(t, { metadata: e, clientInformation: r, authorizationCode: a, codeVerifier: n, redirectUri: s, resource: o, addClientAuthentication: i, fetchFn: l }) {
  var c;
  const u = "authorization_code", d = e != null && e.token_endpoint ? new URL(e.token_endpoint) : new URL("/token", t);
  if (e != null && e.grant_types_supported && !e.grant_types_supported.includes(u))
    throw new Error(`Incompatible auth server: does not support grant type ${u}`);
  const h = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json"
  }), f = new URLSearchParams({
    grant_type: u,
    code: a,
    code_verifier: n,
    redirect_uri: String(s)
  });
  if (i)
    i(h, f, t, e);
  else {
    const p = (c = e == null ? void 0 : e.token_endpoint_auth_methods_supported) !== null && c !== void 0 ? c : [], v = Gf(r, p);
    Kf(v, r, h, f);
  }
  o && f.set("resource", o.href);
  const m = await (l ?? fetch)(d, {
    method: "POST",
    headers: h,
    body: f
  });
  if (!m.ok)
    throw await Jl(m);
  return Qf.parse(await m.json());
}
async function YS(t, { metadata: e, clientInformation: r, refreshToken: a, resource: n, addClientAuthentication: s, fetchFn: o }) {
  var i;
  const l = "refresh_token";
  let c;
  if (e) {
    if (c = new URL(e.token_endpoint), e.grant_types_supported && !e.grant_types_supported.includes(l))
      throw new Error(`Incompatible auth server: does not support grant type ${l}`);
  } else
    c = new URL("/token", t);
  const u = new Headers({
    "Content-Type": "application/x-www-form-urlencoded"
  }), d = new URLSearchParams({
    grant_type: l,
    refresh_token: a
  });
  if (s)
    s(u, d, t, e);
  else {
    const f = (i = e == null ? void 0 : e.token_endpoint_auth_methods_supported) !== null && i !== void 0 ? i : [], m = Gf(r, f);
    Kf(m, r, u, d);
  }
  n && d.set("resource", n.href);
  const h = await (o ?? fetch)(c, {
    method: "POST",
    headers: u,
    body: d
  });
  if (!h.ok)
    throw await Jl(h);
  return Qf.parse({ refresh_token: a, ...await h.json() });
}
async function XS(t, { metadata: e, clientMetadata: r, fetchFn: a }) {
  let n;
  if (e) {
    if (!e.registration_endpoint)
      throw new Error("Incompatible auth server: does not support dynamic client registration");
    n = new URL(e.registration_endpoint);
  } else
    n = new URL("/register", t);
  const s = await (a ?? fetch)(n, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(r)
  });
  if (!s.ok)
    throw await Jl(s);
  return $S.parse(await s.json());
}
class eP extends Error {
  constructor(e, r, a) {
    super(`SSE error: ${r}`), this.code = e, this.event = a;
  }
}
class tP {
  constructor(e, r) {
    this._url = e, this._resourceMetadataUrl = void 0, this._eventSourceInit = r == null ? void 0 : r.eventSourceInit, this._requestInit = r == null ? void 0 : r.requestInit, this._authProvider = r == null ? void 0 : r.authProvider, this._fetch = r == null ? void 0 : r.fetch;
  }
  async _authThenStart() {
    var e;
    if (!this._authProvider)
      throw new rr("No auth provider");
    let r;
    try {
      r = await kn(this._authProvider, { serverUrl: this._url, resourceMetadataUrl: this._resourceMetadataUrl, fetchFn: this._fetch });
    } catch (a) {
      throw (e = this.onerror) === null || e === void 0 || e.call(this, a), a;
    }
    if (r !== "AUTHORIZED")
      throw new rr();
    return await this._startOrAuth();
  }
  async _commonHeaders() {
    var e;
    const r = {};
    if (this._authProvider) {
      const a = await this._authProvider.tokens();
      a && (r.Authorization = `Bearer ${a.access_token}`);
    }
    return this._protocolVersion && (r["mcp-protocol-version"] = this._protocolVersion), new Headers({ ...r, ...(e = this._requestInit) === null || e === void 0 ? void 0 : e.headers });
  }
  _startOrAuth() {
    var e, r, a;
    const n = (a = (r = (e = this === null || this === void 0 ? void 0 : this._eventSourceInit) === null || e === void 0 ? void 0 : e.fetch) !== null && r !== void 0 ? r : this._fetch) !== null && a !== void 0 ? a : fetch;
    return new Promise((s, o) => {
      this._eventSource = new Ja(this._url.href, {
        ...this._eventSourceInit,
        fetch: async (i, l) => {
          const c = await this._commonHeaders();
          c.set("Accept", "text/event-stream");
          const u = await n(i, {
            ...l,
            headers: c
          });
          return u.status === 401 && u.headers.has("www-authenticate") && (this._resourceMetadataUrl = el(u)), u;
        }
      }), this._abortController = new AbortController(), this._eventSource.onerror = (i) => {
        var l;
        if (i.code === 401 && this._authProvider) {
          this._authThenStart().then(s, o);
          return;
        }
        const c = new eP(i.code, i.message, i);
        o(c), (l = this.onerror) === null || l === void 0 || l.call(this, c);
      }, this._eventSource.onopen = () => {
      }, this._eventSource.addEventListener("endpoint", (i) => {
        var l;
        const c = i;
        try {
          if (this._endpoint = new URL(c.data, this._url), this._endpoint.origin !== this._url.origin)
            throw new Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`);
        } catch (u) {
          o(u), (l = this.onerror) === null || l === void 0 || l.call(this, u), this.close();
          return;
        }
        s();
      }), this._eventSource.onmessage = (i) => {
        var l, c;
        const u = i;
        let d;
        try {
          d = oa.parse(JSON.parse(u.data));
        } catch (h) {
          (l = this.onerror) === null || l === void 0 || l.call(this, h);
          return;
        }
        (c = this.onmessage) === null || c === void 0 || c.call(this, d);
      };
    });
  }
  async start() {
    if (this._eventSource)
      throw new Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return await this._startOrAuth();
  }
  /**
   * Call this method after the user has finished authorizing via their user agent and is redirected back to the MCP client application. This will exchange the authorization code for an access token, enabling the next connection attempt to successfully auth.
   */
  async finishAuth(e) {
    if (!this._authProvider)
      throw new rr("No auth provider");
    if (await kn(this._authProvider, { serverUrl: this._url, authorizationCode: e, resourceMetadataUrl: this._resourceMetadataUrl, fetchFn: this._fetch }) !== "AUTHORIZED")
      throw new rr("Failed to authorize");
  }
  async close() {
    var e, r, a;
    (e = this._abortController) === null || e === void 0 || e.abort(), (r = this._eventSource) === null || r === void 0 || r.close(), (a = this.onclose) === null || a === void 0 || a.call(this);
  }
  async send(e) {
    var r, a, n;
    if (!this._endpoint)
      throw new Error("Not connected");
    try {
      const s = await this._commonHeaders();
      s.set("content-type", "application/json");
      const o = {
        ...this._requestInit,
        method: "POST",
        headers: s,
        body: JSON.stringify(e),
        signal: (r = this._abortController) === null || r === void 0 ? void 0 : r.signal
      }, i = await ((a = this._fetch) !== null && a !== void 0 ? a : fetch)(this._endpoint, o);
      if (!i.ok) {
        if (i.status === 401 && this._authProvider) {
          if (this._resourceMetadataUrl = el(i), await kn(this._authProvider, { serverUrl: this._url, resourceMetadataUrl: this._resourceMetadataUrl, fetchFn: this._fetch }) !== "AUTHORIZED")
            throw new rr();
          return this.send(e);
        }
        const l = await i.text().catch(() => null);
        throw new Error(`Error POSTing to endpoint (HTTP ${i.status}): ${l}`);
      }
    } catch (s) {
      throw (n = this.onerror) === null || n === void 0 || n.call(this, s), s;
    }
  }
  setProtocolVersion(e) {
    this._protocolVersion = e;
  }
}
class rP extends TransformStream {
  constructor({ onError: e, onRetry: r, onComment: a } = {}) {
    let n;
    super({
      start(s) {
        n = Zf({
          onEvent: (o) => {
            s.enqueue(o);
          },
          onError(o) {
            e === "terminate" ? s.error(o) : typeof e == "function" && e(o);
          },
          onRetry: r,
          onComment: a
        });
      },
      transform(s) {
        n.feed(s);
      }
    });
  }
}
const nP = {
  initialReconnectionDelay: 1e3,
  maxReconnectionDelay: 3e4,
  reconnectionDelayGrowFactor: 1.5,
  maxRetries: 2
};
class zo extends Error {
  constructor(e, r) {
    super(`Streamable HTTP error: ${r}`), this.code = e;
  }
}
class aP {
  constructor(e, r) {
    var a;
    this._url = e, this._resourceMetadataUrl = void 0, this._requestInit = r == null ? void 0 : r.requestInit, this._authProvider = r == null ? void 0 : r.authProvider, this._fetch = r == null ? void 0 : r.fetch, this._sessionId = r == null ? void 0 : r.sessionId, this._reconnectionOptions = (a = r == null ? void 0 : r.reconnectionOptions) !== null && a !== void 0 ? a : nP;
  }
  async _authThenStart() {
    var e;
    if (!this._authProvider)
      throw new rr("No auth provider");
    let r;
    try {
      r = await kn(this._authProvider, { serverUrl: this._url, resourceMetadataUrl: this._resourceMetadataUrl, fetchFn: this._fetch });
    } catch (a) {
      throw (e = this.onerror) === null || e === void 0 || e.call(this, a), a;
    }
    if (r !== "AUTHORIZED")
      throw new rr();
    return await this._startOrAuthSse({ resumptionToken: void 0 });
  }
  async _commonHeaders() {
    var e;
    const r = {};
    if (this._authProvider) {
      const n = await this._authProvider.tokens();
      n && (r.Authorization = `Bearer ${n.access_token}`);
    }
    this._sessionId && (r["mcp-session-id"] = this._sessionId), this._protocolVersion && (r["mcp-protocol-version"] = this._protocolVersion);
    const a = this._normalizeHeaders((e = this._requestInit) === null || e === void 0 ? void 0 : e.headers);
    return new Headers({
      ...r,
      ...a
    });
  }
  async _startOrAuthSse(e) {
    var r, a, n;
    const { resumptionToken: s } = e;
    try {
      const o = await this._commonHeaders();
      o.set("Accept", "text/event-stream"), s && o.set("last-event-id", s);
      const i = await ((r = this._fetch) !== null && r !== void 0 ? r : fetch)(this._url, {
        method: "GET",
        headers: o,
        signal: (a = this._abortController) === null || a === void 0 ? void 0 : a.signal
      });
      if (!i.ok) {
        if (i.status === 401 && this._authProvider)
          return await this._authThenStart();
        if (i.status === 405)
          return;
        throw new zo(i.status, `Failed to open SSE stream: ${i.statusText}`);
      }
      this._handleSseStream(i.body, e, !0);
    } catch (o) {
      throw (n = this.onerror) === null || n === void 0 || n.call(this, o), o;
    }
  }
  /**
   * Calculates the next reconnection delay using  backoff algorithm
   *
   * @param attempt Current reconnection attempt count for the specific stream
   * @returns Time to wait in milliseconds before next reconnection attempt
   */
  _getNextReconnectionDelay(e) {
    const r = this._reconnectionOptions.initialReconnectionDelay, a = this._reconnectionOptions.reconnectionDelayGrowFactor, n = this._reconnectionOptions.maxReconnectionDelay;
    return Math.min(r * Math.pow(a, e), n);
  }
  _normalizeHeaders(e) {
    return e ? e instanceof Headers ? Object.fromEntries(e.entries()) : Array.isArray(e) ? Object.fromEntries(e) : { ...e } : {};
  }
  /**
   * Schedule a reconnection attempt with exponential backoff
   *
   * @param lastEventId The ID of the last received event for resumability
   * @param attemptCount Current reconnection attempt count for this specific stream
   */
  _scheduleReconnection(e, r = 0) {
    var a;
    const n = this._reconnectionOptions.maxRetries;
    if (n > 0 && r >= n) {
      (a = this.onerror) === null || a === void 0 || a.call(this, new Error(`Maximum reconnection attempts (${n}) exceeded.`));
      return;
    }
    const s = this._getNextReconnectionDelay(r);
    setTimeout(() => {
      this._startOrAuthSse(e).catch((o) => {
        var i;
        (i = this.onerror) === null || i === void 0 || i.call(this, new Error(`Failed to reconnect SSE stream: ${o instanceof Error ? o.message : String(o)}`)), this._scheduleReconnection(e, r + 1);
      });
    }, s);
  }
  _handleSseStream(e, r, a) {
    if (!e)
      return;
    const { onresumptiontoken: n, replayMessageId: s } = r;
    let o;
    (async () => {
      var l, c, u, d;
      try {
        const h = e.pipeThrough(new TextDecoderStream()).pipeThrough(new rP()).getReader();
        for (; ; ) {
          const { value: f, done: m } = await h.read();
          if (m)
            break;
          if (f.id && (o = f.id, n == null || n(f.id)), !f.event || f.event === "message")
            try {
              const p = oa.parse(JSON.parse(f.data));
              s !== void 0 && gi(p) && (p.id = s), (l = this.onmessage) === null || l === void 0 || l.call(this, p);
            } catch (p) {
              (c = this.onerror) === null || c === void 0 || c.call(this, p);
            }
        }
      } catch (h) {
        if ((u = this.onerror) === null || u === void 0 || u.call(this, new Error(`SSE stream disconnected: ${h}`)), a && this._abortController && !this._abortController.signal.aborted)
          try {
            this._scheduleReconnection({
              resumptionToken: o,
              onresumptiontoken: n,
              replayMessageId: s
            }, 0);
          } catch (f) {
            (d = this.onerror) === null || d === void 0 || d.call(this, new Error(`Failed to reconnect: ${f instanceof Error ? f.message : String(f)}`));
          }
      }
    })();
  }
  async start() {
    if (this._abortController)
      throw new Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    this._abortController = new AbortController();
  }
  /**
   * Call this method after the user has finished authorizing via their user agent and is redirected back to the MCP client application. This will exchange the authorization code for an access token, enabling the next connection attempt to successfully auth.
   */
  async finishAuth(e) {
    if (!this._authProvider)
      throw new rr("No auth provider");
    if (await kn(this._authProvider, { serverUrl: this._url, authorizationCode: e, resourceMetadataUrl: this._resourceMetadataUrl, fetchFn: this._fetch }) !== "AUTHORIZED")
      throw new rr("Failed to authorize");
  }
  async close() {
    var e, r;
    (e = this._abortController) === null || e === void 0 || e.abort(), (r = this.onclose) === null || r === void 0 || r.call(this);
  }
  async send(e, r) {
    var a, n, s, o;
    try {
      const { resumptionToken: i, onresumptiontoken: l } = r || {};
      if (i) {
        this._startOrAuthSse({ resumptionToken: i, replayMessageId: Hd(e) ? e.id : void 0 }).catch((v) => {
          var y;
          return (y = this.onerror) === null || y === void 0 ? void 0 : y.call(this, v);
        });
        return;
      }
      const c = await this._commonHeaders();
      c.set("content-type", "application/json"), c.set("accept", "application/json, text/event-stream");
      const u = {
        ...this._requestInit,
        method: "POST",
        headers: c,
        body: JSON.stringify(e),
        signal: (a = this._abortController) === null || a === void 0 ? void 0 : a.signal
      }, d = await ((n = this._fetch) !== null && n !== void 0 ? n : fetch)(this._url, u), h = d.headers.get("mcp-session-id");
      if (h && (this._sessionId = h), !d.ok) {
        if (d.status === 401 && this._authProvider) {
          if (this._resourceMetadataUrl = el(d), await kn(this._authProvider, { serverUrl: this._url, resourceMetadataUrl: this._resourceMetadataUrl, fetchFn: this._fetch }) !== "AUTHORIZED")
            throw new rr();
          return this.send(e);
        }
        const v = await d.text().catch(() => null);
        throw new Error(`Error POSTing to endpoint (HTTP ${d.status}): ${v}`);
      }
      if (d.status === 202) {
        yw(e) && this._startOrAuthSse({ resumptionToken: void 0 }).catch((v) => {
          var y;
          return (y = this.onerror) === null || y === void 0 ? void 0 : y.call(this, v);
        });
        return;
      }
      const m = (Array.isArray(e) ? e : [e]).filter((v) => "method" in v && "id" in v && v.id !== void 0).length > 0, p = d.headers.get("content-type");
      if (m)
        if (p != null && p.includes("text/event-stream"))
          this._handleSseStream(d.body, { onresumptiontoken: l }, !1);
        else if (p != null && p.includes("application/json")) {
          const v = await d.json(), y = Array.isArray(v) ? v.map((b) => oa.parse(b)) : [oa.parse(v)];
          for (const b of y)
            (s = this.onmessage) === null || s === void 0 || s.call(this, b);
        } else
          throw new zo(-1, `Unexpected content type: ${p}`);
    } catch (i) {
      throw (o = this.onerror) === null || o === void 0 || o.call(this, i), i;
    }
  }
  get sessionId() {
    return this._sessionId;
  }
  /**
   * Terminates the current session by sending a DELETE request to the server.
   *
   * Clients that no longer need a particular session
   * (e.g., because the user is leaving the client application) SHOULD send an
   * HTTP DELETE to the MCP endpoint with the Mcp-Session-Id header to explicitly
   * terminate the session.
   *
   * The server MAY respond with HTTP 405 Method Not Allowed, indicating that
   * the server does not allow clients to terminate sessions.
   */
  async terminateSession() {
    var e, r, a;
    if (this._sessionId)
      try {
        const n = await this._commonHeaders(), s = {
          ...this._requestInit,
          method: "DELETE",
          headers: n,
          signal: (e = this._abortController) === null || e === void 0 ? void 0 : e.signal
        }, o = await ((r = this._fetch) !== null && r !== void 0 ? r : fetch)(this._url, s);
        if (!o.ok && o.status !== 405)
          throw new zo(o.status, `Failed to terminate session: ${o.statusText}`);
        this._sessionId = void 0;
      } catch (n) {
        throw (a = this.onerror) === null || a === void 0 || a.call(this, n), n;
      }
  }
  setProtocolVersion(e) {
    this._protocolVersion = e;
  }
  get protocolVersion() {
    return this._protocolVersion;
  }
}
function Es() {
  const t = ["xvQXC", "603309hhGmOf", "object", "160767aSXjlh", "kgSPd", "toString", "821472ICyrFe", "3022854AnmWAK", "replace", "1492478hKDkXm", "456955eGHvGi", "randomUUID", "getRandomValues", "4IGLajm", "HlhgH", "1409958waVENt", "696JipcmK"];
  return Es = function() {
    return t;
  }, Es();
}
(function(t, e) {
  const r = Mn, a = Mn, n = t();
  for (; ; )
    try {
      if (-parseInt(r(362)) / 1 + parseInt(r(365)) / 2 + -parseInt(r(371)) / 3 + -parseInt(a(369)) / 4 * (-parseInt(a(366)) / 5) + -parseInt(r(363)) / 6 + -parseInt(r(357)) / 7 + -parseInt(r(372)) / 8 * (-parseInt(a(359)) / 9) === e) break;
      n.push(n.shift());
    } catch {
      n.push(n.shift());
    }
})(Es, 425592 + -13470 * 23 + 394475);
function Mn(t, e) {
  const r = Es();
  return Mn = function(a, n) {
    return a = a - (-2 * -2318 + -1565 * -1 + 1948 * -3), r[a];
  }, Mn(t, e);
}
const Gl = () => {
  const t = Mn, e = Mn, r = {};
  r[t(360)] = function(n, s) {
    return n & s;
  }, r[t(370)] = function(n, s) {
    return n === s;
  }, r[t(373)] = function(n, s) {
    return n | s;
  }, r.Lxvwz = t(358);
  const a = r;
  return a[t(370)](typeof crypto, a.Lxvwz) && crypto[e(367)] ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[t(364)](/[xy]/g, (n) => {
    const s = e, o = e, i = a.kgSPd(crypto[s(368)](new Uint8Array(-6629 + 170 * 39))[-2 * 1726 + 4100 + -648], -478 * -1 + 63 * -88 + 5081);
    return (a[s(370)](n, "x") ? i : a[o(373)](a[s(360)](i, -1 * 3833 + 2 * 872 + 2092), -5 * -125 + -272 + -345))[o(361)](1622 + -803 * 2);
  });
}, qo = nr;
(function(t, e) {
  const r = nr, a = nr, n = t();
  for (; ; )
    try {
      if (-parseInt(r(190)) / 1 * (-parseInt(r(222)) / 2) + parseInt(a(204)) / 3 * (parseInt(a(231)) / 4) + parseInt(r(194)) / 5 * (-parseInt(r(223)) / 6) + parseInt(a(217)) / 7 + -parseInt(a(195)) / 8 + parseInt(r(232)) / 9 * (-parseInt(r(192)) / 10) + parseInt(a(234)) / 11 === e) break;
      n.push(n.shift());
    } catch {
      n.push(n.shift());
    }
})(Ss, 1 * -1712191 + 10 * -131891 + -3919385 * -1);
class Ou {
  constructor(e, r) {
    const a = nr, n = nr, s = {};
    s.yImye = "3|2|0|4|1|5";
    const o = s, i = o.yImye.split("|");
    let l = -332 + -1070 * 8 + 8892;
    for (; ; ) {
      switch (i[l++]) {
        case "0":
          this._port = e;
          continue;
        case "1":
          this._started = !1;
          continue;
        case "2":
          this[a(206)] = !1;
          continue;
        case "3":
          this[a(210)] = !1;
          continue;
        case "4":
          this[n(198)] = r;
          continue;
        case "5":
          this[n(206)] = !1;
          continue;
      }
      break;
    }
  }
  async start() {
    const e = nr, r = nr;
    this._started || this._closed || !this[e(216)] || (this[r(210)] = !0, this[r(216)].onmessage = (a) => {
      var n, s;
      const o = r;
      try {
        const i = oa[o(201)](a[o(227)]);
        (n = this[o(230)]) == null || n.call(this, i);
      } catch (i) {
        const l = new Error("Failed to parse message: " + i);
        (s = this[o(212)]) == null || s.call(this, l);
      }
    }, this[e(216)][r(228)] = (a) => {
      var n;
      const s = r, o = new Error("MessagePort error: " + JSON.stringify(a));
      (n = this[s(212)]) == null || n.call(this, o);
    }, this._port[e(205)]());
  }
  async send(e) {
    const r = nr, a = { mEePn: function(n) {
      return n();
    }, YtLsL: function(n, s) {
      return n instanceof s;
    }, MAuuf: function(n, s) {
      return n(s);
    }, hAyRG: function(n, s) {
      return n(s);
    } };
    if (!(this[r(206)] || !this._port))
      return new Promise((n, s) => {
        var o;
        const i = r, l = r;
        try {
          this._port && this[i(216)].postMessage(e), a.mEePn(n);
        } catch (c) {
          const u = a.YtLsL(c, Error) ? c : new Error(a.MAuuf(String, c));
          (o = this.onerror) == null || o.call(this, u), a[l(214)](s, u);
        }
      });
  }
  async [qo(202)]() {
    var e;
    const r = qo;
    this._closed || !this._port || (this._closed = !0, this._port[r(202)](), (e = this.onclose) == null || e.call(this));
  }
  get sessionId() {
    return this[qo(198)];
  }
}
function Ss() {
  const t = ["endpoint", "_started", "_globalObject", "onerror", "HKFrs", "hAyRG", "ctLco", "_port", "6357498MylexY", "sessionId", "addEventListener", "Qdmwi", "WVeFE", "2571152TAiISL", "10340886KVKStC", "nKvYQ", "RFXXY", "undefined", "data", "onmessageerror", "postMessage", "onmessage", "4sCECAn", "54tPiUsm", "_endpoint", "2092167qFLRxD", "trFbG", "XNizk", "port2", "1voHuKs", "yUAGf", "1555570JcyrXi", "ports", "5fwVkQB", "1793592DbUnOK", "EeNHO", "function", "_sessionId", "YSdDH", "iXIHW", "parse", "close", "TBOUS", "4155957vBaybS", "start", "_closed", "NXAqB", "KUmPc"];
  return Ss = function() {
    return t;
  }, Ss();
}
function nr(t, e) {
  const r = Ss();
  return nr = function(a, n) {
    return a = a - (-2 * 2471 + -9757 + -3 * -4963), r[a];
  }, nr(t, e);
}
const sP = () => {
  const t = { UdUkT: function(a) {
    return a();
  } }, e = new MessageChannel(), r = t.UdUkT(Gl);
  return [new Ou(e.port1, r), new Ou(e.port2, r)];
};
(function(t, e) {
  const r = Ps, a = Ps, n = t();
  for (; ; )
    try {
      if (-parseInt(r(150)) / 1 + parseInt(a(147)) / 2 * (-parseInt(r(157)) / 3) + parseInt(r(153)) / 4 * (-parseInt(r(143)) / 5) + -parseInt(a(145)) / 6 + parseInt(r(152)) / 7 * (parseInt(a(155)) / 8) + -parseInt(a(144)) / 9 + -parseInt(r(146)) / 10 * (-parseInt(a(151)) / 11) === e) break;
      n.push(n.shift());
    } catch {
      n.push(n.shift());
    }
})(xs, 629964);
function Ps(t, e) {
  const r = xs();
  return Ps = function(a, n) {
    return a = a - (-2363 + 2488 * -3 + 9970), r[a];
  }, Ps(t, e);
}
const oP = (t, e = Gl()) => ({ requestInit: { headers: { Authorization: "Bearer " + t, "stream-session-id": e } } });
function xs() {
  const t = ["vSQiS", "1232600XmyMuo", "21373eXHBdU", "425355MVAcRJ", "12AWycNK", "authorization", "56hXzxWH", "set", "1260255yqMDQL", "773300AfCyyF", "9359541qoODls", "5783370zsljtT", "22260yFjCbi", "2osLpLl", "AiGNv"];
  return xs = function() {
    return t;
  }, xs();
}
(function(t, e) {
  const r = qe, a = qe, n = t();
  for (; ; )
    try {
      if (-parseInt(r(257)) / 1 * (-parseInt(a(283)) / 2) + -parseInt(r(298)) / 3 + -parseInt(r(241)) / 4 + -parseInt(a(290)) / 5 + parseInt(r(253)) / 6 + -parseInt(a(313)) / 7 * (parseInt(a(279)) / 8) + parseInt(r(271)) / 9 * (parseInt(r(281)) / 10) === e) break;
      n.push(n.shift());
    } catch {
      n.push(n.shift());
    }
})(Cs, 1 * -958321 + -1498149 + 42 * 76909);
function qe(t, e) {
  const r = Cs();
  return qe = function(a, n) {
    return a = a - (2 * 2869 + -2589 * 1 + 2909 * -1), r[a];
  }, qe(t, e);
}
const iP = async (t, e, r) => {
  var a;
  const n = qe, s = qe, o = {};
  o[n(255)] = n(296), o[s(269)] = "resources/list", o[s(266)] = n(256), o.RRkap = "resources/subscribe", o.upnaf = "resources/unsubscribe", o.lsGQt = "prompts/get", o[s(275)] = s(309), o[s(312)] = s(305), o.kQNzn = n(252), o[s(263)] = n(246);
  const i = o, { id: l, method: c, params: u } = r;
  let d = {};
  switch (c) {
    case n(306):
      d = await e.listTools(u);
      break;
    case i[n(255)]:
      d = await e[n(293)](u);
      break;
    case i.STkQf:
      d = await e[s(286)](u);
      break;
    case s(267):
      d = await e[n(317)](u);
      break;
    case i.ClDpH:
      d = await e.readResource(u);
      break;
    case i.RRkap:
      d = await e.subscribeResource(u);
      break;
    case i.upnaf:
      d = await e[s(260)](u);
      break;
    case i[s(324)]:
      d = await e.getPrompt(u);
      break;
    case i[n(275)]:
      d = await e.listPrompts(u);
      break;
    case "ping":
      d = await e.ping();
      break;
    case i.gUByd:
      d = await e[n(289)](u);
      break;
    case i[s(240)]:
      d = await e.setLoggingLevel(u == null ? void 0 : u[s(294)]);
      break;
  }
  const h = {};
  h.result = d, h[s(321)] = i[s(263)], h.id = l, await ((a = t == null ? void 0 : t.transport) == null ? void 0 : a.send(h));
}, lP = async (t, e, r) => {
  var a;
  const n = qe, s = qe, o = {};
  o[n(272)] = n(280), o.HJWCi = "sampling/createMessage", o[n(276)] = s(319), o.zAPVJ = "2.0";
  const i = o, { id: l, method: c, params: u } = r;
  let d = {};
  switch (c) {
    case i[s(272)]:
      const f = {};
      f.method = c, f[n(287)] = u, d = await e[s(285)](f, $l);
      break;
    case i[n(270)]:
      const m = {};
      m.method = c, m.params = u, d = await e[s(285)](m, Nl);
      break;
    case i.MHdLd:
      const p = {};
      p[n(308)] = c, d = await e[s(285)](p, Fr);
      break;
  }
  const h = {};
  h.result = d, h.jsonrpc = i[s(261)], h.id = l, await ((a = t == null ? void 0 : t.transport) == null ? void 0 : a[n(300)](h));
}, cP = (t, e) => {
  const r = qe, a = qe, n = { uakTp: r(278), PRkoG: function(o, i, l, c) {
    return o(i, l, c);
  }, BPMzo: "2.0" }, s = t[r(322)];
  t[a(322)] = async (o, i) => {
    var l;
    const c = r, u = r, { id: d, method: h } = o;
    try {
      h === n[c(277)] ? await s[c(264)](t, o, i) : await n[c(302)](iP, t, e, o);
    } catch (f) {
      const { code: m, message: p, data: v } = f;
      try {
        const y = {};
        y[c(295)] = m, y.message = p, y[c(315)] = v;
        const b = {};
        b[u(259)] = y, b[c(321)] = n.BPMzo, b.id = d, await ((l = t == null ? void 0 : t[u(314)]) == null ? void 0 : l[c(300)](b));
      } catch {
      }
    }
  };
};
function Cs() {
  const t = ["jQOHt", "logging/setLevel", "9148050QavroF", "addResponseListener", "DKcdb", "resources/read", "2dhabXO", "notifications/cancelled", "error", "unsubscribeResource", "zAPVJ", "taVWl", "tPJej", "call", "fallbackRequestHandler", "ClDpH", "resources/templates/list", "wFRTc", "STkQf", "HJWCi", "9HsXPHL", "EteND", "notifications/progress", "abort", "KRjHw", "MHdLd", "uakTp", "initialize", "1592OvFQRg", "roots/list", "24485730fwSTLx", "clearNotificationListener", "495382ohHKQU", "function", "request", "listResources", "params", "KfGLt", "complete", "5554650asvKKt", "vAQOh", "qGHPg", "callTool", "level", "code", "tools/call", "removeResponseListener", "3707892TeWMjJ", "clear", "send", "FqNTf", "PRkoG", "LyVnY", "length", "completion/complete", "tools/list", "ChEvV", "method", "prompts/list", "jatfb", "fEKFh", "gUByd", "9079gFgwwb", "transport", "data", "YbuGL", "listResourceTemplates", "handleListener", "ping", "UARSo", "jsonrpc", "_onrequest", "removeNotificationListener", "lsGQt", "kQNzn", "4359700wMGLtX", "addRequestListener", "Dplaa", "clearListener", "_requestHandlerAbortControllers", "2.0", "addNotificationListener", "push", "AroLw", "message"];
  return Cs = function() {
    return t;
  }, Cs();
}
const uP = (t, e) => {
  const r = qe, a = qe, n = {};
  n.LyVnY = function(o, i) {
    return o !== i;
  }, n[r(249)] = "notifications/initialized", n[a(311)] = "notifications/cancelled";
  const s = n;
  t._onnotification = async (o) => {
    const i = r, l = r, { method: c, params: u } = o;
    if (s[i(303)](c, s[l(249)]) && (c !== s[i(311)] || u != null && u.forward)) try {
      await e.notification(o);
    } catch {
    }
  };
}, dP = (t, e) => async (r) => {
  var a;
  const n = qe, s = qe, o = {};
  o[n(292)] = "2.0";
  const i = o;
  try {
    await lP(t, e, r);
  } catch (l) {
    const { code: c, message: u, data: d } = l;
    try {
      const h = {};
      h.code = c, h[s(250)] = u, h.data = d;
      const f = {};
      f[n(259)] = h, f.jsonrpc = i[n(292)], f.id = r.id, await ((a = t == null ? void 0 : t[s(314)]) == null ? void 0 : a.send(f));
    } catch {
    }
  }
}, fP = (t) => async (e) => {
  var r;
  const a = qe, n = qe, s = {};
  s.jQOHt = "notifications/initialized", s[a(310)] = function(c, u) {
    return c !== u;
  }, s[a(262)] = n(258);
  const o = s, { method: i, params: l } = e;
  if (i !== o[n(251)] && (o[a(310)](i, o[a(262)]) || l != null && l.forward)) try {
    const c = { ...e };
    c.jsonrpc = a(246), await ((r = t == null ? void 0 : t.transport) == null ? void 0 : r.send(c));
  } catch {
  }
}, hP = (t, e) => async (r) => {
  var a, n;
  const s = qe, o = qe, i = {};
  i.vxoaP = s(246);
  const l = i;
  try {
    await ((a = e == null ? void 0 : e.transport) == null ? void 0 : a.send(r));
  } catch (c) {
    const { code: u, message: d, data: h } = c;
    try {
      const f = {};
      f[o(295)] = u, f.message = d, f[s(315)] = h;
      const m = {};
      m[s(259)] = f, m.jsonrpc = l.vxoaP, m.id = r.id, await ((n = t == null ? void 0 : t[o(314)]) == null ? void 0 : n.send(m));
    } catch {
    }
  }
}, Ho = () => {
  const t = qe, e = { REOpj: function(l, c) {
    return l(c);
  }, UARSo: function(l, c) {
    return l === c;
  }, wFRTc: "function", cboFW: function(l, c) {
    return l !== c;
  } }, r = [], a = (l) => {
    const c = [...r];
    let u;
    for (const d of c)
      try {
        u = e.REOpj(d, l);
      } catch {
      }
    if (!(u instanceof Promise)) return u;
  }, n = (l) => {
    const c = qe, u = qe;
    e[c(320)](typeof l, e[u(268)]) && !r.includes(l) && r[u(248)](l);
  }, s = (l) => {
    const c = r.indexOf(l);
    e.cboFW(c, -1) && r.splice(c, -241 * 1 + 321 * -6 + 2168);
  }, o = () => {
    const l = qe;
    r[l(304)] = -459 * 21 + 2 * -2763 + 1011 * 15;
  }, i = {};
  return i[t(318)] = a, i.addListener = n, i.removeListener = s, i[t(244)] = o, i;
}, pP = (t) => {
  const e = qe, r = qe, a = { Dplaa: function(n) {
    return n();
  }, KfGLt: function(n) {
    return n();
  } };
  {
    const { handleListener: n, addListener: s, removeListener: o, clearListener: i } = Ho();
    t._onresponse = n, t.addResponseListener = s, t[e(297)] = o, t.clearResponseListener = i;
  }
  {
    const { handleListener: n, addListener: s, removeListener: o, clearListener: i } = a[e(243)](Ho);
    t[e(265)] = n, t[r(242)] = s, t.removeRequestListener = o, t.clearRequestListener = i;
  }
  {
    const { handleListener: n, addListener: s, removeListener: o, clearListener: i } = a[r(288)](Ho);
    t.fallbackNotificationHandler = n, t[r(247)] = s, t[r(323)] = o, t[e(282)] = i;
  }
}, mP = (t, e, { beforeInit: r, afterInit: a } = {}) => {
  const n = qe, s = qe, o = { ChEvV: function(l, c) {
    return l === c;
  }, YbuGL: n(319), FqNTf: function(l, c) {
    return l === c;
  }, WUrMn: n(284), vAQOh: function(l) {
    return l();
  }, DiIVP: function(l, c) {
    return l(c);
  }, ArGZD: function(l, c) {
    return l === c;
  } };
  t._requestHandlers[n(299)](), t._notificationHandlers.clear(), typeof r === o.WUrMn && o[n(291)](r);
  const i = t._onresponse;
  o.DiIVP(pP, t), t[n(254)]((l) => {
    i.call(t, l);
  }), t[n(242)]((l) => {
    const c = n, { method: u } = l;
    if (o[c(307)](u, o[c(316)])) return {};
  }), t.addNotificationListener((l) => {
    const c = n, u = s, { method: d, params: h } = l;
    if (o[c(301)](d, c(258))) {
      const f = t[u(245)].get(h.requestId);
      f == null || f[c(274)](h == null ? void 0 : h.reason);
    } else d === c(273) && t._onprogress(l);
  }), o.ArGZD(typeof a, o.WUrMn) && a();
};
(function(t, e) {
  const r = cr, a = cr, n = t();
  for (; ; )
    try {
      if (-parseInt(r(286)) / 1 * (parseInt(a(296)) / 2) + -parseInt(r(283)) / 3 + parseInt(r(306)) / 4 * (-parseInt(a(285)) / 5) + -parseInt(r(305)) / 6 + -parseInt(r(317)) / 7 * (parseInt(a(318)) / 8) + parseInt(a(308)) / 9 * (parseInt(a(304)) / 10) + -parseInt(a(292)) / 11 * (-parseInt(r(314)) / 12) === e) break;
      n.push(n.shift());
    } catch {
      n.push(n.shift());
    }
})(ks, 73514 + -9970 * -20 + 69651);
function cr(t, e) {
  const r = ks();
  return cr = function(a, n) {
    return a = a - (-5350 * -1 + -4 * 662 + 2420 * -1), r[a];
  }, cr(t, e);
}
const vP = (t, e) => {
  const r = cr, a = cr, n = { wtkds: function(l, c, u) {
    return l(c, u);
  } };
  n.wtkds(cP, t, e), n[r(310)](uP, t, e);
  const s = dP(e, t), o = n[a(310)](hP, e, t), i = fP(t);
  e.addRequestListener(s), e.addResponseListener(o), e[r(312)](i), t[a(321)] = () => {
    const l = a, c = a;
    e[l(300)](s), e.removeResponseListener(o), e[c(299)](i);
  };
}, gP = (t, e) => {
  const r = cr, a = cr, n = { pvctu: function(i, l) {
    return i instanceof l;
  }, Stdcb: r(323), MhUJa: function(i, l, c, u) {
    return i(l, c, u);
  } }, s = () => {
    var i;
    const l = r;
    n.pvctu(e, tP) && ((i = e._eventSource) == null || i[l(291)](n.Stdcb, () => {
      var c;
      (c = e[l(319)]) == null || c.close();
    }));
  }, o = {};
  o.afterInit = s, n[a(298)](mP, t, e, o);
}, _P = async (t) => {
  const e = cr, r = cr, a = { STOLL: function(y) {
    return y();
  }, Ralpb: function(y, b, _) {
    return y(b, _);
  }, kRoIR: e(307), zBxUW: "1.0.0", MLIWZ: function(y, b, _) {
    return y(b, _);
  } }, { client: n, url: s, token: o, sessionId: i } = t, l = i || a[r(282)](Gl), c = new aP(new URL(s), a[e(311)](oP, o, l)), u = {};
  u.listChanged = !0;
  const d = {};
  d[r(320)] = {}, d.resources = {}, d[e(303)] = {}, d[e(315)] = {}, d[e(288)] = u, d[e(313)] = {};
  const h = d, f = {};
  f.name = a.kRoIR, f[e(301)] = a[e(289)];
  const m = {};
  m.capabilities = h;
  const p = new Hf(f, m);
  await p[r(297)](c), a[e(293)](gP, n, c), a[e(311)](vP, p, n);
  const v = {};
  return v[r(287)] = c, v[r(294)] = l, v;
};
function ks() {
  const t = ["MhUJa", "removeNotificationListener", "removeRequestListener", "version", "nAXtx", "tools", "802030ULkOOd", "888120XOtYOc", "2249276aONbFk", "mcp-stream-proxy-client", "9Zrtczb", "1.0.0", "wtkds", "Ralpb", "addNotificationListener", "sampling", "48gpfGZR", "logging", "listChanged", "76643wQMMNV", "176xFTxxv", "_eventSource", "prompts", "onclose", "cGSyh", "close", "STOLL", "1365396TZnVUQ", "mcp-sse-proxy-client", "5alDkiu", "12031tcYqPf", "transport", "roots", "zBxUW", "MHbif", "addEventListener", "4952893dMIJix", "MLIWZ", "sessionId", "resources", "22ACquGI", "connect"];
  return ks = function() {
    return t;
  }, ks();
}
(function(t, e) {
  for (var r = Is, a = Is, n = t(); ; )
    try {
      var s = -parseInt(r(146)) / 1 + -parseInt(r(151)) / 2 * (parseInt(r(150)) / 3) + parseInt(r(148)) / 4 + -parseInt(r(152)) / 5 + -parseInt(r(149)) / 6 + -parseInt(r(147)) / 7 * (-parseInt(a(153)) / 8) + parseInt(r(145)) / 9;
      if (s === e) break;
      n.push(n.shift());
    } catch {
      n.push(n.shift());
    }
})(Rs, 421 * 846 + -1230358 + 1829094);
function Is(t, e) {
  var r = Rs();
  return Is = function(a, n) {
    a = a - (-2714 + -1 * -2859);
    var s = r[a];
    return s;
  }, Is(t, e);
}
function Rs() {
  var t = ["6990666lmTFZb", "12303JhneIQ", "442jbtgOa", "8311125vypyPK", "368KGtkFm", "31159062Uuazld", "1452721vYzYtN", "171122cONrrN", "6218584okJVdB"];
  return Rs = function() {
    return t;
  }, Rs();
}
class yP extends hf {
  /**
   * Initializes this server with the given name and version information.
   */
  constructor(e, r) {
    var a;
    super(r), this._serverInfo = e, this._capabilities = (a = r == null ? void 0 : r.capabilities) !== null && a !== void 0 ? a : {}, this._instructions = r == null ? void 0 : r.instructions, this.setRequestHandler(Gd, (n) => this._oninitialize(n)), this.setNotificationHandler(kl, () => {
      var n;
      return (n = this.oninitialized) === null || n === void 0 ? void 0 : n.call(this);
    });
  }
  /**
   * Registers new capabilities. This can only be called before connecting to a transport.
   *
   * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
   */
  registerCapabilities(e) {
    if (this.transport)
      throw new Error("Cannot register capabilities after connecting to transport");
    this._capabilities = pf(this._capabilities, e);
  }
  assertCapabilityForMethod(e) {
    var r, a, n;
    switch (e) {
      case "sampling/createMessage":
        if (!(!((r = this._clientCapabilities) === null || r === void 0) && r.sampling))
          throw new Error(`Client does not support sampling (required for ${e})`);
        break;
      case "elicitation/create":
        if (!(!((a = this._clientCapabilities) === null || a === void 0) && a.elicitation))
          throw new Error(`Client does not support elicitation (required for ${e})`);
        break;
      case "roots/list":
        if (!(!((n = this._clientCapabilities) === null || n === void 0) && n.roots))
          throw new Error(`Client does not support listing roots (required for ${e})`);
        break;
    }
  }
  assertNotificationCapability(e) {
    switch (e) {
      case "notifications/message":
        if (!this._capabilities.logging)
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "notifications/resources/updated":
      case "notifications/resources/list_changed":
        if (!this._capabilities.resources)
          throw new Error(`Server does not support notifying about resources (required for ${e})`);
        break;
      case "notifications/tools/list_changed":
        if (!this._capabilities.tools)
          throw new Error(`Server does not support notifying of tool list changes (required for ${e})`);
        break;
      case "notifications/prompts/list_changed":
        if (!this._capabilities.prompts)
          throw new Error(`Server does not support notifying of prompt list changes (required for ${e})`);
        break;
    }
  }
  assertRequestHandlerCapability(e) {
    switch (e) {
      case "sampling/createMessage":
        if (!this._capabilities.sampling)
          throw new Error(`Server does not support sampling (required for ${e})`);
        break;
      case "logging/setLevel":
        if (!this._capabilities.logging)
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "prompts/get":
      case "prompts/list":
        if (!this._capabilities.prompts)
          throw new Error(`Server does not support prompts (required for ${e})`);
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
        if (!this._capabilities.resources)
          throw new Error(`Server does not support resources (required for ${e})`);
        break;
      case "tools/call":
      case "tools/list":
        if (!this._capabilities.tools)
          throw new Error(`Server does not support tools (required for ${e})`);
        break;
    }
  }
  async _oninitialize(e) {
    const r = e.params.protocolVersion;
    return this._clientCapabilities = e.params.capabilities, this._clientVersion = e.params.clientInfo, {
      protocolVersion: Ud.includes(r) ? r : ga,
      capabilities: this.getCapabilities(),
      serverInfo: this._serverInfo,
      ...this._instructions && { instructions: this._instructions }
    };
  }
  /**
   * After initialization has completed, this will be populated with the client's reported capabilities.
   */
  getClientCapabilities() {
    return this._clientCapabilities;
  }
  /**
   * After initialization has completed, this will be populated with information about the client's name and version.
   */
  getClientVersion() {
    return this._clientVersion;
  }
  getCapabilities() {
    return this._capabilities;
  }
  async ping() {
    return this.request({ method: "ping" }, Fr);
  }
  async createMessage(e, r) {
    return this.request({ method: "sampling/createMessage", params: e }, Nl, r);
  }
  async elicitInput(e, r) {
    const a = await this.request({ method: "elicitation/create", params: e }, df, r);
    if (a.action === "accept" && a.content)
      try {
        const n = new qf(), s = n.compile(e.requestedSchema);
        if (!s(a.content))
          throw new Ze(ze.InvalidParams, `Elicitation response content does not match requested schema: ${n.errorsText(s.errors)}`);
      } catch (n) {
        throw n instanceof Ze ? n : new Ze(ze.InternalError, `Error validating elicitation response: ${n}`);
      }
    return a;
  }
  async listRoots(e, r) {
    return this.request({ method: "roots/list", params: e }, $l, r);
  }
  async sendLoggingMessage(e) {
    return this.notification({ method: "notifications/message", params: e });
  }
  async sendResourceUpdated(e) {
    return this.notification({
      method: "notifications/resources/updated",
      params: e
    });
  }
  async sendResourceListChanged() {
    return this.notification({
      method: "notifications/resources/list_changed"
    });
  }
  async sendToolListChanged() {
    return this.notification({ method: "notifications/tools/list_changed" });
  }
  async sendPromptListChanged() {
    return this.notification({ method: "notifications/prompts/list_changed" });
  }
}
const bP = Symbol("Let zodToJsonSchema decide on which parser to use"), Du = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: !0,
  rejectedAdditionalProperties: !1,
  definitionPath: "definitions",
  target: "jsonSchema7",
  strictUnions: !1,
  definitions: {},
  errorMessages: !1,
  markdownDescription: !1,
  patternStrategy: "escape",
  applyRegexFlags: !1,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref",
  openAiAnyTypeName: "OpenAiAnyType"
}, wP = (t) => typeof t == "string" ? {
  ...Du,
  name: t
} : {
  ...Du,
  ...t
}, EP = (t) => {
  const e = wP(t), r = e.name !== void 0 ? [...e.basePath, e.definitionPath, e.name] : e.basePath;
  return {
    ...e,
    flags: { hasReferencedOpenAiAnyType: !1 },
    currentPath: r,
    propertyPath: void 0,
    seen: new Map(Object.entries(e.definitions).map(([a, n]) => [
      n._def,
      {
        def: n._def,
        path: [...e.basePath, e.definitionPath, a],
        // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
        jsonSchema: void 0
      }
    ]))
  };
};
function Yf(t, e, r, a) {
  a != null && a.errorMessages && r && (t.errorMessage = {
    ...t.errorMessage,
    [e]: r
  });
}
function Fe(t, e, r, a, n) {
  t[e] = r, Yf(t, e, a, n);
}
const Xf = (t, e) => {
  let r = 0;
  for (; r < t.length && r < e.length && t[r] === e[r]; r++)
    ;
  return [(t.length - r).toString(), ...e.slice(r)].join("/");
};
function Nt(t) {
  if (t.target !== "openAi")
    return {};
  const e = [
    ...t.basePath,
    t.definitionPath,
    t.openAiAnyTypeName
  ];
  return t.flags.hasReferencedOpenAiAnyType = !0, {
    $ref: t.$refStrategy === "relative" ? Xf(e, t.currentPath) : e.join("/")
  };
}
function SP(t, e) {
  var a, n, s;
  const r = {
    type: "array"
  };
  return (a = t.type) != null && a._def && ((s = (n = t.type) == null ? void 0 : n._def) == null ? void 0 : s.typeName) !== z.ZodAny && (r.items = Me(t.type._def, {
    ...e,
    currentPath: [...e.currentPath, "items"]
  })), t.minLength && Fe(r, "minItems", t.minLength.value, t.minLength.message, e), t.maxLength && Fe(r, "maxItems", t.maxLength.value, t.maxLength.message, e), t.exactLength && (Fe(r, "minItems", t.exactLength.value, t.exactLength.message, e), Fe(r, "maxItems", t.exactLength.value, t.exactLength.message, e)), r;
}
function PP(t, e) {
  const r = {
    type: "integer",
    format: "int64"
  };
  if (!t.checks)
    return r;
  for (const a of t.checks)
    switch (a.kind) {
      case "min":
        e.target === "jsonSchema7" ? a.inclusive ? Fe(r, "minimum", a.value, a.message, e) : Fe(r, "exclusiveMinimum", a.value, a.message, e) : (a.inclusive || (r.exclusiveMinimum = !0), Fe(r, "minimum", a.value, a.message, e));
        break;
      case "max":
        e.target === "jsonSchema7" ? a.inclusive ? Fe(r, "maximum", a.value, a.message, e) : Fe(r, "exclusiveMaximum", a.value, a.message, e) : (a.inclusive || (r.exclusiveMaximum = !0), Fe(r, "maximum", a.value, a.message, e));
        break;
      case "multipleOf":
        Fe(r, "multipleOf", a.value, a.message, e);
        break;
    }
  return r;
}
function xP() {
  return {
    type: "boolean"
  };
}
function eh(t, e) {
  return Me(t.type._def, e);
}
const CP = (t, e) => Me(t.innerType._def, e);
function th(t, e, r) {
  const a = r ?? e.dateStrategy;
  if (Array.isArray(a))
    return {
      anyOf: a.map((n, s) => th(t, e, n))
    };
  switch (a) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return kP(t, e);
  }
}
const kP = (t, e) => {
  const r = {
    type: "integer",
    format: "unix-time"
  };
  if (e.target === "openApi3")
    return r;
  for (const a of t.checks)
    switch (a.kind) {
      case "min":
        Fe(
          r,
          "minimum",
          a.value,
          // This is in milliseconds
          a.message,
          e
        );
        break;
      case "max":
        Fe(
          r,
          "maximum",
          a.value,
          // This is in milliseconds
          a.message,
          e
        );
        break;
    }
  return r;
};
function IP(t, e) {
  return {
    ...Me(t.innerType._def, e),
    default: t.defaultValue()
  };
}
function RP(t, e) {
  return e.effectStrategy === "input" ? Me(t.schema._def, e) : Nt(e);
}
function TP(t) {
  return {
    type: "string",
    enum: Array.from(t.values)
  };
}
const AP = (t) => "type" in t && t.type === "string" ? !1 : "allOf" in t;
function OP(t, e) {
  const r = [
    Me(t.left._def, {
      ...e,
      currentPath: [...e.currentPath, "allOf", "0"]
    }),
    Me(t.right._def, {
      ...e,
      currentPath: [...e.currentPath, "allOf", "1"]
    })
  ].filter((s) => !!s);
  let a = e.target === "jsonSchema2019-09" ? { unevaluatedProperties: !1 } : void 0;
  const n = [];
  return r.forEach((s) => {
    if (AP(s))
      n.push(...s.allOf), s.unevaluatedProperties === void 0 && (a = void 0);
    else {
      let o = s;
      if ("additionalProperties" in s && s.additionalProperties === !1) {
        const { additionalProperties: i, ...l } = s;
        o = l;
      } else
        a = void 0;
      n.push(o);
    }
  }), n.length ? {
    allOf: n,
    ...a
  } : void 0;
}
function DP(t, e) {
  const r = typeof t.value;
  return r !== "bigint" && r !== "number" && r !== "boolean" && r !== "string" ? {
    type: Array.isArray(t.value) ? "array" : "object"
  } : e.target === "openApi3" ? {
    type: r === "bigint" ? "integer" : r,
    enum: [t.value]
  } : {
    type: r === "bigint" ? "integer" : r,
    const: t.value
  };
}
let Zo;
const Wt = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => (Zo === void 0 && (Zo = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), Zo),
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function rh(t, e) {
  const r = {
    type: "string"
  };
  if (t.checks)
    for (const a of t.checks)
      switch (a.kind) {
        case "min":
          Fe(r, "minLength", typeof r.minLength == "number" ? Math.max(r.minLength, a.value) : a.value, a.message, e);
          break;
        case "max":
          Fe(r, "maxLength", typeof r.maxLength == "number" ? Math.min(r.maxLength, a.value) : a.value, a.message, e);
          break;
        case "email":
          switch (e.emailStrategy) {
            case "format:email":
              Jt(r, "email", a.message, e);
              break;
            case "format:idn-email":
              Jt(r, "idn-email", a.message, e);
              break;
            case "pattern:zod":
              Ct(r, Wt.email, a.message, e);
              break;
          }
          break;
        case "url":
          Jt(r, "uri", a.message, e);
          break;
        case "uuid":
          Jt(r, "uuid", a.message, e);
          break;
        case "regex":
          Ct(r, a.regex, a.message, e);
          break;
        case "cuid":
          Ct(r, Wt.cuid, a.message, e);
          break;
        case "cuid2":
          Ct(r, Wt.cuid2, a.message, e);
          break;
        case "startsWith":
          Ct(r, RegExp(`^${Wo(a.value, e)}`), a.message, e);
          break;
        case "endsWith":
          Ct(r, RegExp(`${Wo(a.value, e)}$`), a.message, e);
          break;
        case "datetime":
          Jt(r, "date-time", a.message, e);
          break;
        case "date":
          Jt(r, "date", a.message, e);
          break;
        case "time":
          Jt(r, "time", a.message, e);
          break;
        case "duration":
          Jt(r, "duration", a.message, e);
          break;
        case "length":
          Fe(r, "minLength", typeof r.minLength == "number" ? Math.max(r.minLength, a.value) : a.value, a.message, e), Fe(r, "maxLength", typeof r.maxLength == "number" ? Math.min(r.maxLength, a.value) : a.value, a.message, e);
          break;
        case "includes": {
          Ct(r, RegExp(Wo(a.value, e)), a.message, e);
          break;
        }
        case "ip": {
          a.version !== "v6" && Jt(r, "ipv4", a.message, e), a.version !== "v4" && Jt(r, "ipv6", a.message, e);
          break;
        }
        case "base64url":
          Ct(r, Wt.base64url, a.message, e);
          break;
        case "jwt":
          Ct(r, Wt.jwt, a.message, e);
          break;
        case "cidr": {
          a.version !== "v6" && Ct(r, Wt.ipv4Cidr, a.message, e), a.version !== "v4" && Ct(r, Wt.ipv6Cidr, a.message, e);
          break;
        }
        case "emoji":
          Ct(r, Wt.emoji(), a.message, e);
          break;
        case "ulid": {
          Ct(r, Wt.ulid, a.message, e);
          break;
        }
        case "base64": {
          switch (e.base64Strategy) {
            case "format:binary": {
              Jt(r, "binary", a.message, e);
              break;
            }
            case "contentEncoding:base64": {
              Fe(r, "contentEncoding", "base64", a.message, e);
              break;
            }
            case "pattern:zod": {
              Ct(r, Wt.base64, a.message, e);
              break;
            }
          }
          break;
        }
        case "nanoid":
          Ct(r, Wt.nanoid, a.message, e);
      }
  return r;
}
function Wo(t, e) {
  return e.patternStrategy === "escape" ? NP(t) : t;
}
const LP = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function NP(t) {
  let e = "";
  for (let r = 0; r < t.length; r++)
    LP.has(t[r]) || (e += "\\"), e += t[r];
  return e;
}
function Jt(t, e, r, a) {
  var n;
  t.format || (n = t.anyOf) != null && n.some((s) => s.format) ? (t.anyOf || (t.anyOf = []), t.format && (t.anyOf.push({
    format: t.format,
    ...t.errorMessage && a.errorMessages && {
      errorMessage: { format: t.errorMessage.format }
    }
  }), delete t.format, t.errorMessage && (delete t.errorMessage.format, Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)), t.anyOf.push({
    format: e,
    ...r && a.errorMessages && { errorMessage: { format: r } }
  })) : Fe(t, "format", e, r, a);
}
function Ct(t, e, r, a) {
  var n;
  t.pattern || (n = t.allOf) != null && n.some((s) => s.pattern) ? (t.allOf || (t.allOf = []), t.pattern && (t.allOf.push({
    pattern: t.pattern,
    ...t.errorMessage && a.errorMessages && {
      errorMessage: { pattern: t.errorMessage.pattern }
    }
  }), delete t.pattern, t.errorMessage && (delete t.errorMessage.pattern, Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)), t.allOf.push({
    pattern: Lu(e, a),
    ...r && a.errorMessages && { errorMessage: { pattern: r } }
  })) : Fe(t, "pattern", Lu(e, a), r, a);
}
function Lu(t, e) {
  var l;
  if (!e.applyRegexFlags || !t.flags)
    return t.source;
  const r = {
    i: t.flags.includes("i"),
    m: t.flags.includes("m"),
    s: t.flags.includes("s")
    // `.` matches newlines
  }, a = r.i ? t.source.toLowerCase() : t.source;
  let n = "", s = !1, o = !1, i = !1;
  for (let c = 0; c < a.length; c++) {
    if (s) {
      n += a[c], s = !1;
      continue;
    }
    if (r.i) {
      if (o) {
        if (a[c].match(/[a-z]/)) {
          i ? (n += a[c], n += `${a[c - 2]}-${a[c]}`.toUpperCase(), i = !1) : a[c + 1] === "-" && ((l = a[c + 2]) != null && l.match(/[a-z]/)) ? (n += a[c], i = !0) : n += `${a[c]}${a[c].toUpperCase()}`;
          continue;
        }
      } else if (a[c].match(/[a-z]/)) {
        n += `[${a[c]}${a[c].toUpperCase()}]`;
        continue;
      }
    }
    if (r.m) {
      if (a[c] === "^") {
        n += `(^|(?<=[\r
]))`;
        continue;
      } else if (a[c] === "$") {
        n += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (r.s && a[c] === ".") {
      n += o ? `${a[c]}\r
` : `[${a[c]}\r
]`;
      continue;
    }
    n += a[c], a[c] === "\\" ? s = !0 : o && a[c] === "]" ? o = !1 : !o && a[c] === "[" && (o = !0);
  }
  try {
    new RegExp(n);
  } catch {
    return console.warn(`Could not convert regex pattern at ${e.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), t.source;
  }
  return n;
}
function nh(t, e) {
  var a, n, s, o, i, l;
  if (e.target === "openAi" && console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead."), e.target === "openApi3" && ((a = t.keyType) == null ? void 0 : a._def.typeName) === z.ZodEnum)
    return {
      type: "object",
      required: t.keyType._def.values,
      properties: t.keyType._def.values.reduce((c, u) => ({
        ...c,
        [u]: Me(t.valueType._def, {
          ...e,
          currentPath: [...e.currentPath, "properties", u]
        }) ?? Nt(e)
      }), {}),
      additionalProperties: e.rejectedAdditionalProperties
    };
  const r = {
    type: "object",
    additionalProperties: Me(t.valueType._def, {
      ...e,
      currentPath: [...e.currentPath, "additionalProperties"]
    }) ?? e.allowedAdditionalProperties
  };
  if (e.target === "openApi3")
    return r;
  if (((n = t.keyType) == null ? void 0 : n._def.typeName) === z.ZodString && ((s = t.keyType._def.checks) != null && s.length)) {
    const { type: c, ...u } = rh(t.keyType._def, e);
    return {
      ...r,
      propertyNames: u
    };
  } else {
    if (((o = t.keyType) == null ? void 0 : o._def.typeName) === z.ZodEnum)
      return {
        ...r,
        propertyNames: {
          enum: t.keyType._def.values
        }
      };
    if (((i = t.keyType) == null ? void 0 : i._def.typeName) === z.ZodBranded && t.keyType._def.type._def.typeName === z.ZodString && ((l = t.keyType._def.type._def.checks) != null && l.length)) {
      const { type: c, ...u } = eh(t.keyType._def, e);
      return {
        ...r,
        propertyNames: u
      };
    }
  }
  return r;
}
function $P(t, e) {
  if (e.mapStrategy === "record")
    return nh(t, e);
  const r = Me(t.keyType._def, {
    ...e,
    currentPath: [...e.currentPath, "items", "items", "0"]
  }) || Nt(e), a = Me(t.valueType._def, {
    ...e,
    currentPath: [...e.currentPath, "items", "items", "1"]
  }) || Nt(e);
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [r, a],
      minItems: 2,
      maxItems: 2
    }
  };
}
function MP(t) {
  const e = t.values, a = Object.keys(t.values).filter((s) => typeof e[e[s]] != "number").map((s) => e[s]), n = Array.from(new Set(a.map((s) => typeof s)));
  return {
    type: n.length === 1 ? n[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: a
  };
}
function FP(t) {
  return t.target === "openAi" ? void 0 : {
    not: Nt({
      ...t,
      currentPath: [...t.currentPath, "not"]
    })
  };
}
function jP(t) {
  return t.target === "openApi3" ? {
    enum: ["null"],
    nullable: !0
  } : {
    type: "null"
  };
}
const Ts = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function BP(t, e) {
  if (e.target === "openApi3")
    return Nu(t, e);
  const r = t.options instanceof Map ? Array.from(t.options.values()) : t.options;
  if (r.every((a) => a._def.typeName in Ts && (!a._def.checks || !a._def.checks.length))) {
    const a = r.reduce((n, s) => {
      const o = Ts[s._def.typeName];
      return o && !n.includes(o) ? [...n, o] : n;
    }, []);
    return {
      type: a.length > 1 ? a : a[0]
    };
  } else if (r.every((a) => a._def.typeName === "ZodLiteral" && !a.description)) {
    const a = r.reduce((n, s) => {
      const o = typeof s._def.value;
      switch (o) {
        case "string":
        case "number":
        case "boolean":
          return [...n, o];
        case "bigint":
          return [...n, "integer"];
        case "object":
          if (s._def.value === null)
            return [...n, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return n;
      }
    }, []);
    if (a.length === r.length) {
      const n = a.filter((s, o, i) => i.indexOf(s) === o);
      return {
        type: n.length > 1 ? n : n[0],
        enum: r.reduce((s, o) => s.includes(o._def.value) ? s : [...s, o._def.value], [])
      };
    }
  } else if (r.every((a) => a._def.typeName === "ZodEnum"))
    return {
      type: "string",
      enum: r.reduce((a, n) => [
        ...a,
        ...n._def.values.filter((s) => !a.includes(s))
      ], [])
    };
  return Nu(t, e);
}
const Nu = (t, e) => {
  const r = (t.options instanceof Map ? Array.from(t.options.values()) : t.options).map((a, n) => Me(a._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", `${n}`]
  })).filter((a) => !!a && (!e.strictUnions || typeof a == "object" && Object.keys(a).length > 0));
  return r.length ? { anyOf: r } : void 0;
};
function UP(t, e) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(t.innerType._def.typeName) && (!t.innerType._def.checks || !t.innerType._def.checks.length))
    return e.target === "openApi3" ? {
      type: Ts[t.innerType._def.typeName],
      nullable: !0
    } : {
      type: [
        Ts[t.innerType._def.typeName],
        "null"
      ]
    };
  if (e.target === "openApi3") {
    const a = Me(t.innerType._def, {
      ...e,
      currentPath: [...e.currentPath]
    });
    return a && "$ref" in a ? { allOf: [a], nullable: !0 } : a && { ...a, nullable: !0 };
  }
  const r = Me(t.innerType._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", "0"]
  });
  return r && { anyOf: [r, { type: "null" }] };
}
function VP(t, e) {
  const r = {
    type: "number"
  };
  if (!t.checks)
    return r;
  for (const a of t.checks)
    switch (a.kind) {
      case "int":
        r.type = "integer", Yf(r, "type", a.message, e);
        break;
      case "min":
        e.target === "jsonSchema7" ? a.inclusive ? Fe(r, "minimum", a.value, a.message, e) : Fe(r, "exclusiveMinimum", a.value, a.message, e) : (a.inclusive || (r.exclusiveMinimum = !0), Fe(r, "minimum", a.value, a.message, e));
        break;
      case "max":
        e.target === "jsonSchema7" ? a.inclusive ? Fe(r, "maximum", a.value, a.message, e) : Fe(r, "exclusiveMaximum", a.value, a.message, e) : (a.inclusive || (r.exclusiveMaximum = !0), Fe(r, "maximum", a.value, a.message, e));
        break;
      case "multipleOf":
        Fe(r, "multipleOf", a.value, a.message, e);
        break;
    }
  return r;
}
function zP(t, e) {
  const r = e.target === "openAi", a = {
    type: "object",
    properties: {}
  }, n = [], s = t.shape();
  for (const i in s) {
    let l = s[i];
    if (l === void 0 || l._def === void 0)
      continue;
    let c = HP(l);
    c && r && (l._def.typeName === "ZodOptional" && (l = l._def.innerType), l.isNullable() || (l = l.nullable()), c = !1);
    const u = Me(l._def, {
      ...e,
      currentPath: [...e.currentPath, "properties", i],
      propertyPath: [...e.currentPath, "properties", i]
    });
    u !== void 0 && (a.properties[i] = u, c || n.push(i));
  }
  n.length && (a.required = n);
  const o = qP(t, e);
  return o !== void 0 && (a.additionalProperties = o), a;
}
function qP(t, e) {
  if (t.catchall._def.typeName !== "ZodNever")
    return Me(t.catchall._def, {
      ...e,
      currentPath: [...e.currentPath, "additionalProperties"]
    });
  switch (t.unknownKeys) {
    case "passthrough":
      return e.allowedAdditionalProperties;
    case "strict":
      return e.rejectedAdditionalProperties;
    case "strip":
      return e.removeAdditionalStrategy === "strict" ? e.allowedAdditionalProperties : e.rejectedAdditionalProperties;
  }
}
function HP(t) {
  try {
    return t.isOptional();
  } catch {
    return !0;
  }
}
const ZP = (t, e) => {
  var a;
  if (e.currentPath.toString() === ((a = e.propertyPath) == null ? void 0 : a.toString()))
    return Me(t.innerType._def, e);
  const r = Me(t.innerType._def, {
    ...e,
    currentPath: [...e.currentPath, "anyOf", "1"]
  });
  return r ? {
    anyOf: [
      {
        not: Nt(e)
      },
      r
    ]
  } : Nt(e);
}, WP = (t, e) => {
  if (e.pipeStrategy === "input")
    return Me(t.in._def, e);
  if (e.pipeStrategy === "output")
    return Me(t.out._def, e);
  const r = Me(t.in._def, {
    ...e,
    currentPath: [...e.currentPath, "allOf", "0"]
  }), a = Me(t.out._def, {
    ...e,
    currentPath: [...e.currentPath, "allOf", r ? "1" : "0"]
  });
  return {
    allOf: [r, a].filter((n) => n !== void 0)
  };
};
function JP(t, e) {
  return Me(t.type._def, e);
}
function QP(t, e) {
  const a = {
    type: "array",
    uniqueItems: !0,
    items: Me(t.valueType._def, {
      ...e,
      currentPath: [...e.currentPath, "items"]
    })
  };
  return t.minSize && Fe(a, "minItems", t.minSize.value, t.minSize.message, e), t.maxSize && Fe(a, "maxItems", t.maxSize.value, t.maxSize.message, e), a;
}
function GP(t, e) {
  return t.rest ? {
    type: "array",
    minItems: t.items.length,
    items: t.items.map((r, a) => Me(r._def, {
      ...e,
      currentPath: [...e.currentPath, "items", `${a}`]
    })).reduce((r, a) => a === void 0 ? r : [...r, a], []),
    additionalItems: Me(t.rest._def, {
      ...e,
      currentPath: [...e.currentPath, "additionalItems"]
    })
  } : {
    type: "array",
    minItems: t.items.length,
    maxItems: t.items.length,
    items: t.items.map((r, a) => Me(r._def, {
      ...e,
      currentPath: [...e.currentPath, "items", `${a}`]
    })).reduce((r, a) => a === void 0 ? r : [...r, a], [])
  };
}
function KP(t) {
  return {
    not: Nt(t)
  };
}
function YP(t) {
  return Nt(t);
}
const XP = (t, e) => Me(t.innerType._def, e), ex = (t, e, r) => {
  switch (e) {
    case z.ZodString:
      return rh(t, r);
    case z.ZodNumber:
      return VP(t, r);
    case z.ZodObject:
      return zP(t, r);
    case z.ZodBigInt:
      return PP(t, r);
    case z.ZodBoolean:
      return xP();
    case z.ZodDate:
      return th(t, r);
    case z.ZodUndefined:
      return KP(r);
    case z.ZodNull:
      return jP(r);
    case z.ZodArray:
      return SP(t, r);
    case z.ZodUnion:
    case z.ZodDiscriminatedUnion:
      return BP(t, r);
    case z.ZodIntersection:
      return OP(t, r);
    case z.ZodTuple:
      return GP(t, r);
    case z.ZodRecord:
      return nh(t, r);
    case z.ZodLiteral:
      return DP(t, r);
    case z.ZodEnum:
      return TP(t);
    case z.ZodNativeEnum:
      return MP(t);
    case z.ZodNullable:
      return UP(t, r);
    case z.ZodOptional:
      return ZP(t, r);
    case z.ZodMap:
      return $P(t, r);
    case z.ZodSet:
      return QP(t, r);
    case z.ZodLazy:
      return () => t.getter()._def;
    case z.ZodPromise:
      return JP(t, r);
    case z.ZodNaN:
    case z.ZodNever:
      return FP(r);
    case z.ZodEffects:
      return RP(t, r);
    case z.ZodAny:
      return Nt(r);
    case z.ZodUnknown:
      return YP(r);
    case z.ZodDefault:
      return IP(t, r);
    case z.ZodBranded:
      return eh(t, r);
    case z.ZodReadonly:
      return XP(t, r);
    case z.ZodCatch:
      return CP(t, r);
    case z.ZodPipeline:
      return WP(t, r);
    case z.ZodFunction:
    case z.ZodVoid:
    case z.ZodSymbol:
      return;
    default:
      return /* @__PURE__ */ ((a) => {
      })();
  }
};
function Me(t, e, r = !1) {
  var i;
  const a = e.seen.get(t);
  if (e.override) {
    const l = (i = e.override) == null ? void 0 : i.call(e, t, e, a, r);
    if (l !== bP)
      return l;
  }
  if (a && !r) {
    const l = tx(a, e);
    if (l !== void 0)
      return l;
  }
  const n = { def: t, path: e.currentPath, jsonSchema: void 0 };
  e.seen.set(t, n);
  const s = ex(t, t.typeName, e), o = typeof s == "function" ? Me(s(), e) : s;
  if (o && rx(t, e, o), e.postProcess) {
    const l = e.postProcess(o, t, e);
    return n.jsonSchema = o, l;
  }
  return n.jsonSchema = o, o;
}
const tx = (t, e) => {
  switch (e.$refStrategy) {
    case "root":
      return { $ref: t.path.join("/") };
    case "relative":
      return { $ref: Xf(e.currentPath, t.path) };
    case "none":
    case "seen":
      return t.path.length < e.currentPath.length && t.path.every((r, a) => e.currentPath[a] === r) ? (console.warn(`Recursive reference detected at ${e.currentPath.join("/")}! Defaulting to any`), Nt(e)) : e.$refStrategy === "seen" ? Nt(e) : void 0;
  }
}, rx = (t, e, r) => (t.description && (r.description = t.description, e.markdownDescription && (r.markdownDescription = t.description)), r), $u = (t, e) => {
  const r = EP(e);
  let a = typeof e == "object" && e.definitions ? Object.entries(e.definitions).reduce((l, [c, u]) => ({
    ...l,
    [c]: Me(u._def, {
      ...r,
      currentPath: [...r.basePath, r.definitionPath, c]
    }, !0) ?? Nt(r)
  }), {}) : void 0;
  const n = typeof e == "string" ? e : (e == null ? void 0 : e.nameStrategy) === "title" || e == null ? void 0 : e.name, s = Me(t._def, n === void 0 ? r : {
    ...r,
    currentPath: [...r.basePath, r.definitionPath, n]
  }, !1) ?? Nt(r), o = typeof e == "object" && e.name !== void 0 && e.nameStrategy === "title" ? e.name : void 0;
  o !== void 0 && (s.title = o), r.flags.hasReferencedOpenAiAnyType && (a || (a = {}), a[r.openAiAnyTypeName] || (a[r.openAiAnyTypeName] = {
    // Skipping "object" as no properties can be defined and additionalProperties must be "false"
    type: ["string", "number", "integer", "boolean", "array", "null"],
    items: {
      $ref: r.$refStrategy === "relative" ? "1" : [
        ...r.basePath,
        r.definitionPath,
        r.openAiAnyTypeName
      ].join("/")
    }
  }));
  const i = n === void 0 ? a ? {
    ...s,
    [r.definitionPath]: a
  } : s : {
    $ref: [
      ...r.$refStrategy === "relative" ? [] : r.basePath,
      r.definitionPath,
      n
    ].join("/"),
    [r.definitionPath]: {
      ...a,
      [n]: s
    }
  };
  return r.target === "jsonSchema7" ? i.$schema = "http://json-schema.org/draft-07/schema#" : (r.target === "jsonSchema2019-09" || r.target === "openAi") && (i.$schema = "https://json-schema.org/draft/2019-09/schema#"), r.target === "openAi" && ("anyOf" in i || "oneOf" in i || "allOf" in i || "type" in i && Array.isArray(i.type)) && console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property."), i;
};
var tl;
(function(t) {
  t.Completable = "McpCompletable";
})(tl || (tl = {}));
class rl extends ke {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = r.data;
    return this._def.type._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  unwrap() {
    return this._def.type;
  }
}
rl.create = (t, e) => new rl({
  type: t,
  typeName: tl.Completable,
  complete: e.complete,
  ...nx(e)
});
function nx(t) {
  if (!t)
    return {};
  const { errorMap: e, invalid_type_error: r, required_error: a, description: n } = t;
  if (e && (r || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (o, i) => {
    var l, c;
    const { message: u } = t;
    return o.code === "invalid_enum_value" ? { message: u ?? i.defaultError } : typeof i.data > "u" ? { message: (l = u ?? a) !== null && l !== void 0 ? l : i.defaultError } : o.code !== "invalid_type" ? { message: i.defaultError } : { message: (c = u ?? r) !== null && c !== void 0 ? c : i.defaultError };
  }, description: n };
}
class ax {
  constructor(e, r) {
    this._registeredResources = {}, this._registeredResourceTemplates = {}, this._registeredTools = {}, this._registeredPrompts = {}, this._toolHandlersInitialized = !1, this._completionHandlerInitialized = !1, this._resourceHandlersInitialized = !1, this._promptHandlersInitialized = !1, this.server = new yP(e, r);
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The `server` object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(e) {
    return await this.server.connect(e);
  }
  /**
   * Closes the connection.
   */
  async close() {
    await this.server.close();
  }
  setToolRequestHandlers() {
    this._toolHandlersInitialized || (this.server.assertCanSetRequestHandler(Si.shape.method.value), this.server.assertCanSetRequestHandler(Pi.shape.method.value), this.server.registerCapabilities({
      tools: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(Si, () => ({
      tools: Object.entries(this._registeredTools).filter(([, e]) => e.enabled).map(([e, r]) => {
        const a = {
          name: e,
          title: r.title,
          description: r.description,
          inputSchema: r.inputSchema ? $u(r.inputSchema, {
            strictUnions: !0
          }) : sx,
          annotations: r.annotations
        };
        return r.outputSchema && (a.outputSchema = $u(r.outputSchema, { strictUnions: !0 })), a;
      })
    })), this.server.setRequestHandler(Pi, async (e, r) => {
      const a = this._registeredTools[e.params.name];
      if (!a)
        throw new Ze(ze.InvalidParams, `Tool ${e.params.name} not found`);
      if (!a.enabled)
        throw new Ze(ze.InvalidParams, `Tool ${e.params.name} disabled`);
      let n;
      if (a.inputSchema) {
        const s = await a.inputSchema.safeParseAsync(e.params.arguments);
        if (!s.success)
          throw new Ze(ze.InvalidParams, `Invalid arguments for tool ${e.params.name}: ${s.error.message}`);
        const o = s.data, i = a.callback;
        try {
          n = await Promise.resolve(i(o, r));
        } catch (l) {
          n = {
            content: [
              {
                type: "text",
                text: l instanceof Error ? l.message : String(l)
              }
            ],
            isError: !0
          };
        }
      } else {
        const s = a.callback;
        try {
          n = await Promise.resolve(s(r));
        } catch (o) {
          n = {
            content: [
              {
                type: "text",
                text: o instanceof Error ? o.message : String(o)
              }
            ],
            isError: !0
          };
        }
      }
      if (a.outputSchema && !n.isError) {
        if (!n.structuredContent)
          throw new Ze(ze.InvalidParams, `Tool ${e.params.name} has an output schema but no structured content was provided`);
        const s = await a.outputSchema.safeParseAsync(n.structuredContent);
        if (!s.success)
          throw new Ze(ze.InvalidParams, `Invalid structured content for tool ${e.params.name}: ${s.error.message}`);
      }
      return n;
    }), this._toolHandlersInitialized = !0);
  }
  setCompletionRequestHandler() {
    this._completionHandlerInitialized || (this.server.assertCanSetRequestHandler(xi.shape.method.value), this.server.registerCapabilities({
      completions: {}
    }), this.server.setRequestHandler(xi, async (e) => {
      switch (e.params.ref.type) {
        case "ref/prompt":
          return this.handlePromptCompletion(e, e.params.ref);
        case "ref/resource":
          return this.handleResourceCompletion(e, e.params.ref);
        default:
          throw new Ze(ze.InvalidParams, `Invalid completion reference: ${e.params.ref}`);
      }
    }), this._completionHandlerInitialized = !0);
  }
  async handlePromptCompletion(e, r) {
    const a = this._registeredPrompts[r.name];
    if (!a)
      throw new Ze(ze.InvalidParams, `Prompt ${r.name} not found`);
    if (!a.enabled)
      throw new Ze(ze.InvalidParams, `Prompt ${r.name} disabled`);
    if (!a.argsSchema)
      return Na;
    const n = a.argsSchema.shape[e.params.argument.name];
    if (!(n instanceof rl))
      return Na;
    const o = await n._def.complete(e.params.argument.value, e.params.context);
    return Fu(o);
  }
  async handleResourceCompletion(e, r) {
    const a = Object.values(this._registeredResourceTemplates).find((o) => o.resourceTemplate.uriTemplate.toString() === r.uri);
    if (!a) {
      if (this._registeredResources[r.uri])
        return Na;
      throw new Ze(ze.InvalidParams, `Resource template ${e.params.ref.uri} not found`);
    }
    const n = a.resourceTemplate.completeCallback(e.params.argument.name);
    if (!n)
      return Na;
    const s = await n(e.params.argument.value, e.params.context);
    return Fu(s);
  }
  setResourceRequestHandlers() {
    this._resourceHandlersInitialized || (this.server.assertCanSetRequestHandler(_i.shape.method.value), this.server.assertCanSetRequestHandler(yi.shape.method.value), this.server.assertCanSetRequestHandler(bi.shape.method.value), this.server.registerCapabilities({
      resources: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(_i, async (e, r) => {
      const a = Object.entries(this._registeredResources).filter(([s, o]) => o.enabled).map(([s, o]) => ({
        uri: s,
        name: o.name,
        ...o.metadata
      })), n = [];
      for (const s of Object.values(this._registeredResourceTemplates)) {
        if (!s.resourceTemplate.listCallback)
          continue;
        const o = await s.resourceTemplate.listCallback(r);
        for (const i of o.resources)
          n.push({
            ...s.metadata,
            // the defined resource metadata should override the template metadata if present
            ...i
          });
      }
      return { resources: [...a, ...n] };
    }), this.server.setRequestHandler(yi, async () => ({ resourceTemplates: Object.entries(this._registeredResourceTemplates).map(([r, a]) => ({
      name: r,
      uriTemplate: a.resourceTemplate.uriTemplate.toString(),
      ...a.metadata
    })) })), this.server.setRequestHandler(bi, async (e, r) => {
      const a = new URL(e.params.uri), n = this._registeredResources[a.toString()];
      if (n) {
        if (!n.enabled)
          throw new Ze(ze.InvalidParams, `Resource ${a} disabled`);
        return n.readCallback(a, r);
      }
      for (const s of Object.values(this._registeredResourceTemplates)) {
        const o = s.resourceTemplate.uriTemplate.match(a.toString());
        if (o)
          return s.readCallback(a, o, r);
      }
      throw new Ze(ze.InvalidParams, `Resource ${a} not found`);
    }), this.setCompletionRequestHandler(), this._resourceHandlersInitialized = !0);
  }
  setPromptRequestHandlers() {
    this._promptHandlersInitialized || (this.server.assertCanSetRequestHandler(wi.shape.method.value), this.server.assertCanSetRequestHandler(Ei.shape.method.value), this.server.registerCapabilities({
      prompts: {
        listChanged: !0
      }
    }), this.server.setRequestHandler(wi, () => ({
      prompts: Object.entries(this._registeredPrompts).filter(([, e]) => e.enabled).map(([e, r]) => ({
        name: e,
        title: r.title,
        description: r.description,
        arguments: r.argsSchema ? ix(r.argsSchema) : void 0
      }))
    })), this.server.setRequestHandler(Ei, async (e, r) => {
      const a = this._registeredPrompts[e.params.name];
      if (!a)
        throw new Ze(ze.InvalidParams, `Prompt ${e.params.name} not found`);
      if (!a.enabled)
        throw new Ze(ze.InvalidParams, `Prompt ${e.params.name} disabled`);
      if (a.argsSchema) {
        const n = await a.argsSchema.safeParseAsync(e.params.arguments);
        if (!n.success)
          throw new Ze(ze.InvalidParams, `Invalid arguments for prompt ${e.params.name}: ${n.error.message}`);
        const s = n.data, o = a.callback;
        return await Promise.resolve(o(s, r));
      } else {
        const n = a.callback;
        return await Promise.resolve(n(r));
      }
    }), this.setCompletionRequestHandler(), this._promptHandlersInitialized = !0);
  }
  resource(e, r, ...a) {
    let n;
    typeof a[0] == "object" && (n = a.shift());
    const s = a[0];
    if (typeof r == "string") {
      if (this._registeredResources[r])
        throw new Error(`Resource ${r} is already registered`);
      const o = this._createRegisteredResource(e, void 0, r, n, s);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), o;
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      const o = this._createRegisteredResourceTemplate(e, void 0, r, n, s);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), o;
    }
  }
  registerResource(e, r, a, n) {
    if (typeof r == "string") {
      if (this._registeredResources[r])
        throw new Error(`Resource ${r} is already registered`);
      const s = this._createRegisteredResource(e, a.title, r, a, n);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), s;
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      const s = this._createRegisteredResourceTemplate(e, a.title, r, a, n);
      return this.setResourceRequestHandlers(), this.sendResourceListChanged(), s;
    }
  }
  _createRegisteredResource(e, r, a, n, s) {
    const o = {
      name: e,
      title: r,
      metadata: n,
      readCallback: s,
      enabled: !0,
      disable: () => o.update({ enabled: !1 }),
      enable: () => o.update({ enabled: !0 }),
      remove: () => o.update({ uri: null }),
      update: (i) => {
        typeof i.uri < "u" && i.uri !== a && (delete this._registeredResources[a], i.uri && (this._registeredResources[i.uri] = o)), typeof i.name < "u" && (o.name = i.name), typeof i.title < "u" && (o.title = i.title), typeof i.metadata < "u" && (o.metadata = i.metadata), typeof i.callback < "u" && (o.readCallback = i.callback), typeof i.enabled < "u" && (o.enabled = i.enabled), this.sendResourceListChanged();
      }
    };
    return this._registeredResources[a] = o, o;
  }
  _createRegisteredResourceTemplate(e, r, a, n, s) {
    const o = {
      resourceTemplate: a,
      title: r,
      metadata: n,
      readCallback: s,
      enabled: !0,
      disable: () => o.update({ enabled: !1 }),
      enable: () => o.update({ enabled: !0 }),
      remove: () => o.update({ name: null }),
      update: (i) => {
        typeof i.name < "u" && i.name !== e && (delete this._registeredResourceTemplates[e], i.name && (this._registeredResourceTemplates[i.name] = o)), typeof i.title < "u" && (o.title = i.title), typeof i.template < "u" && (o.resourceTemplate = i.template), typeof i.metadata < "u" && (o.metadata = i.metadata), typeof i.callback < "u" && (o.readCallback = i.callback), typeof i.enabled < "u" && (o.enabled = i.enabled), this.sendResourceListChanged();
      }
    };
    return this._registeredResourceTemplates[e] = o, o;
  }
  _createRegisteredPrompt(e, r, a, n, s) {
    const o = {
      title: r,
      description: a,
      argsSchema: n === void 0 ? void 0 : W(n),
      callback: s,
      enabled: !0,
      disable: () => o.update({ enabled: !1 }),
      enable: () => o.update({ enabled: !0 }),
      remove: () => o.update({ name: null }),
      update: (i) => {
        typeof i.name < "u" && i.name !== e && (delete this._registeredPrompts[e], i.name && (this._registeredPrompts[i.name] = o)), typeof i.title < "u" && (o.title = i.title), typeof i.description < "u" && (o.description = i.description), typeof i.argsSchema < "u" && (o.argsSchema = W(i.argsSchema)), typeof i.callback < "u" && (o.callback = i.callback), typeof i.enabled < "u" && (o.enabled = i.enabled), this.sendPromptListChanged();
      }
    };
    return this._registeredPrompts[e] = o, o;
  }
  _createRegisteredTool(e, r, a, n, s, o, i) {
    const l = {
      title: r,
      description: a,
      inputSchema: n === void 0 ? void 0 : W(n),
      outputSchema: s === void 0 ? void 0 : W(s),
      annotations: o,
      callback: i,
      enabled: !0,
      disable: () => l.update({ enabled: !1 }),
      enable: () => l.update({ enabled: !0 }),
      remove: () => l.update({ name: null }),
      update: (c) => {
        typeof c.name < "u" && c.name !== e && (delete this._registeredTools[e], c.name && (this._registeredTools[c.name] = l)), typeof c.title < "u" && (l.title = c.title), typeof c.description < "u" && (l.description = c.description), typeof c.paramsSchema < "u" && (l.inputSchema = W(c.paramsSchema)), typeof c.callback < "u" && (l.callback = c.callback), typeof c.annotations < "u" && (l.annotations = c.annotations), typeof c.enabled < "u" && (l.enabled = c.enabled), this.sendToolListChanged();
      }
    };
    return this._registeredTools[e] = l, this.setToolRequestHandlers(), this.sendToolListChanged(), l;
  }
  /**
   * tool() implementation. Parses arguments passed to overrides defined above.
   */
  tool(e, ...r) {
    if (this._registeredTools[e])
      throw new Error(`Tool ${e} is already registered`);
    let a, n, s, o;
    if (typeof r[0] == "string" && (a = r.shift()), r.length > 1) {
      const l = r[0];
      Mu(l) ? (n = r.shift(), r.length > 1 && typeof r[0] == "object" && r[0] !== null && !Mu(r[0]) && (o = r.shift())) : typeof l == "object" && l !== null && (o = r.shift());
    }
    const i = r[0];
    return this._createRegisteredTool(e, void 0, a, n, s, o, i);
  }
  /**
   * Registers a tool with a config object and callback.
   */
  registerTool(e, r, a) {
    if (this._registeredTools[e])
      throw new Error(`Tool ${e} is already registered`);
    const { title: n, description: s, inputSchema: o, outputSchema: i, annotations: l } = r;
    return this._createRegisteredTool(e, n, s, o, i, l, a);
  }
  prompt(e, ...r) {
    if (this._registeredPrompts[e])
      throw new Error(`Prompt ${e} is already registered`);
    let a;
    typeof r[0] == "string" && (a = r.shift());
    let n;
    r.length > 1 && (n = r.shift());
    const s = r[0], o = this._createRegisteredPrompt(e, void 0, a, n, s);
    return this.setPromptRequestHandlers(), this.sendPromptListChanged(), o;
  }
  /**
   * Registers a prompt with a config object and callback.
   */
  registerPrompt(e, r, a) {
    if (this._registeredPrompts[e])
      throw new Error(`Prompt ${e} is already registered`);
    const { title: n, description: s, argsSchema: o } = r, i = this._createRegisteredPrompt(e, n, s, o, a);
    return this.setPromptRequestHandlers(), this.sendPromptListChanged(), i;
  }
  /**
   * Checks if the server is connected to a transport.
   * @returns True if the server is connected
   */
  isConnected() {
    return this.server.transport !== void 0;
  }
  /**
   * Sends a resource list changed event to the client, if connected.
   */
  sendResourceListChanged() {
    this.isConnected() && this.server.sendResourceListChanged();
  }
  /**
   * Sends a tool list changed event to the client, if connected.
   */
  sendToolListChanged() {
    this.isConnected() && this.server.sendToolListChanged();
  }
  /**
   * Sends a prompt list changed event to the client, if connected.
   */
  sendPromptListChanged() {
    this.isConnected() && this.server.sendPromptListChanged();
  }
}
const sx = {
  type: "object",
  properties: {}
};
function Mu(t) {
  return typeof t != "object" || t === null ? !1 : Object.keys(t).length === 0 || Object.values(t).some(ox);
}
function ox(t) {
  return t !== null && typeof t == "object" && "parse" in t && typeof t.parse == "function" && "safeParse" in t && typeof t.safeParse == "function";
}
function ix(t) {
  return Object.entries(t.shape).map(([e, r]) => ({
    name: e,
    description: r.description,
    required: !r.isOptional()
  }));
}
function Fu(t) {
  return {
    completion: {
      values: t.slice(0, 100),
      total: t.length,
      hasMore: t.length > 100
    }
  };
}
const Na = {
  completion: {
    values: [],
    hasMore: !1
  }
}, lx = console, cx = (t) => t.toolList.map((e) => {
  const r = t.toolInstanceMap.get(e.name);
  return {
    ...e,
    status: r ? r.enabled ? "enabled" : "disabled" : "not_registered"
  };
}), ux = (t, e) => {
  const r = t.toolList.find((n) => n.name === e);
  if (!r)
    return null;
  const a = t.toolInstanceMap.get(e);
  return { ...r, status: a ? a.enabled ? "enabled" : "disabled" : "not_registered" };
}, dx = (t, e) => {
  if (!Array.isArray(e) || !e.length)
    return;
  if (!t.server) {
    lx.error("mcp server is not created");
    return;
  }
  return e.map((a) => {
    var l;
    const { name: n, callback: s, ...o } = a, i = (l = t.server) == null ? void 0 : l.registerTool(n, o, s);
    return i && t.toolInstanceMap.set(n, i), i;
  });
}, fx = (t, e) => {
  const r = t.toolInstanceMap.get(e);
  r && (r.remove(), t.toolInstanceMap.delete(e));
}, hx = (t, e, r) => {
  const a = t.toolInstanceMap.get(e);
  a && a.update({ name: e, ...r || {} });
}, $a = console, px = {
  prompts: { listChanged: !0 },
  resources: { subscribe: !0, listChanged: !0 },
  tools: { listChanged: !0 },
  completions: {},
  logging: {}
}, mx = {
  mcpServer: {
    transport: null,
    capabilities: px
  },
  server: null,
  sessionID: "",
  remoteTransport: null,
  toolList: [],
  toolInstanceMap: /* @__PURE__ */ new Map(),
  mcpClient: null,
  serverConnectionStatus: "disconnected"
}, In = (t, e, r) => {
  t.serverConnectionStatus = e;
  const { publish: a } = sl();
  a({ topic: "serverConnectionStatusChanged", data: { status: e, error: r } });
}, As = async (t) => {
  if (t.remoteTransport && !["disconnected", "disconnecting"].includes(t.serverConnectionStatus))
    try {
      In(t, "disconnecting"), await t.remoteTransport.terminateSession(), In(t, "disconnected");
    } catch (e) {
      In(t, "error", e);
    }
}, so = async (t, e, r, a = 0) => {
  const {
    reconnectAttempts: n = 3,
    reconnectInterval: s = 1e3,
    url: o = "",
    token: i = "",
    connectToAgentServer: l = !1
  } = e.agentServer || {};
  if (["connected", "connecting"].includes(t.serverConnectionStatus) || !l)
    return;
  if (!o)
    throw new Error("agent server url is required");
  const c = () => As(t);
  try {
    window.removeEventListener("beforeunload", c), In(t, "connecting");
    const u = sessionStorage.getItem("mcp-session-id") || "", { transport: d, sessionId: h } = await _P({
      client: r,
      url: o,
      token: i || "",
      sessionId: u
    });
    In(t, "connected"), sessionStorage.setItem("mcp-session-id", h), t.sessionID = h, t.remoteTransport = d, window.addEventListener("beforeunload", c);
  } catch (u) {
    a < n ? (await new Promise((d) => setTimeout(d, s)), await so(t, e, r, a + 1)) : In(t, "error", u);
  }
}, vx = async (t, e) => {
  await As(t), await so(t, e, t.mcpClient);
}, gx = async (t, e) => {
  const [r, a] = sP();
  t.mcpServer.transport = r;
  const n = {
    roots: { listChanged: !0 },
    sampling: {}
  }, s = new Hf({ name: "tiny-engine-mcp-client", version: "1.0.0" }, { capabilities: n });
  await s.connect(a), t.mcpClient = s, await so(t, e, s);
}, _x = async (t) => {
  const { transport: e, capabilities: r } = t.mcpServer;
  if (!e)
    throw new Error("transport is not available");
  const a = new ax(
    {
      name: "tiny-engine-mcp-server",
      version: "1.0.0"
    },
    {
      capabilities: r
    }
  );
  t.toolList.forEach((s) => {
    const { name: o, callback: i, inputSchema: l, outputSchema: c, ...u } = s;
    try {
      if (t.toolInstanceMap.has(o)) {
        $a.error(`tool ${o} already registered`);
        return;
      }
      if (!o || typeof o != "string") {
        $a.error("tool name is required and must be a string");
        return;
      }
      if (!i || typeof i != "function") {
        $a.error("tool callback is required and must be a function");
        return;
      }
      const d = a.registerTool(
        o,
        // 需要序列化一次，否则 list tool 会超时，因为有 proxy 之后，内部会报错
        {
          ...JSON.parse(JSON.stringify(u)),
          inputSchema: l,
          outputSchema: c
        },
        i
      );
      t.toolInstanceMap.set(o, d);
    } catch (d) {
      $a.error("error when register tool", d);
    }
  }), await a.connect(xh(e)), t.server = a;
  const { publish: n } = sl();
  n({ topic: "mcpServerCreated", data: a });
}, yx = (t) => {
  const e = Qh(), r = [];
  e.forEach((a) => {
    var n;
    Array.isArray((n = a.mcp) == null ? void 0 : n.tools) && r.push(...a.mcp.tools);
  }), t.toolList = r;
}, kC = ol({
  id: jn.McpService,
  type: "MetaService",
  options: {
    agentServer: {
      url: null,
      token: null,
      connectToAgentServer: !1
    }
  },
  initialState: mx,
  init: async ({ state: t, options: e }) => {
    await gx(t, e), yx(t), await _x(t);
  },
  apis: ({ state: t, options: e }) => ({
    getMcpServer: () => t.server,
    getMcpClient: () => t.mcpClient,
    getRemoteTransport: () => t.remoteTransport,
    connectToRemoteServer: () => so(t, e, t.mcpClient),
    reconnectToRemoteServer: () => vx(t, e),
    closeRemoteServer: () => As(t),
    getServerConnectionStatus: () => t.serverConnectionStatus,
    closeTransport: () => As(t),
    registerTools: (r) => dx(t, r),
    getToolList: () => cx(t),
    getToolByName: (r) => ux(t, r),
    removeTool: (r) => fx(t, r),
    updateTool: (r, a) => hx(t, r, a)
  })
});
export {
  fy as BindI18n,
  pC as BlockDeployDialog,
  uC as BlockDescription,
  iC as BlockHistoryList,
  cC as BlockLinkEvent,
  lC as BlockLinkField,
  Dp as ButtonGroup,
  yC as CanvasDragItem,
  Gp as CloseIcon,
  fp as ConfigCollapse,
  Ju as ConfigGroup,
  ll as ConfigItem,
  Kx as ConfigRender,
  hC as EmptyTip,
  PC as GenerateCodeService,
  xC as GlobalService,
  CC as HttpService,
  _C as I18nInput,
  fC as LifeCycles,
  Wp as LinkButton,
  iv as MaskModal,
  kC as McpService,
  ld as MetaChildItem,
  aC as MetaCodeEditor,
  ud as MetaDescription,
  hm as MetaForm,
  mC as MetaList,
  Yx as MetaListActions,
  vv as MetaListItem,
  bv as MetaListItems,
  Xx as MetaListTitle,
  eC as MetaModal,
  tC as MetaModalItem,
  rC as MetaPopover,
  wC as Modal,
  oC as MonacoEditor,
  EC as Notify,
  gC as Pane,
  dC as PluginBlockList,
  Qx as PluginPanel,
  Gx as PluginRightMenu,
  Jx as PluginSetting,
  mg as PublicIcon,
  s_ as SearchEmpty,
  o_ as SelectAll,
  vC as SplitPanes,
  cl as SvgButton,
  bC as ToolbarBase,
  sC as VideoGuide,
  Vs as VueMonaco,
  SC as injectGlobalComponents,
  nC as setGlobalMonacoEditorTheme,
  wv as useModal
};
//# sourceMappingURL=index.js.map
