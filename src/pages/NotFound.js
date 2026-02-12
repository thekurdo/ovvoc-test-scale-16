import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Class component with defaultProps (deprecated in React 19) + withRouter HOC (removed in Router v6)
class NotFound extends Component {
  handleGoHome = () => {
    this.props.history.push('/');
  };

  render() {
    const { title, message } = this.props;
    return (
      <div data-testid="not-found-page">
        <h1>{title}</h1>
        <p>{message}</p>
        <p>The page at <code>{this.props.location.pathname}</code> was not found.</p>
        <button onClick={this.handleGoHome} data-testid="go-home-button">
          Go Home
        </button>
      </div>
    );
  }
}

// defaultProps - deprecated in React 19
NotFound.defaultProps = {
  title: '404 - Not Found',
  message: 'The page you are looking for does not exist.',
};

// withRouter HOC - removed in React Router v6
export default withRouter(NotFound);
