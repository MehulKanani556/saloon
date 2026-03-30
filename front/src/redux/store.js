import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceReducer from './slices/serviceSlice';
import appointmentReducer from './slices/appointmentSlice';
import clientReducer from './slices/clientSlice';
import staffReducer from './slices/staffSlice';
import salesReducer from './slices/salesSlice';
import settingReducer from './slices/settingSlice';
import dashboardReducer from './slices/dashboardSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        services: serviceReducer,
        appointments: appointmentReducer,
        clients: clientReducer,
        staff: staffReducer,
        sales: salesReducer,
        settings: settingReducer,
        dashboard: dashboardReducer,
        categories: categoryReducer
    },
});

export default store;
