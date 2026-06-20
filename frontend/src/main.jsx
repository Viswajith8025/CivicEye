import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext.jsx";
import { PrivateRoute } from "./PrivateRoute.jsx";
import { LoadingSpinner } from "./components/ui/LoadingSpinner.jsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";
import { queryClient } from "./lib/queryClient.js";

const CivicEyeForgotPassword = lazy(() => import("./CivicEyeForgotPassword.jsx").then((m) => ({ default: m.CivicEyeForgotPassword })));
const CivicEyeResetPassword = lazy(() => import("./CivicEyeResetPassword.jsx").then((m) => ({ default: m.CivicEyeResetPassword })));
const CivicEyeLoginPage = lazy(() => import("./CivicEyeLoginPage.jsx").then((m) => ({ default: m.CivicEyeLoginPage })));
const CivicEyeSignUp = lazy(() => import("./CivicEyeSignUp.jsx").then((m) => ({ default: m.CivicEyeSignUp })));
const CivicEyeHome = lazy(() => import("./CivicEyeHome.jsx").then((m) => ({ default: m.CivicEyeHome })));
const CivicEyeAboutPage = lazy(() => import("./CivicEyeAboutPage.jsx").then((m) => ({ default: m.CivicEyeAboutPage })));
const CivicEyeUserHome = lazy(() => import("./CivicEyeUserHome.jsx").then((m) => ({ default: m.CivicEyeUserHome })));
const CivicEyeUserprofile = lazy(() => import("./CivicEyeUserprofile.jsx").then((m) => ({ default: m.CivicEyeUserprofile })));
const CivicEyeLeaderboard = lazy(() => import("./CivicEyeLeaderboard.jsx").then((m) => ({ default: m.CivicEyeLeaderboard })));
const CivicEyeCommunity = lazy(() => import("./CivicEyeCommunity.jsx").then((m) => ({ default: m.CivicEyeCommunity })));
const CivicEyeCommunityDetail = lazy(() => import("./CivicEyeCommunityDetail.jsx").then((m) => ({ default: m.CivicEyeCommunityDetail })));
const CivicEyeNotifications = lazy(() => import("./CivicEyeNotifications.jsx").then((m) => ({ default: m.CivicEyeNotifications })));
const CivicEyeRewards = lazy(() => import("./CivicEyeRewards.jsx").then((m) => ({ default: m.CivicEyeRewards })));
const CivicEyeFeedback = lazy(() => import("./CivicEyeFeedback.jsx").then((m) => ({ default: m.CivicEyeFeedback })));
const CivicEyeRegisterComplaint = lazy(() => import("./complaints/CivicEyeRegisterComplaint.jsx").then((m) => ({ default: m.CivicEyeRegisterComplaint })));
const CivicEyeComplaintList = lazy(() => import("./complaints/CivicEyeComplaintList.jsx").then((m) => ({ default: m.CivicEyeComplaintList })));
const CivicEyeComplaintDetails = lazy(() => import("./complaints/CivicEyeComplaintDetails.jsx").then((m) => ({ default: m.CivicEyeComplaintDetails })));
const CivicEyeOverview = lazy(() => import("./admin/CivicEyeOverview.jsx").then((m) => ({ default: m.CivicEyeOverview })));
const AdminHeatmap = lazy(() => import("./admin/AdminHeatmap.jsx").then((m) => ({ default: m.AdminHeatmap })));
const AdminCategories = lazy(() => import("./admin/AdminCategories.jsx").then((m) => ({ default: m.AdminCategories })));
const AdminDepartments = lazy(() => import("./admin/AdminDepartments.jsx").then((m) => ({ default: m.AdminDepartments })));
const CivicEyeComplaintManagement = lazy(() => import("./admin/CivicEyeComplaintManagement.jsx").then((m) => ({ default: m.CivicEyeComplaintManagement })));
const AdminComplaintDetail = lazy(() => import("./admin/AdminComplaintDetail.jsx").then((m) => ({ default: m.AdminComplaintDetail })));
const CivicEyeUserManagement = lazy(() => import("./admin/CivicEyeUserManagement.jsx").then((m) => ({ default: m.CivicEyeUserManagement })));
const UserDetails = lazy(() => import("./admin/UserDetails.jsx").then((m) => ({ default: m.UserDetails })));
const CivicEyeFeedbackManagement = lazy(() => import("./admin/CivicEyeFeedbackManagement.jsx").then((m) => ({ default: m.CivicEyeFeedbackManagement })));
const AdminFeedbackDetails = lazy(() => import("./admin/AdminFeedbackDetails.jsx").then((m) => ({ default: m.AdminFeedbackDetails })));
const NotFoundPage = lazy(() => import("./NotFoundPage.jsx").then((m) => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgColor dark:bg-slate-950">
      <LoadingSpinner message="Loading..." />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<CivicEyeHome />} />
              <Route path="/about" element={<CivicEyeAboutPage />} />
              <Route path="/login" element={<CivicEyeLoginPage />} />
              <Route path="/forgot-password" element={<CivicEyeForgotPassword />} />
              <Route path="/reset-password" element={<CivicEyeResetPassword />} />
              <Route path="/signup" element={<CivicEyeSignUp />} />
              <Route path="/home" element={<Navigate to="/" replace />} />

              <Route path="/userhome" element={<PrivateRoute requiredRole="user"><CivicEyeUserHome /></PrivateRoute>} />
              <Route path="/userprofile" element={<PrivateRoute requiredRole="user"><CivicEyeUserprofile /></PrivateRoute>} />
              <Route path="/community" element={<PrivateRoute requiredRole="user"><CivicEyeCommunity /></PrivateRoute>} />
              <Route path="/community/:id" element={<PrivateRoute requiredRole="user"><CivicEyeCommunityDetail /></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute requiredRole="user"><CivicEyeNotifications /></PrivateRoute>} />
              <Route path="/rewards" element={<PrivateRoute requiredRole="user"><CivicEyeRewards /></PrivateRoute>} />
              <Route path="/feedback" element={<PrivateRoute requiredRole="user"><CivicEyeFeedback /></PrivateRoute>} />
              <Route path="/leaderboard" element={<PrivateRoute requiredRole="user"><CivicEyeLeaderboard /></PrivateRoute>} />
              <Route path="/registercomplaint" element={<PrivateRoute requiredRole="user"><CivicEyeRegisterComplaint /></PrivateRoute>} />
              <Route path="/complaintlist" element={<PrivateRoute requiredRole="user"><CivicEyeComplaintList /></PrivateRoute>} />
              <Route path="/complaintdetail/:id" element={<PrivateRoute requiredRole="user"><CivicEyeComplaintDetails /></PrivateRoute>} />

              <Route path="/overview" element={<PrivateRoute requiredRole="admin"><CivicEyeOverview /></PrivateRoute>} />
            <Route path="/heatmap" element={<PrivateRoute requiredRole="admin"><AdminHeatmap /></PrivateRoute>} />
            <Route path="/departments" element={<PrivateRoute requiredRole="admin"><AdminDepartments /></PrivateRoute>} />
            <Route path="/categories" element={<PrivateRoute requiredRole="admin"><AdminCategories /></PrivateRoute>} />
            <Route path="/complaintmanagement" element={<PrivateRoute requiredRole="admin"><CivicEyeComplaintManagement /></PrivateRoute>} />
              <Route path="/usermanagement" element={<PrivateRoute requiredRole="admin"><CivicEyeUserManagement /></PrivateRoute>} />
              <Route path="/feedbackmanagement" element={<PrivateRoute requiredRole="admin"><CivicEyeFeedbackManagement /></PrivateRoute>} />
              <Route path="/admincomplaintdetail/:id" element={<PrivateRoute requiredRole="admin"><AdminComplaintDetail /></PrivateRoute>} />
              <Route path="/user/details/:id" element={<PrivateRoute requiredRole="admin"><UserDetails /></PrivateRoute>} />
              <Route path="/adminfeedbackdetails/:id" element={<PrivateRoute requiredRole="admin"><AdminFeedbackDetails /></PrivateRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
