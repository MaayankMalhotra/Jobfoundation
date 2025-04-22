// import AOS from "aos";
import "aos/dist/aos.css";
// import LoginPage from './LoginPage'; // Your login component
// import { BrowserRouter, Routes, Route, Link,useNavigate } from 'react-router-dom';
import "../assets/css/bootstrap.min.css"; // Icons
import "../assets/css/app.min.css"; // Main app CSS
import "../assets/css/custom.min.css"; // Custom styles
import React  from 'react';
import { Link } from 'react-router-dom';
import logoDark from '../assets/images/logo-dark.png'

const HeaderMain = () => {
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
  
            <div>
              <Link to="/LoginPage" className="btn btn-soft-primary">
                <i className="ri-user-3-line align-bottom me-1"></i> Login & Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default HeaderMain;