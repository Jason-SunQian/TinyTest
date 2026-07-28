<!-- eslint-disable vue/max-lines-per-block, vue/html-self-closing, vue/attributes-order, vue/html-closing-bracket-newline, vue/no-bare-strings-in-template -->
<template>
    <div class="general-config">
        <tiny-form
            ref="generalForm"
            :model="pageSettingState.currentPageData"
            :rules="isFolder ? folderRules : pageRules"
            label-width="120px"
            validate-type="text"
            :inline-message="true"
            :label-align="true"
            label-position="top"
            class="general-config-form"
        >
            <tiny-form-item
                v-if="!isFolder"
                prop="group"
                :label="t('designer.page.pageType')"
                class="form-item-page-type"
            >
                <tiny-radio
                    v-model="pageSettingState.currentPageData.group"
                    class="page-type-radio"
                    label="staticPages"
                >
                    {{ t('designer.page.staticPages') }}
                </tiny-radio>
                <tiny-radio
                    v-model="pageSettingState.currentPageData.group"
                    class="page-type-radio"
                    label="publicPages"
                >
                    {{ t('designer.page.publicPages') }}
                </tiny-radio>
            </tiny-form-item>
            <tiny-form-item
                prop="name"
                :label="
                    isFolder
                        ? t('designer.page.folderName')
                        : t('designer.page.pageName')
                "
            >
                <tiny-input
                    v-model="pageSettingState.currentPageData.name"
                    :placeholder="
                        isFolder
                            ? t('designer.page.enterFolderName')
                            : t('designer.page.enterPageName')
                    "
                />
            </tiny-form-item>

            <tiny-form-item
                v-if="pageSettingState.currentPageData.group !== 'publicPages'"
                :label="t('designer.page.parentFolder')"
                prop="parentId"
            >
                <tiny-select
                    v-model="pageParentId"
                    value-field="id"
                    render-type="tree"
                    :tree-op="treeFolderOp"
                    text-field="name"
                    :placeholder="t('designer.page.selectParentFolder')"
                    popper-class="parent-fold-select-dropdown"
                    @change="changeParentForderId"
                />
            </tiny-form-item>

            <tiny-form-item :label="t('designer.page.pageRoute')" prop="route">
                <tiny-input
                    v-model="pageSettingState.currentPageData.route"
                    :placeholder="t('designer.page.enterRoute')"
                />
                <div class="tip">
                    <span
                        v-if="!pageSettingState.currentPageData.route"
                        class="text"
                    >
                        {{ t('designer.page.routeStartsWith') }}
                    </span>
                    <span v-else class="route-text">
                        <span class="tip-text">{{
                            t('designer.page.websitePrefix')
                        }}</span>
                        <span class="tip-text-dim">{{ currentRoute }}</span>
                    </span>
                </div>
            </tiny-form-item>
            <tiny-form-item
                v-if="
                    pageSettingState.currentPageData.group !== 'publicPages' &&
                    !isFolder &&
                    state.childPageOp?.length
                "
                :label="t('designer.page.setDefaultRedirect')"
                prop="isDefault"
            >
                <tiny-select
                    v-model="state.defaultPageId"
                    :options="state.childPageOp"
                    :placeholder="t('designer.page.selectDefaultRedirect')"
                    @change="changeDefaultPage"
                />
                <div v-if="state.defaultPageId" class="tip">
                    <div class="tip-text">
                        {{ t('designer.page.accessRoute') }}
                    </div>
                    <span class="tip-text-dim">/{{ currentRoute }}</span>
                    <div class="tip-text">
                        {{ t('designer.page.defaultRedirectTo') }}
                    </div>
                    <span class="tip-text-dim">
                        /{{ currentRoute }}/{{
                            pageSettingState?.defaultPage?.route
                        }}
                    </span>
                </div>
            </tiny-form-item>
        </tiny-form>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang, vue/component-api-style -->
<script lang="tsx">
/* metaService: engine.plugins.appmanage.PageGeneral */
import { ref, computed, watchEffect, reactive, h } from 'vue';
import { Form, FormItem, Input, Select, Radio } from '@opentiny/vue';
import { iconFile } from '@opentiny/vue-icon';
import { usePage } from '@opentiny/tiny-engine-meta-register';
import {
    REGEXP_FOLDER_NAME,
    REGEXP_ROUTE
} from '@opentiny/tiny-engine-common/js/verification';

import { useDesignerI18n } from '../../services/i18nService';

export default {
    components: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyForm: Form,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyFormItem: FormItem,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyInput: Input,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinySelect: Select,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TinyRadio: Radio
    },
    props: {
        modelValue: {
            type: Object,
            default: () => ({})
        },
        isFolder: {
            type: Boolean,
            default: false
        }
    },
    // eslint-disable-next-line vue/component-api-style
    setup() {
        const { t } = useDesignerI18n();
        const {
            pageSettingState,
            changeTreeData,
            STATIC_PAGE_GROUP_ID,
            getPageChildren
        } = usePage();
        const { ROOT_ID } = pageSettingState;

        const pageParentId = computed({
            get() {
                return String(pageSettingState.currentPageData.parentId);
            },
            set(value) {
                pageSettingState.currentPageData.parentId = value;
            }
        });

        const oldParentId = ref('');
        watchEffect(() => {
            oldParentId.value = String(
                pageSettingState.currentPageData.parentId
            );
        });
        const state = reactive({
            childPageList: [],
            childPageOp: [],
            defaultPageId: ''
        });

        const setChildAndDefaultPage = async id => {
            if (pageSettingState.isNew) {
                state.childPageList = [];
                state.childPageOp = [];
                state.defaultPageId = '';
            } else {
                state.childPageList = await getPageChildren(id);
                // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                const defaultPage = state.childPageList?.find(
                    item => item.isDefault
                );
                if (defaultPage) {
                    pageSettingState.defaultPage = defaultPage;
                    state.defaultPageId = defaultPage.id;
                } else {
                    pageSettingState.defaultPage = null;
                    state.defaultPageId = '';
                }
                const iconFileResult = iconFile();
                const mappedChildPageOp = state.childPageList.map(item => {
                    return {
                        value: item.id,
                        label: item.name,
                        icon: iconFileResult
                    };
                });
                state.childPageOp = mappedChildPageOp;
            }
        };

        const changeDefaultPage = () => {
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            const foundPage = state.childPageList.find(
                item => item.id === state.defaultPageId
            );
            if (foundPage) {
                pageSettingState.defaultPage = foundPage;
            } else {
                pageSettingState.defaultPage = null;
            }
        };

        watchEffect(() => {
            const oldParentIdValue = pageSettingState.oldParentId;
            oldParentId.value = oldParentIdValue;
            const currentPageDataId = pageSettingState.currentPageData?.id;
            if (currentPageDataId) {
                setChildAndDefaultPage(currentPageDataId).catch(() => {
                    // Error handling
                });
            }
        });

        const currentRoute = computed(() => {
            let route = pageSettingState.currentPageData.route || '';
            let parentId = pageParentId.value;

            while (parentId !== ROOT_ID) {
                const parent = pageSettingState.treeDataMapping[parentId];
                if (!parent) {
                    break;
                }
                const { route: parentRoute, parentId: parentParentId } = parent;
                route = `${parentRoute}/${route}`;
                parentId = parentParentId;
            }
            if (route.startsWith('/')) {
                route = route.slice(1);
            }

            return route;
        });

        // name: display title — route-like chars + spaces, no PascalCase
        const pageRules = {
            name: [
                { required: true, message: t('designer.page.enterPageName') },
                {
                    pattern: new RegExp('^[A-Za-z][\\w\\- ]*$'),
                    message: t('designer.page.pageNameRule')
                },
                {
                    min: 3,
                    max: 50,
                    message: t('designer.page.nameLengthRule')
                }
            ],
            route: [
                {
                    required: true,
                    message: t('designer.page.enterPageRoute')
                },
                {
                    pattern: REGEXP_ROUTE,
                    message: t('designer.page.routeRule')
                }
            ]
        };
        const folderRules = {
            name: [
                { required: true, message: t('designer.page.enterFolderId') },
                {
                    pattern: REGEXP_FOLDER_NAME,
                    message: t('designer.page.folderNameRule')
                },
                { min: 3, max: 25, message: t('designer.page.nameLengthRule') }
            ],
            route: [
                {
                    required: true,
                    message: t('designer.page.enterFolderRoute')
                },
                {
                    pattern: REGEXP_ROUTE,
                    message: t('designer.page.routeRule')
                }
            ],
            group: [
                {
                    required: true,
                    message: t('designer.page.selectPageTypeRequired')
                }
            ]
        };

        const pageToTreeData = page => {
            const { id, name, isPage, children } = page;

            const result = { id: String(id), name, isPage };

            if (Array.isArray(children)) {
                result.children = children
                    .filter(
                        pageItem =>
                            pageItem.id !== pageSettingState.currentPageData.id
                    )
                    .map(pageItem => pageToTreeData(pageItem));
            }

            return result;
        };

        const getNodeIcon = data => {
            if (data.id === ROOT_ID) {
                return null;
            }

            if (data.isPage) {
                return h('svg-icon', { name: 'text-page-common' });
            }

            return h('svg-icon', { name: 'text-page-folder' });
        };

        const treeFolderOp = computed(() => {
            const staticPages =
                pageSettingState.pages[STATIC_PAGE_GROUP_ID]?.data || [];
            const dummyRoot = pageToTreeData({
                children: [
                    { name: t('designer.page.none'), id: ROOT_ID }
                ].concat(staticPages)
            });
            const data = dummyRoot.children;
            const options = {
                data,
                shrinkIcon: null,
                expandIcon: null,
                renderContent: (_h, { node, data: nodeData }) => {
                    return h('div', [
                        getNodeIcon(nodeData),
                        h('div', node.label)
                    ]);
                }
            };

            return options;
        });

        const generalForm = ref(null);

        const validGeneralForm = () => {
            return new Promise(resolve => {
                generalForm.value.validate(valid => {
                    if (valid) {
                        resolve(valid);
                    }
                });
            });
        };

        const changeParentForderId = value => {
            changeTreeData(value.id, oldParentId.value);
            oldParentId.value = value.id;
        };

        return {
            pageRules,
            folderRules,
            pageSettingState,
            pageParentId,
            generalForm,
            validGeneralForm,
            treeFolderOp,
            currentRoute,
            changeParentForderId,
            state,
            changeDefaultPage,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.general-config {
    .general-config-form {
        .input-head {
            color: var(--te-page-manage-input-head-text-color);
        }
        :deep(.tiny-form-item) {
            margin-bottom: 16px;
            .tiny-input-group__prepend {
                border: 1px solid var(--te-page-manage-input-border-color);
                background: var(--te-page-manage-input-bg-color);
            }
            .page-type-radio {
                color: var(--te-page-manage-title-text-color);
            }
            .tiny-form-item__label {
                height: 24px;
                line-height: 18px;
                font-size: 12px;
                color: var(--te-page-manage-text-color);
            }
        }
    }
    .tip {
        color: var(--te-page-manage-tip-color);
        font-size: 12px;
        border-radius: 3px;
        margin-top: 4px;
        width: 100%;
        word-wrap: break-word;
        height: auto;
        line-height: 16px;
        .text {
            color: var(--te-page-manage-tip-text-color);
        }
        .tip-text {
            width: 100%;
            color: var(--te-page-manage-tip-text-color);
        }
        .tip-text-dim {
            color: var(--te-page-manage-tip-dim-text-color);
        }
    }
}
</style>

<style lang="scss">
.tiny-select-dropdown.parent-fold-select-dropdown {
    padding: 8px;
    .tiny-tree {
        .tiny-tree-node {
            .tiny-tree-node__content {
                padding: 0;
                background-color: var(--te-page-manage-tree-node-bg-color);
                &:hover {
                    background-color: var(
                        --te-page-manage-tree-node-bg-color-hover
                    );
                }
                // 移除子节点的的背景色，才能保证鼠标hover到.tiny-tree-node__content节点任意位置时，整行都有hover状态的背景色
                .tiny-tree-node__content-left,
                .tiny-tree-node__content-left .tiny-tree-node__content-box {
                    background-color: unset;
                    &:hover {
                        background-color: unset;
                    }
                }
                .tiny-tree-node__content-left {
                    padding: 0;
                    .tree-node-icon {
                        margin: 0;
                    }
                    .tiny-tree-node__content-box {
                        padding: 0 12px;
                        svg {
                            margin-right: 8px;
                        }
                    }
                    .tiny-tree-node__label {
                        font-size: 12px;
                    }
                }
            }
        }
    }
}
</style>
