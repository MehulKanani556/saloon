module.exports = {
    '/specializations/requests': {
        post: {
            tags: ['Specializations – Staff'],
            summary: 'Create specialization request (Staff)',
            description: 'Submits a request to update services, specializations, and bio. Only one pending request allowed at a time. Notifies admin via socket.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['services'],
                            properties: {
                                services: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['664a1b2c3d4e5f6789012345', '664a1b2c3d4e5f6789012346'],
                                    description: 'Array of Service ObjectIds to add'
                                },
                                specialization: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['Bridal Makeup', 'Hair Coloring'],
                                    description: 'Specialization keywords to add'
                                },
                                bio: { type: 'string', example: 'Certified bridal specialist with 3 years experience' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Request created', content: { 'application/json': { schema: { $ref: '#/components/schemas/SpecializationRequest' } } } },
                400: { description: 'Pending request already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Staff only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/specializations/my-requests': {
        get: {
            tags: ['Specializations – Staff'],
            summary: 'Get my specialization requests (Staff)',
            description: 'Returns the authenticated staff member\'s specialization requests with populated services.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'Staff specialization requests', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/SpecializationRequest' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Staff only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/specializations/all-requests': {
        get: {
            tags: ['Specializations – Admin'],
            summary: 'Get all specialization requests (Admin)',
            description: 'Returns all specialization requests with populated staff (including their current services) and requested services.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'All specialization requests', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/SpecializationRequest' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/specializations/requests/{id}': {
        put: {
            tags: ['Specializations – Admin'],
            summary: 'Update specialization request status (Admin)',
            description: 'Approves or rejects a specialization request. On approval: additively merges valid services and specializations into the staff user (no duplicates), updates bio.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'SpecializationRequest ObjectId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['status'],
                            properties: {
                                status: { type: 'string', enum: ['Approved', 'Rejected'], example: 'Approved' },
                                adminReason: { type: 'string', example: 'Approved after portfolio review' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Request status updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/SpecializationRequest' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Request not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    }
};
