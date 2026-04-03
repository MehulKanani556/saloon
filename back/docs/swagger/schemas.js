module.exports = {
    // ─── AUTH / USER ────────────────────────────────────────────────────────────
    User: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '+919876543210' },
            role: { type: 'string', enum: ['Admin', 'Staff', 'User'], example: 'User' },
            customId: { type: 'string', example: 'CLI-JOHN-4321' },
            profileImage: { type: 'string', example: 'https://s3.amazonaws.com/bucket/profile.jpg' },
            isActive: { type: 'boolean', example: true },
            isDeleted: { type: 'boolean', example: false },
            leaveBalance: { type: 'number', example: 24 },
            services: { type: 'array', items: { $ref: '#/components/schemas/Service' } },
            specialization: { type: 'array', items: { type: 'string' }, example: ['Hair Coloring', 'Bridal'] },
            bio: { type: 'string', example: 'Expert stylist with 5 years experience' },
            salonInfo: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Luxury Saloon' },
                    logo: { type: 'string' },
                    contact: { type: 'string' },
                    workingHours: { type: 'string' }
                }
            },
            hasPassword: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    AuthResponse: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', example: 'User' },
            phone: { type: 'string', example: '+919876543210' },
            customId: { type: 'string', example: 'CLI-JOHN-4321' },
            profileImage: { type: 'string' },
            leaveBalance: { type: 'number', example: 24 },
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            hasPassword: { type: 'boolean', example: true }
        }
    },

    // ─── CATEGORY ────────────────────────────────────────────────────────────────
    Category: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Hair Care' },
            description: { type: 'string', example: 'All hair related services' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── SERVICE ─────────────────────────────────────────────────────────────────
    Service: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Hair Cut & Style' },
            price: { type: 'number', example: 500 },
            duration: { type: 'number', example: 45, description: 'Duration in minutes' },
            category: { $ref: '#/components/schemas/Category' },
            image: { type: 'string', example: 'https://s3.amazonaws.com/bucket/service.jpg' },
            isActive: { type: 'boolean', example: true },
            staffCount: { type: 'number', example: 3, description: 'Number of active staff offering this service' },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── APPOINTMENT ─────────────────────────────────────────────────────────────
    Assignment: {
        type: 'object',
        properties: {
            service: { $ref: '#/components/schemas/Service' },
            staff: { $ref: '#/components/schemas/User' }
        }
    },
    Appointment: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            appointmentId: { type: 'string', example: 'APT-030426-7823' },
            client: { $ref: '#/components/schemas/User' },
            assignments: { type: 'array', items: { $ref: '#/components/schemas/Assignment' } },
            appointmentDate: { type: 'string', format: 'date-time', example: '2026-04-10T10:00:00.000Z' },
            status: { type: 'string', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'], example: 'Pending' },
            paymentStatus: { type: 'string', enum: ['Pending', 'Paid', 'Refunded', 'Failed'], example: 'Pending' },
            paymentIntentId: { type: 'string', example: 'pi_3OxyzStripe' },
            totalPrice: { type: 'number', example: 1200 },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── PRODUCT ─────────────────────────────────────────────────────────────────
    ProductReview: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            user: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Jane Doe' },
            rating: { type: 'number', example: 4 },
            comment: { type: 'string', example: 'Great product!' },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },
    Product: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Argan Oil Shampoo' },
            price: { type: 'number', example: 799 },
            category: { type: 'string', enum: ['Skincare', 'Fragrance', 'Haircare', 'Accessories', 'Grooming'], example: 'Haircare' },
            description: { type: 'string', example: 'Premium argan oil infused shampoo' },
            image: { type: 'string', example: 'https://s3.amazonaws.com/bucket/product.jpg' },
            stock: { type: 'number', example: 50 },
            isFeatured: { type: 'boolean', example: false },
            reviews: { type: 'array', items: { $ref: '#/components/schemas/ProductReview' } },
            rating: { type: 'number', example: 4.5 },
            numReviews: { type: 'number', example: 12 },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── ORDER ───────────────────────────────────────────────────────────────────
    OrderItem: {
        type: 'object',
        properties: {
            product: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Argan Oil Shampoo' },
            price: { type: 'number', example: 799 },
            qty: { type: 'number', example: 2 }
        }
    },
    ShippingAddress: {
        type: 'object',
        properties: {
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '+919876543210' },
            address: { type: 'string', example: '123 Main Street' },
            city: { type: 'string', example: 'Mumbai' },
            zipCode: { type: 'string', example: '400001' },
            country: { type: 'string', example: 'India' }
        }
    },
    Order: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            orderId: { type: 'string', example: 'ORD-4521-ABCD' },
            user: { $ref: '#/components/schemas/User' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            totalAmount: { type: 'number', example: 1598 },
            shippingAddress: { $ref: '#/components/schemas/ShippingAddress' },
            paymentStatus: { type: 'string', enum: ['Pending', 'Paid', 'Failed'], example: 'Paid' },
            status: { type: 'string', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], example: 'Processing' },
            paymentIntentId: { type: 'string', example: 'pi_3OxyzStripe' },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── LEAVE ───────────────────────────────────────────────────────────────────
    Leave: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            staff: { $ref: '#/components/schemas/User' },
            startDate: { type: 'string', format: 'date-time', example: '2026-04-10T00:00:00.000Z' },
            endDate: { type: 'string', format: 'date-time', example: '2026-04-12T00:00:00.000Z' },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '17:00' },
            totalHours: { type: 'number', example: 24 },
            type: { type: 'string', enum: ['Sick Leave', 'Casual Leave', 'Emergency Leave'], example: 'Casual Leave' },
            reason: { type: 'string', example: 'Family function' },
            status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'], example: 'Pending' },
            adminComment: { type: 'string', example: 'Approved. Enjoy your time off.' },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── SPECIALIZATION REQUEST ───────────────────────────────────────────────────
    SpecializationRequest: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            staff: { $ref: '#/components/schemas/User' },
            services: { type: 'array', items: { $ref: '#/components/schemas/Service' } },
            specialization: { type: 'array', items: { type: 'string' }, example: ['Bridal Makeup', 'Hair Coloring'] },
            bio: { type: 'string', example: 'Certified bridal specialist with 3 years experience' },
            status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'], example: 'Pending' },
            adminReason: { type: 'string', example: 'Approved after portfolio review' },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── REVIEW ──────────────────────────────────────────────────────────────────
    Review: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            user: { $ref: '#/components/schemas/User' },
            target: { type: 'string', example: '664a1b2c3d4e5f6789012345', description: 'ObjectId of Service, Staff, or Product' },
            targetType: { type: 'string', enum: ['Service', 'Staff', 'Product'], example: 'Service' },
            rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Excellent service, highly recommend!' },
            isApproved: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── SETTINGS ────────────────────────────────────────────────────────────────
    BusinessHour: {
        type: 'object',
        properties: {
            day: { type: 'string', example: 'Monday - Friday' },
            open: { type: 'string', example: '09:00' },
            close: { type: 'string', example: '20:00' },
            isOpen: { type: 'boolean', example: true }
        }
    },
    PaymentMethod: {
        type: 'object',
        properties: {
            name: { type: 'string', example: 'UPI / GPay / PhonePe' },
            isActive: { type: 'boolean', example: true }
        }
    },
    Setting: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            salonName: { type: 'string', example: 'Glow & Elegance Premium Saloon' },
            tagline: { type: 'string', example: 'Crafting Your Perfect Style' },
            email: { type: 'string', example: 'contact@glowelegance.com' },
            phone: { type: 'string', example: '+91 98765 43210' },
            address: { type: 'string', example: '123, Luxury Lane, Diamond District, Mumbai - 400001' },
            logo: { type: 'string' },
            businessHours: { type: 'array', items: { $ref: '#/components/schemas/BusinessHour' } },
            paymentMethods: { type: 'array', items: { $ref: '#/components/schemas/PaymentMethod' } },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },

    // ─── CART ────────────────────────────────────────────────────────────────────
    CartItem: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Argan Oil Shampoo' },
            price: { type: 'number', example: 799 },
            image: { type: 'string' },
            qty: { type: 'number', example: 2 }
        }
    },

    // ─── ERRORS ──────────────────────────────────────────────────────────────────
    Error400: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Bad request – missing or invalid fields' }
        }
    },
    Error401: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Not authorized, token failed' }
        }
    },
    Error403: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Role User is not authorized to access this route' }
        }
    },
    Error404: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Resource not found' }
        }
    },
    Error500: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Internal server error' },
            error: { type: 'string', example: 'Detailed error message' }
        }
    }
};
