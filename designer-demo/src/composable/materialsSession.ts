/**
 * Shared materials session lock — imported by useMaterial + materialStartupLoader.
 * Do NOT expose only via getMetaApi: TinyEngine may strip non-standard API keys
 * (MaterialsDiag: runExclusiveColdStart unavailable).
 */

import {
    materialsDiag,
    summarizeSnippetPanel
} from '@/composable/materialsDiag';

type SnippetChild = {
    snippetName?: string;
    component?: string;
    schema?: { componentName?: string };
};

type SnippetGroup = {
    group?: string;
    children?: SnippetChild[];
    label?: unknown;
};

interface MaterialsSessionHandlers {
    clear?: () => void;
    getPanelGroups?: () => SnippetGroup[];
    applyDedupe?: () => void;
}

interface MaterialsSessionStore {
    materialsSessionReady: boolean;
    materialsSessionGate: Promise<void> | null;
    sessionHandlers: MaterialsSessionHandlers;
    exclusiveWriterDepth: number;
    startupOwnership: Promise<void> | null;
    resolveStartupOwnership: (() => void) | null;
}

const SESSION_STORE_KEY = '__TINY_ENGINE_MATERIALS_SESSION__';
const getSessionStore = (): MaterialsSessionStore => {
    const g = globalThis as typeof globalThis & {
        [SESSION_STORE_KEY]?: MaterialsSessionStore;
    };
    if (!g[SESSION_STORE_KEY]) {
        g[SESSION_STORE_KEY] = {
            materialsSessionReady: false,
            materialsSessionGate: null,
            sessionHandlers: {},
            exclusiveWriterDepth: 0,
            startupOwnership: null,
            resolveStartupOwnership: null
        };
    }
    return g[SESSION_STORE_KEY]!;
};
const sessionStore = getSessionStore();

const claimMaterialsStartupOwnership = () => {
    if (!sessionStore.startupOwnership) {
        sessionStore.startupOwnership = new Promise<void>(resolve => {
            sessionStore.resolveStartupOwnership = resolve;
        });
        materialsDiag('startupOwnership: claimed');
    }
    return sessionStore.startupOwnership;
};

const releaseMaterialsStartupOwnership = () => {
    if (sessionStore.resolveStartupOwnership) {
        sessionStore.resolveStartupOwnership();
        sessionStore.resolveStartupOwnership = null;
        materialsDiag('startupOwnership: released');
    }
    sessionStore.startupOwnership = null;
};

const awaitMaterialsStartupOwnership = async () => {
    if (sessionStore.startupOwnership) {
        materialsDiag('startupOwnership: await');
        await sessionStore.startupOwnership;
    }
};

/**
 * While startup owns the session (or session already ready), only the exclusive
 * writer may call addMaterials/initBuiltin. Prevents 2x/3x panel stacking when
 * App fetchResource / TinyEngine race with forceLoad.
 */
const isMaterialsWriteBlocked = () => {
    if (sessionStore.exclusiveWriterDepth > 0) return false;
    if (sessionStore.startupOwnership) return true;
    if (sessionStore.materialsSessionReady) return true;
    return false;
};

/** useMaterial registers real clear/panel hooks here (getMetaApi may strip them). */
const registerMaterialsSessionHandlers = (
    handlers: MaterialsSessionHandlers
) => {
    sessionStore.sessionHandlers = {
        ...sessionStore.sessionHandlers,
        ...handlers
    };
};

const hasMaterialsClearHandler = () =>
    typeof sessionStore.sessionHandlers.clear === 'function';

/** @deprecated use registerMaterialsSessionHandlers */
const registerMaterialsClearHandler = (fn: () => void) => {
    sessionStore.sessionHandlers.clear = fn;
};

const isMaterialsSessionReady = () => sessionStore.materialsSessionReady;

const getMaterialsSessionGate = () => sessionStore.materialsSessionGate;

const resetMaterialsSession = () => {
    sessionStore.materialsSessionReady = false;
};

const markMaterialsSessionReady = () => {
    sessionStore.materialsSessionReady = true;
    materialsDiag('markMaterialsSessionReady');
};

const awaitMaterialsSessionGate = async () => {
    if (sessionStore.materialsSessionGate) {
        await sessionStore.materialsSessionGate;
    }
};

const hasMainProjectSnippetsIn = (groups: SnippetGroup[]) =>
    groups.some(
        g =>
            g.group === '业务组件' ||
            g.group === '原子组件' ||
            (g.children || []).some(c =>
                /^Mp|^Mr/.test(String(c.snippetName || c.component || ''))
            )
    );

const dedupeSnippetGroups = (groups: SnippetGroup[]): SnippetGroup[] => {
    const childKey = (c: SnippetChild) =>
        c.snippetName || c.component || c.schema?.componentName;

    const merged = new Map<string, SnippetGroup>();
    groups.forEach(group => {
        if (!group?.group) return;
        if (!merged.has(group.group)) {
            merged.set(group.group, {
                ...group,
                children: [...(group.children || [])]
            });
            return;
        }
        const target = merged.get(group.group)!;
        (group.children || []).forEach(child => {
            const key = childKey(child);
            if (!key) {
                target.children = target.children || [];
                target.children.push(child);
                return;
            }
            const list = target.children || [];
            const idx = list.findIndex(c => childKey(c) === key);
            if (idx >= 0) list.splice(idx, 1, child);
            else list.push(child);
            target.children = list;
        });
    });
    merged.forEach(g => {
        const seen = new Set<string>();
        g.children = (g.children || []).filter(c => {
            const key = childKey(c);
            if (!key) return true;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    });
    return [...merged.values()];
};

const readPanel = () => sessionStore.sessionHandlers.getPanelGroups?.() || [];

const applyPanelDedupe = () => {
    sessionStore.sessionHandlers.applyDedupe?.();
};

/**
 * Wait for any in-flight load, then clear + load exactly once.
 * fetchMaterial joins the same gate and will not addMaterials again after ready.
 */
const runExclusiveColdStart = async (
    work: () => Promise<void>,
    options?: MaterialsSessionHandlers
) => {
    if (sessionStore.materialsSessionGate) {
        materialsDiag('runExclusiveColdStart: await in-flight gate');
        await sessionStore.materialsSessionGate;
    }

    const panel = options?.getPanelGroups?.() || readPanel();
    if (sessionStore.materialsSessionReady && hasMainProjectSnippetsIn(panel)) {
        materialsDiag(
            'runExclusiveColdStart: already ready with main project',
            {
                panel: summarizeSnippetPanel(panel)
            }
        );
        if (options?.applyDedupe) {
            options.applyDedupe();
        } else {
            applyPanelDedupe();
        }
        return;
    }

    sessionStore.materialsSessionGate = (async () => {
        sessionStore.exclusiveWriterDepth += 1;
        try {
            materialsDiag('runExclusiveColdStart: clear + load once');
            const clearFn =
                options?.clear || sessionStore.sessionHandlers.clear;
            clearFn?.();
            resetMaterialsSession();
            await work();
            if (options?.applyDedupe) {
                options.applyDedupe();
            } else {
                applyPanelDedupe();
            }
            sessionStore.materialsSessionReady = true;
            const afterPanel = options?.getPanelGroups?.() || readPanel();
            const htmlGroup = afterPanel.find(g => g.group === 'html');
            materialsDiag('runExclusiveColdStart: done', {
                panel: summarizeSnippetPanel(afterPanel),
                hasMainProject: hasMainProjectSnippetsIn(afterPanel),
                htmlChildCount: htmlGroup?.children?.length ?? 0,
                htmlKeys: (htmlGroup?.children || []).map(
                    c => c.snippetName || c.component || '?'
                )
            });
        } finally {
            sessionStore.exclusiveWriterDepth -= 1;
            sessionStore.materialsSessionGate = null;
        }
    })();
    await sessionStore.materialsSessionGate;
};

/** Used by fetchMaterial when no exclusive cold start claimed the gate yet. */
const runInMaterialsSessionGate = async (work: () => Promise<void>) => {
    if (sessionStore.materialsSessionReady) {
        materialsDiag('sessionGate: skip (ready)');
        return;
    }
    if (sessionStore.materialsSessionGate) {
        materialsDiag('sessionGate: await existing');
        await sessionStore.materialsSessionGate;
        materialsDiag('sessionGate: skip after await', {
            ready: sessionStore.materialsSessionReady
        });
        return;
    }
    sessionStore.materialsSessionGate = (async () => {
        sessionStore.exclusiveWriterDepth += 1;
        try {
            await work();
            sessionStore.materialsSessionReady = true;
        } finally {
            sessionStore.exclusiveWriterDepth -= 1;
            sessionStore.materialsSessionGate = null;
        }
    })();
    await sessionStore.materialsSessionGate;
};

export {
    awaitMaterialsSessionGate,
    awaitMaterialsStartupOwnership,
    claimMaterialsStartupOwnership,
    dedupeSnippetGroups,
    getMaterialsSessionGate,
    hasMainProjectSnippetsIn,
    hasMaterialsClearHandler,
    isMaterialsSessionReady,
    isMaterialsWriteBlocked,
    markMaterialsSessionReady,
    registerMaterialsClearHandler,
    registerMaterialsSessionHandlers,
    releaseMaterialsStartupOwnership,
    resetMaterialsSession,
    runExclusiveColdStart,
    runInMaterialsSessionGate
};
