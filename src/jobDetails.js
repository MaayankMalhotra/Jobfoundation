import React, { useState, useEffect } from 'react';
import HeaderMain from './components/header';
import Footer from './components/footer';
import BannerSection from './components/bannerSectionInner';
import CalendarIcon from '../src/assets/images/calendarIcon.png';
import MapIcon from '../src/assets/images/mapIcon.png';
import ExperinceIcon from '../src/assets/images/experince.png';
import DollarIcon from '../src/assets/images/dollar.png';
import ProfileImage from '../src/assets/images/profileImage.jpg';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from './components/loader';
import Swal from 'sweetalert2';
const JobDetails = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [hasApplied, setHasApplied] = useState(false)
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
        console.log(setSkills, 'Data check krna Skill ka')
      } catch (error) {
        console.error('Skills Fetch Mein Error:', error.message);
        Swal.fire('Error', 'Skills did not load!', 'error');
      }
    };
    fetchSkills();
   }, []);
useEffect(() => {
  const fetchJobData = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `https://girangroup.com/jobfoundation/public/api/employee/job-postings/show/${id}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const job = res.data?.data || {};
      console.log('Job Data:', res.data);
      setJobData(job);
      setHasApplied(job.has_applied === true); // 👈 Set hasApplied here
    } catch (err) {
      console.error('Error fetching job data:', err);
    }
  };

  if (id) {
    fetchJobData();
  }
}, [id]);

  const createdDate = new Date(jobData?.created_at?.split('T')[0]).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const updatedDate = new Date(jobData?.updated_at?.split('T')[0]).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

window.handleApplyJob = async function (jobId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://girangroup.com/jobfoundation/public/api/employee/job-applies', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_posting_id: jobId }),
    });

    const result = await response.json();

    if (response.ok) {
      // ✅ Store applied job ID in localStorage
      let appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
      if (!appliedJobs.includes(jobId)) {
        appliedJobs.push(jobId);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      }

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted',
        text: 'Your job application has been sent successfully!',
      });

      // Change button after apply
      const btn = document.querySelector(`#applyBtn_${jobId}`);
      if (btn) {
        btn.outerHTML = `
          <button class="btn btn-rounded-cstm btn-success-custom btn-sm w-100" disabled>
            <i class="ri-checkbox-circle-line align-bottom me-2"></i> Job Applied
          </button>
        `;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: result.message || 'Failed to submit application.',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong while submitting your application.',
    });
    console.error(error);
  }
};


  const getInitials = (text) => {
    return text
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };
    if (!jobData) return <Loader/>;
    
const employerLogo = jobData?.employer?.logo;
const profileImgOrInitials = employerLogo
  ? `<a href="#" class="imageLinkTitle">
      <img src="https://girangroup.com/jobfoundation/public/storage/${employerLogo}" alt="Profile" class="profile-image" />
    </a>`
  : `<a href="#" class="textLinkTitle">${getInitials(jobData?.designation || '')}</a>`;

  
let applyButtonHTML = '';
const isDisabled = jobData.status === 'on-hold' || jobData.status === 'closed';

if (!hasApplied) {
  applyButtonHTML = `
    <button
      id="applyBtn_${jobData.id}"
      onclick="handleApplyJob(${jobData.id})"
      ${isDisabled ? 'disabled' : ''}
      class="btn btn-rounded-cstm btn-primary btn-sm w-100"
    >
      Apply Now <i class="ri-arrow-right-up-line align-bottom ms-1"></i>
    </button>
  `;
} else {
  applyButtonHTML = `
    <button class="btn btn-rounded-cstm btn-success-custom btn-sm w-100" disabled>
      <i class="ri-checkbox-circle-line align-bottom me-2"></i> Job Applied
    </button>
  `;
}


  const htmlContent = `
    <div class="row gx-3 align-items-center topSpaceAdd">
      <div class="col">
        <div class="main-row-job align-items-center singleDetailsRow">
          <div class="employer-logo">
            ${profileImgOrInitials}
          </div>
          <div class="job-information">
            <h2 class="job-title mb-0">${jobData?.employer?.company_name || 'NA'}</h2>
            <div class="mb-2">
              ${jobData?.job_title} |
              ${jobData?.designation}
            </div>
            <div class="jobListInfoStyle">
              <h3 class="employer-title">
                <img src=${CalendarIcon} />
                ${createdDate || ''}
              </h3>
              <div class="job-location">
                <span>
                  <img src=${MapIcon} />
                  ${jobData?.job_location || ''}
                </span>
              </div>
              <h3 class="employer-title">
                <img src=${DollarIcon} />
                ${jobData?.salary_range || 'N/A'} / ${jobData?.salary_type || ''}
              </h3>
              <h3 class="employer-title">
                <img src=${ExperinceIcon} />
                ${jobData?.required_experience || 'N/A'}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-auto">
        <div className="mt-4">
          ${applyButtonHTML}
        </div>
      </div>
    </div>
  `;

  return (
    <>
      <HeaderMain />
      <BannerSection classAdd="sectionSingle" htmlContent={htmlContent} />
      <section className="singleSectionMain section bg-white">
        <div className="custom-container">
          <div className="row gx-3 gx-lg-5">
            <div className="col-lg-8">
                <div className="contentSingleComn">
                    <h2>Job Description</h2>
                    <p>{jobData?.overview || 'No description available.'}</p>
                </div>
                <div className="contentSingleComn">
                    <h2>Roles and Responsibilities</h2>
                    <p>{jobData?.roles_n_responsibilities || 'No Roles and Responsibilities available.'}</p>
                </div>
                <div className="contentSingleComn">
                    <h2>Skills</h2>
                    {/* <p>{jobData?.keySkillsArray || 'No Skills available.'}</p> */}
                    {jobData.key_skills.map(skillId => {
                      const matchedSkill = skills.find(s => s.value === skillId.toString());
                      const skillName = matchedSkill ? matchedSkill.label : skillId;
                      return (
                        <span key={skillId} className="badge bg-primary-subtle text-primary me-1">
                          {skillName}
                        </span>
                      );
                    })}
                </div>
                {/* Add other sections dynamically if required */}
            </div>
            <div className="col-lg-4">
                <div className="card">
                    <div className="card-body sidebarCustomStyle bg-lightBlue">
                        <h2 className="sidebarMainTitle">Job Overview</h2>
                        <ul>
                            <li>
                            <span className="iconSidebarList">
                                <i className="ri-calendar-line"></i>
                            </span>
                            <span className="sidebarListContent">
                                <h3>Date Posted</h3>
                                <p>{createdDate || 'N/A'}</p>
                            </span>
                            </li>
                            <li>
                            <span className="iconSidebarList">
                                <i className="ri-map-pin-line"></i>
                            </span>
                            <span className="sidebarListContent">
                                <h3>Location</h3>
                                <p>{jobData?.job_location || 'N/A'}</p>
                            </span>
                            </li>
                            <li>
                            <span className="iconSidebarList">
                                <i className="ri-money-dollar-circle-line"></i>
                            </span>
                            <span className="sidebarListContent">
                                <h3>Offered Salary</h3>
                                <p>${jobData?.salary_range || 'N/A'} / {jobData?.salary_type || ''}</p>
                            </span>
                            </li>
                            <li>
                            <span className="iconSidebarList">
                                <i className="ri-time-line"></i>
                            </span>
                            <span className="sidebarListContent">
                                <h3>Last Updated</h3>
                                <p>{ updatedDate || 'N/A'}</p>
                            </span>
                            </li>
                            <li>
                            <span className="iconSidebarList">
                                <i className="ri-briefcase-4-fill"></i>
                            </span>
                            <span className="sidebarListContent">
                                <h3>Experience</h3>
                                <p>{jobData?.required_experience || 'N/A'}</p>
                            </span>
                            </li>
                            <li>
                            <span className="iconSidebarList">
                                <i class="ri-briefcase-3-line"></i>
                            </span>
                            <span className="sidebarListContent">
                                <h3>Job Type</h3>
                                <p>{jobData?.job_type || 'N/A'}</p>
                            </span>
                            </li>
                            <li>
                            <span className="iconSidebarList">
                                <i className="ri-artboard-fill"></i>
                            </span>
                            <span className="sidebarListContent">
                                <h3>Qualification</h3>
                                <p>{jobData?.required_qualification || 'N/A'}</p>
                            </span>
                            </li>
                            {/* <li>
                              <span className="iconSidebarList">
                                  <i className="ri-coin-fill"></i>
                              </span>
                              <span className="sidebarListContent">
                                  <h3>Career Level</h3>
                                  <p>{jobData?.career_level || 'N/A'}</p>
                              </span>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default JobDetails;
