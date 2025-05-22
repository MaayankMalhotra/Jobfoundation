import React, { useState, useEffect } from 'react';
import TopHeaderMain from './components/TopHearderEmplyoer';
import SidebarMenu from './components/sidebarMenus';
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
const EmployerJobDetails = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
   const [skills, setSkills] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 10;

  // const dummyImage = 'https://via.placeholder.com/60x60.png?text=User';

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
    fetchSkills();
   }, []);


  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = `https://girangroup.com/jobfoundation/public/api/employer/job-postings/show/${id}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const job = res.data?.data || {};
       
        setJobData(job || {});
      } catch (err) {
        console.error('Error fetching job data:', err);
      }
    };

   const fetchApprovalList = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = `https://girangroup.com/jobfoundation/public/api/employer/job-postings/approved-candidates/${id}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setCandidates(res.data.data || []);
      } catch (err) {
        console.error('Error fetching Approved Candidates:', err);
      }
    };


    if (id) {
      fetchJobData();
      fetchApprovalList();
    }
  }, [id]);
    // Pagination logic
  const indexOfLast = currentPage * candidatesPerPage;
  const indexOfFirst = indexOfLast - candidatesPerPage;
  const currentCandidates = candidates.slice(indexOfFirst, indexOfLast);
  console.log(currentCandidates)
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



  const htmlContent = `
    <div class="row gx-3 align-items-center topSpaceAdd">
      <div class="col">
        <div class="main-row-job align-items-center singleDetailsRow">
          <div class="employer-logo">
            ${profileImgOrInitials}
          </div>
          <div class="job-information">
            <h2 class="job-title">${jobData?.designation || ''}</h2>
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
    </div>
  `;

  return (
    <>
    <div id="layout-wrapper">
            <TopHeaderMain/>
            <SidebarMenu/>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <BannerSection classAdd="px-3 sectionSingle border-bottom pt-2" htmlContent={htmlContent} noWrapperClass={true} />
                        <section className="singleSectionMain py-5 px-3 bg-white">
                            <div className="">
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
                        <section className='space mt-5'>
                          <div className='card'>
                            <div className='card-body pt-0'>
                              <h2 className='mainTitleStyleShort mt-3 pt-md-3'>Candidate List</h2>
                              <div className='table-responsive table-card mt-3 mb-1'>
                                <table className='table table-nowrap align-middle tableFontSize tableMainDesignCstm'>
                                  <thead className='text-muted table-light'>
                                    <tr className='tableHeadDesignStyle'>
                                      <th>S.No</th>
                                      <th>Candidate Details</th>
                                      <th>Skills</th>
                                      <th>Experience</th>
                                      <th>Salary Range</th>
                                      <th>Notice Period</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentCandidates.length > 0 ? (
                                      currentCandidates.map((item, index) => {
                                        const user = item.user || {};
                                        const employee = user.employee || {};
                                        const fullName = `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''}`.trim();
                                        const profileImg = employee.profile ? `https://girangroup.com/jobfoundation/public/storage/${employee.profile}` : ProfileImage;

                                        return (
                                          <tr key={item.id}>
                                            <td>#{indexOfFirst + index + 1}</td>
                                            <td>
                                              <div className='d-flex align-items-start'>
                                                <img
                                                  src={profileImg}
                                                  alt='Profile'
                                                  className='rounded-circle avatar-xs me-2'
                                                  style={{ width: '50px', height: '50px', objectFit: 'cover', border: '2px solid #f0e1ff' }}
                                                />
                                                <div class="listImageStyle">
                                                  <h2>{fullName}</h2>
                                                  <p><i class="ri-phone-line me-1"></i>{user.phone}</p>
                                                  <p><i class="ri-mail-line me-1"></i>{user.email}</p>
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              {employee.skills
                                                ? employee.skills.split(',').map(skillId => {
                                                    const matchedSkill = skills.find(s => s.value === skillId.trim());
                                                    const skillName = matchedSkill ? matchedSkill.label : skillId;
                                                    return (
                                                      <span key={skillId} className="badge bg-primary-subtle text-primary me-1">
                                                        {skillName}
                                                      </span>
                                                    );
                                                  })
                                                : <span>-</span>
                                              }
                                            </td>
                                            <td>{employee.experience ? `${employee.experience} Years` : '-'}</td>
                                            <td>
                                              <span className='d-block'>CTC: {employee.ctc}</span>
                                              <span className='d-block'>ECTC: {employee.ectc}</span>
                                            </td>
                                            {/* <td>{employee.ctc && employee.ectc ? `${employee.ctc} - ${employee.ectc}` : '-'}</td> */}
                                            <td>{employee.notice_period ? `${employee.notice_period} Days` : '-'}</td>
                                            <td>
                                              <ul className='list-inline hstack gap-2 mb-0'>
                                                <li className='list-inline-item'>
                                                  <a
                                                    href={employee.cv ? `https://girangroup.com/jobfoundation/public/storage/${employee.cv}` : '#'}
                                                    download
                                                    className={`btn btn-sm btn-outline-primary ${!employee.cv && 'disabled'}`}
                                                  >
                                                    Download CV
                                                  </a>
                                                </li>
                                              </ul>
                                            </td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td colSpan='9' className='text-center'>No Candidates Found</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              <div className='d-flex justify-content-between align-items-center mt-3'>
                                <div>
                                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, candidates.length)} of {candidates.length} entries
                                </div>
                                <nav>
                                  <ul className='pagination mb-0'>
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                      <button className='page-link' onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                    </li>
                                    {Array.from({ length: Math.ceil(candidates.length / candidatesPerPage) }, (_, i) => (
                                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className='page-link' onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                      </li>
                                    ))}
                                    <li className={`page-item ${currentPage === Math.ceil(candidates.length / candidatesPerPage) ? 'disabled' : ''}`}>
                                      <button className='page-link' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                    </li>
                                  </ul>
                                </nav>
                              </div>
                            </div>
                          </div>
                        </section>
                    </div>
                </div>
            </div>
    </div>

    </>
  );
};

export default EmployerJobDetails;
