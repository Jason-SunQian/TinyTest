/**
 * Copyright (c) 2023 - present TinyEngine Authors.
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

/* metaService: engine.service.material.block-compile */
import {
    getMetaApi,
    META_SERVICE,
    useMaterial,
    useResource,
    useCanvas
} from '@opentiny/tiny-engine-meta-register';
import { compile as blockCompiler } from '@opentiny/tiny-engine-block-compiler';
import { utils } from '@opentiny/tiny-engine-utils';

import { getMaterialsBaseFromBundleUrls } from '@/composable/loadRuntimeFromBundles';
import {
    getDesignerMaterialBaseUrl,
    toAbsoluteMaterialUrl
} from '@/utils/designerOrigin';

const { capitalize, camelize } = utils;

const blockVersionMap = new Map();
const blockCompileCache = new Map();

// 获取所有区块分组下的所有区块
const getAllGroupBlocks = async () => {
    const { fetchGroups, fetchGroupBlocksByIds } = getMetaApi(
        'engine.plugins.customMaterials.block'
    );
    const appId = getMetaApi(META_SERVICE.GlobalService).getBaseInfo().id;

    const groups = await fetchGroups(appId);

    const groupIds = groups.map(groupItem => groupItem.id);

    const blocks = await fetchGroupBlocksByIds({ groupIds });

    for (const blockItem of blocks) {
        if (blockItem?.content?.fileName && blockItem?.current_version) {
            blockVersionMap.set(
                blockItem.content.fileName,
                blockItem.current_version
            );
        }
    }
};

export const fetchBlockSchema = blockName =>
    getMetaApi(META_SERVICE.Http).get(
        `/material-center/api/block?label=${blockName}`
    );

// TODO: 待验证
export const updateBlockCompileCache = () => {
    blockVersionMap.clear();
    useCanvas().canvasApi.value?.removeBlockCompsCache();
    blockCompileCache.clear();
};

// 预构建 block
export const getBlockCompileRes = schema => {
    const name = schema.fileName;

    if (blockCompileCache.has(name)) {
        return {
            [name]: blockCompileCache.get(name)
        };
    }

    const generateCodeService = getMetaApi('engine.service.generateCode');
    const { componentsMap } = useResource().appSchemaState;

    // 需要出码的区块
    const sourceCode = generateCodeService.generatePageCode(
        schema,
        componentsMap || [],
        {
            blockRelativePath: './'
        }
    );

    const blocksSourceCode = {
        fileName: schema.fileName,
        sourceCode
    };

    const compiledResult = blockCompiler([blocksSourceCode], {
        compileCache: blockCompileCache
    });

    return compiledResult;
};

/**
 * 从已加载的物料（bundle 组件）中按 component 名解析，返回画布 loadBlockComponent 所需的 { [name]: { blobURL, style } }
 * 主工程/远程 bundle 的组件走此路径，避免 /material-center/api/block 返回空导致「区块 xxx 加载错误」
 * 由 container.initCanvas 对 controller 补丁调用，确保画布无论用哪套 useMaterial 都能从物料解析
 */
export const getBlockFromMaterialStore = (
    name: string
): Record<string, { blobURL: string; style: string }> | null => {
    const tryNames = [name, capitalize(camelize(name))].filter(
        (n, i, a) => a.indexOf(n) === i
    );
    let mat = null;
    for (const n of tryNames) {
        mat = useMaterial().getMaterial(n);
        if (
            mat &&
            (mat.npm?.script ??
                (mat as { content?: { npm?: { script?: string } } })?.content
                    ?.npm?.script)
        )
            break;
    }
    const npm =
        mat?.npm ??
        (mat as { content?: { npm?: { script?: string; css?: string } } })
            ?.content?.npm;
    const script = npm?.script;
    if (!script) {
        /* eslint-disable no-console -- 诊断物料解析 */
        if (console?.warn && tryNames[0]) {
            console.warn(
                '[Materials] getBlockFromMaterialStore 未找到',
                tryNames[0],
                'mat=',
                mat ? '有' : '无',
                'script=',
                script || '无'
            );
        }
        /* eslint-enable no-console */
        return null;
    }
    // 主工程物料（来自 bundle.json）必须从 bundle 的 base（如 3000）加载，绝不能误用 design 的 base（8090）
    const scriptFilename =
        typeof script === 'string' ? script.replace(/^.*\//, '') : '';
    const isMainProjectAsset = /^(mr-|mp-|mr-bank\.css)/.test(scriptFilename);
    const materialsBase =
        useMaterial().getBundleBaseUrlForComponent(name) ??
        getMaterialsBaseFromBundleUrls();
    if (isMainProjectAsset && !materialsBase) {
        /* eslint-disable no-console -- 诊断物料解析 */
        console.warn(
            '[Materials] 主工程物料 base 无法推导（请确保 VITE_MATERIAL_BUNDLE_URLS 包含 HTTP bundle，如 http://localhost:3000/bundle.json）',
            name
        );
        /* eslint-enable no-console */
        return null;
    }
    const base = materialsBase ?? getDesignerMaterialBaseUrl();
    let scriptUrl =
        typeof script === 'string' &&
        (script.startsWith('http://') || script.startsWith('https://'))
            ? script
            : toAbsoluteMaterialUrl(script, base) || script;
    let styleUrl = '';
    const css = npm?.css;
    if (css) {
        styleUrl =
            typeof css === 'string' &&
            (css.startsWith('http://') || css.startsWith('https://'))
                ? css
                : toAbsoluteMaterialUrl(
                      typeof css === 'string' ? css : css[0],
                      base
                  ) || '';
    }
    const cacheBust = useMaterial().getMaterialCacheBustParam();
    if (cacheBust) {
        if (scriptUrl.startsWith('http'))
            scriptUrl += (scriptUrl.includes('?') ? '&' : '?') + cacheBust;
        if (styleUrl.startsWith('http'))
            styleUrl += (styleUrl.includes('?') ? '&' : '?') + cacheBust;
    }
    /* eslint-disable no-console -- 诊断物料解析 */
    if (console?.log) {
        console.log(
            '[Materials] getBlockFromMaterialStore 解析成功',
            name,
            '->',
            scriptUrl
        );
    }
    /* eslint-enable no-console */
    return {
        [name]: { blobURL: scriptUrl, style: styleUrl }
    };
};

// 获取 blockBlob
export const getBlockByName = async name => {
    // 优先从已加载物料（含主工程 bundle）解析，避免 block 接口 404/空 导致「区块 xxx 加载错误」
    const fromStore = getBlockFromMaterialStore(name);
    if (fromStore) return fromStore;

    // version map 为空，获取所有区块的版本记录
    if (blockVersionMap.size === 0) {
        await getAllGroupBlocks();
    }

    // 找到对应区块的 schema
    const block = await fetchBlockSchema(name);
    const blockItem = block?.[0];

    if (!blockItem) {
        return;
    }

    const historyVersion = blockVersionMap.get(name);
    const historySchema = blockItem?.histories?.find?.(
        historyItem => historyItem?.version === historyVersion
    );

    let schemaContent = null;

    // 有指定的历史版本，优先选用历史版本
    if (historyVersion && historySchema?.content) {
        schemaContent = historySchema.content;
    } else {
        schemaContent = blockItem?.content;
    }

    if (!schemaContent) {
        return;
    }

    // 用于选中区块的时候，拿到属性配置，显示在右侧属性面板
    useMaterial().addBlockResources(name, schemaContent);

    return getBlockCompileRes(schemaContent);
};
