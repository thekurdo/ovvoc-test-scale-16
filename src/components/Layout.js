import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { selectTheme, selectSidebarOpen } from '../store/slices/uiSlice';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const theme = useSelector(selectTheme);
  const sidebarOpen = useSelector(selectSidebarOpen);

  return (
    <div className={`app-layout theme-${theme}`} data-testid="app-layout">
      <Navbar />
      <div className="main-container">
        {isAuthenticated && sidebarOpen && <Sidebar />}
        <main className="content" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
