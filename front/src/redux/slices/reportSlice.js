import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/reports/intel');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch business reports');
    }
  }
);

// Alias for transition
export const fetchReportIntel = fetchReports;

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reportData: {
      stats: { active: 0, downloads: 0, shared: 0, archiveSize: '0' },
      summary: { totalRevenue: 0, totalAppointments: 0, totalClients: 0, activeServices: 0, totalStaff: 0 },
      monthlyData: [],
      recentLogs: []
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default reportSlice.reducer;
