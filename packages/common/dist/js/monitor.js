import { requestEvent as s } from "./http.js";
let i = "";
const l = () => {
  var r, t, o;
  const e = (o = (t = (r = window.location) == null ? void 0 : r.search) == null ? void 0 : t.substring(1)) == null ? void 0 : o.split("&"), n = {};
  return e.length && e.forEach((a) => {
    let c = a.split("=");
    n[c[0]] = c[1];
  }), JSON.stringify(n);
}, f = () => {
  window.onerror = function(e, n, r, t, o) {
    s(i, {
      event_type: "design_JSError",
      url: window.location.href,
      unit: l(),
      content: JSON.stringify({ errorMessage: e, scriptURI: n, columnNo: t, error: o })
    });
  };
}, u = () => {
  window.addEventListener(
    "unhandledrejection",
    (e) => {
      e.preventDefault();
      let n, r = "", t = e.reason;
      typeof t == "string" ? n = t : typeof t == "object" && (n = t.message, t.stack && (r = t.stack.match(/at\s+(.+):(\d+):(\d+)/))), s(i, {
        event_type: "design_promiseError",
        url: window.location.href,
        unit: l(),
        content: JSON.stringify({
          message: n,
          matchResult: r
        })
      });
    },
    !0
  );
}, m = () => {
  if (!i)
    return !1;
  window.frames[0].onerror = function(e, n, r, t, o) {
    s(i, {
      event_type: "design_iframeError",
      url: window.location.href,
      unit: l(),
      content: JSON.stringify({
        errorMessage: e,
        scriptURI: n,
        columnNo: t,
        error: o
      })
    });
  };
}, d = (e) => {
  i = e, f(), u();
};
export {
  m as iframeMonitoring,
  d as initMonitor
};
//# sourceMappingURL=monitor.js.map
