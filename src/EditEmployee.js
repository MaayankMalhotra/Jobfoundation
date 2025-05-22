import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Sidebar from './Sidebar';
import './EditEmployee.css';
import Header from './components/header'
import Footer from './components/footer'
import Loader from './components/loader'
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2';
import dummyImage from './assets/images/profileImage.jpg'
const EditEmployee = () => {
  const [activeTab, setActiveTab] = useState('personalDetails');
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    experience: '',
    ctc: '',
    ectc: '',
    notice_period: '',
    education: '',
    desired_job_type: '',
    preferred_shift: '',
    preferred_work_location: '',
    language: '',
    country_id: '',
    state_id: '',
    street: '',
    city: '',
    postal_code: '',
    skills: [],
    about_us:'',
    cv: null,
    profile: null
  });
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false); // New state to toggle custom skill input
  const [imageProfile, setImageProfile] = useState(null);
  const [btnLoader , setBtnLoader] = useState(false);


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

  // Fetch employee data and skills
  useEffect(() => {
    if (languages.length === 0) return;
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/employee/profile-old', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const employee = response.data.data;
        const employeeData = employee.employee;
        const address = employee.address;
        setImageProfile(`https://girangroup.com/jobfoundation/public/storage/${employeeData.profile}`)
        console.log(response.data, 'data check')
        console.log(employee, 'data check')

        // Convert language name to ID
        let languageId = '';
        if (employeeData.language) {
          const langMatch = languages.find(
            (lang) => lang.name.toLowerCase() === employeeData.language.toLowerCase()
          );
          languageId = langMatch ? langMatch.id.toString() : '';
        }


        let skillsArray = [];
        if (employeeData.skills) {
          if (typeof employeeData.skills === 'string') {
            skillsArray = employeeData.skills.split(',').map(id => id.trim());
          } else if (Array.isArray(employeeData.skills)) {
            skillsArray = employeeData.skills.map(id => id.toString());
          } else {
            console.warn('Unexpected skills format:', employeeData.skills);
            skillsArray = [];
          }
        }
        
        setFormData({
          username: employee.username || '',
          first_name: employee.first_name || '',
          last_name: employee.last_name || '',
          phone: employee.phone || '',
          email: employee.email || '',
          profile: employeeData.profile || dummyImage,
          experience: employeeData.experience || '',
          ctc: employeeData.ctc || '',
          ectc: employeeData.ectc || '',
          notice_period: employeeData.notice_period || '',
          education: employeeData.education || '',
          desired_job_type: employeeData.desired_job_type || '',
          preferred_shift: employeeData.preferred_shift || '',
          preferred_work_location: employeeData.preferred_work_location || '',
          language: languageId || '',
          about_us:employeeData.about_us || '',
          country_id: address.country_id || '',
          state_id: address.state_id || '',
          street: address.street || '',
          city: address.city || '',
          postal_code: address.postal_code || '',
          skills: skillsArray,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error.response?.data || error.message);
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
        // Add "Others" option to the skills list
        formattedSkills.push({ value: 'others', label: 'Others' });
        setSkills(formattedSkills);
      } catch (error) {
        console.error('Error fetching skills:', error.response?.data || error.message);
      }
    };

    fetchEmployeeData();
    fetchSkills();
  },  [languages]);

  // Fetch countries and states
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

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
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };
    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setImageProfile(imageUrl);
    }
    setFormData({ ...formData, profile: file })
    };

  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map(option => option.value) : [];
    // Check if "Others" is selected
    const hasOthers = selectedSkills.includes('others');
    setShowCustomSkillInput(hasOthers);
    // Remove "others" from the actual skills list
    const filteredSkills = selectedSkills.filter(skill => skill !== 'others');
    setFormData({ ...formData, skills: filteredSkills });
  };

  const handleCustomSkillChange = (e) => {
    setCustomSkill(e.target.value);
  };

  const addCustomSkill = async () => {
    if (customSkill.trim() && !skills.some(s => s.label.toLowerCase() === customSkill.trim().toLowerCase())) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'https://girangroup.com/jobfoundation/public/api/skills/store',
          { skill_name: customSkill.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newSkill = { value: response.data.id.toString(), label: customSkill.trim() };
        setSkills([...skills.filter(skill => skill.value !== 'others'), newSkill, { value: 'others', label: 'Others' }]);
        setFormData({ ...formData, skills: [...formData.skills, newSkill.value] });
        setCustomSkill('');
        setShowCustomSkillInput(false); // Hide the input after adding
      } catch (error) {
        console.error('Error adding custom skill:', error.response?.data || error.message);
        alert('Failed to add custom skill!');
      }
    } else if (customSkill.trim()) {
      const existingSkill = skills.find(s => s.label.toLowerCase() === customSkill.trim().toLowerCase());
      if (!formData.skills.includes(existingSkill.value)) {
        setFormData({ ...formData, skills: [...formData.skills, existingSkill.value] });
      }
      setCustomSkill('');
      setShowCustomSkillInput(false); // Hide the input after adding
    }
  };

  const handleEditorChange = (content) => {
    console.log('Editor Content:', content);
    setFormData((prev) => ({
      ...prev,
      about_us: content,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoader(true);
    try {
      const selectedLanguage = languages.find(
        (lang) => lang.id === parseInt(formData.language)
      );
  
      const languageName = selectedLanguage ? selectedLanguage.name : '';
      const token = localStorage.getItem('token');
      const skillsString = formData.skills.join(',');

      const updateData = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        ctc: formData.ctc,
        ectc: formData.ectc,
        notice_period: formData.notice_period,
        education: formData.education,
        desired_job_type: formData.desired_job_type,
        preferred_shift: formData.preferred_shift,
        preferred_work_location: formData.preferred_work_location,
        language: languageName,
        country_id: formData.country_id,
        state_id: formData.state_id,
        street: formData.street,
        city: formData.city,
        about_us: formData.about_us,
        postal_code: formData.postal_code,
        profile: formData.profile,
        skills: skillsString,
      };

      const formDataToSend = new FormData();
      for (let key in updateData) {
        formDataToSend.append(key, updateData[key]);
      }
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }
      console.log(updateData)
      console.log('dataLoading perchl raha hai')
      const response = await axios.post(
        'https://girangroup.com/jobfoundation/public/api/employee/update-profile',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Employee updated successfully:', response.data);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated Successfully',
        text: 'Your profile information has been updated and saved without any issues.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
      // alert('Employee details updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error.response?.data || error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: ('Failed to update: ' + JSON.stringify(error.response?.data?.errors || error.message)),
          confirmButtonText: 'OK',
          confirmButtonColor: '#5a34a0',
        });
          
    }
    finally {
      setBtnLoader(false); 
    }
  };

  if (loading) {
    return <Loader/>;
  }

  const preSelectedSkills = skills.length > 0
    ? formData.skills
        .map(skillId => {
          const matchedSkill = skills.find(s => s.value === skillId.toString());
          return matchedSkill ? { value: matchedSkill.value, label: matchedSkill.label } : null;
        })
        .filter(Boolean)
    : [];

  return (
    <>
      <Header/>
        <section className="section pt-0 headerTopSpace">
          <div className="section job-hero-section bg-primary  pt-5 pb-4" id="hero">
            <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
            <div className="container-fluid custom-container">
              <div className="row justify-content-between align-items-center">
                <div className="col-lg-8 text-center m-auto">
                  <h1 className="text-light display-6 fw-semibold text-capitalize mb-3">
                    Edit Profile
                  </h1>
                  <p className="lead text-light lh-base mb-4">
                    Keep your profile updated to get better job matches....
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid custom-container mt-5 pt-4">
            <div className="row gx-3">
              <div className="col-12">
                <div className="card">
                  {/* <div className="card-header">
                    <ul className="nav nav-tabs-custom rounded card-header-tabs border-bottom-0">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${activeTab === 'personalDetails' ? 'active' : ''}`}
                          onClick={() => setActiveTab('personalDetails')}
                          href="#"
                        >
                          <i className="fas fa-home"></i> Personal Details
                        </a>
                      </li>
                    </ul>
                  </div> */}
                  <div className="card-body p-4">
                    {activeTab === 'personalDetails' && (
                        <div className="row gx-3">
                          <div className='col-12'>
                            <div style={{ textAlign: 'center' }}>
                              <label htmlFor="profile-upload" className='position-relative' style={{ cursor: 'pointer' }}>
                                <div className="editLinkStyle imageProfileUpdatedImg">
                                  <button className="linkAbleEdit border-0">
                                    <i className="ri-pencil-line align-bottom"></i>
                                  </button>
                                </div>
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
                              </label>
                              <input
                                type="file"
                                id="profile-upload"
                                accept="image/*"
                                name="profile"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                              />
                            </div>

                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="first_nameInput" className="form-label">First Name</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue "
                                id="first_nameInput"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="last_nameInput" className="form-label">Last Name</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="last_nameInput"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="phoneInput" className="form-label">Phone</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="phoneInput"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="emailInput" className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control form-control-custom bg-lightBlue"
                                id="emailInput"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="experienceInput" className="form-label">Total Years of Experience</label>
                              <input
                                type="number"
                                className="form-control form-control-custom bg-lightBlue"
                                id="experienceInput"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="ctcInput" className="form-label">Current Salary (CAD)</label>
                              <input
                                type="number"
                                className="form-control form-control-custom bg-lightBlue"
                                id="ctcInput"
                                name="ctc"
                                value={formData.ctc}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="ectcInput" className="form-label">Expected Salary (CAD)</label>
                              <input
                                type="number"
                                className="form-control form-control-custom bg-lightBlue"
                                id="ectcInput"
                                name="ectc"
                                value={formData.ectc}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="notice_periodInput" className="form-label">Notice Period (in Days)</label>
                              <input
                                type="number"
                                className="form-control form-control-custom bg-lightBlue"
                                id="notice_periodInput"
                                name="notice_period"
                                value={formData.notice_period}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="educationInput" className="form-label">Highest Level of Education </label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="educationInput"
                                name="education"
                                value={formData.education}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="desired_job_typeInput" className="form-label">Employment Type Preference</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="desired_job_typeInput"
                                name="desired_job_type"
                                value={formData.desired_job_type}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="preferred_shiftInput" className="form-label">Preferred Work Shift</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="preferred_shiftInput"
                                name="preferred_shift"
                                value={formData.preferred_shift}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="preferred_work_locationInput" className="form-label">Preferred Work Location</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="preferred_work_locationInput"
                                name="preferred_work_location"
                                value={formData.preferred_work_location}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="languageInput" className="form-label">Languages Spoken</label>
                              <select
                                className="form-control form-control-custom bg-lightBlue"
                                id="languageInput"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Language</option>
                                {languages.map((languageList) => (
                                  <option key={languageList.id} value={languageList.id}>
                                    {languageList.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="country_idInput" className="form-label">Country</label>
                               <select
                                  className={`form-control form-control-custom bg-lightBlue`}
                                  id="country_idInput"
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
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
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
                                  className={`form-control form-control-custom bg-lightBlue`}
                                  id="state_idInput"
                                  name="state_id"
                                  value={formData.state_id}
                                  onChange={handleInputChange}
                                  required
                                  disabled={!formData.country_id} // Disable if no country is selected
                                >
                                  <option value="" disabled>Select Province</option>
                                  {states.map((state) => (
                                    <option key={state.id} value={state.id} disabled={state.name.toLowerCase() !== "alberta"}>
                                      {state.name}
                                    </option>
                                  ))}
                                </select>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="streetInput" className="form-label">Street Address</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="streetInput"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="cityInput" className="form-label">City</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="cityInput"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="postal_codeInput" className="form-label">Postal Code</label>
                              <input
                                type="text"
                                className="form-control form-control-custom bg-lightBlue"
                                id="postal_codeInput"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label htmlFor="skillsInput" className="form-label">Technical & Professional Skills</label>
                              <Select
                                isMulti
                                name="skills"
                                options={skills}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Select skills..."
                                value={preSelectedSkills}
                                onChange={handleSkillsChange}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    border: 'none',           
                                    boxShadow: 'none',        
                                    height: '54px',           
                                    minHeight: '54px', 
                                    backgroundColor: '#e2e5ed'      
                                  }),
                                  valueContainer: (base) => ({
                                    ...base,
                                    height: '54px',          
                                    padding: '0 12px',
                                  }),
                                  indicatorsContainer: (base) => ({
                                    ...base,
                                    height: '54px',
                                  }),
                                  multiValue: (styles) => ({
                                    ...styles,
                                    backgroundColor: '#4e0092', // light blue background
                                    color: '#fff', // text color
                                  }),
                                  multiValueLabel: (styles) => ({
                                    ...styles,
                                    fontWeight: '600',
                                    color: '#fff',
                                  }),
                                  multiValueRemove: (styles) => ({
                                    ...styles,
                                    ':hover': {
                                      backgroundColor: '#4e0092',
                                      color: '#fff',
                                    },
                                  }),
                              }}
                              />
                              {showCustomSkillInput && (
                                <div className="mt-2 d-flex gap-2">
                                  <input
                                    type="text"
                                    className="form-control form-control-custom bg-lightBlue"
                                    placeholder="Add custom skill"
                                    value={customSkill}
                                    onChange={handleCustomSkillChange}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={addCustomSkill}
                                    disabled={!customSkill.trim()}
                                  >
                                    Add
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="cvInput" className="form-label"> Resume Upload <sup>(PDF)</sup></label>
                              <input
                                type="file"
                                className="form-control form-control-custom bg-lightBlue"
                                id="cvInput"
                                name="cv"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div> */}
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
                              {/* <button type="button" className="btn btn-soft-danger">Cancel</button> */}
                            </div>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      <Footer/>
    </>
  );
};

export default EditEmployee;