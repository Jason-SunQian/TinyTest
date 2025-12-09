<template>
    <div class="toolbar-lang">
        <toolbar-base
            :content="currentLanguageName"
            :icon="options.icon || 'cn-en'"
            :options="options"
            @click-api="toggle"
        >
            <template #default>
                <tiny-popover
                    :visible-arrow="false"
                    width="220"
                    trigger="click"
                >
                    <template #reference>
                        <span class="lang-btn">
                            <span class="lang-flag">{{
                                currentLanguageFlag
                            }}</span>
                            <span class="lang-name">{{
                                currentLanguageName
                            }}</span>
                            <svg-icon name="down-arrow" class="lang-arrow" />
                        </span>
                    </template>
                    <div class="lang-panel">
                        <div class="lang-list">
                            <div
                                v-for="lang in supportedLanguages"
                                :key="lang.code"
                                class="lang-item"
                                :class="{
                                    active: lang.code === currentLanguage
                                }"
                                @click="switchTo(lang.code)"
                            >
                                <span class="lang-flag">{{ lang.flag }}</span>
                                <span class="lang-name">{{ lang.name }}</span>
                                <span class="lang-name-en">{{
                                    lang.nameEn
                                }}</span>
                                <svg-icon
                                    v-if="lang.code === currentLanguage"
                                    name="check"
                                    class="lang-check"
                                />
                            </div>
                        </div>
                    </div>
                </tiny-popover>
            </template>
        </toolbar-base>
    </div>
</template>

<script lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { Popover } from '@opentiny/vue';
import { ToolbarBase } from '@opentiny/tiny-engine-common';

import {
    switchLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    type LanguageConfig
} from '../../services/i18nService';

export default {
    name: 'custom-lang-toolbar',
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyPopover: Popover,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ToolbarBase
    },
    props: {
        options: {
            type: Object as () => Record<string, unknown>,
            default: () => ({})
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const currentLanguage = ref(getCurrentLanguage());
        const supportedLanguages = ref<LanguageConfig[]>(
            getSupportedLanguages()
        );

        // 监听 i18n 实例的语言变化，同步更新 currentLanguage
        const syncLanguageFromI18n = () => {
            const instance: any = (window as any).lowcodeI18n;
            if (instance?.global?.locale?.value) {
                const newLang = instance.global.locale.value;
                if (newLang !== currentLanguage.value) {
                    // eslint-disable-next-line no-console
                    console.log(`[Lang Toolbar] Syncing language from i18n: ${currentLanguage.value} → ${newLang}`);
                    currentLanguage.value = newLang;
                }
            }
        };

        // 初始同步
        syncLanguageFromI18n();

        // 定期检查 i18n 实例的语言变化（因为无法直接 watch i18n 实例）
        const checkInterval = setInterval(() => {
            syncLanguageFromI18n();
        }, 200);

        // 组件卸载时清除定时器
        onUnmounted(() => {
            clearInterval(checkInterval);
        });

        // 当前语言配置
        const currentLanguageConfig = computed(() => {
            return (
                supportedLanguages.value.find(
                    lang => lang.code === currentLanguage.value
                ) || supportedLanguages.value[0]
            );
        });

        const currentLanguageName = computed(
            () => currentLanguageConfig.value?.name || '英文'
        );
        const currentLanguageFlag = computed(
            () => currentLanguageConfig.value?.flag || '🇺🇸'
        );

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const toggle = () => {};

        const switchTo = (locale: string) => {
            const success = switchLanguage(locale);
            if (success) {
                currentLanguage.value = locale;
            }
        };

        // 监听语言变化
        watch(currentLanguage, newLang => {
            // eslint-disable-next-line no-console
            console.log(`[Lang Toolbar] Language changed to: ${newLang}`);
        });

        return {
            currentLanguage,
            currentLanguageName,
            currentLanguageFlag,
            supportedLanguages,
            toggle,
            switchTo
        };
    }
};
</script>

<style lang="scss" scoped>
.lang-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.lang-btn:hover {
    background-color: var(--te-color-bg-2, #f5f5f5);
}

.lang-flag {
    font-size: 16px;
}

.lang-name {
    font-size: 12px;
    font-weight: 500;
}

.lang-arrow {
    width: 12px;
    height: 12px;
    transition: transform 0.2s;
}

.lang-panel {
    padding: 2px 0;
}

.lang-list {
    max-height: 240px;
    overflow-y: auto;
    border-radius: 4px;
}

.lang-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
    min-height: 32px;
    border-bottom: 1px solid var(--te-color-border-2, #f0f0f0);
}

.lang-item:last-child {
    border-bottom: none;
}

.lang-item:hover {
    background-color: var(--te-color-bg-2, #f5f5f5);
}

.lang-item.active {
    background-color: var(--te-color-primary-1, #e6f7ff);
    color: var(--te-color-primary, #1890ff);
}

.lang-item .lang-flag {
    font-size: 16px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    margin-right: 8px;
}

.lang-item .lang-name {
    font-size: 13px;
    font-weight: 500;
    flex: 1;
    min-width: 0;
    line-height: 1.2;
    margin-right: 8px;
    white-space: nowrap;
}

.lang-item .lang-name-en {
    font-size: 11px;
    color: var(--te-color-text-3, #999);
    flex-shrink: 0;
    width: 72px;
    text-align: right;
    line-height: 1.2;
    padding-right: 8px;
    white-space: nowrap;
}

.lang-check {
    width: 16px;
    height: 16px;
    color: var(--te-color-primary, #1890ff);
    position: absolute;
    right: 8px;
}
</style>
