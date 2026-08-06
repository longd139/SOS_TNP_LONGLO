// ============================================================
// APP ROUTES V2 — Role-based routing, all share AdminLayoutV2
// ============================================================
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayoutV2 } from './layouts/Layouts';
import CitizenLayout from '../citizen/CitizenLayout';
import CitizenHomePage from '../citizen/pages/CitizenHomePage';
import { ProcedureListPage, ProcedureDetailPage, NewsListPage, NewsDetailPage, SubmitComplaintPage, TrackComplaintPage, ComplaintDetailPage, ContactPage, CitizenNotFound } from '../citizen/CitizenPages';
import SatisfactionPage from '../citizen/pages/SatisfactionPage';
import { CitizenGuidePage, PublicServicesPage, ReceptionSchedulePage } from '../citizen/pages/CitizenServicePages';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Auth/Login';
import DashboardOverview from '../pages-v2/dashboard/DashboardOverview';
import PlaceholderPage from '../pages-v2/PlaceholderPage';

const DigitalLibraryPage = lazy(() => import('../citizen/pages/DigitalLibraryPage'));
const ComplaintList = lazy(() => import('../pages-v2/admin/ComplaintList'));
const ComplaintDetail = lazy(() => import('../pages-v2/admin/ComplaintDetail'));
const ExtensionList = lazy(() => import('../pages-v2/admin/ExtensionList'));
const ExtensionDetail = lazy(() => import('../pages-v2/admin/ExtensionDetail'));
const DashboardLargeScreen = lazy(() => import('../pages-v2/dashboard/DashboardLargeScreen'));
const DigitalMap = lazy(() => import('../pages/DigitalMap/DigitalMap'));
const HistoryDocs = lazy(() => import('../pages-v2/admin/HistoryDocs'));
const LegalDocs = lazy(() => import('../pages-v2/admin/LegalDocs'));
const AppDownloadStatistics = lazy(() => import('../pages/Statistic/AppDownloadStatistics'));
const SatisfactionDashboard = lazy(() => import('../pages-v2/admin/SatisfactionDashboard'));

function RoleHome() {
  return <Navigate to="/cong-dong" replace />;
}

export default function AppRoutesV2() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải trang...</div>}>
    <Routes>
      <Route path="/" element={<RoleHome />} />
      <Route element={<CitizenLayout />}>
        <Route path="/cong-dong" element={<CitizenHomePage />} />
        <Route path="/cong-dong/thu-tuc" element={<ProcedureListPage />} />
        <Route path="/cong-dong/thu-tuc/:id" element={<ProcedureDetailPage />} />
        <Route path="/cong-dong/tin-tuc" element={<NewsListPage />} />
        <Route path="/cong-dong/tin-tuc/:id" element={<NewsDetailPage />} />
        <Route path="/cong-dong/gui-phan-anh" element={<SubmitComplaintPage />} />
        <Route path="/submit" element={<Navigate to="/cong-dong/gui-phan-anh" replace />} />
        <Route path="/my-complaints" element={<Navigate to="/cong-dong/tra-cuu" replace />} />
        <Route path="/cong-dong/phan-anh" element={<Navigate to="/cong-dong/gui-phan-anh" replace />} />
        <Route path="/cong-dong/tra-cuu" element={<TrackComplaintPage />} />
        <Route path="/cong-dong/tra-cuu/:code" element={<ComplaintDetailPage />} />
        <Route path="/cong-dong/danh-gia/:code" element={<SatisfactionPage />} />
        <Route path="/cong-dong/lien-he" element={<ContactPage />} />
        <Route path="/cong-dong/dich-vu-cong" element={<PublicServicesPage />} />
        <Route path="/cong-dong/lich-tiep-dan" element={<ReceptionSchedulePage />} />
        <Route path="/cong-dong/huong-dan" element={<CitizenGuidePage />} />
        <Route path="/cong-dong/thu-vien-so" element={<DigitalLibraryPage />} />
        <Route path="/cong-dong/ban-do-so" element={<DigitalMap />} />
        <Route path="/cong-dong/*" element={<CitizenNotFound />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/can-bo/dang-nhap" element={<Login />} />
      </Route>
      <Route element={<AdminLayoutV2 />}>
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/neighborhood" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/large-screen" element={<DashboardLargeScreen />} />
        <Route path="/admin/complaints" element={<ComplaintList />} />
        <Route path="/admin/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/admin/extensions" element={<ExtensionList />} />
        <Route path="/admin/extensions/:id" element={<ExtensionDetail />} />
        <Route path="/admin/digital-map" element={<DigitalMap />} />
        <Route path="/admin/app-statistics" element={<AppDownloadStatistics />} />
        <Route path="/admin/satisfaction" element={<SatisfactionDashboard />} />
        <Route path="/admin/documents/history" element={<HistoryDocs />} />
        <Route path="/admin/documents/legal" element={<LegalDocs />} />
        <Route path="/placeholder" element={<PlaceholderPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
