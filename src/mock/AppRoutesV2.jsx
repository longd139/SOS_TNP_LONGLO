// ============================================================
// APP ROUTES V2 — Role-based routing, all share AdminLayoutV2
// ============================================================
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayoutV2 } from './layouts/Layouts';
import { useMock } from './MockContext';
import CitizenLayout from '../citizen/CitizenLayout';
import RegisterLeaderMeeting from '../pages-v2/citizen/RegisterLeaderMeeting';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Auth/Login';
import DashboardOverview from '../pages-v2/dashboard/DashboardOverview';
import PlaceholderPage from '../pages-v2/PlaceholderPage';
import AddSchedule from '../pages-v2/admin/AddSchedule';
import ApproveSchedule from '../pages-v2/admin/ApproveSchedule';
import FeedbackKiosk from '../pages-v2/kiosk/FeedbackKiosk';

// Lazy-loaded citizen pages
const CitizenHomePage = lazy(() => import('../citizen/pages/CitizenHomePage'));
const ProcedureListPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.ProcedureListPage })));
const ProcedureDetailPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.ProcedureDetailPage })));
const NewsListPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.NewsListPage })));
const NewsDetailPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.NewsDetailPage })));
const SubmitComplaintPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.SubmitComplaintPage })));
const TrackComplaintPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.TrackComplaintPage })));
const ComplaintDetailPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.ComplaintDetailPage })));
const ContactPage = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.ContactPage })));
const CitizenNotFound = lazy(() => import('../citizen/CitizenPages').then(m => ({ default: m.CitizenNotFound })));
const SatisfactionPage = lazy(() => import('../citizen/pages/SatisfactionPage'));
const CitizenGuidePage = lazy(() => import('../citizen/pages/CitizenServicePages').then(m => ({ default: m.CitizenGuidePage })));
const PublicServicesPage = lazy(() => import('../citizen/pages/CitizenServicePages').then(m => ({ default: m.PublicServicesPage })));
const ReceptionSchedulePage = lazy(() => import('../citizen/pages/CitizenServicePages').then(m => ({ default: m.ReceptionSchedulePage })));

const DigitalLibraryPage = lazy(() => import('../citizen/pages/DigitalLibraryPage'));
const ComplaintList = lazy(() => import('../pages-v2/admin/ComplaintList'));
const ComplaintDetail = lazy(() => import('../pages-v2/admin/ComplaintDetail'));
const ExtensionList = lazy(() => import('../pages-v2/admin/ExtensionList'));
const ExtensionDetail = lazy(() => import('../pages-v2/admin/ExtensionDetail'));
const DashboardLargeScreen = lazy(() => import('../pages-v2/dashboard/DashboardLargeScreen'));
const DigitalMap = lazy(() => import('../pages/DigitalMap/DigitalMap'));

function DigitalMapPlaceholder() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ fontSize: 18, color: '#6b7280', fontWeight: 500 }}>Chờ thông tin</p>
    </div>
  );
}
const HistoryDocs = lazy(() => import('../pages-v2/admin/HistoryDocs'));
const LegalDocs = lazy(() => import('../pages-v2/admin/LegalDocs'));
const AppDownloadStatistics = lazy(() => import('../pages/Statistic/AppDownloadStatistics'));
const ReceptionKiosk = lazy(() => import('../pages-v2/kiosk/ReceptionKiosk'));
const SatisfactionDashboard = lazy(() => import('../pages-v2/admin/SatisfactionDashboard'));
const CounterReceptionFeedbackPage = lazy(() => import('../pages-v2/admin/CounterReceptionFeedbackPage'));
const LeaderMeetingFeedbackPage = lazy(() => import('../pages-v2/admin/LeaderMeetingFeedbackPage'));

function RoleHome() {
  return <Navigate to="/cong-dong" replace />;
}

function ScheduleRoleGuard({ children }) {
  const { currentUser } = useMock();
  const allowed = ['APPROVER', 'LEADER', 'ADMIN'].includes(currentUser?.role);
  return allowed ? children : <Navigate to="/dashboard" replace />;
}

export default function AppRoutesV2() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải trang...</div>}>
    <Routes>
      <Route path="/" element={<RoleHome />} />
      <Route path="/register-meeting" element={<RegisterLeaderMeeting />} />
      <Route path="/kiosk/tiep-dan" element={<ReceptionKiosk />} />
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
        <Route path="/cong-dong/ban-do-so" element={<DigitalMapPlaceholder />} />
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
        <Route path="/admin/counter-reception-feedback" element={<CounterReceptionFeedbackPage />} />
        <Route path="/admin/leader-meeting-feedback" element={<LeaderMeetingFeedbackPage />} />
        <Route path="/admin/documents/history" element={<HistoryDocs />} />
        <Route path="/admin/documents/legal" element={<LegalDocs />} />
        <Route path="/admin/schedules/approve" element={<ScheduleRoleGuard><ApproveSchedule /></ScheduleRoleGuard>} />
        <Route path="/admin/schedules/add" element={<ScheduleRoleGuard><AddSchedule /></ScheduleRoleGuard>} />
        <Route path="/placeholder" element={<PlaceholderPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
