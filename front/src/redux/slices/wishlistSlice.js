import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const syncWishlist = createAsyncThunk('wishlist/sync', async (items) => {
    await api.post('/wishlist/sync', { wishlistItems: items });
});

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
    const { data } = await api.get('/wishlist');
    return data;
});

const initialState = {
    wishlistItems: JSON.parse(localStorage.getItem('wishlistItems')) || [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const item = action.payload;
            if (!state.wishlistItems.find((x) => x._id === item._id)) {
                state.wishlistItems = [...state.wishlistItems, item];
            }
            localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
        },
        removeFromWishlist: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
        },
        clearWishlist: (state) => {
            state.wishlistItems = [];
            localStorage.removeItem('wishlistItems');
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWishlist.fulfilled, (state, action) => {
            state.wishlistItems = action.payload;
            localStorage.setItem('wishlistItems', JSON.stringify(action.payload));
        });
        builder.addCase('auth/logout', (state) => {
            state.wishlistItems = [];
            localStorage.removeItem('wishlistItems');
        });
    }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
