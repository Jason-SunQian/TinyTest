/**
 * Mock 数据工具函数
 * 用于在 VSCode 环境中从 mock 文件中获取数据
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MockMethod } from 'vite-plugin-mock';

// 动态导入 mock 文件
let appCenterMock: MockMethod[] | null = null;
let platformCenterMock: MockMethod[] | null = null;

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
