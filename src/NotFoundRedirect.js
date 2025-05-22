// NotFoundRedirect.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: 'error',
      title: 'Page Not Found',
      text: 'This page does not exist or you are not allowed to access it.',
      confirmButtonText: 'Go Back',
      confirmButtonColor: '#5a34a0',
    }).then(() => {
      // Redirect based on role
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.role_id === 2) {
        navigate('/job-recommended');
      } else if (user?.role_id === 3) {
        navigate('/job-post');
      } else {
        navigate('/'); // Default fallback
      }
    });
  }, [navigate]);

  return null;
};

export default NotFoundRedirect;
