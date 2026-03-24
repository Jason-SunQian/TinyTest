/**
 * 设计器/预览环境下的全局方法兼容层
 * 与主工程 globalProperties 同签名，仅提供只读展示用实现，不实现真实业务
 */

type FdFormatType = 'long' | 'short' | 'tiny';

function formatNum(
    num: number,
    options: {
        precision?: number;
        symbol?: string;
        thousands?: string;
        decimal?: string;
    } = {}
): string {
    const precision = options.precision ?? 2;
    const symbol = options.symbol ?? '';
    const thousands = options.thousands ?? ',';
    const decimal = options.decimal ?? '.';
    const [intPartStr, decPart] = num.toFixed(precision).split('.');
    const intPart = intPartStr.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    const formatted = decPart ? `${intPart}${decimal}${decPart}` : intPart;
    return symbol ? `${symbol} ${formatted}`.trim() : formatted;
}

function t(key: string, ...args: unknown[]): string {
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

function currency(
    value: string | number,
    optionsOrSymbol?:
        | {
              precision?: number;
              symbol?: string;
              thousands?: string;
              decimal?: string;
          }
        | string
): { format: () => string } {
    const opts =
        typeof optionsOrSymbol === 'string'
            ? { symbol: optionsOrSymbol }
            : optionsOrSymbol ?? {};
    const num = Number(value);
    const str = Number.isNaN(num) ? String(value) : formatNum(num, opts);
    return { format: () => str };
}

function getCurrency(): string {
    return 'HKD';
}

function getCurrencySymbol(currencyCode?: string): string {
    if (currencyCode === 'HKD' || !currencyCode) return 'HK$';
    return currencyCode;
}

function fd(date: string | Date, type: FdFormatType = 'long'): string {
    if (date === undefined || date === null || date === '') return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return String(date);
    if (type === 'tiny')
        return d.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    if (type === 'short')
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

export { t, currency, getCurrency, getCurrencySymbol, fd };
