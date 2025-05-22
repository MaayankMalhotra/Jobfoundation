import React from 'react';
import CalendarIcon from '../assets/images/calendarIcon.png'
import MapIcon from '../assets/images/mapIcon.png'
import ExperinceIcon from  '../assets/images/experince.png'
import DollarIcon from  '../assets/images/dollar.png'
import SearchJobIcon from  '../assets/images/Search_job_icon.png'
import { Link } from 'react-router-dom';


const JobCards = ({jobData , className='', onApplyClick, hasApplied }) => {
    const getInitials = (title) => {
        return title.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
    };
    console.log(jobData)
    const {
        company_name = true,
        address = true,
        salary = true,
        salaryType = true,
        match_percentage = true,
        experince = true,
        jobType = true,
        date = true,
        designation = true,
        profileImg = true,
        id=true,
        jobTitle =true,
        status =true
    } = jobData
    return(
        <>

        <div className={`job-grid  ${className}` }>
            {status === 'on-hold' ? (
            <div className="bg-warning-light labelAddStatusCntnt">
                <p className="mb-0 text-warning fw-bold">This job is currently on hold.</p>
            </div>
            ) : status === 'closed' ? (
            <div className="bg-danger-light labelAddStatusCntnt">
                <p className="mb-0 text-danger fw-bold">The employer has closed this job posting.</p>
            </div>
            ) : null}

            <div className='main-row-job'>
                    <div className="employer-logo">
                        {profileImg ? (
                            <Link to={`/job-detail/${id}`} className='imageLinkTitle'>
                                <img src={profileImg} alt="Profile" className="profile-image" />
                            </Link>
                        ) : (
                            <Link to={`/job-detail/${id}`} className='textLinkTitle'>
                                {getInitials(company_name)}
                            </Link>
                        )}
                    </div>
                    
                        
                    
                    <div className="job-information">
                    {company_name && (
                        <h2 className="job-title">
                            <Link to={`/job-detail/${id}`} rel="bookmark">{company_name}</Link>
                        </h2>
                    )}
                    <div className='d-flex flex-wrap gap-2 align-items-center mb-2'>
                        {jobTitle && (
                            <h3 className="employer-title">
                                {jobTitle}
                            </h3>
                        )}
                        <span className='employer-title'>|</span>
                        {designation && (
                            <h3 className="employer-title">
                                {designation}
                            </h3>
                        )}
                    </div>
                    <div className='d-flex flex-wrap gap-3 align-items-center'>
                        {date && (
                            <h3 className="employer-title">
                                <img src={CalendarIcon}/>
                                {date}
                            </h3>
                        )}
                        
                        {address && (
                            <div className="job-location">
                                <span>
                                    <img src={MapIcon}/>
                                    {address}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='bodyCardJob'>
                    <div className='mainCardShortInfo'>
                        {experince && (
                        <div className="cardsInfoStyle bg-theme-light">
                            <img src={ExperinceIcon} />
                            <span>{experince}</span>
                        </div>
                        )}
                        {salary && (
                        <div className="cardsInfoStyle bg-success-light">
                            <img src={DollarIcon} />
                            <span>{salary} {salaryType}</span>
                        </div>
                        )}
                        {jobType && (     
                        <div className="cardsInfoStyle bg-sky-blue">
                            <img src={SearchJobIcon}/>
                            <span>{jobType}</span>
                        </div>
                        )}
                    </div>
            </div>
            <div class="bottomCardInfo row gx-3 align-items-center">
                {match_percentage > 0 && (
                    <div className="col text-start">
                        <div className="d-inline ratingStarCstm">
                        <span>Profile Match: {match_percentage}%</span>
                        </div>
                    </div>
                )}
                
                <div className="col-auto">
                    {hasApplied ? (
                        <button
                        type="button"
                        className="btn btn-rounded-cstm btn-success-custom btn-sm w-100"
                        disabled='disabled'
                        >
                        <i class="ri-checkbox-circle-line align-bottom me-2"></i>
                        Job Applied 
                    </button>
                    ) : (

                    <button
                        type="button"
                        onClick={() => onApplyClick && onApplyClick(jobData.id)}
                        className="btn btn-rounded-cstm btn-primary btn-sm w-100"
                        disabled={status === 'on-hold' || status === 'closed'}
                        >
                        Apply Now <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
                    </button>
                    )}
                </div>
                
            </div>
        </div>

        </>
    )
}

export default JobCards