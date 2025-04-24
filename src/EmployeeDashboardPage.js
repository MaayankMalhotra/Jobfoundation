import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './EmployeeDashboard.css'; // Ensure you have a CSS file for custom styles
// import Sidebar from './Sidebar';
import Header from './components/header'
import DarkLogo from './assets/images/logo-dark.png'
import Footer from './components/footer'
import Loader from './components/loader'

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

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
    return  <Loader/>
  }


    
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && (file.type === "application/pdf" || file.name.endsWith(".doc") || file.name.endsWith(".docx"))) {
        setFiles((prevFiles) => [...prevFiles, file]);
      } else {
        alert("Only PDF, DOC, and DOCX files are allowed.");
      }
      e.target.value = null; // Reset input so same file can be uploaded again if needed
    };
  
    const handleDelete = (index) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
    };

  return (
    // <div className="container-fluid">
    //   <div className="row">
    //     <div className="col-md-3 col-lg-2 p-0">
    //       <Sidebar />
    //     </div>
    //   </div>
    // </div>
    <>
      <Header/>
        <section className="jobProfileSection section mt-md-5 mt-4">
          <div className="container-fluid custom-container">
            {/* <div className="profile-wid-bg">
              <img
                src="https://girangroup.com/job_frontend/images/profile-bg.jpg"
                alt=""
                className="profile-wid-img"
              />
            </div> */}
            <div className="row gx-3">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <div className="row gx-3 align-items-center">
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
                        <div className="profileBoxTitleMain">
                          <h3 className="mb-1">{employeeData.first_name}</h3>
                          <div className="hstack addressStyleDiv gap-1">
                              <i className="ri-map-pin-user-line me-1 text-opacity-75 fs-16 align-middle"></i>
                              {employeeData.address.city}, {employeeData.address.street}
                          </div>
                          <div className="mainCardShortInfo mt-2">
                              <div className="cardsInfoStyle bg-theme-light">
                                <span className="countNumberPro">24.3K</span>
                                <span>Followers</span>
                              </div>
                              <div className="cardsInfoStyle bg-sky-blue">
                                <span className="countNumberPro">1.3K</span>
                                <span>Following</span>
                              </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-auto align-self-start">
                          <div className="editLinkStyle">
                            <Link to="/edit-employee" className="linkAbleEdit">
                              <i className="ri-pencil-line align-bottom"></i>
                            </Link>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                    <h5 className="card-title mb-0">About</h5>
                    <div className="">
                        <Link to="/edit-employee" className="linkAbleEdit">
                          <i className="ri-pencil-line align-bottom"></i>
                        </Link>
                    </div>
                  </div>
                  <div className="card-body aboutContentPro">
                    <p>
                      Hi, I'm {employeeData.first_name}, a passionate professional with experience in building scalable and user-friendly applications. I enjoy working with modern technologies and solving complex problems.
                    </p>
                    <p>
                      In my free time, I contribute to open-source projects and write technical blogs. I believe in continuous learning and always strive to improve my skills.
                    </p>
                  </div>
                </div>
                <div className="card">
                    <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                        <h5 className="card-title mb-0">Personal Information</h5>
                        <div className="">
                          <Link to="/edit-employee" className="linkAbleEdit">
                            <i className="ri-pencil-line align-bottom"></i>
                          </Link>
                        </div>
                    </div>
                  <div className="card-body">
                    <div className="cardPersonalInfoIn">
                      <ul>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-user-3-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>{employeeData.first_name}</h3>
                            <label>Full Name :</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-phone-fill"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>{employeeData.phone}</h3>
                            <label>Mobile:</label>
                          </div>
                        </li>
                        {/* <li>
                        <div className="iconProStyleIn">

                        </div>
                        <div className='contentProfileIn'>
                            <h3>{employeeData.address.city}, {employeeData.address.street}</h3>
                            <label>Location :</label>
                          </div>
                        </li> */}
                        <li>
                          <div className="iconProStyleIn">
                              <i className="ri-mail-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>maayankmalhotra123@gmail.com</h3>
                            <label>Email:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-money-dollar-circle-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>$1200.00</h3>
                            <label>Salary:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-user-star-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>Fresher - 4Years</h3>
                            <label>Experience:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-file-4-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>30 Days</h3>
                            <label>Notice Period:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-translate"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>English, Spanish</h3>
                            <label>Language:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-calendar-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>{formatDate(employeeData.created_at)}</h3>
                            <label>Joining Date :</label>
                          </div>
                        </li>
                      </ul>
                    </div>
                    {/* <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <th className="ps-0" scope="row"></th>
                            <td className="text-muted"></td>
                          </tr>
                          <tr>
                            <th className="ps-0" scope="row">Mobile :</th>
                            <td className="text-muted"></td>
                          </tr>
                          <tr>
                            <th className="ps-0" scope="row">Location :</th>
                            <td className="text-muted"></td>
                          </tr>
                          <tr>
                            <th className="ps-0" scope="row">Joining Date</th>
                            <td className="text-muted"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div> */}
                  </div>
                </div>
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                    <h5 className="card-title mb-0">Resume</h5>
                    
                  </div>
                  <div className="card-body aboutContentPro">
                      {/* <div className="row gx-2">
                          <div className="col">
                            <div className="iconResumeSide">
                              <div className="iconProStyleIn">
                                <i className="ri-mail-line"></i>
                              </div>
                              <div className="contentProfileIn">
                                <label>Maayank-Mohlotra-Resume.pdf</label>
                              </div>
                            </div>
                          </div>
                          <div className="">

                          </div>
                      </div> */}
                      
                      <div className='fileUploaderSec' style={{ maxWidth: "100%", margin: "0 auto" }}>
                        {files.length > 0 && (
                          <ul>
                            {files.map((file, index) => (
                              <li key={index}>
                                <div className="row gx-2">
                                  <div className="col">
                                    <div className="iconResumeSide d-flex gap-2 align-items-center">
                                      <div className="iconProStyleIn">
                                        <i className="ri-file-line"></i>
                                      </div>
                                      <div className="contentProfileIn">
                                        <label>{file.name}</label>
                                      </div>
                                    </div>
                                  </div>
                                
                                <div className="col-auto">
                                  <div className="d-flex flex-wrap buttonGroupUpload gap-2">
                                    <a
                                      href={URL.createObjectURL(file)}
                                      download={file.name} className="bg-theme-light boxActionBtn"
                                    >
                                      <i className="ri-download-line"></i>
                                    </a>
                                    <button
                                      onClick={() => handleDelete(index)}
                                      className="bg-light-danger boxActionBtn"
                                    >
                                      <i className="ri-delete-bin-6-line"></i>
                                    </button>
                                  </div>
                                </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          )}
                          {/* Upload Button */}
                          <label htmlFor="imageUploadStyle" className="uploadLabelStyle">
                            <i className="ri-file-upload-line"></i>
                            Upload Your File
                          </label>
                          <input
                          id="imageUploadStyle"
                            type="file"
                            className="d-none"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            style={{ marginTop: "10px" }}
                          />
                      </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {/* Portfolio Section */}
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                    <h5 className="card-title mb-0">Portfolio</h5>
                    <div className="">
                        <Link to="/edit-employee" className="linkAbleEdit">
                          <i className="ri-pencil-line align-bottom"></i>
                        </Link>
                    </div>
                  </div>
                  <div className="card-body">
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
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                    <h5 className="card-title mb-0">Skills</h5>
                    <div className="">
                        <Link to="/edit-employee" className="linkAbleEdit">
                          <i className="ri-pencil-line align-bottom"></i>
                        </Link>
                    </div>
                  </div>
                  <div className="card-body">
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
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div>
                  {/* <div className="d-flex profile-wrapper">
                    <ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                      <li className="nav-item">
                        <a className="nav-link fs-14 active" data-bs-toggle="tab" href="#overview-tab" role="tab">
                          <i className="ri-airplay-fill d-inline-block d-md-none"></i>
                          <span className="d-none d-md-inline-block">Overview</span>
                        </a>
                      </li>
                      
                    </ul>
                    <div className="flex-shrink-0">
                      <Link to="/edit-employee" className="btn btn-success me-2">
                        <i className="ri-edit-box-line align-bottom"></i> Edit Profile
                      </Link>
                      <Link to="/job-board" className="btn btn-success">
                        <i className="ri-edit-box-line align-bottom"></i> Job Recommendation
                      </Link>
                    </div>
                  </div> */}

                  <div className="tab-content pt-4 text-muted">
                    <div className="tab-pane active" id="overview-tab" role="tabpanel">
                      <div className="row">
                        <div className="col-xxl-3">
                          {/* Info Section */}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      <Footer/>
    </>
  );
};

export default EmployeeDashboard;