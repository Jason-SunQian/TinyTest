import { z } from 'zod';
import { useMaterial } from '@opentiny/tiny-engine-meta-register';

const inputSchema = z.object({});

export const getComponentList = {
    name: 'get_component_list',
    description:
        'Get all components that can be dragged to the canvas in the current low-code platform application.',
    inputSchema: inputSchema.shape,
    callback: async () => {
        const { getComponentList: getComponentListFn } = useMaterial();
        const list = await getComponentListFn();
        const res = {
            status: 'success',
            message: `Component list retrieved successfully`,
            data: list || []
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
