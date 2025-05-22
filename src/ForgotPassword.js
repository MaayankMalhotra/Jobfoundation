// import React from 'react';
 // Adjust the path as necessary

// const ForgotPassword = () => {
//     return (
//         <div className="auth-page-wrapper pt-5">
//             {/* Auth page background */}
//             <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
//                 <div className="bg-overlay"></div>
//                 <div className="shape">
//                     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
//                         <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
//                     </svg>
//                 </div>
//             </div>

//             {/* Auth page content */}
//             <div className="auth-page-content">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="text-center mt-sm-5 mb-4 text-white-50">
//                                 <div>
//                                     <a href="index" className="d-inline-block auth-logo">
//                                         <img  src="https://girangroup.com/jobfoundation/public/build/images/logo-light.png" alt="" height="50" />
//                                     </a>
//                                 </div>
//                                 <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="row justify-content-center">
//                         <div className="col-md-8 col-lg-6 col-xl-5">
//                             <div className="card mt-4 card-bg-fill">
//                                 <div className="card-body p-4">
//                                     <div className="text-center mt-2">
//                                         <h5 className="text-primary">Forgot Password?</h5>
//                                         <p className="text-muted">Reset password with velzon</p>
//                                         <lord-icon
//                                             src="https://cdn.lordicon.com/rhvddzym.json"
//                                             trigger="loop"
//                                             colors="primary:#0ab39c"
//                                             className="avatar-xl">
//                                         </lord-icon>
//                                     </div>

//                                     <div className="alert alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
//                                         Enter your email and instructions will be sent to you!
//                                     </div>
//                                     <div className="p-2">
//                                         <form>
//                                             <div className="mb-4">
//                                                 <label className="form-label">Email</label>
//                                                 <input type="email" className="form-control" id="email" placeholder="Enter Email" />
//                                             </div>
//                                             <div className="text-center mt-4">
//                                                 <button className="btn btn-success w-100" type="submit">Send Reset Link</button>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="mt-4 text-center">
//                                 <p className="mb-0">Wait, I remember my password... <a href="auth-signin-basic" className="fw-semibold text-primary text-decoration-underline"> Click here </a></p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Footer */}
//             <footer className="footer">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="text-center">
//                                 <p>© {new Date().getFullYear()} Velzon. Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default ForgotPassword;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lordicon/react';
import ImageAuth from './components/authLeftSide.js'
 // Adjust the path as necessary

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        setIsLoading(true); // Set loading state
        setMessage(''); // Clear any previous messages

        try {
            const response = await fetch('https://girangroup.com/jobfoundation/public/api/forget-password-send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Send email in the request body
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset instructions have been sent to your email.'); // Success message
            } else {
                setMessage(data.message || 'Something went wrong. Please try again.'); // Error message from API
            }
        } catch (error) {
            setMessage('An error occurred. Please check your connection and try again.'); // Network error
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (

        <div className="auth-page-wrapper">
            <div className="accountPageContain">
                <div className="row">
                    <ImageAuth />
                    <div className='col-md-6 '>
                        <div className='sideAccountContent d-flex'>
                            <div className='innerFormAccount align-self-center'>
                                <h1>Forgot Password?</h1>
                                <div className="alert alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
                                    Enter your email and instructions will be sent to you!
                                </div>
                                {message && (
                                        <div className={`alert ${message.includes('sent') ? 'alert-success' : 'alert-danger'} text-center mb-2 mx-2`} role="alert">
                                            {message}
                                        </div>
                                    )}
                                    
                                    <div className="">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-custom"
                                                    id="email"
                                                    placeholder="Enter Email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="text-center mt-4">
                                                <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
                                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="mb-0">
                                        Wait, I remember my password... 
                                        <Link to="/LoginPage" style={{ color: 'blue', textDecoration: 'underline' }}>
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

export default ForgotPassword;