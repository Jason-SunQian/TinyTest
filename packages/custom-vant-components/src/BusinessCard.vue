<template>
  <div class="business-card-wrapper">
    <div class="business-card" @click="handleClick">
      <div class="business-card__header">
        <div v-if="thumb" class="business-card__thumb">
          <img :src="thumb" :alt="title" @click="handleClickThumb" />
        </div>
        <div class="business-card__content">
          <div class="business-card__title" @click="handleClickTitle">{{ title }}</div>
          <div class="business-card__desc" @click="handleClickDesc">{{ desc }}</div>
          <div class="business-card__price-section">
            <span class="business-card__price" @click="handleClickPrice">
              {{ currency }}{{ price }}
            </span>
            <span v-if="originPrice" class="business-card__origin-price" @click="handleClickOriginPrice">
              {{ currency }}{{ originPrice }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="business-card__footer">
        <div class="business-card__tags" @click="handleClickTag">
          <slot name="tags">
            <span v-if="showTag" class="business-card__tag" :class="`business-card__tag--${tagType}`">
              {{ tagText }}
            </span>
          </slot>
        </div>
        
        <div class="business-card__actions">
          <slot name="footer">
            <button 
              v-if="showButton" 
              class="business-card__button"
              :class="`business-card__button--${buttonType} business-card__button--${buttonSize}`"
              @click="handleButtonClick"
            >
              {{ buttonText }}
            </button>
          </slot>
        </div>
      </div>
      
      <div v-if="showBottom" class="business-card__bottom" @click="handleClickBottom">
        <slot name="bottom">
          {{ bottomText }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessCard',
  props: {
    // 基础属性
    num: {
      type: [String, Number],
      default: ''
    },
    price: {
      type: [String, Number],
      default: ''
    },
    title: {
      type: String,
      default: '商品标题'
    },
    desc: {
      type: String,
      default: '商品描述'
    },
    thumb: {
      type: String,
      default: ''
    },
    originPrice: {
      type: [String, Number],
      default: ''
    },
    tag: {
      type: String,
      default: ''
    },
    lazyLoad: {
      type: Boolean,
      default: false
    },
    priceDecimalLength: {
      type: Number,
      default: 2
    },
    currency: {
      type: String,
      default: '¥'
    },
    footer: {
      type: String,
      default: ''
    },
    bottom: {
      type: String,
      default: ''
    },
    
    // 业务属性
    showTag: {
      type: Boolean,
      default: true
    },
    tagType: {
      type: String,
      default: 'primary',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    },
    tagColor: {
      type: String,
      default: ''
    },
    tagTextColor: {
      type: String,
      default: ''
    },
    tagText: {
      type: String,
      default: '热销'
    },
    
    showButton: {
      type: Boolean,
      default: true
    },
    buttonType: {
      type: String,
      default: 'primary',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    },
    buttonSize: {
      type: String,
      default: 'small',
      validator: (value) => ['large', 'normal', 'small', 'mini'].includes(value)
    },
    buttonText: {
      type: String,
      default: '立即购买'
    },
    
    showBottom: {
      type: Boolean,
      default: false
    },
    bottomText: {
      type: String,
      default: '底部信息'
    }
  },
  emits: [
    'click', 'click-thumb', 'click-title', 'click-price', 'click-origin-price',
    'click-desc', 'click-tag', 'click-num', 'click-lazy-load', 'click-bottom',
    'click-footer', 'button-click'
  ],
  setup(props, { emit }) {
    const handleClick = (event) => {
      emit('click', event)
    }
    
    const handleClickThumb = (event) => {
      event.stopPropagation()
      emit('click-thumb', event)
    }
    
    const handleClickTitle = (event) => {
      event.stopPropagation()
      emit('click-title', event)
    }
    
    const handleClickPrice = (event) => {
      event.stopPropagation()
      emit('click-price', event)
    }
    
    const handleClickOriginPrice = (event) => {
      event.stopPropagation()
      emit('click-origin-price', event)
    }
    
    const handleClickDesc = (event) => {
      event.stopPropagation()
      emit('click-desc', event)
    }
    
    const handleClickTag = (event) => {
      event.stopPropagation()
      emit('click-tag', event)
    }
    
    const handleClickNum = (event) => {
      event.stopPropagation()
      emit('click-num', event)
    }
    
    const handleClickLazyLoad = (event) => {
      event.stopPropagation()
      emit('click-lazy-load', event)
    }
    
    const handleClickBottom = (event) => {
      event.stopPropagation()
      emit('click-bottom', event)
    }
    
    const handleClickFooter = (event) => {
      event.stopPropagation()
      emit('click-footer', event)
    }
    
    const handleButtonClick = (event) => {
      event.stopPropagation()
      emit('button-click', event)
    }
    
    return {
      handleClick,
      handleClickThumb,
      handleClickTitle,
      handleClickPrice,
      handleClickOriginPrice,
      handleClickDesc,
      handleClickTag,
      handleClickNum,
      handleClickLazyLoad,
      handleClickBottom,
      handleClickFooter,
      handleButtonClick
    }
  }
}
</script>

<style scoped>
.business-card-wrapper {
  display: block;
}

.business-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.business-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.business-card__header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.business-card__thumb {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
}

.business-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.business-card__content {
  flex: 1;
  min-width: 0;
}

.business-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.business-card__desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.business-card__price-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.business-card__price {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b35;
}

.business-card__origin-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.business-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.business-card__tags {
  display: flex;
  gap: 4px;
}

.business-card__tag {
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}

.business-card__tag--default {
  background-color: #969799;
}

.business-card__tag--primary {
  background-color: #1989fa;
}

.business-card__tag--success {
  background-color: #07c160;
}

.business-card__tag--warning {
  background-color: #ff976a;
}

.business-card__tag--danger {
  background-color: #ee0a24;
}

.business-card__actions {
  display: flex;
  gap: 8px;
}

.business-card__button {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.business-card__button:hover {
  opacity: 0.8;
}

.business-card__button--default {
  background-color: #fff;
  color: #323233;
  border: 1px solid #ebedf0;
}

.business-card__button--primary {
  background-color: #1989fa;
  color: #fff;
}

.business-card__button--success {
  background-color: #07c160;
  color: #fff;
}

.business-card__button--warning {
  background-color: #ff976a;
  color: #fff;
}

.business-card__button--danger {
  background-color: #ee0a24;
  color: #fff;
}

.business-card__button--large {
  padding: 8px 16px;
  font-size: 14px;
}

.business-card__button--normal {
  padding: 6px 12px;
  font-size: 12px;
}

.business-card__button--small {
  padding: 4px 8px;
  font-size: 11px;
}

.business-card__button--mini {
  padding: 2px 6px;
  font-size: 10px;
}

.business-card__bottom {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style> 