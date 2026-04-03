import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const fetchAppointments = createAsyncThunk('appointments/fetchAll', async () => {
    const { data } = await api.get('/appointments');
    return data;
});

export const addAppointment = createAsyncThunk('appointments/add', async (appointment, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/appointments', appointment);
        toast.success('Appointment scheduled successfully!');
        return data;
    } catch (err) {
        toast.error('Scheduling failed');
        return rejectWithValue(err.response.data);
    }
});

export const updateAppointment = createAsyncThunk('appointments/update', async ({ id, appointmentData }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/appointments/${id}`, appointmentData);
        toast.success('Appointment updated successfully!');
        return data;
    } catch (err) {
        toast.error('Update failed');
        return rejectWithValue(err.response.data);
    }
});

export const updateAppointmentStatus = createAsyncThunk('appointments/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/appointments/${id}/status`, { status });
        toast.success(`Ritual marked as ${status}`);
        return data;
    } catch (err) {
        toast.error('Status update failed');
        return rejectWithValue(err.response.data);
    }
});

export const deleteAppointment = createAsyncThunk('appointments/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/appointments/${id}`);
        toast.success('Appointment cancelled successfully');
        return id;
    } catch (err) {
        toast.error('Cancellation failed');
        return rejectWithValue(err.response.data);
    }
});

export const fetchOccupiedSlots = createAsyncThunk('appointments/fetchOccupiedSlots', async ({ date, serviceIds, staffIds }, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/appointments/occupied-slots', {
            date, serviceIds, staffIds
        });
        return data.occupiedSlots || [];
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Failed to fetch slots');
    }
});

export const exportInvoicePDF = createAsyncThunk('appointments/exportPDF', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/invoices/export-pdf/${id}`, {
            responseType: 'blob'
        });
        return { data: response.data, id };
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Failed to export invoice');
    }
});

export const fetchMyAppointments = createAsyncThunk('appointments/fetchMy', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/appointments/my');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Failed to fetch appointments');
    }
});

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: [],
        leaves: [],
        occupiedSlots: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAppointments.pending, (state) => { state.loading = true; })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.appointments) {
                    state.appointments = action.payload.appointments;
                    state.leaves = action.payload.leaves || [];
                } else {
                    state.appointments = action.payload;
                }
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add
            .addCase(addAppointment.fulfilled, (state, action) => {
                state.appointments.push(action.payload);
            })
            // Update
            .addCase(updateAppointment.fulfilled, (state, action) => {
                const index = state.appointments.findIndex(a => a._id === action.payload._id);
                if (index !== -1) state.appointments[index] = action.payload;
            })
            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                const index = state.appointments.findIndex(a => a._id === action.payload._id);
                if (index !== -1) state.appointments[index] = action.payload;
            })
            // Delete
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.appointments = state.appointments.filter(a => a._id !== action.payload);
            })
            // Occupied slots
            .addCase(fetchOccupiedSlots.fulfilled, (state, action) => {
                state.occupiedSlots = action.payload;
            })
            // My appointments
            .addCase(fetchMyAppointments.pending, (state) => { state.loading = true; })
            .addCase(fetchMyAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchMyAppointments.rejected, (state) => { state.loading = false; });
    }
});

export default appointmentSlice.reducer;
