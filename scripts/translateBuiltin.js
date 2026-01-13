const fs = require('fs-extra');
const path = require('path');

// 中文到英文的翻译映射表
const TRANSLATION_MAP = {
  // 分组名称
  '布局与容器': 'Layout and Containers',
  '基础元素': 'Basic Elements',
  '高级元素': 'Advanced Elements',
  
  // 组件名称
  '盒子容器': 'Box Container',
  '行列容器': 'Row/Column Container',
  '弹性容器': 'Flex Container',
  '全宽居中容器': 'Full Width Centered Container',
  '文本': 'Text',
  '图标': 'Icon',
  '图片': 'Image',
  '段落': 'Paragraph',
  '链接': 'Link',
  '分隔线': 'Divider',
  '标题': 'Title',
  '视频': 'Video',
  '按钮': 'Button',
  '按钮组': 'Button Group',
  '互斥按钮组': 'Exclusive Button Group',
  '搜索框': 'Search Box',
  '插槽': 'Slot',
  '路由视图': 'Route View',
  '路由链接': 'Route Link',
  '导航条': 'Navigation Bar',
  '纵向导航': 'Vertical Navigation',
  '数据源容器': 'Data Source Container',
  
  // 属性标签
  '基础信息': 'Basic Information',
  '其他': 'Others',
  '显示更多': 'Show More',
  '点击事件': 'Click Event',
  '点击时触发的回调函数': 'Callback function triggered on click',
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
  
  // 尝试部分匹配
  for (const [zh, en] of Object.entries(TRANSLATION_MAP)) {
    if (zhText.includes(zh)) {
      return zhText.replace(zh, en);
    }
  }
  
  return zhText;
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
function translateBuiltin() {
  const builtinPath = path.join(process.cwd(), 'designer-demo/src/components/canvas/render/src/builtin/builtin.json');
  
  console.log('开始翻译 builtin.json...');
  
  try {
    // 读取 builtin.json
    const builtin = fs.readJSONSync(builtinPath);
    
    // 翻译
    const translated = translateObject(builtin);
    
    // 保存
    fs.writeJSONSync(builtinPath, translated, { spaces: 4 });
    
    console.log('✅ builtin.json 翻译完成！');
    
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
translateBuiltin();

