import React, { useState, useEffect } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import JobCards from './components/jobsCard';
import axios from 'axios';
import Swal from 'sweetalert2';

const JobRecommend = () => {
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // const userId = localStorage.getItem('user_id');

  // Apply for a specific job using job_posting_id
  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        'https://girangroup.com/jobfoundation/public/api/employee/job-applies',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_posting_id: jobId }),
        }
      );
      const result = await response.json();
      console.log(result, 'Response DAta Find')

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted',
          text: 'Your job application has been sent successfully!',
        });
        setJobRecommendations((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, has_applied: true } : job
          )
        );
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

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://girangroup.com/jobfoundation/public/api/employee/job-recomendation',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mappedJobs = (response.data?.data || []).map((job) => ({
          id: job.id,
          company_name: job.employer?.company_name || 'N/A',
          date: job.created_at?.split('T')[0] || '',
          address: job.job_location || 'N/A',
          jobTitle: job.job_title || 'N/A',
          designation: job.designation || 'N/A',
          jobType: job.job_type || 'Full Time',
          experince: job.required_experience ? `${job.required_experience} Years` : 'Not Specified',
          salary: job.salary_range || '0',
          salaryType: job.salary_type || 'Monthly',
          match_percentage: job.match_percentage,
          status: job.status,
          has_applied: job.has_applied,
          profileImg: job.employer?.logo
            ? `https://girangroup.com/jobfoundation/public/storage/${job.employer.logo}`
            : null,
          rating: '5.0',
          loginStatus: true,
        }));

        setJobRecommendations(mappedJobs);
      } catch (error) {
        console.error('Failed to fetch job recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, []);

  const filteredJobs = jobRecommendations.filter((job) => job.match_percentage > 0);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header />
      <section className="bg-light section">
        <div className="container mt-5">
          <div className="text-center mb-5">
            <h2 className="titleSection mb-3 text-capitalize">
              <span className="text-primary">Recommended roles</span> based on your interests
            </h2>
            <p className="text-muted">
              These jobs are picked just for you. Don’t see the right fit? Use the search above to explore more.
            </p>
          </div>

          <div className='row gx-3'>
            {loading ? (
              <div className="text-center py-5" style={{minHeight: 'calc(100vh - 405px)'}}>Loading jobs...</div>
            ) : currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div className='col-lg-6 jobRecomendedStyle mb-3' key={job.id}>
                  <JobCards
                    jobData={job}
                    loginBtn={false}
                    className='mb-0'
                    hasApplied= {job.has_applied}
                    onApplyClick={() => handleApply(job.id)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-5">No job recommendations available.</div>
            )}
          </div>

          {!loading && totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-end">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default JobRecommend;
