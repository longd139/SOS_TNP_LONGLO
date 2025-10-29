import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROLE } from "../constants/role";

import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ReportList from "../pages/Reports/ReportList";
import ReportDetail from "../pages/Reports/ReportDetail";
import UpdateStatus from "../pages/Reports/UpdateStatus";
import ReportsStatistic from "../pages/Reports/ReportsStatistic";
import ReportsUserStat from "../pages/Reports/ReportsUserStat";
import ExportReport from "../pages/Reports/ExportReport";
import NewsManager from "../pages/News/NewsManager";
import ProceduresManager from "../pages/Procedures/ProceduresManager";
import TemplateManager from "../pages/Templates/TemplateManager";
import ContactInfo from "../pages/Contact/ContactInfo";
import WorkSchedule from "../pages/Schedules/WorkSchedule";
import AdminManager from "../pages/AdminAccounts/AdminManager";
import NotFound from "../pages/NotFound";
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OtpModal from "../pages/Auth/OtpModal";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/OtpModal" element={<OtpModal />} /> 
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        </Route>

        <Route element={
          <ProtectedRoute requiredRole={ROLE.ADMIN}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<ReportList />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/reports/update" element={<UpdateStatus />} />
          <Route path="/reports/statistics" element={<ReportsStatistic />} />
          <Route path="/reports/users" element={<ReportsUserStat />} />
          <Route path="/reports/export" element={<ExportReport />} />
          <Route path="/news" element={<NewsManager />} />
          <Route path="/procedures" element={<ProceduresManager />} />
          <Route path="/templates" element={<TemplateManager />} />
          <Route path="/contact" element={<ContactInfo />} />
          <Route path="/schedules" element={<WorkSchedule />} />
          <Route path="/admins" element={<AdminManager />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
