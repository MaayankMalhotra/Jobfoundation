import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Loader from './loader';
import dummyUser from '../assets/images/dummy_avatar.jpg'
const TopHeaderMain = () => {
  const [user, setUser] = useState(null);
  const [isEmployer, setIsEmployer] = useState(false);  
  const [showDropdown, setShowDropdown] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [skills, setSkills] = useState([]);
  // const [selectedSkills, setSelectedSkills] = useState([]);
  // const [customSkill, setCustomSkill] = useState('');
  // const [jobs, setJobs] = useState([]);
 const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem('user'));
  //   if (storedUser) {
  //     setUser({
  //       name: `${storedUser.first_name || 'User'} ${storedUser.last_name || 'Name'}`.trim(),
  //       username: storedUser.username,
  //       email: storedUser.email,
  //       avatar: storedUser.avatar || 'https://girangroup.com/job_frontend/images/avatar-1.jpg',
  //     });
  //     setIsEmployer(storedUser.role_id == 3);
  //   } else {
  //     setUser(null);
  //     setIsEmployer(false);
  //   }
  // }, []);


  // const API_BASE_URL = 'https://girangroup.com/jobfoundation/public/api';

    
  
    useEffect(() => {
      
      // const fetchSkills = async () => {
      //   const token = localStorage.getItem('token')
      //   try {
      //     const response = await axios.get(`${API_BASE_URL}/skill-list`, { headers: {Authorization : `Bearer ${token}`} });
      //     const formattedSkills = response.data.map(skill => ({
      //       value: skill.id.toString(),
      //       label: skill.skill_name,
      //     }));
      //     setSkills(formattedSkills);
      //   } catch (error) {
      //     console.error('Skills Fetch Mein Error:', error.message);
      //     Swal.fire('Error', 'Skills nahi load hue!', 'error');
      //   }
      // };
  
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log(storedUser);
      if (storedUser) {
        setUser({
          name: `${storedUser.first_name || 'User'} ${storedUser.last_name || 'Name'}`.trim(),
          username: storedUser.username,
          email: storedUser.email,
          avatar: storedUser.employer.logo || dummyUser,
        });
        setIsEmployer(storedUser.role_id == 3); // Check if role is 3 (employer)
      } else {
        setUser(null);
        setIsEmployer(false); // No user or role not 3
      }
  
    }, []);

    // Handle Add Job
    // const handleAddJob = async (e) => {
    //   const token = localStorage.getItem('token')
    //   e.preventDefault();
    //   const skillsString = selectedSkills.map(skill => skill.value).join(',');
    //   const newJob = {
    //     job_title: e.target.job_title.value,
    //     designation: e.target.designation.value,
    //     slug: e.target.designation.value.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    //     job_location: e.target.job_location.value,
    //     job_type: e.target.job_type.value,
    //     salary_range: e.target.salary_range.value,
    //     key_skills: skillsString,
    //     overview: e.target.overview.value,
    //     required_experience: parseInt(e.target.required_experience.value),
    //     required_qualification: e.target.required_qualification.value,
    //     roles_n_responsibilities: e.target.roles_n_responsibilities.value,
    //     shift_type: e.target.shift_type.value,
    //   };
    //   try {
        
    //     const response = await axios.post(`${API_BASE_URL}/employer/job-postings/store`, newJob, {headers : {Authorization: `Bearer ${token}`}});
    //     const addedJob = {
    //       id: response.data.data.id,
    //       company: response.data.data.employer_id,
    //       logo: 'https://via.placeholder.com/20?text=Job',
    //       position: response.data.data.designation,
    //       location: response.data.data.job_location,
    //       salary: response.data.data.salary_range,
    //       type: response.data.data.job_type,
    //       key_skills: response.data.data.key_skills ? response.data.data.key_skills.split(',') : [],
    //       overview: response.data.data.overview,
    //       required_experience: response.data.data.required_experience,
    //       required_qualification: response.data.data.required_qualification,
    //       roles_n_responsibilities: response.data.data.roles_n_responsibilities,
    //       shift_type: response.data.data.shift_type,
    //       job_title: response.data.data.job_title,
    //     };
    //     setJobs([...jobs, addedJob]);
    //     setLoading(true)
    //     setShowModal(false);
    //     setSelectedSkills([]);
    //     setCustomSkill('');

        
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Job Added!',
    //       text: 'The job posting has been successfully added.',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: '#5a34a0',
    //     }).then(()=>{
    //       setLoading(false);
    //       window.location.href = '/job_frontend/employer-dashboard';
    //     });
    //   } catch (error) {
    //     console.error('Error adding job:', error.response?.data || error.message);
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error!',
    //       text: error.response?.data?.message || error.message || 'An error occurred while adding the job.',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: '#5a34a0',
    //     });
    //     setLoading(false);
    //   }
    // };
    
    if (loading) {
      return <Loader/>;
    }
    // const handleAddCustomSkill = async () => {
    //     if (customSkill.trim() && !skills.some(s => s.label.toLowerCase() === customSkill.trim().toLowerCase())) {
    //       try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.post(
    //           `${API_BASE_URL}/skills/store`,
    //           { skill_name: customSkill.trim() },
    //           // { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         const newSkill = { value: response.data.id.toString(), label: customSkill.trim() };
    //         setSkills([...skills, newSkill]);
    //         setSelectedSkills([...selectedSkills, newSkill]);
    //         setCustomSkill('');
    //       } catch (error) {
    //         console.error('Error adding custom skill:', error.response?.data || error.message);
    //         Swal.fire('Error', 'Failed to add custom skill!', 'error');
    //       }
    //     } else if (customSkill.trim()) {
    //       const existingSkill = skills.find(s => s.label.toLowerCase() === customSkill.trim().toLowerCase());
    //       if (!selectedSkills.some(skill => skill.value === existingSkill.value)) {
    //         setSelectedSkills([...selectedSkills, existingSkill]);
    //       }
    //       setCustomSkill('');
    //     }
    //   };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsEmployer(false);
    window.location.replace('/job_frontend/LoginPage');
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header" style={{height:'auto'}}>
          <div className="d-flex"></div>

          <div className="d-flex align-items-center">
            {/* <div className='me-3'>
                <button onClick={() => setShowModal(true)} className='btn btn-primary btnAddCustomPost d-flex align-items-center'><i class="ri-add-line"></i> Create Job Posting</button>
            </div> */}
            <div className="dropdown dropDownCustom">
              <div className="dropdown-toggle" onClick={toggleDropdown}>
                <img
                  className="rounded-circle header-profile-user"
                   src={
                    user?.avatar
                      ? `https://girangroup.com/jobfoundation/public/storage/${user.avatar}`
                      : dummyUser
                  }
                  alt="Header Avatar"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <span className="d-flex iconArrwoDown">
                  <i className="ri-arrow-drop-down-fill"></i>
                </span>
              </div>

              <ul className={`dropdownContentStyle dropdown-menu ${showDropdown ? 'showDropDown' : ''}`}>
                <li>
                  <Link to="/employer-profile" className="dropdown-item dropDownLinkProfile">
                    <div className="imageProfileInside">
                      <img
                        className="rounded-circle header-profile-user"
                         src={
                          user?.avatar
                            ? `https://girangroup.com/jobfoundation/public/storage/${user.avatar}`
                            : dummyUser
                        }
                        alt="Header Avatar"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="contentUserInside">
                      <h2>{user?.name || 'User Name'}</h2>
                      <p>{user?.email || 'user@example.com'}</p>
                    </div>
                  </Link>
                </li>
                <hr className="my-1" />
                <li>
                  <Link className="dropdown-item" to="/employer-profile-edit">
                    <i className="material-icons text-muted fs-16 align-middle me-1">settings</i>Profile Setting
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#" onClick={handleLogout}>
                    <i className="material-icons text-muted fs-16 align-middle me-1">logout</i> Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Add New Job Modal */}
      {/* <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="addJobModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addJobModalLabel">Add New Job</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSkills([]);
                    setCustomSkill('');
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddJob}>
                  <div className="mb-3">
                    <label htmlFor="job_title" className="form-label">Job Title</label>
                    <input type="text" className="form-control" id="job_title" name="job_title" placeholder="e.g. Senior Software Developer" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="designation" className="form-label">Designation</label>
                    <input type="text" className="form-control" id="designation" name="designation" placeholder="e.g. Software Engineer" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="job_location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="job_location" name="job_location" placeholder="e.g. New York" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="job_type" className="form-label">Job Type</label>
                    <select className="form-control" id="job_type" name="job_type" required>
                      <option value="Full-time">Full-time</option>
                      <option value="Remote">Remote</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="salary_range" className="form-label">Salary Range</label>
                    <input type="text" className="form-control" id="salary_range" name="salary_range" placeholder="e.g. 70000-90000" required />
                  </div>
                  <div className="mb-3">
                    <input type="hidden" id="employer_id" name="employer_id" value={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : ''} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="key_skills" className="form-label">Key Skills</label>
                    <Select
                      isMulti
                      name="key_skills"
                      options={skills}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select skills..."
                      value={selectedSkills}
                      onChange={(selectedOptions) => setSelectedSkills(selectedOptions || [])}
                      required
                    />
                    <div className="mt-2 d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add custom skill"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddCustomSkill}
                        disabled={!customSkill.trim()}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="overview" className="form-label">Overview</label>
                    <textarea className="form-control" id="overview" name="overview" placeholder="e.g. Develop and maintain web applications" required></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="required_experience" className="form-label">Required Experience (years)</label>
                    <input type="number" className="form-control" id="required_experience" name="required_experience" placeholder="e.g. 3" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="required_qualification" className="form-label">Required Qualification</label>
                    <input type="text" className="form-control" id="required_qualification" name="required_qualification" placeholder="e.g. B.Tech in Computer Science" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roles_n_responsibilities" className="form-label">Roles & Responsibilities</label>
                    <textarea className="form-control" id="roles_n_responsibilities" name="roles_n_responsibilities" placeholder="e.g. Write clean, scalable code" required></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="shift_type" className="form-label">Shift Type</label>
                    <select className="form-control" id="shift_type" name="shift_type" required>
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedSkills([]);
                        setCustomSkill('');
                      }}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </div> */}
      {/* Modal Backdrop */}
      {/* {showModal && (
          <div
            className="modal-backdrop fade show"
            onClick={() => {
                setShowModal(false);
                setSelectedSkills([]);
                setCustomSkill('');
            }}
          ></div>
        )} */}
    </header>
  );
};

export default TopHeaderMain;
