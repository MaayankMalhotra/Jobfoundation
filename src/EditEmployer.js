// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Select from 'react-select';

// const EditEmployer = () => {
//   const [activeTab, setActiveTab] = useState('personalDetails');
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     phone: '',
//     email: '',
//     company_name: '',
//     number_of_employees: '',
//     country_id: '',
//     state_id: '',
//     street: '',
//     city: '',
//     postal_code: '',
//     skills: [], // Array of skill IDs
//   });
//   const [loading, setLoading] = useState(true);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [skills, setSkills] = useState([]); // Available skills from API
//   const [customSkill, setCustomSkill] = useState(''); // Custom skill input
//   const [errors, setErrors] = useState({});

//   // Fetch employer data and skills
//   useEffect(() => {
//     const fetchEmployerData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           alert('No token found. Please log in.');
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get('https://girangroup.com/jobfoundation/public/api/employer/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const employer = response.data.data;
//         const employerData = employer.employer;
//         const address = employer.address;

//         let skillsArray = [];
//         if (employerData.skills) {
//           if (typeof employerData.skills === 'string') {
//             skillsArray = employerData.skills.split(',').map(id => id.trim());
//           } else if (Array.isArray(employerData.skills)) {
//             skillsArray = employerData.skills.map(id => id.toString());
//           }
//         }

//         setFormData({
//           first_name: employer.first_name || '',
//           last_name: employer.last_name || '',
//           phone: employer.phone || '',
//           email: employer.email || '',
//           company_name: employerData.company_name || '',
//           number_of_employees: employerData.number_of_employees || '',
//           country_id: address.country_id || '',
//           state_id: address.state_id || '',
//           street: address.street || '',
//           city: address.city || '',
//           postal_code: address.postal_code || '',
//           skills: skillsArray,
//         });
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching employer data:', error.response?.data || error.message);
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

//     const fetchCountries = async () => {
//       try {
//         const response = await axios.get('https://girangroup.com/jobfoundation/public/api/countries');
//         setCountries(response.data);
//       } catch (error) {
//         console.error('Error fetching countries:', error);
//       }
//     };

//     fetchEmployerData();
//     fetchSkills();
//     fetchCountries();
//   }, []);

//   // Fetch states when country_id changes
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
//     setErrors({ ...errors, [name]: '' });
//   };

//   const handleSkillsChange = (selectedOptions) => {
//     const selectedSkills = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData({ ...formData, skills: selectedSkills });
//     setErrors({ ...errors, skills: '' });
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
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         phone: formData.phone,
//         company_name: formData.company_name,
//         number_of_employees: formData.number_of_employees,
//         country_id: formData.country_id,
//         state_id: formData.state_id,
//         street: formData.street,
//         city: formData.city,
//         postal_code: formData.postal_code,
//        // skills: skillsString,
//       };

//       const formDataToSend = new FormData();
//       for (let key in updateData) {
//         formDataToSend.append(key, updateData[key]);
//       }

//       const response = await axios.post(
//         'https://girangroup.com/jobfoundation/public/api/employer/update-profile', // Assuming this endpoint exists
//         formDataToSend,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log('Employer updated successfully:', response.data);
//       alert('Employer details updated successfully!');
//     } catch (error) {
//       console.error('Error updating employer:', error.response?.data || error.message);
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       } else {
//         alert('Failed to update: ' + JSON.stringify(error.response?.data?.message || error.message));
//       }
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
//     <div className="container my-5 pt-5">
//       <div className="row">
//         <div className="col-12">
//           <div className="card bg-dark text-white">
//             <div className="card-body p-5 text-center">
//               <h1 className="display-6 fw-semibold mb-3">
//                 Manage Your Employer Profile
//               </h1>
//               <p className="lead mb-4">
//                 Update your details to attract the best talent.
//               </p>
//               <div className="profile-user position-relative d-inline-block mx-auto mb-4">
//                 <img
//                   src="https://picsum.photos/150/150"
//                   className="rounded-circle avatar-xl img-thumbnail"
//                   alt="user-profile-image"
//                 />
//               </div>
//               <h5 className="fs-16 mb-1">
//                 {formData.first_name} {formData.last_name}
//               </h5>
//               <p className="text-muted mb-0">{formData.company_name}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row mt-4">
//         <div className="col-12">
//           <div className="card">
//             <div className="card-header">
//               <ul className="nav nav-tabs-custom rounded card-header-tabs border-bottom-0">
//                 <li className="nav-item">
//                   <a
//                     className={`nav-link ${activeTab === 'personalDetails' ? 'active' : ''}`}
//                     onClick={() => setActiveTab('personalDetails')}
//                     href="#"
//                   >
//                     <i className="fas fa-home"></i> Company Details
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div className="card-body p-4">
//               {activeTab === 'personalDetails' && (
//                 <form onSubmit={handleSubmit}>
//                   <div className="row">
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="first_nameInput" className="form-label">
//                           First Name <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
//                           id="first_nameInput"
//                           name="first_name"
//                           value={formData.first_name}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="last_nameInput" className="form-label">
//                           Last Name <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
//                           id="last_nameInput"
//                           name="last_name"
//                           value={formData.last_name}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="phoneInput" className="form-label">
//                           Phone <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className={`form-control ${errors.phone ? "is-invalid" : ""}`}
//                           id="phoneInput"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="emailInput" className="form-label">
//                           Email <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           className={`form-control ${errors.email ? "is-invalid" : ""}`}
//                           id="emailInput"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="company_nameInput" className="form-label">
//                           Company Name <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className={`form-control ${errors.company_name ? "is-invalid" : ""}`}
//                           id="company_nameInput"
//                           name="company_name"
//                           value={formData.company_name}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="number_of_employeesInput" className="form-label">
//                           Number of Employees <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           className={`form-control ${errors.number_of_employees ? "is-invalid" : ""}`}
//                           id="number_of_employeesInput"
//                           name="number_of_employees"
//                           value={formData.number_of_employees}
//                           onChange={handleInputChange}
//                           required
//                           min="0"
//                         />
//                         {errors.number_of_employees && <div className="invalid-feedback">{errors.number_of_employees}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="country_idInput" className="form-label">
//                           Country <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className={`form-control ${errors.country_id ? "is-invalid" : ""}`}
//                           id="country_idInput"
//                           name="country_id"
//                           value={formData.country_id}
//                           onChange={handleInputChange}
//                           required
//                         >
//                           <option value="">Select Country</option>
//                           {countries.map((country) => (
//                             <option key={country.id} value={country.id}>
//                               {country.name}
//                             </option>
//                           ))}
//                         </select>
//                         {errors.country_id && <div className="invalid-feedback">{errors.country_id}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="state_idInput" className="form-label">
//                           State <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className={`form-control ${errors.state_id ? "is-invalid" : ""}`}
//                           id="state_idInput"
//                           name="state_id"
//                           value={formData.state_id}
//                           onChange={handleInputChange}
//                           disabled={!formData.country_id}
//                           required
//                         >
//                           <option value="">Select State</option>
//                           {states.map((state) => (
//                             <option key={state.id} value={state.id}>
//                               {state.name}
//                             </option>
//                           ))}
//                         </select>
//                         {errors.state_id && <div className="invalid-feedback">{errors.state_id}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="streetInput" className="form-label">
//                           Street <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className={`form-control ${errors.street ? "is-invalid" : ""}`}
//                           id="streetInput"
//                           name="street"
//                           value={formData.street}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {errors.street && <div className="invalid-feedback">{errors.street}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="cityInput" className="form-label">
//                           City <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className={`form-control ${errors.city ? "is-invalid" : ""}`}
//                           id="cityInput"
//                           name="city"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {errors.city && <div className="invalid-feedback">{errors.city}</div>}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div className="mb-3">
//                         <label htmlFor="postal_codeInput" className="form-label">
//                           Postal Code <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           className={`form-control ${errors.postal_code ? "is-invalid" : ""}`}
//                           id="postal_codeInput"
//                           name="postal_code"
//                           value={formData.postal_code}
//                           onChange={handleInputChange}
//                           required
//                           min="0"
//                         />
//                         {errors.postal_code && <div className="invalid-feedback">{errors.postal_code}</div>}
//                       </div>
//                     </div>
                   
//                     <div className="col-lg-12">
//                       <div className="hstack gap-2 justify-content-end">
//                         <button type="submit" className="btn btn-primary">
//                           Update
//                         </button>
//                         <button type="button" className="btn btn-soft-success">
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditEmployer;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './EditEmployer.css'; // Use a separate CSS file (or reuse EditEmployee.css if identical)
import Loader from './components/loader';

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
    skills: [], // Array of skill IDs (optional, commented out in your submit)
  });
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [skills, setSkills] = useState([]); // Available skills from API
  const [customSkill, setCustomSkill] = useState(''); // Custom skill input
  const [errors, setErrors] = useState({});

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
          headers: { Authorization: `Bearer ${token}` },
        });

        const employer = response.data.data;
        const employerData = employer.employer;
        const address = employer.address;

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
          company_name: employerData.company_name || '',
          number_of_employees: employerData.number_of_employees || '',
          country_id: address.country_id || '',
          state_id: address.state_id || '',
          street: address.street || '',
          city: address.city || '',
          postal_code: address.postal_code || '',
          skills: skillsArray,
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
    setErrors({ ...errors, [name]: '' });
  };

  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({ ...formData, skills: selectedSkills });
    setErrors({ ...errors, skills: '' });
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
        setSkills([...skills, newSkill]);
        setFormData({ ...formData, skills: [...formData.skills, newSkill.value] });
        setCustomSkill('');
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const skillsString = formData.skills.join(',');

      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company_name,
        number_of_employees: formData.number_of_employees,
        country_id: formData.country_id,
        state_id: formData.state_id,
        street: formData.street,
        city: formData.city,
        postal_code: formData.postal_code,
        skills: skillsString, // Uncommented to include skills if needed
      };

      const formDataToSend = new FormData();
      for (let key in updateData) {
        formDataToSend.append(key, updateData[key]);
      }

      const response = await axios.post(
        'https://girangroup.com/jobfoundation/public/api/employer/update-profile',
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Employer updated successfully:', response.data);
      alert('Employer details updated successfully!');
    } catch (error) {
      console.error('Error updating employer:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Failed to update: ' + JSON.stringify(error.response?.data?.message || error.message));
      }
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
                          <i className="fas fa-home"></i> Company Details
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
                              <label htmlFor="first_nameInput" className="form-label">
                                First Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                                id="first_nameInput"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="last_nameInput" className="form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                                id="last_nameInput"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="phoneInput" className="form-label">
                                Phone <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                id="phoneInput"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
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
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                id="emailInput"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
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
                                className={`form-control ${errors.company_name ? "is-invalid" : ""}`}
                                id="company_nameInput"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleInputChange}
                                required
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
                                className={`form-control ${errors.number_of_employees ? "is-invalid" : ""}`}
                                id="number_of_employeesInput"
                                name="number_of_employees"
                                value={formData.number_of_employees}
                                onChange={handleInputChange}
                                required
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
                                className={`form-control ${errors.country_id ? "is-invalid" : ""}`}
                                id="country_idInput"
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
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="state_idInput" className="form-label">
                                State <span className="text-danger">*</span>
                              </label>
                              <select
                                className={`form-control ${errors.state_id ? "is-invalid" : ""}`}
                                id="state_idInput"
                                name="state_id"
                                value={formData.state_id}
                                onChange={handleInputChange}
                                disabled={!formData.country_id}
                                required
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
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="streetInput" className="form-label">
                                Street <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${errors.street ? "is-invalid" : ""}`}
                                id="streetInput"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                required
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
                                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                id="cityInput"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="postal_codeInput" className="form-label">
                                Postal Code <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${errors.postal_code ? "is-invalid" : ""}`}
                                id="postal_codeInput"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                required
                              />
                              {errors.postal_code && <div className="invalid-feedback">{errors.postal_code}</div>}
                            </div>
                          </div>
                          {/* Uncomment if skills are needed */}
                          {/* <div className="col-lg-6">
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
                            </div>
                          </div> */}
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

export default EditEmployer;