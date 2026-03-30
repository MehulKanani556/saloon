import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchReportIntel = createAsyncThunk(
  'reports/fetchReportIntel',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/reports/intel');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch business intelligence');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    intel: {
      stats: {
        active: 0,
        downloads: 0,
        shared: 0,
        archiveSize: '0 GB'
      },
      recentLogs: []
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportIntel.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportIntel.fulfilled, (state, action) => {
        state.loading = false;
        state.intel = action.payload;
      })
      .addCase(fetchReportIntel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default reportSlice.reducer;
