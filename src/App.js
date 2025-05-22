import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import EmployerLoginPage from './EmployerLogin'
import RegisterPage from "./RegisterPage";
import EmployeeDashboardPage from "./EmployeeProfile";
import JobList from './jobList'
import EmployeeOrEmployer from "./EmployeeOrEmployer";
import EmployerRegisterPage from "./EmployerRegisterPage";
import EmployerDashboard from "./jobPost";
import EmployerJobDetails from "./employer_job_detail";
import ForgotPassword from "./ForgotPassword";
import PasswordReset from "./PasswordReset";
import EditEmployee from "./EditEmployee";
import JobBoard from "./JobBoard";
import EditEmployer from "./EditEmployer";
import EmployerProfile from "./EmployerProfile";
import Logout from './Logout';
import JobDetails from "./jobDetails";
import PrivateRoute from './protectRoutes'
import JobRecommend from "./JobsRecommended";
import CandidateList from "./CandidateList";
import NotFoundRedirect from './NotFoundRedirect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/LoginPageEmp" element={<EmployerLoginPage />} />
      <Route path="/auth-signup-basic-employee" element={<RegisterPage />} />
      <Route path="/auth-signup-basic-employer" element={<EmployerRegisterPage />} />
      <Route path="/auth-pass-reset-basic" element={<ForgotPassword />} /> 
      <Route path="/reset-password" element={<PasswordReset />} /> 
      <Route path="/job-board" element={<JobBoard />} /> 
      <Route path="/job-list" element={<JobList />} /> 
      <Route path="/employee-employer-option" element={<EmployeeOrEmployer />} /> 
      <Route element={<PrivateRoute allowedRoles={[2]} />}>
        <Route path="/profile-edit" element={<EditEmployee />} /> 
        <Route path="/profile" element={<EmployeeDashboardPage />} />
        <Route path="/job-recommended" element={<JobRecommend />} /> 
        <Route path="/job-detail/:id" element={<JobDetails />} /> 
      </Route>
      <Route element={<PrivateRoute allowedRoles={[3]} />}>
        <Route path="/job-post" element={<EmployerDashboard />} /> 
        <Route path="/employer-profile-edit" element={<EditEmployer />} /> 
        <Route path="/employer-profile" element={<EmployerProfile />} /> 
        <Route path="/candidate-list/:id" element={<CandidateList />} /> 
        <Route path="/employer-job-detail/:id" element={<EmployerJobDetails />} /> 
      </Route>
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

export default App;

