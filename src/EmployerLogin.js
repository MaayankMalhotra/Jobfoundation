import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import accountImage from './assets/images/login-bg.jpg'
// import logoDark from './assets/images/logo-dark.png'
import ImageAuth from './components/authLeftSide.js'


const EmployerLoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
   //   console.log('Login Request Initiated');
     // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await fetch('https://girangroup.com/jobfoundation/public/api/employer/login', {
      //const response = await fetch('http://127.0.0.1:8000/api/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'X-CSRF-TOKEN': csrfToken, 
        },
        body: JSON.stringify({ email, password }),
      });
  
     // console.log('Response Status:', response.status); // Log status code
      //console.log('Response Headers:', response.headers); // Log response headers
  
      const textData = await response.text(); // Capture raw response
      //console.log('Raw Response Data:', textData);
  
      try {
        const data = JSON.parse(textData); // Try parsing JSON
       console.log('Parsed Response Data:', data);
        
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log(data);
          if(data.user.role_id==2){navigate('/profile');}
          else{navigate('/job-post');}
         
        } else {
          setError(data.message || 'Login failed! Please check your credentials.');
        }
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        setError('Invalid response from server. Please try again.');
      }
  
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-page-wrapper">
        <div className="accountPageContain">
          <div className="row">
            <ImageAuth />
            <div className='col-md-7'>
                <div className='sideAccountContent d-flex'>
                    <div className='innerFormAccount accountSizeMaxStyle align-self-center '>
                      <h1>Sign In </h1>
                      {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control form-control-custom"
                              id="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <div className="float-end">
                              <Link to="/auth-pass-reset-basic" className="text-muted">Forgot password?</Link>
                            </div>
                            <label className="form-label" htmlFor="password-input">Password</label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <input
                                type={passwordVisible ? 'text' : 'password'}
                                className="form-control form-control-custom pe-5 password-input"
                                placeholder="Enter password"
                                id="password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <button
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                                type="button"
                                onClick={togglePasswordVisibility}
                              >
                                <i className={`${passwordVisible ? 'ri-eye-off-line' : 'ri-eye-line' } align-middle`}></i>
                              </button>
                            </div>
                          </div>

                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="auth-remember-check" />
                            <label className="form-check-label" htmlFor="auth-remember-check">
                              Remember me
                            </label>
                          </div>

                          <div className="mt-4">
                            <button className="btn btn-primary w-100" type="submit">
                              Sign In
                            </button>
                          </div>
                        
                              <div className="text-center pt-2">
                                <p>Don't have an account? <Link to="/employee-employer-option">Signup</Link></p>
                                <p className="mb-0 pt-3">
                                  © {new Date().getFullYear()} {' '}
                                  <i className="mdi mdi-heart text-danger"></i> Powered by <strong><Link to="/">CRACODE</Link></strong>
                                </p>
                              </div>

                          {/* <div className="mt-4 text-center">
                            <div className="signin-other-title">
                              <h5 className="fs-13 mb-4 title">Sign In with</h5>
                            </div>
                            <div>
                              <button type="button" className="btn btn-primary btn-icon waves-effect waves-light">
                                <i className="ri-facebook-fill fs-16"></i>
                              </button>
                              <button type="button" className="btn btn-danger btn-icon waves-effect waves-light">
                                <i className="ri-google-fill fs-16"></i>
                              </button>
                              <button type="button" className="btn btn-dark btn-icon waves-effect waves-light">
                                <i className="ri-github-fill fs-16"></i>
                              </button>
                              <button type="button" className="btn btn-info btn-icon waves-effect waves-light">
                                <i className="ri-twitter-fill fs-16"></i>
                              </button>
                            </div>
                          </div> */}
                        </form>
                    </div>
                </div>
            </div>
          </div>
        </div>


      

      {/* <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <p className="mb-0">
                  © {new Date().getFullYear()} {' '}
                  <i className="mdi mdi-heart text-danger"></i> Powered by C R A C O D E
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default EmployerLoginPage;
