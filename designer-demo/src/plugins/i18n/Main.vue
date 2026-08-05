<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/max-lines-per-block -->
<!-- eslint-disable vue/attribute-hyphenation -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/v-slot-style -->
<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
    <plugin-panel
        :title="t('designer.i18n.title')"
        class="plugin-i18n"
        fixed-name="engine.plugins.customI18n"
        :fixedPanels="fixedPanels"
        :docsUrl="docsUrl"
        :docsContent="docsContent"
        :isShowDocsIcon="true"
    >
        <template #content>
            <div class="language-search-box">
                <tiny-select
                    v-model="currentSearchType"
                    :options="i18nSearchTypes"
                ></tiny-select>
                <tiny-input
                    v-model="searchKey"
                    class="plugin-i18n-search"
                    :placeholder="t('designer.i18n.searchPlaceholder')"
                    type="text"
                    clearable
                >
                    <template #prefix>
                        <span class="icon">
                            <svg-icon name="basic-search"></svg-icon>
                        </span>
                    </template>
                </tiny-input>
            </div>
            <div class="btn-box">
                <tiny-button @click="openEditor($event, {})">
                    <svg-icon name="add" class="btn-icon"></svg-icon
                    >{{ t('designer.i18n.addEntry') }}
                </tiny-button>
                <tiny-button
                    class="middle-btn"
                    @click="batchDelete"
                    :disabled="!selectedRowLength"
                    ><svg-icon class="btn-icon" name="delete"></svg-icon
                    >{{ t('designer.i18n.delete') }}</tiny-button
                >
                <tiny-file-upload
                    ref="upload"
                    size="small"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept=".json,.zip,application/json,application/zip"
                    action="/"
                    @change="handleChange"
                >
                    <template #trigger>
                        <tiny-button
                            ><svg-icon class="btn-icon" name="upload"></svg-icon
                            >{{ t('designer.i18n.batchUpload') }}</tiny-button
                        >
                    </template>
                </tiny-file-upload>
                <a v-if="false" class="download-btn" @click="downloadFile">
                    {{ t('designer.i18n.downloadTemplate') }}
                </a>
                <p v-show="isLoading && notEmpty">
                    <span id="boxeight" class="i18n-loading"></span
                    ><span>{{ t('designer.i18n.importing') }}</span>
                </p>
            </div>
            <div class="language-plugin-table lowcode-scrollbar">
                <tiny-grid
                    ref="i18nTable"
                    :data="langList"
                    auto-resize
                    class="stripe-tiny-grid"
                    @edit-closed="editClosed($event)"
                    :edit-config="{
                        trigger: 'manual',
                        mode: 'row',
                        showStatus: false
                    }"
                    :tooltip-config="{
                        appendToBody: false,
                        placement: 'right'
                    }"
                    :edit-rules="validRules"
                >
                    <tiny-grid-column
                        type="selection"
                        width="42"
                    ></tiny-grid-column>
                    <tiny-grid-column
                        v-if="isEditMode"
                        width="120"
                        field="key"
                        title="key"
                        show-overflow
                        :show-icon="false"
                    ></tiny-grid-column>
                    <tiny-grid-column
                        v-else
                        width="120"
                        field="key"
                        title="key"
                        show-overflow
                        :show-icon="false"
                        :editor="{ component: 'input', autoselect: true }"
                    ></tiny-grid-column>
                    <!--                    <tiny-grid-column -->
                    <!--                        width="160" -->
                    <!--                        field="zh_CN" -->
                    <!--                        :title="t('designer.i18n.simplifiedChinese')" -->
                    <!--                        :show-icon="false" -->
                    <!--                        :editor="{ component: 'input', autoselect: true }" -->
                    <!--                    ></tiny-grid-column> -->
                    <tiny-grid-column
                        width="160"
                        field="en_US"
                        :title="t('designer.i18n.english')"
                        :show-icon="false"
                        :editor="{ component: 'input', autoselect: true }"
                    ></tiny-grid-column>
                    <tiny-grid-column
                        width="90"
                        field="operation"
                        :title="t('designer.i18n.operation')"
                    >
                        <template v-slot="data">
                            <div
                                v-if="editingRow !== data.row"
                                class="i18n-opera"
                            >
                                <span class="icon">
                                    <svg-icon
                                        name="to-edit"
                                        @click.stop="
                                            openEditor($event, data.row)
                                        "
                                    ></svg-icon>
                                </span>
                                <tiny-tooltip
                                    class="item"
                                    effect="light"
                                    placement="bottom"
                                    :open-delay="OPEN_DELAY.Default"
                                >
                                    <template #content>
                                        <div>
                                            {{ t('designer.i18n.copyKey')
                                            }}<br />
                                            {{ data.row.key }}
                                        </div>
                                    </template>
                                    <tiny-popover
                                        placement="top"
                                        :visible-arrow="false"
                                        trigger="manual"
                                        :content="copyTipContent"
                                        :modelValue="
                                            data.row.key &&
                                            data.rowIndex === copyRowIndex
                                        "
                                    >
                                        <template #reference>
                                            <span class="icon">
                                                <svg-icon
                                                    name="copy"
                                                    @click="
                                                        copyId(
                                                            data.row,
                                                            data.rowIndex
                                                        )
                                                    "
                                                ></svg-icon>
                                            </span>
                                        </template>
                                    </tiny-popover>
                                </tiny-tooltip>
                                <span class="icon">
                                    <svg-icon
                                        name="delete"
                                        @click="openDeletePopover(data.row)"
                                    ></svg-icon>
                                </span>
                            </div>
                        </template>
                    </tiny-grid-column>
                    <template #empty>
                        <div
                            v-if="isLoading"
                            id="empty-loading-box"
                            class="i18n-loading"
                        ></div>
                        <search-empty v-else />
                    </template>
                </tiny-grid>
            </div>
        </template>
    </plugin-panel>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script lang="ts">
/* eslint-disable vue/multi-word-component-names */
/* metaService: engine.plugins.i18n.Main */
import {
    computed,
    ref,
    watchEffect,
    reactive,
    onMounted,
    nextTick,
    resolveComponent,
    watch,
    provide
} from 'vue';
import useClipboard from 'vue-clipboard3';
import {
    Grid,
    GridColumn,
    Input,
    Popover,
    Button,
    FileUpload,
    Loading,
    Tooltip,
    Select
} from '@opentiny/vue';
import { iconLoadingShadow } from '@opentiny/vue-icon';
import { BASE_URL } from '@opentiny/tiny-engine-common/js/environments';
import {
    useTranslate,
    useModal,
    useHelp,
    getMetaApi,
    META_SERVICE,
    useLayout,
    getMergeMeta
} from '@opentiny/tiny-engine-meta-register';
import { constants } from '@opentiny/tiny-engine-utils';

import { PluginPanel, SearchEmpty } from '@/components/i18n-wrappers';
import { useDesignerI18n } from '@/services/i18nService';
/* eslint-disable max-lines */
// eslint-disable-next-line @typescript-eslint/naming-convention
const { OPEN_DELAY } = constants;

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyPopover: Popover,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyTooltip: Tooltip,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyButton: Button,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyGrid: Grid,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyGridColumn: GridColumn,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PluginPanel,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySelect: Select,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFileUpload: FileUpload,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        SearchEmpty
    },
    props: {
        fixedPanels: {
            type: Array as () => string[],
            default: () => []
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup(props, { emit }) {
        // 组件库iconLoadingShadow图标不能切换颜色，因此不同主题用不同icon
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const SvgIcon = resolveComponent('SvgIcon');
        const lightSpinnerIcon = iconLoadingShadow();
        const darkSpinnerIcon = () => h(SvgIcon, { name: 'loading' });
        const isLightTheme = getMergeMeta('engine.config').theme === 'light';
        const { getLangs, i18nResource, currentLanguage, getI18nData } =
            useTranslate();
        const { toClipboard } = useClipboard();
        const { PLUGIN_NAME, changeLeftFixedPanels } = useLayout();
        const { t } = useDesignerI18n();

        // 使用实际注册的插件 ID
        const pluginId = 'engine.plugins.customI18n';

        // 直接实现固定面板功能
        const handleFixPanel = () => {
            changeLeftFixedPanels(pluginId);
        };

        const panelState = reactive({
            emitEvent: (eventName: string, ...args: unknown[]) => {
                // 如果是 fixPanel 事件，直接调用 changeLeftFixedPanels
                if (eventName === 'fixPanel' || eventName === 'fix-panel') {
                    handleFixPanel();
                } else {
                    // 其他事件正常 emit
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (emit as (event: string, ...args: unknown[]) => void)(
                        eventName,
                        ...args
                    );
                }
            }
        });
        provide('panelState', panelState);

        const fullLangList = computed(() => {
            const langs = getLangs();

            return Object.keys(langs)
                .map(key => ({ ...langs[key] }))
                .reverse();
        });
        const i18nSearchTypes = computed(() => [
            {
                value: 'byTimeDesc',
                label: t('designer.i18n.sortByTimeDesc')
            },
            {
                value: 'byTimeAsc',
                label: t('designer.i18n.sortByTimeAsc')
            },
            {
                value: 'byLetterZh',
                label: t('designer.i18n.sortByKeyDesc')
            },
            {
                value: 'byLetterEn',
                label: t('designer.i18n.sortByKeyAsc')
            }
        ]);
        const docsUrl = useHelp().getDocsUrl('i18n');
        const docsContent = computed(() => t('designer.i18n.docs'));
        const currentSearchType = ref('');
        const copyTipContent = ref('');
        const searchKey = ref('');
        const activedRow = ref('');
        const langList = ref([]);
        const copyRowIndex = ref('');
        const isEditMode = ref(false);
        const isLoading = ref(false);
        const upload = ref('upload');
        // eslint-disable-next-line vue/require-typed-ref
        const i18nTable = ref(null);
        const selectedRowLength = computed(() => {
            return i18nTable.value?.getAllSelection?.().length || 0;
        });
        const notEmpty = computed(() => langList.value.length > 0);
        const current = ref({
            lang: 'zh_CN',
            label: t('designer.i18n.simplifiedChinese')
        });
        // eslint-disable-next-line vue/require-typed-ref
        const editingRow = ref(null);
        // key 规则：以点分段，每段必须字母开头（后续可跟字母/数字/_/-）
        const I18N_KEY_SEGMENT_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;
        const isValidI18nKey = (key = '') =>
            key
                .split('.')
                .every(segment => I18N_KEY_SEGMENT_REGEX.test(segment));
        const I18N_KEY_LENGTH = 8;
        const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
        const ALPHANUM = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const randomChar = (pool: string) =>
            pool[Math.floor(Math.random() * pool.length)];
        const generateI18nKeySegment = (length = I18N_KEY_LENGTH) => {
            if (length <= 0) return 'a';
            let result = randomChar(LETTERS);
            for (let i = 1; i < length; i += 1) {
                result += randomChar(ALPHANUM);
            }
            return result;
        };
        const generateI18nEntryKey = () =>
            `lowcode.${generateI18nKeySegment(I18N_KEY_LENGTH)}`;
        const validateKey = (rule, value, callback) => {
            if (!isValidI18nKey(value)) {
                callback(new Error(t('designer.i18n.entryKeyInvalidFormat')));
                return;
            }
            // 新增模式，需要校验 key 不重复
            if (
                !isEditMode.value &&
                fullLangList.value.some(({ key }) => value === key)
            ) {
                callback(new Error(t('designer.i18n.entryKeyExists')));
                return;
            }

            callback();
        };
        const validRules = computed(() => ({
            key: [
                { required: true, message: t('designer.common.required') },
                { validator: validateKey }
            ]
        }));

        onMounted(() => {
            currentSearchType.value = i18nSearchTypes.value[0].value;
        });

        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        const sortByLetter = (sortType = 'zh_CN') => {
            langList.value = langList.value.sort((a, b) => {
                if (
                    typeof a[sortType] === 'undefined' &&
                    typeof b[sortType] === 'undefined'
                )
                    return 0;
                if (typeof a[sortType] === 'undefined') return 1;
                if (typeof b[sortType] === 'undefined') return -1;
                return sortType === 'zh_CN'
                    ? a[sortType].localeCompare(b[sortType], 'zh')
                    : a[sortType].localeCompare(b[sortType]);
            });
        };

        const sortTypeChanges = event => {
            switch (event) {
                case 'byTimeAsc':
                    langList.value.reverse();
                    break;
                case 'byLetterZh':
                    sortByLetter();
                    break;
                case 'byLetterEn':
                    sortByLetter('en_US');
                    break;
                default:
            }
        };

        watch(
            () => [
                fullLangList.value,
                currentSearchType.value,
                searchKey.value
            ],
            () => {
                langList.value = fullLangList.value.filter(item => {
                    const reg = new RegExp(searchKey.value, 'i');
                    return (
                        reg.test(item?.zh_CN) ||
                        reg.test(item?.en_US) ||
                        reg.test(item?.key)
                    );
                });
                sortTypeChanges(currentSearchType.value);
            }
        );

        watchEffect(() => {
            if (i18nResource.locales.length) {
                current.value = i18nResource.locales.find(
                    item => item.lang === currentLanguage.value
                );
            }
        });

        const confirm = rowData => {
            useTranslate().ensureI18n(rowData, true);
        };

        const editClosed = event => {
            i18nTable.value.validate(event.row, valid => {
                if (valid) {
                    confirm(event.row);
                }
            });
        };

        const batchDelete = () => {
            const i18nData = i18nTable.value.getSelectRecords();

            if (!i18nData.length) {
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { confirm: confirmDelete } = useModal();

            confirmDelete({
                title: t('designer.i18n.delete'),
                message: t('designer.i18n.confirmDelete', {
                    count: i18nData.length
                }),
                exec: () => {
                    const keys = i18nData.map(({ key }) => key);
                    useTranslate().removeI18n(keys);
                    i18nTable.value.clearSelection();
                }
            });
        };

        const downloadFile = () => {
            // 使用我们自定义插件的配置
            const { batchImportTempDownloadUrl, batchImportTempDownMethod } = {
                batchImportTempDownloadUrl: '',
                batchImportTempDownMethod: ''
            };

            // 自定义了下载方法，只使用自定义的下载方法
            if (
                batchImportTempDownMethod &&
                typeof batchImportTempDownMethod === 'function'
            ) {
                batchImportTempDownMethod();
                return;
            }

            const defaultDownloadUrl = `${
                BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
            }/i18n-template-for-batch-import.zip`;
            const linkElement = document.createElement('a');

            linkElement.href = batchImportTempDownloadUrl || defaultDownloadUrl;
            linkElement.download = 'i18n-template-for-batch-import.zip';
            linkElement.target = '_blank';
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        };

        const openDeletePopover = row => {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { confirm: confirmDelete } = useModal();

            confirmDelete({
                title: t('designer.i18n.deleteEntry'),
                message: t('designer.i18n.confirmDelete', { key: row.key }),
                exec: () => {
                    const keys = [row.key];
                    useTranslate().removeI18n(keys);
                    i18nTable.value.clearSelection();
                }
            });
        };

        const getActiveRow = () => {
            activedRow.value = i18nTable.value.getActiveRow()?.rowIndex ?? '';
        };
        const openEditor = (_event, row) => {
            isEditMode.value = Boolean(row.key);
            editingRow.value = row;
            if (!isEditMode.value) {
                row.key = generateI18nEntryKey();
                langList.value.unshift(row);
            }
            i18nTable.value.setActiveRow(row).then(() => {
                getActiveRow();
            });
        };

        const copyId = async (row, rowIndex) => {
            copyRowIndex.value = rowIndex;
            try {
                await toClipboard(row.key);
                copyTipContent.value = t('designer.i18n.copySuccess');
            } catch (e) {
                copyTipContent.value = t('designer.i18n.copyFailed');
                // eslint-disable-next-line no-console
                console.error('Clipboard operation failed:', e);
            } finally {
                setTimeout(() => {
                    copyRowIndex.value = '';
                }, 3000);
            }
        };

        /* Locale bag keys are TinyEngine shape (zh_CN / en_US), not camelCase. */
        /* eslint-disable camelcase, @typescript-eslint/naming-convention */
        const applyImportedMessages = (messages?: {
            zh_CN?: Record<string, string>;
            en_US?: Record<string, string>;
            [lang: string]: Record<string, string> | undefined;
        }) => {
            if (!messages || typeof messages !== 'object') {
                return;
            }
            const zhData = messages.zh_CN || {};
            const enData = messages.en_US || {};
            const allI18nKey = [
                ...Object.keys(zhData),
                ...Object.keys(enData)
            ];

            // Keep canvas locale bag in sync
            if (!i18nResource.messages) {
                i18nResource.messages = {};
            }
            if (!i18nResource.messages.zh_CN) {
                i18nResource.messages.zh_CN = {};
            }
            if (!i18nResource.messages.en_US) {
                i18nResource.messages.en_US = {};
            }

            [...new Set(allI18nKey)].forEach(item => {
                if (!item) {
                    return;
                }
                const zh = zhData[item] || '';
                const en = enData[item] || '';
                i18nResource.messages.zh_CN[item] = zh;
                i18nResource.messages.en_US[item] = en;
                useTranslate().ensureI18n(
                    {
                        en_US: en,
                        key: item,
                        type: 'i18n',
                        zh_CN: zh
                    },
                    false
                );
            });

            // Force table refresh (watch may miss same-tick reactive batching)
            nextTick(() => {
                langList.value = fullLangList.value.filter(item => {
                    const reg = new RegExp(searchKey.value, 'i');
                    return (
                        reg.test(item?.zh_CN) ||
                        reg.test(item?.en_US) ||
                        reg.test(item?.key)
                    );
                });
                sortTypeChanges(currentSearchType.value);
            });
        };
        /* eslint-enable camelcase, @typescript-eslint/naming-convention */

        const handleAvatarSuccess = () => {
            getI18nData().then(res => {
                applyImportedMessages(res?.messages || res);
            });
        };

        const handleChange = data => {
            const fileName = String(data?.name || '');
            const lowerName = fileName.toLowerCase();
            const isZip = lowerName.endsWith('.zip');
            const isJson = lowerName.endsWith('.json');
            if (!isZip && !isJson) {
                useModal().message({
                    status: 'error',
                    message:
                        'Please upload i18n-template-for-batch-import.zip, or zh_cn.json / en_us.json'
                });
                return;
            }

            const appId = getMetaApi(META_SERVICE.GlobalService).getBaseInfo()
                .id;
            const action = `/app-center/api/apps/${appId}/i18n/entries/update`;

            const loadingTarget = notEmpty.value
                ? '#boxeight'
                : '#empty-loading-box';
            const loadintText = notEmpty.value
                ? ''
                : t('designer.i18n.importing');
            const loadingIcon = isLightTheme
                ? lightSpinnerIcon
                : darkSpinnerIcon;
            isLoading.value = true;

            // eslint-disable-next-line @typescript-eslint/init-declarations
            let loadingInstance = null;
            nextTick(() => {
                loadingInstance = Loading.service({
                    lock: true,
                    text: loadintText,
                    spinner: loadingIcon,
                    target: loadingTarget,
                    background: 'transparent'
                });
            });
            const formdata = new FormData();
            // Official FormData field: "1"=zh_CN, "2"=en_US.
            // Prefer filename (zh_cn / en_us); ZIP ignores field and reads both files inside.
            let key = '1';
            if (isZip) {
                key = 'zip';
            } else if (
                lowerName.includes('en_us') ||
                lowerName.includes('en-us') ||
                /(^|[._-])en([._-]|$)/.test(lowerName)
            ) {
                key = '2';
            } else if (
                lowerName.includes('zh_cn') ||
                lowerName.includes('zh-cn') ||
                /(^|[._-])zh([._-]|$)/.test(lowerName)
            ) {
                key = '1';
            } else if (lowerName.includes('en')) {
                // legacy official heuristic (avoid matching "i18n" alone — already handled via isZip)
                key = '2';
            }
            formdata.set(key, data.raw);

            getMetaApi(META_SERVICE.Http)
                .post(action, formdata)
                .then(res => {
                    // preResponse returns res.data.data → { locales, messages }
                    const payload = res?.messages ? res : res?.data || res;
                    if (payload?.messages) {
                        applyImportedMessages(payload.messages);
                    } else {
                        handleAvatarSuccess();
                    }
                })
                .catch(err => {
                    const msg =
                        err?.data?.error ||
                        err?.error ||
                        err?.message ||
                        'i18n batch import failed';
                    useModal().message({
                        status: 'error',
                        message: String(msg)
                    });
                })
                .finally(() => {
                    loadingInstance?.close?.();
                    isLoading.value = false;
                });
        };

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            PLUGIN_NAME,
            sortTypeChanges,
            currentSearchType,
            i18nSearchTypes,
            selectedRowLength,
            notEmpty,
            copyTipContent,
            validRules,
            langList,
            searchKey,
            activedRow,
            i18nResource,
            copyRowIndex,
            editClosed,
            openEditor,
            openDeletePopover,
            copyId,
            handleChange,
            upload,
            handleAvatarSuccess,
            isLoading,
            current,
            confirm,
            i18nTable,
            downloadFile,
            isEditMode,
            editingRow,
            batchDelete,
            docsUrl,
            docsContent,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            OPEN_DELAY,
            t
        };
    }
};
</script>

<!-- eslint-disable vue/max-lines-per-block -->
<style lang="scss" scoped>
.plugin-i18n {
    border-right: none;
    box-shadow: 6px 0px 3px 0px var(--te-i18n-panel-shadow-color);
    width: 500px !important;
    min-width: 500px !important;
    max-width: 500px !important;
}
.stripe-tiny-grid {
    word-wrap: break-word;
    #empty-loading-box {
        width: 100%;
        color: red;
        :deep(.tiny-loading__spinner) svg {
            width: 36px;
            height: 36px;
            font-size: 36px;
        }
        :deep(.tiny-loading__text) {
            margin-top: 8px;
        }
    }
    .i18n-loading {
        :deep(.tiny-loading__spinner) {
            svg {
                color: var(--te-i18n-loading-icon-color);
            }
        }
        :deep(.tiny-loading__text) {
            color: var(--te-i18n-loading-text-color);
        }
    }
}

.language-search-box {
    padding: 0 12px;
    margin-bottom: 12px;
    display: flex;
    .tiny-input {
        margin-left: 8px;
    }
    .tiny-select {
        width: 210px;
    }
    :deep(.tiny-input) {
        .tiny-input__prefix {
            line-height: 1;
        }
        &.tiny-input-prefix .tiny-input__inner {
            padding: 0 8px 0 26px;
        }
    }
}

.btn-box {
    color: var(--te-i18n-button-text-color);
    font-size: 12px;
    margin-bottom: 12px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    .btn-icon {
        font-size: 16px;
        color: var(--te-i18n-button-icon-color);
        margin-right: 4px;
    }
    .middle-btn {
        margin-left: 0;
    }
    span {
        padding-left: 12px;
    }
    #boxeight {
        :deep(.circular) {
            width: 16px;
            height: 16px;
            margin-top: 13px;
        }
        :deep(.path) {
            stroke: var(--te-i18n-common-tip-text-color);
        }
    }
    .download-btn {
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
        text-align: left;
        padding: 0;
        color: var(--te-i18n-button-text-color);
        svg {
            font-size: 16px;
        }
        .tiny-button.tiny-button--text {
            color: var(--te-i18n-button-text-color);
        }
        &:hover {
            text-decoration: underline;
        }
    }
}

.language-plugin-table {
    height: calc(100% - 48px);
    flex: 1;
    padding: 12px;
    border-top: 1px solid var(--te-i18n-border-color);
    overflow-y: scroll;

    .operation-column {
        display: flex;
        width: 100%;
        justify-content: space-around;

        svg {
            font-size: 14px;
        }
    }
}

.stripe-tiny-grid {
    .i18n-opera {
        display: flex;
        justify-content: space-between;
        :deep(.icon) {
            color: var(--te-i18n-grid-opt-icon-color);
            svg {
                font-size: 16px;
            }
            &:hover {
                svg {
                    opacity: 0.75;
                }
            }
        }
    }
}
</style>
