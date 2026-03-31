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

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/me');
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await api.put('/auth/profile', userData);
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('Identity matrix synchronized');
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Synchronization failed');
        return rejectWithValue(error.response.data);
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (values, { rejectWithValue }) => {
    try {
        const { data } = await api.put('/auth/change-password', values);
        toast.success('Security protocol updated');
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Protocol update failed');
        return rejectWithValue(error.response.data);
    }
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async (credentials, { dispatch, rejectWithValue }) => {
    try {
        await api.delete('/auth/profile', { data: credentials });
        toast.success('Identity dissolved');
        dispatch(logout());
        return true;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Dissolution failed');
        return rejectWithValue(error.response.data);
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
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
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
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => { state.loading = true; })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state) => { state.loading = false; });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
