<template>
  <div class="custom-vant-button-wrapper">
    <button
      :class="buttonClasses"
      :disabled="disabled"
      :style="buttonStyles"
      @click="handleClick"
    >
      <span v-if="loading" class="loading-spinner"></span>
      <span v-if="icon && iconPosition === 'left'" class="icon-left">{{ icon }}</span>
      <span class="button-text">
        <slot>{{ text }}</slot>
      </span>
      <span v-if="icon && iconPosition === 'right'" class="icon-right">{{ icon }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CustomVantButton',
  props: {
    text: {
      type: String,
      default: '按钮'
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['large', 'normal', 'small', 'mini'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value)
    }
  },
  emits: ['click'],
  computed: {
    buttonClasses() {
      return [
        'custom-vant-button',
        `custom-vant-button--${this.type}`,
        `custom-vant-button--${this.size}`,
        {
          'custom-vant-button--disabled': this.disabled,
          'custom-vant-button--loading': this.loading,
          'custom-vant-button--block': this.block,
          'custom-vant-button--round': this.round,
          'custom-vant-button--square': this.square
        }
      ]
    },
    buttonStyles() {
      const styles = {}
      if (this.color) {
        styles.backgroundColor = this.color
        styles.borderColor = this.color
      }
      if (this.block) {
        styles.width = '100%'
      }
      return styles
    }
  },
  setup(props, { emit }) {
    const handleClick = (event) => {
      if (!props.disabled && !props.loading) {
        emit('click', event)
      }
    }

    return {
      handleClick
    }
  }
}
</script>

<style scoped>
.custom-vant-button-wrapper {
  display: inline-block;
}

.custom-vant-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  outline: none;
}

.custom-vant-button:hover {
  opacity: 0.8;
}

.custom-vant-button:active {
  opacity: 0.6;
}

.custom-vant-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-vant-button--loading {
  cursor: wait;
}

.custom-vant-button--block {
  width: 100%;
}

.custom-vant-button--round {
  border-radius: 20px;
}

.custom-vant-button--square {
  border-radius: 0;
}

/* 尺寸 */
.custom-vant-button--large {
  height: 44px;
  padding: 0 20px;
  font-size: 16px;
}

.custom-vant-button--normal {
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
}

.custom-vant-button--small {
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
}

.custom-vant-button--mini {
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
}

/* 类型 */
.custom-vant-button--default {
  color: #323233;
  background-color: #fff;
  border-color: #ebedf0;
}

.custom-vant-button--primary {
  color: #fff;
  background-color: #1989fa;
  border-color: #1989fa;
}

.custom-vant-button--success {
  color: #fff;
  background-color: #07c160;
  border-color: #07c160;
}

.custom-vant-button--warning {
  color: #fff;
  background-color: #ff976a;
  border-color: #ff976a;
}

.custom-vant-button--danger {
  color: #fff;
  background-color: #ee0a24;
  border-color: #ee0a24;
}

/* 图标 */
.icon-left,
.icon-right {
  margin: 0 4px;
  font-size: 16px;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 按钮文字 */
.button-text {
  display: inline-flex;
  align-items: center;
}
</style> 