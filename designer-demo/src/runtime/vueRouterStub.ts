/**
 * 设计器画布用 vue-router 桩，仅提供 useRoute、useRouter 及 Ionic 等依赖的 injection keys
 */
import { reactive } from 'vue';

const stubRoute = reactive({
    query: {} as Record<string, string>,
    params: {} as Record<string, string>,
    path: '/',
    name: undefined as string | undefined,
});

export function useRoute() {
    return stubRoute;
}

export function useRouter() {
    return {
        push: () => Promise.resolve(),
        replace: () => Promise.resolve(),
        back: () => {},
        currentRoute: { value: stubRoute },
    };
}

/** vue-router 的 provide/inject key，Ionic 等库会引用，桩中提供占位 */
export const routeLocationKey = Symbol.for('router:route');
export const matchedRouteKey = Symbol.for('router:matched');
