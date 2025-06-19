import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import

const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Current time in seconds
  return decodedToken.exp < currentTime; // Check if the token is expired
};

const isSupplier = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken.role === "supplier"; // Check if the user is a supplier
};

export const ProtectedSupplierRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); // Remove expired token
    return <Navigate to="/supplierlogin" replace />;
  }

  if (!isSupplier(token)) {
    return <Navigate to="/supplierlogin" replace />; // Redirect if the user is not a supplier
  }

  return children; // Render children if the user is a supplier and the token is valid
};
