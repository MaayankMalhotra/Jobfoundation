import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import ImageAuth from './components/authLeftSide.js'
const EmployeeOrEmployer = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page-wrapper">
      <div className="accountPageContain">
          <div className="row">
              <ImageAuth />
              <div className='col-md-7'>
                  <div className='sideAccountContent d-flex'>
                      <div className='innerFormAccount accountSizeMaxStyle align-self-center'>
                      <div className="text-center">
                        <h1>Select Your Role</h1>
                        <p className="text-muted">Choose whether you are an Employee or an Employer.</p>
                      </div>

                      <div className="mt-4">
                        <button 
                          className="btn btn-primary w-100 mb-3" 
                          onClick={() => navigate('/auth-signup-basic-employee')}
                        >
                          Register as Employee
                        </button>
                        <button 
                          className="btn btn-primary w-100" 
                          onClick={() => navigate('/auth-signup-basic-employer')}
                        >
                          Register as Employer
                        </button>
                      </div>
                    <div className="mt-4 text-center">
                    <p className="mb-0">
                      Already have an account?{" "}
                      <Link to="/LoginPage" className="fw-semibold text-primary text-decoration-underline">
                        Login
                      </Link>
                    </p>
                    </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default EmployeeOrEmployer;