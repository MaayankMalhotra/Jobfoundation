import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please log in to access this page.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      }).then(() => {
        navigate('/LoginPage');
      });
      return;
    }

    if (!allowedRoles.includes(user.role_id)) {
      Swal.fire({
        icon: 'warning',
        title: 'Unauthorized',
        text: 'You are not allowed to access this page.',
        confirmButtonText: 'Back',
        confirmButtonColor: '#5a34a0',
      }).then(() => {
        // 👇 Go back to previous page
        navigate(-1);
      });
    }
  }, [allowedRoles, navigate, user, location.pathname]);

  // If user is not allowed, block rendering
  if (!user || !allowedRoles.includes(user.role_id)) return null;

  return <Outlet />;
};

export default PrivateRoute;
