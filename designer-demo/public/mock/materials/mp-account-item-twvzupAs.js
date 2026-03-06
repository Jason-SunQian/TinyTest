import { toRaw, computed, isRef, isReactive, toRef, hasInjectionContext, inject, ref, reactive, effectScope, getCurrentScope, onScopeDispose, watch, nextTick, toRefs, markRaw, defineComponent, getCurrentInstance, createBlock, openBlock, withCtx, createElementVNode, createCommentVNode, normalizeClass, createElementBlock, Fragment, toDisplayString, createTextVNode } from "vue";
import { M as MpCell } from "./mp-cell-BBAdpNkT.js";
import { M as MpIcon } from "./mp-icon-wb8X8knC.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
/*!
 * pinia v2.3.0
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function storeToRefs(store) {
  {
    const rawStore = toRaw(store);
    const refs = {};
    for (const key in rawStore) {
      const value = rawStore[key];
      if (value.effect) {
        refs[key] = // ...
        computed({
          get: () => store[key],
          set(value2) {
            store[key] = value2;
          }
        });
      } else if (isRef(value) || isReactive(value)) {
        refs[key] = // ---
        toRef(store, key);
      }
    }
    return refs;
  }
}
const useAccountStore = /* @__PURE__ */ defineStore("common.account", () => {
  const maskBalance = ref(false);
  const accountProductMap = ref([]);
  const accountProductLoading = ref(false);
  const youthAccountList = ref(void 0);
  async function requestAccountProduct() {
  }
  async function queryYouthAccountInfo() {
  }
  return {
    maskBalance,
    accountProductMap,
    accountProductLoading,
    requestAccountProduct,
    queryYouthAccountInfo,
    youthAccountList
  };
});
const _hoisted_1 = {
  key: 0,
  class: "flex items-center"
};
const _hoisted_2 = { class: "line-clamp-1" };
const _hoisted_3 = {
  key: 1,
  class: "flex items-center"
};
const _hoisted_4 = { class: "line-clamp-1" };
const _hoisted_5 = {
  key: 2,
  class: "line-clamp-1"
};
const _hoisted_6 = { key: 0 };
const _hoisted_7 = { key: 1 };
const _hoisted_8 = { class: "w-24px h-24px flex items-center justify-center" };
const PAYMENT_TOOL_ACCOUNT = "0003";
const PAYMENT_TOOL_CARD = "0004";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-account-item",
  props: {
    account: { default: void 0 },
    index: { default: 0 },
    selected: { type: Boolean, default: false },
    payAmount: { default: "" },
    ignoreCheck: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    maskBalance: { type: Boolean, default: void 0 }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    var _a, _b;
    const props = __props;
    const emit = __emit;
    const instance = getCurrentInstance();
    const $getCurrencySymbol = ((_a = instance == null ? void 0 : instance.appContext.config.globalProperties) == null ? void 0 : _a.$getCurrencySymbol) ?? ((c) => c ?? "HK$");
    const $currency = ((_b = instance == null ? void 0 : instance.appContext.config.globalProperties) == null ? void 0 : _b.$currency) ?? ((v) => ({ format: () => String(v) }));
    const { maskBalance: storeMaskBalance } = storeToRefs(useAccountStore());
    const maskBalance = computed(() => props.maskBalance ?? storeMaskBalance.value);
    function parseAccount(raw) {
      if (raw == null) return null;
      if (typeof raw === "object") return raw;
      if (typeof raw !== "string" || !raw.trim()) return null;
      try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : null;
      } catch {
        return null;
      }
    }
    const accountData = computed(() => parseAccount(props.account));
    const titleText = computed(() => {
      const a = accountData.value;
      if (!a) return "My Account";
      return a.nickName || a.accountName || "Account";
    });
    const lastFour = computed(() => {
      var _a2;
      const num = (_a2 = accountData.value) == null ? void 0 : _a2.payerAccountNumber;
      if (!num || typeof num !== "string") return "****";
      return num.slice(-4);
    });
    const cardTitle = computed(() => {
      const a = accountData.value;
      if (!a) return "Card";
      return a.nickName || a.cardType || "Card";
    });
    const cardLastFour = computed(() => {
      var _a2;
      const num = (_a2 = accountData.value) == null ? void 0 : _a2.payerCardNumber;
      if (!num || typeof num !== "string") return "****";
      return num.slice(-4);
    });
    const canUsed = computed(() => {
      if (props.ignoreCheck) return true;
      const acc = accountData.value;
      if (!acc) return true;
      const payAmount = props.payAmount || "";
      return checkPaymentway(acc, [], payAmount);
    });
    const descBalance = computed(() => {
      const a = accountData.value;
      if ((a == null ? void 0 : a.availableBalance) === void 0 || a.availableBalance === null) return "";
      if (maskBalance.value) {
        return `${$getCurrencySymbol(a.payerCurrency)} ******`;
      }
      return $currency(a.availableBalance, a.payerCurrency).format();
    });
    function onClick() {
      if (!canUsed.value || props.disabled) return;
      emit("click");
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MpCell, {
        "data-test-id": `account_${_ctx.index}`,
        gap: "10",
        class: "cursor-pointer",
        onClick
      }, {
        title: withCtx(() => {
          var _a2, _b2;
          return [
            createElementVNode("div", {
              class: normalizeClass(["text-h5", { "text-color-disabled": _ctx.disabled }])
            }, [
              ((_a2 = accountData.value) == null ? void 0 : _a2.paymentTool) === PAYMENT_TOOL_ACCOUNT ? (openBlock(), createElementBlock("div", _hoisted_1, [
                createElementVNode("div", _hoisted_2, toDisplayString(titleText.value), 1),
                createElementVNode("div", null, toDisplayString(`(${lastFour.value})`), 1)
              ])) : ((_b2 = accountData.value) == null ? void 0 : _b2.paymentTool) === PAYMENT_TOOL_CARD ? (openBlock(), createElementBlock("div", _hoisted_3, [
                createElementVNode("div", _hoisted_4, toDisplayString(cardTitle.value), 1),
                createElementVNode("div", null, toDisplayString(`(${cardLastFour.value})`), 1)
              ])) : (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(titleText.value || "Account"), 1))
            ], 2)
          ];
        }),
        desc: withCtx(() => {
          var _a2;
          return [
            createElementVNode("div", {
              class: normalizeClass([
                _ctx.disabled ? "text-color-disabled" : "text-color-regular",
                "text-h6 line-clamp-1"
              ])
            }, [
              ((_a2 = accountData.value) == null ? void 0 : _a2.availableBalance) !== void 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                canUsed.value ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(_ctx.$t("common.availableBalance") + ": " + descBalance.value), 1)) : (openBlock(), createElementBlock("span", _hoisted_7, toDisplayString(_ctx.$t("common.insufficientBalance")), 1))
              ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(_ctx.$t("common.availableBalance")), 1)
              ], 64))
            ], 2)
          ];
        }),
        end: withCtx(() => [
          createElementVNode("div", _hoisted_8, [
            _ctx.selected ? (openBlock(), createBlock(MpIcon, {
              key: 0,
              size: "24",
              icon: "check",
              class: normalizeClass(["text-primary", { "text-color-disabled": _ctx.disabled }])
            }, null, 8, ["class"])) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 8, ["data-test-id"]);
    };
  }
});
const MpAccountItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0825301c"]]);
export {
  MpAccountItem as M,
  defineStore as d
};
