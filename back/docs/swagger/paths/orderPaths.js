module.exports = {
    '/orders': {
        post: {
            tags: ['Orders – User'],
            summary: 'Create an order',
            description: 'Places a new order. Verifies stock availability and decrements inventory. Sets paymentStatus=Paid if paymentIntentId is provided.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['items', 'totalAmount', 'shippingAddress'],
                            properties: {
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        required: ['_id', 'name', 'price', 'qty'],
                                        properties: {
                                            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345', description: 'Product ObjectId' },
                                            name: { type: 'string', example: 'Argan Oil Shampoo' },
                                            price: { type: 'number', example: 799 },
                                            qty: { type: 'number', example: 2 }
                                        }
                                    }
                                },
                                totalAmount: { type: 'number', example: 1598 },
                                shippingAddress: { $ref: '#/components/schemas/ShippingAddress' },
                                paymentIntentId: { type: 'string', example: 'pi_3OxyzStripe', description: 'Stripe PaymentIntent ID – marks order as Paid' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Order created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
                400: { description: 'No items or insufficient stock', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        get: {
            tags: ['Orders – Admin'],
            summary: 'Get all orders (Admin)',
            description: 'Returns all orders with populated user info, sorted by newest first.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'All orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/orders/my': {
        get: {
            tags: ['Orders – User'],
            summary: 'Get my orders',
            description: 'Returns the authenticated user\'s orders with populated product details.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'User orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/orders/{id}/status': {
        put: {
            tags: ['Orders – Admin'],
            summary: 'Update order status (Admin)',
            description: 'Updates the order status (Processing → Shipped → Delivered → Cancelled).',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ObjectId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['status'],
                            properties: {
                                status: { type: 'string', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], example: 'Shipped' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Order status updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Order not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    '/orders/{id}/cancel': {
        put: {
            tags: ['Orders – User'],
            summary: 'Cancel an order (User)',
            description: 'Cancels a Processing order and restocks all items.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ObjectId' }],
            responses: {
                200: { description: 'Order cancelled', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Acquisition cancelled successfully' }, order: { $ref: '#/components/schemas/Order' } } } } } },
                400: { description: 'Order not in Processing status', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'Order not found or unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
