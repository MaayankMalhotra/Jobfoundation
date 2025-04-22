import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import ImageAuth from './components/authLeftSide.js'
const EmployerRegisterPage = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    company_name: "",
    number_of_employees: "",
    country_id: "",
    state_id: "",
    street: "",
    city: "",
    postal_code: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // State for countries and states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://girangroup.com/jobfoundation/public/api/countries");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country_id) {
      const fetchStates = async () => {
        try {
          const response = await fetch(`https://girangroup.com/jobfoundation/public/api/states/${formData.country_id}`);
          const data = await response.json();
          setStates(data);
          // Reset state_id when country changes
          setFormData((prev) => ({ ...prev, state_id: "" }));
        } catch (error) {
          console.error("Error fetching states:", error);
          setStates([]);
          setFormData((prev) => ({ ...prev, state_id: "" }));
        }
      };
      fetchStates();
    } else {
      setStates([]);
      setFormData((prev) => ({ ...prev, state_id: "" }));
    }
  }, [formData.country_id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Frontend validation
    const newErrors = {};

    // Trim input values to avoid spaces affecting validation
    const trimmedData = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "string") {
        trimmedData[key] = formData[key].trim();
      } else {
        trimmedData[key] = formData[key];
      }
    });

    if (!trimmedData.username) newErrors.username = "Username is required.";
    if (!trimmedData.first_name) newErrors.first_name = "First name is required.";
    if (!trimmedData.last_name) newErrors.last_name = "Last name is required.";
    if (!trimmedData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(trimmedData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!trimmedData.phone) newErrors.phone = "Phone is required.";
    if (!trimmedData.password) {
      newErrors.password = "Password is required.";
    } else if (trimmedData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (trimmedData.password !== trimmedData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
    }
    if (!trimmedData.company_name) newErrors.company_name = "Company name is required.";
    if (!trimmedData.number_of_employees) newErrors.number_of_employees = "Number of employees is required.";
    if (!trimmedData.country_id) newErrors.country_id = "Country is required.";
    if (!trimmedData.state_id) newErrors.state_id = "State is required.";
    if (!trimmedData.street) newErrors.street = "Street is required.";
    if (!trimmedData.city) newErrors.city = "City is required.";
    if (!trimmedData.postal_code) newErrors.postal_code = "Postal code is required.";

    // Set errors
    setErrors(newErrors);

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      try {
        // Send POST request to the API
        const response = await fetch("https://girangroup.com/jobfoundation/public/api/employer/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trimmedData),
        });

        // Handle response
        const result = await response.json();

        if (response.ok) {
          console.log("Registration successful:", result);
          alert("Registration successful!");
          // Redirect if needed
          navigate("/employer-dashboard");
        } else {
          console.error("Registration failed:", result);

          // Backend validation errors
          if (result.errors) {
            setErrors(result.errors); // Set backend validation errors
          } else {
            alert(result.message || "Registration failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Auth page background */}
      <div className="accountPageContain">
        <div className="row">
          <ImageAuth />
          <div className='col-md-6 '>
                <div className='sideAccountContent d-flex'>
                  <div className='innerFormAccount signUpForm'>
                    <h1>Sign Up</h1>
                    <div className="">
                          <form onSubmit={handleSubmit} noValidate>
                            <div className="row gx-3">
                              {/* Username */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="username" className="form-label">
                                  Username <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control form-control-custom ${errors.username ? "is-invalid" : ""}`}
                                  id="username"
                                  name="username"
                                  value={formData.username}
                                  onChange={handleInputChange}
                                  placeholder="Enter username"
                                  required
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                              </div>

                              {/* First Name */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="first_name" className="form-label">
                                  First Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control form-control-custom ${errors.first_name ? "is-invalid" : ""}`}
                                  id="first_name"
                                  name="first_name"
                                  value={formData.first_name}
                                  onChange={handleInputChange}
                                  placeholder="Enter first name"
                                  required
                                />
                                {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                              </div>

                              {/* Last Name */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="last_name" className="form-label">
                                  Last Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control form-control-custom ${errors.last_name ? "is-invalid" : ""}`}
                                  id="last_name"
                                  name="last_name"
                                  value={formData.last_name}
                                  onChange={handleInputChange}
                                  placeholder="Enter last name"
                                  required
                                />
                                {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                              </div>

                              {/* Email */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="email" className="form-label">
                                  Email <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="email"
                                  className={`form-control form-control-custom ${errors.email ? "is-invalid" : ""}`}
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="Enter email address"
                                  required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                              </div>

                              {/* Phone */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="phone" className="form-label">
                                  Phone <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  className={`form-control form-control-custom ${errors.phone ? "is-invalid" : ""}`}
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="Enter phone number"
                                  required
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                              </div>

                              {/* Password */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="password" className="form-label">
                                  Password <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="password"
                                  className={`form-control form-control-custom ${errors.password ? "is-invalid" : ""}`}
                                  id="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  placeholder="Enter password"
                                  required
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                              </div>

                              {/* Password Confirmation */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="password_confirmation" className="form-label">
                                  Confirm Password <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="password"
                                  className={`form-control form-control-custom ${errors.password_confirmation ? "is-invalid" : ""}`}
                                  id="password_confirmation"
                                  name="password_confirmation"
                                  value={formData.password_confirmation}
                                  onChange={handleInputChange}
                                  placeholder="Confirm password"
                                  required
                                />
                                {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                              </div>

                              {/* Company Name */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="company_name" className="form-label">
                                  Company Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control form-control-custom ${errors.company_name ? "is-invalid" : ""}`}
                                  id="company_name"
                                  name="company_name"
                                  value={formData.company_name}
                                  onChange={handleInputChange}
                                  placeholder="Enter company name"
                                  required
                                />
                                {errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
                              </div>

                              {/* Number of Employees */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="number_of_employees" className="form-label">
                                  Number of Employees <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  className={`form-control form-control-custom ${errors.number_of_employees ? "is-invalid" : ""}`}
                                  id="number_of_employees"
                                  name="number_of_employees"
                                  value={formData.number_of_employees}
                                  onChange={handleInputChange}
                                  placeholder="Enter number of employees"
                                  required
                                />
                                {errors.number_of_employees && <div className="invalid-feedback">{errors.number_of_employees}</div>}
                              </div>

                              {/* Country */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="country_id" className="form-label">
                                  Country <span className="text-danger">*</span>
                                </label>
                                <select
                                  className={`form-control form-control-custom ${errors.country_id ? "is-invalid" : ""}`}
                                  id="country_id"
                                  name="country_id"
                                  value={formData.country_id}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Country</option>
                                  {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>
                                {errors.country_id && <div className="invalid-feedback">{errors.country_id}</div>}
                              </div>

                              {/* State */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="state_id" className="form-label">
                                  State <span className="text-danger">*</span>
                                </label>
                                <select
                                  className={`form-control form-control-custom ${errors.state_id ? "is-invalid" : ""}`}
                                  id="state_id"
                                  name="state_id"
                                  value={formData.state_id}
                                  onChange={handleInputChange}
                                  required
                                  disabled={!formData.country_id} // Disable if no country is selected
                                >
                                  <option value="">Select State</option>
                                  {states.map((state) => (
                                    <option key={state.id} value={state.id}>
                                      {state.name}
                                    </option>
                                  ))}
                                </select>
                                {errors.state_id && <div className="invalid-feedback">{errors.state_id}</div>}
                              </div>

                              {/* Street */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="street" className="form-label">
                                  Street <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control form-control-custom ${errors.street ? "is-invalid" : ""}`}
                                  id="street"
                                  name="street"
                                  value={formData.street}
                                  onChange={handleInputChange}
                                  placeholder="Enter street"
                                  required
                                />
                                {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                              </div>

                              {/* City */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="city" className="form-label">
                                  City <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control form-control-custom ${errors.city ? "is-invalid" : ""}`}
                                  id="city"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  placeholder="Enter city"
                                  required
                                />
                                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                              </div>

                              {/* Postal Code */}
                              <div className="col-md-6 mb-3">
                                <label htmlFor="postal_code" className="form-label">
                                  Postal Code <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  className={`form-control form-control-custom ${errors.postal_code ? "is-invalid" : ""}`}
                                  id="postal_code"
                                  name="postal_code"
                                  value={formData.postal_code}
                                  onChange={handleInputChange}
                                  placeholder="Enter postal code"
                                  required
                                />
                                {errors.postal_code && <div className="invalid-feedback">{errors.postal_code}</div>}
                              </div>
                            </div>

                            {/* Terms of Use */}
                          

                            {/* Submit Button */}
                            <div className="mt-4">
                              <button type="submit" className="btn btn-primary w-100">
                                Sign Up
                              </button>
                            </div>
                          </form>
                    </div>
                    <div className="my-4 text-center">
                      <p className="mb-0">
                        Already have an account?{" "}
                        <Link to="/LoginPage" className="fw-semibold text-primary text-decoration-underline">
                                            Login
                                          </Link>
                      </p>
                      <p className="mb-0 pt-3 text-muted">
                        ©
                        <script>document.write(new Date().getFullYear())</script>{" "}
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

export default EmployerRegisterPage;