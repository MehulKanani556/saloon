import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        toast.success(`Welcome back, ${data.name}!`);
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
        return rejectWithValue(error.response.data);
    }
});

export const signupAdmin = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', credentials);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        toast.success(`Success! Welcome ${data.name}!`);
        return data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
        return rejectWithValue(error.response.data);
    }
});

export const logoutAdmin = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    try {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('adminInfo');
        dispatch(logout());
        toast.success('Successfully logged out');
    } catch (error) {
        console.error('Logout error', error);
        localStorage.removeItem('token');
        localStorage.removeItem('adminInfo');
        dispatch(logout());
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
            state.error = null;
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
            })
            .addCase(signupAdmin.pending, (state) => { state.loading = true; })
            .addCase(signupAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminInfo = action.payload;
            })
            .addCase(signupAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
