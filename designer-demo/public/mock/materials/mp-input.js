import { defineComponent, mergeModels, useModel, computed, createBlock, openBlock, unref } from "vue";
import { MrField } from "@local/mr-components";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-input",
  props: /* @__PURE__ */ mergeModels({
    label: { default: "" },
    labelAlign: { default: "top" },
    placeholder: { default: "" },
    type: { default: "text" },
    inputAlign: { default: "" },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    errorMessage: { default: "" },
    maxlength: { default: void 0 }
  }, {
    "modelValue": { default: "" },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["focus", "blur", "inputClick"], ["update:modelValue"]),
  setup(__props) {
    const props = __props;
    const model = useModel(__props, "modelValue");
    const innerInputAlign = computed(() => {
      if (props.inputAlign) return props.inputAlign;
      return props.labelAlign === "top" ? "left" : "right";
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(MrField), {
        modelValue: model.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
        label: _ctx.label,
        "label-align": _ctx.labelAlign,
        "input-align": innerInputAlign.value,
        type: _ctx.type,
        placeholder: _ctx.placeholder,
        readonly: _ctx.readonly,
        disabled: _ctx.disabled,
        "error-message": _ctx.errorMessage,
        maxlength: _ctx.maxlength,
        class: "mp-input",
        onClickInput: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("inputClick")),
        onFocus: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("focus")),
        onBlur: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("blur"))
      }, null, 8, ["modelValue", "label", "label-align", "input-align", "type", "placeholder", "readonly", "disabled", "error-message", "maxlength"]);
    };
  }
});
const mpInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8108a595"]]);
export {
  mpInput as MpInput
};
