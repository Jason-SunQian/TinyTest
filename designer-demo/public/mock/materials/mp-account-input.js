import { defineComponent, mergeModels, useModel, ref, computed, watch, createElementBlock, openBlock, normalizeClass, createElementVNode, createVNode, toDisplayString } from "vue";
import { _ as _sfc_main$1 } from "./mp-account-picker.vue_vue_type_script_setup_true_lang-B8hrll0j.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = { class: "mp-account-input__cell" };
const _hoisted_2 = { class: "mp-account-input__label" };
const _hoisted_3 = { class: "mp-account-input__value" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-account-input",
  props: /* @__PURE__ */ mergeModels({
    label: { default: "" },
    placeholder: { default: "Select account" },
    sceneType: { default: "transfer" },
    channelCode: { default: void 0 },
    pickerTitle: { default: "" },
    payAmount: { default: "" },
    payeeCcy: { default: "" },
    ignoreCheck: { type: Boolean, default: false },
    disabledAccounts: { default: () => [] },
    disabled: { type: Boolean, default: false }
  }, {
    "modelValue": { default: () => ({}) },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["select"], ["update:modelValue"]),
  setup(__props) {
    const props = __props;
    const modelValue = useModel(__props, "modelValue");
    const showPicker = ref(false);
    const displayText = ref("");
    const displayValue = computed(() => {
      if (displayText.value) return displayText.value;
      const v = modelValue.value;
      if (v && typeof v === "object" && v.payerAccountNumber) return v.payerAccountNumber;
      return props.placeholder;
    });
    watch(
      () => modelValue.value,
      (v) => {
        if (!v || typeof v !== "object") displayText.value = "";
        else displayText.value = v.payerAccountNumber || "";
      },
      { immediate: true }
    );
    function onClick() {
      if (props.disabled) return;
      showPicker.value = true;
    }
    function onSelect(account) {
      displayText.value = account.nickName || account.accountNumberMask || account.payerAccountNumber || "";
      showPicker.value = false;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["mp-account-input", { "mp-account-input_disabled": _ctx.disabled }]),
        onClick
      }, [
        createElementVNode("div", _hoisted_1, [
          createElementVNode("span", _hoisted_2, toDisplayString(_ctx.label), 1),
          createElementVNode("span", _hoisted_3, toDisplayString(displayValue.value), 1),
          _cache[2] || (_cache[2] = createElementVNode("span", { class: "mp-account-input__arrow" }, "›", -1))
        ]),
        createVNode(_sfc_main$1, {
          show: showPicker.value,
          "onUpdate:show": _cache[0] || (_cache[0] = ($event) => showPicker.value = $event),
          modelValue: modelValue.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => modelValue.value = $event),
          "scene-type": _ctx.sceneType,
          "channel-code": _ctx.channelCode,
          title: _ctx.pickerTitle,
          "pay-amount": _ctx.payAmount,
          "payee-ccy": _ctx.payeeCcy,
          "ignore-check": _ctx.ignoreCheck,
          "disabled-accounts": _ctx.disabledAccounts,
          onSelect
        }, null, 8, ["show", "modelValue", "scene-type", "channel-code", "title", "pay-amount", "payee-ccy", "ignore-check", "disabled-accounts"])
      ], 2);
    };
  }
});
const mpAccountInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f076a852"]]);
export {
  mpAccountInput as MpAccountInput
};
