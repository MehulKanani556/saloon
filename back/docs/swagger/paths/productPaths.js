module.exports = {
    '/products': {
        get: {
            tags: ['Products – Public'],
            summary: 'Get all products',
            description: 'Returns all products sorted by newest first.',
            responses: {
                200: { description: 'List of products', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        post: {
            tags: ['Products – Admin'],
            summary: 'Create a product (Admin)',
            description: 'Creates a new product. Accepts multipart/form-data for image upload.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['name', 'price', 'category', 'description'],
                            properties: {
                                name: { type: 'string', example: 'Argan Oil Shampoo' },
                                price: { type: 'number', example: 799 },
                                category: { type: 'string', enum: ['Skincare', 'Fragrance', 'Haircare', 'Accessories', 'Grooming'], example: 'Haircare' },
                                description: { type: 'string', example: 'Premium argan oil infused shampoo for silky hair' },
                                stock: { type: 'number', example: 50 },
                                image: { type: 'string', format: 'binary', description: 'Product image file' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Product created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
                400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/products/{id}': {
        get: {
            tags: ['Products – Public'],
            summary: 'Get product by ID',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ObjectId' }],
            responses: {
                200: { description: 'Product details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
                404: { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        put: {
            tags: ['Products – Admin'],
            summary: 'Update a product (Admin)',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ObjectId' }],
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Premium Argan Oil Shampoo' },
                                price: { type: 'number', example: 899 },
                                category: { type: 'string', enum: ['Skincare', 'Fragrance', 'Haircare', 'Accessories', 'Grooming'] },
                                description: { type: 'string' },
                                stock: { type: 'number', example: 100 },
                                image: { type: 'string', format: 'binary' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Product updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
                400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        },
        delete: {
            tags: ['Products – Admin'],
            summary: 'Delete a product (Admin)',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ObjectId' }],
            responses: {
                200: { description: 'Product deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Product removed' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    '/products/{id}/reviews': {
        post: {
            tags: ['Products – Public'],
            summary: 'Add or update product review (User)',
            description: 'Creates a new review or updates existing review for the product. Recalculates product rating.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ObjectId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['rating', 'comment'],
                            properties: {
                                rating: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                                comment: { type: 'string', example: 'Great product, highly recommend!' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Review updated', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Review updated' } } } } } },
                201: { description: 'Review added', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Review added' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    }
};
