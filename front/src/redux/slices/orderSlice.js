import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get('/orders/my');
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAllOrders',
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get('/orders');
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch all orders');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status }, thunkAPI) => {
        try {
            const { data } = await api.put(`/orders/${id}/status`, { status });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update order status');
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (orderId, thunkAPI) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/cancel`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, thunkAPI) => {
        try {
            const { data } = await api.post('/orders', orderData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Order creation failed');
        }
    }
);

export const createPaymentIntent = createAsyncThunk(
    'orders/createPaymentIntent',
    async (amount, thunkAPI) => {
        try {
            const { data } = await api.post('/payment/create-payment-intent', { amount });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Payment intent generation failed');
        }
    }
);

export const exportOrderInvoicePDF = createAsyncThunk(
    'orders/exportPDF',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/invoices/order-pdf/${id}`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to download invoice');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.orders = state.orders.map((o) =>
                    o._id === action.payload._id ? action.payload : o
                );
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.orders = state.orders.map((o) =>
                    o._id === action.payload._id ? action.payload : o
                );
            });
    },
});

export default orderSlice.reducer;
