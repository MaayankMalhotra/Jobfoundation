import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import Logout from './Logout';
import dummyUser from './assets/images/dummy_avatar.jpg'

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser);
    if (storedUser) {
      setUser({
        name: storedUser.name || 'User Name',
        avatar: storedUser.avatar || dummyUser, // Fallback avatar
      });
      setIsEmployer(storedUser.role_id == 2); // Check if role is 2 (employer)
    } else {
      setUser(null);
      setIsEmployer(false); // No user or role not 2
    }
  }, []);

  return (
    <div className="app-menu navbar-menu">
      {/* LOGO */}
      <div className="navbar-brand-box">
        <Link to="/index" className="logo d-flex align-items-center">
          <img
            src="https://girangroup.com/jobfoundation/public/build/images/logo-light.png"
            className="card-logo card-logo-dark"
            alt="logo dark"
            height="50"
          />
        </Link>
        <button
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover text-white"
        >
          <i className="ri-record-circle-line"></i>
        </button>
      </div>

      {/* User Dropdown (shown only if user exists) */}
      {user && (
        <div className="dropdown sidebar-user m-1 rounded">
          <button
            type="button"
            className="btn material-shadow-none d-flex align-items-center gap-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              className="rounded-circle header-profile-user"
              src={user.avatar}
              alt="Header Avatar"
              style={{ width: '40px', height: '40px' }}
            />
            <span className="text-start text-white">
              <span className="d-block fw-medium sidebar-user-name-text">{user.name}</span>
              <span className="d-block fs-14 sidebar-user-name-sub-text">
                <i className="ri ri-circle-fill fs-10 text-success align-baseline"></i>{' '}
                <span className="align-middle">Online</span>
              </span>
            </span>
          </button>
          <div className="dropdown-menu dropdown-menu-end">
            <h6 className="dropdown-header">Welcome {user.name}!</h6>
            <Link className="dropdown-item" to={isEmployer ? "/employer-profile" : "/profile"}>
              <i className="material-icons text-muted fs-16 align-middle me-1">account_circle</i>
              <span>Profile</span>
            </Link>
            <Link className="dropdown-item" to="/apps-chat">
              <i className="material-icons text-muted fs-16 align-middle me-1">message</i>
              <span>Messages</span>
            </Link>
            <Link className="dropdown-item" to="/apps-tasks-kanban">
              <i className="material-icons text-muted fs-16 align-middle me-1">task</i>
              <span>Taskboard</span>
            </Link>
            <Link className="dropdown-item" to="/pages-faqs">
              <i className="material-icons text-muted fs-16 align-middle me-1">help</i>
              <span>Help</span>
            </Link>
            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/pages-profile">
              <i className="material-icons text-muted fs-16 align-middle me-1">account_balance_wallet</i>
              <span>
                Balance: <b>$5971.67</b>
              </span>
            </Link>
            <Link className="dropdown-item" to="/pages-profile-settings">
              <span className="badge bg-success-subtle text-success mt-1 float-end">New</span>
              <i className="material-icons text-muted fs-16 align-middle me-1">settings</i>
              <span>Settings</span>
            </Link>
            <Link className="dropdown-item" to="/auth-lockscreen-basic">
              <i className="material-icons text-muted fs-16 align-middle me-1">lock</i>
              <span>Lock screen</span>
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => console.log('Logout')}>
              <i className="material-icons text-muted fs-16 align-middle me-1">logout</i>
              <span>Logout</span>
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div id="scrollbar">
        <div className="container-fluid">
          <ul className="navbar-nav" id="navbar-nav">
            <li className="menu-title">
              <span className="text-white text-uppercase">Menu</span>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link text-white" to="/employer-profile">
                <i className="ri ri-dashboard-2-line me-2"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link text-white" to="/job-post">
                <i className="ri ri-briefcase-line me-2"></i>
                <span>Add Job Post</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link text-white" to="/employer-profile-edit">
                <i className="ri ri-user-settings-line me-2"></i>
                <span>Profie Edit Employer</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link text-white" to="/logout">
                <i className="ri ri-user-settings-line me-2"></i>
                <span>Logout</span>
              </Link>
            </li>
            {/* {isEmployer ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/profile">
                    <i className="ri ri-dashboard-2-line me-2"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/job-board">
                    <i className="ri ri-briefcase-line me-2"></i>
                    <span>Job Board</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/profile-edit">
                    <i className="ri ri-user-settings-line me-2"></i>
                    <span>Edit Employee</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/logout">
                    <i className="ri ri-user-settings-line me-2"></i>
                    <span>Logout</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/employer-profile-dashboard">
                    <i className="ri ri-dashboard-2-line me-2"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/employer-dashboard">
                    <i className="ri ri-briefcase-line me-2"></i>
                    <span>Job Openings</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/edit-employer">
                    <i className="ri ri-user-settings-line me-2"></i>
                    <span>Edit Employer</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link menu-link text-white" to="/logout">
                    <i className="ri ri-user-settings-line me-2"></i>
                    <span>Logout</span>
                  </Link>
                </li>
              </>
            )} */}
          </ul>
        </div>
      </div>
      <div className="sidebar-background"></div>
    </div>
  );
};

export default Sidebar;