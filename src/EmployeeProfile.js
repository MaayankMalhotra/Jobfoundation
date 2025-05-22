import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './EmployeeDashboard.css'; // Ensure you have a CSS file for custom styles
// import Sidebar from './Sidebar';
import Header from './components/header'
import DarkLogo from './assets/images/logo-dark.png'
import Footer from './components/footer'
import Loader from './components/loader'
import dummyUser from './assets/images/dummy_avatar.jpg'
import Swal from "sweetalert2";
import axios from "axios";
const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [licenceList, setLicenceList] = useState([]);
  const [certificateList, setCertificateList] = useState([]);
  const [btnLoader, setBtnLoader] =useState(false)
  const [fileLoader, setFileLoader] = useState(false)
  const [formDataLinks, setFormDataLinks] = useState({});
  
  const [submittedLinks, setSubmittedLinks] = useState({
    social_links: []
  });
  const [socialPlatforms, setSocialPlatforms] = useState([])
  const [show, setShow] = useState(false);
  const [licences, setLicences] = useState([]);
  const [formDataLicence, setFormDataLicence] = useState({
    licence_id: '',
    month: "",
    year: "",
    noExpiry: false,
  });
  const [errorsLic, setErrorsLic] = useState({
    licence_id: '',
    month: "",
    year: ""
  });
  const [editIndex, setEditIndex] = useState(null);


  const [showCert, setShowCert] = useState(false);
  const [certificate, setCertificate] = useState([]);
  const [formDataCert, setFormDataCert] = useState({
   certification_id: '',
    month: "",
    year: "",
    noExpiry: false,
  });
  const [errorsCert, setErrorsCert] = useState({
    certification_id: '',
    month: "",
    year: ""
  });
  const [editIndexCert, setEditIndexCert] = useState(null);

  const months = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = ["", ...Array.from({ length: 30 }, (_, i) => currentYear + i)];






    useEffect(() => {
      const fetchDropdownData = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get('https://girangroup.com/jobfoundation/public/api/dropdown-list', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json', // ✅ Added Content-Type
            },
          });
          console.log('API Response:', response.data); // 👈 Check this in browser console
    
          // ✅ Correct path
          const data = response.data?.data;
    
          if (data) {
            setLicenceList(data.licenceList || []);
            setCertificateList(data.certificationList || []);
          } else {
            console.error("No data found in response");
          }
        } catch (error) {
          console.error("Error fetching dropdown data:", error);
        }
      };
    
      fetchDropdownData();
    }, []);








  // for Certifications

  const handleChangeCert = (e) => {
    const { name, value, checked, type } = e.target;
    setFormDataCert((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSaveCert = async () => {
  let newErrors = { certification_id: "", month: "", year: "" };
  let isValid = true;

  if (!formDataCert.certification_id) {
    newErrors.certification_id = "Please select a Certification.";
    isValid = false;
  }

  if (!formDataCert.noExpiry) {
    if (!formDataCert.month || formDataCert.month === "Month") {
      newErrors.month = "Please select an expiration month.";
      isValid = false;
    }
    if (!formDataCert.year || formDataCert.year === "Year") {
      newErrors.year = "Please select an expiration year.";
      isValid = false;
    }
  }

  setErrorsLic(newErrors);
  if (!isValid) return;

  const token = localStorage.getItem("token");

  const newEntryCert = {
      // employee_id: employeeId,
      certification_id: formDataCert.certification_id, // Changed to licence_name assuming API expects a name
      expire_month: formDataCert.noExpiry ? null : formDataCert.month,
      expire_year: formDataCert.noExpiry ? null : formDataCert.year,
      noExpiry: formDataCert.noExpiry,
  };

  console.log(newEntryCert)
  setBtnLoader(true);
  try {
    let response;

    if (editIndex !== null) {
      const existingId = certificate[editIndex].id;
      response = await axios.put(
        `https://girangroup.com/jobfoundation/public/api/employee/employee-certification/${existingId}`,
        newEntryCert,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      response = await axios.post(
        "https://girangroup.com/jobfoundation/public/api/employee/employee-certifications",
        newEntryCert,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    if (response.status === 200 || response.status === 201) {
      const updatedData = response.data.data;
      if (editIndex !== null) {
        const updatedList = [...certificate];
        updatedList[editIndex] = updatedData;
        setCertificate(updatedList);
      } else {
        setCertificate((prev) => [...prev, updatedData]);
      }

      // Close modal manually
      document.getElementById("closeLicenceModalBtnCert").click();
      handleCloseLicence();
    }
    Swal.fire({
      icon: 'success',
      title: editIndex !== null ? 'Certification Updated' : 'Certification Added',
      text: editIndex !== null 
        ? 'The certification has been successfully updated.' 
        : 'The certification has been successfully added.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5a34a0',
    });
    
  } catch (error) {
    console.error("❌ Error while saving certification:", error.response?.data || error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data || error.message || 'Something went wrong while saving the certification.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
    });
  }finally {
    setBtnLoader(false); 
  }
};

const handleOpenCert = (index = null) => {
  if (index !== null) {
    // Edit mode: load licence data into form
    const certificateToEdit = certificate[index];
    setFormDataCert({
      certification_id: certificateToEdit.certification_id, 
      month: certificateToEdit.expire_month || "",
      year: certificateToEdit.expire_year || "",
      noExpiry: certificateToEdit.noExpiry || false,
    });
    setEditIndex(index);
  } else {
    // Add mode: reset form
    setFormDataCert({
      certification_id:'',
      month: "",
      year: "",
      noExpiry: false,
    });
    setEditIndex(null);
  }
  setShow(true);  // if you are controlling modal via state show/hide
};
//   const handleSaveCert = () => {
//     let newErrors = { name: "", month: "", year: "" };
//     let isValid = true;

//   if (!formDataCert.name.trim()) {
//     newErrors.name = "Certificate name is required.";
//     isValid = false;
//   }

//   if (!formDataCert.noExpiry) {
//     if (!formDataCert.month || formDataCert.month === "Month") {
//       newErrors.month = "Please select an expiration month.";
//       isValid = false;
//     }
//     if (!formDataCert.year || formDataCert.year === "Year") {
//       newErrors.year = "Please select an expiration year.";
//       isValid = false;
//     }
//   }

//   setErrorsCert(newErrors);

//   if (!isValid) return;

//   const newEntry = {
//     name: formDataCert.name.trim(),
//     month: formDataCert.noExpiry ? "" : formDataCert.month,
//     year: formDataCert.noExpiry ? "" : formDataCert.year,
//     noExpiry: formDataCert.noExpiry,
//   };

//   if (editIndex !== null) {
//     const updated = [...certificate];
//     updated[editIndex] = newEntry;
//     setCertificate(updated);
//     setEditIndexCert(null);
//   } else {
//     setCertificate((prev) => [...prev, newEntry]);
//   }
//   handleCloseCert();
// };

  // const handleEditCert = (index) => {
  //   const data = certificate[index];
  //   setFormDataCert(data);
  //   setEditIndex(index);
  //   setShow(true);
  // };

  const handleDeleteCert = async (index, id) => {
  const token = localStorage.getItem('token');

  // Step 1: Confirm before deleting
  const confirmResult = await Swal.fire({
    title: 'Are you sure?',
    text: "This will permanently delete the certification.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
  });

  if (confirmResult.isConfirmed) {
    try {
      // Step 2: Perform DELETE request
      await axios.delete(
        `https://girangroup.com/jobfoundation/public/api/employee/employee-certification/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 3: Remove from local state
      const updated = [...certificate];
      updated.splice(index, 1);
      setCertificate(updated);

      // Step 4: Show success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Certification has been successfully deleted.',
        confirmButtonColor: '#5a34a0',
      });

    } catch (error) {
      // Step 5: Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || error.message || 'Something went wrong while deleting the certification.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  }
};

  const handleCloseCert = () => {
    setShow(false);
    setFormDataCert({ name: "", month: "", year: "", noExpiry: false });
    setEditIndexCert(null);
    setErrorsCert({ name: "", month: "", year: "" }); // clear errors
  };



// For Licence
const handleChangeLicence = (e) => {
  const { name, value, checked, type } = e.target;
  setFormDataLicence((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleSaveLicence = async () => {
  
  let newErrors = { licence_id: "", month: "", year: "" };
  let isValid = true;

  if (!formDataLicence.licence_id) {
    newErrors.licence_id = "Please select a licence.";
    isValid = false;
  }

  if (!formDataLicence.noExpiry) {
    if (!formDataLicence.month || formDataLicence.month === "Month") {
      newErrors.month = "Please select an expiration month.";
      isValid = false;
    }
    if (!formDataLicence.year || formDataLicence.year === "Year") {
      newErrors.year = "Please select an expiration year.";
      isValid = false;
    }
  }

  setErrorsLic(newErrors);
  if (!isValid) return;

  const token = localStorage.getItem("token");

const newEntry = {
    // employee_id: employeeId,
    licence_id: formDataLicence.licence_id, // Changed to licence_name assuming API expects a name
    expire_month: formDataLicence.noExpiry ? null : formDataLicence.month,
    expire_year: formDataLicence.noExpiry ? null : formDataLicence.year,
    noExpiry: formDataLicence.noExpiry,
};

  console.log(newEntry, 'edfaef')
  setBtnLoader(true);
  try {
    let response;

    if (editIndex !== null) {
      const existingId = licences[editIndex].id;
      response = await axios.put(
        `https://girangroup.com/jobfoundation/public/api/employee/employee-licence/${existingId}`,
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      response = await axios.post(
        "https://girangroup.com/jobfoundation/public/api/employee/employee-licences",
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    if (response.status === 200 || response.status === 201) {
      const updatedData = response.data.data;
      console.log(response.data)
      if (editIndex !== null) {
        const updatedList = [...licences];
        updatedList[editIndex] = updatedData;
        setLicences(updatedList);

      } else {
        setLicences((prev) => [...prev, updatedData]);
      }

      // Close modal manually
      document.getElementById("closeLicenceModalBtn").click();
      handleCloseLicence();
      Swal.fire({
        icon: 'success',
        title: editIndex !== null ? 'Licence Updated' : 'Licence Added',
        text: editIndex !== null 
          ? 'The Licence has been successfully updated.' 
          : 'The Licence has been successfully added.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    }
  } catch (error) {
    console.error("❌ Error while saving licence:", error.response?.data || error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data || error.message || 'Something went wrong while saving the certification.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
    });
  }finally {
    setBtnLoader(false); 
  }
};

const handleOpenLicence = (index = null) => {
  if (index !== null) {
    // Edit mode: load licence data into form
    const licenceToEdit = licences[index];
    setFormDataLicence({
      licence_id: licenceToEdit.licence_id,           // licence name field
      month: licenceToEdit.expire_month || "",
      year: licenceToEdit.expire_year || "",
      noExpiry: licenceToEdit.noExpiry || false,
    });
    setEditIndex(index);
  } else {
    // Add mode: reset form
    setFormDataLicence({
      licence_id:'',
      month: "",
      year: "",
      noExpiry: false,
    });
    setEditIndex(null);
  }
  setShow(true);  // if you are controlling modal via state show/hide
};


const handleDeleteLicence = async (index, id) => {
  const token = localStorage.getItem('token');

  // Step 1: Confirm before deleting
  const confirmResult = await Swal.fire({
    title: 'Are you sure?',
    text: "This will permanently delete the licence.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
  });

  if (confirmResult.isConfirmed) {
    try {
      // Step 2: DELETE request
      await axios.delete(
        `https://girangroup.com/jobfoundation/public/api/employee/employee-licence/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 3: Update local state
      const updated = [...licences];
      updated.splice(index, 1);
      setLicences(updated);

      // Step 4: Show success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Licence has been successfully deleted.',
        confirmButtonColor: '#5a34a0',
      });

    } catch (error) {
      // Step 5: Error alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || error.message || 'Something went wrong while deleting the licence.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  }
};



const handleCloseLicence = () => {
  setFormDataLicence({
    licence_id:'',
    month: "",
    year: "",
    noExpiry: false,
  });
  setErrorsLic({
    licence_id:'',
    name: "",
    month: "",
    year: "",
  });
  setEditIndex(null);
  setShow(false); 
};




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

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      'https://girangroup.com/jobfoundation/public/api/employee/store-social-links',
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
    setEmployeeData((prev) => ({
      ...prev,
      social_links,
    }));


      const modalEl = document.getElementById('socialLinkModal');
      if (modalEl) {
        modalEl.classList.remove('show');
        modalEl.style.display = 'none';
        modalEl.removeAttribute('aria-modal'); // 👈 remove this
        modalEl.removeAttribute('role');
        modalEl.setAttribute('aria-hidden', 'true');

        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((backdrop) => backdrop.remove());
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
        const linksObj = {};
        data.data.social_links.forEach(link => {
          linksObj[link.platform] = link.url;
        });
        setEmployeeData(data.data);
        setFormDataLinks(linksObj)
        setLicences(data.data.employee.licences)
        setCertificate(data.data.employee.certifications)
       
      if (data.data?.employee?.cv) {
        const cvPath = data.data.employee.cv;
        const cvUrl = `https://girangroup.com/jobfoundation/public/storage/${cvPath}`;
        const cvName = cvPath.split("/").pop();
          setFiles([
            {
              name: cvName,
              url: cvUrl,
              isFromServer: true,
            },
          ]);
        }
        console.log(data.data, 'datCheckKrroji')
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


    
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFileError('');

  if (file.type !== 'application/pdf') {
    setFileError('Only PDF files are allowed.');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    setFileError('File size must be under 2MB.');
    return;
  }

  if (files.length >= 1) {
    setFileError('Only one resume can be uploaded at a time.');
    return;
  }

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('cv', file);

  setFileLoader(true); // Show loader before upload

  try {
    const res = await axios.post(
      'https://girangroup.com/jobfoundation/public/api/employee/upload-resume',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Resume upload response:", res.data);

    if (res.data?.status === 'success') {
      const filePath = res.data.file_path;
      const fullUrl = `https://girangroup.com/jobfoundation/public${filePath}`;
      const fileName = filePath.split("/").pop();

      setFiles([{ name: fileName, url: fullUrl, isFromServer: true }]);
      setEmployeeData((prev) => ({ ...prev, cv: fullUrl }));

      Swal.fire({
        icon: 'success',
        title: 'Upload Successful',
        text: 'Your resume has been uploaded successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    } else {
      throw new Error('Failed to upload resume. Please try again.');
    }

  } catch (error) {
    console.error("❌ Upload Error:", error);
    Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      text: error.response?.data?.message || error.message || 'An error occurred while uploading.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
    });
  } finally {
    setFileLoader(false); // Hide loader after upload
  }
};


const handleDelete = async (index) => {
  const token = localStorage.getItem('token');

  try {
    const res = await axios.delete(
      'https://girangroup.com/jobfoundation/public/api/employee/remove-resume',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // If your API expects a body (e.g., file path), include it here
        data: {}, // Empty if nothing is required
      }
    );

    if (res.data?.status === 'success') {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      setFileError('');
      setEmployeeData((prev) => ({
        ...prev,
        cv: null,
      }));

      Swal.fire({
        icon: 'success',
        title: 'Resume Removed',
        text: 'The resume was successfully removed.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a34a0',
      });
    } else {
      throw new Error(res.data?.message || 'Failed to delete resume.');
    }
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Something went wrong while deleting the resume.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
    });
  }
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
                            src={
                              employeeData?.employee?.profile
                                ? `https://girangroup.com/jobfoundation/public/storage/${employeeData.employee.profile}`
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
                          <h3 className="mb-1">{employeeData.first_name}</h3>
                          <div className="hstack addressStyleDiv gap-1">
                              <i className="ri-map-pin-user-line me-1 text-opacity-75 fs-16 align-middle"></i>
                              {employeeData.address.city}, {employeeData.address.street}
                          </div>
                          {/* <div className="mainCardShortInfo mt-2">
                              <div className="cardsInfoStyle bg-theme-light">
                                <span className="countNumberPro">24.3K</span>
                                <span>Followers</span>
                              </div>
                              <div className="cardsInfoStyle bg-sky-blue">
                                <span className="countNumberPro">1.3K</span>
                                <span>Following</span>
                              </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="col-auto align-self-start">
                          <div className="editLinkStyle">
                            <Link to="/profile-edit" className="linkAbleEdit">
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
                        <Link to="/profile-edit" className="linkAbleEdit">
                          <i className="ri-pencil-line align-bottom"></i>
                        </Link>
                    </div>
                  </div>
                  <div className="card-body aboutContentPro">
                     {employeeData.employee.about_us && (
                        <div
                          className="about-content"
                          dangerouslySetInnerHTML={{ __html: employeeData.employee.about_us }}
                        />
                      )}
                    {/* <p>
                      Hi, I'm {employeeData.first_name}, a passionate professional with experience in building scalable and user-friendly applications. I enjoy working with modern technologies and solving complex problems.
                    </p>
                    <p>
                      In my free time, I contribute to open-source projects and write technical blogs. I believe in continuous learning and always strive to improve my skills.
                    </p> */}
                  </div>
                </div>
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                      <h5 className="card-title mb-0">Personal Information</h5>
                      <div className="">
                        <Link to="/profile-edit" className="linkAbleEdit">
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
                        <li>
                          <div className="iconProStyleIn">
                              <i className="ri-mail-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>{employeeData.email}</h3>
                            <label>Email:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-money-dollar-circle-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>${employeeData.employee.ctc}</h3>
                            <label>Salary:<sup>(CTC)</sup></label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-user-star-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>{employeeData.employee.experience}</h3>
                            <label>Experience:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-file-4-line"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>{employeeData.employee.notice_period}</h3>
                            <label>Notice Period:</label>
                          </div>
                        </li>
                        <li>
                          <div className="iconProStyleIn">
                            <i className="ri-translate"></i>
                          </div>
                          <div className='contentProfileIn'>
                            <h3>{employeeData.employee.language}</h3>
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
                  </div>
                </div>
                <div className="card">
                  <div className="card-header border-bottom pb-3">
                    <h5 className="card-title mb-0">Resume Upload (PDF)</h5>
                    <p className="text-danger mb-0 mt-1" style={{ fontSize: '13px', display: 'block' }}>
                        Maximum file size is 2MB. Please upload your resume in PDF format.
                      </p>
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
                      {fileLoader ? (
                          <div className="loaderStyleUpload">
                            <div className="text-center">
                                <div class="spinner-border text-primary" role="status">
                                  <span class="sr-only"></span>
                                </div>
                                <span className="d-block mt-2">Please Wait...</span>
                            </div>
                          </div>
                      ):
                      (
                       
                      <div className='fileUploaderSec' style={{ maxWidth: "100%", margin: "0 auto" }}>
                          {files.length > 0 && (
                            <div className="row gx-2 mb-3">
                              <div className="col">
                                <div className="iconResumeSide d-flex gap-2 align-items-center">
                                  <div className="iconProStyleIn">
                                    <i className="ri-file-line"></i>
                                  </div>
                                  <div className="contentProfileIn">
                                    <label>{files[0].name}</label>
                                  </div>
                                </div>
                              </div>

                              <div className="col-auto">
                                <div className="d-flex flex-wrap buttonGroupUpload gap-2">
                                  
                                  <a
                                    href={files[0].isFromServer ? files[0].url : URL.createObjectURL(files[0])}
                                    download={files[0].name}
                                    target="_blank"
                                    className="bg-theme-light boxActionBtn"
                                  >
                                    <i className="ri-download-line"></i>
                                  </a>

                                  
                                  <button
                                    onClick={() => handleDelete()}
                                    className="bg-light-danger boxActionBtn"
                                  >
                                    <i className="ri-delete-bin-6-line"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Upload Button */}
                          <label
                            htmlFor="imageUploadStyle"
                            className={`uploadLabelStyle ${files.length >= 1 ? 'disabled' : ''}`}
                            style={{ cursor: files.length >= 1 ? 'not-allowed' : 'pointer', opacity:files.length >= 1 ? '0.4' : '1' }}
                          >
                            <i className="ri-file-upload-line"></i>
                            Upload Your File
                          </label>
                          <input
                            id="imageUploadStyle"
                            type="file"
                            className="d-none"
                            name="cv"
                            accept=".pdf"
                            onChange={handleFileChange}
                            disabled={files.length >= 1}
                          />
                          {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
                      </div>
                      )
                      }
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {/* Portfolio Section */}
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                      <h5 className="card-title mb-0">Social Links</h5>
                      <div className="">
                        <button type="button"  data-bs-toggle="modal" data-bs-target="#socialLinkModal" className="border-0 linkAbleEdit">
                          {employeeData?.social_links?.length > 0 ? (
                          <i className="ri-pencil-line align-bottom"></i>
                          ) : (
                          <i class="ri-add-circle-line align-bottom"></i>
                          )}
                        </button>
                      </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-wrap gap-2">
                      {employeeData?.social_links?.length > 0 ? (
                        employeeData.social_links.map((linkSocial, index) => (
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

                {/* Skills Section */}
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                    <h5 className="card-title mb-0">Skills</h5>
                    <div className="">
                        <Link to="/profile-edit" className="linkAbleEdit">
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

                {/* Licence Section */}
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                    <h5 className="card-title mb-0">Licence</h5>
                    <div className="">
                      <button type="button"  data-bs-toggle="modal" onClick={() => handleOpenLicence(null)} data-bs-target="#licenceModal" className="border-0 linkAbleEdit">
                        <i class="ri-add-circle-line align-bottom"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="">
                        {licences && licences.length > 0 ? (
                          <ul className="list-group m-0 listStyleColumnMain">
                                {licences.map((licence, index) => (
                                  <li key={index}>
                                    <div className="nameColumnData">
                                      <h4>{licence?.licence?.name}</h4>
                                      <div className="d-flex">
                                          <i class="ri-hourglass-fill"></i>
                                          <p>
                                          {licence.noExpiry
                                            ? "Does not expire"
                                            : `Expires: ${licence.expire_month} ${licence.expire_year}`}</p>
                                      </div>
                                      
                                    </div>
                                    <div className="actionColumnData">
                                    <button
                                      type="button"
                                      className="border-0 p-0 bg-transparent text-primary me-3"
                                      data-bs-toggle="modal"
                                      data-bs-target="#licenceModal"
                                      onClick={() => handleOpenLicence(index)}
                                    >
                                      <i class="ri-pencil-line"></i>
                                    </button>
                                    <button type="button" className="border-0 p-0 bg-transparent text-danger" size="sm" onClick={() => handleDeleteLicence(index, licence.id)}><i class="ri-delete-bin-line"></i></button>
                                    </div>
                                  </li>
                              ))}
                          </ul>
                          ): (
                            <span className="text-muted text-muted text-center d-block">No licence added yet</span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Certificate Section */}
                <div className="card">
                  <div className="card-header border-bottom d-flex align-items-center justify-content-between pb-3">
                    <h5 className="card-title mb-0">Certificate</h5>
                    <div className="">
                        <button type="button"  data-bs-toggle="modal" onClick={() => handleOpenCert(null)} data-bs-target="#certificateModal" className="border-0 linkAbleEdit">
                          <i class="ri-add-circle-line align-bottom"></i>
                        </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="">
                      {certificate && certificate.length > 0 ? (
                          <ul className="list-group m-0 listStyleColumnMain">
                                {certificate.map((certificates, index) => (
                                  <li key={index}>
                                    <div className="nameColumnData">
                                      <h4>{certificates?.certification?.name}</h4>
                                      <p>
                                      {certificates.noExpiry
                                        ? "Does not expire"
                                        : `Expires: ${certificates.expire_month} ${certificates.expire_year}`}</p>
                                    </div>
                                    <div className="actionColumnData">
                                      <button
                                        type="button"
                                        className="border-0 p-0 bg-transparent text-primary me-3"
                                        data-bs-toggle="modal"
                                        data-bs-target="#certificateModal"
                                        onClick={() => handleOpenCert(index)}
                                      >
                                        <i class="ri-pencil-line"></i>
                                      </button>
                                      <button type="button" className="border-0 p-0 bg-transparent text-danger" size="sm" onClick={() => handleDeleteCert(index, certificates.id)}><i class="ri-delete-bin-line"></i></button>
                                    </div>
                                  </li>
                              ))}
                          </ul>
                          ): (
                            <span className="text-muted text-center d-block">No certificate added yet</span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      <Footer/>
      <div className="modal fade" id="socialLinkModal" tabIndex="-1" aria-labelledby="socialLinkMain" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="socialLinkMain">Social Links</h5>
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

     <div
        className="modal fade"
        id="licenceModal"
        tabIndex="-1"
        aria-labelledby="licenceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="licenceModalLabel">
                {editIndex !== null ? "Edit Licence" : "Add Licence"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseLicence}
              ></button>
            </div>
            <div className="modal-body">
              {/* <input type="" value={formDataLicence.licence_id}/> */}
              <div className="mb-3">
                <label htmlFor="licenceName" className="form-label">
                  Licence Required <span className="text-danger">*</span>
                </label>
                <select className="form-control" name="licence_id" id="licenceId" value={formDataLicence.licence_id} onChange={e => setFormDataLicence({...formDataLicence, licence_id: e.target.value})}>
                  <option value="">Select Licence</option>
                  {licenceList.map((licence) => (
                    <option key={licence.id} value={licence.id}>
                      {licence.name}
                    </option>
                  ))}
                </select>
                {errorsLic.licence_id && <div className="invalid-feedback">{errorsLic.licence_id}</div>}
              </div>
              {/* <div className="mb-3">
                <label htmlFor="licenceName" className="form-label">
                  Licence name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errorsLic.name ? "is-invalid" : ""}`}
                  id="licenceName"
                  name="name"
                  placeholder="Example: Driver's licence"
                  value={formDataLicence.name}
                  onChange={handleChangeLicence}
                />
                {errorsLic.name && <div className="invalid-feedback">{errorsLic.name}</div>}
              </div> */}

              <label className="form-label">Expiration date</label>
              <div className="row gx-2 ">
                <div className="col-md-6 mb-2">
                  <select
                    className={`form-select ${errorsLic.month ? "is-invalid" : ""}`}
                    name="month"
                    disabled={formDataLicence.noExpiry}
                    value={formDataLicence.month}
                    onChange={handleChangeLicence}
                  >
                    {months.map((m, i) => (
                      <option key={i} value={m}>
                        {m || "Month"}
                      </option>
                    ))}
                  </select>
                  {errorsLic.month && <div className="invalid-feedback">{errorsLic.month}</div>}
                </div>
                <div className="col-md-6 mb-2">
                  <select
                    className={`form-select ${errorsLic.year ? "is-invalid" : ""}`}
                    name="year"
                    disabled={formDataLicence.noExpiry}
                    value={formDataLicence.year}
                    onChange={handleChangeLicence}
                  >
                    {years.map((y, i) => (
                      <option key={i} value={y}>
                        {y || "Year"}
                      </option>
                    ))}
                  </select>
                  {errorsLic.year && <div className="invalid-feedback">{errorsLic.year}</div>}
                </div>
              </div>

              <div className="form-check mb-2">
                
                <label className="form-check-label" htmlFor="noExpiry">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="noExpiry"
                    name="noExpiry"
                    checked={formDataLicence.noExpiry}
                    onChange={handleChangeLicence}
                  />
                  Does not expire
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseLicence}
                id="closeLicenceModalBtn"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btnStyleMinWdth"
                onClick={handleSaveLicence}
                disabled={btnLoader ? 'disabled' : ''}
                // Removed data-bs-dismiss to prevent premature modal closing
              >
                {btnLoader ? (
                  <div className="spinner-border text-light btnLoaderStyle" role="status">
                    <span className="sr-only"></span>
                  </div>
                ) : (
                  editIndex !== null ? "Update" : "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>


      <div
        className="modal fade"
        id="certificateModal"
        tabIndex="-1"
        aria-labelledby="certificateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="certificateModalLabel">
                {editIndexCert !== null ? "Edit Certification" : "Add Certification"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseCert}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="certificate_id" className="form-label">
                  Certification Required <span className="text-danger">*</span>
                </label>
                <select className="form-control" name="certification_id" id="certificate_id" value={formDataCert.certification_id} onChange={e => setFormDataCert({...formDataCert, certification_id: e.target.value})}>
                  <option value="">Select Certificate</option>
                  {certificateList.map((cert) => (
                    <option key={cert.id} value={cert.id}>
                      {cert.name}
                    </option>
                  ))}
                </select>
                {errorsCert.name && <div className="invalid-feedback">{errorsCert.name}</div>}
              </div>

              <label className="form-label">Expiration date</label>
              <div className="row gx-2 ">
                <div className="col-md-6 mb-2">
                  <select
                    className={`form-select ${errorsCert.name ? "is-invalid" : ""}`}
                    name="month"
                    disabled={formDataCert.noExpiry}
                    value={formDataCert.month}
                    onChange={handleChangeCert}
                  >
                    {months.map((m, i) => (
                      <option key={i} value={m}>
                        {m || "Month"}
                      </option>
                    ))}
                  </select>
                  {errorsCert.month && <div className="invalid-feedback ">{errorsCert.month}</div>}
                </div>
                  <div className="col-md-6 mb-2">
                    <select
                      className={`form-select ${errorsCert.year ? "is-invalid" : ""}`}
                      name="year"
                      disabled={formDataCert.noExpiry}
                      value={formDataCert.year}
                      onChange={handleChangeCert}
                    >
                      {years.map((y, i) => (
                        <option key={i} value={y}>
                          {y || "Year"}
                        </option>
                      ))}
                    </select>
                    {errorsCert.year && <div className="invalid-feedback">{errorsCert.year}</div>}
                  </div>
              </div>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="noExpiry"
                  name="noExpiry"
                  checked={formDataCert.noExpiry}
                  onChange={handleChangeCert}
                />
                <label className="form-check-label" htmlFor="noExpiry">
                  Does not expire
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseCert}
                id="closeLicenceModalBtnCert"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btnStyleMinWdth"
                onClick={handleSaveCert}
                disabled={btnLoader ? 'disabled' : ''}
              >
              
                {btnLoader ? (
                  <div className="spinner-border text-light btnLoaderStyle" role="status">
                    <span className="sr-only"></span>
                  </div>
                ) : (
                  editIndex !== null ? "Update" : "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default EmployeeDashboard;