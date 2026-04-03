import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get('/orders/my');
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
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
            return thunkAPI.rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
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
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.orders = state.orders.map((o) =>
                    o._id === action.payload._id ? action.payload : o
                );
            });
    },
});

export default orderSlice.reducer;
