import React, { forwardRef } from 'react';

// forwardRef usage (API changes in React 19)
const LoadingSpinner = forwardRef(function LoadingSpinner({ size, message }, ref) {
  const spinnerSize = size || 'medium';

  return (
    <div ref={ref} className={`loading-spinner spinner-${spinnerSize}`} data-testid="loading-spinner">
      <div className="spinner" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
});

// defaultProps on forwardRef component (deprecated in React 19)
LoadingSpinner.defaultProps = {
  size: 'medium',
  message: 'Loading...',
};

export default LoadingSpinner;
