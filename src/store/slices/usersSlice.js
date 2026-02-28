import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const FAKE_USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'editor', status: 'active' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'viewer', status: 'inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'editor', status: 'active' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'admin', status: 'active' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'viewer', status: 'active' },
  { id: 7, name: 'Grace Wilson', email: 'grace@example.com', role: 'editor', status: 'inactive' },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com', role: 'viewer', status: 'active' },
];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    return FAKE_USERS;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    const user = FAKE_USERS.find((u) => u.id === Number(id));
    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  items: [],
  currentUser: null,
  loading: false,
  error: null,
  page: 1,
  perPage: 5,
  total: 0,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'User not found';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
        state.total = state.items.length;
      });
  },
});

export const { setPage, clearCurrentUser } = usersSlice.actions;

export const selectUsers = (state) => state.users.items;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersPagination = (state) => ({
  page: state.users.page,
  perPage: state.users.perPage,
  total: state.users.total,
});

export default usersSlice.reducer;
