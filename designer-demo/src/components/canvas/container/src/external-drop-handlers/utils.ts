export function getClonedPageState(getSchema: () => unknown): Record<string, unknown> {
    const rootSchema = getSchema();
    const currentState =
        rootSchema && typeof rootSchema === 'object'
            ? (rootSchema as { state?: unknown }).state
            : undefined;
    return currentState &&
        typeof currentState === 'object' &&
        !Array.isArray(currentState)
        ? { ...(currentState as Record<string, unknown>) }
        : {};
}

/** 生成不与 stateObj 冲突的 `prefix1`、`prefix2`… */
export function allocateIndexedKey(
    stateObj: Record<string, unknown>,
    prefix: string
): string {
    let i = 1;
    let key = `${prefix}${i}`;
    while (Object.prototype.hasOwnProperty.call(stateObj, key)) {
        i += 1;
        key = `${prefix}${i}`;
    }
    return key;
}
