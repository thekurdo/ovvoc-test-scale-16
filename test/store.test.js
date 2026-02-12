import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, register, logout, clearAuthError, selectAuth, selectIsAuthenticated } from '../src/store/slices/authSlice';
import usersReducer, { fetchUsers, fetchUserById, deleteUser, setPage, clearCurrentUser, selectUsers, selectUsersPagination } from '../src/store/slices/usersSlice';
import postsReducer, { fetchPosts, fetchPostById, createPost, updatePost, deletePost, setPostFilters, setPostPage, selectPosts, selectPostFilters } from '../src/store/slices/postsSlice';
import uiReducer, { toggleTheme, setTheme, toggleSidebar, addNotification, removeNotification, clearNotifications, openModal, closeModal, selectTheme, selectSidebarOpen, selectNotifications, selectModal } from '../src/store/slices/uiSlice';

function createTestStore(preloadedState) {
  return configureStore({
    reducer: { auth: authReducer, users: usersReducer, posts: postsReducer, ui: uiReducer },
    preloadedState,
  });
}

describe('Auth Slice', () => {
  let store;
  beforeEach(() => { store = createTestStore(); });

  test('initial auth state is unauthenticated', () => {
    const state = selectAuth(store.getState());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  test('login succeeds with valid credentials', async () => {
    await store.dispatch(login({ email: 'admin@test.com', password: 'password' }));
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.email).toBe('admin@test.com');
    expect(state.user.role).toBe('admin');
    expect(state.token).toBeTruthy();
  });

  test('login returns user role for non-admin', async () => {
    await store.dispatch(login({ email: 'user@test.com', password: 'pass' }));
    expect(store.getState().auth.user.role).toBe('user');
  });

  test('logout clears auth state', async () => {
    await store.dispatch(login({ email: 'admin@test.com', password: 'password' }));
    store.dispatch(logout());
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });

  test('register creates new user', async () => {
    await store.dispatch(register({ email: 'new@test.com', name: 'New User' }));
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user.email).toBe('new@test.com');
  });

  test('clearAuthError resets error', async () => {
    await store.dispatch(login({ email: '', password: '' }));
    store.dispatch(clearAuthError());
    expect(store.getState().auth.error).toBeNull();
  });

  test('selectIsAuthenticated selector', async () => {
    expect(selectIsAuthenticated(store.getState())).toBe(false);
    await store.dispatch(login({ email: 'a@b.com', password: 'x' }));
    expect(selectIsAuthenticated(store.getState())).toBe(true);
  });
});

describe('Users Slice', () => {
  let store;
  beforeEach(() => { store = createTestStore(); });

  test('fetchUsers populates list', async () => {
    await store.dispatch(fetchUsers());
    expect(selectUsers(store.getState()).length).toBe(8);
  });

  test('fetchUserById sets currentUser', async () => {
    await store.dispatch(fetchUserById(1));
    expect(store.getState().users.currentUser.name).toBe('Alice Johnson');
  });

  test('deleteUser removes from list', async () => {
    await store.dispatch(fetchUsers());
    await store.dispatch(deleteUser(1));
    expect(selectUsers(store.getState()).find(u => u.id === 1)).toBeUndefined();
  });

  test('setPage changes pagination', () => {
    store.dispatch(setPage(3));
    expect(selectUsersPagination(store.getState()).page).toBe(3);
  });

  test('clearCurrentUser resets', async () => {
    await store.dispatch(fetchUserById(1));
    store.dispatch(clearCurrentUser());
    expect(store.getState().users.currentUser).toBeNull();
  });
});

describe('Posts Slice', () => {
  let store;
  beforeEach(() => { store = createTestStore(); });

  test('fetchPosts populates list', async () => {
    await store.dispatch(fetchPosts());
    expect(selectPosts(store.getState()).length).toBe(10);
  });

  test('fetchPosts with category filter', async () => {
    await store.dispatch(fetchPosts({ category: 'tutorial' }));
    expect(selectPosts(store.getState()).every(p => p.category === 'tutorial')).toBe(true);
  });

  test('fetchPostById sets currentPost', async () => {
    await store.dispatch(fetchPostById(1));
    expect(store.getState().posts.currentPost.title).toBe('Getting Started with React');
  });

  test('createPost adds to list', async () => {
    await store.dispatch(fetchPosts());
    await store.dispatch(createPost({ title: 'New', body: 'Content', category: 'guide', status: 'draft' }));
    expect(selectPosts(store.getState()).length).toBe(11);
  });

  test('updatePost modifies existing', async () => {
    await store.dispatch(fetchPosts());
    await store.dispatch(updatePost({ id: 1, title: 'Updated Title' }));
    expect(selectPosts(store.getState()).find(p => p.id === 1).title).toBe('Updated Title');
  });

  test('deletePost removes from list', async () => {
    await store.dispatch(fetchPosts());
    await store.dispatch(deletePost(1));
    expect(selectPosts(store.getState()).find(p => p.id === 1)).toBeUndefined();
  });

  test('setPostFilters updates filters', () => {
    store.dispatch(setPostFilters({ category: 'guide' }));
    expect(selectPostFilters(store.getState()).category).toBe('guide');
  });

  test('setPostPage changes page', () => {
    store.dispatch(setPostPage(2));
    expect(store.getState().posts.page).toBe(2);
  });
});

describe('UI Slice', () => {
  let store;
  beforeEach(() => { store = createTestStore(); });

  test('toggleTheme switches light to dark', () => {
    expect(selectTheme(store.getState())).toBe('light');
    store.dispatch(toggleTheme());
    expect(selectTheme(store.getState())).toBe('dark');
  });

  test('setTheme sets specific theme', () => {
    store.dispatch(setTheme('dark'));
    expect(selectTheme(store.getState())).toBe('dark');
  });

  test('toggleSidebar flips state', () => {
    expect(selectSidebarOpen(store.getState())).toBe(true);
    store.dispatch(toggleSidebar());
    expect(selectSidebarOpen(store.getState())).toBe(false);
  });

  test('notifications add and remove', () => {
    store.dispatch(addNotification({ type: 'success', message: 'Test' }));
    let notifs = selectNotifications(store.getState());
    expect(notifs.length).toBe(1);
    expect(notifs[0].message).toBe('Test');
    store.dispatch(removeNotification(notifs[0].id));
    expect(selectNotifications(store.getState()).length).toBe(0);
  });

  test('clearNotifications removes all', () => {
    store.dispatch(addNotification({ message: 'One' }));
    store.dispatch(addNotification({ message: 'Two' }));
    store.dispatch(clearNotifications());
    expect(selectNotifications(store.getState()).length).toBe(0);
  });

  test('modal open and close', () => {
    store.dispatch(openModal({ type: 'confirm', data: { id: 1 } }));
    expect(selectModal(store.getState()).isOpen).toBe(true);
    store.dispatch(closeModal());
    expect(selectModal(store.getState()).isOpen).toBe(false);
  });
});

describe('Store Integration', () => {
  test('store has all four slices', () => {
    const store = createTestStore();
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('users');
    expect(state).toHaveProperty('posts');
    expect(state).toHaveProperty('ui');
  });

  test('cross-slice workflow', async () => {
    const store = createTestStore();
    await store.dispatch(login({ email: 'admin@test.com', password: 'password' }));
    expect(store.getState().auth.isAuthenticated).toBe(true);
    await store.dispatch(fetchUsers());
    expect(store.getState().users.items.length).toBe(8);
    await store.dispatch(fetchPosts());
    expect(store.getState().posts.items.length).toBe(10);
  });
});
