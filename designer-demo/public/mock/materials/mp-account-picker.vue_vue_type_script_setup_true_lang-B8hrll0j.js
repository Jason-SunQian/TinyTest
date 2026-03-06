import { getCurrentInstance, ref, defineComponent, mergeModels, useModel, computed, watch, onMounted, createBlock, openBlock, createSlots, withCtx, createElementBlock, createCommentVNode, Fragment, renderList, createVNode, unref, createTextVNode, toDisplayString } from "vue";
import { u as useRoute } from "./vueRouterStub-Cecf5YTX.js";
import { M as MpPopup } from "./mp-popup-DlUsfFH9.js";
import { d as defineStore, M as MpAccountItem } from "./mp-account-item-twvzupAs.js";
import { M as MpEmpty } from "./mp-empty-DteCFnE2.js";
import { MrDivider, MrSegment, MrSegmentButton, MrLabel } from "@local/mr-components";
function useI18n() {
  var _a;
  const instance = getCurrentInstance();
  const $t = ((_a = instance == null ? void 0 : instance.appContext.config.globalProperties) == null ? void 0 : _a.$t) ?? ((key) => key);
  return {
    t: $t,
    locale: { value: "en_US" },
    te: () => false,
    tm: () => ({})
  };
}
const usePaymentStore = defineStore("common.payment", () => {
  const paymentWayMap = ref({});
  const paymentWayDirty = ref({});
  const paymentWayLoading = ref({});
  function checkPaymentway(_payway, _disabledAccounts = [], _payAmount = "") {
    return true;
  }
  function getPaymentWayKey(_sceneType, _channelCode = "") {
    return "";
  }
  async function requestPayWay() {
  }
  async function queryPaymentWay() {
  }
  function getPaymentWay(_cacheKey) {
    return [
      {
        type: "account",
        title: "Account",
        selectTitle: "Select Account",
        list: [
          {
            paymentTool: "0003",
            nickName: "My Savings",
            payerAccountNumber: "****1234",
            availableBalance: "1,000.00",
            payerCurrency: "HKD",
            payCode: "mock_1"
          },
          {
            paymentTool: "0003",
            nickName: "Current",
            payerAccountNumber: "****5678",
            availableBalance: "500.00",
            payerCurrency: "HKD",
            payCode: "mock_2"
          }
        ]
      }
    ];
  }
  function getDefaultPaymentWay(groups = []) {
    const first = groups[0];
    const list = first == null ? void 0 : first.list;
    if (!(list == null ? void 0 : list.length)) return void 0;
    return { defaultAccount: list[0], index: 0 };
  }
  async function calcPaymentWayAmount() {
    return {};
  }
  return {
    paymentWayMap,
    paymentWayDirty,
    paymentWayLoading,
    checkPaymentway,
    getPaymentWayKey,
    requestPayWay,
    queryPaymentWay,
    getPaymentWay,
    getDefaultPaymentWay,
    calcPaymentWayAmount
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-account-picker",
  props: /* @__PURE__ */ mergeModels({
    sceneType: { default: "" },
    channelCode: { default: void 0 },
    title: { default: "" },
    payAmount: { default: "" },
    payeeCcy: { default: "" },
    ignoreCheck: { type: Boolean, default: false },
    disabledAccounts: { default: () => [] }
  }, {
    "show": { type: Boolean, ...{ default: false } },
    "showModifiers": {},
    "modelValue": { default: () => ({}) },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["select", "click"], ["update:show", "update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const show = useModel(__props, "show");
    const model = useModel(__props, "modelValue");
    const route = useRoute();
    const { t } = useI18n();
    const paymentStore = usePaymentStore();
    const currentIndex = ref(0);
    const paymentWayAmount = ref({});
    const selectedAccount = ref(null);
    const cacheKey = computed(() => {
      let codeKey = props.sceneType;
      if (props.channelCode) codeKey = `${props.sceneType}_${props.channelCode}`;
      return codeKey;
    });
    const paymentWays = computed(() => paymentStore.getPaymentWay(cacheKey.value));
    const realTitle = computed(() => {
      var _a;
      if (props.title) return props.title;
      if (paymentWays.value.length === 1) return ((_a = paymentWays.value[0]) == null ? void 0 : _a.selectTitle) ?? "";
      return t("common.selectPayWayLabel");
    });
    function filterKeysByPrefix(obj, prefix) {
      return Object.fromEntries(
        Object.entries(obj).filter(([key]) => key.startsWith(prefix))
      );
    }
    function setSelectedAccount(item, manual) {
      selectedAccount.value = { ...item };
      model.value = filterKeysByPrefix(selectedAccount.value, "payer");
      emit("select", item, manual);
    }
    function setDefaultAccount() {
      var _a, _b;
      const payAccountNo = ((_a = route.query) == null ? void 0 : _a.payAccountNo) ?? "";
      const payCode = ((_b = route.query) == null ? void 0 : _b.payCode) ?? "";
      const result = paymentStore.getDefaultPaymentWay(paymentWays.value, {
        payAccountNo,
        payCode,
        ignoreCheck: props.ignoreCheck,
        disabledAccounts: props.disabledAccounts
      });
      if (!result) return;
      const { defaultAccount, index } = result;
      currentIndex.value = index;
      setSelectedAccount(defaultAccount);
    }
    watch(
      () => props.sceneType,
      () => {
        currentIndex.value = 0;
      }
    );
    watch(
      () => props.payAmount,
      async () => {
        var _a;
        paymentWayAmount.value = await paymentStore.calcPaymentWayAmount(
          cacheKey.value,
          props.payAmount,
          ((_a = selectedAccount.value) == null ? void 0 : _a.payerCurrency) || ""
        );
      }
    );
    function onTabChange(evt) {
      var _a;
      const next = Number(((_a = evt.detail) == null ? void 0 : _a.value) ?? 0);
      setTimeout(() => {
        currentIndex.value = next;
      }, 300);
    }
    function onClick(item) {
      setSelectedAccount(item, true);
      emit("click", item);
      show.value = false;
    }
    onMounted(() => {
      watch(
        () => paymentWays.value,
        (newValue) => {
          var _a;
          if (paymentStore.paymentWayLoading[cacheKey.value]) return;
          const [currentPaymentWay] = newValue;
          if (!currentPaymentWay) {
            setSelectedAccount({
              accountName: "",
              payerAccountNumber: "",
              accountNumberMask: "",
              payerCurrency: "",
              payTool: "",
              payCurrency: "",
              payCode: ""
            });
            return;
          }
          if (((_a = selectedAccount.value) == null ? void 0 : _a.paymentTool) && newValue.some(
            (pw) => pw.list.some((i) => {
              var _a2;
              return i.payCode === ((_a2 = selectedAccount.value) == null ? void 0 : _a2.payCode);
            })
          )) {
            return;
          }
          setDefaultAccount();
        },
        { immediate: true, deep: true, flush: "post" }
      );
      watch(
        () => props.disabledAccounts,
        () => {
          var _a;
          if (props.disabledAccounts.length > 0 && props.disabledAccounts.includes(((_a = selectedAccount.value) == null ? void 0 : _a.payCode) || "")) {
            setDefaultAccount();
          }
        },
        { immediate: true, deep: true, flush: "post" }
      );
      paymentStore.queryPaymentWay({
        sceneType: props.sceneType,
        channelCode: props.channelCode,
        force: true
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MpPopup, {
        show: show.value,
        "onUpdate:show": _cache[0] || (_cache[0] = ($event) => show.value = $event),
        title: realTitle.value
      }, createSlots({
        default: withCtx(() => [
          paymentWays.value[currentIndex.value] ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(paymentWays.value[currentIndex.value].list, (account, index) => {
            var _a;
            return openBlock(), createElementBlock("div", {
              key: account.payCode
            }, [
              createVNode(MpAccountItem, {
                class: "h-62px",
                index,
                account,
                disabled: !!account.payCode && _ctx.disabledAccounts.includes(account.payCode),
                "pay-amount": paymentWayAmount.value[account.payerCurrency],
                selected: ((_a = selectedAccount.value) == null ? void 0 : _a.payCode) === account.payCode,
                "ignore-check": _ctx.ignoreCheck,
                onClick: ($event) => onClick(account)
              }, null, 8, ["index", "account", "disabled", "pay-amount", "selected", "ignore-check", "onClick"]),
              createVNode(unref(MrDivider), {
                class: "m-0!",
                hairline: ""
              })
            ]);
          }), 128)) : createCommentVNode("", true),
          paymentWays.value.length === 0 ? (openBlock(), createBlock(MpEmpty, {
            key: 1,
            title: _ctx.$t("common.noAccounts"),
            class: "border-1px border-solid border-neutral-200 bg-neutral-50 rounded-12px my-20px mb-36px"
          }, null, 8, ["title"])) : createCommentVNode("", true)
        ]),
        _: 2
      }, [
        paymentWays.value.length > 1 ? {
          name: "sub-header",
          fn: withCtx(() => [
            createVNode(unref(MrSegment), {
              value: String(currentIndex.value),
              class: "mt-5px w-100%",
              onIonChange: onTabChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(paymentWays.value, (item, index) => {
                  return openBlock(), createBlock(unref(MrSegmentButton), {
                    key: item.type || index,
                    value: String(index),
                    class: "flex-1"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(MrLabel), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.title), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1032, ["value"]);
                }), 128))
              ]),
              _: 1
            }, 8, ["value"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["show", "title"]);
    };
  }
});
export {
  _sfc_main as _
};
