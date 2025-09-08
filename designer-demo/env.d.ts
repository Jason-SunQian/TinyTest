/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'virtual:svg-icons-register'

interface ImportMetaEnv {
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@opentiny/tiny-engine' {
  export function init(options: any): void
}

declare module '@opentiny/tiny-engine-meta-register' {
  export const META_SERVICE: Record<string, string>
  export const META_APP: Record<string, string>
}

declare module '@opentiny/tiny-engine-vite-config' {
  export function useTinyEngineBaseConfig(options: any): any
}

