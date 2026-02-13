import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout, selectUser } from '../store/slices/authSlice';
import { toggleTheme, selectTheme, clearNotifications, selectNotifications } from '../store/slices/uiSlice';

function Settings() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const notifications = useSelector(selectNotifications);

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleClearNotifications = () => {
    dispatch(clearNotifications());
  };

  return (
    <div data-testid="settings-page">
      <h1>Settings</h1>

      <section className="settings-section">
        <h2>Profile</h2>
        {user && (
          <div data-testid="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}
      </section>

      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="setting-row">
          <label>Theme</label>
          <button onClick={handleThemeToggle} data-testid="theme-toggle">
            Current: {theme} (click to toggle)
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>Notifications ({notifications.length})</h2>
        {notifications.length > 0 && (
          <>
            <ul data-testid="notification-list">
              {notifications.map((n) => (
                <li key={n.id} className={`notification notification-${n.type}`}>
                  {n.message}
                </li>
              ))}
            </ul>
            <button onClick={handleClearNotifications} data-testid="clear-notifications">
              Clear All
            </button>
          </>
        )}
        {notifications.length === 0 && <p>No notifications</p>}
      </section>

      <section className="settings-section">
        <h2>Account</h2>
        <button onClick={handleLogout} className="danger" data-testid="logout-button">
          Logout
        </button>
      </section>
    </div>
  );
}

export default Settings;
