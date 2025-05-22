import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import
import dummyUser from './assets/images/dummy_avatar.jpg'
///import './Topbar.css'; 

const Topbar = () => {
  // State for dropdowns and search
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('en'); // Default language English
  const [cartItems] = useState([
    { id: 1, name: 'Branded T-Shirts', quantity: 10, price: 32, img: 'build/images/products/img-1.png' },
    { id: 2, name: 'Bentwood Chair', quantity: 5, price: 18, img: 'build/images/products/img-2.png' },
    { id: 3, name: 'Borosil Paper Cup', quantity: 3, price: 250, img: 'build/images/products/img-3.png' },
    { id: 4, name: 'Gray Styled T-Shirt', quantity: 1, price: 1250, img: 'build/images/products/img-6.png' },
    { id: 5, name: 'Stillbird Helmet', quantity: 2, price: 495, img: 'build/images/products/img-5.png' },
  ]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Language flag based on selection
  const languageFlags = {
    en: 'build/images/flags/us.svg',
    ru: 'build/images/flags/russia.svg',
    it: 'build/images/flags/italy.svg',
    sp: 'build/images/flags/spain.svg',
    ch: 'build/images/flags/china.svg',
    fr: 'build/images/flags/french.svg',
    gr: 'build/images/flags/germany.svg',
    ae: 'build/images/flags/ae.svg',
  };

  // User data (assuming logged in user)
  const user = {
    name: 'Anna', // Replace with dynamic auth data if available
    avatar: dummyUser,
  };

  // Bhai, yahan se JSX shuru hota hai
  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            {/* Logo Section */}
            <div className="navbar-brand-box horizontal-logo">
              <a href="/index" className="logo logo-dark">
                <span className="logo-sm">
                  <img src="build/images/logo-sm.png" alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src="build/images/logo-dark.png" alt="" height="17" />
                </span>
              </a>
              <a href="/index" className="logo logo-light">
                <span className="logo-sm">
                  <img src="build/images/logo-sm.png" alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src="build/images/logo-light.png" alt="" height="17" />
                </span>
              </a>
            </div>

            {/* Hamburger Menu */}
            <button
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger material-shadow-none"
              id="topnav-hamburger-icon"
            >
              <span className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            {/* App Search */}
            <form className="app-search d-none d-md-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="search-options"
                />
                <span className="mdi mdi-magnify search-widget-icon"></span>
                {searchQuery && (
                  <span
                    className="mdi mdi-close-circle search-widget-icon search-widget-icon-close"
                    onClick={() => setSearchQuery('')}
                  ></span>
                )}
              </div>
              {searchQuery && (
                <div className="dropdown-menu dropdown-menu-lg" id="search-dropdown">
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    <div className="dropdown-header">
                      <h6 className="text-overflow text-muted mb-0 text-uppercase">Recent Searches</h6>
                    </div>
                    <div className="dropdown-item bg-transparent text-wrap">
                      <a href="/index" className="btn btn-soft-secondary btn-sm rounded-pill">
                        how to setup <i className="mdi mdi-magnify ms-1"></i>
                      </a>
                      <a href="/index" className="btn btn-soft-secondary btn-sm rounded-pill">
                        buttons <i className="mdi mdi-magnify ms-1"></i>
                      </a>
                    </div>
                    <div className="dropdown-header mt-2">
                      <h6 className="text-overflow text-muted mb-1 text-uppercase">Pages</h6>
                    </div>
                    <a href="#" className="dropdown-item notify-item">
                      <i className="ri-bubble-chart-line align-middle fs-18 text-muted me-2"></i>
                      <span>Analytics Dashboard</span>
                    </a>
                    <a href="#" className="dropdown-item notify-item">
                      <i className="ri-lifebuoy-line align-middle fs-18 text-muted me-2"></i>
                      <span>Help Center</span>
                    </a>
                    <a href="#" className="dropdown-item notify-item">
                      <i className="ri-user-settings-line align-middle fs-18 text-muted me-2"></i>
                      <span>My account settings</span>
                    </a>
                    <div className="dropdown-header mt-2">
                      <h6 className="text-overflow text-muted mb-2 text-uppercase">Members</h6>
                    </div>
                    <div className="notification-list">
                      <a href="#" className="dropdown-item notify-item py-2">
                        <div className="d-flex">
                          <img
                            src="build/images/users/avatar-2.jpg"
                            className="me-3 rounded-circle avatar-xs"
                            alt="user-pic"
                          />
                          <div className="flex-grow-1">
                            <h6 className="m-0">Angela Bernier</h6>
                            <span className="fs-11 mb-0 text-muted">Manager</span>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="dropdown-item notify-item py-2">
                        <div className="d-flex">
                          <img
                            src="build/images/users/avatar-3.jpg"
                            className="me-3 rounded-circle avatar-xs"
                            alt="user-pic"
                          />
                          <div className="flex-grow-1">
                            <h6 className="m-0">David Grasso</h6>
                            <span className="fs-11 mb-0 text-muted">Web Designer</span>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="dropdown-item notify-item py-2">
                        <div className="d-flex">
                          <img
                            src="build/images/users/avatar-5.jpg"
                            className="me-3 rounded-circle avatar-xs"
                            alt="user-pic"
                          />
                          <div className="flex-grow-1">
                            <h6 className="m-0">Mike Bunch</h6>
                            <span className="fs-11 mb-0 text-muted">React Developer</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="text-center pt-3 pb-1">
                    <a href="/pages-search-results" className="btn btn-primary btn-sm">
                      View All Results <i className="ri-arrow-right-line ms-1"></i>
                    </a>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Side Icons and Dropdowns */}
          <div className="d-flex align-items-center">
            {/* Mobile Search */}
            <div className="dropdown d-md-none topbar-head-dropdown header-item">
              <button
                className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
                data-bs-toggle="dropdown"
              >
                <i className="bx bx-search fs-22"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                      />
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Language Dropdown */}
            <div className="dropdown ms-1 topbar-head-dropdown header-item">
              <button
                className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
                data-bs-toggle="dropdown"
              >
                <img src={languageFlags[language]} className="rounded" alt="Header Language" height="20" />
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <a href="/index/en" className="dropdown-item notify-item language py-2" onClick={() => setLanguage('en')}>
                  <img src="build/images/flags/us.svg" alt="English" className="me-2 rounded" height="20" />
                  <span className="align-middle">English</span>
                </a>
                <a href="/index/sp" className="dropdown-item notify-item language" onClick={() => setLanguage('sp')}>
                  <img src="build/images/flags/spain.svg" alt="Spanish" className="me-2 rounded" height="20" />
                  <span className="align-middle">Española</span>
                </a>
                <a href="/index/gr" className="dropdown-item notify-item language" onClick={() => setLanguage('gr')}>
                  <img src="build/images/flags/germany.svg" alt="German" className="me-2 rounded" height="20" />
                  <span className="align-middle">Deutsche</span>
                </a>
                <a href="/index/it" className="dropdown-item notify-item language" onClick={() => setLanguage('it')}>
                  <img src="build/images/flags/italy.svg" alt="Italian" className="me-2 rounded" height="20" />
                  <span className="align-middle">Italiana</span>
                </a>
                <a href="/index/ru" className="dropdown-item notify-item language" onClick={() => setLanguage('ru')}>
                  <img src="build/images/flags/russia.svg" alt="Russian" className="me-2 rounded" height="20" />
                  <span className="align-middle">русский</span>
                </a>
                <a href="/index/ch" className="dropdown-item notify-item language" onClick={() => setLanguage('ch')}>
                  <img src="build/images/flags/china.svg" alt="Chinese" className="me-2 rounded" height="20" />
                  <span className="align-middle">中国人</span>
                </a>
                <a href="/index/fr" className="dropdown-item notify-item language" onClick={() => setLanguage('fr')}>
                  <img src="build/images/flags/french.svg" alt="French" className="me-2 rounded" height="20" />
                  <span className="align-middle">français</span>
                </a>
                <a href="/index/ae" className="dropdown-item notify-item language" onClick={() => setLanguage('ae')}>
                  <img src="build/images/flags/ae.svg" alt="Arabic" className="me-2 rounded" height="20" />
                  <span className="align-middle">Arabic</span>
                </a>
              </div>
            </div>

            {/* Apps Dropdown */}
            <div className="dropdown topbar-head-dropdown ms-1 header-item">
              <button
                className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
                data-bs-toggle="dropdown"
              >
                <i className="bx bx-category-alt fs-22"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
                <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="m-0 fw-semibold fs-15">Web Apps</h6>
                    </div>
                    <div className="col-auto">
                      <a href="#!" className="btn btn-sm btn-soft-info">
                        View All Apps <i className="ri-arrow-right-s-line align-middle"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="row g-0">
                    <div className="col">
                      <a className="dropdown-icon-item" href="#!">
                        <img src="build/images/brands/github.png" alt="Github" />
                        <span>GitHub</span>
                      </a>
                    </div>
                    <div className="col">
                      <a className="dropdown-icon-item" href="#!">
                        <img src="build/images/brands/bitbucket.png" alt="Bitbucket" />
                        <span>Bitbucket</span>
                      </a>
                    </div>
                    <div className="col">
                      <a className="dropdown-icon-item" href="#!">
                        <img src="build/images/brands/dribbble.png" alt="Dribbble" />
                        <span>Dribbble</span>
                      </a>
                    </div>
                  </div>
                  <div className="row g-0">
                    <div className="col">
                      <a className="dropdown-icon-item" href="#!">
                        <img src="build/images/brands/dropbox.png" alt="Dropbox" />
                        <span>Dropbox</span>
                      </a>
                    </div>
                    <div className="col">
                      <a className="dropdown-icon-item" href="#!">
                        <img src="build/images/brands/mail_chimp.png" alt="Mail Chimp" />
                        <span>Mail Chimp</span>
                      </a>
                    </div>
                    <div className="col">
                      <a className="dropdown-icon-item" href="#!">
                        <img src="build/images/brands/slack.png" alt="Slack" />
                        <span>Slack</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Dropdown */}
            <div className="dropdown topbar-head-dropdown ms-1 header-item">
              <button
                className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
                data-bs-toggle="dropdown"
              >
                <i className="bx bx-shopping-bag fs-22"></i>
                <span className="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info">
                  {cartItems.length}
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart">
                <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="m-0 fs-16 fw-semibold">My Cart</h6>
                    </div>
                    <div className="col-auto">
                      <span className="badge bg-warning-subtle text-warning fs-13">
                        <span className="cartitem-badge">{cartItems.length}</span> items
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div className="p-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.img}
                            className="me-3 rounded-circle avatar-sm p-2 bg-light"
                            alt="user-pic"
                          />
                          <div className="flex-grow-1">
                            <h6 className="mt-0 mb-1 fs-14">
                              <a href="/apps-ecommerce-product-details" className="text-reset">
                                {item.name}
                              </a>
                            </h6>
                            <p className="mb-0 fs-12 text-muted">
                              Quantity: <span>{item.quantity} x ${item.price}</span>
                            </p>
                          </div>
                          <div className="px-2">
                            <h5 className="m-0 fw-normal">${item.quantity * item.price}</h5>
                          </div>
                          <div className="ps-2">
                            <button className="btn btn-icon btn-sm btn-ghost-secondary">
                              <i className="ri-close-fill fs-16"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border">
                  <div className="d-flex justify-content-between align-items-center pb-3">
                    <h5 className="m-0 text-muted">Total:</h5>
                    <div className="px-2">
                      <h5 className="m-0">${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}</h5>
                    </div>
                  </div>
                  <a href="/apps-ecommerce-checkout" className="btn btn-success text-center w-100">
                    Checkout
                  </a>
                </div>
              </div>
            </div>

            {/* Fullscreen Button */}
            <div className="ms-1 header-item d-none d-sm-flex">
              <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle">
                <i className="bx bx-fullscreen fs-22"></i>
              </button>
            </div>

            {/* Light/Dark Mode Toggle */}
            <div className="ms-1 header-item d-none d-sm-flex">
              <button className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle light-dark-mode">
                <i className="bx bx-moon fs-22"></i>
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="dropdown topbar-head-dropdown ms-1 header-item" id="notificationDropdown">
              <button
                className="btn btn-icon btn-topbar material-shadow-none btn-ghost-secondary rounded-circle"
                data-bs-toggle="dropdown"
              >
                <i className="bx bx-bell fs-22"></i>
                <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
                <div className="dropdown-head bg-primary bg-pattern rounded-top">
                  <div className="p-3">
                    <div className="row align-items-center">
                      <div className="col">
                        <h6 className="m-0 fs-16 fw-semibold text-white">Notifications</h6>
                      </div>
                      <div className="col-auto dropdown-tabs">
                        <span className="badge bg-light text-body fs-13">4 New</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 pt-2">
                    <ul className="nav nav-tabs dropdown-tabs nav-tabs-custom" role="tablist">
                      <li className="nav-item">
                        <a className="nav-link active" href="#all-noti-tab">All (4)</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#messages-tab">Messages</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#alerts-tab">Alerts</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tab-content">
                  <div className="tab-pane fade show active py-2 ps-2" id="all-noti-tab">
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="pe-2">
                      {/* Notification items */}
                      <div className="text-reset notification-item d-block dropdown-item position-relative">
                        <div className="d-flex">
                          <div className="avatar-xs me-3 flex-shrink-0">
                            <span className="avatar-title bg-info-subtle text-info rounded-circle fs-16">
                              <i className="bx bx-badge-check"></i>
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <a href="#!" className="stretched-link">
                              <h6 className="mt-0 mb-2 lh-base">
                                Your <b>Elite</b> author Graphic Optimization <span className="text-secondary">reward</span> is ready!
                              </h6>
                            </a>
                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                              <span><i className="mdi mdi-clock-outline"></i> Just 30 sec ago</span>
                            </p>
                          </div>
                          <div className="px-2 fs-15">
                            <input className="form-check-input" type="checkbox" />
                          </div>
                        </div>
                      </div>
                      {/* Add more notification items similarly */}
                      <div className="my-3 text-center view-all">
                        <button className="btn btn-soft-success">
                          View All Notifications <i className="ri-arrow-right-line align-middle"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Add Messages and Alerts tabs if needed */}
                </div>
              </div>
            </div>

            {/* User Dropdown */}
            <div className="dropdown ms-sm-3 header-item topbar-user">
              <button className="btn material-shadow-none" data-bs-toggle="dropdown">
                <span className="d-flex align-items-center">
                  <img
                    className="rounded-circle header-profile-user"
                    src={user.avatar}
                    alt="Header Avatar"
                  />
                  <span className="text-start ms-xl-2">
                    <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user.name}</span>
                    <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">Founder</span>
                  </span>
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <h6 className="dropdown-header">Welcome {user.name}!</h6>
                <a className="dropdown-item" href="/pages-profile">
                  <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i> <span>Profile</span>
                </a>
                <a className="dropdown-item" href="/apps-chat">
                  <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span>Messages</span>
                </a>
                <a className="dropdown-item" href="/apps-tasks-kanban">
                  <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span>Taskboard</span>
                </a>
                <a className="dropdown-item" href="/pages-faqs">
                  <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span>Help</span>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/pages-profile">
                  <i className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span>Balance : <b>$5971.67</b></span>
                </a>
                <a className="dropdown-item" href="/pages-profile-settings">
                  <span className="badge bg-success-subtle text-success mt-1 float-end">New</span>
                  <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span>Settings</span>
                </a>
                <a className="dropdown-item" href="/auth-lockscreen-basic">
                  <i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span>Lock screen</span>
                </a>
                <a className="dropdown-item" href="#" onClick={() => console.log('Logout')}>
                  <i className="bx bx-power-off font-size-16 align-middle me-1"></i> <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Notification Modal */}
      {showRemoveModal && (
        <div className="modal fade zoomIn show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  className="btn-close"
                  onClick={() => setShowRemoveModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mt-2 text-center">
                  <lord-icon
                    src="https://cdn.lordicon.com/gsqxdxog.json"
                    trigger="loop"
                    colors="primary:#f7b84b,secondary:#f06548"
                    style={{ width: '100px', height: '100px' }}
                  ></lord-icon>
                  <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                    <h4>Are you sure ?</h4>
                    <p className="text-muted mx-4 mb-0">Are you sure you want to remove this Notification ?</p>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                  <button
                    className="btn w-sm btn-light"
                    onClick={() => setShowRemoveModal(false)}
                  >
                    Close
                  </button>
                  <button className="btn w-sm btn-danger" onClick={() => setShowRemoveModal(false)}>
                    Yes, Delete It!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;