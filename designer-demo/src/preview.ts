/**
 * 迁移自 src/preview.js
 */
import { defineEntry } from '@opentiny/tiny-engine-meta-register';
import 'virtual:svg-icons-register';

async function startApp() {
    const { initHook, HOOK_NAME, META_SERVICE, initPreview } = await import(
        '@opentiny/tiny-engine'
    );
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { HttpService } = await import('./composable');

    const beforeAppCreate = () => {
        initHook(HOOK_NAME.useEnv, import.meta.env);
    };

    const appCreated = async ({ app }: { app: import('vue').App }) => {
        const { loadRuntimeModule } = await import('./composable/loadRuntimeFromBundles');
        const runtime = await loadRuntimeModule();
        runtime.installRuntimeCompat(app);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registry: any = {
        [META_SERVICE.Http]: HttpService
    };

    defineEntry(registry);

    initPreview({
        registry,
        lifeCycles: {
            beforeAppCreate,
            appCreated
        }
    });
}

startApp();
