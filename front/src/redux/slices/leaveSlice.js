import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchLeaves = createAsyncThunk('leaves/fetchLeaves', async (isAdmin, { rejectWithValue }) => {
    try {
        const endpoint = isAdmin ? '/leaves' : '/leaves/my';
        const { data } = await api.get(endpoint);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to load leave requests');
    }
});

export const requestLeave = createAsyncThunk('leaves/requestLeave', async (leaveData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/leaves', leaveData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Leave submission failed');
    }
});

export const updateLeaveStatus = createAsyncThunk('leaves/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/leaves/${id}`, { status });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update leave status');
    }
});

const leaveSlice = createSlice({
    name: 'leaves',
    initialState: {
        leaves: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetLeaveState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaves.pending, (state) => { state.loading = true; })
            .addCase(fetchLeaves.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = action.payload;
            })
            .addCase(fetchLeaves.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(requestLeave.fulfilled, (state, action) => {
                state.leaves.unshift(action.payload);
            })
            .addCase(updateLeaveStatus.fulfilled, (state, action) => {
                const index = state.leaves.findIndex(l => l._id === action.payload._id);
                if (index !== -1) state.leaves[index] = action.payload;
            });
    }
});

export const { resetLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;
