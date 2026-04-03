module.exports = {
    '/staff': {
        get: {
            tags: ['Staff'],
            summary: 'Get all staff members',
            description: 'Returns all staff users with their populated services.',
            responses: {
                200: { description: 'List of staff', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        post: {
            tags: ['Staff'],
            summary: 'Create a staff member (Admin)',
            description: 'Creates a new staff user. Accepts multipart/form-data for profile image. Services can be passed as comma-separated string or array.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['name', 'email'],
                            properties: {
                                name: { type: 'string', example: 'Priya Sharma' },
                                email: { type: 'string', example: 'priya@salon.com' },
                                phone: { type: 'string', example: '+919876543210' },
                                services: { type: 'string', example: '664a1b2c3d4e5f6789012345,664a1b2c3d4e5f6789012346', description: 'Comma-separated service ObjectIds' },
                                image: { type: 'string', format: 'binary', description: 'Profile image file' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Staff created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                400: { description: 'Email/ID conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/staff/{id}': {
        put: {
            tags: ['Staff'],
            summary: 'Update a staff member (Admin)',
            description: 'Updates staff details. Validates that all provided service IDs exist in the database.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Staff User ObjectId' }],
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Priya Sharma Updated' },
                                email: { type: 'string', example: 'priya.updated@salon.com' },
                                phone: { type: 'string', example: '+919876543211' },
                                services: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
                                image: { type: 'string', format: 'binary' },
                                isActive: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Staff updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                400: { description: 'Invalid service ID or email conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Staff not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        },
        delete: {
            tags: ['Staff'],
            summary: 'Delete a staff member (Admin)',
            description: 'Deletes the staff user and removes their profile image from S3.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Staff User ObjectId' }],
            responses: {
                200: { description: 'Staff deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Staff removed and image purged from S3' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Staff not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
