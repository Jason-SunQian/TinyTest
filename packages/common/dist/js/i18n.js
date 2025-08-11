import { createI18n as c } from "vue-i18n";
import { I18nInjectionKey as C } from "vue-i18n";
import { defineCustomI18n as m } from "@opentiny/tiny-engine-i18n-host";
import { default as h } from "@opentiny/tiny-engine-i18n-host";
import a from "@opentiny/vue-locale";
import { i18nKeyMaps as n } from "./constants.js";
const i = ({ locale: r, messages: e }) => {
  const o = {};
  return Object.keys(e).forEach((t) => {
    const s = n[t];
    o[s] = e[t];
  }), c({
    locale: r,
    messages: o,
    legacy: !1
  });
}, f = a.initI18n({
  i18n: { locale: n.zhCN },
  createI18n: i,
  messages: {}
});
m(f);
export {
  C as I18nInjectionKey,
  h as default,
  n as i18nKeyMaps
};
//# sourceMappingURL=i18n.js.map
