import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const FAKE_POSTS = [
  { id: 1, title: 'Getting Started with React', body: 'React is a JavaScript library...', authorId: 1, category: 'tutorial', status: 'published', createdAt: '2024-01-15' },
  { id: 2, title: 'Redux Best Practices', body: 'When using Redux...', authorId: 2, category: 'tutorial', status: 'published', createdAt: '2024-01-20' },
  { id: 3, title: 'React Router Guide', body: 'Navigation in React apps...', authorId: 1, category: 'guide', status: 'published', createdAt: '2024-02-01' },
  { id: 4, title: 'State Management Patterns', body: 'There are many ways...', authorId: 3, category: 'article', status: 'draft', createdAt: '2024-02-10' },
  { id: 5, title: 'Testing React Components', body: 'Testing is essential...', authorId: 2, category: 'tutorial', status: 'published', createdAt: '2024-02-15' },
  { id: 6, title: 'Performance Optimization', body: 'React performance tips...', authorId: 4, category: 'article', status: 'published', createdAt: '2024-03-01' },
  { id: 7, title: 'TypeScript with React', body: 'Adding types to React...', authorId: 1, category: 'guide', status: 'draft', createdAt: '2024-03-10' },
  { id: 8, title: 'Server-Side Rendering', body: 'SSR with React...', authorId: 3, category: 'article', status: 'published', createdAt: '2024-03-15' },
  { id: 9, title: 'Custom Hooks Deep Dive', body: 'Creating custom hooks...', authorId: 2, category: 'tutorial', status: 'published', createdAt: '2024-03-20' },
  { id: 10, title: 'Deployment Strategies', body: 'Deploying React apps...', authorId: 4, category: 'guide', status: 'draft', createdAt: '2024-04-01' },
];

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (filters = {}, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    let posts = [...FAKE_POSTS];
    if (filters.category) {
      posts = posts.filter((p) => p.category === filters.category);
    }
    if (filters.status) {
      posts = posts.filter((p) => p.status === filters.status);
    }
    return posts;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    const post = FAKE_POSTS.find((p) => p.id === Number(id));
    if (!post) throw new Error('Post not found');
    return post;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createPost = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    return {
      id: Date.now(),
      ...postData,
      createdAt: new Date().toISOString().split('T')[0],
    };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, ...data }, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    return { id, ...data };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
  try {
    await new Promise((r) => setTimeout(r, 50));
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  items: [],
  currentPost: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    status: '',
  },
  page: 1,
  perPage: 5,
  total: 0,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setPostPage(state, action) {
      state.page = action.payload;
    },
    clearCurrentPost(state) {
      state.currentPost = null;
    },
    clearPostError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.length;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch posts';
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Post not found';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = { ...state.currentPost, ...action.payload };
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.total = state.items.length;
      });
  },
});

export const { setPostFilters, setPostPage, clearCurrentPost, clearPostError } = postsSlice.actions;

export const selectPosts = (state) => state.posts.items;
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectPostFilters = (state) => state.posts.filters;
export const selectPostsPagination = (state) => ({
  page: state.posts.page,
  perPage: state.posts.perPage,
  total: state.posts.total,
});

export default postsSlice.reducer;
