import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import { ROLE } from "../constants/role";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ReportList from "../pages/Reports/ReportList";
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
import Statistics from "../pages/Statistic/Statistic";
import ROUTE_PATH from "../constants/routes";
import ReportAreasManagement from "../pages/ReportAreas/ReportAreasManagement";
import AreaManagement from "../pages/Areas/AreaManagement";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import GovernmentManagement from "../pages/Government/GovernmentManagement";

function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path={ROUTE_PATH.LOGIN} element={<Login />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path={ROUTE_PATH.FORGOT_PASSWORD} element={<ForgotPassword />} />
            </Route>

            <Route element={
                <ProtectedRoute requiredRole={ROLE.ADMIN}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path={ROUTE_PATH.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTE_PATH.REPORT} element={<ReportList />} />
                <Route path={ROUTE_PATH.REPORT_UPDATE} element={<UpdateStatus />} />
                <Route path={ROUTE_PATH.REPORT_STATISTICS} element={<ReportsStatistic />} />
                <Route path={ROUTE_PATH.REPORT_USERS} element={<ReportsUserStat />} />
                <Route path={ROUTE_PATH.REPORT_EXPORT} element={<ExportReport />} />
                <Route path={ROUTE_PATH.NEWS} element={<NewsManager />} />
                <Route path={ROUTE_PATH.PROCEDURES} element={<ProceduresManager />} />
                <Route path={ROUTE_PATH.TEMPLATES} element={<TemplateManager />} />
                <Route path={ROUTE_PATH.CONTACT} element={<ContactInfo />} />
                <Route path={ROUTE_PATH.SCHEDULES} element={<WorkSchedule />} />
                <Route path={ROUTE_PATH.STATISTICS} element={<Statistics />} />
                <Route path={ROUTE_PATH.ACCOUNTS} element={<AdminManager />} />
                <Route path={ROUTE_PATH.REPORT_AREAS} element={<ReportAreasManagement />} />
                <Route path={ROUTE_PATH.AREAS} element={<AreaManagement />} />
                <Route path={ROUTE_PATH.GOVERNMENT} element={<GovernmentManagement />} />
            </Route>

            <Route path={ROUTE_PATH.NOT_FOUND} element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
