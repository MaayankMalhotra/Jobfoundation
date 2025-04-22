import React, { useState, useEffect } from 'react';
import './JobBoard.css';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { FaSearch, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaArrowRight, FaBookmark } from 'react-icons/fa';
import Sidebar from './Sidebar';
import AuthCheck from './AuthCheck';

const JobCard = ({ title, company, location, salary, description, tags, companyImg, bgColor }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card className="shadow-lg mb-4">
      <Card.Body>
        <div className="d-flex">
          <div className={`avatar-sm me-3`}>
            <div className={`avatar-title ${bgColor} rounded`}>
              <img src={companyImg} alt="" className="avatar-xxs" />
            </div>
          </div>
          <div className="flex-grow-1">
            <a href="#!"><h5>{title}</h5></a>
            <ul className="list-inline text-muted mb-3">
              <li className="list-inline-item"><FaBuilding className="me-1" /> {company}</li>
              <li className="list-inline-item"><FaMapMarkerAlt className="me-1" /> {location}</li>
              <li className="list-inline-item"><FaDollarSign className="me-1" /> {salary}</li>
            </ul>
            <p className="text-muted job-description mt-3 mb-3">{description}</p>
            <div className="hstack gap-2">
              {tags.map((tag, index) => (
                <span key={index} className={`badge ${tag.bgColor} text-${tag.color}`}>
                  {tag.text}
                </span>
              ))}
            </div>
            <Button variant="primary" size="sm" className="mt-4">
              View More <FaArrowRight className="ms-1" />
            </Button>
          </div>
          <Button variant="outline-primary" className="btn-icon" onClick={() => setIsBookmarked(!isBookmarked)}>
            <FaBookmark className={isBookmarked ? 'text-primary' : ''} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('all');
  const [status, setStatus] = useState('all');
  const [jobData, setJobData] = useState([]); // State to hold API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch job recommendations from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); 
        const response = await fetch('https://girangroup.com/jobfoundation/public/api/employee/job-recomendation', {
          headers: {
            'Authorization': `Bearer ${token}`, // Add token if required
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch job recommendations');
        }
        const result = await response.json();
        if (result.status !== 'success') {
          throw new Error(result.message || 'Failed to fetch job recommendations');
        }
  
        const transformedData = result.data.map((job) => ({
          title: job.designation,
          company: job.employer_id || 'Unknown Company',
          location: job.job_location || 'Unknown Location',
          salary: job.salary_range || 'Not Specified',
          description: job.overview || 'No description available',
          tags: (job.key_skills || []).map((skill, index) => ({
            text: skill || 'N/A',
            bgColor: ['bg-success-subtle', 'bg-danger-subtle', 'bg-primary-subtle'][index % 3], // Cycle through colors
            color: ['success', 'danger', 'primary'][index % 3],
          })),
          companyImg: 'assets/images/companies/img-placeholder.png',
          bgColor: 'bg-warning-subtle',
        }));
  
        setJobData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty dependency array to run only on mount

  // Filter jobs based on search term, job type, and status
  const filteredJobs = jobData.filter((job) => {
    const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJobType = jobType === 'all' || job.tags.some((tag) => tag.text.toLowerCase() === jobType.toLowerCase());
    const matchesStatus = status === 'all' || job.status?.toLowerCase() === status.toLowerCase(); // Assuming status is part of API data
    return matchesSearchTerm && matchesJobType && matchesStatus;
  });

  return (
    <AuthCheck>
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 main-content">
          <section className="section" id="findJob">
            <div className="container custom-container">
              <section className="section job-hero-section bg-primary" id="hero">
                <div className="bg-overlay bg-overlay-pattern opacity-50"></div>
                <div className="container custom-container">
                  <div className="row justify-content-between align-items-center pt-5">
                    <div className="col-lg-8 text-center m-auto">
                      <h1 className="text-light display-6 fw-semibold text-capitalize mb-3">
                        Find Your Perfect Job Match
                      </h1>
                      <p className="lead text-light lh-base mb-4">
                        Find jobs, create trackable resumes and enrich your applications...
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <Row className="mb-5">
                <Col lg={12}>
                  <Card>
                    <Card.Body>
                      <Form>
                        <Row className="g-3">
                          <Col sm={3}>
                            <div className="search-box position-relative">
                              <Form.Control
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <FaSearch className="search-icon" />
                            </div>
                          </Col>
                          <Col sm={3}>
                            <Form.Select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                              <option value="all">All</option>
                              <option value="Full Time">Full Time</option>
                              <option value="Part Time">Part Time</option>
                              <option value="Internship">Internship</option>
                              <option value="Freelance">Freelance</option>
                            </Form.Select>
                          </Col>
                          <Col sm={3}>
                            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                              <option value="all">All</option>
                              <option value="Active">Active</option>
                              <option value="New">New</option>
                              <option value="Close">Close</option>
                            </Form.Select>
                          </Col>
                          <Col sm={3}>
                            <Button variant="primary" className="w-100">
                              <FaSearch className="me-1" /> Filters
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Display loading, error, or job cards */}
              {loading && <div className="text-center">Loading jobs...</div>}
              {error && <div className="text-center text-danger">Error: {error}</div>}
              {!loading && !error && filteredJobs.length === 0 && (
                <div className="text-center">No jobs found.</div>
              )}
              <Row>
                {filteredJobs.map((job, index) => (
                  <Col md={12} key={index}>
                    <JobCard {...job} />
                  </Col>
                ))}
                <Col lg={12}>
                  <div className="text-center mt-4">
                    <Button variant="outline-primary">
                      View More Jobs <FaArrowRight className="ms-1" />
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        </main>
      </div>
    </AuthCheck>
  );
};

export default JobBoard;