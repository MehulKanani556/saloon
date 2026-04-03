module.exports = {
    '/appointments': {
        post: {
            tags: ['Appointments – User'],
            summary: 'Book an appointment',
            description: 'Creates a new appointment. Auto-assigns available staff if no assignment provided. Checks leave conflicts and slot overlaps. Creates client profile if not exists.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['clientName', 'clientPhone', 'services', 'date'],
                            properties: {
                                clientName: { type: 'string', example: 'Jane Smith' },
                                clientEmail: { type: 'string', example: 'jane@example.com' },
                                clientPhone: { type: 'string', example: '+919876543210' },
                                services: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['664a1b2c3d4e5f6789012345'],
                                    description: 'Array of service ObjectIds'
                                },
                                assignments: {
                                    type: 'array',
                                    description: 'Optional – manually assign staff per service. If omitted, auto-assigned.',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            service: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
                                            staff: { type: 'string', example: '664a1b2c3d4e5f6789012346' }
                                        }
                                    }
                                },
                                date: { type: 'string', example: '2026-04-10T10:00:00', description: 'ISO 8601, DD/MM/YYYY, or YYYY-MM-DD format' },
                                status: { type: 'string', enum: ['Pending', 'Confirmed'], example: 'Pending' },
                                paymentStatus: { type: 'string', enum: ['Pending', 'Paid'], example: 'Pending' },
                                paymentIntentId: { type: 'string', example: 'pi_3OxyzStripe', description: 'Stripe PaymentIntent ID – auto-marks payment as Paid' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Appointment created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
                400: { description: 'No available staff / invalid date / no services', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                404: { description: 'Services not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        get: {
            tags: ['Appointments – Admin/Staff'],
            summary: 'Get all appointments (Admin/Staff)',
            description: 'Admin gets all appointments. Staff gets only their own. Also returns approved leaves for calendar view.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Appointments and leaves',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    appointments: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
                                    leaves: { type: 'array', items: { $ref: '#/components/schemas/Leave' } }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/appointments/my': {
        get: {
            tags: ['Appointments – User'],
            summary: 'Get my appointments',
            description: 'Returns the authenticated user\'s appointments sorted by date descending.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'User appointments', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/appointments/occupied-slots': {
        post: {
            tags: ['Appointments – User'],
            summary: 'Get occupied time slots',
            description: 'Returns occupied 30-minute slots for a given date and services. Checks staff availability, leaves, and existing appointments. Slots range from 9:00 AM to 8:00 PM.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['date', 'serviceIds'],
                            properties: {
                                date: { type: 'string', example: '2026-04-10', description: 'Date in YYYY-MM-DD or DD/MM/YYYY format' },
                                serviceIds: {
                                    oneOf: [
                                        { type: 'array', items: { type: 'string' }, example: ['664a1b2c3d4e5f6789012345'] },
                                        { type: 'string', example: '664a1b2c3d4e5f6789012345,664a1b2c3d4e5f6789012346' }
                                    ]
                                },
                                staffIds: {
                                    oneOf: [
                                        { type: 'array', items: { type: 'string' } },
                                        { type: 'string' }
                                    ],
                                    description: 'Optional – filter by specific staff IDs'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Occupied slots list',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    occupiedSlots: { type: 'array', items: { type: 'string', format: 'date-time' }, example: ['2026-04-10T04:30:00.000Z', '2026-04-10T05:00:00.000Z'] },
                                    allOccupied: { type: 'boolean', description: 'True if no qualified staff found' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                400: { description: 'Missing date or serviceIds', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/appointments/{id}': {
        put: {
            tags: ['Appointments – Admin/Staff'],
            summary: 'Update appointment details',
            description: 'Updates appointment client info, services, date, status, and payment status.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Appointment ObjectId' }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                clientName: { type: 'string', example: 'Jane Smith' },
                                clientEmail: { type: 'string', example: 'jane@example.com' },
                                clientPhone: { type: 'string', example: '+919876543210' },
                                services: { type: 'array', items: { type: 'string' }, example: ['664a1b2c3d4e5f6789012345'] },
                                date: { type: 'string', example: '2026-04-15T11:00:00' },
                                status: { type: 'string', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'] },
                                paymentStatus: { type: 'string', enum: ['Pending', 'Paid', 'Refunded', 'Failed'] }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Appointment updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
                400: { description: 'Invalid date', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Appointment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        },
        delete: {
            tags: ['Appointments – Admin/Staff'],
            summary: 'Delete or cancel appointment',
            description: 'Users can only cancel their own Pending appointments (sets status=Cancelled). Admin/Staff physically delete the record.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Appointment ObjectId' }],
            responses: {
                200: { description: 'Appointment deleted/cancelled', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, status: { type: 'string' } } } } } },
                400: { description: 'Cannot cancel non-Pending appointment (User)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Not authorized to cancel this appointment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Appointment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    '/appointments/{id}/status': {
        put: {
            tags: ['Appointments – Admin/Staff'],
            summary: 'Update appointment status',
            description: 'Quick update for status and/or payment status only.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Appointment ObjectId' }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: { type: 'string', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'], example: 'Confirmed' },
                                paymentStatus: { type: 'string', enum: ['Pending', 'Paid', 'Refunded', 'Failed'], example: 'Paid' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Status updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Appointment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
