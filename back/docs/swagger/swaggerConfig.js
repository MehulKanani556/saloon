const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Glow & Elegance Saloon API',
            version: '1.0.0',
            description: `
## Saloon Management System API

Full REST API for the Glow & Elegance Saloon platform.

### Panels
- **User Panel** – Client-facing: register, book appointments, shop products, manage cart/wishlist, orders
- **Admin Panel** – Full control: staff, clients, services, categories, reports, sales, settings
- **Staff Panel** – Staff-facing: view appointments, apply leaves, manage specializations, dashboard

### Authentication
All protected routes require a **Bearer token** in the Authorization header:
\`\`\`
Authorization: Bearer <accessToken>
\`\`\`
Tokens are obtained from \`/api/auth/login\` or \`/api/auth/register\`.
Refresh tokens are stored in an **httpOnly cookie** and used via \`/api/auth/refresh\`.
            `,
            contact: {
                name: 'Saloon API Support',
                email: 'contact@glowelegance.com'
            }
        },
        servers: [
            { url: 'http://localhost:5000/api', description: 'Development Server' },
            { url: 'https://your-production-domain.com/api', description: 'Production Server' }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT access token'
                }
            },
            schemas: require('./schemas')
        },
        tags: [
            { name: 'Auth', description: '🔐 Authentication – Register, Login, OTP, Profile (All Panels)' },
            { name: 'Appointments – User', description: '📅 User Panel – Book & manage own appointments' },
            { name: 'Appointments – Admin/Staff', description: '📅 Admin/Staff Panel – Manage all appointments' },
            { name: 'Products – Public', description: '🛍️ User Panel – Browse products & reviews' },
            { name: 'Products – Admin', description: '🛍️ Admin Panel – Manage products' },
            { name: 'Orders – User', description: '📦 User Panel – Place & track orders' },
            { name: 'Orders – Admin', description: '📦 Admin Panel – Manage all orders' },
            { name: 'Cart', description: '🛒 User Panel – Cart persistence' },
            { name: 'Wishlist', description: '❤️ User Panel – Wishlist persistence' },
            { name: 'Reviews', description: '⭐ User Panel – Reviews for services, staff, products' },
            { name: 'Payment', description: '💳 Payment – Stripe payment intents & webhooks' },
            { name: 'Services', description: '✂️ Services – Public listing & Admin management' },
            { name: 'Categories', description: '🏷️ Categories – Public listing & Admin management' },
            { name: 'Staff', description: '👤 Staff – Public listing & Admin management' },
            { name: 'Clients', description: '👥 Admin/Staff Panel – Client management' },
            { name: 'Dashboard', description: '📊 Admin/Staff Panel – Dashboard insights' },
            { name: 'Sales', description: '💰 Admin Panel – Financial matrix & withdrawals' },
            { name: 'Reports', description: '📈 Admin Panel – Business intelligence reports' },
            { name: 'Invoices', description: '🧾 Admin/Staff Panel – PDF invoice generation' },
            { name: 'Leaves – Staff', description: '🏖️ Staff Panel – Apply & view leaves' },
            { name: 'Leaves – Admin', description: '🏖️ Admin Panel – Manage all leaves' },
            { name: 'Specializations – Staff', description: '🎓 Staff Panel – Request specialization updates' },
            { name: 'Specializations – Admin', description: '🎓 Admin Panel – Approve/reject specialization requests' },
            { name: 'Settings', description: '⚙️ Settings – Salon settings (public read, admin write)' },
            {
                name: 'Socket.IO – Client → Server',
                description: `## Socket.IO – Client Emits to Server

> ⚠️ OpenAPI 3.0 does not natively support WebSocket/Socket.IO protocols.
> These entries use virtual paths (\`/socket/emit/*\`) to document events in a readable format.

**Connection URL:** \`http://localhost:5000\`

**Setup:**
\`\`\`js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    withCredentials: true,
    autoConnect: false
});

// Connect when user logs in
socket.connect();
\`\`\`

| Event | Direction | Who emits | Description |
|-------|-----------|-----------|-------------|
| \`connect\` | Client → Server | All roles | Auto-fired on socket.connect() |
| \`join_admin\` | Client → Server | Admin only | Subscribe to admin_room for notifications |
| \`disconnect\` | Client → Server | All roles | Auto-fired on socket.disconnect() |`
            },
            {
                name: 'Socket.IO – Server → Client',
                description: `## Socket.IO – Server Emits to Client

> ⚠️ These are server-push events. Clients must be listening with \`socket.on(eventName, callback)\`.

**Room:** All server-to-client events are emitted to \`admin_room\` only.
Admin must emit \`join_admin\` first to receive these.

| Event | Trigger | Payload |
|-------|---------|---------|
| \`new_appointment\` | \`POST /api/appointments\` | \`{ id, client, date }\` |
| \`new_specialization_request\` | \`POST /api/specializations/requests\` | \`{ id, staff, type }\` |

**Full lifecycle example:**
\`\`\`js
// 1. Connect
socket.connect();

// 2. Join admin room (Admin only)
socket.emit('join_admin');

// 3. Listen for server events
socket.on('new_appointment', (data) => { /* handle */ });
socket.on('new_specialization_request', (data) => { /* handle */ });

// 4. Cleanup on unmount
socket.off('new_appointment');
socket.off('new_specialization_request');
socket.disconnect();
\`\`\``
            }
        ],
        paths: require('./paths')
    },
    apis: []
};

module.exports = swaggerJsdoc(options);
