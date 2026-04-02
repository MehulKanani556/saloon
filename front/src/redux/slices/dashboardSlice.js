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
          revenueData: payload.financialVelocity || [],
          categoryData: payload.serviceHierarchy || [],
          specializationData: payload.serviceHierarchy || [],
          topStaff: payload.eliteTalent || [],
          recentAppointments: payload.recentBookings || [],
          occupancyData: payload.occupancyTrends || [],
          upcomingAppointments: payload.upcomingRituals || []
        };
      })
      .addCase(fetchDashboardInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
