import { defineComponent, ref, watch, computed, createElementBlock, openBlock, createVNode, unref } from "vue";
import { MrDatePicker } from "@local/mr-components";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = { class: "mp-date-picker" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-date-picker",
  props: {
    minDate: { default: void 0 },
    maxDate: { default: void 0 },
    readonly: { type: Boolean, default: false },
    columnsType: { default: () => ["month", "day", "year"] },
    modelValue: { default: void 0 }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function defaultDate() {
      const d = /* @__PURE__ */ new Date();
      return [
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
        String(d.getFullYear())
      ];
    }
    const date = ref(props.modelValue ?? defaultDate());
    watch(
      () => props.modelValue,
      (val) => {
        if (val && Array.isArray(val) && val.length) date.value = val;
      },
      { immediate: true }
    );
    watch(date, (val) => emit("update:modelValue", val), { deep: true });
    function parseColumnsType(raw) {
      if (Array.isArray(raw) && raw.length) return raw;
      if (typeof raw === "string" && raw.trim()) {
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : ["month", "day", "year"];
        } catch {
          return ["month", "day", "year"];
        }
      }
      return ["month", "day", "year"];
    }
    const columnsTypeArr = computed(() => parseColumnsType(props.columnsType));
    function toDate(v) {
      if (v == null) return void 0;
      if (v instanceof Date) return isNaN(v.getTime()) ? void 0 : v;
      const d = new Date(v);
      return isNaN(d.getTime()) ? void 0 : d;
    }
    const minDateVal = computed(() => toDate(props.minDate));
    const maxDateVal = computed(() => toDate(props.maxDate));
    function formatter(type, option) {
      if (type === "month" && option.value != null) {
        const monthIndex = Number(option.value) - 1;
        option.text = new Date(2024, monthIndex, 1).toLocaleString("en-US", {
          month: "long"
        });
      }
      return option;
    }
    function onChange() {
      emit("change", date.value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(MrDatePicker), {
          modelValue: date.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => date.value = $event),
          "visible-option-num": "5",
          "option-height": "48px",
          "show-toolbar": false,
          "columns-type": columnsTypeArr.value,
          formatter,
          "min-date": minDateVal.value,
          "max-date": maxDateVal.value,
          readonly: _ctx.readonly,
          onChange
        }, null, 8, ["modelValue", "columns-type", "min-date", "max-date", "readonly"])
      ]);
    };
  }
});
const mpDatePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db2dcead"]]);
export {
  mpDatePicker as MpDatePicker
};
