/**
 * 画布 v-model 演示：拖拽落盘（external-drop-handlers）与保存前补丁（schema-default-patches）共用，
 * 避免新增组件时重复抄写 isExpr 判断与 state key 递增逻辑。
 */

/** 属性面板 / schema 上的 modelValue 是否为 JSExpression（已绑定 this.state.xxx） */
export function isModelValueJsExpression(mv: unknown): boolean {
    return (
        mv !== null &&
        mv !== undefined &&
        typeof mv === 'object' &&
        (mv as Record<string, unknown>).type === 'JSExpression'
    );
}

/** 生成不与 state 对象冲突的 `prefix1`、`prefix2`… */
export function allocateIndexedStateKey(
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
