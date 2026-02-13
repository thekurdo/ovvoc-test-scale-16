import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUser, logout } from '../store/slices/authSlice';
import { toggleSidebar, toggleTheme, selectTheme, selectNotifications } from '../store/slices/uiSlice';

function Navbar() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const notifications = useSelector(selectNotifications);

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-brand">
        <Link to="/" data-testid="brand-link">Admin Panel</Link>
        {isAuthenticated && (
          <button onClick={() => dispatch(toggleSidebar())} data-testid="sidebar-toggle">
            Menu
          </button>
        )}
      </div>

      <div className="navbar-actions">
        <button onClick={() => dispatch(toggleTheme())} data-testid="navbar-theme-toggle">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>

        {isAuthenticated ? (
          <>
            {notifications.length > 0 && (
              <span className="notification-badge" data-testid="notification-count">
                {notifications.length}
              </span>
            )}
            <span data-testid="user-name">{user?.name}</span>
            <button onClick={handleLogout} data-testid="navbar-logout">Logout</button>
          </>
        ) : (
          <Link to="/login" data-testid="login-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
