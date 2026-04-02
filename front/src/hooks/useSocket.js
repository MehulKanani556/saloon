import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5000', {
    withCredentials: true,
    autoConnect: false
});

export const useSocket = () => {
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            socket.connect();

            if (userInfo.role === 'Admin') {
                socket.emit('join_admin');

                socket.on('new_appointment', (data) => {
                    toast.success(`NEW BOOKING: ${data.client}`, {
                        icon: '📅',
                        duration: 6000
                    });
                });

                socket.on('new_specialization_request', (data) => {
                    toast.success(`NEW EXPERTISE REQUEST: ${data.staff}`, {
                        icon: '✨',
                        duration: 6000
                    });
                });
            }
        }

        return () => {
            socket.off('new_appointment');
            socket.off('new_specialization_request');
            socket.disconnect();
        };
    }, [userInfo]);

    return socket;
};
