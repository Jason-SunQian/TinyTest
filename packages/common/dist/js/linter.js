const g = "" + new URL("../assets/eslint.worker-gX86sJE8.js", import.meta.url).href, p = (e, o, a) => {
  let r = new URL(g, import.meta.url);
  if (r.origin !== location.origin) {
    const n = new Blob([`import('${r}');`], {
      type: "application/javascript"
    });
    r = window.URL.createObjectURL(n);
  }
  const s = new Worker(r, { type: "module" });
  return s.onmessage = function(n) {
    const { markers: l, version: c } = n.data, i = e.getModel();
    a.hasError = l.filter(({ severity: m }) => m === "Error").length > 0, i && i.getVersionId() === c && o.editor.setModelMarkers(i, "ESLint", l);
  }, s;
};
let t = null;
const u = (e, o) => {
  t && clearTimeout(t), t = setTimeout(() => {
    t = null, o.postMessage({
      code: e.getValue(),
      // 发起 ESLint 静态检查时，携带 versionId
      version: e.getVersionId()
    });
  }, 500);
};
export {
  p as initLinter,
  u as lint
};
//# sourceMappingURL=linter.js.map
