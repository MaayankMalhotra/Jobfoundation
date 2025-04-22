// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Select from 'react-select';
// import Sidebar from './Sidebar'; // Import the Sidebar component
// import './EditEmployee.css'; // Create a separate CSS file for this page (optional)

// const EditEmployee = () => {
//   const [activeTab, setActiveTab] = useState('personalDetails');
//   const [formData, setFormData] = useState({
//     username: '',
//     first_name: '',
//     last_name: '',
//     phone: '',
//     email: '',
//     experience: '',
//     ctc: '',
//     ectc: '',
//     notice_period: '',
//     education: '',
//     desired_job_type: '',
//     preferred_shift: '',
//     preferred_work_location: '',
//     language: '',
//     country_id: '',
//     state_id: '',
//     street: '',
//     city: '',
//     postal_code: '',
//     skills: [], // Array of skill IDs
//     cv: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [skills, setSkills] = useState([]); // Available skills from API
//   const [customSkill, setCustomSkill] = useState(''); // Custom skill input

//   // Fetch employee data and skills
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           alert('No token found. Please log in.');
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get('https://girangroup.com/jobfoundation/public/api/employee/profile-old', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const employee = response.data.data;
//         const employeeData = employee.employee;
//         const address = employee.address;

//         let skillsArray = [];
//         if (employeeData.skills) {
//           if (typeof employeeData.skills === 'string') {
//             skillsArray = employeeData.skills.split(',').map(id => id.trim());
//           } else if (Array.isArray(employeeData.skills)) {
//             skillsArray = employeeData.skills.map(id => id.toString());
//           } else {
//             console.warn('Unexpected skills format:', employeeData.skills);
//             skillsArray = [];
//           }
//         }

//         setFormData({
//           username: employee.username || '',
//           first_name: employee.first_name || '',
//           last_name: employee.last_name || '',
//           phone: employee.phone || '',
//           email: employee.email || '',
//           experience: employeeData.experience || '',
//           ctc: employeeData.ctc || '',
//           ectc: employeeData.ectc || '',
//           notice_period: employeeData.notice_period || '',
//           education: employeeData.education || '',
//           desired_job_type: employeeData.desired_job_type || '',
//           preferred_shift: employeeData.preferred_shift || '',
//           preferred_work_location: employeeData.preferred_work_location || '',
//           language: employeeData.language || '',
//           country_id: address.country_id || '',
//           state_id: address.state_id || '',
//           street: address.street || '',
//           city: address.city || '',
//           postal_code: address.postal_code || '',
//           skills: skillsArray,
//         });
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching employee data:', error.response?.data || error.message);
//         setLoading(false);
//       }
//     };

//     const fetchSkills = async () => {
//       try {
//         const response = await axios.get('https://girangroup.com/jobfoundation/public/api/skill-list');
//         const formattedSkills = response.data.map(skill => ({
//           value: skill.id.toString(),
//           label: skill.skill_name,
//         }));
//         setSkills(formattedSkills);
//       } catch (error) {
//         console.error('Error fetching skills:', error.response?.data || error.message);
//       }
//     };

//     fetchEmployeeData();
//     fetchSkills();
//   }, []);

//   // Fetch countries and states
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await axios.get('https://girangroup.com/jobfoundation/public/api/countries');
//         setCountries(response.data);
//       } catch (error) {
//         console.error('Error fetching countries:', error);
//       }
//     };
//     fetchCountries();
//   }, []);

//   useEffect(() => {
//     const fetchStates = async () => {
//       if (formData.country_id) {
//         try {
//           const response = await axios.get(`https://girangroup.com/jobfoundation/public/api/states/${formData.country_id}`);
//           setStates(response.data);
//         } catch (error) {
//           console.error('Error fetching states:', error);
//         }
//       } else {
//         setStates([]);
//       }
//     };
//     fetchStates();
//   }, [formData.country_id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, cv: e.target.files[0] });
//   };

//   const handleSkillsChange = (selectedOptions) => {
//     const selectedSkills = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData({ ...formData, skills: selectedSkills });
//   };

//   const handleCustomSkillChange = (e) => {
//     setCustomSkill(e.target.value);
//   };

//   const addCustomSkill = async () => {
//     if (customSkill.trim() && !skills.some(s => s.label.toLowerCase() === customSkill.trim().toLowerCase())) {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.post(
//           'https://girangroup.com/jobfoundation/public/api/skills/store',
//           { skill_name: customSkill.trim() },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const newSkill = { value: response.data.id.toString(), label: customSkill.trim() };
//         setSkills([...skills, newSkill]);
//         setFormData({ ...formData, skills: [...formData.skills, newSkill.value] });
//         setCustomSkill('');
//       } catch (error) {
//         console.error('Error adding custom skill:', error.response?.data || error.message);
//         alert('Failed to add custom skill!');
//       }
//     } else if (customSkill.trim()) {
//       const existingSkill = skills.find(s => s.label.toLowerCase() === customSkill.trim().toLowerCase());
//       if (!formData.skills.includes(existingSkill.value)) {
//         setFormData({ ...formData, skills: [...formData.skills, existingSkill.value] });
//       }
//       setCustomSkill('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const skillsString = formData.skills.join(',');

//       const updateData = {
//         username: formData.username,
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         phone: formData.phone,
//         experience: formData.experience,
//         ctc: formData.ctc,
//         ectc: formData.ectc,
//         notice_period: formData.notice_period,
//         education: formData.education,
//         desired_job_type: formData.desired_job_type,
//         preferred_shift: formData.preferred_shift,
//         preferred_work_location: formData.preferred_work_location,
//         language: formData.language,
//         country_id: formData.country_id,
//         state_id: formData.state_id,
//         street: formData.street,
//         city: formData.city,
//         postal_code: formData.postal_code,
//         skills: skillsString,
//       };

//       const formDataToSend = new FormData();
//       for (let key in updateData) {
//         formDataToSend.append(key, updateData[key]);
//       }
//       if (formData.cv) {
//         formDataToSend.append('cv', formData.cv);
//       }

//       const response = await axios.post(
//         'https://girangroup.com/jobfoundation/public/api/employee/update-profile',
//         formDataToSend,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log('Employee updated successfully:', response.data);
//       alert('Employee details updated successfully!');
//     } catch (error) {
//       console.error('Error updating employee:', error.response?.data || error.message);
//       alert('Failed to update: ' + JSON.stringify(error.response?.data?.errors || error.message));
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   const preSelectedSkills = skills.length > 0
//     ? formData.skills
//         .map(skillId => {
//           const matchedSkill = skills.find(s => s.value === skillId.toString());
//           return matchedSkill ? { value: matchedSkill.value, label: matchedSkill.label } : null;
//         })
//         .filter(Boolean)
//     : [];

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         {/* Sidebar */}
//         <div className="col-md-3 col-lg-2 p-0">
//           <Sidebar />
//         </div>

//         {/* Main Content */}
//         <div className="col-md-9 col-lg-10 main-content">
//           <div className="container my-5 pt-5">
//             <div className="row">
//               <div className="col-12">
//               <section className="section job-hero-section bg-primary" id="hero">
//               <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
//               <div className="container custom-container">
//                 <div className="row justify-content-between align-items-center pt-5">
//                   <div className="col-lg-8 text-center m-auto">
//                     <h1 className="text-light display-6 fw-semibold text-capitalize mb-3">
//                       Find Your Perfect Job Match
//                     </h1>
//                     <p className="lead text-light lh-base mb-4">
//                       Find jobs, create trackable resumes and enrich your applications...
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </section>
//               </div>
//             </div>

//             <div className="row mt-4">
//               <div className="col-12">
//                 <div className="card">
//                   <div className="card-header">
//                     <ul className="nav nav-tabs-custom rounded card-header-tabs border-bottom-0">
//                       <li className="nav-item">
//                         <a
//                           className={`nav-link ${activeTab === 'personalDetails' ? 'active' : ''}`}
//                           onClick={() => setActiveTab('personalDetails')}
//                           href="#"
//                         >
//                           <i className="fas fa-home"></i> Personal Details
//                         </a>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="card-body p-4">
//                     {activeTab === 'personalDetails' && (
//                       <form onSubmit={handleSubmit}>
//                         <div className="row">
//                           {/* <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="usernameInput" className="form-label">Username</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="usernameInput"
//                                 name="username"
//                                 value={formData.username}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div> */}
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="first_nameInput" className="form-label">First Name</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="first_nameInput"
//                                 name="first_name"
//                                 value={formData.first_name}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="last_nameInput" className="form-label">Last Name</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="last_nameInput"
//                                 name="last_name"
//                                 value={formData.last_name}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="phoneInput" className="form-label">Phone</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="phoneInput"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="emailInput" className="form-label">Email</label>
//                               <input
//                                 type="email"
//                                 className="form-control"
//                                 id="emailInput"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 disabled
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="experienceInput" className="form-label">Experience (Years)</label>
//                               <input
//                                 type="number"
//                                 className="form-control"
//                                 id="experienceInput"
//                                 name="experience"
//                                 value={formData.experience}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="ctcInput" className="form-label">CTC</label>
//                               <input
//                                 type="number"
//                                 className="form-control"
//                                 id="ctcInput"
//                                 name="ctc"
//                                 value={formData.ctc}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="ectcInput" className="form-label">Expected CTC</label>
//                               <input
//                                 type="number"
//                                 className="form-control"
//                                 id="ectcInput"
//                                 name="ectc"
//                                 value={formData.ectc}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="notice_periodInput" className="form-label">Notice Period (Days)</label>
//                               <input
//                                 type="number"
//                                 className="form-control"
//                                 id="notice_periodInput"
//                                 name="notice_period"
//                                 value={formData.notice_period}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="educationInput" className="form-label">Education</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="educationInput"
//                                 name="education"
//                                 value={formData.education}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="desired_job_typeInput" className="form-label">Desired Job Type</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="desired_job_typeInput"
//                                 name="desired_job_type"
//                                 value={formData.desired_job_type}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="preferred_shiftInput" className="form-label">Preferred Shift</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="preferred_shiftInput"
//                                 name="preferred_shift"
//                                 value={formData.preferred_shift}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="preferred_work_locationInput" className="form-label">Preferred Work Location</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="preferred_work_locationInput"
//                                 name="preferred_work_location"
//                                 value={formData.preferred_work_location}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="languageInput" className="form-label">Language</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="languageInput"
//                                 name="language"
//                                 value={formData.language}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="country_idInput" className="form-label">Country</label>
//                               <select
//                                 className="form-control"
//                                 id="country_idInput"
//                                 name="country_id"
//                                 value={formData.country_id}
//                                 onChange={handleInputChange}
//                               >
//                                 <option value="">Select Country</option>
//                                 {countries.map((country) => (
//                                   <option key={country.id} value={country.id}>
//                                     {country.name}
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="state_idInput" className="form-label">State</label>
//                               <select
//                                 className="form-control"
//                                 id="state_idInput"
//                                 name="state_id"
//                                 value={formData.state_id}
//                                 onChange={handleInputChange}
//                                 disabled={!formData.country_id}
//                               >
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                   <option key={state.id} value={state.id}>
//                                     {state.name}
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="streetInput" className="form-label">Street</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="streetInput"
//                                 name="street"
//                                 value={formData.street}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="cityInput" className="form-label">City</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="cityInput"
//                                 name="city"
//                                 value={formData.city}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="postal_codeInput" className="form-label">Postal Code</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 id="postal_codeInput"
//                                 name="postal_code"
//                                 value={formData.postal_code}
//                                 onChange={handleInputChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="skillsInput" className="form-label">Skills</label>
//                               <Select
//                                 isMulti
//                                 name="skills"
//                                 options={skills}
//                                 className="basic-multi-select"
//                                 classNamePrefix="select"
//                                 placeholder="Select skills..."
//                                 value={preSelectedSkills}
//                                 onChange={handleSkillsChange}
//                               />
//                               <div className="mt-2 d-flex gap-2">
//                                 <input
//                                   type="text"
//                                   className="form-control"
//                                   placeholder="Add custom skill"
//                                   value={customSkill}
//                                   onChange={handleCustomSkillChange}
//                                 />
//                                 <button
//                                   type="button"
//                                   className="btn btn-primary"
//                                   onClick={addCustomSkill}
//                                   disabled={!customSkill.trim()}
//                                 >
//                                   Add
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-lg-6">
//                             <div className="mb-3">
//                               <label htmlFor="cvInput" className="form-label">Upload CV</label>
//                               <input
//                                 type="file"
//                                 className="form-control"
//                                 id="cvInput"
//                                 name="cv"
//                                 onChange={handleFileChange}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-lg-12">
//                             <div className="hstack gap-2 justify-content-end">
//                               <button type="submit" className="btn btn-primary">Update</button>
//                               <button type="button" className="btn btn-soft-success">Cancel</button>
//                             </div>
//                           </div>
//                         </div>
//                       </form>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditEmployee;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Sidebar from './Sidebar';
import './EditEmployee.css';

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
    cv: null,
  });
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false); // New state to toggle custom skill input

  // Fetch employee data and skills
  useEffect(() => {
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
          experience: employeeData.experience || '',
          ctc: employeeData.ctc || '',
          ectc: employeeData.ectc || '',
          notice_period: employeeData.notice_period || '',
          education: employeeData.education || '',
          desired_job_type: employeeData.desired_job_type || '',
          preferred_shift: employeeData.preferred_shift || '',
          preferred_work_location: employeeData.preferred_work_location || '',
          language: employeeData.language || '',
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
  }, []);

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
    const fetchStates = async () => {
      if (formData.country_id) {
        try {
          const response = await axios.get(`https://girangroup.com/jobfoundation/public/api/states/${formData.country_id}`);
          setStates(response.data);
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      } else {
        setStates([]);
      }
    };
    fetchStates();
  }, [formData.country_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        language: formData.language,
        country_id: formData.country_id,
        state_id: formData.state_id,
        street: formData.street,
        city: formData.city,
        postal_code: formData.postal_code,
        skills: skillsString,
      };

      const formDataToSend = new FormData();
      for (let key in updateData) {
        formDataToSend.append(key, updateData[key]);
      }
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }

      const response = await axios.post(
        'https://girangroup.com/jobfoundation/public/api/employee/update-profile',
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Employee updated successfully:', response.data);
      alert('Employee details updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error.response?.data || error.message);
      alert('Failed to update: ' + JSON.stringify(error.response?.data?.errors || error.message));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 main-content">
          <div className="container my-5 pt-5">
            <div className="row">
              <div className="col-12">
                <section className="section job-hero-section bg-primary" id="hero">
                  <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
                  <div className="container custom-container">
                    <div className="row justify-content-between align-items-center pt-5">
                      <div className="col-lg-8 text-center m-auto">
                        <h1 className="text-light display-6 fw-semibold text-capitalize mb-3">
                          Find Your Perfect Job Match
                        </h1>
                        <p className="lead text-light lh-base mb-4">
                          Find jobs, create trackable resumes and enrich your applications...
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
                  <div className="card-header">
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
                  </div>
                  <div className="card-body p-4">
                    {activeTab === 'personalDetails' && (
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="first_nameInput" className="form-label">First Name</label>
                              <input
                                type="text"
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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
                              <label htmlFor="experienceInput" className="form-label">Experience (Years)</label>
                              <input
                                type="number"
                                className="form-control"
                                id="experienceInput"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="ctcInput" className="form-label">CTC</label>
                              <input
                                type="number"
                                className="form-control"
                                id="ctcInput"
                                name="ctc"
                                value={formData.ctc}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="ectcInput" className="form-label">Expected CTC</label>
                              <input
                                type="number"
                                className="form-control"
                                id="ectcInput"
                                name="ectc"
                                value={formData.ectc}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="notice_periodInput" className="form-label">Notice Period (Days)</label>
                              <input
                                type="number"
                                className="form-control"
                                id="notice_periodInput"
                                name="notice_period"
                                value={formData.notice_period}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="educationInput" className="form-label">Education</label>
                              <input
                                type="text"
                                className="form-control"
                                id="educationInput"
                                name="education"
                                value={formData.education}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="desired_job_typeInput" className="form-label">Desired Job Type</label>
                              <input
                                type="text"
                                className="form-control"
                                id="desired_job_typeInput"
                                name="desired_job_type"
                                value={formData.desired_job_type}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="preferred_shiftInput" className="form-label">Preferred Shift</label>
                              <input
                                type="text"
                                className="form-control"
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
                                className="form-control"
                                id="preferred_work_locationInput"
                                name="preferred_work_location"
                                value={formData.preferred_work_location}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="languageInput" className="form-label">Language</label>
                              <input
                                type="text"
                                className="form-control"
                                id="languageInput"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="country_idInput" className="form-label">Country</label>
                              <select
                                className="form-control"
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
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="state_idInput" className="form-label">State</label>
                              <select
                                className="form-control"
                                id="state_idInput"
                                name="state_id"
                                value={formData.state_id}
                                onChange={handleInputChange}
                                disabled={!formData.country_id}
                              >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                  <option key={state.id} value={state.id}>
                                    {state.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="streetInput" className="form-label">Street</label>
                              <input
                                type="text"
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
                                id="postal_codeInput"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="skillsInput" className="form-label">Skills</label>
                              <Select
                                isMulti
                                name="skills"
                                options={skills}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Select skills..."
                                value={preSelectedSkills}
                                onChange={handleSkillsChange}
                              />
                              {showCustomSkillInput && (
                                <div className="mt-2 d-flex gap-2">
                                  <input
                                    type="text"
                                    className="form-control"
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
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="cvInput" className="form-label">Upload CV</label>
                              <input
                                type="file"
                                className="form-control"
                                id="cvInput"
                                name="cv"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="hstack gap-2 justify-content-end">
                              <button type="submit" className="btn btn-primary">Update</button>
                              <button type="button" className="btn btn-soft-success">Cancel</button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
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

export default EditEmployee;