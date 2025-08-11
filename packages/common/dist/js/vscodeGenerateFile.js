import { getMetaApi as t, META_SERVICE as a } from "@opentiny/tiny-engine-meta-register";
const r = (e) => t(a.Http).post("/generate/api/generateRouter", e), g = (e) => t(a.Http).post("/generate/api/generateI18n", e), p = (e) => t(a.Http).post("/generate/api/generateBlock", e), o = (e) => t(a.Http).post("/generate/api/generatePage", e), s = (e) => t(a.Http).post("/generate/api/generateDataSource", e), i = (e) => t(a.Http).post("/generate/api/generateBridge", e), c = (e) => t(a.Http).post("/generate/api/generateUtil", e);
export {
  p as generateBlock,
  i as generateBridge,
  s as generateDataSource,
  g as generateI18n,
  o as generatePage,
  r as generateRouter,
  c as generateUtil
};
//# sourceMappingURL=vscodeGenerateFile.js.map
