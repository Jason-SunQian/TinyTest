/**
 * 用于控制是否强制占用画布，并抑制 npm DesignCanvas「请先锁定」弹窗。
 * 设置为 false 即可恢复官方锁定提示逻辑。
 *
 * 实现：
 * 1) pageStatus / getEnsuredCanvasStatus 强制 Occupy（pageStatusGuard flush:sync）
 * 2) initHook(useModal) 吞掉锁定相关 confirm（兜底竞态）
 */
export const ENABLE_PAGE_LOCK_GUARD = true;

/**
 * 用于控制 media 插件是否只显示手机竖屏选项。
 * 设置为 true 时，只显示手机竖屏，且默认选中。
 * 设置为 false 时，恢复显示所有设备选项（大屏、PC端、平板、手机横屏、手机竖屏）。
 */
export const MEDIA_MOBILE_ONLY = true;
