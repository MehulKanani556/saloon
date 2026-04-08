module.exports = {
    '/leaves': {
        post: {
            tags: ['Leaves – Staff'],
            summary: 'Apply for leave (Staff)',
            description: 'Creates a leave request. Requires startDate, endDate, and reason.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['startDate', 'endDate', 'reason'],
                            properties: {
                                startDate: { type: 'string', example: '2026-04-10', description: 'Leave start date' },
                                endDate: { type: 'string', example: '2026-04-12', description: 'Leave end date' },
                                startTime: { type: 'string', example: '09:00', description: 'Optional – partial day start time (HH:MM)' },
                                endTime: { type: 'string', example: '17:00', description: 'Optional – partial day end time (HH:MM)' },
                                totalHours: { type: 'number', example: 24, description: 'Total leave hours (deducted from leaveBalance on approval)' },
                                type: { type: 'string', enum: ['Sick Leave', 'Casual Leave', 'Emergency Leave'], example: 'Casual Leave' },
                                reason: { type: 'string', example: 'Family function' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Leave applied', content: { 'application/json': { schema: { $ref: '#/components/schemas/Leave' } } } },
                400: { description: 'Missing required fields', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Staff only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        get: {
            tags: ['Leaves – Admin'],
            summary: 'Get all leaves (Admin)',
            description: 'Returns all leave requests with populated staff details.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'All leaves', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Leave' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/leaves/my': {
        get: {
            tags: ['Leaves – Staff'],
            summary: 'Get my leave (Staff)',
            description: 'Returns the authenticated staff member\'s leave history sorted by newest first.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'Staff leaves', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Leave' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Staff only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/leaves/{id}': {
        put: {
            tags: ['Leaves – Admin'],
            summary: 'Update leave status (Admin)',
            description: 'Approves or rejects a leave. On approval: checks for appointment conflicts (per-day window logic with startTime/endTime), deducts totalHours from staff leaveBalance.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Leave ObjectId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: { type: 'string', enum: ['Approved', 'Rejected'], example: 'Approved' },
                                adminComment: { type: 'string', example: 'Approved. Enjoy your time off.' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Leave status updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Leave' } } } },
                400: { description: 'Appointment conflicts exist during leave period', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Leave not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
