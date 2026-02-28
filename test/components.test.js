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
import Layout from '../src/components/Layout';
import Navbar from '../src/components/Navbar';
import Sidebar from '../src/components/Sidebar';
import LoadingSpinner from '../src/components/LoadingSpinner';
import Pagination from '../src/components/Pagination';

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

describe('Layout Component', () => {
  test('renders layout with children', () => {
    renderWithProviders(<Layout><div data-testid="child">Hello</div></Layout>);
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('shows sidebar when authenticated and open', () => {
    renderWithProviders(<Layout><div>Content</div></Layout>);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  test('hides sidebar when not authenticated', () => {
    const store = createTestStore({ auth: { user: null, token: null, isAuthenticated: false, loading: false, error: null } });
    renderWithProviders(<Layout><div>Content</div></Layout>, { store });
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });
});

describe('Navbar Component', () => {
  test('renders navbar', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('shows user name when authenticated', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
  });

  test('shows login link when not authenticated', () => {
    const store = createTestStore({ auth: { user: null, token: null, isAuthenticated: false, loading: false, error: null } });
    renderWithProviders(<Navbar />, { store });
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
  });

  test('theme toggle button works', () => {
    const { store } = renderWithProviders(<Navbar />);
    fireEvent.click(screen.getByTestId('navbar-theme-toggle'));
    expect(store.getState().ui.theme).toBe('dark');
  });
});

describe('Sidebar Component', () => {
  test('renders sidebar with nav items', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-people')).toBeInTheDocument();
    expect(screen.getByTestId('nav-article')).toBeInTheDocument();
    expect(screen.getByTestId('nav-settings')).toBeInTheDocument();
  });

  test('nav links have correct labels', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});

describe('LoadingSpinner Component', () => {
  test('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    render(<LoadingSpinner message="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  test('accepts ref via forwardRef', () => {
    const ref = React.createRef();
    render(<LoadingSpinner ref={ref} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current.getAttribute('data-testid')).toBe('loading-spinner');
  });
});

describe('Pagination Component', () => {
  test('renders pagination buttons', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('prev-page')).toBeDisabled();
    expect(screen.getByTestId('next-page')).not.toBeDisabled();
  });

  test('clicking next calls onPageChange', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByTestId('next-page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('clicking page number calls onPageChange', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByTestId('page-2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('returns null when totalPages is 1', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  test('shows page info', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 2 of 5');
  });
});
