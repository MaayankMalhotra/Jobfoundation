import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import accountImage from './assets/images/login-bg.jpg'
// import logoDark from './assets/images/logo-dark.png'
import ImageAuth from './components/authLeftSide.js'


const LoginPage = () => {
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
      const response = await fetch('https://girangroup.com/jobfoundation/public/api/employee/login', {
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
      //  console.log('Parsed Response Data:', data);
  
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log(data);
          if(data.user.role_id==2){navigate('/employee-dashboard');}
          else{navigate('/employer-dashboard');}
         
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
            <div className='col-md-6 '>
                <div className='sideAccountContent d-flex'>
                    <div className='innerFormAccount align-self-center '>
                      <h1>Sign In 123</h1>
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
                                <i className={`ri-eye${passwordVisible ? '-fill' : ''} align-middle`}></i>
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

export default LoginPage;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';



// import AOS from "aos";
// // import "aos/dist/aos.css";

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import "./assets/css/bootstrap.min.css"; // Icons
// // import "./assets/css/app.min.css"; // Main app CSS
// // import "./assets/css/custom.min.css"; // Custom styles

// const LoginPage = () => {
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add your login logic here
//     console.log('Login form submitted');
//   };

//   return (
//     <div className="auth-page-wrapper pt-5">
//       {/* Auth page background */}
//       <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
//         <div className="bg-overlay"></div>
//         <div className="shape">
//           <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
//             <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
//           </svg>
//         </div>
//       </div>

//       {/* Auth page content */}
//       <div className="auth-page-content">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="text-center mt-sm-5 mb-4 text-white-50">
//                 <div>
//                   <Link to="/" className="d-inline-block auth-logo">
//                     <img
//                       src={`${process.env.PUBLIC_URL}/images/logo-light.png`}
//                       alt="Logo"
//                       height="20"
//                     />
//                   </Link>
//                 </div>
//                 <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
//               </div>
//             </div>
//           </div>

//           {/* Login form */}
//           <div className="row justify-content-center">
//             <div className="col-md-8 col-lg-6 col-xl-5">
//               <div className="card mt-4">
//                 <div className="card-body p-4">
//                   <div className="text-center mt-2">
//                     <h5 className="text-primary">Welcome Back!</h5>
//                     <p className="text-muted">Sign in to continue to Velzon.</p>
//                   </div>
//                   <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                       <label htmlFor="username" className="form-label">Username</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="username"
//                         placeholder="Enter username"
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <div className="float-end">
//                         <Link to="/auth-pass-reset-basic" className="text-muted">
//                           Forgot password?
//                         </Link>
//                       </div>
//                       <label className="form-label" htmlFor="password-input">Password</label>
//                       <div className="position-relative auth-pass-inputgroup mb-3">
//                         <input
//                           type={passwordVisible ? 'text' : 'password'}
//                           className="form-control pe-5 password-input"
//                           placeholder="Enter password"
//                           id="password-input"
//                         />
//                         <button
//                           className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
//                           type="button"
//                           onClick={togglePasswordVisibility}
//                         >
//                           <i className={`ri-eye${passwordVisible ? '-fill' : ''} align-middle`}></i>
//                         </button>
//                       </div>
//                     </div>

//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="auth-remember-check"
//                       />
//                       <label className="form-check-label" htmlFor="auth-remember-check">
//                         Remember me
//                       </label>
//                     </div>

//                     <div className="mt-4">
//                       <button className="btn btn-success w-100" type="submit">
//                         Sign In
//                       </button>
//                     </div>

//                     <div className="mt-4 text-center">
//                       <div className="signin-other-title">
//                         <h5 className="fs-13 mb-4 title">Sign In with</h5>
//                       </div>
//                       <div>
//                         <button type="button" className="btn btn-primary btn-icon waves-effect waves-light">
//                           <i className="ri-facebook-fill fs-16"></i>
//                         </button>
//                         <button type="button" className="btn btn-danger btn-icon waves-effect waves-light">
//                           <i className="ri-google-fill fs-16"></i>
//                         </button>
//                         <button type="button" className="btn btn-dark btn-icon waves-effect waves-light">
//                           <i className="ri-github-fill fs-16"></i>
//                         </button>
//                         <button type="button" className="btn btn-info btn-icon waves-effect waves-light">
//                           <i className="ri-twitter-fill fs-16"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>

//               <div className="mt-4 text-center">
//                 <p className="mb-0">
//                   Don't have an account?{' '}
//                   <Link to="/auth-signup-basic" className="fw-semibold text-primary text-decoration-underline">
//                     Signup
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="text-center">
//                 <p className="mb-0">
//                   © {new Date().getFullYear()} Velzon. Crafted with{' '}
//                   <i className="mdi mdi-heart text-danger"></i> by Themesbrand
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;