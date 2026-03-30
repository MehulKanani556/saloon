import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const addCategory = createAsyncThunk('categories/addCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, categoryData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/categories/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
