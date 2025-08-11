import { PAGE_STATUS as t } from "./constants.js";
import { getMetaApi as r, META_SERVICE as a, useResource as c } from "@opentiny/tiny-engine-meta-register";
const m = (o) => {
  const s = r(a.GlobalService).getState(), i = c().appSchemaState.isDemo;
  let e = "";
  return i ? e = t.Guest : o ? e = s.userInfo.id === o.id ? t.Occupy : t.Lock : e = t.Release, {
    state: e,
    data: o
  };
};
export {
  m as getCanvasStatus
};
//# sourceMappingURL=canvas.js.map
