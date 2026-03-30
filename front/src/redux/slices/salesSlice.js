import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchFinancialMatrix = createAsyncThunk(
  'sales/fetchFinancialMatrix',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/sales/matrix');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Financial retrieval failed');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    matrix: {
      totalRevenue: 0,
      dailyAvg: 0,
      growth: 0,
      categoryData: [],
      chartData: []
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialMatrix.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinancialMatrix.fulfilled, (state, action) => {
        state.loading = false;
        state.matrix = action.payload;
      })
      .addCase(fetchFinancialMatrix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default salesSlice.reducer;
