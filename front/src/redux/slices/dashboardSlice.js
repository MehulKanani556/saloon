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
      stats: { totalClients: 0, totalAppointments: 0, totalRevenue: 0, todayRevenue: 0, activeServices: 0, pendingLeaves: 0 },
      trends: { totalClients: 0, appointments: 0, revenueToday: 0 },
      revenueData: [],
      categoryData: [],
      specializationData: [],
      topStaff: [],
      recentAppointments: [],
      occupancyData: [],
      upcomingAppointments: []
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
        const payload = action.payload;
        state.data = {
          stats: payload.stats || {},
          trends: payload.trends || { totalClients: 0, appointments: 0, revenueToday: 0 },
          revenueData: payload.revenueTrend || [],
          categoryData: payload.categoryDistribution || [],
          specializationData: payload.categoryDistribution || [],
          topStaff: payload.topStaff || [],
          recentAppointments: payload.recentAppointments || [],
          occupancyData: payload.occupancyData || [],
          upcomingAppointments: payload.upcomingAppointments || []
        };
      })
      .addCase(fetchDashboardInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
