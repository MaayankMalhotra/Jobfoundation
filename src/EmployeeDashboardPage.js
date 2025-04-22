import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './EmployeeDashboard.css'; // Ensure you have a CSS file for custom styles
import Sidebar from './Sidebar';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://girangroup.com/jobfoundation/public/api/employee/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employee profile');
        }

        const data = await response.json();
        setEmployeeData(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmployeeProfile();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 main-content">
          <div className="profile-wid-bg">
            <img
              src="https://girangroup.com/job_frontend/images/profile-bg.jpg"
              alt=""
              className="profile-wid-img"
            />
          </div>
          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <div className="row g-4">
              <div className="col-auto">
                <div className="avatar-lg">
                  <img
                    src="https://girangroup.com/job_frontend/images/avatar-1.jpg"
                    alt="user-img"
                    className="img-thumbnail rounded-circle"
                  />
                </div>
              </div>
              <div className="col">
                <div className="p-2">
                  <h3 className="text-white mb-1">{employeeData.first_name}</h3>
                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
                      {employeeData.address.city}, {employeeData.address.street}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-auto order-last order-lg-0">
                <div className="row text text-white-50 text-center">
                  <div className="col-lg-6 col-4">
                    <div className="p-2">
                      <h4 className="text-white mb-1">24.3K</h4>
                      <p className="fs-14 mb-0">Followers</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-4">
                    <div className="p-2">
                      <h4 className="text-white mb-1">1.3K</h4>
                      <p className="fs-14 mb-0">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div>
                <div className="d-flex profile-wrapper">
                  <ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link fs-14 active" data-bs-toggle="tab" href="#overview-tab" role="tab">
                        <i className="ri-airplay-fill d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block">Overview</span>
                      </a>
                    </li>
                    {/* <li className="nav-item">
                      <a className="nav-link fs-14" data-bs-toggle="tab" href="#projects" role="tab">
                        <i className="ri-price-tag-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block">Projects</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link fs-14" data-bs-toggle="tab" href="#documents" role="tab">
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block">Documents</span>
                      </a>
                    </li> */}
                  </ul>
                  <div className="flex-shrink-0">
                    <Link to="/edit-employee" className="btn btn-success me-2">
                      <i className="ri-edit-box-line align-bottom"></i> Edit Profile
                    </Link>
                    <Link to="/job-board" className="btn btn-success">
                      <i className="ri-edit-box-line align-bottom"></i> Job Recommendation
                    </Link>
                  </div>
                </div>

                <div className="tab-content pt-4 text-muted">
                  <div className="tab-pane active" id="overview-tab" role="tabpanel">
                    <div className="row">
                      <div className="col-xxl-3">
                        {/* Info Section */}
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title mb-3">Info</h5>
                            <div className="table-responsive">
                              <table className="table table-borderless mb-0">
                                <tbody>
                                  <tr>
                                    <th className="ps-0" scope="row">Full Name :</th>
                                    <td className="text-muted">{employeeData.first_name}</td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row">Mobile :</th>
                                    <td className="text-muted">{employeeData.phone}</td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row">Location :</th>
                                    <td className="text-muted">{employeeData.address.city}, {employeeData.address.street}</td>
                                  </tr>
                                  <tr>
                                    <th className="ps-0" scope="row">Joining Date</th>
                                    <td className="text-muted">{formatDate(employeeData.created_at)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Portfolio Section */}
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title mb-4">Portfolio</h5>
                            <div className="d-flex flex-wrap gap-2">
                              <div>
                                <a href="https://github.com" className="avatar-xs d-block">
                                  <span className="avatar-title rounded-circle fs-16 bg-body text-body material-shadow">
                                    <i className="ri-github-fill"></i>
                                  </span>
                                </a>
                              </div>
                              <div>
                                <a href="https://example.com" className="avatar-xs d-block">
                                  <span className="avatar-title rounded-circle fs-16 bg-primary material-shadow">
                                    <i className="ri-global-fill"></i>
                                  </span>
                                </a>
                              </div>
                              <div>
                                <a href="https://dribbble.com" className="avatar-xs d-block">
                                  <span className="avatar-title rounded-circle fs-16 bg-success material-shadow">
                                    <i className="ri-dribbble-fill"></i>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Skills Section */}
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title mb-4">Skills</h5>
                            <div className="d-flex flex-wrap gap-2 fs-15">
                              {employeeData.employee.skills && employeeData.employee.skills.length > 0 ? (
                                employeeData.employee.skills.map((skill, index) => (
                                  <span key={index} className="badge bg-primary-subtle text-primary">
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted">No skills available</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* About Section */}
                      <div className="col-xxl-9">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title mb-3">About</h5>
                            <p>
                              Hi, I'm {employeeData.first_name}, a passionate professional with experience in building scalable and user-friendly applications. I enjoy working with modern technologies and solving complex problems.
                            </p>
                            <p>
                              In my free time, I contribute to open-source projects and write technical blogs. I believe in continuous learning and always strive to improve my skills.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;