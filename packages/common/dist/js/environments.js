const o = import.meta.env.MODE, t = import.meta.env.PROD, e = import.meta.env.BASE_URL, s = import.meta.env.VITE_ORIGIN, n = import.meta.env.VITE_API_MOCK, c = import.meta.env.VITE_CDN_DOMAIN, i = import.meta.env.VITE_CDN_TYPE, I = n === "mock", _ = window.vscodeBridge, m = o == null ? void 0 : o.includes("dev"), v = o == null ? void 0 : o.includes("alpha"), p = o == null ? void 0 : o.includes("prod");
export {
  e as BASE_URL,
  o as MODE,
  t as PROD,
  n as VITE_API_MOCK,
  c as VITE_CDN_DOMAIN,
  i as VITE_CDN_TYPE,
  s as VITE_ORIGIN,
  v as isAlphaEnv,
  m as isDevelopEnv,
  I as isMock,
  p as isProdEnv,
  _ as isVsCodeEnv
};
//# sourceMappingURL=environments.js.map
