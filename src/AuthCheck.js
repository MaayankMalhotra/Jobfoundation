import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Local storage se token check karo
    const token = localStorage.getItem('token');
    
    // Agar token nahi hai, to login page pe redirect kar do
    if (!token) {
      navigate('/LoginPage');
    }
  }, [navigate]); // navigate ko dependency mein daal do

  // Agar token hai, to children (jo bhi component hai) render kar do
  return localStorage.getItem('token') ? <>{children}</> : null;
};

export default AuthCheck;