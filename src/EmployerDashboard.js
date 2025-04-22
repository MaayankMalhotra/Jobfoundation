import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import "./assets/css/bootstrap.min.css";
import "./assets/css/app.min.css";
import "./assets/css/custom.min.css";
import './EmployerDashboard.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  // States for Navbar
  const [searchQueryTopbar, setSearchQueryTopbar] = useState('');
  const [language, setLanguage] = useState('en');
  const [cartItems] = useState([
    { id: 1, name: 'Branded T-Shirts', quantity: 10, price: 32 },
    { id: 2, name: 'Bentwood Chair', quantity: 5, price: 18 },
  ]);
  const [notifications] = useState(3);

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

  // Language flags
  const languageFlags = {
    en: 'https://flagcdn.com/20x15/us.png',
    sp: 'https://flagcdn.com/20x15/es.png',
    gr: 'https://flagcdn.com/20x15/de.png',
    it: 'https://flagcdn.com/20x15/it.png',
    ru: 'https://flagcdn.com/20x15/ru.png',
  };

  // User data
  const user = { name: 'Anna', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80' };

  // Base URL for API
  const API_BASE_URL = 'https://girangroup.com/jobfoundation/public/api/employer/job-postings';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('https://girangroup.com/jobfoundation/public/api/skill-list');
        const formattedSkills = response.data.map(skill => ({
          value: skill.id.toString(),
          label: skill.skill_name,
        }));
        setSkills(formattedSkills);
      } catch (error) {
        console.error('Skills Fetch Mein Error:', error.message);
        Swal.fire('Error', 'Skills nahi load hue!', 'error');
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/`);
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
            id: job.id.toString(),
            company: job.employer_id,
            logo: 'https://via.placeholder.com/20?text=Job',
            position: job.designation,
            location: job.job_location,
            salary: job.salary_range,
            type: job.job_type,
            status: job.status || 'Open',
            key_skills: keySkillsArray,
            overview: job.overview,
            required_experience: job.required_experience,
            required_qualification: job.required_qualification,
            roles_n_responsibilities: job.roles_n_responsibilities,
            shift_type: job.shift_type,
            job_title: job.job_title,
          };
        });
        setJobs(mappedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
    fetchSkills();
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

  // Handle Add Job
  const handleAddJob = async (e) => {
    e.preventDefault();
    const skillsString = selectedSkills.map(skill => skill.value).join(',');
    const newJob = {
      job_title: e.target.job_title.value,
      designation: e.target.designation.value,
      slug: e.target.designation.value.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      job_location: e.target.job_location.value,
      job_type: e.target.job_type.value,
      salary_range: e.target.salary_range.value,
      key_skills: skillsString,
      overview: e.target.overview.value,
      required_experience: parseInt(e.target.required_experience.value),
      required_qualification: e.target.required_qualification.value,
      roles_n_responsibilities: e.target.roles_n_responsibilities.value,
      shift_type: e.target.shift_type.value,
    };
    try {
      const response = await axios.post(`${API_BASE_URL}/store`, newJob);
      const addedJob = {
        id: response.data.data.id,
        company: response.data.data.employer_id,
        logo: 'https://via.placeholder.com/20?text=Job',
        position: response.data.data.designation,
        location: response.data.data.job_location,
        salary: response.data.data.salary_range,
        type: response.data.data.job_type,
        key_skills: response.data.data.key_skills ? response.data.data.key_skills.split(',') : [],
        overview: response.data.data.overview,
        required_experience: response.data.data.required_experience,
        required_qualification: response.data.data.required_qualification,
        roles_n_responsibilities: response.data.data.roles_n_responsibilities,
        shift_type: response.data.data.shift_type,
        job_title: response.data.data.job_title,
      };
      setJobs([...jobs, addedJob]);
      setShowModal(false);
      setSelectedSkills([]);
      setCustomSkill('');

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

  // Handle Edit Job
  const handleEditJob = async (e) => {
    e.preventDefault();
    const skillsString = selectedSkills.map(skill => skill.value).join(',');
    const updatedJob = {
      job_title: e.target.job_title.value,
      designation: e.target.designation.value,
      slug: e.target.designation.value.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      job_location: e.target.job_location.value,
      job_type: e.target.job_type.value,
      salary_range: e.target.salary_range.value,
      key_skills: skillsString,
      overview: e.target.overview.value,
      required_experience: parseInt(e.target.required_experience.value),
      required_qualification: e.target.required_qualification.value,
      roles_n_responsibilities: e.target.roles_n_responsibilities.value,
      shift_type: e.target.shift_type.value,
    };
    try {
      const response = await axios.post(`${API_BASE_URL}/update/${currentJob.id}`, updatedJob);
      const updatedJobData = {
        id: response.data.data.id,
        company: response.data.data.employer_id,
        logo: 'https://via.placeholder.com/20?text=Job',
        position: response.data.data.designation,
        location: response.data.data.job_location,
        salary: response.data.data.salary_range,
        type: response.data.data.job_type,
        key_skills: response.data.data.key_skills ? response.data.data.key_skills.split(',') : [],
        overview: response.data.data.overview,
        required_experience: response.data.data.required_experience,
        required_qualification: response.data.data.required_qualification,
        roles_n_responsibilities: response.data.data.roles_n_responsibilities,
        shift_type: response.data.data.shift_type,
        job_title: response.data.data.job_title,
      };
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

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/remove/${id}`);
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

  const handleAddCustomSkill = async () => {
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
        setSelectedSkills([...selectedSkills, newSkill]);
        setCustomSkill('');
      } catch (error) {
        console.error('Error adding custom skill:', error.response?.data || error.message);
        Swal.fire('Error', 'Failed to add custom skill!', 'error');
      }
    } else if (customSkill.trim()) {
      const existingSkill = skills.find(s => s.label.toLowerCase() === customSkill.trim().toLowerCase());
      if (!selectedSkills.some(skill => skill.value === existingSkill.value)) {
        setSelectedSkills([...selectedSkills, existingSkill]);
      }
      setCustomSkill('');
    }
  };

  const handleEditCustomSkill = async () => {
    if (editCustomSkill.trim() && !skills.some(s => s.label.toLowerCase() === editCustomSkill.trim().toLowerCase())) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'https://girangroup.com/jobfoundation/public/api/skills/store',
          { skill_name: editCustomSkill.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newSkill = { value: response.data.id.toString(), label: editCustomSkill.trim() };
        setSkills([...skills, newSkill]);
        setSelectedSkills([...selectedSkills, newSkill]);
        setEditCustomSkill('');
      } catch (error) {
        console.error('Error adding custom skill:', error.response?.data || error.message);
        Swal.fire('Error', 'Failed to add custom skill!', 'error');
      }
    } else if (editCustomSkill.trim()) {
      const existingSkill = skills.find(s => s.label.toLowerCase() === editCustomSkill.trim().toLowerCase());
      if (!selectedSkills.some(skill => skill.value === existingSkill.value)) {
        setSelectedSkills([...selectedSkills, existingSkill]);
      }
      setEditCustomSkill('');
    }
  };

  return (
    <div className="main-wrapper">
      {/* Sidebar (unchanged) */}
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <a href="/index" className="logo d-flex align-items-center">
            <img src="https://girangroup.com/jobfoundation/public/build/images/logo-light.png" className="card-logo card-logo-dark" alt="logo dark" height="50" />
          </a>
          <button
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover text-white"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>

        <div className="dropdown sidebar-user m-1 rounded">
          <button
            type="button"
            className="btn material-shadow-none d-flex align-items-center gap-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              className="rounded-circle header-profile-user"
              src={user.avatar}
              alt="Header Avatar"
              style={{ width: '40px', height: '40px' }}
            />
            <span className="text-start text-white">
              <span className="d-block fw-medium sidebar-user-name-text">{user.name}</span>
              <span className="d-block fs-14 sidebar-user-name-sub-text">
                <i className="ri ri-circle-fill fs-10 text-success align-baseline"></i>{' '}
                <span className="align-middle">Online</span>
              </span>
            </span>
          </button>
          <div className="dropdown-menu dropdown-menu-end">
            <h6 className="dropdown-header">Welcome {user.name}!</h6>
            <a className="dropdown-item" href="/pages-profile">
              <i className="material-icons text-muted fs-16 align-middle me-1">account_circle</i>
              <span>Profile</span>
            </a>
            <a className="dropdown-item" href="/apps-chat">
              <i className="material-icons text-muted fs-16 align-middle me-1">message</i>
              <span>Messages</span>
            </a>
            <a className="dropdown-item" href="/apps-tasks-kanban">
              <i className="material-icons text-muted fs-16 align-middle me-1">task</i>
              <span>Taskboard</span>
            </a>
            <a className="dropdown-item" href="/pages-faqs">
              <i className="material-icons text-muted fs-16 align-middle me-1">help</i>
              <span>Help</span>
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="/pages-profile">
              <i className="material-icons text-muted fs-16 align-middle me-1">account_balance_wallet</i>
              <span>Balance: <b>$5971.67</b></span>
            </a>
            <a className="dropdown-item" href="/pages-profile-settings">
              <span className="badge bg-success-subtle text-success mt-1 float-end">New</span>
              <i className="material-icons text-muted fs-16 align-middle me-1">settings</i>
              <span>Settings</span>
            </a>
            <a className="dropdown-item" href="/auth-lockscreen-basic">
              <i className="material-icons text-muted fs-16 align-middle me-1">lock</i>
              <span>Lock screen</span>
            </a>
            <a className="dropdown-item" href="#" onClick={() => console.log('Logout')}>
              <i className="material-icons text-muted fs-16 align-middle me-1">logout</i>
              <span>Logout</span>
            </a>
          </div>
        </div>

        <div id="scrollbar">
          <div className="container-fluid">
            <ul className="navbar-nav" id="navbar-nav">
              <li className="menu-title">
                <span className="text-white text-uppercase">Menu</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link text-white" to="/employer-profile-dashboard">
                  <i className="ri ri-dashboard-2-line me-2"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link menu-link text-white" to="/employer-dashboard">
                  <i className="ri ri-dashboard-2-line me-2"></i>
                  <span>Job Openings</span>
                </Link>
              </li>
               <li className="nav-item">
                                <Link className="nav-link menu-link text-white" to="/edit-employer">
                                  <i className="ri ri-user-settings-line me-2"></i>
                                  <span>Edit Employer</span>
                                </Link>
                              </li>
            </ul>
          </div>
        </div>
        <div className="sidebar-background"></div>
      </div>

      <div className="vertical-overlay"></div>

      <div className="main-content">
        <header id="page-topbar" className="bg-white shadow-sm">
          <div className="layout-width">
            <div className="navbar-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn material-shadow-none"
                >
                  <i className="bx bx-menu fs-22 text-muted"></i>
                </button>
                <form className="app-search d-none d-md-block ms-3">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      placeholder="Search..."
                      value={searchQueryTopbar}
                      onChange={(e) => setSearchQueryTopbar(e.target.value)}
                      style={{ paddingLeft: '40px', backgroundColor: '#f8f9fa' }}
                    />
                    <span className="material-icons search-widget-icon" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}>
                      search
                    </span>
                  </div>
                </form>
              </div>
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <div className="dropdown topbar-head-dropdown header-item">
                    <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle" data-bs-toggle="dropdown">
                      <img src={languageFlags[language]} className="rounded" alt="Header Language" height="20" />
                    </button>
                    <div className="dropdown-menu dropdown-menu-end">
                      <a href="/index/en" className="dropdown-item notify-item language py-2" onClick={() => setLanguage('en')}>
                        <img src="https://flagcdn.com/20x15/us.png" alt="English" className="me-2 rounded" height="20" />
                        <span className="align-middle">English</span>
                      </a>
                      <a href="/index/sp" className="dropdown-item notify-item language" onClick={() => setLanguage('sp')}>
                        <img src="https://flagcdn.com/20x15/es.png" alt="Spanish" className="me-2 rounded" height="20" />
                        <span className="align-middle">Española</span>
                      </a>
                    </div>
                  </div>
                  <div className="dropdown topbar-head-dropdown ms-1 header-item">
                    <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle" data-bs-toggle="dropdown">
                      <i className="bx bx-grid-alt fs-22 text-muted"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
                      <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                        <div className="row align-items-center">
                          <div className="col">
                            <h6 className="m-0 fw-semibold fs-15">Web Apps</h6>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="row g-0">
                          <div className="col">
                            <a className="dropdown-icon-item" href="#!">
                              <img src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/github.svg" alt="Github" height="24" />
                              <span>GitHub</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown topbar-head-dropdown ms-1 header-item">
                    <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle" data-bs-toggle="dropdown">
                      <i className="bx bx-shopping-bag fs-22 text-muted"></i>
                      <span className="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info">
                        {cartItems.length}
                      </span>
                    </button>
                    <div className="dropdown-menu dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart">
                      <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                        <div className="row align-items-center">
                          <div className="col">
                            <h6 className="m-0 fs-16 fw-semibold">My Cart</h6>
                          </div>
                          <div className="col-auto">
                            <span className="badge bg-warning-subtle text-warning fs-13">
                              <span className="cartitem-badge">{cartItems.length}</span> items
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <div className="p-2">
                          {cartItems.map((item) => (
                            <div key={item.id} className="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <h6 className="mt-0 mb-1 fs-14">
                                    <a href="/apps-ecommerce-product-details" className="text-reset">{item.name}</a>
                                  </h6>
                                  <p className="mb-0 fs-12 text-muted">
                                    Quantity: <span>{item.quantity} x ${item.price}</span>
                                  </p>
                                </div>
                                <div className="px-2">
                                  <h5 className="m-0 fw-normal">${item.quantity * item.price}</h5>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border">
                        <div className="d-flex justify-content-between align-items-center pb-3">
                          <h5 className="m-0 text-muted">Total:</h5>
                          <h5 className="m-0">${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}</h5>
                        </div>
                        <a href="/apps-ecommerce-checkout" className="btn btn-success text-center w-100">Checkout</a>
                      </div>
                    </div>
                  </div>
                  <div className="ms-1 header-item d-none d-sm-flex">
                    <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle">
                      <i className="bx bx-fullscreen fs-22 text-muted"></i>
                    </button>
                  </div>
                  <div className="ms-1 header-item d-none d-sm-flex">
                    <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle">
                      <i className="bx bx-moon fs-22 text-muted"></i>
                    </button>
                  </div>
                  <div className="dropdown topbar-head-dropdown ms-1 header-item">
                    <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle" data-bs-toggle="dropdown">
                      <i className="bx bx-bell fs-22 text-muted"></i>
                      <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                        {notifications}
                      </span>
                    </button>
                    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
                      <div className="p-3">
                        <h6 className="m-0 fs-16 fw-semibold">Notifications</h6>
                      </div>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <div className="p-2">
                          <div className="text-reset notification-item d-block dropdown-item">
                            <div className="d-flex">
                              <div className="flex-grow-1">
                                <h6 className="mt-0 mb-1 fs-13 fw-semibold">New Job Application</h6>
                                <p className="mb-0 fs-11 text-muted">You have a new application for Software Engineer.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dropdown header-item topbar-user ms-auto">
                  <button
                    className="btn material-shadow-none d-flex align-items-center"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                  >
                    <img
                      className="rounded-circle header-profile-user me-2"
                      src={user.avatar}
                      alt="Header Avatar"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text text-muted">Founder</span>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {user.name}!</h6>
                    <a className="dropdown-item" href="/pages-profile">
                      <span className="material-icons text-muted fs-16 align-middle me-1">account_circle</span>
                      <span>Profile</span>
                    </a>
                    <a className="dropdown-item" href="#" onClick={() => console.log('Logout')}>
                      <i className="bx bx-power-off font-size-16 align-middle me-1 text-muted"></i>
                      <span>Logout</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card" id="applicationList">
                  <div className="card-header border-0">
                    <div className="d-md-flex align-items-center">
                      <h4 className="card-title mb-3 mb-md-0 flex-grow-1 fw-bold">Job Listing</h4>
                      <div className="flex-shrink-0">
                        <button className="btn btn-primary add-btn" onClick={() => setShowModal(true)}>
                          <i className="ri-add-line align-bottom me-1"></i> Add New Job
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card-body border border-dashed border-end-0 border-start-0">
                    <form>
                      <div className="row g-3">
                        <div className="col-xxl-2 col-sm-4">
                          <select
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                          >
                            <option value="all">All</option>
                            <option value="Open">Open</option>
                            <option value="Hiring Soon">Hiring Soon</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                        <div className="col-xxl-4 col-sm-4">
                          <div className="search-box">
                            <input
                              type="text"
                              className="form-control search"
                              placeholder="Search for application ID, company, designation status or something..."
                              value={searchQueryDashboard}
                              onChange={(e) => setSearchQueryDashboard(e.target.value)}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                        <div className="col-xxl-2 col-sm-4">
                          <button type="button" className="btn btn-primary w-100 filter-btn" onClick={filterData}>
                            <i className="ri-equalizer-fill me-1 align-bottom"></i> Filters
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="card-body pt-0">
                    <ul className="nav nav-tabs nav-tabs-custom nav-success mb-3" role="tablist">
                      <li className="nav-item">
                        <a className="nav-link active" href="#">All Jobs</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">Open Jobs</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">Closed Jobs</a>
                      </li>
                    </ul>

                    <div className="table-responsive table-card mb-1">
                      <table className="table table-nowrap align-middle" id="jobListTable">
                        <thead className="text-muted table-light">
                          <tr className="text-uppercase">
                            <th scope="col" style={{ width: '25px' }}>
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkAll" />
                              </div>
                            </th>
                            <th className="sort" style={{ width: '140px' }}>Job ID</th>
                            <th className="sort">Designation</th>
                            <th className="sort">Location</th>
                            <th className="sort">Salary Range</th>
                            <th className="sort">Job Type</th>
                            <th className="sort">Status</th>
                            <th className="sort">Key Skills</th>
                            <th className="sort">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {filterData().map((job, index) => (
                            <tr key={index}>
                              <th scope="row">
                                <div className="form-check">
                                  <input className="form-check-input" type="checkbox" name="checkAll" />
                                </div>
                              </th>
                              <td className="id"><a href="#" className="fw-medium link-primary">{job.id}</a></td>
                              <td className="position">{job.position}</td>
                              <td className="location">{job.location}</td>
                              <td className="salary">{job.salary}</td>
                              <td className="type">{job.type}</td>
                              <td className="status">
                                <span className={`badge ${job.status === 'Open' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} text-uppercase`}>
                                  {job.status}
                                </span>
                              </td>
                              <td className="key_skills">
                                {job.key_skills.map(skillId => {
                                  const matchedSkill = skills.find(s => s.value === skillId.toString());
                                  const skillName = matchedSkill ? matchedSkill.label : skillId;
                                  return (
                                    <span key={skillId} className="badge bg-primary-subtle text-primary me-1">
                                      {skillName}
                                    </span>
                                  );
                                })}
                              </td>
                              <td>
                                <ul className="list-inline hstack gap-2 mb-0">
                                  <li className="list-inline-item" title="View">
                                    <a href="job-details.html" className="text-primary">
                                      <i className="ri-eye-fill fs-16"></i>
                                    </a>
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
                                    <a
                                      className="text-danger"
                                      href="#deleteJob"
                                      onClick={() => handleDeleteJob(job.id)}
                                    >
                                      <i className="ri-delete-bin-5-fill fs-16"></i>
                                    </a>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {filterData().length === 0 && (
                        <div className="noresult">
                          <div className="text-center">
                            <h5 className="mt-2">No Jobs Found</h5>
                            <p className="text-muted">We couldn't find any matching job listings.</p>
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

        {/* Add New Job Modal */}
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="addJobModalLabel" aria-hidden={!showModal}>
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
        </div>

        {/* Edit Job Modal */}
        {showEditModal && currentJob && (
          <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="editJobModalLabel" aria-hidden={!showEditModal}>
            <div className="modal-dialog" role="document">
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
                      <select className="form-control" id="job_type" name="job_type" defaultValue={currentJob.type} required>
                        <option value="Full-time">Full-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="salary_range" className="form-label">Salary Range</label>
                      <input type="text" className="form-control" id="salary_range" name="salary_range" defaultValue={currentJob.salary} required />
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
    </div>
  );
};

export default EmployerDashboard;