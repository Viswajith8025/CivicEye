import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CivicEyeLoginPage } from "./CivicEyeLoginPage.jsx";
import { CivicEyeSignUp } from "./CivicEyeSignUp.jsx";

import { CivicEyeUserprofile } from "./CivicEyeUserprofile.jsx";
import { CivicEyeHome } from "./CivicEyeHome.jsx";
import { CivicEyeUserHome } from "./CivicEyeUserHome.jsx";
import { CivicEyeRegisterComplaint } from "./complaints/CivicEyeRegisterComplaint.jsx";
import { CivicEyeComplaintList } from "./complaints/CivicEyeComplaintList.jsx";
import { CivicEyeComplaintDetails } from "./complaints/CivicEyeComplaintDetails.jsx";
import { CiviEyeComplaintManagement} from "./admin/CivicEyeComplaintManagement.jsx";
import { AdminComplaintDetail } from "./admin/AdminComplaintDetail.jsx";
import { CivicEyeUserManagement } from "./admin/CivicEyeUserManagement.jsx";
import { UserDetails } from "./admin/UserDetails.jsx";
import { CivicEyeFeedbackManagement } from "./admin/CivicEyeFeedbackManagement.jsx";
import { AdminFeedbackDetails } from "./admin/AdminFeedbackDetails.jsx";
import { CivicEyeOverview } from "./admin/CivicEyeOverview.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/app" element={<App/>}></Route> */}
        <Route path="/" element={<CivicEyeHome/>}></Route>

        <Route path="/login" element={<CivicEyeLoginPage/>}></Route>
        <Route path="/signup" element={<CivicEyeSignUp/>}></Route>

        <Route path="/home" element={<CivicEyeHome/>}></Route>
        <Route path="/userhome" element={<CivicEyeUserHome/>}></Route>
        <Route path="/userprofile" element={<CivicEyeUserprofile/>}></Route>

        <Route path="/registercomplaint" element={<CivicEyeRegisterComplaint/>}></Route>
        <Route path="/complaintlist" element={<CivicEyeComplaintList/>}></Route>
        <Route path="/complaintdetail/:id" element={<CivicEyeComplaintDetails/>}></Route>

        <Route path="/complaintmanagement" element={<CiviEyeComplaintManagement/>}></Route>
        <Route path="/usermanagement" element={<CivicEyeUserManagement/>}></Route>
        <Route path="/overview" element={<CivicEyeOverview/>}></Route>
        <Route path="/feedbackmanagement" element={<CivicEyeFeedbackManagement/>}></Route>
        <Route path="/admincomplaintdetail/:id" element={<AdminComplaintDetail/>}></Route>
        <Route path="/user/details/:id" element={<UserDetails/>}></Route>
        <Route path="/adminfeedbackdetails/:id" element={<AdminFeedbackDetails/>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

