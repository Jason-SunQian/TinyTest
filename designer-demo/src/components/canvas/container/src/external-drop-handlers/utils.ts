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
