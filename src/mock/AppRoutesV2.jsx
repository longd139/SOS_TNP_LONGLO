// ============================================================
// APP ROUTES V2 — Role-based routing, all share AdminLayoutV2
// ============================================================
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayoutV2 } from './layouts/Layouts';
import { useMock } from './MockContext';
import CitizenLayout from '../citizen/CitizenLayout';
import { CitizenHome, ProcedureListPage, ProcedureDetailPage, NewsListPage, NewsDetailPage, SubmitComplaintPage, TrackComplaintPage, ContactPage, CitizenNotFound } from '../citizen/CitizenPages';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Auth/Login';

import ComplaintList from '../pages-v2/admin/ComplaintList';
import ComplaintDetail from '../pages-v2/admin/ComplaintDetail';
import ExtensionList from '../pages-v2/admin/ExtensionList';
import ExtensionDetail from '../pages-v2/admin/ExtensionDetail';
import DashboardOverview from '../pages-v2/dashboard/DashboardOverview';
import DashboardNeighborhood from '../pages-v2/dashboard/DashboardNeighborhood';
import DashboardLargeScreen from '../pages-v2/dashboard/DashboardLargeScreen';
import PlaceholderPage from '../pages-v2/PlaceholderPage';
import DigitalMap from '../pages/DigitalMap/DigitalMap';
import HistoryDocs from '../pages-v2/admin/HistoryDocs';
import LegalDocs from '../pages-v2/admin/LegalDocs';

const ROLE_HOME = {
  CITIZEN: '/submit',
  RECEPTION_OFFICER: '/admin/complaints',
  PROCESSING_OFFICER: '/admin/complaints',
  APPROVER: '/dashboard',
  LEADER: '/dashboard',
  ADMIN: '/dashboard',
};

function RoleHome() {
  const { currentUser } = useMock();
  return <Navigate to="/cong-dong" replace />;
}

export default function AppRoutesV2() {
  return (
    <Routes>
      <Route path="/" element={<RoleHome />} />
      <Route element={<CitizenLayout />}>
        <Route path="/cong-dong" element={<CitizenHome />} />
        <Route path="/cong-dong/thu-tuc" element={<ProcedureListPage />} />
        <Route path="/cong-dong/thu-tuc/:id" element={<ProcedureDetailPage />} />
        <Route path="/cong-dong/tin-tuc" element={<NewsListPage />} />
        <Route path="/cong-dong/tin-tuc/:id" element={<NewsDetailPage />} />
        <Route path="/cong-dong/gui-phan-anh" element={<SubmitComplaintPage />} />
        <Route path="/cong-dong/tra-cuu" element={<TrackComplaintPage />} />
        <Route path="/cong-dong/lien-he" element={<ContactPage />} />
        <Route path="/cong-dong/*" element={<CitizenNotFound />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/can-bo/dang-nhap" element={<Login />} />
      </Route>
      <Route element={<AdminLayoutV2 />}>
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/neighborhood" element={<DashboardNeighborhood />} />
        <Route path="/dashboard/large-screen" element={<DashboardLargeScreen />} />
        <Route path="/admin/complaints" element={<ComplaintList />} />
        <Route path="/admin/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/admin/extensions" element={<ExtensionList />} />
        <Route path="/admin/extensions/:id" element={<ExtensionDetail />} />
        <Route path="/admin/digital-map" element={<DigitalMap />} />
        <Route path="/admin/documents/history" element={<HistoryDocs />} />
        <Route path="/admin/documents/legal" element={<LegalDocs />} />
        <Route path="/placeholder" element={<PlaceholderPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
