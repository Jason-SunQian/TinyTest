const fs = require('fs-extra');
const path = require('path');

// 中文到英文的翻译映射表
const TRANSLATION_MAP = {
  // 组件名称
  '开关': 'Switch',
  '按钮': 'Button',
  '输入框': 'Input',
  '表单': 'Form',
  '表格': 'Table',
  '日期选择': 'Date Picker',
  '日期选择器': 'Date Picker',
  '下拉框': 'Select',
  '单选': 'Radio',
  '复选框': 'Checkbox',
  '数字输入框': 'Numeric',
  '穿梭框': 'Transfer',
  '折叠面板': 'Collapse',
  '对话框': 'Dialog',
  '弹出编辑': 'Popeditor',
  '提示框': 'Tooltip',
  '文字提示框': 'Text Tooltip',
  '树': 'Tree',
  '分页': 'Pagination',
  '标签页': 'Tabs',
  '面包屑': 'Breadcrumb',
  '时间线': 'Timeline',
  '轮播': 'Carousel',
  '标题': 'Title',
  '段落': 'Paragraph',
  '链接': 'Link',
  '图片': 'Image',
  '视频': 'Video',
  '分隔线': 'Divider',
  '业务卡片': 'Business Card',
  '自定义按钮': 'Custom Button',
  
  // 分组名称
  '基础组件': 'Basic Component',
  '表单组件': 'Form Component',
  '数据展示': 'Data Display',
  '导航组件': 'Navigation Component',
  '布局组件': 'Layout Component',
  
  // 属性标签
  '基础信息': 'Basic Information',
  '其他': 'Others',
  '样式设置': 'Styles Settings',
  '状态相关配置': 'State Related Configuration',
  '禁用': 'Disabled',
  '绑定值': 'Binding Value',
  '设置打开值': 'Set Open Value',
  '设置关闭值': 'Set Close Value',
  '迷你尺寸': 'Mini Size',
  '点击事件': 'Click Event',
  '双向绑定的值改变时触发': 'Triggered when the two-way bound value changes',
  '是否显示边框': 'Show Border',
  '尺寸': 'Size',
  '类型': 'Type',
  '打开方式': 'Open Mode',
  '指定链接的 URL': 'Specify the URL of the link',
  '指定链接的打开方式，例如在当前窗口中打开或在新窗口中打开。': 'Specify how the link opens, e.g., in the current window or in a new window.',
  '原生属性': 'Native Attributes',
  '商品标题': 'Product Title',
  '商品描述': 'Product Description',
  '商品图片': 'Product Image',
  '商品图片URL': 'Product Image URL',
};

// 常见词汇翻译
const WORD_MAP = {
  '是否': 'Whether',
  '显示': 'Show',
  '隐藏': 'Hide',
  '边框': 'Border',
  '尺寸': 'Size',
  '类型': 'Type',
  '宽度': 'Width',
  '高度': 'Height',
  '颜色': 'Color',
  '背景': 'Background',
  '文本': 'Text',
  '内容': 'Content',
  '标题': 'Title',
  '描述': 'Description',
  '链接': 'Link',
  '图片': 'Image',
  '视频': 'Video',
  '按钮': 'Button',
  '表单': 'Form',
  '输入': 'Input',
  '选择': 'Select',
  '打开': 'Open',
  '关闭': 'Close',
  '设置': 'Settings',
  '配置': 'Configuration',
  '属性': 'Properties',
  '事件': 'Events',
  '样式': 'Styles',
  '基础': 'Basic',
  '高级': 'Advanced',
  '其他': 'Others',
};

/**
 * 翻译中文文本
 */
function translateText(zhText) {
  if (!zhText || typeof zhText !== 'string') {
    return zhText;
  }
  
  // 直接匹配
  if (TRANSLATION_MAP[zhText]) {
    return TRANSLATION_MAP[zhText];
  }
  
  // 尝试部分匹配（优先匹配长的）
  const sortedEntries = Object.entries(TRANSLATION_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [zh, en] of sortedEntries) {
    if (zhText.includes(zh)) {
      return zhText.replace(zh, en);
    }
  }
  
  // 尝试逐词翻译
  let result = zhText;
  const sortedWords = Object.entries(WORD_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [zh, en] of sortedWords) {
    if (result.includes(zh)) {
      result = result.replace(zh, en);
    }
  }
  
  // 如果还有中文，尝试简单的翻译规则
  if (/[\u4e00-\u9fa5]/.test(result)) {
    // 对于 "是否XXX" 格式，翻译为 "XXX"
    if (result.startsWith('是否')) {
      const rest = result.substring(2);
      const translated = translateText(rest);
      if (translated !== rest) {
        return translated;
      }
    }
    // 对于 "XXX的YYY" 格式，翻译为 "YYY of XXX"
    const match = result.match(/^(.+)的(.+)$/);
    if (match) {
      const part1 = translateText(match[1]);
      const part2 = translateText(match[2]);
      if (part1 !== match[1] || part2 !== match[2]) {
        return `${part2} of ${part1}`;
      }
    }
  }
  
  // 如果还是中文，返回原文本（保持原样，不翻译）
  return result;
}

/**
 * 递归处理对象，为所有包含 zh_CN 的字段添加 en_US
 */
function translateObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const result = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'name' && value && typeof value === 'object' && value.zh_CN) {
        // 处理 name 字段
        result[key] = {
          ...value,
          en_US: value.en_US || translateText(value.zh_CN)
        };
      } else if (key === 'label' && value && typeof value === 'object') {
        // 处理 label 字段（可能是嵌套的 label.text）
        if (value.zh_CN) {
          result[key] = {
            ...value,
            en_US: value.en_US || translateText(value.zh_CN)
          };
        } else if (value.text && value.text.zh_CN) {
          result[key] = {
            ...value,
            text: {
              ...value.text,
              en_US: value.text.en_US || translateText(value.text.zh_CN)
            }
          };
        } else {
          result[key] = translateObject(value);
        }
      } else if (key === 'description' && value && typeof value === 'object' && value.zh_CN) {
        // 处理 description 字段
        result[key] = {
          ...value,
          en_US: value.en_US || translateText(value.zh_CN)
        };
      } else if (typeof value === 'object' && value !== null) {
        // 递归处理嵌套对象
        result[key] = translateObject(value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  return obj;
}

/**
 * 主函数
 */
function translateBundle() {
  const bundlePath = path.join(process.cwd(), 'designer-demo/public/mock/bundle.json');
  
  console.log('开始翻译 bundle.json...');
  
  try {
    // 读取 bundle.json
    const bundle = fs.readJSONSync(bundlePath);
    
    // 翻译
    const translated = translateObject(bundle);
    
    // 保存
    fs.writeJSONSync(bundlePath, translated, { spaces: 2 });
    
    console.log('✅ bundle.json 翻译完成！');
    
    // 统计信息
    let zhCount = 0;
    let enCount = 0;
    
    function countTranslations(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(item => countTranslations(item));
      } else if (obj && typeof obj === 'object') {
        for (const value of Object.values(obj)) {
          if (value && typeof value === 'object') {
            if (value.zh_CN) zhCount++;
            if (value.en_US) enCount++;
            countTranslations(value);
          }
        }
      }
    }
    
    countTranslations(translated);
    console.log(`📊 统计: 中文字段 ${zhCount} 个, 英文字段 ${enCount} 个`);
    
  } catch (error) {
    console.error('❌ 翻译失败:', error);
    process.exit(1);
  }
}

// 执行
translateBundle();

