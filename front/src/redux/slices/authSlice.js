import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        toast.success(`Welcome back, ${data.name}!`);
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        adminInfo: (localStorage.getItem('adminInfo') && localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('adminInfo')) : null,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.adminInfo = null;
            localStorage.removeItem('token');
            localStorage.removeItem('adminInfo');
            toast.success('Successfully logged out');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => { state.loading = true; })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
