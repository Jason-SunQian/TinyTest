/**
 * 设计器/预览环境下的全局方法兼容层
 * 与主工程 globalProperties 同签名，仅提供只读展示用实现，不实现真实业务
 */

/**
 * 国际化：优先使用画布 i18n，否则返回 key
 */
export function t(key: string, ...args: unknown[]): string {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const i18n = (window as any).lowcodeI18n?.global;
        if (i18n?.t && typeof i18n.t === 'function') {
            return i18n.t(key, ...args) ?? key;
        }
    } catch {
        // ignore
    }
    return key;
}

/**
 * 金额格式化：千分位 + 币种，与主工程 $currency 签名兼容
 * 主工程用法：$currency(value, currencyCode).format() 或 $currency(value, options).format()
 */
export function currency(
    value: string | number,
    optionsOrSymbol?: { precision?: number; symbol?: string; thousands?: string; decimal?: string } | string
): { format: () => string } {
    const opts =
        typeof optionsOrSymbol === 'string'
            ? { symbol: optionsOrSymbol }
            : optionsOrSymbol ?? {};
    const num = Number(value);
    const str = Number.isNaN(num) ? String(value) : formatNum(num, opts);
    return { format: () => str };
}

function formatNum(
    num: number,
    options: { precision?: number; symbol?: string; thousands?: string; decimal?: string } = {}
): string {
    const precision = options.precision ?? 2;
    const symbol = options.symbol ?? '';
    const thousands = options.thousands ?? ',';
    const decimal = options.decimal ?? '.';
    const parts = num.toFixed(precision).split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    const decPart = parts[1];
    const formatted = decPart ? `${intPart}${decimal}${decPart}` : intPart;
    return symbol ? `${symbol} ${formatted}`.trim() : formatted;
}

/** 获取当前币种代码，与主工程 $getCurrency 兼容 */
export function getCurrency(): string {
    return 'HKD';
}

/** 获取币种符号，与主工程 $getCurrencySymbol 兼容（可传币种代码） */
export function getCurrencySymbol(currencyCode?: string): string {
    if (currencyCode === 'HKD' || !currencyCode) return 'HK$';
    return currencyCode;
}

type FdFormatType = 'long' | 'short' | 'tiny';

/**
 * 日期格式化桩，与主工程 $fd 签名兼容（画布展示用）
 * 主工程用法：$fd(date, 'short') / $fd(date, 'tiny') 等
 */
export function fd(date: string | Date, type: FdFormatType = 'long'): string {
    if (date === undefined || date === null || date === '') return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return String(date);
    if (type === 'tiny') return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (type === 'short') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
