/**
 * Materials loading diagnostics only — no behavior changes.
 * Filter DevTools console with: MaterialsDiag
 */

type SnippetChild = {
    snippetName?: string;
    component?: string;
    // Material protocol i18n keys (not camelCase by design)
    // eslint-disable-next-line @typescript-eslint/naming-convention -- zh_CN / en_US
    name?: { zh_CN?: string; en_US?: string } | string;
};

type SnippetGroup = {
    group?: string;
    children?: SnippetChild[];
};

const diagEnabled = () => {
    try {
        if (typeof window === 'undefined') return true;
        const flag = (
            window as Window & { localStorage?: Storage }
        ).localStorage?.getItem('TINY_MATERIALS_DEBUG');
        // Default ON; set localStorage TINY_MATERIALS_DEBUG=0 to silence
        return flag !== '0' && flag !== 'false';
    } catch {
        return true;
    }
};

export const materialsDiag = (
    tag: string,
    data?: Record<string, unknown> | unknown
) => {
    if (!diagEnabled()) return;
    // eslint-disable-next-line no-console -- intentional diagnostics
    console.log(`[MaterialsDiag] ${tag}`, data ?? '');
};

export const materialsDiagWarn = (
    tag: string,
    data?: Record<string, unknown> | unknown
) => {
    if (!diagEnabled()) return;
    // eslint-disable-next-line no-console -- intentional diagnostics
    console.warn(`[MaterialsDiag] ${tag}`, data ?? '');
};

/** Short call stack to see who triggered load (App.vue vs startup vs asset). */
export const materialsDiagCaller = (depth = 6): string[] => {
    try {
        const stack = new Error('materialsDiag').stack || '';
        return stack
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean)
            .slice(2, 2 + depth);
    } catch {
        return [];
    }
};

export const summarizeSnippetPanel = (groups: SnippetGroup[] | undefined) => {
    const list = Array.isArray(groups) ? groups : [];
    const byGroup: Record<
        string,
        { count: number; dupKeys: string[]; sample: string[] }
    > = {};
    let totalChildren = 0;
    const allKeys: string[] = [];
    const mpLike: string[] = [];

    list.forEach(g => {
        const groupId = g.group || '(no-group)';
        const children = g.children || [];
        totalChildren += children.length;
        const keys = children.map(
            c => c.snippetName || c.component || '(empty-key)'
        );
        const seen = new Set<string>();
        const dups: string[] = [];
        keys.forEach(k => {
            allKeys.push(`${groupId}::${k}`);
            if (seen.has(k)) dups.push(k);
            else seen.add(k);
            if (/^Mp/i.test(k) || /^Mr/i.test(k)) mpLike.push(k);
        });
        byGroup[groupId] = {
            count: children.length,
            dupKeys: [...new Set(dups)],
            sample: keys.slice(0, 8)
        };
    });

    // Cross-group duplicate group ids (two "basic" entries etc.)
    const groupIdCounts: Record<string, number> = {};
    list.forEach(g => {
        const id = g.group || '(no-group)';
        groupIdCounts[id] = (groupIdCounts[id] || 0) + 1;
    });
    const duplicateGroupIds = Object.entries(groupIdCounts)
        .filter(([, n]) => n > 1)
        .map(([id, n]) => `${id}×${n}`);

    return {
        groupCount: list.length,
        totalChildren,
        duplicateGroupIds,
        groupsWithInnerDups: Object.entries(byGroup)
            .filter(([, v]) => v.dupKeys.length > 0)
            .map(([id, v]) => `${id}:{${v.dupKeys.join(',')}}`),
        mpOrMrSnippetCount: mpLike.length,
        mpOrMrSamples: [...new Set(mpLike)].slice(0, 20),
        byGroup
    };
};

export const summarizeMaterialPayload = (
    payload:
        | {
              components?: unknown[];
              snippets?: SnippetGroup[];
              packages?: unknown[];
              blocks?: unknown[];
          }
        | null
        | undefined
) => {
    if (!payload || typeof payload !== 'object') {
        return { empty: true };
    }
    const components = Array.isArray(payload.components)
        ? payload.components
        : [];
    const snippets = Array.isArray(payload.snippets) ? payload.snippets : [];
    const packages = Array.isArray(payload.packages) ? payload.packages : [];
    const componentNames = (
        components as Array<{ component?: string | string[] }>
    )
        .map(c =>
            Array.isArray(c?.component)
                ? c.component.join('|')
                : c?.component || '?'
        )
        .slice(0, 15);
    const mpComponents = (
        components as Array<{ component?: string | string[] }>
    )
        .map(c =>
            Array.isArray(c?.component)
                ? c.component.join('|')
                : String(c?.component || '')
        )
        .filter(n => /^Mp/i.test(n) || /^Mr/i.test(n));
    return {
        components: components.length,
        snippets: snippets.length,
        packages: packages.length,
        blocks: Array.isArray(payload.blocks) ? payload.blocks.length : 0,
        componentNameSample: componentNames,
        mpOrMrComponentCount: mpComponents.length,
        mpOrMrComponentSample: mpComponents.slice(0, 15),
        snippetSummary: summarizeSnippetPanel(snippets)
    };
};
