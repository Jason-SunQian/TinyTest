import { defineComponent, ref, computed, createElementBlock, openBlock, normalizeClass, createElementVNode, createCommentVNode, withModifiers, toDisplayString, unref, Fragment } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const calendarIconSvg = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M15.5833 12.8333C15.8264 12.8333 16.0596 12.7368 16.2315 12.5648C16.4034 12.3929 16.5 12.1598 16.5 11.9167C16.5 11.6736 16.4034 11.4404 16.2315 11.2685C16.0596 11.0966 15.8264 11 15.5833 11C15.3402 11 15.1071 11.0966 14.9352 11.2685C14.7632 11.4404 14.6667 11.6736 14.6667 11.9167C14.6667 12.1598 14.7632 12.3929 14.9352 12.5648C15.1071 12.7368 15.3402 12.8333 15.5833 12.8333ZM15.5833 16.5C15.8264 16.5 16.0596 16.4034 16.2315 16.2315C16.4034 16.0596 16.5 15.8264 16.5 15.5833C16.5 15.3402 16.4034 15.1071 16.2315 14.9352C16.0596 14.7632 15.8264 14.6667 15.5833 14.6667C15.3402 14.6667 15.1071 14.7632 14.9352 14.9352C14.7632 15.1071 14.6667 15.3402 14.6667 15.5833C14.6667 15.8264 14.7632 16.0596 14.9352 16.2315C15.1071 16.4034 15.3402 16.5 15.5833 16.5ZM11.9167 11.9167C11.9167 12.1598 11.8201 12.3929 11.6482 12.5648C11.4763 12.7368 11.2431 12.8333 11 12.8333C10.7569 12.8333 10.5237 12.7368 10.3518 12.5648C10.1799 12.3929 10.0833 12.1598 10.0833 11.9167C10.0833 11.6736 10.1799 11.4404 10.3518 11.2685C10.5237 11.0966 10.7569 11 11 11C11.2431 11 11.4763 11.0966 11.6482 11.2685C11.8201 11.4404 11.9167 11.6736 11.9167 11.9167ZM11.9167 15.5833C11.9167 15.8264 11.8201 16.0596 11.6482 16.2315C11.4763 16.4034 11.2431 16.5 11 16.5C10.7569 16.5 10.5237 16.4034 10.3518 16.2315C10.1799 16.0596 10.0833 15.8264 10.0833 15.5833C10.0833 15.3402 10.1799 15.1071 10.3518 14.9352C10.5237 14.7632 10.7569 14.6667 11 14.6667C11.2431 14.6667 11.4763 14.7632 11.6482 14.9352C11.8201 15.1071 11.9167 15.3402 11.9167 15.5833ZM6.41667 12.8333C6.65978 12.8333 6.89294 12.7368 7.06485 12.5648C7.23676 12.3929 7.33333 12.1598 7.33333 11.9167C7.33333 11.6736 7.23676 11.4404 7.06485 11.2685C6.89294 11.0966 6.65978 11 6.41667 11C6.17355 11 5.94039 11.0966 5.76849 11.2685C5.59658 11.4404 5.5 11.6736 5.5 11.9167C5.5 12.1598 5.59658 12.3929 5.76849 12.5648C5.94039 12.7368 6.17355 12.8333 6.41667 12.8333ZM6.41667 16.5C6.65978 16.5 6.89294 16.4034 7.06485 16.2315C7.23676 16.0596 7.33333 15.8264 7.33333 15.5833C7.33333 15.3402 7.23676 15.1071 7.06485 14.9352C6.89294 14.7632 6.65978 14.6667 6.41667 14.6667C6.17355 14.6667 5.94039 14.7632 5.76849 14.9352C5.59658 15.1071 5.5 15.3402 5.5 15.5833C5.5 15.8264 5.59658 16.0596 5.76849 16.2315C5.94039 16.4034 6.17355 16.5 6.41667 16.5Z" fill="currentColor"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M6.41665 1.60413C6.59898 1.60413 6.77385 1.67656 6.90278 1.80549C7.03171 1.93442 7.10415 2.10929 7.10415 2.29163V2.99104C7.71098 2.97913 8.37923 2.97913 9.11439 2.97913H12.8846C13.6207 2.97913 14.289 2.97913 14.8958 2.99104V2.29163C14.8958 2.10929 14.9682 1.93442 15.0972 1.80549C15.2261 1.67656 15.401 1.60413 15.5833 1.60413C15.7656 1.60413 15.9405 1.67656 16.0694 1.80549C16.1984 1.93442 16.2708 2.10929 16.2708 2.29163V3.04971C16.5091 3.06804 16.7346 3.09096 16.9482 3.11938C18.0226 3.26421 18.8925 3.56854 19.5791 4.25421C20.2647 4.94079 20.5691 5.81071 20.7139 6.88504C20.8541 7.93004 20.8541 9.26379 20.8541 10.9486V12.8846C20.8541 14.5695 20.8541 15.9041 20.7139 16.9482C20.5691 18.0225 20.2647 18.8925 19.5791 19.579C18.8925 20.2647 18.0226 20.569 16.9482 20.7139C15.9032 20.8541 14.5695 20.8541 12.8846 20.8541H9.11623C7.43139 20.8541 6.09673 20.8541 5.05265 20.7139C3.97831 20.569 3.1084 20.2647 2.42181 19.579C1.73615 18.8925 1.43181 18.0225 1.28698 16.9482C1.14673 15.9032 1.14673 14.5695 1.14673 12.8846V10.9486C1.14673 9.26379 1.14673 7.92913 1.28698 6.88504C1.43181 5.81071 1.73615 4.94079 2.42181 4.25421C3.1084 3.56854 3.97831 3.26421 5.05265 3.11938C5.26623 3.09096 5.49264 3.06804 5.73006 3.04971V2.29163C5.73006 2.10945 5.80237 1.93472 5.9311 1.80581C6.05983 1.67691 6.23447 1.60437 6.41665 1.60413ZM5.23415 4.48246C4.3129 4.60621 3.78123 4.83904 3.39348 5.22679C3.00573 5.61454 2.7729 6.14621 2.64915 7.06838C2.62806 7.22421 2.61065 7.38921 2.59598 7.56246H19.404C19.3893 7.38829 19.3719 7.22421 19.3508 7.06746C19.2271 6.14621 18.9942 5.61454 18.6065 5.22679C18.2187 4.83904 17.6871 4.60621 16.7649 4.48246C15.8235 4.35596 14.5814 4.35413 12.8333 4.35413H9.16664C7.41856 4.35413 6.1774 4.35596 5.23415 4.48246ZM2.52081 11C2.52081 10.2171 2.52081 9.53604 2.53273 8.93746H19.4672C19.4791 9.53604 19.4791 10.2171 19.4791 11V12.8333C19.4791 14.5814 19.4773 15.8235 19.3508 16.7658C19.2271 17.687 18.9942 18.2187 18.6065 18.6065C18.2187 18.9942 17.6871 19.227 16.7649 19.3508C15.8235 19.4773 14.5814 19.4791 12.8333 19.4791H9.16664C7.41856 19.4791 6.1774 19.4773 5.23415 19.3508C4.3129 19.227 3.78123 18.9942 3.39348 18.6065C3.00573 18.2187 2.7729 17.687 2.64915 16.7649C2.52265 15.8235 2.52081 14.5814 2.52081 12.8333V11Z" fill="currentColor"/>\n</svg>\n';
const _hoisted_1 = { class: "mp-date-input__inner" };
const _hoisted_2 = { class: "mp-date-input__text" };
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = { class: "mp-date-input__text" };
const _hoisted_5 = ["innerHTML"];
const _hoisted_6 = ["type", "value", "min", "max", "disabled"];
const _hoisted_7 = ["value", "min", "max", "disabled"];
const _hoisted_8 = ["value", "min", "max", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mp-date-input",
  props: {
    placeholder: { default: "Select date" },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    minDate: { default: void 0 },
    maxDate: { default: void 0 },
    type: { default: "date" },
    modelValue: { default: void 0 },
    endDate: { default: void 0 }
  },
  emits: ["update:modelValue", "update:endDate", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inputRef = ref(null);
    const startInputRef = ref(null);
    const endInputRef = ref(null);
    function toDate(v) {
      if (v == null) return null;
      if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    }
    function formatDate(d, type) {
      if (!d) return "";
      if (type === "month") return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
      return d.toISOString().slice(0, 10);
    }
    const startDate = computed(() => toDate(props.modelValue));
    const endDateVal = computed(() => toDate(props.endDate));
    const displayStart = computed(() => {
      const d = startDate.value;
      return d ? formatDate(d, props.type) : props.placeholder;
    });
    const displayEnd = computed(() => {
      const d = endDateVal.value;
      return d ? formatDate(d, props.type) : props.placeholder;
    });
    const nativeDateValue = computed(() => {
      const d = startDate.value;
      if (!d) return "";
      return props.type === "month" ? formatDate(d, "month") : formatDate(d, "date");
    });
    const nativeStartValue = computed(() => startDate.value ? formatDate(startDate.value, "date") : "");
    const nativeEndValue = computed(() => endDateVal.value ? formatDate(endDateVal.value, "date") : "");
    const minStr = computed(() => {
      const d = toDate(props.minDate);
      return d ? formatDate(d, "date") : void 0;
    });
    const maxStr = computed(() => {
      const d = toDate(props.maxDate);
      return d ? formatDate(d, "date") : void 0;
    });
    function onWrapClick() {
      var _a, _b;
      if (props.disabled || props.readonly) return;
      if (props.type === "daterange") (_a = startInputRef.value) == null ? void 0 : _a.click();
      else (_b = inputRef.value) == null ? void 0 : _b.click();
    }
    function onNativeChange(e) {
      const target = e.target;
      const v = target.value;
      if (!v) return;
      if (props.type === "month") {
        const dateStr = v + "-01";
        emit("update:modelValue", dateStr);
        emit("change", new Date(dateStr));
      } else {
        emit("update:modelValue", v);
        emit("change", new Date(v));
      }
    }
    function onStartChange(e) {
      const target = e.target;
      const v = target.value;
      if (v) {
        emit("update:modelValue", v);
        const end = endDateVal.value;
        emit("change", new Date(v), end ?? void 0);
      }
    }
    function onEndChange(e) {
      const target = e.target;
      const v = target.value;
      if (v) {
        emit("update:endDate", v);
        const start = startDate.value;
        emit("change", start ?? /* @__PURE__ */ new Date(), new Date(v));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["mp-date-input", { "mp-date-input_disabled": _ctx.disabled, "mp-date-input_readonly": _ctx.readonly }]),
        onClick: onWrapClick
      }, [
        createElementVNode("div", _hoisted_1, [
          createElementVNode("div", {
            class: "mp-date-input__cell",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => {
              var _a, _b;
              return _ctx.type === "daterange" ? (_a = startInputRef.value) == null ? void 0 : _a.click() : (_b = inputRef.value) == null ? void 0 : _b.click();
            }, ["stop"]))
          }, [
            createElementVNode("span", _hoisted_2, toDisplayString(displayStart.value), 1),
            createElementVNode("span", {
              class: "mp-date-input__icon",
              "aria-hidden": "true",
              innerHTML: unref(calendarIconSvg)
            }, null, 8, _hoisted_3)
          ]),
          _ctx.type === "daterange" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            _cache[2] || (_cache[2] = createElementVNode("div", { class: "mp-date-input__sep" }, "–", -1)),
            createElementVNode("div", {
              class: "mp-date-input__cell",
              onClick: _cache[1] || (_cache[1] = withModifiers(($event) => {
                var _a;
                return (_a = endInputRef.value) == null ? void 0 : _a.click();
              }, ["stop"]))
            }, [
              createElementVNode("span", _hoisted_4, toDisplayString(displayEnd.value), 1),
              createElementVNode("span", {
                class: "mp-date-input__icon",
                "aria-hidden": "true",
                innerHTML: unref(calendarIconSvg)
              }, null, 8, _hoisted_5)
            ])
          ], 64)) : createCommentVNode("", true)
        ]),
        _ctx.type !== "daterange" ? (openBlock(), createElementBlock("input", {
          key: 0,
          ref: (el) => {
            inputRef.value = el;
          },
          type: _ctx.type === "month" ? "month" : "date",
          class: "mp-date-input__native",
          value: nativeDateValue.value,
          min: minStr.value,
          max: maxStr.value,
          disabled: _ctx.disabled || _ctx.readonly,
          onChange: onNativeChange
        }, null, 40, _hoisted_6)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createElementVNode("input", {
            ref: (el) => {
              startInputRef.value = el;
            },
            type: "date",
            class: "mp-date-input__native",
            value: nativeStartValue.value,
            min: minStr.value,
            max: maxStr.value,
            disabled: _ctx.disabled || _ctx.readonly,
            onChange: onStartChange
          }, null, 40, _hoisted_7),
          createElementVNode("input", {
            ref: (el) => {
              endInputRef.value = el;
            },
            type: "date",
            class: "mp-date-input__native",
            value: nativeEndValue.value,
            min: minStr.value,
            max: maxStr.value,
            disabled: _ctx.disabled || _ctx.readonly,
            onChange: onEndChange
          }, null, 40, _hoisted_8)
        ], 64))
      ], 2);
    };
  }
});
const mpDateInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-94545e6f"]]);
export {
  mpDateInput as MpDateInput
};
