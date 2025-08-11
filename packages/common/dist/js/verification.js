const t = /^[a-z]+([A-Z][a-z]*)*$/, a = (E) => t.test(E), _ = /^([A-Z][a-z0-9]*){2,}$/, e = (E) => _.test(E), R = /^[A-Za-z]+$/, n = (E) => R.test(E), s = /^[\w-][/\w-]*?[\w-]*?$/, P = (E) => !E || s.test(E), N = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/, X = /^[\w-]*$/, o = /^[A-Za-z][\w-]*$/, c = /^[A-Za-z][\w-/]*$/, $ = /^([A-Z][a-z]*?)+$/, z = o, Z = c, A = /^[a-zA-Z_]\w*$/, G = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/, r = (E) => A.test(E), L = (E) => G.test(E);
export {
  R as REGEXP_BLOCK_ID,
  _ as REGEXP_BLOCK_NAME,
  s as REGEXP_BLOCK_PATH,
  t as REGEXP_EVENT_NAME,
  z as REGEXP_FOLDER_NAME,
  N as REGEXP_GROUP_NAME,
  A as REGEXP_JS_VAR,
  G as REGEXP_JS_VAR_SYMBOL,
  $ as REGEXP_PAGE_NAME,
  X as REGEXP_REGULAR_STRING,
  o as REGEXP_REGULAR_STRING2,
  c as REGEXP_REGULAR_STRING3,
  Z as REGEXP_ROUTE,
  n as verifyBlockId,
  e as verifyBlockName,
  P as verifyBlockPath,
  a as verifyEventName,
  r as verifyJsVarName,
  L as verifyJsVarSymbolName
};
//# sourceMappingURL=verification.js.map
