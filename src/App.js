import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import EmployeeDashboardPage from "./EmployeeDashboardPage";
import JobList from './jobList'
import EmployeeOrEmployer from "./EmployeeOrEmployer";
import EmployerRegisterPage from "./EmployerRegisterPage";
import EmployerDashboard from "./EmployerDashboard";
import ForgotPassword from "./ForgotPassword";
import PasswordReset from "./PasswordReset";
import EditEmployee from "./EditEmployee";
import JobBoard from "./JobBoard";
import EditEmployer from "./EditEmployer";
import EmployerDashboardProfile from "./EmployerDashboardProfile";
import Logout from './Logout';
import JobDetails from "./jobDetails";



function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/auth-signup-basic-employee" element={<RegisterPage />} />
      <Route path="/auth-signup-basic-employer" element={<EmployerRegisterPage />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />
      <Route path="/employee-employer-option" element={<EmployeeOrEmployer />} /> 
      <Route path="/employer-dashboard" element={<EmployerDashboard />} /> 
      <Route path="/auth-pass-reset-basic" element={<ForgotPassword />} /> 
      <Route path="/reset-password" element={<PasswordReset />} /> 
      <Route path="/edit-employee" element={<EditEmployee />} /> 
      <Route path="/edit-employer" element={<EditEmployer />} /> 
      <Route path="/job-board" element={<JobBoard />} /> 
      <Route path="/job-list" element={<JobList />} /> 
      <Route path="/job-detail" element={<JobDetails />} /> 
      <Route path="/logout" element={<Logout />} />
      <Route path="/employer-profile-dashboard" element={<EmployerDashboardProfile />} /> 
    </Routes>
  );
}

export default App;

