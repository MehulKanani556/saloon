module.exports = {
    '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Register a new client',
            description: 'Creates a new User (client) account. Returns access token and sets refresh token cookie.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'email', 'password'],
                            properties: {
                                name: { type: 'string', example: 'John Doe' },
                                email: { type: 'string', example: 'john@example.com' },
                                password: { type: 'string', example: 'SecurePass@123' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'User registered successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
                },
                400: { description: 'User already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/auth/send-otp': {
        post: {
            tags: ['Auth'],
            summary: 'Send OTP to email or phone',
            description: 'Dispatches a 6-digit OTP to the user\'s email or phone. OTP expires in 10 minutes.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['identity'],
                            properties: {
                                identity: { type: 'string', example: 'john@example.com', description: 'Email address or phone number' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'OTP dispatched', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'A secure verification code has been dispatched. Authenticate within 10 minutes.' } } } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Login with password or OTP',
            description: 'Authenticates Admin, Staff, or Client. Supports password and OTP methods. Sets refresh token cookie.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['identity', 'method'],
                            properties: {
                                identity: { type: 'string', example: 'john@example.com', description: 'Email or phone number' },
                                method: { type: 'string', enum: ['password', 'otp'], example: 'password' },
                                password: { type: 'string', example: 'SecurePass@123', description: 'Required if method=password' },
                                otp: { type: 'string', example: '123456', description: 'Required if method=otp' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                401: { description: 'Invalid credentials or deleted account', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        }
    },

    '/auth/refresh': {
        post: {
            tags: ['Auth'],
            summary: 'Refresh access token',
            description: 'Uses the httpOnly refresh token cookie to issue a new access token.',
            responses: {
                200: { description: 'New access token issued', content: { 'application/json': { schema: { type: 'object', properties: { accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } } } } },
                401: { description: 'No refresh token cookie', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                403: { description: 'Invalid refresh token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error403' } } } }
            }
        }
    },

    '/auth/logout': {
        post: {
            tags: ['Auth'],
            summary: 'Logout user',
            description: 'Clears the refresh token cookie.',
            responses: {
                200: { description: 'Logged out', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Logged out successfully' } } } } } }
            }
        }
    },

    '/auth/me': {
        get: {
            tags: ['Auth'],
            summary: 'Get current user profile',
            description: 'Returns the authenticated user\'s full profile. Staff gets populated services.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    '/auth/profile': {
        put: {
            tags: ['Auth'],
            summary: 'Update user profile',
            description: 'Updates name and profile image. Staff can also update services, specialization, and bio. Accepts multipart/form-data for image upload.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'John Updated' },
                                image: { type: 'string', format: 'binary', description: 'Profile image file' },
                                services: { type: 'string', example: '664a1b2c3d4e5f6789012345,664a1b2c3d4e5f6789012346', description: 'Staff only – comma-separated service IDs' },
                                specialization: { type: 'string', example: 'Hair Coloring,Bridal', description: 'Staff only – comma-separated specializations' },
                                bio: { type: 'string', example: 'Expert stylist', description: 'Staff only' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Profile updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } },
                500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error500' } } } }
            }
        },
        delete: {
            tags: ['Auth'],
            summary: 'Delete (soft) user account',
            description: 'Marks the account as deleted (isDeleted=true) and clears the refresh token cookie. Data is preserved.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: { description: 'Account deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Identity dissolved successfully' } } } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    },

    '/auth/change-password': {
        put: {
            tags: ['Auth'],
            summary: 'Change password',
            description: 'Changes the user\'s password. If user has no password (OTP-only account), sets a new one directly.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['newPassword'],
                            properties: {
                                currentPassword: { type: 'string', example: 'OldPass@123', description: 'Required if account has a password' },
                                newPassword: { type: 'string', example: 'NewPass@456' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Password changed', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Security credentials synchronized successfully' } } } } } },
                400: { description: 'Invalid current password', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error400' } } } },
                401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error401' } } } },
                404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error404' } } } }
            }
        }
    }
};
