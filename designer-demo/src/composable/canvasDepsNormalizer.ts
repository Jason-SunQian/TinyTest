/**
 * 订阅 init_canvas_deps，将相对路径的 script/styles 转为绝对 URL 后重新发布。
 * 因设计器通过 npm 使用 canvas 包，无法改包内 importMap；由 npm 包 materials 发布的
 * 相对路径在 iframe 内会被解析为 vscode-webview 导致 403，故在此统一归一化为 localhost。
 */
import { getDesignerMaterialBaseUrl } from '@/utils/designerOrigin'

function toAbsoluteUrl(url: string): string {
  if (typeof url !== 'string' || !url.startsWith('/')) return url
  const win = typeof window !== 'undefined' ? (window as Window & { TINY_DESIGNER_ORIGIN?: string }) : undefined
  const base = (
    getDesignerMaterialBaseUrl() ||
    win?.TINY_DESIGNER_ORIGIN ||
    (typeof location !== 'undefined' ? location.origin : '') ||
    'http://localhost:8090'
  )
    .toString()
    .replace(/\/$/, '')
  return base ? `${base}${url}` : url
}

type Deps = { scripts?: Array<{ package?: string; script?: string; css?: string; [k: string]: unknown }>; styles?: string[] | Set<string> }

function normalizeDeps(deps: Deps): { normalized: Deps; changed: boolean } {
  let changed = false
  const scripts = Array.isArray(deps.scripts) ? deps.scripts : []
  const styles = Array.isArray(deps.styles) ? deps.styles : Array.from(deps.styles || [])

  const newScripts = scripts.map((item) => {
    const script = item?.script
    if (typeof script === 'string' && script.startsWith('/')) {
      changed = true
      return { ...item, script: toAbsoluteUrl(script) }
    }
    if (item?.css && typeof item.css === 'string' && item.css.startsWith('/')) {
      changed = true
      return { ...item, css: toAbsoluteUrl(item.css) }
    }
    return item
  })

  const newStyles = styles.map((s) => {
    if (typeof s === 'string' && s.startsWith('/')) {
      changed = true
      return toAbsoluteUrl(s)
    }
    return s
  })

  if (!changed) return { normalized: deps, changed: false }
  return {
    normalized: { ...deps, scripts: newScripts, styles: newStyles },
    changed: true
  }
}

export function setupCanvasDepsNormalizer(
  subscribe: (opts: { topic: string; subscriber: string; callback: (data: unknown) => void }) => void,
  publish: (opts: { topic: string; data: unknown }) => void
) {
  subscribe({
    topic: 'init_canvas_deps',
    subscriber: 'designer-demo.canvas-deps-normalizer',
    callback: (data) => {
      const deps = (data || {}) as Deps
      const { normalized, changed } = normalizeDeps(deps)
      if (changed) {
        publish({ topic: 'init_canvas_deps', data: normalized })
      }
    }
  })
}
