import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageAuth from './components/authLeftSide.js'
import Swal from 'sweetalert2';
const RegisterPage = () => {
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
    experience: "",
    gender: "",
    ctc: "",
    ectc: "",
    notice_period: "",
    education: "",
    desired_job_type: "",
    preferred_shift: "",
    preferred_work_location: "",
    language: "",
    // cv: null,
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
  const [languages, setLanguages] = useState([]);
  const [states, setStates] = useState([]);
  const [showPassword, setShowPassword] = useState(false)
  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://girangroup.com/jobfoundation/public/api/countries");
        const data = await response.json();
        setCountries(data);
        console.log(data, 'checkData')
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

   useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await fetch("https://girangroup.com/jobfoundation/public/api/languages");
        const data = await response.json();
        setLanguages(data);
        console.log(data, 'checkDatasetLanguages')
      } catch (error) {
        console.error("Error fetching Languages:", error);
      }
    };
    fetchLanguage();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const setCanadaAndFetchStates = async () => {
      let selectedCountryId = formData.country_id;
  
      // Auto-select Canada if not already selected
      if (!selectedCountryId && countries.length > 0) {
        const canada = countries.find((c) => c.name === "Canada");
        if (canada) {
          selectedCountryId = canada.id;
          setFormData((prev) => ({ ...prev, country_id: canada.id }));
        }
      }
  
      const selectedCountry = countries.find(c => c.id === selectedCountryId);
      if (selectedCountry?.name === "Canada") {
        try {
          const response = await fetch(`https://girangroup.com/jobfoundation/public/api/states/${selectedCountryId}`);
          const data = await response.json();
          setStates(data);
  
          // Auto-select Alberta
          const alberta = data.find(state => state.name.toLowerCase() === "alberta");
          setFormData((prev) => ({
            ...prev,
            state_id: alberta?.id || "",
            postal_code: alberta ? "T5J 1N3" : ""
          }));
        } catch (error) {
          console.error("Error fetching states:", error);
          setStates([]);
          setFormData((prev) => ({ ...prev, state_id: "", postal_code: "" }));
        }
      } else {
        setStates([]);
        setFormData((prev) => ({ ...prev, state_id: "", postal_code: "" }));
      }
    };
  
    if (countries.length > 0) {
      setCanadaAndFetchStates();
    }
  }, [formData.country_id, countries]);
  
  
  

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
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
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedData.email)) {
      newErrors.email = 'Email is not valid';
    }
    if (!trimmedData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(trimmedData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }  
    if (!trimmedData.password) {
      newErrors.password = "Password is required.";
    } else if (trimmedData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } 
    if (!trimmedData.password_confirmation){
      newErrors.password_confirmation = "Confirm Password is required.";
    } 
    else if (trimmedData.password !== trimmedData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
    }
    if (!trimmedData.experience) newErrors.experience = "Experience is required.";
    if (!trimmedData.gender) newErrors.gender = "Gender is required.";
    if (!trimmedData.ctc) newErrors.ctc = "CTC is required.";
    if (!trimmedData.ectc) newErrors.ectc = "ECTC is required.";
    if (!trimmedData.notice_period) newErrors.notice_period = "Notice period is required.";
    if (!trimmedData.education) newErrors.education = "Education is required.";
    if (!trimmedData.desired_job_type) newErrors.desired_job_type = "Desired job type is required.";
    if (!trimmedData.preferred_shift) newErrors.preferred_shift = "Preferred shift is required.";
    if (!trimmedData.preferred_work_location) newErrors.preferred_work_location = "Preferred work location is required.";
    if (!trimmedData.language) newErrors.language = "Language is required.";
    if (!trimmedData.country_id) newErrors.country_id = "Country is required.";
    if (!trimmedData.state_id) newErrors.state_id = "Province is required.";
    if (!trimmedData.street) newErrors.street = "Street Address is required.";
    if (!trimmedData.city) newErrors.city = "City is required.";
    if (!trimmedData.postal_code) newErrors.postal_code = "Postal code is required.";

    // Set errors
    setErrors(newErrors);

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      try {
        // Create FormData object for file upload
        const data = new FormData();

        for (const key in formData) {
          if (formData[key] instanceof File) {
            data.append(key, formData[key]); // Append file inputs
          } else if (Array.isArray(formData[key])) {
            formData[key].forEach((item, index) => {
              data.append(`${key}[${index}]`, item);
            });
          } else {
            data.append(key, formData[key]);
          }
        }

        // Send POST request to the API
        const response = await fetch("https://girangroup.com/jobfoundation/public/api/employee/register", {
          method: "POST",
          body: data,
        });

        // Handle response
        const result = await response.json();

        if (response.ok) {
          console.log("Registration successful:", result);
          Swal.fire({
            icon: 'success',
            title: 'Registration successful!',
            text: 'Your account has been successfully created.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#5a34a0',
          });
          // alert("Registration successful!");
          // Redirect if needed
          navigate("/profile");
        } else {
          console.error("Registration failed:", result);

           if (result.errors) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: setErrors(result.errors),
                confirmButtonText: 'OK',
                confirmButtonColor: '#5a34a0',
              });
              // setErrors(result.errors); 
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: result.message || "Registration failed. Please try again.",
                confirmButtonText: 'OK',
                confirmButtonColor: '#5a34a0',
              });
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
       <div className="accountPageContain">
                <div className="row">
                  <ImageAuth />
            <div className='col-md-7'>
              <div className='sideAccountContent'>
                  <div className='innerFormAccount signUpForm'>
                  <h1>Sign Up</h1>
                  <div className="">
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="row gx-3">
                          {/* Username */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="username" className="form-label font-size-14">
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
                            <label htmlFor="first_name" className="form-label font-size-14">
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
                            <label htmlFor="last_name" className="form-label font-size-14">
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
                            <label htmlFor="email" className="form-label font-size-14">
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
                            <label htmlFor="phone" className="form-label font-size-14">
                              Phone <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-custom ${errors.phone ? "is-invalid" : ""}`}
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,10}$/.test(value)) {
                                  setFormData((prev) => ({ ...prev, phone: value }));
                                }
                              }}
                              placeholder="Enter phone number"
                              maxLength={10}
                              required
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                          </div>

                          {/* Password */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="form-label font-size-14">
                              Password <span className="text-danger">*</span>
                            </label>
                            <div class="input-group mb-2">
                              <input
                                type={`${showPassword ? 'text' : 'password'}`}
                                className={`form-control form-control-custom ${errors.password ? "is-invalid" : ""}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter password"
                                required
                              />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                              <div className="input-group-prepend customInputPasswrd" onClick={() => setShowPassword(!showPassword)}>
                                  <i className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"}`}></i>
                              </div>
                            </div>
                          </div>

                          {/* Password Confirmation */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="password_confirmation" className="form-label font-size-14">
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

                          {/* Experience */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="experience" className="form-label font-size-14">
                            Total Years of Experience <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-custom ${errors.experience ? "is-invalid" : ""}`}
                              id="experience"
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              placeholder="Enter experience"
                              required
                            />
                            {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
                          </div>

                          {/* Gender */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="gender" className="form-label font-size-14">
                              Gender <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-custom ${errors.gender ? "is-invalid" : ""}`}
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                          </div>

                          {/* Desired Job Type */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="desired_job_type" className="form-label font-size-14">
                                Employment Type Preference <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-custom ${errors.desired_job_type ? "is-invalid" : ""}`}
                              id="desired_job_type"
                              name="desired_job_type"
                              value={formData.desired_job_type}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="contractual">Contractual</option>
                              <option value="permanent">Permanent</option>
                            </select>
                            {errors.desired_job_type && <div className="invalid-feedback">{errors.desired_job_type}</div>}
                          </div>

                          {/* Preferred Shift */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="preferred_shift" className="form-label font-size-14">
                            Preferred Work Shift <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-custom ${errors.preferred_shift ? "is-invalid" : ""}`}
                              id="preferred_shift"
                              name="preferred_shift"
                              value={formData.preferred_shift}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="day">Day</option>
                              <option value="night">Night</option>
                            </select>
                            {errors.preferred_shift && <div className="invalid-feedback">{errors.preferred_shift}</div>}
                          </div>

                          {/* CTC */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="ctc" className="form-label font-size-14">
                              Current Salary (CAD/year) <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-custom ${errors.ctc ? "is-invalid" : ""}`}
                              id="ctc"
                              name="ctc"
                              value={formData.ctc}
                              onChange={handleInputChange}
                              placeholder="Enter CTC"
                              required
                            />
                            {errors.ctc && <div className="invalid-feedback">{errors.ctc}</div>}
                          </div>

                          {/* ECTC */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="ectc" className="form-label font-size-14">
                              Expected Salary (CAD/year) <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-custom ${errors.ectc ? "is-invalid" : ""}`}
                              id="ectc"
                              name="ectc"
                              value={formData.ectc}
                              onChange={handleInputChange}
                              placeholder="Enter ECTC"
                              required
                            />
                            {errors.ectc && <div className="invalid-feedback">{errors.ectc}</div>}
                          </div>

                          {/* Notice Period */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="notice_period" className="form-label font-size-14">
                              Notice Period (in Days) <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-custom ${errors.notice_period ? "is-invalid" : ""}`}
                              id="notice_period"
                              name="notice_period"
                              value={formData.notice_period}
                              onChange={handleInputChange}
                              placeholder="Enter notice period"
                              required
                            />
                            {errors.notice_period && <div className="invalid-feedback">{errors.notice_period}</div>}
                          </div>

                          {/* Education */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="education" className="form-label font-size-14">
                              Highest Level of Education  <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-custom ${errors.education ? "is-invalid" : ""}`}
                              id="education"
                              name="education"
                              value={formData.education}
                              onChange={handleInputChange}
                              placeholder="Enter education"
                              required
                            />
                            {errors.education && <div className="invalid-feedback">{errors.education}</div>}
                          </div>

                          {/* Preferred Work Location */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="preferred_work_location" className="form-label font-size-14">
                              Preferred Work Location <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-custom ${errors.preferred_work_location ? "is-invalid" : ""}`}
                              id="preferred_work_location"
                              name="preferred_work_location"
                              value={formData.preferred_work_location}
                              onChange={handleInputChange}
                              placeholder="Enter preferred work location"
                              required
                            />
                            {errors.preferred_work_location && <div className="invalid-feedback">{errors.preferred_work_location}</div>}
                          </div>

                          {/* Language */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="language" className="form-label font-size-14">
                            Languages Spoken <span className="text-danger">*</span>
                            </label>
                              <select
                              className={`form-control form-control-custom ${errors.language ? "is-invalid" : ""}`}
                              id="language"
                              name="language"
                              value={formData.language}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Language</option>
                              {languages.map((languageList) => (
                                <option
                                  key={languageList.id}
                                  value={languageList.id}
                                >
                                  {languageList.name}
                                </option>
                              ))}
                            </select>
                              {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                            {/* <input
                              type="text"
                              className={`form-control form-control-custom ${errors.language ? "is-invalid" : ""}`}
                              id="language"
                              name="language"
                              value={formData.language}
                              onChange={handleInputChange}
                              placeholder="Enter language"
                              required
                            />
                            {errors.language && <div className="invalid-feedback">{errors.language}</div>} */}
                          </div>

                          {/* CV Upload */}
                          {/* <div className="col-md-6 mb-3">
                            <label htmlFor="cv" className="form-label font-size-14">
                            Resume/CV Upload <sup>(PDF/DOC) <span className="text-muted">(Optional)</span> </sup> 
                            </label>
                            <input
                              type="file"
                              className={`form-control form-control-custom ${errors.cv ? "is-invalid" : ""}`}
                              id="cv"
                              name="cv"
                              onChange={handleInputChange}
                              accept=".pdf,.doc,.docx"
                            />
                            {errors.cv && <div className="invalid-feedback">{errors.cv}</div>}
                          </div> */}

                          {/* Country */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="country_id" className="form-label font-size-14">
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
                              <option
                                key={country.id}
                                value={country.id}
                                disabled={country.name !== "Canada"}
                              >
                                {country.name}
                              </option>
                            ))}
                          </select>
                            {errors.country_id && <div className="invalid-feedback">{errors.country_id}</div>}
                          </div>

                          {/* State */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="state_id" className="d-flex form-label font-size-14">
                              Province  <span className="text-danger">*</span>
                              <sup>
                              {formData.state_id &&
                                  states.find((s) => s.id === formData.state_id)?.name.toLowerCase() !== "Alberta" && (
                                    <div className="text-danger mt-2">
                                      Only Alberta allowed
                                    </div>
                                )}
                              </sup>
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
                              <option value="">Select Province</option>
                              {states.map((state) => (
                                <option key={state.id} value={state.id} disabled={state.name.toLowerCase() !== "alberta"}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                            
                            {errors.state_id && <div className="invalid-feedback">{errors.state_id}</div>}
                          </div>

                          {/* Street */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="street" className="form-label font-size-14">
                              Street Address <span className="text-danger">*</span>
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
                            <label htmlFor="city" className="form-label font-size-14">
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
                            <label htmlFor="postal_code" className="form-label font-size-14">
                              Postal Code <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-custom ${errors.postal_code ? "is-invalid" : ""}`}
                              id="postal_code"
                              name="postal_code"
                              value={formData.postal_code}
                              onChange={handleInputChange}
                              placeholder="Enter postal code"
                              required
                              disabled // <--- make it read-only if auto-filled
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
                    <div className="mt-4 text-center">
                        <p className="mb-0">
                          Already have an account?{" "}
                          <Link to="/LoginPage" className="fw-semibold text-primary text-decoration-underline">
                                              Login
                                            </Link>
                        </p>
                        <p className="mb-3 pt-3">
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

export default RegisterPage;