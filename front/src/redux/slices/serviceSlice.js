import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const fetchServices = createAsyncThunk('services/fetchAll', async () => {
    const { data } = await api.get('/services');
    return data;
});

export const addService = createAsyncThunk('services/add', async (serviceData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/services', serviceData);
        toast.success('New service added successfully!');
        return data;
    } catch (err) {
        toast.error('Service add failed');
        return rejectWithValue(err.response.data);
    }
});

export const updateService = createAsyncThunk('services/update', async ({ id, serviceData }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/services/${id}`, serviceData);
        toast.success('Service updated successfully!');
        return data;
    } catch (err) {
        toast.error('Service update failed');
        return rejectWithValue(err.response.data);
    }
});

export const deleteService = createAsyncThunk('services/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/services/${id}`);
        toast.success('Service removed from portfolio');
        return id;
    } catch (err) {
        toast.error('Deletion failed');
        return rejectWithValue(err.response.data);
    }
});

const serviceSlice = createSlice({
    name: 'services',
    initialState: {
        services: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => { state.loading = true; })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addService.fulfilled, (state, action) => {
                state.services.push(action.payload);
            })
            .addCase(updateService.fulfilled, (state, action) => {
                const index = state.services.findIndex(s => s._id === action.payload._id);
                if (index !== -1) state.services[index] = action.payload;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.services = state.services.filter(s => s._id !== action.payload);
            });
    }
});

export default serviceSlice.reducer;
