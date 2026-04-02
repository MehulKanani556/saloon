import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const fetchStaff = createAsyncThunk('staff/fetchAll', async () => {
    const { data } = await api.get('/staff');
    return data;
});

export const addStaff = createAsyncThunk('staff/add', async (staffMember, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/staff', staffMember);
        toast.success('Staff member added successfully!');
        return data;
    } catch (err) {
        toast.error('Failed to add staff member');
        return rejectWithValue(err.response.data);
    }
});

export const updateStaffMember = createAsyncThunk('staff/update', async ({ id, staffMember }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/staff/${id}`, staffMember);
        toast.success('Staff profile updated!');
        return data;
    } catch (err) {
        toast.error('Profile update failed');
        return rejectWithValue(err.response.data);
    }
});

export const deleteStaffMember = createAsyncThunk('staff/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/staff/${id}`);
        toast.success('Staff member removed');
        return id;
    } catch (err) {
        toast.error('Failed to remove staff member');
        return rejectWithValue(err.response.data);
    }
});

const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staff: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaff.pending, (state) => { state.loading = true; })
            .addCase(fetchStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(fetchStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addStaff.fulfilled, (state, action) => {
                state.staff.push(action.payload);
            })
            .addCase(updateStaffMember.fulfilled, (state, action) => {
                const index = state.staff.findIndex(s => s._id === action.payload._id);
                if (index !== -1) state.staff[index] = action.payload;
            })
            .addCase(deleteStaffMember.fulfilled, (state, action) => {
                state.staff = state.staff.filter(s => s._id !== action.payload);
            });
    }
});

export default staffSlice.reducer;
