import { isVsCodeEnv as g } from "./environments.js";
import { generatePage as m, generateRouter as f } from "./vscodeGenerateFile.js";
import { getMetaApi as p, META_SERVICE as i, useNotify as o, useMessage as d, useBreadcrumb as l, usePage as h } from "@opentiny/tiny-engine-meta-register";
const C = (s, a) => {
  if (s)
    return p(i.Http).post(s, a).catch(() => {
    });
}, T = (s) => {
  const { id: a, params: t, routerChange: c = !1, isCurEditPage: u = !0, isUpdateTree: r = !0 } = s;
  return p(i.Http).post(`/app-center/api/pages/update/${a}`, t).then((e) => {
    if (g && (m({
      id: a,
      name: t.name,
      page_content: t.page_content
    }), c && f({
      id: a,
      componentsTree: t
    })), r && o({ message: "保存成功!", type: "success" }), d().publish({
      topic: "pageOrBlockInit",
      data: t.page_content
    }), u) {
      const { setBreadcrumbPage: n } = l();
      n([t.name]);
    }
    return e;
  }).catch((e) => {
    o({ title: "保存失败", message: `${(e == null ? void 0 : e.message) || ""}`, type: "error" });
  }).finally(() => {
    var n;
    const { pageSettingState: e } = h();
    r && ((n = e.updateTreeData) == null || n.call(e)), e.isNew = !1;
  });
};
export {
  T as handlePageUpdate,
  C as requestEvent
};
//# sourceMappingURL=http.js.map
