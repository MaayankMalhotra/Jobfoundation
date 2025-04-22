import React, { useState }  from 'react';
import HeaderMain from './components/header';
import Footer from './components/footer';
import BannerSection from './components/bannerSectionInner';
import CalendarIcon from '../src/assets/images/calendarIcon.png'
import MapIcon from '../src/assets/images/mapIcon.png'
import ExperinceIcon from  '../src/assets/images/experince.png'
import DollarIcon from  '../src/assets/images/dollar.png'
import { Link } from 'react-router-dom';
import ProfileImage from  '../src/assets/images/profileImage.jpg'

const cardInfoJob = {
    id: 1,
    jobTitle: 'Finance Manager & Health',
    date: '20-04-2025',
    address: 'Canada',
    jobType: 'Full Time',
    experince: 'Fresher - 2 Years',
    salary: '500',
    salaryType: 'Week',
    loginStatus: true,
    profileImg: ProfileImage,
    rating: '5.0',
  };
  const htmlContent = `
<div class="row gx-3 align-items-center topSpaceAdd">
  <div class="col">
    <div class="main-row-job singleDetailsRow">
      <div class="employer-logo">
        {{profileImgOrInitials}}
      </div>
      <div class="job-information">
        <h2 class="job-title">{{jobTitle}}</h2>
        <div class="jobListInfoStyle">
          <h3 class="employer-title">
            <img src=${CalendarIcon} />
            {{date}}
          </h3>
          <div class="job-location">
            <span>
              <img src=${MapIcon} />
              {{address}}
            </span>
          </div>
          <h3 class="employer-title">
            <img src=${DollarIcon} />
            {{salary}}/{{salaryType}}
          </h3>
          <h3 class="employer-title">
            <img src=${ExperinceIcon} />
            {{experince}}
          </h3>
        </div>
      </div>
    </div>
  </div>
  <div class="col-md-auto">
      <div class="singleButtonStyle">
        {{buttonVar}}
      </div>
  </div>
</div>`;
  const getInitials = (text) => {
    return text
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };
  const profileImgOrInitials = cardInfoJob.profileImg
  ? `<a href="#" class="imageLinkTitle">
      <img src="${cardInfoJob.profileImg}" alt="Profile" class="profile-image" />
    </a>`
  : `<a href="#" class="textLinkTitle">${getInitials(cardInfoJob.jobTitle)}</a>`;

  const buttonVar = cardInfoJob.loginStatus ?             
        `<a href="#" class="btn btn-rounded-cstm btn-primary">
            Apply Now  <i class="ri-arrow-right-line align-bottom ms-1"></i>
        </a>`
        : `<a href="#" class="btn btn-rounded-cstm btn-primary">
            Login  <i class="ri-arrow-right-line align-bottom ms-1"></i>
        </a>`;

const JobDetails = () => {
    return(
            <>
                <HeaderMain/>
                <BannerSection
                classAdd='sectionSingle'
                    htmlContent={htmlContent}
                      data={{  
                        jobTitle: cardInfoJob.jobTitle,
                        date: cardInfoJob.date,
                        address: cardInfoJob.address,
                        profileImgOrInitials: profileImgOrInitials,
                        jobType: cardInfoJob.jobType,
                        salary: cardInfoJob.salary,
                        salaryType: cardInfoJob.salaryType,
                        experince: cardInfoJob.experince,
                        buttonVar: buttonVar,
                    }}
                />
                <section className="singleSectionMain section bg-white">
                    <div className="custom-container">
                        <div className="row gx-3 gx-lg-5">
                            <div className='col-md-8'>
                                <div className='contentSingleComn'>
                                    <h2>Job Description</h2>
                                    <p>As a Product Designer, you will work within a Product Delivery Team fused with UX, engineering, product and data talent. You will help the team design beautiful interfaces that solve business challenges for our clients. We work with a number of Tier 1 banks on building web-based applications for AML, KYC and Sanctions List management workflows. This role is ideal if you are looking to segue your career into the FinTech or Big Data arenas.</p>
                                </div>
                                <div className='contentSingleComn'>
                                    <h2>Key Responsibilities</h2>
                                    <ul>
                                        <li>Be involved in every step of the product design cycle from discovery to developer handoff and user acceptance testing.</li>
                                        <li>Work with BAs, product managers and tech teams to lead the Product Design</li>
                                        <li>Maintain quality of the design process and ensure that when designs are translated into code they accurately reflect the design specifications.</li>
                                        <li>Accurately estimate design tickets during planning sessions.</li>
                                        <li>Contribute to sketching sessions involving non-designersCreate, iterate and maintain UI deliverables including sketch files, style guides, high fidelity prototypes, micro interaction specifications and pattern libraries.</li>
                                        <li>Ensure design choices are data led by identifying assumptions to test each sprint, and work with the analysts in your team to plan moderated usability test sessions.</li>
                                        <li>Design pixel perfect responsive UI’s and understand that adopting common interface patterns is better for UX than reinventing the wheel</li>
                                        <li>Present your work to the wider business at Show & Tell sessions.</li>
                                    </ul>
                                </div>
                                <div className='contentSingleComn'>
                                    <h2>Skill & Experience</h2>
                                    <ul>
                                        <li>You have at least 3 years’ experience working as a Product Designer.</li>
                                        <li>You have experience using Sketch and InVision or Framer X</li>
                                        <li>You have some previous experience working in an agile environment – Think two-week sprints.</li>
                                        <li>You are familiar using Jira and Confluence in your workflow</li>
                                    </ul>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="card">
                                    <div className='card-body sidebarCustomStyle bg-lightBlue'>
                                        <h2 class="sidebarMainTitle">Job Overview</h2>
                                        <ul>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-calendar-line"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Date Posted</h3>
                                                    <p>June 20, 2021</p>
                                                </span>
                                            </li>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-map-pin-line"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Location</h3>
                                                    <p>Canada</p>
                                                </span>
                                            </li>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-money-dollar-circle-line"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Offered Salary:</h3>
                                                    <p>$150 - $180 / week</p>
                                                </span>
                                            </li>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-time-line"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Expiration date</h3>
                                                    <p>May 6, 2026</p>
                                                </span>
                                            </li>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-briefcase-4-fill"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Experience</h3>
                                                    <p>Fresher - 4 Year</p>
                                                </span>
                                            </li>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-user-line"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Gender</h3>
                                                    <p>Both</p>
                                                </span>
                                            </li>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-artboard-fill"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Qualification</h3>
                                                    <p>Bachelor Degree  </p>
                                                </span>
                                            </li>
                                            <li>
                                                <span className='iconSidebarList'>
                                                    <i class="ri-coin-fill"></i>
                                                </span>
                                                <span className="sidebarListContent">
                                                    <h3>Career Level</h3>
                                                    <p>Supervisior</p>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer/>
            </>
        )
}

export default JobDetails