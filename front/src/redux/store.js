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
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import reportReducer from './slices/reportSlice';
import reviewReducer from './slices/reviewSlice';
import leaveReducer from './slices/leaveSlice';
import specializationReducer from './slices/specializationSlice';

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
        categories: categoryReducer,
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: orderReducer,
        reports: reportReducer,
        reviews: reviewReducer,
        leaves: leaveReducer,
        specializations: specializationReducer
    },
});

export default store;
