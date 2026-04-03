import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchSpecializationRequests = createAsyncThunk('specializations/fetchRequests', async (isAdmin, { rejectWithValue }) => {
    try {
        const endpoint = isAdmin ? '/specializations/all-requests' : '/specializations/my-requests';
        const { data } = await api.get(endpoint);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to load requests');
    }
});

export const submitSpecializationRequest = createAsyncThunk('specializations/submitRequest', async (requestData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/specializations/requests', requestData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Submission failed');
    }
});

export const updateSpecializationRequestStatus = createAsyncThunk('specializations/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/specializations/requests/${id}/status`, { status });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
});

const specializationSlice = createSlice({
    name: 'specializations',
    initialState: {
        requests: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetSpecializationState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpecializationRequests.pending, (state) => { state.loading = true; })
            .addCase(fetchSpecializationRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchSpecializationRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitSpecializationRequest.fulfilled, (state, action) => {
                state.requests.unshift(action.payload);
                state.success = true;
            })
            .addCase(updateSpecializationRequestStatus.fulfilled, (state, action) => {
                const index = state.requests.findIndex(r => r._id === action.payload._id);
                if (index !== -1) state.requests[index] = action.payload;
            });
    }
});

export const { resetSpecializationState } = specializationSlice.actions;
export default specializationSlice.reducer;
