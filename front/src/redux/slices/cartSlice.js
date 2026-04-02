import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const syncCart = createAsyncThunk('cart/sync', async (cartItems) => {
    const { data } = await api.post('/cart/sync', { cart: cartItems });
    return data.cart;
});

const initialState = {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? { ...item, qty: existItem.qty + 1 } : x
                );
            } else {
                state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        updateCartQty: (state, action) => {
            const { id, qty } = action.payload;
            state.cartItems = state.cartItems.map((x) =>
                x._id === id ? { ...x, qty: Number(qty) } : x
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
    },
    extraReducers: (builder) => {
        builder.addCase(syncCart.fulfilled, (state, action) => {
            state.cartItems = action.payload;
            localStorage.setItem('cartItems', JSON.stringify(action.payload));
        });
    }
});

export const { addToCart, removeFromCart, updateCartQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
