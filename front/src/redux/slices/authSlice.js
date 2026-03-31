import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success(`Welcome back, ${data.name}!`);
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
        return rejectWithValue(error.response.data);
    }
});

export const sendOTP = createAsyncThunk('auth/sendOTP', async (identity, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/send-otp', { identity });
        toast.success(data.message);
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send OTP');
        return rejectWithValue(error.response.data);
    }
});

export const signupUser = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', credentials);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success(`Success! Welcome ${data.name}!`);
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
        return rejectWithValue(error.response.data);
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    try {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        dispatch(logout());
        toast.success('Successfully logged out');
    } catch (error) {
        console.error('Logout error', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        dispatch(logout());
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: (localStorage.getItem('userInfo') && localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('userInfo')) : null,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(signupUser.pending, (state) => { state.loading = true; })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
