/**
 * 国际化工具函数
 * 用于处理材料组件 schema 中的多语言对象
 */

/* eslint-disable import/exports-last, @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-destructuring */

/**
 * 从多语言对象中获取当前语言的文本
 * 优先级：当前语言 > en_US（如果当前语言不是英文）> 第一个可用值
 * 注意：如果当前语言是英文，不会回退到中文，确保默认英文
 *
 * @param localeObj 多语言对象，如 { zh_CN: "标签文本", en_US: "Label Text" } 或字符串
 * @param currentLocale 当前语言代码，如 'en_US' 或 'zh_CN'
 * @returns 当前语言的文本，如果没有则按优先级回退（英文环境下不回退到中文）
 */
function getLocalizedText(
    localeObj: Record<string, string> | string | null | undefined,
    currentLocale: string
): string {
    if (!localeObj) {
        return '';
    }

    // 如果是字符串，直接返回
    if (typeof localeObj === 'string') {
        return localeObj;
    }

    // 如果是对象，尝试获取当前语言的文本
    if (typeof localeObj === 'object') {
        // 1. 优先使用当前语言
        if (localeObj[currentLocale]) {
            return localeObj[currentLocale];
        }

        // 2. 如果当前语言是英文，不回退到中文，直接返回空字符串
        //    这样可以让调用方使用 property 名称作为回退
        if (currentLocale === 'en_US') {
            // 如果当前是英文但没有英文翻译，不回退到中文
            // 返回空字符串，让调用方决定如何处理
            return '';
        }

        // 3. 如果当前语言不是英文，可以回退到英文（默认语言）
        if (localeObj.en_US) {
            return localeObj.en_US;
        }

        // 4. 如果当前语言是中文，可以回退到中文
        if (currentLocale === 'zh_CN' && localeObj.zh_CN) {
            return localeObj.zh_CN;
        }

        // 5. 如果都没有，返回第一个值（但英文环境下优先返回空）
        const keys = Object.keys(localeObj);
        const firstKey = keys[0];
        if (firstKey && localeObj[firstKey]) {
            // 如果当前是英文，且第一个值是中文，不返回
            if (currentLocale === 'en_US' && firstKey === 'zh_CN') {
                return '';
            }
            return localeObj[firstKey];
        }
    }

    return '';
}

/**
 * 从嵌套的多语言对象中获取文本
 * 支持 label.text 这种嵌套结构
 *
 * @param obj 对象，可能包含 label: { text: { zh_CN: "...", en_US: "..." } }
 * @param currentLocale 当前语言代码
 * @returns 当前语言的文本
 */
function getNestedLocalizedText(
    obj:
        | Record<string, unknown>
        | { text?: Record<string, string> | string }
        | string
        | null
        | undefined,
    currentLocale: string
): string {
    if (!obj) {
        return '';
    }

    // 如果 obj 本身是字符串，直接返回
    if (typeof obj === 'string') {
        return obj;
    }

    // 如果 obj 是对象，尝试获取 text 字段
    if (typeof obj === 'object' && obj.text) {
        return getLocalizedText(obj.text, currentLocale);
    }

    // 否则直接作为多语言对象处理
    return getLocalizedText(obj, currentLocale);
}

/**
 * 将字符串首字母大写
 * @param str 输入字符串
 * @returns 首字母大写的字符串
 */
function capitalizeFirstLetter(str: string): string {
    if (!str || typeof str !== 'string') {
        return str || '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 检测字符串是否包含中文字符
 * @param str 输入字符串
 * @returns 如果包含中文字符返回 true
 */
function containsChinese(str: string): boolean {
    if (!str || typeof str !== 'string') {
        return false;
    }
    // 匹配中文字符（包括中文标点）
    return /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(str);
}

/**
 * 常见中文分组名到英文的映射表
 */
const CHINESE_GROUP_NAME_MAP: Record<string, string> = {
    基础信息: 'Basic Information',
    基本信息: 'Basic Information',
    基础配置: 'Basic Configuration',
    基础属性: 'Basic Properties',
    其他: 'Others',
    其他配置: 'Other Configuration',
    高级: 'Advanced',
    高级配置: 'Advanced Configuration',
    样式: 'Styles',
    样式配置: 'Style Configuration',
    属性: 'Properties',
    属性配置: 'Property Configuration',
    数据: 'Data',
    数据配置: 'Data Configuration',
    事件: 'Events',
    事件配置: 'Event Configuration',
    验证: 'Validation',
    验证规则: 'Validation Rules',
    校验: 'Validation',
    校验规则: 'Validation Rules',
    校验属性: 'Validation Properties',
    布局: 'Layout',
    布局配置: 'Layout Configuration',
    行为: 'Behavior',
    行为配置: 'Behavior Configuration',
    插槽: 'Slots',
    插槽信息: 'Slot Information',
    插槽配置: 'Slot Configuration',
    表单: 'Form',
    表单配置: 'Form Configuration',
    表格: 'Table',
    表格配置: 'Table Configuration',
    列表: 'List',
    列表配置: 'List Configuration'
};

/**
 * 常见中文属性名到英文的映射表
 */
const CHINESE_PROPERTY_NAME_MAP: Record<string, string> = {
    前置内容: 'Prefix Content',
    后置内容: 'Suffix Content',
    字段名: 'Field',
    占位符: 'Placeholder',
    占位文本: 'Placeholder',
    标签文本: 'Label Text',
    标签宽度: 'Label Width',
    标签位置: 'Label Position',
    标签对齐: 'Label Align',
    标签后缀: 'Label Suffix',
    校验字段: 'Validation Field',
    必填: 'Required',
    禁用: 'Disabled',
    只读: 'Readonly',
    隐藏: 'Hidden',
    元素id值: 'Element ID',
    样式类: 'Class Name',
    ref引用类: 'Ref',
    自定义显示字段名称: 'Custom Display Field Name'
};

/**
 * 从中文标签获取英文翻译（分组名）
 * @param zhText 中文文本
 * @returns 英文翻译，如果没有找到则返回空字符串
 */
function translateChineseGroupName(zhText: string): string {
    if (!zhText || typeof zhText !== 'string') {
        return '';
    }
    return CHINESE_GROUP_NAME_MAP[zhText] || '';
}

/**
 * 从中文标签获取英文翻译（属性名）
 * @param zhText 中文文本
 * @returns 英文翻译，如果没有找到则返回空字符串
 */
function translateChinesePropertyName(zhText: string): string {
    if (!zhText || typeof zhText !== 'string') {
        return '';
    }
    // 精确匹配
    if (CHINESE_PROPERTY_NAME_MAP[zhText]) {
        return CHINESE_PROPERTY_NAME_MAP[zhText];
    }
    // 如果没有找到，返回空字符串（让调用方使用其他回退）
    return '';
}

/**
 * 将 camelCase 或 kebab-case 转换为首字母大写的格式
 * @param str 输入字符串，如 'label-width' 或 'labelWidth'
 * @returns 首字母大写的字符串，如 'Label Width'
 * 注意：如果字符串包含中文，在英文环境下返回空字符串
 */
function formatPropertyName(
    str: string,
    currentLocale?: string
): string {
    if (!str || typeof str !== 'string') {
        return str || '';
    }

    // 如果当前是英文环境，且字符串包含中文，返回空字符串
    if (currentLocale === 'en_US' && containsChinese(str)) {
        return '';
    }

    // 处理 kebab-case: 'label-width' -> 'Label Width'
    if (str.includes('-')) {
        return str
            .split('-')
            .map(word => capitalizeFirstLetter(word))
            .join(' ');
    }

    // 处理 camelCase: 'labelWidth' -> 'Label Width'
    // 在驼峰命名的大写字母前插入空格
    const formatted = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    return formatted
        .split(' ')
        .map(word => capitalizeFirstLetter(word))
        .join(' ');
}

// 导出所有函数和常量
export {
    getLocalizedText,
    getNestedLocalizedText,
    capitalizeFirstLetter,
    containsChinese,
    translateChineseGroupName,
    translateChinesePropertyName,
    formatPropertyName,
    CHINESE_PROPERTY_NAME_MAP
};
