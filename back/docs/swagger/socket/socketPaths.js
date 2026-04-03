/**
 * Socket.IO events are documented here as virtual REST-style paths.
 * Since OpenAPI 3.0 does not natively support WebSocket/Socket.IO,
 * these entries use a "socket://" convention to clearly distinguish them.
 * They are grouped under the "Socket.IO" tag in Swagger UI.
 */

module.exports = {

    // ─── CLIENT → SERVER (Emit) ──────────────────────────────────────────────────

    '/socket/emit/connect': {
        post: {
            tags: ['Socket.IO – Client → Server'],
            summary: 'connect',
            description: `**Triggered automatically** when a client calls \`socket.connect()\`.

**When:** Called in \`useSocket()\` hook when a logged-in user is detected.

\`\`\`js
const socket = io('http://localhost:5000', { withCredentials: true });
socket.connect();
\`\`\`

The server logs: \`New client connected: <socket.id>\``,
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            description: 'No payload – connection handshake only',
                            example: {}
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Server acknowledges connection. Socket ID assigned.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    socketId: { type: 'string', example: 'xK9mP2qRtL3vN7wZ' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    '/socket/emit/join_admin': {
        post: {
            tags: ['Socket.IO – Client → Server'],
            summary: 'join_admin',
            description: `**Emitted by Admin clients** to subscribe to the \`admin_room\` channel.
Only users with \`role === 'Admin'\` should emit this event.
Once joined, the admin receives all server-to-client admin notifications.

\`\`\`js
// Emitted after socket.connect() when userInfo.role === 'Admin'
socket.emit('join_admin');
\`\`\`

**Server handler:**
\`\`\`js
socket.on('join_admin', () => {
    socket.join('admin_room');
});
\`\`\``,
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            description: 'No payload required',
                            example: {}
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Socket joins admin_room. Admin will now receive new_appointment and new_specialization_request events.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    room: { type: 'string', example: 'admin_room' },
                                    status: { type: 'string', example: 'joined' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    '/socket/emit/disconnect': {
        post: {
            tags: ['Socket.IO – Client → Server'],
            summary: 'disconnect',
            description: `**Triggered automatically** when the client disconnects (page close, logout, component unmount).

\`\`\`js
// Called in useSocket cleanup
socket.disconnect();
\`\`\`

The server logs: \`Client disconnected: <socket.id>\``,
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            description: 'No payload – disconnect signal only',
                            example: {}
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Socket disconnected and removed from all rooms.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'Client disconnected' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // ─── SERVER → CLIENT (Listen) ────────────────────────────────────────────────

    '/socket/on/new_appointment': {
        get: {
            tags: ['Socket.IO – Server → Client'],
            summary: 'new_appointment',
            description: `**Emitted by server** to \`admin_room\` whenever a new appointment is successfully created via \`POST /api/appointments\`.

**Who receives it:** Only Admin clients that have emitted \`join_admin\`.

**Triggered by:** \`notifyAdmin('new_appointment', data)\` in \`appointmentController.js\`

\`\`\`js
// Frontend listener (Admin only)
socket.on('new_appointment', (data) => {
    toast.success(\`NEW BOOKING: \${data.client}\`, { icon: '📅', duration: 6000 });
});
\`\`\`

**Cleanup:**
\`\`\`js
socket.off('new_appointment');
\`\`\``,
            parameters: [],
            responses: {
                200: {
                    description: 'Event payload emitted to admin_room',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        example: '664a1b2c3d4e5f6789012345',
                                        description: 'Appointment ObjectId (_id)'
                                    },
                                    client: {
                                        type: 'string',
                                        example: 'Jane Smith',
                                        description: 'Client name'
                                    },
                                    date: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2026-04-10T10:00:00.000Z',
                                        description: 'Appointment date/time'
                                    }
                                }
                            },
                            example: {
                                id: '664a1b2c3d4e5f6789012345',
                                client: 'Jane Smith',
                                date: '2026-04-10T10:00:00.000Z'
                            }
                        }
                    }
                }
            }
        }
    },

    '/socket/on/new_specialization_request': {
        get: {
            tags: ['Socket.IO – Server → Client'],
            summary: 'new_specialization_request',
            description: `**Emitted by server** to \`admin_room\` whenever a staff member submits a new specialization request via \`POST /api/specializations/requests\`.

**Who receives it:** Only Admin clients that have emitted \`join_admin\`.

**Triggered by:** \`notifyAdmin('new_specialization_request', data)\` in \`specializationController.js\`

\`\`\`js
// Frontend listener (Admin only)
socket.on('new_specialization_request', (data) => {
    toast.success(\`NEW EXPERTISE REQUEST: \${data.staff}\`, { icon: '✨', duration: 6000 });
});
\`\`\`

**Cleanup:**
\`\`\`js
socket.off('new_specialization_request');
\`\`\``,
            parameters: [],
            responses: {
                200: {
                    description: 'Event payload emitted to admin_room',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        example: '664a1b2c3d4e5f6789012346',
                                        description: 'SpecializationRequest ObjectId (_id)'
                                    },
                                    staff: {
                                        type: 'string',
                                        example: 'Priya Sharma',
                                        description: 'Staff member name who submitted the request'
                                    },
                                    type: {
                                        type: 'string',
                                        example: 'Expertise Update',
                                        description: 'Request type label'
                                    }
                                }
                            },
                            example: {
                                id: '664a1b2c3d4e5f6789012346',
                                staff: 'Priya Sharma',
                                type: 'Expertise Update'
                            }
                        }
                    }
                }
            }
        }
    }
};
