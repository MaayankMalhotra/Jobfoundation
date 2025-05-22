import React , { useState } from 'react';
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaArrowRight, FaBookmark } from "react-icons/fa";
import dummyUser from '../assets/images/dummy_avatar.jpg'
const HeroSection = ({SectionTitle = "", SectionDescription= ""} ) => {
    const [jobTitle, setJobTitle] = useState(""); // State for job title input
    const [jobType, setJobType] = useState(""); // State for job type dropdown
    const [jobs, setJobs] = useState([]); // State to store API response
    const [error, setError] = useState(""); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading status
    const [bookmarks, setBookmarks] = useState({}); // State to track bookmarked jobs

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
      setError(""); // Clear previous errors
      setJobs([]); // Clear previous results
      setLoading(true); // Set loading to true
  
      // Construct the API URL with query parameters
      const apiUrl = `https://girangroup.com/jobfoundation/public/api/filter-job?job_title=${encodeURIComponent(
        jobTitle
      )}&job_type=${jobType}`;
  
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

    
        if (response.ok && data.status) {
          setJobs(data.data); // Update state with fetched jobs
        } else {
          setError(data.message || "Failed to fetch jobs. Please try again.");
        }
      } catch (err) {
        setError("An error occurred while fetching jobs. Please try again.");
      } finally {
        setLoading(false); // Set loading to false
      }
    };
  
    const toggleBookmark = (jobId) => {
      setBookmarks((prev) => ({
        ...prev,
        [jobId]: !prev[jobId], // Toggle bookmark state for the job
      }));
    };
  
    return (
      <section className="section job-hero-section gardientbgColor" id="hero">
        <style>
          {`
            .custom-container {
              max-width: 90% !important; /* Increase container width */
              margin: 0 auto;
            }
            .job-card {
              max-width: 100%; /* Ensure card takes full available width */
              width: 100%;
              margin: 0 auto;
            }
          `}
        </style>
        <div className="custom-container">
          <div className="row justify-content-between align-items-center pt-5">
            <div className="col-lg-8 text-center m-auto">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <h1 className="bannerTitleMainHome">
                    {SectionTitle}
                    
                  </h1>
                  <p className="lead text-muted lh-base mb-4">
                    {SectionDescription}
                  </p>
                </div>
              </div>
              <div>
                {/* <form onSubmit={handleSubmit} className="job-panel-filter">
                  <div className="row g-md-0 g-2">
                    <div className="col">
                      <div className="row g-md-0 g-2">
                        <div className="col-md-6">
                          <div>
                            <input
                              type="search"
                              id="job-title"
                              className="form-control filter-input-box"
                              placeholder="Job, Company name..."
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)} // Update jobTitle state
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div>
                            <select
                              className="form-control"
                              value={jobType}
                              onChange={(e) => setJobType(e.target.value)} // Update jobType state
                            >
                              <option value="">Select job type</option>
                              <option value="Full-Time">Full Time</option>
                              <option value="Part-Time">Part Time</option>
                              <option value="remote">Remote</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-auto">
                      <div className="h-100">
                        <button
                          className="btn btn-primary btn-customBnr submit-btn w-100 h-100"
                          type="submit"
                          disabled={loading} // Disable button while loading
                        >
                          <i className="ri-search-2-line align-bottom me-1"></i>{" "}
                          {loading ? "Searching..." : "Find Job"}
                        </button>
                      </div>
                    </div>
                    
                    
                  </div>
                </form> */}
                
                {!loading && error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}

                {!loading && !error && jobs.length === 0 && jobTitle !== "" && (
                  <div className="alert alert-warning mt-3" role="alert">
                    No results found.
                  </div>
                )}
  
                {jobs.length > 0 && (
                  <div className="mt-4">
                    <h4>Search Results:</h4>
                    <div className='searchResultHere'>
                      <div className="card">
                        <div className="card-body">
                          {jobs.map((job, index) => (
                            <Link to="#" className={`mb-3 pb-3 d-block ${index !== jobs.length - 1 ? "border-bottom" : ""}`} key={index}>
                              <div className="row gx-3 align-items-center">
                                <div className="col-auto">
                                  <div className="avatar-lg">
                                    <img
                                      src={dummyUser}
                                      alt="user-img"
                                      className="img-thumbnail rounded-circle"
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="profileBoxTitleMain">
                                    <h3 className="mb-1 text-start">
                                      {job.job_title || "Unknown Title"}
                                      </h3>

                                    <div className="hstack addressStyleDiv gap-1">
                                      <i className="ri-map-pin-user-line me-1 text-opacity-75 fs-16 align-middle"></i>
                                      {job.job_location || "Unknown Location"}
                                    </div>

                                    <div className="hstack addressStyleDiv gap-1">
                                      <i class="ri-building-line me-1 text-opacity-75 fs-16 align-middle"></i>
                                      {job.employer_id || "Unknown Company"}
                                    </div>

                                    <div className="hstack gap-2 mt-2">
                                      <span className="badge bg-success-subtle text-success">
                                        {job.job_type || "N/A"}
                                      </span>
                                      <span className="badge bg-danger-subtle text-danger">
                                        {job.designation || "N/A"}
                                      </span>
                                      <span className="badge bg-primary-subtle text-primary">
                                        {/* {job.key_skills || "N/A"} */}
                                        {/* {job.key_skills.map((skillId, index) => {
                                          const matchedSkill = skills.find(s => s.value === skillId.toString());
                                          const skillName = matchedSkill ? matchedSkill.label : skillId;

                                          return (
                                            <span key={index}>
                                              {skillName}
                                              {index < job.key_skills.length - 1 && ', '}
                                            </span>
                                          );
                                        })} */}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto align-self-start">
                                  <div className="editLinkStyle">
                                    <span  className="linkAbleEdit">
                                        <i class="ri-arrow-right-up-line"></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                     
                    
                  </div>
                )}
  
                {/* <ul className="treding-keywords list-inline mb-0 mt-3 fs-13">
                  <li className="list-inline-item text-danger fw-semibold">
                    <i className="mdi mdi-tag-multiple-outline align-middle"></i>{" "}
                    Trending Keywords:
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void(0)">Design,</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void(0)">Development,</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void(0)">Manager,</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void(0)">Senior</a>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  export default HeroSection