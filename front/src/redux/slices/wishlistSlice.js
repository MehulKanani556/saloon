import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const syncWishlist = createAsyncThunk('wishlist/sync', async (items) => {
    const { data } = await api.post('/wishlist/sync', { wishlist: items });
    return data.wishlist;
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
        builder.addCase(syncWishlist.fulfilled, (state, action) => {
            state.wishlistItems = action.payload;
            localStorage.setItem('wishlistItems', JSON.stringify(action.payload));
        });
    }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
