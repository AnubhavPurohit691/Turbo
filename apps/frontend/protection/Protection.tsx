import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = checkIfUserIsAuthenticated(); 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return isAuthenticated ? children : null;
};


function checkIfUserIsAuthenticated() {
 
  const token = localStorage.getItem('token');
  if(!token)return 
  return true; 
}

export default ProtectedRoute;
