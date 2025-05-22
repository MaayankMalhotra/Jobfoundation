import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './EditEmployer.css';
import Loader from './components/loader';
import TopHeaderMain from './components/TopHearderEmplyoer';
import SidebarMenu from './components/sidebarMenus';
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2';
import dummyImage from './assets/images/companyLogo.jpg'

const EditEmployer = () => {
  const [activeTab, setActiveTab] = useState('personalDetails');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    company_name: '',
    number_of_employees: '',
    country_id: '',
    state_id: '',
    street: '',
    city: '',
    postal_code: '',
    skills: [], 
    about_us:'',
    logo: null
  });
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [skills, setSkills] = useState([]); // Available skills from API
  const [customSkill, setCustomSkill] = useState(''); // Custom skill input
  const [errors, setErrors] = useState({});
  const [imageProfile, setImageProfile] = useState(null);
  const [btnLoader , setBtnLoader] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setImageProfile(imageUrl);
    }
    setFormData({ ...formData, logo: file })
  };



  // Fetch employer data and skills
  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/employer/profile', {
          headers: { Authorization: `Bearer ${token}`},
        });

        const employer = response.data.data;
        const employerData = employer.employer;
        const address = employer.address;

        setImageProfile(`https://girangroup.com/jobfoundation/public/storage/${employerData.logo}`)
        console.log(response.data.data, 'Update Profile Data')

        let skillsArray = [];
        if (employerData.skills) {
          if (typeof employerData.skills === 'string') {
            skillsArray = employerData.skills.split(',').map(id => id.trim());
          } else if (Array.isArray(employerData.skills)) {
            skillsArray = employerData.skills.map(id => id.toString());
          }
        }

        setFormData({
          first_name: employer.first_name || '',
          last_name: employer.last_name || '',
          phone: employer.phone || '',
          email: employer.email || '',
          logo: employerData.logo || dummyImage,
          company_name: employerData.company_name || '',
          number_of_employees: employerData.number_of_employees || '',
          country_id: address.country_id || '',
          state_id: address.state_id || '',
          street: address.street || '',
          city: address.city || '',
          postal_code: address.postal_code || '',
          skills: skillsArray,
          about_us: employerData.about_us
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employer data:', error.response?.data || error.message);
        setLoading(false);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/skill-list');
        const formattedSkills = response.data.map(skill => ({
          value: skill.id.toString(),
          label: skill.skill_name,
        }));
        setSkills(formattedSkills);
      } catch (error) {
        console.error('Error fetching skills:', error.response?.data || error.message);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchEmployerData();
    fetchSkills();
    fetchCountries();
  }, []);

  // Fetch states when country_id changes
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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };
  // const [editorContent, setEditorContent] = useState('');
const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      about_us: content,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "company_name",
    "number_of_employees",
    "country_id",
    "state_id",
    "street",
    "city",
    "postal_code",
    "about_us" // Add this if it's required
  ];
  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].toString().trim() === "") {
      newErrors[field] = "This field is required";
    }
  });
  
  const phoneRegex = /^[0-9]{10,}$/;
  if (formData.phone && !phoneRegex.test(formData.phone)) {
    newErrors.phone = "Phone number must be at least 10 digits and only contain numbers";
  }
  
  console.log(newErrors, 'newErrors')
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  setBtnLoader(true);
  try {
    const token = localStorage.getItem('token');
    const skillsString = formData.skills.join(",");

    const profileData = {
      ...formData,
      skills: skillsString
    };


    const formDataToSend = new FormData();
    for (let key in profileData) {
      formDataToSend.append(key, profileData[key]);
    }
    console.log(profileData, 'profileDatas' )
    console.log(formDataToSend, 'formDataToSend')
    // First API call: update-profile
    const profileRes = await axios.post(
      'https://girangroup.com/jobfoundation/public/api/employer/update-profile',
      formDataToSend,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log("Profile updated:", profileRes.data);

    
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated Successfully',
      text: 'Your profile information has been updated and saved without any issues.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5a34a0',
    });
    

  } catch (error) {
    console.log(error, 'error')
    console.error("Error:", error.response?.data || error.message);

    const apiErrors = error.response?.data?.errors;
    const apiMessage = error.response?.data?.message;

    if (apiErrors) {
      
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: setErrors(apiErrors),
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    } else {
      const fallbackMsg = apiMessage || error.message || "Something went wrong.";
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: ("Failed:" + fallbackMsg),
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
      
    }
  }
  finally {
    setBtnLoader(false); 
  }
};
  
  




  

  if (loading) {
    return <Loader/>;
  }


  return (
    <div id="layout-wrapper">
      <TopHeaderMain/>
      <SidebarMenu/>
      <div className='main-content'>
        <div className='page-content'>
          <div className='container-fluid'>
            <div className="">
              <div className="row">
                <div className="col-12">
                  <section className="section job-hero-section bg-primary py-5" id="hero">
                      <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
                      <div className="container-fluid custom-container">
                        <div className="row justify-content-between align-items-center">
                          <div className="col-lg-8 text-center m-auto">
                            <h1 className="text-light display-6 fw-semibold text-capitalize mb-3">
                              Edit Profile
                            </h1>
                            <p className="lead text-light lh-base mb-0">
                              Maintain an updated company profile to stand out....
                            </p>
                          </div>
                        </div>
                      </div>
                  </section>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body p-4">
                      {activeTab === 'personalDetails' && (
                        
                          <div className="row gx-3">
                            <div className='col-12' style={{ textAlign: 'center' }}>
                                <label htmlFor="profile-upload" className='position-relative' style={{ cursor: 'pointer' }}>
                                  <div className="editLinkStyle imageProfileUpdatedImg">
                                    <button className="linkAbleEdit border-0">
                                      <i className="ri-pencil-line align-bottom"></i>
                                    </button>
                                  </div>
                                  <div className='profileImageWrapMain'>
                                    <img
                                      src={imageProfile || dummyImage}
                                      alt="Profile"
                                      style={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #ccc',
                                      }}
                                    />
                                  </div>
                                </label>
                                <input
                                  type="file"
                                  id="profile-upload"
                                  accept="image/*"
                                  name="logo"
                                  onChange={handleImageChange}
                                  style={{ display: 'none' }}
                                />
                              </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="first_nameInput" className="form-label">
                                  First Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control-custom bg-lightBlue form-control ${errors.first_name ? "is-invalid" : ""}`}
                                  id="first_nameInput"
                                  name="first_name"
                                  value={formData.first_name}
                                  onChange={handleInputChange}
                                />
                                {errors.first_name && (
                                  <div className="invalid-feedback">
                                    {errors.first_name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="last_nameInput" className="form-label">
                                  Last Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control-custom bg-lightBlue form-control ${errors.last_name ? "is-invalid" : ""}`}
                                  id="last_nameInput"
                                  name="last_name"
                                  value={formData.last_name}
                                  onChange={handleInputChange}
                                  
                                />
                                {errors.last_name && (<div className="invalid-feedback">{errors.last_name}</div>)}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="phoneInput" className="form-label">
                                  Phone <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control-custom bg-lightBlue form-control ${errors.phone ? "is-invalid" : ""}`}
                                    id="phoneInput"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                      const input = e.target.value;
                                      // Allow only digits and maximum 10 characters
                                      if (/^\d{0,10}$/.test(input)) {
                                        setFormData({ ...formData, phone: input });
                                        setErrors({ ...errors, phone: '' });
                                      }
                                    }}
                                    placeholder="Enter 10-digit phone number"
                                  />
                                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="emailInput" className="form-label">
                                  Email <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="email"
                                  className={`form-control-custom bg-lightBlue form-control ${errors.email ? "is-invalid" : ""}`}
                                  id="emailInput"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  
                                  disabled
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="company_nameInput" className="form-label">
                                  Company Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control-custom bg-lightBlue form-control ${errors.company_name ? "is-invalid" : ""}`}
                                  id="company_nameInput"
                                  name="company_name"
                                  value={formData.company_name}
                                  onChange={handleInputChange}
                                  
                                />
                                {errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="number_of_employeesInput" className="form-label">
                                  Number of Employees <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  className={`form-control-custom bg-lightBlue form-control ${errors.number_of_employees ? "is-invalid" : ""}`}
                                  id="number_of_employeesInput"
                                  name="number_of_employees"
                                  value={formData.number_of_employees}
                                  onChange={handleInputChange}
                                  
                                  min="0"
                                />
                                {errors.number_of_employees && <div className="invalid-feedback">{errors.number_of_employees}</div>}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="country_idInput" className="form-label">
                                  Country <span className="text-danger">*</span>
                                </label>
                                <select
                                  className={`form-control-custom bg-lightBlue form-control ${errors.country_id ? "is-invalid" : ""}`}
                                  id="country_idInput"
                                  name="country_id"
                                  value={formData.country_id}
                                  onChange={handleInputChange}
                                  
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
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="state_idInput" className="form-label">
                                  Province <span className="text-danger">*</span>
                                </label>
                                <select
                                  className={`form-control-custom bg-lightBlue form-control ${errors.state_id ? "is-invalid" : ""}`}
                                  id="state_idInput"
                                  name="state_id"
                                  value={formData.state_id}
                                  onChange={handleInputChange}
                                  disabled={!formData.country_id}
                                  
                                >
                                   <option value="" disabled>Select Province</option>
                                    {states.map((state) => (
                                      <option key={state.id} value={state.id} disabled={state.name.toLowerCase() !== "alberta"}>
                                        {state.name}
                                      </option>
                                    ))}
                                </select>
                                {errors.state_id && <div className="invalid-feedback">{errors.state_id}</div>}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="streetInput" className="form-label">
                                  Street <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control-custom bg-lightBlue form-control ${errors.street ? "is-invalid" : ""}`}
                                  id="streetInput"
                                  name="street"
                                  value={formData.street}
                                  onChange={handleInputChange}
                                  
                                />
                                {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label htmlFor="cityInput" className="form-label">
                                  City <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control-custom bg-lightBlue form-control ${errors.city ? "is-invalid" : ""}`}
                                  id="cityInput"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  
                                />
                                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="mb-3">
                                <label htmlFor="postal_codeInput" className="form-label">
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
                            <div className="col-lg-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  About <span className="text-danger">*</span>
                                </label>
                                <Editor
                                  apiKey="b2o72zug7zijbusefxeqa56ouyzztaqz946pdsmxuy5arpjz" 
                                  value={formData.about_us}
                                  init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [],
                                    toolbar:
                                      'undo redo | formatselect | bold italic',
                                  }}
                                  onEditorChange={handleEditorChange}
                                />
                                {errors.about_us && <div className="invalid-feedback d-block">{errors.about_us}</div>}
                                
                              </div>
                            </div>
                            
                            <div className="col-lg-12">
                              <div className="hstack gap-2 justify-content-end">
                                <button type="button" onClick={handleSubmit} className="btn btn-primary btnStyleMinWdth" disabled={btnLoader ? 'disabled' : ''}>
                                  {btnLoader ? (
                                    <div className="spinner-border text-light btnLoaderStyle" role="status">
                                      <span className="sr-only"></span>
                                    </div>
                                  ) : (
                                    "Update Profile"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployer;