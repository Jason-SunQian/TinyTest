import { z } from 'zod';
import { usePage } from '@opentiny/tiny-engine-meta-register';

const inputSchema = z.object({});

export const getPageList = {
    name: 'get_page_list',
    label: 'Get Page List',
    order: 8,
    description:
        'Get a page list from the current TinyEngine low-code application. Use this when you need to get a page list from your application.',
    inputSchema: inputSchema.shape,
    callback: async () => {
        const { getPageList: getPageListFn } = usePage();
        const [firstGroup, secondGroup] = await getPageListFn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getPages = (list: any[]) => {
            list.forEach(item => {
                data.push({
                    id: item.id,
                    name: item.name,
                    route: item.route,
                    parentId: item.parentId
                });

                if (item.children) {
                    getPages(item.children);
                }
            });
        };

        getPages([...firstGroup.data, ...secondGroup.data]);

        const res = {
            status: 'success',
            message: `Page list fetched successfully`,
            data
        };

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(res)
                }
            ]
        };
    }
};
