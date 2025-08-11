import { createElementBlock as c, openBlock as d, createElementVNode as o, normalizeStyle as y, normalizeClass as b, createCommentVNode as r, toDisplayString as s, renderSlot as g, createTextVNode as h } from "vue";
const f = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [n, u] of t)
    l[n] = u;
  return l;
}, C = {
  name: "CustomVantButton",
  props: {
    text: {
      type: String,
      default: "按钮"
    },
    type: {
      type: String,
      default: "default",
      validator: (e) => ["default", "primary", "success", "warning", "danger"].includes(e)
    },
    size: {
      type: String,
      default: "normal",
      validator: (e) => ["large", "normal", "small", "mini"].includes(e)
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    loading: {
      type: Boolean,
      default: !1
    },
    block: {
      type: Boolean,
      default: !1
    },
    round: {
      type: Boolean,
      default: !1
    },
    square: {
      type: Boolean,
      default: !1
    },
    color: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    iconPosition: {
      type: String,
      default: "left",
      validator: (e) => ["left", "right"].includes(e)
    }
  },
  emits: ["click"],
  computed: {
    buttonClasses() {
      return [
        "custom-vant-button",
        `custom-vant-button--${this.type}`,
        `custom-vant-button--${this.size}`,
        {
          "custom-vant-button--disabled": this.disabled,
          "custom-vant-button--loading": this.loading,
          "custom-vant-button--block": this.block,
          "custom-vant-button--round": this.round,
          "custom-vant-button--square": this.square
        }
      ];
    },
    buttonStyles() {
      const e = {};
      return this.color && (e.backgroundColor = this.color, e.borderColor = this.color), this.block && (e.width = "100%"), e;
    }
  },
  setup(e, { emit: t }) {
    return {
      handleClick: (n) => {
        !e.disabled && !e.loading && t("click", n);
      }
    };
  }
}, m = { class: "custom-vant-button-wrapper" }, _ = ["disabled"], p = {
  key: 0,
  class: "loading-spinner"
}, S = {
  key: 1,
  class: "icon-left"
}, B = { class: "button-text" }, T = {
  key: 2,
  class: "icon-right"
};
function P(e, t, l, n, u, k) {
  return d(), c("div", m, [
    o("button", {
      class: b(k.buttonClasses),
      disabled: l.disabled,
      style: y(k.buttonStyles),
      onClick: t[0] || (t[0] = (...a) => n.handleClick && n.handleClick(...a))
    }, [
      l.loading ? (d(), c("span", p)) : r("", !0),
      l.icon && l.iconPosition === "left" ? (d(), c("span", S, s(l.icon), 1)) : r("", !0),
      o("span", B, [
        g(e.$slots, "default", {}, () => [
          h(s(l.text), 1)
        ], !0)
      ]),
      l.icon && l.iconPosition === "right" ? (d(), c("span", T, s(l.icon), 1)) : r("", !0)
    ], 14, _)
  ]);
}
const v = /* @__PURE__ */ f(C, [["render", P], ["__scopeId", "data-v-c600bea4"]]), w = {
  name: "BusinessCard",
  props: {
    // 基础属性
    num: {
      type: [String, Number],
      default: ""
    },
    price: {
      type: [String, Number],
      default: ""
    },
    title: {
      type: String,
      default: "商品标题"
    },
    desc: {
      type: String,
      default: "商品描述"
    },
    thumb: {
      type: String,
      default: ""
    },
    originPrice: {
      type: [String, Number],
      default: ""
    },
    tag: {
      type: String,
      default: ""
    },
    lazyLoad: {
      type: Boolean,
      default: !1
    },
    priceDecimalLength: {
      type: Number,
      default: 2
    },
    currency: {
      type: String,
      default: "¥"
    },
    footer: {
      type: String,
      default: ""
    },
    bottom: {
      type: String,
      default: ""
    },
    // 业务属性
    showTag: {
      type: Boolean,
      default: !0
    },
    tagType: {
      type: String,
      default: "primary",
      validator: (e) => ["default", "primary", "success", "warning", "danger"].includes(e)
    },
    tagColor: {
      type: String,
      default: ""
    },
    tagTextColor: {
      type: String,
      default: ""
    },
    tagText: {
      type: String,
      default: "热销"
    },
    showButton: {
      type: Boolean,
      default: !0
    },
    buttonType: {
      type: String,
      default: "primary",
      validator: (e) => ["default", "primary", "success", "warning", "danger"].includes(e)
    },
    buttonSize: {
      type: String,
      default: "small",
      validator: (e) => ["large", "normal", "small", "mini"].includes(e)
    },
    buttonText: {
      type: String,
      default: "立即购买"
    },
    showBottom: {
      type: Boolean,
      default: !1
    },
    bottomText: {
      type: String,
      default: "底部信息"
    }
  },
  emits: [
    "click",
    "click-thumb",
    "click-title",
    "click-price",
    "click-origin-price",
    "click-desc",
    "click-tag",
    "click-num",
    "click-lazy-load",
    "click-bottom",
    "click-footer",
    "button-click"
  ],
  setup(e, { emit: t }) {
    return {
      handleClick: (i) => {
        t("click", i);
      },
      handleClickThumb: (i) => {
        i.stopPropagation(), t("click-thumb", i);
      },
      handleClickTitle: (i) => {
        i.stopPropagation(), t("click-title", i);
      },
      handleClickPrice: (i) => {
        i.stopPropagation(), t("click-price", i);
      },
      handleClickOriginPrice: (i) => {
        i.stopPropagation(), t("click-origin-price", i);
      },
      handleClickDesc: (i) => {
        i.stopPropagation(), t("click-desc", i);
      },
      handleClickTag: (i) => {
        i.stopPropagation(), t("click-tag", i);
      },
      handleClickNum: (i) => {
        i.stopPropagation(), t("click-num", i);
      },
      handleClickLazyLoad: (i) => {
        i.stopPropagation(), t("click-lazy-load", i);
      },
      handleClickBottom: (i) => {
        i.stopPropagation(), t("click-bottom", i);
      },
      handleClickFooter: (i) => {
        i.stopPropagation(), t("click-footer", i);
      },
      handleButtonClick: (i) => {
        i.stopPropagation(), t("button-click", i);
      }
    };
  }
}, x = { class: "business-card-wrapper" }, z = { class: "business-card__header" }, N = {
  key: 0,
  class: "business-card__thumb"
}, D = ["src", "alt"], L = { class: "business-card__content" }, O = { class: "business-card__price-section" }, V = { class: "business-card__footer" }, q = { class: "business-card__actions" };
function E(e, t, l, n, u, k) {
  return d(), c("div", x, [
    o("div", {
      class: "business-card",
      onClick: t[8] || (t[8] = (...a) => n.handleClick && n.handleClick(...a))
    }, [
      o("div", z, [
        l.thumb ? (d(), c("div", N, [
          o("img", {
            src: l.thumb,
            alt: l.title,
            onClick: t[0] || (t[0] = (...a) => n.handleClickThumb && n.handleClickThumb(...a))
          }, null, 8, D)
        ])) : r("", !0),
        o("div", L, [
          o("div", {
            class: "business-card__title",
            onClick: t[1] || (t[1] = (...a) => n.handleClickTitle && n.handleClickTitle(...a))
          }, s(l.title), 1),
          o("div", {
            class: "business-card__desc",
            onClick: t[2] || (t[2] = (...a) => n.handleClickDesc && n.handleClickDesc(...a))
          }, s(l.desc), 1),
          o("div", O, [
            o("span", {
              class: "business-card__price",
              onClick: t[3] || (t[3] = (...a) => n.handleClickPrice && n.handleClickPrice(...a))
            }, s(l.currency) + s(l.price), 1),
            l.originPrice ? (d(), c("span", {
              key: 0,
              class: "business-card__origin-price",
              onClick: t[4] || (t[4] = (...a) => n.handleClickOriginPrice && n.handleClickOriginPrice(...a))
            }, s(l.currency) + s(l.originPrice), 1)) : r("", !0)
          ])
        ])
      ]),
      o("div", V, [
        o("div", {
          class: "business-card__tags",
          onClick: t[5] || (t[5] = (...a) => n.handleClickTag && n.handleClickTag(...a))
        }, [
          g(e.$slots, "tags", {}, () => [
            l.showTag ? (d(), c("span", {
              key: 0,
              class: b(["business-card__tag", `business-card__tag--${l.tagType}`])
            }, s(l.tagText), 3)) : r("", !0)
          ], !0)
        ]),
        o("div", q, [
          g(e.$slots, "footer", {}, () => [
            l.showButton ? (d(), c("button", {
              key: 0,
              class: b(["business-card__button", `business-card__button--${l.buttonType} business-card__button--${l.buttonSize}`]),
              onClick: t[6] || (t[6] = (...a) => n.handleButtonClick && n.handleButtonClick(...a))
            }, s(l.buttonText), 3)) : r("", !0)
          ], !0)
        ])
      ]),
      l.showBottom ? (d(), c("div", {
        key: 0,
        class: "business-card__bottom",
        onClick: t[7] || (t[7] = (...a) => n.handleClickBottom && n.handleClickBottom(...a))
      }, [
        g(e.$slots, "bottom", {}, () => [
          h(s(l.bottomText), 1)
        ], !0)
      ])) : r("", !0)
    ])
  ]);
}
const F = /* @__PURE__ */ f(w, [["render", E], ["__scopeId", "data-v-da264e7c"]]), Q = {
  CustomVantButton: v,
  BusinessCard: F
};
export {
  F as BusinessCard,
  v as CustomVantButton,
  Q as default
};
