import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    products: [],
    product: null,
    loading: false,
    reviewLoading: false,
    reviewSuccess: false,
    error: null,
    success: false,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/products/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
});

export const submitProductReview = createAsyncThunk('products/submitReview', async ({ id, reviewData }, { rejectWithValue }) => {
    try {
        const response = await api.post(`/products/${id}/reviews`, reviewData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetProductState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.products.unshift(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.products.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitProductReview.pending, (state) => {
                state.reviewLoading = true;
            })
            .addCase(submitProductReview.fulfilled, (state, action) => {
                state.reviewLoading = false;
                state.product = action.payload;
                state.reviewSuccess = true;
            })
            .addCase(submitProductReview.rejected, (state, action) => {
                state.reviewLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((p) => p._id !== action.payload);
            });
    },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
