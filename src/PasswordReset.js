import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ImageAuth from './components/authLeftSide.js'
const PasswordReset = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(''); // State to store the token from the URL
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the current URL

  // Extract the token from the URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get('token'); // Get the token from the URL
    if (urlToken) {
      setToken(urlToken); // Set the token in state
    } else {
      setError('Invalid or missing token.'); // Handle missing token
    }
  }, [location]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing token.');
      return;
    }

    try {
      console.log('Password Reset Request Initiated');
      const response = await fetch('https://girangroup.com/jobfoundation/public/api/forget-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, token }), // Include the token in the request body
      });

      console.log('Response Status:', response.status); // Log status code
      console.log('Response Headers:', response.headers); // Log response headers

      const textData = await response.text(); // Capture raw response
      console.log('Raw Response Data:', textData);

      try {
        const data = JSON.parse(textData); // Try parsing JSON
        console.log('Parsed Response Data:', data);

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/employee-dashboard'); // Redirect to dashboard
        } else {
          setError(data.message || 'Password reset failed. Please try again.');
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
    <div className="auth-page-wrapper pt-5">
        <div className="accountPageContain">
          <div className="row">
            <ImageAuth />
            <div className='col-md-6 '>
              <div className='sideAccountContent'>
                <div className='innerFormAccount signUpForm'>
                  <h1>Password Reset</h1>
                  {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label" htmlFor="password-input">New Password</label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <input
                                type={passwordVisible ? 'text' : 'password'}
                                className="form-control pe-5 password-input"
                                placeholder="Enter new password"
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

                          <div className="mt-4">
                            <button className="btn btn-success w-100" type="submit">
                              Reset Password
                            </button>
                          </div>
                    </form>
                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        Remember your password?{' '}
                        <Link to="/login" className="fw-semibold text-primary text-decoration-underline">
                          Login
                        </Link>
                      </p>
                      <p className="mb-0 pt-3">
                        © {new Date().getFullYear()} {' '}
                        <i className="mdi mdi-heart text-danger"></i> Powered by <strong><Link to="/">CRACODE</Link></strong>
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

export default PasswordReset;