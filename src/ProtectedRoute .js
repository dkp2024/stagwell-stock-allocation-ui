import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component }) => {
  const { authState } = useOktaAuth();

  if (authState && !authState.isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" />;
  }

  return component; // Render the protected component if authenticated
};

export default ProtectedRoute;
