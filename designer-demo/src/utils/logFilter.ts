type ConsoleMethod = (...args: unknown[]) => void;

type LogFilterOptions = {
    /** 默认只放行这些关键字前缀/命中项 */
    allow: Array<RegExp>;
    /** 每条“同样的首参字符串”最多放行次数，超过后静音（避免刷屏卡顿） */
    maxRepeats: number;
};

function toKey(args: unknown[]): string {
    const a0 = args[0];
    if (typeof a0 === 'string') return a0;
    if (a0 instanceof Error) return a0.message || a0.name;
    try {
        return JSON.stringify(a0);
    } catch {
        return String(a0);
    }
}

function shouldAllow(args: unknown[], allow: Array<RegExp>): boolean {
    const joined = args
        .map(a => (typeof a === 'string' ? a : a instanceof Error ? a.message : ''))
        .filter(Boolean)
        .join(' ');
    return allow.some(r => r.test(joined));
}

export function setupLogFilter() {
    if (typeof window === 'undefined') return;

    // 开关：
    // - localStorage.TINY_LOG = 'all'  => 不过滤
    // - localStorage.TINY_LOG = 'none' => 全静音（不推荐）
    // 默认：仅放行关键排障日志
    const mode = (() => {
        try {
            return String(window.localStorage?.getItem('TINY_LOG') || '');
        } catch {
            return '';
        }
    })();
    if (mode === 'all') return;

    const isVsCodeEnv =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)?.vscode || (window as any)?.vscodeBridge;
    if (!isVsCodeEnv) return;

    const opts: LogFilterOptions = {
        allow: [
            /^\[Materials\]/,
            /^\[useResource\]/,
            /SecurityError/i,
            /Blocked a frame/i,
            /Failed to fetch dynamically imported module/i,
            /Failed to resolve module specifier/i,
            // 运行时脚本执行错误（import 成功但模块内部抛错）
            /Uncaught/i,
            /TypeError/i
        ],
        maxRepeats: 5
    };

    const seen = new Map<string, number>();

    const wrap = (orig: ConsoleMethod): ConsoleMethod => {
        return (...args: unknown[]) => {
            if (mode === 'none') return;
            // 白名单日志永远放行：避免“同一条 warning 重复 N 次”被 maxRepeats 误杀，
            // 否则会出现“启动阶段关键日志完全消失，但手动刷新后又出现”的假象。
            if (shouldAllow(args, opts.allow)) {
                orig(...args);
                return;
            }
            const key = toKey(args);
            const n = (seen.get(key) || 0) + 1;
            seen.set(key, n);
            if (n > opts.maxRepeats) return;
            orig(...args);
        };
    };

    // eslint-disable-next-line no-console
    console.log = wrap(console.log.bind(console));
    // eslint-disable-next-line no-console
    console.info = wrap(console.info.bind(console));
    // eslint-disable-next-line no-console
    console.warn = wrap(console.warn.bind(console));
    // 保留 error（但同样做去重/限流）
    // eslint-disable-next-line no-console
    console.error = wrap(console.error.bind(console));

    // 统一捕获跨域 SecurityError（只打一条高信号）
    let securityErrorReported = false;
    window.addEventListener(
        'error',
        evt => {
            if (securityErrorReported) return;
            const msg =
                (evt as ErrorEvent)?.message ||
                ((evt as ErrorEvent)?.error instanceof Error
                    ? (evt as ErrorEvent).error.message
                    : '');
            if (/SecurityError/i.test(msg) || /Blocked a frame/i.test(msg)) {
                securityErrorReported = true;
                // eslint-disable-next-line no-console
                console.error(
                    '[SecurityError] 跨域访问被拦截（通常是 iframe 访问 parent/window 的变量）。请仅通过设计器（webview 顶层）读取注入变量，避免在画布 iframe 内直接读 window.parent.TINY_*。',
                    msg
                );
            }
        },
        true
    );

    window.addEventListener('unhandledrejection', evt => {
        if (securityErrorReported) return;
        const r: any = (evt as PromiseRejectionEvent).reason;
        const msg =
            r instanceof Error ? r.message : typeof r === 'string' ? r : '';
        if (/SecurityError/i.test(msg) || /Blocked a frame/i.test(msg)) {
            securityErrorReported = true;
            // eslint-disable-next-line no-console
            console.error(
                '[SecurityError] Promise rejection:',
                msg,
                r instanceof Error ? r.stack : r
            );
        }
    });
}

