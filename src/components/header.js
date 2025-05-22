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
import dummyUser from '../assets/images/dummy_avatar.jpg'
const HeaderMain = () => {
  const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [isEmployer, setIsEmployer] = useState(false);
    // const [userProfileImage, setUserProfileImage] = useState(null);
    let userRole = null;
    try {
      userRole = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      console.error("Invalid JSON in localStorage:", e);
    }
    useEffect(() => {
      try {
        // localStorage.setItem("profile", JSON.stringify(profile));
        // localStorage.setItem('user', JSON.stringify(profile));
        const storedUser = JSON.parse(localStorage.getItem('user'));
        console.log("User from localStorage:", storedUser);

        if (storedUser) {
          setUser({
            name: storedUser.first_name || 'User Name',
            username: storedUser.username,
            email: storedUser.email,
            avatar: storedUser.employee.profile || dummyUser,
          });

          setIsEmployer(storedUser.role_id == 2);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Error reading user from localStorage:", e);
      }
    }, []);
  
//    useEffect(() => {
//   const fetchEmployeeProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('https://girangroup.com/jobfoundation/public/api/employee/profile', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch employee profile');
//       }

//       const data = await response.json();
//       const profilePath = data.data?.employee?.profile;

//       if (profilePath) {
//         const fullImageUrl = `https://girangroup.com/jobfoundation/public/storage/${profilePath}`;
//         setUserProfileImage(fullImageUrl);
//       } else {
//         setUserProfileImage(null);
//       }

//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   fetchEmployeeProfile();
// }, []);

    const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
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
                <Link className="nav-link active" to="/#hero">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/#about">About us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/#contact">Contact us</Link>
              </li>
            </ul>


            {user ? (
              <>
                {userRole?.role_id === 2 && (
                <div className="buttonGroupHeader">
                  <Link to="/job-recommended" className="btn btn-primary me-3 btn-sm">Recommended Jobs</Link>
                </div>
                )}
                <div className="dropdown dropDownCustom">
                  <div className="dropdown-toggle" onClick={toggleDropdown}>
                    <img
                      className="rounded-circle header-profile-user"
                      src={
                          user?.avatar
                            ? `https://girangroup.com/jobfoundation/public/storage/${user.avatar}`
                            : dummyUser
                        }
                      alt="Header Avatar"
                      style={{ width: '50px', height: '50px',objectFit:'cover' }}
                    />
                    <span className="d-flex iconArrwoDown">
                      <i class="ri-arrow-drop-down-fill"></i>
                    </span>
                  </div>

                  <ul className={`dropdownContentStyle dropdown-menu ${showDropdown ? 'showDropDown' : ''}`}>
                    <li>
                      <Link to={userRole?.role_id === 2 ? '/profile' : '/job-post'} className="dropdown-item dropDownLinkProfile">
                        <div className="imageProfileInside">
                          <img
                            className="rounded-circle header-profile-user"
                            src={`https://girangroup.com/jobfoundation/public/storage/${user.avatar}`}
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
                      <Link className="dropdown-item" to={userRole?.role_id === 2 ? '/profile-edit' : '/employer-profile-edit'}>
                        <i className="material-icons text-muted fs-16 align-middle me-1">settings</i>Settings
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#" onClick={handleLogout}>
                        <i className="material-icons text-muted fs-16 align-middle me-1">logout</i> Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              
              </>
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