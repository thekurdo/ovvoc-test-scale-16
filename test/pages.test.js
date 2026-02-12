import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/store/slices/authSlice';
import usersReducer from '../src/store/slices/usersSlice';
import postsReducer from '../src/store/slices/postsSlice';
import uiReducer from '../src/store/slices/uiSlice';
import Login from '../src/pages/Login';
import Settings from '../src/pages/Settings';
import NotFound from '../src/pages/NotFound';

function createTestStore(overrides = {}) {
  const defaultAuth = { user: { id: 1, name: 'Test User', email: 'test@test.com', role: 'admin' }, token: 'tok', isAuthenticated: true, loading: false, error: null };
  const defaultUsers = { items: [], currentUser: null, loading: false, error: null, page: 1, perPage: 5, total: 0 };
  const defaultPosts = { items: [], currentPost: null, loading: false, error: null, filters: { category: '', status: '' }, page: 1, perPage: 5, total: 0 };
  const defaultUi = { theme: 'light', sidebarOpen: true, notifications: [], modal: { isOpen: false, type: null, data: null } };
  return configureStore({
    reducer: { auth: authReducer, users: usersReducer, posts: postsReducer, ui: uiReducer },
    preloadedState: { auth: defaultAuth, users: defaultUsers, posts: defaultPosts, ui: defaultUi, ...overrides },
  });
}

function renderWithProviders(ui, { store, route = '/' } = {}) {
  const testStore = store || createTestStore();
  return {
    ...render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
    store: testStore,
  };
}

describe('Login Page', () => {
  test('renders login form', () => {
    const store = createTestStore({ auth: { user: null, token: null, isAuthenticated: false, loading: false, error: null } });
    renderWithProviders(<Login />, { store, route: '/login' });
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  test('login button shows correct text', () => {
    const store = createTestStore({ auth: { user: null, token: null, isAuthenticated: false, loading: false, error: null } });
    renderWithProviders(<Login />, { store, route: '/login' });
    expect(screen.getByTestId('login-button')).toHaveTextContent('Login');
  });

  test('displays error message when present', () => {
    const store = createTestStore({ auth: { user: null, token: null, isAuthenticated: false, loading: false, error: 'Invalid credentials' } });
    renderWithProviders(<Login />, { store, route: '/login' });
    expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
  });
});

describe('Settings Page', () => {
  test('renders settings page', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('shows user profile info', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('theme toggle button works', () => {
    const { store } = renderWithProviders(<Settings />);
    const themeBtn = screen.getByTestId('theme-toggle');
    expect(themeBtn).toHaveTextContent('light');
    fireEvent.click(themeBtn);
    expect(store.getState().ui.theme).toBe('dark');
  });

  test('logout button present', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });
});

describe('NotFound Page', () => {
  test('renders 404 page with defaults', () => {
    renderWithProviders(<NotFound />, { route: '/nonexistent' });
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
  });

  test('shows go home button', () => {
    renderWithProviders(<NotFound />, { route: '/nonexistent' });
    expect(screen.getByTestId('go-home-button')).toBeInTheDocument();
  });

  test('uses defaultProps for title and message', () => {
    renderWithProviders(<NotFound />, { route: '/xyz' });
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });
});
