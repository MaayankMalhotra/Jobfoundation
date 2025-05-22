// import React, { useEffect } from "react";


import React , { useState } from 'react';
// import { Link } from 'react-router-dom';
import HeaderMain from './components/header';
import Footer from './components/footer';
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaArrowRight, FaBookmark } from "react-icons/fa";
import HeroSection from './components/HeroSection';
// import AuthCheck from './AuthCheck';





// const Navbar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-landing fixed-top job-navbar navHeaderColor" id="navbar">
//       <div className="container-fluid custom-container">
//         <Link className="navbar-brand" to="/">
//           <img src="https://girangroup.com/jobfoundation/public/build/images/logo-dark.png" className="card-logo card-logo-dark" alt="logo dark" height="40" />
          
//         </Link>
//         <button className="navbar-toggler py-0 fs-20 text-body" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//           <i className="mdi mdi-menu"></i>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav ms-auto mt-2 mt-lg-0 me-2" id="navbar-example">
//             <li className="nav-item">
//               <Link className="nav-link active" to="#hero">Home</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="#about">About us</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="#contact">Contact us</Link>
//             </li>
//           </ul>

//           <div>
//             <Link to="/LoginPage" className="btn btn-soft-primary">
//               <i className="ri-user-3-line align-bottom me-1"></i> Login & Register
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };




// const HeroSection = () => {
//   const [jobTitle, setJobTitle] = useState(""); // State for job title input
//   const [jobType, setJobType] = useState(""); // State for job type dropdown
//   const [jobs, setJobs] = useState([]); // State to store API response
//   const [error, setError] = useState(""); // State for error messages
//   const [loading, setLoading] = useState(false); // State for loading status
//   const [bookmarks, setBookmarks] = useState({}); // State to track bookmarked jobs

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     setError(""); // Clear previous errors
//     setJobs([]); // Clear previous results
//     setLoading(true); // Set loading to true

//     // Construct the API URL with query parameters
//     const apiUrl = `http://127.0.0.1:8000/api/filter-job?job_title=${encodeURIComponent(
//       jobTitle
//     )}&job_type=${jobType}`;

//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();

//       if (response.ok && data.status) {
//         setJobs(data.data); // Update state with fetched jobs
//       } else {
//         setError(data.message || "Failed to fetch jobs. Please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred while fetching jobs. Please try again.");
//     } finally {
//       setLoading(false); // Set loading to false
//     }
//   };

//   const toggleBookmark = (jobId) => {
//     setBookmarks((prev) => ({
//       ...prev,
//       [jobId]: !prev[jobId], // Toggle bookmark state for the job
//     }));
//   };

//   return (
//     <section className="section job-hero-section bg-light" id="hero">
//       <div className="container">
//         <div className="row justify-content-between align-items-center pt-5">
//           <div className="col-lg-8 text-center m-auto">
//             <div>
//               <h1 className="display-6 fw-semibold text-capitalize mb-3 lh-base">
//                 Find your next job and build your dream here
//               </h1>
//               <p className="lead text-muted lh-base mb-4">
//                 Find jobs, create trackable resumes and enrich your applications.
//                 Carefully crafted after analyzing the needs of different industries.
//               </p>
//               <form onSubmit={handleSubmit} className="job-panel-filter">
//                 <div className="row g-md-0 g-2">
//                   <div className="col-md-4">
//                     <div>
//                       <input
//                         type="search"
//                         id="job-title"
//                         className="form-control filter-input-box"
//                         placeholder="Job, Company name..."
//                         value={jobTitle}
//                         onChange={(e) => setJobTitle(e.target.value)} // Update jobTitle state
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div>
//                       <select
//                         className="form-control"
//                         value={jobType}
//                         onChange={(e) => setJobType(e.target.value)} // Update jobType state
//                       >
//                         <option value="">Select job type</option>
//                         <option value="Full-Time">Full Time</option>
//                         <option value="Part-Time">Part Time</option>
//                         <option value="remote">Remote</option>
//                         <option value="Internship">Internship</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="h-100">
//                       <button
//                         className="btn btn-primary submit-btn w-100 h-100"
//                         type="submit"
//                         disabled={loading} // Disable button while loading
//                       >
//                         <i className="ri-search-2-line align-bottom me-1"></i>{" "}
//                         {loading ? "Searching..." : "Find Job"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </form>

//               {error && (
//                 <div className="alert alert-danger mt-3" role="alert">
//                   {error}
//                 </div>
//               )}

//               {jobs.length > 0 && (
//                 <div className="mt-4">
//                   <h4>Search Results:</h4>
//                   <Row>
//                     {jobs.map((job, index) => {
//                       // Transform API data to match JobCard props
//                       const jobData = {
//                         title: job.job_title || "Unknown Title",
//                         company: job.employer_id || "Unknown Company", // Adjust based on API response
//                         location: job.job_location || "Unknown Location", // Adjust based on API response
//                         salary: job.salary_range || "Not Specified", // Adjust based on API response
//                         description: job.overview || "No description available", // Adjust based on API response
//                         tags: [
//                           { text: job.job_type || "N/A", bgColor: "bg-success-subtle", color: "success" },
//                           { text: job.designation || "N/A", bgColor: "bg-danger-subtle", color: "danger" },
//                           { text: job.key_skills || "N/A", bgColor: "bg-primary-subtle", color: "primary" },
//                         ],
//                         companyImg: "assets/images/companies/img-placeholder.png", // Placeholder image
//                         bgColor: "bg-warning-subtle",
//                       };

//                       return (
//                         <Col md={12} key={index}>
//                           <Card className="shadow-lg mb-4">
//                             <Card.Body>
//                               <div className="d-flex">
//                                 <div className={`avatar-sm me-3`}>
//                                   <div className={`avatar-title ${jobData.bgColor} rounded`}>
//                                     <img src={jobData.companyImg} alt="" className="avatar-xxs" />
//                                   </div>
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <a href="#!"><h5>{jobData.title}</h5></a>
//                                   <ul className="list-inline text-muted mb-3">
//                                     <li className="list-inline-item">
//                                       <FaBuilding className="me-1" /> {jobData.company}
//                                     </li>
//                                     <li className="list-inline-item">
//                                       <FaMapMarkerAlt className="me-1" /> {jobData.location}
//                                     </li>
//                                     <li className="list-inline-item">
//                                       <FaDollarSign className="me-1" /> {jobData.salary}
//                                     </li>
//                                   </ul>
//                                   <p className="text-muted job-description mt-3 mb-3">
//                                     {jobData.description}
//                                   </p>
//                                   <div className="hstack gap-2">
//                                     {jobData.tags.map((tag, tagIndex) => (
//                                       <span
//                                         key={tagIndex}
//                                         className={`badge ${tag.bgColor} text-${tag.color}`}
//                                       >
//                                         {tag.text}
//                                       </span>
//                                     ))}
//                                   </div>
//                                   <Button variant="primary" size="sm" className="mt-4">
//                                     View More <FaArrowRight className="ms-1" />
//                                   </Button>
//                                 </div>
//                                 <Button
//                                   variant="outline-primary"
//                                   className="btn-icon"
//                                   onClick={() => toggleBookmark(index)}
//                                 >
//                                   <FaBookmark
//                                     className={bookmarks[index] ? "text-primary" : ""}
//                                   />
//                                 </Button>
//                               </div>
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       );
//                     })}
//                   </Row>
//                 </div>
//               )}

//               <ul className="treding-keywords list-inline mb-0 mt-3 fs-13">
//                 <li className="list-inline-item text-danger fw-semibold">
//                   <i className="mdi mdi-tag-multiple-outline align-middle"></i>{" "}
//                   Trending Keywords:
//                 </li>
//                 <li className="list-inline-item">
//                   <a href="javascript:void(0)">Design,</a>
//                 </li>
//                 <li className="list-inline-item">
//                   <a href="javascript:void(0)">Development,</a>
//                 </li>
//                 <li className="list-inline-item">
//                   <a href="javascript:void(0)">Manager,</a>
//                 </li>
//                 <li className="list-inline-item">
//                   <a href="javascript:void(0)">Senior</a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };



const ProcessSection = () => {
  return (
    <section className="section gardientbgColor" id="process">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5 maxWdthTitle">
              <h2 className="titleSection text-capitalize mb-3">How <span className="text-primary">it's work</span> creative jobs & quickly features</h2>
              <p className="text-muted">A creative person has the ability to invent and develop original ideas, especially in the arts. Like so many creative people, he was never satisfied.</p>
            </div>
          </div>
        </div>

        <div className="row gx-3">
          {[1, 2, 3, 4].map((step) => (
            <div className="col-lg-3 col-md-6" key={step}>
              <div className="card cardBodyCstm">
                <div className="card-body p-4 ">
                  <h3 className="fw-bold display-5 ff-secondary mb-4 text-success position-relative">
                    <div className="job-icon-effect"></div>
                    <span>{step}</span>
                  </h3>
                  <h6 className="fs-17 mb-2">{`Step ${step}`}</h6>
                  <p className="text-muted mb-0 fs-15">Description for step {step}.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className="section bg-light">
      <div className="container">
        <div className="row align-items-center justify-content-lg-between justify-content-center gy-4">
          <div className="col-lg-5 col-sm-7">
            <div className="about-img-section mb-5 mb-lg-0 text-center">
              <div className="card rounded shadow-lg inquiry-box d-none d-lg-block">
                <div className="card-body d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0 me-3">
                    <div className="avatar-title bg-secondary-subtle text-secondary rounded-circle fs-18">
                      <i className="ri-briefcase-2-line"></i>
                    </div>
                  </div>
                  <h5 className="fs-15 lh-base mb-0">Search Over <span className="text-secondary fw-semibold">1,00,000+</span> Jobs</h5>
                </div>
              </div>
              <img src="https://girangroup.com/jobfoundation/public/build/images/about.jpg" alt="" className="img-fluid mx-auto rounded-3" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="text-muted">
              <h2 className="mb-3 titleSection">Find Your <span className="text-primary">Dream Job</span> in One Place</h2>
              <p className="ff-secondary fs-16 mb-2">The first step in finding your <b>dream job </b> is deciding where to look for first-hand insight. Contact professionals who are already working in industries or positions that interest you.</p>
              <p className="ff-secondary fs-16">Schedule informational interviews and phone calls or ask for the opportunity to shadow them on the job.</p>

              <div className="vstack gap-2 mb-4 pb-1">
                {['Dynamic Content', 'Setup plugin\'s information.', 'Themes customization information'].map((feature, index) => (
                  <div className="d-flex align-items-center" key={index}>
                    <div className="flex-shrink-0 me-2">
                      <div className="avatar-xs icon-effect">
                        <div className="avatar-title bg-transparent text-success rounded-circle h2">
                          <i className="ri-check-fill"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <a href="#!" className="btn btn-primary">Find Your Jobs <i className="ri-arrow-right-line align-bottom ms-1"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    { title: 'IT & Software', icon: 'ri-pencil-ruler-2-line', jobs: 1543 },
    { title: 'Construction / Facilities', icon: 'ri-airplay-line', jobs: 3241 },
    { title: 'Government', icon: 'ri-bank-line', jobs: 876 },
    { title: 'Marketing & Advertising', icon: 'ri-focus-2-line', jobs: 465 },
  ];

  return (
    <section className="section gardientbgColorRevrse " id="categories">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="text-center  mb-5">
              <h2 className="titleSection mb-3  text-capitalize br-none">High demand jobs <br/><span className="text-primary">Categories</span> featured</h2>
              <p className="text-muted">Post a job to tell us about your project. We'll quickly match you with the right freelancers.</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center gx-3">
          {services.map((service, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <div className="card shadow-none text-center py-3">
                <div className="card-body py-4">
                  <div className="avatar-sm position-relative mb-4 mx-auto">
                    <div className="job-icon-effect"></div>
                    <div className="avatar-title bg-transparent text-success rounded-circle">
                      <i className={service.icon} style={{ fontSize: '24px' }}></i>
                    </div>
                  </div>
                  <a href="#!" className="stretched-link">
                    <h5 className="pt-1">{service.title}</h5>
                  </a>
                  <p className="mb-0 text-muted">{service.jobs} Jobs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="py-5 bg-primary position-relative" id="contact">
      <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-sm">
            <div>
              <h4 className="text-white titleSection mb-2">Ready to Started?</h4>
              <p className="text-white mb-0">Create new account and refer your friend</p>
            </div>
          </div>
          <div className="col-sm-auto">
            <div>
              <a href="#!" className="btn bg-gradient btn-light">Create Free Account</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-lg-6 order-2 order-lg-1">
            <div className="text-muted mt-5 mt-lg-0">
              <h5 className="fs-12 text-uppercase text-success">Why Choose us</h5>
              <h2 className="mb-3 ff-secondary titleSection text-capitalize ">Get <span className="text-primary">Featured</span> Jobs</h2>
              <p className="ff-secondary mb-2">The demand for content writing services is growing. This is because content is required in almost every industry. <b>Many companies have discovered how effective content marketing is.</b> This is a major reason for this increase in demand.</p>
              <p className="mb-4 ff-secondary">A Content Writer is a professional who writes informative and engaging articles to help brands showcase their products.</p>

              <div className="mt-4">
                <a href="index" className="btn btn-primary">View More <i className="ri-arrow-right-line align-middle ms-1"></i></a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-7 col-10 ms-lg-auto mx-auto order-1 order-lg-2">
            <div>
              <img src="https://girangroup.com/jobfoundation/public/build/images/user-illustarator-1.png" alt="" className="img-fluid ms-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



const BackToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button onClick={scrollToTop} className="btn btn-info btn-icon landing-back-top" id="back-to-top">
      <i className="ri-arrow-up-line"></i>
    </button>
  );
};

const HomePage = () => {
  return (
    <div className="layout-wrapper landing">
     
      <HeaderMain/>
      <HeroSection  
      SectionTitle="Find your next job and build your dream here" 
      SectionDescription="Find jobs, create trackable resumes and enrich your applications.
                    Carefully crafted after analyzing the needs of different industries."
      />
      <ProcessSection />
      <FeaturesSection />
      <ServicesSection />
      <CtaSection />
      <AboutSection />
      <Footer />
      <BackToTopButton />
    
    </div>
  );
};

export default HomePage;
