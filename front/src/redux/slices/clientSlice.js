import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const fetchClients = createAsyncThunk('clients/fetchAll', async () => {
    const { data } = await api.get('/clients');
    return data;
});

export const addClient = createAsyncThunk('clients/add', async (clientData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/clients', clientData);
        toast.success('New client added to the directory!');
        return data;
    } catch (err) {
        toast.error('Failed to create client');
        return rejectWithValue(err.response.data);
    }
});

export const updateClient = createAsyncThunk('clients/update', async ({ id, clientData }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/clients/${id}`, clientData);
        toast.success('Client profile updated');
        return data;
    } catch (err) {
        toast.error('Failed to update profile');
        return rejectWithValue(err.response.data);
    }
});

export const deleteClient = createAsyncThunk('clients/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/clients/${id}`);
        toast.success('Client record removed');
        return id;
    } catch (err) {
        toast.error('Failed to eliminate record');
        return rejectWithValue(err.response.data);
    }
});

const clientSlice = createSlice({
    name: 'clients',
    initialState: {
        clients: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => { state.loading = true; })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addClient.fulfilled, (state, action) => {
                state.clients.push(action.payload);
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                const index = state.clients.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.clients[index] = action.payload;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.clients = state.clients.filter(c => c._id !== action.payload);
            });
    }
});

export default clientSlice.reducer;
