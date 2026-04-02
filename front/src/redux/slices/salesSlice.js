import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const fetchFinancials = createAsyncThunk(
  'sales/fetchFinancials',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/sales/matrix');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch sales data');
    }
  }
);

export const processWithdrawal = createAsyncThunk(
  'sales/processWithdrawal',
  async (withdrawalData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/sales/withdraw', withdrawalData);
      toast.success(`Withdrawal confirmed — Ref: ${data.reference}`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal failed');
      return rejectWithValue(err.response?.data?.message || 'Withdrawal failed');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    salesData: {
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
      .addCase(fetchFinancials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinancials.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload;
      })
      .addCase(fetchFinancials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(processWithdrawal.pending, (state) => { state.loading = true; })
      .addCase(processWithdrawal.fulfilled, (state) => { state.loading = false; })
      .addCase(processWithdrawal.rejected, (state) => { state.loading = false; });
  }
});

export default salesSlice.reducer;
