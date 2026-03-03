import { defineComponent, computed, createElementBlock, openBlock, normalizeClass, createElementVNode, Fragment, renderList, toDisplayString } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-tags",
  props: {
    list: { default: () => [] },
    displayField: { default: "name" },
    valueField: { default: "value" },
    scrollable: { type: Boolean, default: true },
    modelValue: { default: "" }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function parseList(raw) {
      if (Array.isArray(raw)) {
        return raw;
      }
      if (typeof raw !== "string" || !raw.trim()) {
        return [];
      }
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        try {
          const fn = new Function(`return ${raw}`);
          const result = fn();
          return Array.isArray(result) ? result : [];
        } catch {
          return [];
        }
      }
    }
    const parsedList = computed(() => {
      const arr = parseList(props.list);
      if (arr.length === 0) {
        return [
          { name: "Tag 1", value: "1" },
          { name: "Tag 2", value: "2" },
          { name: "Tag 3", value: "3" }
        ];
      }
      return arr;
    });
    function onTagClick(item) {
      const val = String(item[props.valueField] ?? "");
      emit("update:modelValue", val);
      emit("change", item);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(_ctx.$style["mp-tags"])
      }, [
        createElementVNode("div", {
          class: normalizeClass(["mp-tags-inner", { "mp-tags-scrollable": _ctx.scrollable }])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(parsedList.value, (item, index) => {
            return openBlock(), createElementBlock("button", {
              key: index,
              type: "button",
              class: normalizeClass(["mp-tag-btn", { "mp-tag-btn-active": item[_ctx.valueField] === _ctx.modelValue }]),
              onClick: ($event) => onTagClick(item)
            }, toDisplayString(item[_ctx.displayField]), 11, _hoisted_1);
          }), 128))
        ], 2)
      ], 2);
    };
  }
});
const style0 = {
  "mp-tags": "_mp-tags_62lre_2"
};
const cssModules = {
  "$style": style0
};
const mpTags = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules], ["__scopeId", "data-v-5a5e1c53"]]);
export {
  mpTags as MpTags
};
