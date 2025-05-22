import React from "react";
import { Link } from 'react-router-dom';
const SidebarMenu = () => {
    return (
        <>
            {/* ========== App Menu ========== */}
            <div className="app-menu navbar-menu ">
                {/* LOGO */}
                <div className="navbar-brand-box pb-3 mb-4">
                    {/* Dark Logo */}
                    {/* <a href="index.html" className="logo logo-dark">
                        <span className="logo-sm">
                            <img src="assets/images/logo-sm.png" alt="" height="22" />
                        </span>
                        <span className="logo-lg">
                            <img src="assets/images/logo-dark.png" alt="" height="17" />
                        </span>
                    </a> */}
                    {/* Light Logo */}
                    <Link to="/" className="logo">
                        <img
                            src="https://girangroup.com/jobfoundation/public/build/images/logo-light.png"
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height="50"
                        />
                    </Link>
                    <button
                        type="button"
                        className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
                        id="vertical-hover"
                    >
                        <i className="ri-record-circle-line"></i>
                    </button>
                </div>

                <div id="scrollbar" data-simplebar="init" className="h-100 simplebar-scrollable-y simplebar-mouse-entered">
                    <div className="simplebar-wrapper" style={{ margin: 0 }}>
                        <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                        </div>
                        <div className="simplebar-mask">
                            <div className="simplebar-offset" style={{ right: 0, bottom: 0 }}>
                                <div
                                    className="simplebar-content-wrapper"
                                    tabIndex="0"
                                    role="region"
                                    aria-label="scrollable content"
                                    style={{ height: "100%", overflow: "hidden scroll" }}
                                >
                                    <div className="simplebar-content" style={{ padding: 0 }}>
                                        <div className="container-fluid">
                                            <div id="two-column-menu"></div>
                                            <ul className="navbar-nav simplebar-mouse-entered sideBarMenuNav" id="navbar-nav" data-simplebar="init">
                                                <li className="nav-item">
                                                    <Link className="nav-link menu-link text-white" to="/employer-profile">
                                                    <i className="ri ri-dashboard-2-line me-2"></i>
                                                    <span>Profile</span>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link menu-link text-white" to="/job-post">
                                                    <i className="ri ri-briefcase-line me-2"></i>
                                                    <span>Job</span>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link menu-link text-white" to="/employer-profile-edit">
                                                    <i className="ri ri-user-settings-line me-2"></i>
                                                    <span>Profile Setting</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Sidebar */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sidebar-background"></div>
            </div>
            {/* Left Sidebar End */}
            {/* Vertical Overlay */}
            <div className="vertical-overlay"></div>
        </>
    );
};

export default SidebarMenu;
