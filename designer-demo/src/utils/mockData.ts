/**
 * Mock 数据工具函数
 * 用于在 VSCode 环境中从 mock 文件中获取数据
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MockMethod } from 'vite-plugin-mock';

// 动态导入 mock 文件
let appCenterMock: MockMethod[] | null = null;
let platformCenterMock: MockMethod[] | null = null;

// 静态资源文件缓存
const staticFileCache = new Map<string, any>();

/**
 * 加载 mock 数据
 */
const loadMockData = async () => {
    if (!appCenterMock) {
        const appCenterModule = await import('../../mock/app-center');
        appCenterMock = appCenterModule.default;
    }
    if (!platformCenterMock) {
        const platformCenterModule = await import('../../mock/platform-center');
        platformCenterMock = platformCenterModule.default;
    }
};

/**
 * 将 URL 路径模式转换为正则表达式
 * 例如: '/app-center/api/pages/detail/:id' -> /^\/app-center\/api\/pages\/detail\/([^/]+)$/
 */
const patternToRegex = (pattern: string): RegExp => {
    // 将路径参数 :param 转换为正则表达式 ([^/]+)
    const regexPattern = pattern
        .replace(/:[^/]+/g, '([^/]+)')
        .replace(/\//g, '\\/');
    return new RegExp(`^${regexPattern}$`);
};

/**
 * 从 URL 中提取路径参数
 * 例如: pattern='/app-center/api/pages/detail/:id', url='/app-center/api/pages/detail/123'
 * 返回: { id: '123' }
 */
const extractParams = (
    pattern: string,
    url: string
): Record<string, string> => {
    const regex = patternToRegex(pattern);
    const match = url.match(regex);
    if (!match) {
        return {};
    }

    // 提取参数名
    const paramNames = pattern.match(/:[^/]+/g) || [];
    const params: Record<string, string> = {};

    paramNames.forEach((param, index) => {
        // 去掉 ':'
        const paramName = param.slice(1);
        params[paramName] = match[index + 1] || '';
    });

    return params;
};

/**
 * 匹配 URL 和 method，返回对应的 mock 配置
 */
const findMockConfig = (
    url: string,
    method: string,
    mockData: MockMethod[]
): MockMethod | null => {
    const normalizedMethod = method.toLowerCase();

    for (const mock of mockData) {
        const mockMethod = (mock.method || 'get').toLowerCase();
        if (mockMethod !== normalizedMethod) {
            continue;
        }

        const mockUrl = mock.url || '';

        // 如果是精确匹配
        if (mockUrl === url) {
            return mock;
        }

        // 如果是路径参数模式（包含 :）
        if (mockUrl.includes(':')) {
            const regex = patternToRegex(mockUrl);
            if (regex.test(url)) {
                return mock;
            }
        }
    }

    return null;
};

/**
 * 读取静态资源文件（如 bundle.json）
 * 注意：在 VSCode webview 环境中，由于 CSP 限制，不能使用 fetch
 * 因此静态资源应该通过插件读取，而不是在这里直接读取
 * 这个方法保留用于非 VSCode 环境（如浏览器直接访问）
 * @param url 文件路径（如 /mock/bundle.json）
 * @returns Promise<{ data: any, locale?: string } | null>
 */
const loadStaticFile = async (
    url: string
): Promise<{ data: any; locale?: string } | null> => {
    try {
        // 检查是否在 VSCode 环境
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isVSCodeEnv = (window as any).vscode || (window as any).vscodeBridge;
        
        if (isVSCodeEnv) {
            // 在 VSCode 环境中，静态资源应该通过插件读取
            // 不应该在这里使用 fetch（会违反 CSP）
            // eslint-disable-next-line no-console
            console.warn(
                `[Mock Data] ⚠️ 在 VSCode 环境中，静态资源 ${url} 应该通过插件读取，而不是直接 fetch`
            );
            return null;
        }

        // 检查缓存
        if (staticFileCache.has(url)) {
            const cached = staticFileCache.get(url);
            // eslint-disable-next-line no-console
            console.log(`[Mock Data] 📄 从缓存加载静态文件: ${url}`);
            return {
                data: cached,
                locale: 'zh-cn'
            };
        }

        // 在非 VSCode 环境中，使用 fetch 读取静态文件
        const response = await fetch(url);

        if (!response.ok) {
            // eslint-disable-next-line no-console
            console.warn(
                `[Mock Data] ⚠️ 无法加载静态文件: ${url}, 状态码: ${response.status}`
            );
            return null;
        }

        const fileData = await response.json();

        // 缓存文件内容
        staticFileCache.set(url, fileData);

        // eslint-disable-next-line no-console
        console.log(`[Mock Data] ✅ 成功加载静态文件: ${url}`);

        // 确保返回格式为 { data: any, locale?: string }
        // bundle.json 的格式可能是 { data: {...} } 或直接是对象
        if (fileData && typeof fileData === 'object' && 'data' in fileData) {
            return {
                data: fileData.data,
                locale: 'zh-cn'
            };
        }

        // 如果文件内容本身就是数据，直接返回
        return {
            data: fileData,
            locale: 'zh-cn'
        };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`[Mock Data] ❌ 加载静态文件失败: ${url}`, error);
        return null;
    }
};

/**
 * 根据 URL 和 method 获取 mock 数据
 * @param url 请求 URL
 * @param method 请求方法
 * @param params URL 查询参数
 * @param data 请求体数据
 * @returns Promise<{ data: any, locale?: string }>
 */
export const getMockData = async (
    url: string,
    method = 'get',
    params?: any,
    data?: any
): Promise<{ data: any; locale?: string } | null> => {
    try {
        // 继续从 mock 配置中查找
        await loadMockData();

        // 合并所有 mock 数据
        const allMocks = [
            ...(appCenterMock || []),
            ...(platformCenterMock || [])
        ];

        // 查找匹配的 mock 配置
        const mockConfig = findMockConfig(url, method, allMocks);
        if (!mockConfig?.response) {
            return null;
        }

        // 提取路径参数
        const pathParams = mockConfig.url
            ? extractParams(mockConfig.url, url)
            : {};

        // 构建查询参数对象（合并 URL 参数和路径参数）
        const query = {
            ...pathParams,
            ...params
        };

        // 执行 response 函数
        const response = mockConfig.response({ query, body: data });

        // 如果 response 是 Promise，等待它
        const result = response instanceof Promise ? await response : response;

        // 确保返回格式为 { data: any, locale?: string }
        if (result && typeof result === 'object' && 'data' in result) {
            return result as { data: any; locale?: string };
        }

        // 如果返回的不是标准格式，包装一下
        return {
            data: result,
            locale: 'zh-cn'
        };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Mock Data] Error getting mock data:', error);
        return null;
    }
};
