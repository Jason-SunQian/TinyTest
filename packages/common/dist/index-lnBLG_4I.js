import "./style.css";
import { unref as c } from "vue";
var f;
const d = typeof window < "u";
d && ((f = window == null ? void 0 : window.navigator) != null && f.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function w(t) {
  return typeof t == "function" ? t() : c(t);
}
function p(t, n) {
  function r(...e) {
    t(() => n.apply(this, e), { fn: n, thisArg: this, args: e });
  }
  return r;
}
function m(t, n = !0, r = !0) {
  let e = 0, i, o = !0;
  const l = () => {
    i && (clearTimeout(i), i = void 0);
  };
  return (a) => {
    const u = w(t), s = Date.now() - e;
    if (l(), u <= 0)
      return e = Date.now(), a();
    s > u && (r || !o) ? (e = Date.now(), a()) : n && (i = setTimeout(() => {
      e = Date.now(), o = !0, l(), a();
    }, u - s)), !r && !i && (i = setTimeout(() => o = !0, u)), o = !1;
  };
}
function D(t, n = 200, r = !1, e = !0) {
  return p(m(n, r, e), t);
}
export {
  D as u
};
//# sourceMappingURL=index-lnBLG_4I.js.map
