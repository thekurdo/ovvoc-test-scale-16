import React from 'react';

// forwardRef usage (API changes in React 19)
const LoadingSpinner = function LoadingSpinner({ size = 'medium', message = 'Loading...', ref }) {
  const spinnerSize = size || 'medium';

  return (
    <div ref={ref} className={`loading-spinner spinner-${spinnerSize}`} data-testid="loading-spinner">
      <div className="spinner" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;