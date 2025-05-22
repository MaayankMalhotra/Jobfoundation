import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import "./assets/css/bootstrap.min.css";
import "./assets/css/app.min.css";
import "./assets/css/custom.min.css";
import './EmployerDashboard.css';
import Swal from 'sweetalert2';
import { Link, useNavigate  } from 'react-router-dom';
import TopHeaderMain from './components/TopHearderEmplyoer';
import SidebarMenu from './components/sidebarMenus';

const EmployerDashboard = () => {
  // States for Navbar
  const [searchQueryTopbar, setSearchQueryTopbar] = useState('');
  const [language, setLanguage] = useState('en');
  const [cartItems] = useState([
    { id: 1, name: 'Branded T-Shirts', quantity: 10, price: 32 },
    { id: 2, name: 'Bentwood Chair', quantity: 5, price: 18 },
  ]);
  const [notifications] = useState(3);
  // const navigate = useNavigate()
  // States for Dashboard
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQueryDashboard, setSearchQueryDashboard] = useState('');
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [editCustomSkill, setEditCustomSkill] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false)
  const [showEditCustomInput, setShowEditCustomInput] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [salaryType, setSalaryType] = useState('hourly');
  const [licenceList, setLicenceList] = useState([]);
  const [certificateList, setCertificateList] = useState([]);


  const handleSalaryTypeChange = (e) => {
    setSalaryType(e.target.value);
  };

  const getAddonText = () => {
    return salaryType === 'hourly' ? '$/hr' : '$/year';
  };

  const getPlaceholder = () => {
    return salaryType === 'hourly' ? 'e.g. 40-60' : 'e.g. 70000-90000';
  };

    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);
    const [isEmployer, setIsEmployer] = useState(false);
    const toggleDropdown = () => {
      setShowDropdown(prev => !prev);
    };
    // const handleLogout = () => {
    //   localStorage.removeItem('user');
    //   localStorage.removeItem('token');
    //   setUser(null);
    //   setIsEmployer(false);
    //   // Redirect to login page if needed:
    //   window.location.replace('/job_frontend/LoginPage'); 
    // };

    

  // Language flags
  // const languageFlags = {
  //   en: 'https://flagcdn.com/20x15/us.png',
  //   sp: 'https://flagcdn.com/20x15/es.png',
  //   gr: 'https://flagcdn.com/20x15/de.png',
  //   it: 'https://flagcdn.com/20x15/it.png',
  //   ru: 'https://flagcdn.com/20x15/ru.png',
  // };

  // User data
  // const user = { name: 'Anna', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80' };



   const initialFormData = {
    logo: '',
    designation: '',
    job_location: '',
    salary_range: '',
    job_type: '',
    salary_type: '',
    licence_id: '',
    certification_id: '',
    key_skills: '',
    overview: '',
    required_experience: '',
    required_qualification: '',
    roles_n_responsibilities: '',
    shift_type: '',
    job_title: '',
    status: 'open',
  };

  const [formData, setFormData] = useState(initialFormData);




  // Base URL for API
  const API_BASE_URL = 'https://girangroup.com/jobfoundation/public/api/employer/job-postings';



  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/skill-list', { headers: { Authorization: `Bearer ${token}` } });
        const formattedSkills = response.data.map(skill => ({
          value: skill.id.toString(),
          label: skill.skill_name,
        }));
        setSkills(formattedSkills);
      } catch (error) {
        console.error('Skills Fetch Mein Error:', error.message);
        Swal.fire('Error', 'Skills did not load!', 'error');
      }
    };

    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser);
    if (storedUser) {
      setUser({
        name: storedUser.name || 'User Name',
        username: storedUser.username,
        email: storedUser.email,
      });
      setIsEmployer(storedUser.role_id == 3); // Check if role is 3 (employer)
    } else {
      setUser(null);
      setIsEmployer(false); // No user or role not 3
    }

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}`, { headers: { Authorization: `Bearer ${token}` } });
        console.log(response)
        const mappedJobs = response.data.map(job => {
          // Safely handle key_skills
          let keySkillsArray = [];
          if (job.key_skills) {
            if (typeof job.key_skills === 'string') {
              keySkillsArray = job.key_skills.split(',').map(id => id.trim());
            } else if (Array.isArray(job.key_skills)) {
              keySkillsArray = job.key_skills.map(id => id.toString());
            } else {
              console.warn('Unexpected key_skills format:', job.key_skills);
              keySkillsArray = [];
            }
          }

          return {
            id: (job.id ?? '').toString(),
            company: (job.employer_id ?? '').toString(),           
            logo: 'https://via.placeholder.com/20?text=Job',
            position: (job.designation ?? '').toString(),          
            location: (job.job_location ?? '').toString(),
            salary: (job.salary_range ?? '').toString(),
            job_type: (job.job_type ?? '').toString(),
            status: (job.status ?? 'Open').toString(),             
            key_skills: keySkillsArray,
            overview: job.overview ?? '',
            licence_id: job.licence_id ?? '',
            certification_id: job.certification_id ?? '',
            required_experience: job.required_experience ?? '',
            required_qualification: job.required_qualification ?? '',
            roles_n_responsibilities: job.roles_n_responsibilities ?? '',
            shift_type: job.shift_type ?? '',
            job_title: job.job_title ?? '',
          };
        });
        const sortedJobs = mappedJobs.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setJobs(sortedJobs);
        console.log('Job Posting', mappedJobs)
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/dropdown-list', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // ✅ Added Content-Type
          },
        });
        console.log('API Response:', response.data); // 👈 Check this in browser console
  
        // ✅ Correct path
        const data = response.data?.data;
  
        if (data) {
          setLicenceList(data.licenceList || []);
          setCertificateList(data.certificationList || []);
        } else {
          console.error("No data found in response");
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
  
    fetchDropdownData();
  }, []);

  // Filter function for jobs
  const filterData = () => {
    let filteredJobs = jobs;
    if (filterStatus !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchQueryDashboard) {
      filteredJobs = filteredJobs.filter(job =>
        job.id.toLowerCase().includes(searchQueryDashboard.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQueryDashboard.toLowerCase()) ||
        job.position.toLowerCase().includes(searchQueryDashboard.toLowerCase())
      );
    }
    return filteredJobs;
  };
  const filteredJobs = filterData();
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle Add Job
  const handleAddJob = async (e) => {
    e.preventDefault();
    const skillsString = selectedSkills.map(skill => skill.value).join(',');
    const token = localStorage.getItem('token');
    const newJob = {
      job_title: e.target.job_title.value,
      designation: e.target.designation.value,
      slug: e.target.designation.value.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      job_location: e.target.job_location.value,
      job_type: e.target.job_type.value,
      salary_type: e.target.salary_type.value,
      salary_range: e.target.salary_range.value,
      key_skills: skillsString,
      status: 'open',
      overview: e.target.overview.value,
      licence_id: e.target.licence_id.value || '',
      certification_id: e.target.certification_id.value || '',
      required_experience: parseInt(e.target.required_experience.value),
      required_qualification: e.target.required_qualification.value,
      roles_n_responsibilities: e.target.roles_n_responsibilities.value,
      shift_type: e.target.shift_type.value,
      
    };
    try {

      const response = await axios.post(`${API_BASE_URL}/store`, newJob, { headers: { Authorization: `Bearer ${token}` } });
      const addedJob = {
        id: response.data.data.id,
        company: response.data.data.employer_id,
        logo: 'https://via.placeholder.com/20?text=Job',
        position: response.data.data.designation,
        location: response.data.data.job_location,
        salary: response.data.data.salary_range,
        job_type: response.data.data.job_type,
        salary_type: response.data.data.salary_type,
        licence_id: response.data.data.licence_id || '',
        certification_id: response.data.data.certification_id || '',
        key_skills: response.data.data.key_skills ? response.data.data.key_skills.split(',') : [],
        overview: response.data.data.overview,
        required_experience: response.data.data.required_experience,
        required_qualification: response.data.data.required_qualification,
        roles_n_responsibilities: response.data.data.roles_n_responsibilities,
        shift_type: response.data.data.shift_type,
        job_title: response.data.data.job_title,
        status: response.data.data.status
      };
      
      setJobs([addedJob, ...jobs]);
      setShowModal(false);
      setSelectedSkills([]);
      setCustomSkill('');
      setFormData(initialFormData);

      
      Swal.fire({
        icon: 'success',
        title: 'Job Added!',
        text: 'The job posting has been successfully added.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    } catch (error) {
      console.error('Error adding job:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'An error occurred while adding the job.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    }
  };
  // const jobSingleView = (id) => {
  //   navigate()
  // }
  // Handle Edit Job
  const handleEditJob = async (e) => {
    e.preventDefault();
    const skillsString = selectedSkills.map(skill => skill.value).join(',');
    const token = localStorage.getItem('token');
    const updatedJob = {
      job_title: e.target.job_title.value,
      designation: e.target.designation.value,
      slug: e.target.designation.value.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      job_location: e.target.job_location.value,
      job_type: e.target.job_type.value,
      salary_type: e.target.salary_type.value,
      status: e.target.status.value,
      salary_range: e.target.salary_range.value,
      licence_id: e.target.licence_id.value || '',
      certification_id: e.target.certification_id.value || '',
      key_skills: skillsString,
      overview: e.target.overview.value,
      required_experience: parseInt(e.target.required_experience.value),
      required_qualification: e.target.required_qualification.value,
      roles_n_responsibilities: e.target.roles_n_responsibilities.value,
      shift_type: e.target.shift_type.value,
    };
    console.log(updatedJob)
    try {
      const response = await axios.post(`${API_BASE_URL}/update/${currentJob.id}`, updatedJob, { headers: { Authorization: `Bearer ${token}` } });
      const updatedJobData = {
        id: response.data.data.id,
        company: response.data.data.employer_id,
        status: response.data.data.status,
        logo: 'https://via.placeholder.com/20?text=Job',
        position: response.data.data.designation,
        location: response.data.data.job_location,
        salary: response.data.data.salary_range,
        job_type: response.data.data.job_type,
        salary_type: response.data.data.salary_type,
        licence_id: response.data.data.licence_id || '',
        certification_id: response.data.data.certification_id || '',
        key_skills: response.data.data.key_skills ? response.data.data.key_skills.split(',') : [],
        overview: response.data.data.overview,
        required_experience: response.data.data.required_experience,
        required_qualification: response.data.data.required_qualification,
        roles_n_responsibilities: response.data.data.roles_n_responsibilities,
        shift_type: response.data.data.shift_type,
        job_title: response.data.data.job_title,
      };
      console.log('Response from API:', response.data);
      setJobs(jobs.map(job => (job.id === currentJob.id ? updatedJobData : job)));
      setShowEditModal(false);
      setCurrentJob(null);
      setSelectedSkills([]);
      setEditCustomSkill('');

      Swal.fire({
        icon: 'success',
        title: 'Job Edited!',
        text: 'The job posting has been successfully edited.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    } catch (error) {
      console.error('Error updating job:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'An error occurred while editing the job.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    }
  };
  const handleStatusChange = async (jobId, newStatus) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_BASE_URL}/update/${jobId}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedStatus = response.data.data.status;

    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: updatedStatus } : job
      )
    );

    Swal.fire({
      icon: 'success',
      title: 'Status Updated!',
      text: `Job status updated to ${updatedStatus}.`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#5a34a0',
    });
  } catch (error) {
    console.error('Error updating status:', error.response?.data || error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.response?.data?.message || 'An error occurred while updating status.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5a34a0',
    });
  }
};
  const handleDeleteJob = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/remove/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setJobs(jobs.filter(job => job.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Job Deleted!',
        text: 'The job posting has been successfully deleted.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    } catch (error) {
      console.error('Error deleting job:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'An error occurred while deleting the job.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    }
  };
  
  const getOptionsWithOthers = () => {
    const hasOthers = selectedSkills.some(skill => skill.value === 'others');
    return hasOthers
      ? skills
      : [...skills, { value: 'others', label: 'Others' }];
  };
  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
    const hasOthers = selectedOptions?.some(opt => opt.value === 'others');
    setShowCustomSkillInput(hasOthers);
  };
  
  const handleCustomSkillChange = (e) => {
    setCustomSkill(e.target.value);
  };
  
  const handleAddCustomSkill = async () => {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
  
    // Avoid duplicates
    const isDuplicate = skills.some(skill => skill.label.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      Swal.fire('Note', 'Skill already exists!', 'info');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://girangroup.com/jobfoundation/public/api/skills/store',
        { skill_name: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const newSkill = { value: response.data.id.toString(), label: trimmed };
  
      setSkills([...skills, newSkill]);
  
      // Remove "others" from selected and add new custom skill
      const updatedSelected = selectedSkills
        .filter(skill => skill.value !== 'others')
        .concat(newSkill);
      setSelectedSkills(updatedSelected);
  
      setCustomSkill('');
      setShowCustomSkillInput(false);
    } catch (error) {
      console.error('Error adding custom skill:', error);
      Swal.fire('Error', 'Failed to add custom skill', 'error');
    }
  };


  const handleSkillsChangeEdit = (selectedOptions) => {
    const updatedSkills = selectedOptions || [];
    setSelectedSkills(updatedSkills);
  
    const hasOthers = updatedSkills.some(skill => skill.value === 'others');
    setShowEditCustomInput(hasOthers); // Show input field if "Others" is selected
  };

  const handleEditCustomSkill = async () => {
    const trimmed = editCustomSkill.trim();
    if (!trimmed) return;
  
    const existingSkill = skills.find(
      skill => skill.label.toLowerCase() === trimmed.toLowerCase()
    );
  
    const updatedSelected = selectedSkills.filter(skill => skill.value !== 'others');
  
    if (!existingSkill) {
      try {
        console.log('Sending data to API:', { skill_name: trimmed }); // Log the data
  
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'https://girangroup.com/jobfoundation/public/api/skills/store',
          { skill_name: trimmed },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        console.log('API Response:', response); // Log the response
  
        const newSkill = { value: response.data.id.toString(), label: trimmed };
        setSkills([...skills, newSkill]);
        setSelectedSkills([...updatedSelected, newSkill]);
      } catch (error) {
        console.error('Error adding custom skill:', error.response?.data || error.message);
        Swal.fire('Error', 'Failed to add custom skill', 'error');
      }
    } else {
      const isAlreadySelected = updatedSelected.some(skill => skill.value === existingSkill.value);
      if (!isAlreadySelected) {
        setSelectedSkills([...updatedSelected, existingSkill]);
      } else {
        setSelectedSkills(updatedSelected); // Remove "others" only
      }
    }
  
    setEditCustomSkill('');
    setShowEditCustomInput(false);
  };
  

  return (
    <div id="layout-wrapper">
        <TopHeaderMain/>
        <SidebarMenu/>
        <div className='main-content'>
          <div className='page-content'>
            <div className='container-fluid'>
                <div className="row">
                  <div className="col-lg-12">
                    <h1 className="mainTitleStyleWrap">Job Listing</h1>
                    <div className="card" id="applicationList">
                      {/* <div className="card-header border-0">
                        <div className="d-md-flex align-items-center">
                          
                          <div className="flex-shrink-0">
                            <button className="btn btn-primary add-btn" onClick={() => setShowModal(true)}>
                              <i className="ri-add-line align-bottom me-1"></i> Post a Job
                            </button>
                          </div>
                        </div>
                      </div> */}
                      <div className="card-body border-bottom border-0 border-dashed">
                        <form>
                          <div className="row g-3 align-items-end">
                            <div className="col-xxl-2 col-sm-4">
                              <label>Job Status</label>
                              <select
                                className="form-control"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                              >
                                <option value="all">All</option>
                                <option value="Open">Open</option>
                                <option value="on-hold">On Hold</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                            <div className="col-xxl-4 col-sm-4">
                                <label>Search </label>
                              <div className="search-box">
                                <input
                                  type="text"
                                  className="form-control search"
                                  placeholder="Search by designation..."
                                  value={searchQueryDashboard}
                                  onChange={(e) => setSearchQueryDashboard(e.target.value)}
                                />
                                <i className="ri-search-line search-icon"></i>
                              </div>
                            </div>
                            <div className="col-xxl-2 col-sm-4 text-sm-end">
                              <button type="button" className="btn btn-primary add-btn" onClick={() => setShowModal(true)}>
                                <i className="ri-add-line align-bottom me-1"></i> Post a Job
                              </button>
                            </div>
                            {/* <div className="col-xxl-2 col-sm-4">
                              <button type="button" className="btn btn-primary w-100 filter-btn" onClick={filterData}>
                                <i className="ri-equalizer-fill me-1 align-bottom"></i> Filters
                              </button>
                            </div> */}
                          </div>
                        </form>
                      </div>

                      <div className="card-body pt-0">
                        <div className="table-responsive table-card mt-3 mb-1">
                          <table className="table table-nowrap align-middle tableMainDesignCstm" id="jobListTable">
                            <thead className="text-muted table-light">
                              <tr className="tableHeadDesignStyle">
                                {/* <th scope="col" style={{ width: '25px' }}>
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="checkAll" />
                                  </div>
                                </th> */}
                                <th className="sort" style={{ width: '140px' }}>S.No</th>
                                <th className="sort">Designation</th>
                                <th className="sort">Location</th>
                                <th className="sort">Salary Range</th>
                                <th className="sort">Job Type</th>
                                <th className="sort">Status</th>
                                {/* <th className="sort">Key Skills</th> */}
                                <th className="sort">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="list form-check-all listTableDesignStyle">
                              {currentJobs.map((job, index) => (
                                <tr key={index}>
                                  {/* <th scope="row">
                                    <div className="form-check">
                                      <input className="form-check-input" type="checkbox" name="checkAll" />
                                    </div>
                                  </th> */}
                                  <td className="id fw-medium">#{(currentPage - 1) * jobsPerPage + index + 1}</td>
                                  <td className="position">{job.position}</td>
                                  <td className="location">{job.location}</td>
                                  <td className="salary">$ {job.salary}{(job.salary_type || '').toLowerCase() === 'hourly' ? '/hr' : ''}</td>
                                  <td className="type">{job.job_type}</td>
                                  <td className="status">
                                    <select
                                      className={`form-select badge text-uppercase ${
                                        {
                                          open: 'bg-success-subtle text-success',
                                          'on-hold': 'bg-warning-subtle text-warning',
                                          closed: 'bg-danger-subtle text-danger',
                                        }[job.status.toLowerCase()] || 'bg-success-subtle text-success'
                                      }`}
                                      value={job.status}
                                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', height: 'auto', width: '100%' }}
                                    >
                                      <option value="open">Open</option>
                                      <option value="on-hold">On Hold</option>
                                      <option value="closed">Closed</option>
                                    </select>
                                    {/* <span
                                      className={`badge ${
                                        {
                                          open: 'bg-success-subtle text-success',
                                          'on-hold': 'bg-warning-subtle text-warning',
                                          closed: 'bg-danger-subtle text-danger',
                                        }[(job.status || '').toLowerCase()] || 'bg-success-subtle text-success'
                                      } text-uppercase`}
                                    >
                                      {job.status || 'open'}
                                    </span> */}
                                  </td>
                                  {/* <td className="key_skills">
                                    {job.key_skills.map(skillId => {
                                      const matchedSkill = skills.find(s => s.value === skillId.toString());
                                      const skillName = matchedSkill ? matchedSkill.label : skillId;
                                      return (
                                        <span key={skillId} className="badge bg-primary-subtle text-primary me-1">
                                          {skillName}
                                        </span>
                                      );
                                    })}
                                  </td> */}
                                  <td>
                                    <ul className="list-inline hstack gap-2 mb-0">
                                      <li className="list-inline-item" title="Candidate List">
                                        <Link
                                          to={`/candidate-list/${job.id}`}
                                          className="text-primary"
                                        >
                                          <i class="ri-user-shared-fill"></i>
                                        </Link>
                                        
                                      </li>
                                      <li className="list-inline-item" title="View">
                                        <Link
                                          to={`/employer-job-detail/${job.id}`}
                                          className="text-primary"
                                        >
                                          <i className="ri-eye-fill fs-16"></i>
                                        </Link>
                                      </li>
                                      <li className="list-inline-item edit" title="Edit">
                                        <a
                                          href="#editModal"
                                          className="text-primary"
                                          onClick={() => {
                                            setCurrentJob(job);
                                            const preSelectedSkills = job.key_skills.map(skillId => {
                                              const matchedSkill = skills.find(s => s.value === skillId.toString());
                                              return matchedSkill ? { value: matchedSkill.value, label: matchedSkill.label } : null;
                                            }).filter(Boolean);
                                            setSelectedSkills(preSelectedSkills);
                                            setShowEditModal(true);
                                          }}
                                        >
                                          <i className="ri-pencil-fill fs-16"></i>
                                        </a>
                                      </li>
                                      <li className="list-inline-item" title="Delete">
                                      <button
                                          type="button"
                                          onClick={() => handleDeleteJob(job.id)}
                                          className="text-danger bg-transparent border-0 p-0"
                                          style={{ cursor: 'pointer' }}
                                        >
                                          <i className="ri-delete-bin-5-fill fs-16"></i>
                                        </button>
                                        {/* <a
                                          className="text-danger"
                                          href="javascript:void(0)"
                                          onClick={() => handleDeleteJob(job.id)}
                                        >
                                          <i className="ri-delete-bin-5-fill fs-16"></i>
                                        </a> */}
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {currentJobs.length === 0 && (
                            <div className="noresult">
                              <div className="text-center">
                                <h5 className="mt-2">No Jobs Found</h5>
                                <p className="text-muted">We couldn't find any matching job listings.</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} entries
                            </div>
                            <nav>
                              <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                </li>
                                {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, i) => (
                                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                  </li>
                                ))}
                                <li className={`page-item ${currentPage === Math.ceil(filteredJobs.length / jobsPerPage) ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                </li>
                              </ul>
                            </nav>
                          </div>

                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>



      {/* Add New Job Modal */}
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="addJobModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog modal-lg" role="document">
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
                      <input type="text" className="form-control" id="job_title" name="job_title" value={formData.job_title || ''} onChange={e => setFormData({...formData, job_title: e.target.value})} placeholder="e.g. Senior Software Developer" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="designation" className="form-label">Designation</label>
                      <input type="text" className="form-control" id="designation" name="designation" value={formData.designation || ''} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Software Engineer" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="job_location" className="form-label">Location</label>
                      <input type="text" className="form-control" id="job_location" name="job_location" value={formData.job_location || '' } onChange={e => setFormData({...formData, job_location: e.target.value})} placeholder="e.g. New York" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="job_type" className="form-label">Job Type</label>
                      <select className="form-control" id="job_type" name="job_type" value={formData.job_type} onChange={e => setFormData({...formData, job_type: e.target.value})} required>
                        <option value="Full-time">Full-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="licenceId" className="form-label" >Licence Required</label>
                      <select className="form-control" name="licence_id" id="licenceId" value={formData.licence_id} onChange={e => setFormData({...formData, licence_id: e.target.value})}>
                        <option value="">Select Licence</option>
                        {licenceList.map((licence) => (
                          <option key={licence.id} value={licence.id}>
                            {licence.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="certificate_id" className="form-label">Certificate Required</label>
                      <select className="form-control" name="certification_id" id="certificate_id" value={formData.certification_id} onChange={e => setFormData({...formData, certification_id: e.target.value})}>
                        <option value="">Select Certificate</option>
                        {certificateList.map((cert) => (
                          <option key={cert.id} value={cert.id}>
                            {cert.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <div className="row gx-3">
                        <div className="col-md-6">
                          <label htmlFor="salary_type" className="form-label">Salary Type</label>
                          <select
                            className="form-control"
                            id="salary_type"
                            name="salary_type"
                            value={salaryType}
                            onChange={handleSalaryTypeChange}
                          >
                            <option value="hourly">Hourly</option>
                            <option value="annual">Annual</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="salary_range" className="form-label">Salary Amount</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="salary_range"
                              name="salary_range"
                              value={formData.salary_range}
                              onChange={e => setFormData({...formData, salary_range: e.target.value})}
                              placeholder={getPlaceholder()}
                              required
                            />
                            <span className="input-group-text" id="salary-addon">
                              {getAddonText()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <input type="hidden" id="employer_id" name="employer_id" value={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : ''} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="key_skills" className="form-label">Key Skills</label>
                      <Select
                          isMulti
                          name="key_skills"
                          options={getOptionsWithOthers()}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select skills..."
                          value={selectedSkills}
                          onChange={handleSkillsChange}
                          required
                          styles={{
                            multiValue: (styles) => ({
                              ...styles,
                              backgroundColor: '#4e0092',
                              color: '#fff',
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
                            onClick={handleAddCustomSkill}
                            disabled={!customSkill.trim()}
                          >
                            Add
                          </button>
                        </div>
                      )}

                    </div>
                    <div className="mb-3">
                      <label htmlFor="overview" className="form-label">Overview</label>
                      <textarea className="form-control" id="overview" value={formData.overview} name="overview" onChange={e => setFormData({...formData, overview: e.target.value})} placeholder="e.g. Develop and maintain web applications" required></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="required_experience" className="form-label">Required Experience (years)</label>
                      <input type="number" className="form-control" id="required_experience" value={formData.required_experience} onChange={e => setFormData({...formData, required_experience: e.target.value})} name="required_experience" placeholder="e.g. 3" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="required_qualification" className="form-label">Required Qualification</label>
                      <input type="text" className="form-control" id="required_qualification" value={formData.required_qualification} onChange={e => setFormData({...formData, required_qualification: e.target.value})} name="required_qualification" placeholder="e.g. B.Tech in Computer Science" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="roles_n_responsibilities" className="form-label">Roles & Responsibilities</label>
                      <textarea className="form-control" id="roles_n_responsibilities" name="roles_n_responsibilities" value={formData.roles_n_responsibilities} onChange={e => setFormData({...formData, roles_n_responsibilities: e.target.value})} placeholder="e.g. Write clean, scalable code" required></textarea>
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
        </div>

        {/* Edit Job Modal */}
        {showEditModal && currentJob && (
          <div
            className="modal fade show"
            id="editJobModal"
            tabIndex="-1"
            aria-labelledby="editJobModalLabel"
            aria-modal="true"
            role="dialog"
            style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editJobModalLabel">Edit Job</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowEditModal(false);
                      setCurrentJob(null);
                      setSelectedSkills([]);
                      setEditCustomSkill('');
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditJob}>
                      <div className="mb-3">
                        <label htmlFor="job_title" className="form-label">Job Title</label>
                        <input type="text" className="form-control" id="job_title" name="job_title" defaultValue={currentJob.job_title || ''} required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="designation" className="form-label">Designation</label>
                        <input type="text" className="form-control" id="designation" name="designation" defaultValue={currentJob.position} required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="job_location" className="form-label">Location</label>
                        <input type="text" className="form-control" id="job_location" name="job_location" defaultValue={currentJob.location} required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="job_type" className="form-label">Job Type</label>
                        <select className="form-control" id="job_type" name="job_type" defaultValue={currentJob.job_type} required>
                          <option value="Full-time">Full-time</option>
                          <option value="Remote">Remote</option>
                          <option value="Part-time">Part-time</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="licenceId" className="form-label">Licence Required</label>
                        <select className="form-control" name="licence_id" id="licenceId" defaultValue={currentJob.licence_id}>
                          <option value="">Select Licence</option>
                          {licenceList.map((licence) => (
                            <option key={licence.id} value={licence.id}>
                              {licence.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="certificate_id" className="form-label">Certificate Required</label>
                        <select className="form-control" name="certification_id" id="certificate_id" defaultValue={currentJob.certification_id}>
                          <option value="">Select Certificate</option>
                          {certificateList.map((cert) => (
                            <option key={cert.id} value={cert.id}>
                              {cert.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="status_type" className="form-label">Status</label>
                        <select className="form-control" id="status_type" name="status" defaultValue={currentJob.status} required>
                          <option value="open">Open</option>
                          <option value="on-hold">On Hold</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <div className="row gx-3">
                          <div className="col-md-6">
                            <label htmlFor="salary_type" className="form-label">Salary Type</label>
                            <select
                              className="form-control"
                              id="salary_type"
                              name="salary_type"
                              value={salaryType}
                              onChange={handleSalaryTypeChange}
                            >
                              <option value="hourly">Hourly</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="salary_range" className="form-label">Salary Amount</label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                id="salary_range"
                                name="salary_range"
                                placeholder={getPlaceholder()}
                                required
                                defaultValue={currentJob.salary}
                              />
                              <span className="input-group-text" id="salary-addon">
                                {getAddonText()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <label htmlFor="salary_range" className="form-label">Salary Range</label>
                        <input type="text" className="form-control" id="salary_range" name="salary_range" defaultValue={currentJob.salary} required /> */}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="key_skills" className="form-label">Key Skills</label>
                        <Select
                            isMulti
                            name="key_skills"
                            options={[...skills, { value: 'others', label: 'Others' }]} // Add 'Others' option
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select skills..."
                            value={selectedSkills}
                            onChange={handleSkillsChangeEdit}
                            required
                            styles={{
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
                          {showEditCustomInput && (
                            <div className="mt-2 d-flex gap-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Add custom skill"
                                value={editCustomSkill}
                                onChange={(e) => setEditCustomSkill(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleEditCustomSkill}
                                disabled={!editCustomSkill.trim()}
                              >
                                Add
                              </button>
                            </div>
                          )}
                        {/* <Select
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
                            value={editCustomSkill}
                            onChange={(e) => setEditCustomSkill(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleEditCustomSkill}
                            disabled={!editCustomSkill.trim()}
                          >
                            Add
                          </button>
                        </div> */}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="overview" className="form-label">Overview</label>
                        <textarea className="form-control" id="overview" name="overview" defaultValue={currentJob.overview} required></textarea>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="required_experience" className="form-label">Required Experience (years)</label>
                        <input type="number" className="form-control" id="required_experience" name="required_experience" defaultValue={currentJob.required_experience} required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="required_qualification" className="form-label">Required Qualification</label>
                        <input type="text" className="form-control" id="required_qualification" name="required_qualification" defaultValue={currentJob.required_qualification} required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="roles_n_responsibilities" className="form-label">Roles & Responsibilities</label>
                        <textarea className="form-control" id="roles_n_responsibilities" name="roles_n_responsibilities" defaultValue={currentJob.roles_n_responsibilities} required></textarea>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="shift_type" className="form-label">Shift Type</label>
                        <select className="form-control" id="shift_type" name="shift_type" defaultValue={currentJob.shift_type} required>
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
                            setShowEditModal(false);
                            setCurrentJob(null);
                            setSelectedSkills([]);
                            setEditCustomSkill('');
                          }}
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Update Job
                        </button>
                      </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}


       
        {/* Single View MOdal Data */}

        {/* <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewModalLabel">Job Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedJob ? (
                  <ul className='listJobViewData'>
                    <li>
                      <h4>Job Title:</h4>
                      <p>{selectedJob.job_title}</p>
                    </li>
                    <li>
                      <h4>Designation:</h4>
                      <p>{selectedJob.position}</p>
                    </li>
                    <li>
                      <h4>Location:</h4>
                      <p>{selectedJob.location}</p>
                    </li>
                    <li>
                      <h4>Job Type:</h4>
                      <p>{selectedJob.type}</p>
                    </li>
                    <li>
                      <h4>Salary Range:</h4>
                      <p>${selectedJob.salary} <sup>(CAD)</sup></p>
                    </li>
                    <li>
                      <h4>Key Skills:</h4>
                      {selectedJob.key_skills.map(skillId => {
                        const matchedSkill = skills.find(s => s.value === skillId.toString());
                        const skillName = matchedSkill ? matchedSkill.label : skillId;
                        return (
                          <span key={skillId} className="badge bg-primary-subtle text-primary me-1">
                            {skillName}
                          </span>
                        );
                      })}
                      
                    </li>
                    <li>
                      <h4>Overview:</h4>
                      <p>{selectedJob.overview}</p>
                    </li>
                    <li>
                      <h4>Required Experience (years):</h4>
                      <p>{selectedJob.required_experience}</p>
                    </li>
                    <li>
                      <h4>Required Qualification:</h4>
                      <p>{selectedJob.required_qualification}</p>
                    </li>
                    <li>
                      <h4>Roles & Responsibilities:</h4>
                      <p>{selectedJob.roles_n_responsibilities}</p>
                    </li>
                    <li>
                      <h4>Shift Type:</h4>
                      <p>{selectedJob.shift_type}</p>
                    </li>
                    <li>
                      <h4>Status:</h4>
                      <p><span className={`viewbadgestyle badge ${(selectedJob.status || '').toLowerCase() === 'open' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} text-uppercase`}>
                                      {selectedJob.status}</span></p>
                    </li>
                  </ul>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div> */}



        {/* Modal Backdrop */}
        {(showModal || showEditModal) && (
          <div
            className="modal-backdrop fade show"
            onClick={() => {
              setShowModal(false);
              setShowEditModal(false);
              setCurrentJob(null);
              setSelectedSkills([]);
              setCustomSkill('');
              setEditCustomSkill('');
            }}
          ></div>
        )}




    </div>

  );
};

export default EmployerDashboard;