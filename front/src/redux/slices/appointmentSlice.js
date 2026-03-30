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
        toast.success('Appointment scheduled beautifully!');
        return data;
    } catch (err) {
        toast.error('Scheduling failed');
        return rejectWithValue(err.response.data);
    }
});

export const updateAppointment = createAsyncThunk('appointments/update', async ({ id, appointment }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/appointments/${id}`, appointment);
        toast.success('Ritual refined successfully!');
        return data;
    } catch (err) {
        toast.error('Refinement failed');
        return rejectWithValue(err.response.data);
    }
});

export const deleteAppointment = createAsyncThunk('appointments/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/appointments/${id}`);
        toast.success('Ritual dissolved gracefully');
        return id;
    } catch (err) {
        toast.error('Dissolution failed');
        return rejectWithValue(err.response.data);
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

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: [],
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
                state.appointments = action.payload;
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
            // Delete
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.appointments = state.appointments.filter(a => a._id !== action.payload);
            });
    }
});

export default appointmentSlice.reducer;
