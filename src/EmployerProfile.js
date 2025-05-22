// import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import './EmployerDashboard.css'; // Ensure you have a CSS file for custom styles

// const EmployerDashboardProfile = () => {
//   const [employerData, setEmployerData] = useState(null);
//   const [error, setError] = useState(null);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   useEffect(() => {
//     const fetchEmployerProfile = async () => {
//       try {
//         const token = localStorage.getItem('token'); // Retrieve the token from localStorage
//         const response = await fetch('https://girangroup.com/jobfoundation/public/api/employer/profile', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch employer profile');
//         }

//         const data = await response.json();
//         setEmployerData(data.data); // Set the employer data
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchEmployerProfile();
//   }, []);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!employerData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container-fluid">
//       <div className="profile-wid-bg">
//         <img src="https://girangroup.com/job_frontend/images/profile-bg.jpg" alt="" className="profile-wid-img" />
//       </div>
//       <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
//         <div className="row g-4">
//           <div className="col-auto">
//             <div className="avatar-lg">
//               <img src={"https://girangroup.com/job_frontend/images/avatar-1.jpg"} alt="user-img" className="img-thumbnail rounded-circle" />
//             </div>
//           </div>
//           <div className="col">
//             <div className="p-2">
//               <h3 className="text-white mb-1">{employerData.first_name}</h3>
//               <div className="hstack text-white-50 gap-1">
//                 <div className="me-2">
//                   <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
//                   {employerData.address.city}, {employerData.address.street}
//                 </div>
//                 <div>
//                   <i className="ri-building-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
//                   {employerData.employer.company_name || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 col-lg-auto order-last order-lg-0">
//             <div className="row text text-white-50 text-center">
//               <div className="col-lg-6 col-4">
//                 <div className="p-2">
//                   <h4 className="text-white mb-1">24.3K</h4>
//                   <p className="fs-14 mb-0">Followers</p>
//                 </div>
//               </div>
//               <div className="col-lg-6 col-4">
//                 <div className="p-2">
//                   <h4 className="text-white mb-1">1.3K</h4>
//                   <p className="fs-14 mb-0">Following</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-lg-12">
//           <div>
//             <div className="d-flex profile-wrapper">
//               <ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
//                 <li className="nav-item">
//                   <a className="nav-link fs-14 active" data-bs-toggle="tab" href="#overview-tab" role="tab">
//                     <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Overview</span>
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a className="nav-link fs-14" data-bs-toggle="tab" href="#projects" role="tab">
//                     <i className="ri-price-tag-line d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Projects</span>
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a className="nav-link fs-14" data-bs-toggle="tab" href="#documents" role="tab">
//                     <i className="ri-folder-4-line d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Documents</span>
//                   </a>
//                 </li>
//               </ul>
//               <div className="flex-shrink-0">
//                 <Link to="/edit-employer" className="btn btn-success">
//                   <i className="ri-edit-box-line align-bottom"></i> Edit Profile
//                 </Link>
//                 <Link to="/employer-dashboard" className="btn btn-success">
//                   <i className="ri-edit-box-line align-bottom"></i> Job Openings
//                 </Link>
//               </div>
//             </div>

//             <div className="tab-content pt-4 text-muted">
//               <div className="tab-pane active" id="overview-tab" role="tabpanel">
//                 <div className="row">
//                   <div className="col-xxl-3">
//                     <div className="card">
//                       <div className="card-body">
//                         <h5 className="card-title mb-3">Info</h5>
//                         <div className="table-responsive">
//                           <table className="table table-borderless mb-0">
//                             <tbody>
//                               <tr>
//                                 <th className="ps-0" scope="row">Full Name :</th>
//                                 <td className="text-muted">{employerData.first_name}</td>
//                               </tr>
//                               <tr>
//                                 <th className="ps-0" scope="row">Company Name :</th>
//                                 <td className="text-muted">{employerData.employer.company_name}</td>
//                               </tr>
//                               <tr>
//                                 <th className="ps-0" scope="row">Number of Employees :</th>
//                                 <td className="text-muted">{employerData.employer.number_of_employees}</td>
//                               </tr>
//                               <tr>
//                                 <th className="ps-0" scope="row">Mobile :</th>
//                                 <td className="text-muted">{employerData.phone}</td>
//                               </tr>
//                               <tr>
//                                 <th className="ps-0" scope="row">Location :</th>
//                                 <td className="text-muted">{employerData.address.city}, {employerData.address.street}</td>
//                               </tr>
//                               <tr>
//                                 <th className="ps-0" scope="row">Joining Date</th>
//                                 <td className="text-muted">{formatDate(employerData.created_at)}</td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Portfolio Section */}
//                     <div className="card">
//                       <div className="card-body">
//                         <h5 className="card-title mb-4">Portfolio</h5>
//                         <div className="d-flex flex-wrap gap-2">
//                           <div>
//                             <a href="https://github.com" className="avatar-xs d-block">
//                               <span className="avatar-title rounded-circle fs-16 bg-body text-body material-shadow">
//                                 <i className="ri-github-fill"></i>
//                               </span>
//                             </a>
//                           </div>
//                           <div>
//                             <a href="https://example.com" className="avatar-xs d-block">
//                               <span className="avatar-title rounded-circle fs-16 bg-primary material-shadow">
//                                 <i className="ri-global-fill"></i>
//                               </span>
//                             </a>
//                           </div>
//                           <div>
//                             <a href="https://dribbble.com" className="avatar-xs d-block">
//                               <span className="avatar-title rounded-circle fs-16 bg-success material-shadow">
//                                 <i className="ri-dribbble-fill"></i>
//                               </span>
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Dynamic Skills Section */}
//                     <div className="card">
//                       <div className="card-body">
//                         <h5 className="card-title mb-4">Skills</h5>
//                         <div className="d-flex flex-wrap gap-2 fs-15">
//                           {employerData.employer.skills && employerData.employer.skills.length > 0 ? (
//                             employerData.employer.skills.split(',').map((skillId, index) => {
//                               // Assuming skills are stored as IDs, we need to fetch skill names
//                               // For now, showing IDs; ideally, fetch skill names from API
//                               return (
//                                 <span key={index} className="badge bg-primary-subtle text-primary">
//                                   {skillId}
//                                 </span>
//                               );
//                             })
//                           ) : (
//                             <span className="text-muted">No skills available</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* About Section */}
//                   <div className="col-xxl-9">
//                     <div className="card">
//                       <div className="card-body">
//                         <h5 className="card-title mb-3">About</h5>
//                         <p>
//                           Hi, I'm {employerData.first_name}, representing {employerData.employer.company_name || "N/A"}. We are a company focused on hiring top talent and building innovative solutions.
//                         </p>
//                         <p>
//                           Our mission is to create opportunities for professionals and contribute to the industry by delivering high-quality projects. We value collaboration, innovation, and excellence.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployerDashboardProfile;



import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './EmployerDashboardProfile.css'; // Ensure you have a CSS file for custom styles
// import Sidebar from './Sidebar';
import Loader from './components/loader'
import TopHeaderMain from "./components/TopHearderEmplyoer";
import SidebarMenu from "./components/sidebarMenus";
import axios from "axios";
import dummyUser from './assets/images/dummy_avatar.jpg'
import Swal from "sweetalert2";

const EmployerProfile = () => {
    const [employerData, setEmployerData] = useState(null);

  const [error, setError] = useState(null);
  const [formDataLinks, setFormDataLinks] = useState({});
  const [socialPlatforms, setSocialPlatforms] = useState([])
    const [submittedLinks, setSubmittedLinks] = useState({
       social_links: []
    });

      useEffect(() => {
          fetch('https://girangroup.com/jobfoundation/public/api/social-links')
            .then(res => res.json())
            .then(data => {
              setSocialPlatforms(data);

              // Initialize formDataLinks keys dynamically with empty strings
              const initialLinks = {};
              data.forEach(platform => {
                initialLinks[platform.name] = '';
              });
              setFormDataLinks(initialLinks);
            })
            .catch(err => console.error(err));
        }, []);
  
    const handleChange = (e) => {
      setFormDataLinks({ ...formDataLinks, [e.target.name]: e.target.value });
    };
  
    const getSocialIconClass = (platform) => {
        console.log(platform);
        const socialData = socialPlatforms.find(platformData => platformData.name === platform);
        console.log(socialData);
        return socialData ? socialData.icon : null;  // Return icon or null if not found
      };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const social_links = Object.entries(formDataLinks)
    .filter(([_, url]) => url.trim() !== '')
    .map(([platform, url]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      url,
    }));

    console.log('link:', social_links)

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      'https://girangroup.com/jobfoundation/public/api/employer/store-social-links',
      { social_links },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update the local state to reflect changes
    setSubmittedLinks(social_links);
    setEmployerData((prev) => ({
      ...prev,
      social_links,
    }));


const modalEl = document.getElementById('socialLinkModal');
if (modalEl) {
  // Remove the 'show' class and hide the modal
  modalEl.classList.remove('show');
  modalEl.style.display = 'none';
  
  // Remove modal-specific attributes
  modalEl.removeAttribute('aria-modal');
  modalEl.removeAttribute('role');
  modalEl.setAttribute('aria-hidden', 'true');

  // Remove 'modal-open' class from the body and reset body styles
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  // Remove all modal backdrops from the body
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach((backdrop) => {
    backdrop.classList.remove('show');  // Ensure the 'show' class is removed from backdrop
    backdrop.remove();  // Remove the backdrop element
  });
}

    // Success alert (use toast if available)
    Swal.fire({
      icon: 'success',
      title: 'Social links Updated!',
      text: 'The social links  have been successfully updated.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5a34a0',
    });
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: err.response?.data || err.message || 'Something went wrong. Please try again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5a34a0',
    });
  }
};

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
    const fetchEmployerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://girangroup.com/jobfoundation/public/api/employer/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        

        if (!response.ok) {
          throw new Error('Failed to fetch employer profile');
        }

        const data = await response.json();
         const linksObj = {};
          data.data.social_links.forEach(link => {
            linksObj[link.platform] = link.url;
          });
        setEmployerData(data.data);
        setFormDataLinks(linksObj)
        console.log(data.data)
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmployerProfile();
  }, []);

  

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employerData) {
    return <Loader/>;
  }

  return (

        <div id="layout-wrapper">
          <TopHeaderMain/>
          <SidebarMenu/>
          <div className="main-content">
            <div className="page-content">
              <div className="container-fluid">
                <div className="row gx-3">
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-body">
                        <div className="row gx-3 align-items-center">
                          <div className="col-auto">
                            <div className="avatar-lg">
                              <img
                                src={
                                      employerData?.employer?.logo
                                        ? `https://girangroup.com/jobfoundation/public/storage/${employerData.employer.logo}`
                                        : dummyUser
                                    }
                                alt="user-img"
                                className="img-thumbnail rounded-circle"
                                style={{objectFit: 'cover'}}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="profileBoxTitleMain">
                              <h3 className="mb-1">{employerData.employer.company_name || "N/A"} </h3>
                              <div className="hstack addressStyleDiv gap-1">
                                  <i className="ri-map-pin-user-line me-1 text-opacity-75 fs-16 align-middle"></i>
                                  {employerData.address.city}, {employerData.address.street}
                              </div>
                            </div>
                          </div>
                          <div className="col-auto align-self-start">
                              <div className="editLinkStyle">
                                <Link to="/employer-profile-edit" className="linkAbleEdit">
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
                            <Link to="/employer-profile-edit" className="linkAbleEdit">
                              <i className="ri-pencil-line align-bottom"></i>
                            </Link>
                          </div>
                      </div>
                      <div className="card-body">
                        {employerData.employer.about_us && (
                            <div
                              className="about-content"
                              dangerouslySetInnerHTML={{ __html: employerData.employer.about_us }}
                            />
                          )}
                        {/* <p>
                          Hi, I'm {employerData.first_name}, representing {employerData.employer.company_name || "N/A"}. We are a company focused on hiring top talent and building innovative solutions.
                        </p>
                        <p>
                          Our mission is to create opportunities for professionals and contribute to the industry by delivering high-quality projects. We value collaboration, innovation, and excellence.
                        </p> */}
                      </div>
                    </div>
                    {/* Dynamic Skills Section */}
                    {/* <div className="card">
                      <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                          <h5 className="card-title mb-0">Skills</h5>
                          <div className="">
                            <Link to="/employer-profile-edit" className="linkAbleEdit">
                              <i className="ri-pencil-line align-bottom"></i>
                            </Link>
                          </div>
                      </div>
                      <div className="card-body">
                        <div className="d-flex flex-wrap gap-2 fs-15">
                          {employerData.employer.skills && employerData.employer.skills.length > 0 ? (
                            employerData.employer.skills.split(',').map((skillId, index) => (
                              <span key={index} className="badge bg-primary-subtle text-primary">
                                {skillId}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">No skills available</span>
                          )}
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="col-md-4">
                      <div className="card">
                        <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                            <h5 className="card-title mb-0">Personal Information</h5>
                            <div className="">
                              <Link to="/employer-profile-edit" className="linkAbleEdit">
                                <i className="ri-pencil-line align-bottom"></i>
                              </Link>
                            </div>
                        </div>
                        <div className="card-body p-0">
                          <div className="cardPersonalInfoIn singleListingOver">
                            <ul>
                              <li>
                                <div className="iconProStyleIn">
                                  <i className="ri-building-line"></i>
                                </div>
                                <div className='contentProfileIn'>
                                  <h3>{employerData.employer.company_name}</h3>
                                  <label>Company Name :</label>
                                </div>
                              </li>
                              <li>
                                <div className="iconProStyleIn">
                                  <i className="ri-map-pin-user-line"></i>
                                </div>
                                <div className='contentProfileIn'>
                                  <h3>{employerData.address.city}, {employerData.address.street}</h3>
                                  <label>Location :</label>
                                </div>
                              </li>
                              <li>
                                <div className="iconProStyleIn">
                                  <i className="ri-user-3-line"></i>
                                </div>
                                <div className='contentProfileIn'>
                                  <h3>{employerData.first_name}</h3>
                                  <label>Name :</label>
                                </div>
                              </li>
                              <li>
                                <div className="iconProStyleIn">
                                  <i className="ri-phone-fill"></i>
                                </div>
                                <div className='contentProfileIn'>
                                  <h3>{employerData.phone}</h3>
                                  <label>Mobile:</label>
                                </div>
                              </li>
                              <li>
                                <div className="iconProStyleIn">
                                    <i className="ri-mail-line"></i>
                                </div>
                                <div className='contentProfileIn'>
                                  <h3>{employerData.email}</h3>
                                  <label>Email:</label>
                                </div>
                              </li>
                              <li>
                                <div className="iconProStyleIn">
                                  <i className="ri-file-4-line"></i>
                                </div>
                                <div className='contentProfileIn'>
                                  <h3>{formatDate(employerData.created_at)}</h3>
                                  <label>Joining Date:</label>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {/* Portfolio Section */}
                      <div className="card">
                        <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                            <h5 className="card-title mb-0">Social Links</h5>
                            <div className="">
                              <button type="button"  data-bs-toggle="modal" data-bs-target="#socialLinkModal" className="border-0 linkAbleEdit">
                                <i className="ri-pencil-line align-bottom"></i>
                              </button>
                            </div>
                        </div>
                        <div className="card-body">
                          <div className="d-flex flex-wrap gap-2">
                            {employerData?.social_links?.length > 0 ? (
                              employerData.social_links.map((linkSocial, index) => (
                                <div key={linkSocial.id || index}>
                                  <a
                                    href={linkSocial.url || '#'}
                                    className="avatar-xs d-block"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="avatar-title rounded-circle fs-16 bg-body text-body material-shadow">
                                      <i className={`text-primary ${getSocialIconClass(linkSocial.platform || '')}`}></i>
                                    </span>
                                  </a>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted mx-auto mb-0">No social links added yet.</p>
                            )}
                            
                          </div>
                        </div>
                      </div>

                      
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="socialLinkModal" tabIndex="-1" aria-labelledby="socialLinkMain" aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="socialLinkMain">Social URL</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                    <div className="modal-body">
                        {socialPlatforms.map((platform, index) => (
                          <div className="mb-3" key={index}>
                            <label htmlFor={platform.name} className="form-label">
                              {platform.name}
                            </label>
                            <input
                              type="text"
                              className='form-control-custom bg-lightBlue form-control'
                              id={platform.name}
                              name={platform.name}
                              onChange={handleChange}
                              placeholder={platform.placeholder}
                              value={formDataLinks[platform.name] || ''}
                            />
                             {console.log(formDataLinks[platform.name])}
                          </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  );
};

export default EmployerProfile;