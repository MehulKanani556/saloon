import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchDashboardInsights = createAsyncThunk(
  'dashboard/fetchInsights',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/dashboard');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch insights');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: {
      stats: { totalClients: 0, totalAppointments: 0, totalRevenue: 0, todayRevenue: 0, activeServices: 0 },
      financialVelocity: [],
      serviceHierarchy: [],
      eliteTalent: [],
      recentBookings: [],
      occupancyTrends: [],
      upcomingRituals: []
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardInsights.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
