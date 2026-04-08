import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const submitContactMessage = createAsyncThunk(
    'contact/submitMessage',
    async (messageData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/contact', messageData);
            toast.success(data.message || 'Message sent successfully!');
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send message';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchContactMessages = createAsyncThunk(
    'contact/fetchMessages',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/contact');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
        }
    }
);

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        messages: [],
        loading: false,
        success: false,
        error: null
    },
    reducers: {
        resetContactState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitContactMessage.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitContactMessage.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitContactMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchContactMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchContactMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchContactMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
