import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'home' },
  { path: '/users', label: 'Users', icon: 'people' },
  { path: '/posts', label: 'Posts', icon: 'article' },
  { path: '/posts/new', label: 'New Post', icon: 'add' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" data-testid="sidebar">
      <nav>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path} data-testid={`nav-${item.icon}`}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
