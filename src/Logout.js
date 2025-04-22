import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Local storage se token aur user remove kar do
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Login page pe redirect kar do
    navigate('/LoginPage');
  }, [navigate]);

  // Ye component kuch render nahi karega, kyunki redirect ho jayega
  return null;
};

export default Logout;