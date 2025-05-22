import React, { useState, useEffect } from 'react';
import ProfileImage from '../src/assets/images/profileImage.jpg';
 import TopHeaderMain from './components/TopHearderEmplyoer';
import SidebarMenu from './components/sidebarMenus';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
const CandidateList = () => {
const { id } = useParams();
const [skills, setSkills] = useState([]);
const [candidates, setCandidates] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const candidatesPerPage = 10;
const indexOfLast = currentPage * candidatesPerPage;
const indexOfFirst = indexOfLast - candidatesPerPage;
const currentCandidates = candidates.slice(indexOfFirst, indexOfLast);


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
      fetchApprovalList();
    }
  }, [id]);



return (
    <div id="layout-wrapper">
            <TopHeaderMain/>
            <SidebarMenu/>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
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

        

)}

export default CandidateList;