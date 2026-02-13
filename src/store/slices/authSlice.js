import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulated API call
const fakeAuthApi = (credentials) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'admin@test.com' && credentials.password === 'password') {
        resolve({
          id: 1,
          email: credentials.email,
          name: 'Admin User',
          role: 'admin',
          token: 'fake-jwt-token-12345',
        });
      } else if (credentials.email && credentials.password) {
        resolve({
          id: 2,
          email: credentials.email,
          name: 'Test User',
          role: 'user',
          token: 'fake-jwt-token-67890',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 100);
  });

const fakeRegisterApi = (userData) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'user',
        token: 'fake-jwt-token-new',
      });
    }, 100);
  });

// createAsyncThunk - RTK v1 pattern
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const user = await fakeAuthApi(credentials);
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const user = await fakeRegisterApi(userData);
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// createSlice with extraReducers builder pattern
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
