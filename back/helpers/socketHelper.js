let io;

const initSocket = (server) => {
    const socketIo = require('socket.io');
    io = socketIo(server, {
        cors: {
            origin: [
                'http://localhost:3000',
                process.env.CLIENT_URL,
                'http://localhost:5174',
            ],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        
        socket.on('join_admin', () => {
            socket.join('admin_room');
            console.log('Admin joined admin_room');
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        // Fallback or early access handling
        // throw new Error('Socket.io not initialized');
    }
    return io;
};

const notifyAdmin = (eventName, data) => {
    if (io) {
        io.to('admin_room').emit(eventName, data);
    }
};

module.exports = { initSocket, getIO, notifyAdmin };
