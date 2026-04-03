module.exports = {
    // ─── CATEGORIES ──────────────────────────────────────────────────────────────
    '/categories': {
        get: {
            tags: ['Categories'],
            summary: 'Get all categories',
            description: 'Returns all categories including inactive ones.',
            responses: {
                200: { description: 'List of categories', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        post: {
            tags: ['Categories'],
            summary: 'Create a category (Admin)',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name'],
                            properties: {
                                name: { type: 'string', example: 'Hair Care' },
                                description: { type: 'string', example: 'All hair related services' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Category created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                400: { description: 'Category already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/categories/{id}': {
        put: {
            tags: ['Categories'],
            summary: 'Update a category (Admin)',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Category ObjectId' }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Premium Hair Care' },
                                description: { type: 'string', example: 'Updated description' },
                                isActive: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Category updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Category not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        },
        delete: {
            tags: ['Categories'],
            summary: 'Delete a category (Admin)',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Category ObjectId' }],
            responses: {
                200: { description: 'Category deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Category Purged' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Category not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    // ─── SETTINGS ────────────────────────────────────────────────────────────────
    '/settings': {
        get: {
            tags: ['Settings'],
            summary: 'Get salon settings',
            description: 'Returns salon settings. Creates default settings if none exist.',
            responses: {
                200: { description: 'Salon settings', content: { 'application/json': { schema: { $ref: '#/components/schemas/Setting' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        put: {
            tags: ['Settings'],
            summary: 'Update salon settings (Admin)',
            security: [{ BearerAuth: [] }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                salonName: { type: 'string', example: 'Glow & Elegance Premium Saloon' },
                                tagline: { type: 'string', example: 'Crafting Your Perfect Style' },
                                email: { type: 'string', example: 'contact@glowelegance.com' },
                                phone: { type: 'string', example: '+91 98765 43210' },
                                address: { type: 'string', example: '123, Luxury Lane, Mumbai' },
                                logo: { type: 'string', example: 'https://s3.amazonaws.com/bucket/logo.png' },
                                businessHours: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/BusinessHour' },
                                    example: [
                                        { day: 'Monday - Friday', open: '09:00', close: '20:00', isOpen: true },
                                        { day: 'Saturday', open: '09:00', close: '18:00', isOpen: true },
                                        { day: 'Sunday', open: '00:00', close: '00:00', isOpen: false }
                                    ]
                                },
                                paymentMethods: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/PaymentMethod' },
                                    example: [{ name: 'UPI / GPay / PhonePe', isActive: true }, { name: 'Cash on Venue', isActive: true }]
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Settings updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Setting' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    // ─── DASHBOARD ───────────────────────────────────────────────────────────────
    '/dashboard': {
        get: {
            tags: ['Dashboard'],
            summary: 'Get dashboard insights (Admin/Staff)',
            description: 'Returns comprehensive dashboard data. Staff sees only their own data. Admin sees all.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Dashboard data',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    stats: {
                                        type: 'object',
                                        properties: {
                                            totalClients: { type: 'number', example: 150 },
                                            totalAppointments: { type: 'number', example: 320 },
                                            totalRevenue: { type: 'number', example: 125000 },
                                            todayRevenue: { type: 'number', example: 4500 },
                                            activeServices: { type: 'number', example: 12 },
                                            pendingLeaves: { type: 'number', example: 3 }
                                        }
                                    },
                                    financialVelocity: { type: 'array', items: { type: 'object', properties: { name: { type: 'string', example: 'Mon' }, revenue: { type: 'number', example: 8500 } } } },
                                    serviceHierarchy: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, value: { type: 'number' }, color: { type: 'string' } } } },
                                    recentBookings: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
                                    occupancyTrends: { type: 'array', items: { type: 'object', properties: { hour: { type: 'string', example: '10:00' }, intensity: { type: 'number', example: 5 } } } },
                                    upcomingRituals: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
                                    eliteTalent: { type: 'array', items: { $ref: '#/components/schemas/User' } }
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

    // ─── SALES ───────────────────────────────────────────────────────────────────
    '/sales/matrix': {
        get: {
            tags: ['Sales'],
            summary: 'Get financial matrix (Admin)',
            description: 'Returns total revenue, daily average, month-over-month growth, category breakdown, and last 7 days chart data.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Financial matrix',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    totalRevenue: { type: 'number', example: 125000 },
                                    dailyAvg: { type: 'number', example: 4166.67 },
                                    growth: { type: 'number', example: 12.5, description: 'Month-over-month growth percentage' },
                                    categoryData: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, value: { type: 'number' }, count: { type: 'number' }, color: { type: 'string' } } } },
                                    chartData: { type: 'array', items: { type: 'object', properties: { name: { type: 'string', example: 'Mon' }, revenue: { type: 'number', example: 8500 } } } }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/sales/withdraw': {
        post: {
            tags: ['Sales'],
            summary: 'Process withdrawal request (Admin)',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['amount', 'bankAccount'],
                            properties: {
                                amount: { type: 'number', example: 50000 },
                                bankAccount: { type: 'string', example: '1234567890', description: 'Bank account number (last 4 digits shown in response)' },
                                notes: { type: 'string', example: 'Monthly withdrawal' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Withdrawal request received',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Withdrawal request received' },
                                    reference: { type: 'string', example: 'WD-K3X9P2' },
                                    amount: { type: 'number', example: 50000 },
                                    bankAccount: { type: 'string', example: '****7890' },
                                    notes: { type: 'string', example: 'Monthly withdrawal' }
                                }
                            }
                        }
                    }
                },
                400: { description: 'Amount and bank account required', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    // ─── REPORTS ─────────────────────────────────────────────────────────────────
    '/reports/intel': {
        get: {
            tags: ['Reports'],
            summary: 'Get business intelligence report (Admin)',
            description: 'Returns stats, monthly breakdown (last 6 months), and recent activity logs. Optionally filter by date range.',
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: 'startDate', in: 'query', schema: { type: 'string', example: '2026-01-01' }, description: 'Filter start date (YYYY-MM-DD)' },
                { name: 'endDate', in: 'query', schema: { type: 'string', example: '2026-04-03' }, description: 'Filter end date (YYYY-MM-DD)' }
            ],
            responses: {
                200: {
                    description: 'Report data',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    stats: { type: 'object', properties: { active: { type: 'number' }, downloads: { type: 'number' }, shared: { type: 'number' }, archiveSize: { type: 'string', example: '125.0 K' } } },
                                    summary: { type: 'object', properties: { totalRevenue: { type: 'number' }, totalAppointments: { type: 'number' }, totalClients: { type: 'number' }, activeServices: { type: 'number' }, totalStaff: { type: 'number' } } },
                                    monthlyData: { type: 'array', items: { type: 'object', properties: { name: { type: 'string', example: 'Jan' }, revenue: { type: 'number' }, appointments: { type: 'number' } } } },
                                    recentLogs: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, type: { type: 'string', enum: ['completed', 'cancelled', 'scheduled'] }, title: { type: 'string' }, description: { type: 'string' }, amount: { type: 'number' }, status: { type: 'string' }, paymentStatus: { type: 'string' }, date: { type: 'string', format: 'date-time' } } } }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden – Admin only', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    // ─── INVOICES ────────────────────────────────────────────────────────────────
    '/invoices/export-pdf/{id}': {
        get: {
            tags: ['Invoices'],
            summary: 'Generate PDF invoice (Admin/Staff)',
            description: 'Generates and streams a styled PDF invoice for an appointment. Returns as a downloadable attachment.',
            security: [{ BearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Appointment ObjectId' }],
            responses: {
                200: { description: 'PDF file stream', content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } },
                404: { description: 'Appointment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'PDF generation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    // ─── PAYMENT ─────────────────────────────────────────────────────────────────
    '/payment/create-payment-intent': {
        post: {
            tags: ['Payment'],
            summary: 'Create Stripe payment intent',
            description: 'Creates a Stripe PaymentIntent and returns the clientSecret for frontend payment confirmation.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['amount'],
                            properties: {
                                amount: { type: 'number', example: 1200, description: 'Amount in your currency unit (converted to cents internally)' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Payment intent created', content: { 'application/json': { schema: { type: 'object', properties: { clientSecret: { type: 'string', example: 'pi_3Oxyz_secret_abc123' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                500: { description: 'Stripe error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    // ─── WEBHOOK ─────────────────────────────────────────────────────────────────
    '/webhooks/stripe': {
        post: {
            tags: ['Payment'],
            summary: 'Stripe webhook handler',
            description: 'Handles Stripe webhook events. Requires raw body (not JSON parsed). Verifies Stripe signature. Updates Order and Appointment payment status on payment_intent.succeeded/failed/canceled.',
            parameters: [{ name: 'stripe-signature', in: 'header', required: true, schema: { type: 'string' }, description: 'Stripe webhook signature for verification' }],
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { type: 'object', description: 'Raw Stripe event payload' } } }
            },
            responses: {
                200: { description: 'Webhook received', content: { 'application/json': { schema: { type: 'object', properties: { received: { type: 'boolean', example: true } } } } } },
                400: { description: 'Invalid signature', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } }
            }
        }
    },

    // ─── REVIEWS ─────────────────────────────────────────────────────────────────
    '/reviews': {
        post: {
            tags: ['Reviews'],
            summary: 'Create a review (User)',
            description: 'Creates a review for a Service, Staff member, or Product.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['target', 'targetType', 'rating', 'comment'],
                            properties: {
                                target: { type: 'string', example: '664a1b2c3d4e5f6789012345', description: 'ObjectId of the Service, Staff, or Product being reviewed' },
                                targetType: { type: 'string', enum: ['Service', 'Staff', 'Product'], example: 'Service' },
                                rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                                comment: { type: 'string', example: 'Excellent service, highly recommend!' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Review created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/reviews/{targetId}': {
        get: {
            tags: ['Reviews'],
            summary: 'Get reviews for a target',
            description: 'Returns all reviews for a given Service, Staff, or Product ID.',
            parameters: [{ name: 'targetId', in: 'path', required: true, schema: { type: 'string' }, description: 'ObjectId of the Service, Staff, or Product' }],
            responses: {
                200: { description: 'Reviews list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    // ─── CART ────────────────────────────────────────────────────────────────────
    '/cart': {
        get: {
            tags: ['Cart'],
            summary: 'Get user cart',
            description: 'Returns the authenticated user\'s cart with populated product details.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'Cart items', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    '/cart/sync': {
        post: {
            tags: ['Cart'],
            summary: 'Sync cart to database',
            description: 'Persists the local cart state to the database. Replaces existing cart.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['cartItems'],
                            properties: {
                                cartItems: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345', description: 'Product ObjectId' },
                                            qty: { type: 'number', example: 2 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cart synced', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Cart synchronized with cloud storage' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    // ─── WISHLIST ────────────────────────────────────────────────────────────────
    '/wishlist': {
        get: {
            tags: ['Wishlist'],
            summary: 'Get user wishlist',
            description: 'Returns the authenticated user\'s wishlist with populated product details.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'Wishlist items', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    '/wishlist/sync': {
        post: {
            tags: ['Wishlist'],
            summary: 'Sync wishlist to database',
            description: 'Persists the local wishlist state to the database. Replaces existing wishlist.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['wishlistItems'],
                            properties: {
                                wishlistItems: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345', description: 'Product ObjectId' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Wishlist synced', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Wishlist synchronized with cloud storage' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
