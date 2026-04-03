module.exports = {
    '/services': {
        get: {
            tags: ['Services'],
            summary: 'Get all services',
            description: 'Returns all services with staff count. Use `userPanel=true` to filter only services with at least one active staff.',
            parameters: [
                { name: 'userPanel', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Filter services with available staff' }
            ],
            responses: {
                200: { description: 'List of services', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Service' } } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        post: {
            tags: ['Services'],
            summary: 'Create a service (Admin)',
            description: 'Creates a new salon service. Accepts multipart/form-data for image upload.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['name', 'price', 'duration', 'category'],
                            properties: {
                                name: { type: 'string', example: 'Hair Cut & Style' },
                                price: { type: 'number', example: 500 },
                                duration: { type: 'number', example: 45, description: 'Duration in minutes' },
                                category: { type: 'string', example: '664a1b2c3d4e5f6789012345', description: 'Category ObjectId' },
                                image: { type: 'string', format: 'binary', description: 'Service image file' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Service created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/services/{id}': {
        put: {
            tags: ['Services'],
            summary: 'Update a service (Admin)',
            description: 'Updates service details. If a new image is uploaded, the old S3 image is deleted.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Service ObjectId' }],
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Premium Hair Cut' },
                                price: { type: 'number', example: 600 },
                                duration: { type: 'number', example: 60 },
                                category: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
                                image: { type: 'string', format: 'binary' },
                                isActive: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Service updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Service not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        },
        delete: {
            tags: ['Services'],
            summary: 'Delete a service (Admin)',
            description: 'Deletes the service and removes its image from S3.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Service ObjectId' }],
            responses: {
                200: { description: 'Service deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Service and physical masterpiece removed from S3' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Service not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
