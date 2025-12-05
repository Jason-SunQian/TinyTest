<!-- eslint-disable vue/max-lines-per-block, vue/html-comment-content-newline, vue/html-comment-indent, vue/html-self-closing, vue/attributes-order, vue/html-closing-bracket-newline, vue/no-bare-strings-in-template -->
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
            <!-- 暂时隐藏页面类型选择 -->
            <!-- <tiny-form-item v-if="!isFolder" prop="group" :label="t('designer.page.pageType')" class="form-item-page-type">
        <tiny-radio v-model="pageSettingState.currentPageData.group" class="page-type-radio" label="staticPages">
          {{ t('designer.page.staticPages') }}
        </tiny-radio>
        <tiny-radio v-model="pageSettingState.currentPageData.group" class="page-type-radio" label="publicPages">
          {{ t('designer.page.publicPages') }}
        </tiny-radio>
      </tiny-form-item> -->
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
                ></tiny-input>
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
                ></tiny-select>
            </tiny-form-item>

            <tiny-form-item :label="t('designer.page.pageRoute')" prop="route">
                <tiny-input
                    v-model="pageSettingState.currentPageData.route"
                    :placeholder="t('designer.page.enterRoute')"
                >
                </tiny-input>
                <div class="tip">
                    <span
                        class="text"
                        v-if="!pageSettingState.currentPageData.route"
                        >{{ t('designer.page.routeStartsWith') }}</span
                    >
                    <span class="route-text" v-else>
                        <span class="tip-text">website.com/</span>
                        <span class="tip-text-dim">{{ currentRoute }}</span>
                    </span>
                </div>
            </tiny-form-item>
            <tiny-form-item
                :label="t('designer.page.pageService')"
                prop="serviceName"
            >
                <tiny-input
                    v-model="pageSettingState.currentPageData.serviceName"
                    :placeholder="t('designer.page.enterService')"
                >
                </tiny-input>
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
                ></tiny-select>
                <div v-if="state.defaultPageId" class="tip">
                    <div class="tip-text">
                        {{ t('designer.page.accessRoute') }}
                    </div>
                    <span class="tip-text-dim">/{{ currentRoute }}</span>
                    <div class="tip-text">
                        {{ t('designer.page.defaultRedirectTo') }}
                    </div>
                    <span class="tip-text-dim"
                        >/{{ currentRoute }}/{{
                            pageSettingState?.defaultPage?.route
                        }}</span
                    >
                </div>
            </tiny-form-item>
        </tiny-form>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block, vue/block-lang -->
<script lang="tsx">
/* metaService: engine.plugins.appmanage.PageGeneral */
import { ref, computed, watchEffect, reactive, h } from 'vue';
import { Form, FormItem, Input, Select } from '@opentiny/vue';
import { iconFile } from '@opentiny/vue-icon';
import { usePage } from '@opentiny/tiny-engine-meta-register';
import {
    REGEXP_PAGE_NAME,
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
        TinySelect: Select
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

        // eslint-disable-next-line vue/no-ref-object-reactivity-loss
        const oldParentId = ref(pageParentId.value);
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
                let defaultPageValue = null;
                if (defaultPage) {
                    defaultPageValue = defaultPage;
                }
                pageSettingState.defaultPage = defaultPageValue;
                let defaultPageIdValue = '';
                if (defaultPage) {
                    defaultPageIdValue = defaultPage.id as string;
                }
                state.defaultPageId = defaultPageIdValue;
                state.childPageOp = state.childPageList.map(item => {
                    return {
                        value: item.id,
                        label: item.name,
                        icon: iconFile()
                    };
                });
            }
        };

        const changeDefaultPage = () => {
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            const foundPage = state.childPageList.find(
                item => item.id === state.defaultPageId
            );
            const foundPageValue = foundPage;
            pageSettingState.defaultPage = foundPageValue;
        };

        watchEffect(() => {
            oldParentId.value = pageSettingState.oldParentId;
            const pageId = pageSettingState.currentPageData?.id;
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            setChildAndDefaultPage(pageId);
        });

        const currentRoute = computed(() => {
            const { route: pageRoute } = pageSettingState.currentPageData;
            let route = pageRoute || '';
            let currentParentId = pageParentId.value;

            while (currentParentId !== ROOT_ID) {
                const parent =
                    pageSettingState.treeDataMapping[currentParentId];
                if (!parent) {
                    break;
                }
                route = `${parent.route}/${route}`;
                const { parentId: nextParentId } = parent;
                currentParentId = nextParentId;
            }
            if (route.startsWith('/')) {
                route = route.slice(1);
            }

            return route;
        });

        // 新建页面/更新页面校验规则
        const pageRules = {
            name: [
                { required: true, message: t('designer.page.enterPageId') },
                {
                    pattern: REGEXP_PAGE_NAME,
                    message: t('designer.page.pageNameRule')
                },
                {
                    min: 3,
                    max: 25,
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

        const pageToTreeData = (pageItem: {
            id: string | number;
            name: string;
            isPage?: boolean;
            children?: unknown[];
        }) => {
            const { id, name, isPage, children: pageChildren } = pageItem;

            const result = { id: String(id), name, isPage };

            if (Array.isArray(pageChildren)) {
                result.children = pageChildren
                    .filter(
                        (pageItem2: { id: string | number }) =>
                            pageItem2.id !== pageSettingState.currentPageData.id
                    )
                    .map(
                        (pageItem3: {
                            id: string | number;
                            name: string;
                            isPage?: boolean;
                            children?: unknown[];
                        }) => pageToTreeData(pageItem3)
                    );
            }

            return result;
        };

        const getNodeIcon = (data: { id: string; isPage?: boolean }) => {
            if (data.id === ROOT_ID) {
                return null;
            }

            if (data.isPage) {
                // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                return h('svg-icon', { name: 'text-page-common' });
            }

            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
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
            const treeData = dummyRoot.children;
            const options = {
                data: treeData,
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
