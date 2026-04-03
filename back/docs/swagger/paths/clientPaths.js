module.exports = {
    '/clients': {
        get: {
            tags: ['Clients'],
            summary: 'Get all clients (Admin/Staff)',
            description: 'Returns all users with role=User, including their booking history.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'List of clients', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        },
        post: {
            tags: ['Clients'],
            summary: 'Create a client (Admin/Staff)',
            description: 'Creates a new client. Validates email and phone uniqueness.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['name', 'email', 'phone'],
                            properties: {
                                name: { type: 'string', example: 'Jane Smith' },
                                email: { type: 'string', example: 'jane@example.com' },
                                phone: { type: 'string', example: '+919876543210' },
                                image: { type: 'string', format: 'binary', description: 'Profile image file' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Client created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                400: { description: 'Email or phone already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/clients/{id}': {
        get: {
            tags: ['Clients'],
            summary: 'Get client by ID (Admin/Staff)',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Client User ObjectId' }],
            responses: {
                200: { description: 'Client details', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Client not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        },
        put: {
            tags: ['Clients'],
            summary: 'Update a client (Admin/Staff)',
            description: 'Updates client details. Validates no email/phone collision with other clients. Deletes old S3 image if replaced.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Client User ObjectId' }],
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Jane Updated' },
                                email: { type: 'string', example: 'jane.updated@example.com' },
                                phone: { type: 'string', example: '+919876543211' },
                                image: { type: 'string', format: 'binary' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Client updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                400: { description: 'Email or phone collision', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Client not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        },
        delete: {
            tags: ['Clients'],
            summary: 'Delete a client (Admin)',
            description: 'Permanently deletes the client and their S3 profile image.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Client User ObjectId' }],
            responses: {
                200: { description: 'Client deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Client record and identity purged from S3' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Client not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
