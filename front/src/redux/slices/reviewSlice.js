import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const submitReview = createAsyncThunk(
    'reviews/submitReview',
    async ({ target, targetType, rating, comment }, thunkAPI) => {
        try {
            const { data } = await api.post('/reviews', { target, targetType, rating, comment });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to submit review');
        }
    }
);

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (targetId, thunkAPI) => {
        try {
            const { data } = await api.get(`/reviews/${targetId}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.reviews.unshift(action.payload);
            });
    },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
