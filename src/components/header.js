// import AOS from "aos";
import "aos/dist/aos.css";
// import LoginPage from './LoginPage'; // Your login component
// import { BrowserRouter, Routes, Route, Link,useNavigate } from 'react-router-dom';
import "../assets/css/bootstrap.min.css"; // Icons
import "../assets/css/app.min.css"; // Main app CSS
import "../assets/css/custom.min.css"; // Custom styles
import React, {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
import logoDark from '../assets/images/logo-dark.png'


const HeaderMain = () => {
    const [user, setUser] = useState(null);
    const [isEmployer, setIsEmployer] = useState(false);
  
    useEffect(() => {
      // Fetch user data from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log(storedUser);
      if (storedUser) {
        setUser({
          name: storedUser.name || 'User Name',
          username: storedUser.username,
          email: storedUser.email,
          avatar: storedUser.avatar || '/build/images/users/avatar-1.jpg', // Fallback avatar
        });
        setIsEmployer(storedUser.role_id == 2); // Check if role is 2 (employer)
      } else {
        setUser(null);
        setIsEmployer(false); // No user or role not 2
      }
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('user');
      setUser(null);
      setIsEmployer(false);
      // Redirect to login page if needed:
      window.location.replace('/job_frontend/LoginPage'); 
    };

    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
      setShowDropdown(prev => !prev);
    };

    return (
      <nav className="navbar navbar-expand-lg navbar-landing fixed-top job-navbar navHeaderColor" id="navbar">
        <div className="container-fluid custom-container">
          <Link className="navbar-brand" to="/">
            <img src={logoDark} className="card-logo card-logo-dark" alt="logo dark" height="40" />
            
          </Link>
          <button className="navbar-toggler py-0 fs-20 text-body" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i className="mdi mdi-menu"></i>
          </button>
  
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mt-2 mt-lg-0 me-2" id="navbar-example">
              <li className="nav-item">
                <Link className="nav-link active" to="#hero">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#about">About us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#contact">Contact us</Link>
              </li>
            </ul>
            {user ? (

              <div className="dropdown dropDownCustom" style={{minWidth:150,}}>
                <div className="dropdown-toggle" onClick={toggleDropdown}>
                  <img
                    className="rounded-circle header-profile-user"
                    src='https://girangroup.com/job_frontend/images/avatar-1.jpg'
                    alt="Header Avatar"
                    style={{ width: '50px', height: '50px',objectFit:'cover' }}
                  />
                  <span className="d-flex iconArrwoDown">
                    <i class="ri-arrow-drop-down-fill"></i>
                  </span>
                </div>

              <ul className={`dropdownContentStyle dropdown-menu ${showDropdown ? 'showDropDown' : ''}`}>
                <li>
                  <Link to="/employee-dashboard" className="dropdown-item dropDownLinkProfile">
                    <div className="imageProfileInside">
                      <img
                        className="rounded-circle header-profile-user"
                        src='https://girangroup.com/job_frontend/images/avatar-1.jpg'
                        alt="Header Avatar"
                        style={{ width: '60px', height: '60px',objectFit:'cover' }}
                      />
                    </div>
                    <div className="contentUserInside">
                        <h2>{user.username}</h2>
                        <p>{user.email}</p>
                    </div>
                  </Link>
                </li>
                <hr className="my-1"/>
                <li>
                  <Link className="dropdown-item" to="/edit-employee">
                    <i className="material-icons text-muted fs-16 align-middle me-1">settings</i>Profile Settings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#" onClick={handleLogout}>
                    <i className="material-icons text-muted fs-16 align-middle me-1">logout</i> Logout
                  </Link>
                </li>
              </ul>
              </div>

      ) : (
        <Link to="/LoginPage" className="btn btn-soft-primary">
          <i className="ri-user-3-line align-bottom me-1"></i> Login & Register
        </Link>
      )}
          </div>
        </div>
      </nav>
    );
  };

  export default HeaderMain;