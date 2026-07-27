// ============================================================
// APP ROUTES V2 — Role-based routing, all share AdminLayoutV2
// ============================================================
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayoutV2 } from './layouts/Layouts';
import { useMock } from './MockContext';

import SubmitComplaint from '../pages-v2/citizen/SubmitComplaint';
import MyComplaints from '../pages-v2/citizen/MyComplaints';
import CitizenComplaintDetail from '../pages-v2/citizen/CitizenComplaintDetail';
import ComplaintList from '../pages-v2/admin/ComplaintList';
import ComplaintDetail from '../pages-v2/admin/ComplaintDetail';
import ExtensionList from '../pages-v2/admin/ExtensionList';
import ExtensionDetail from '../pages-v2/admin/ExtensionDetail';
import DashboardOverview from '../pages-v2/dashboard/DashboardOverview';
import DashboardNeighborhood from '../pages-v2/dashboard/DashboardNeighborhood';
import DashboardLargeScreen from '../pages-v2/dashboard/DashboardLargeScreen';
import PlaceholderPage from '../pages-v2/PlaceholderPage';
import DigitalMap from '../pages-v2/map/DigitalMap';
import InternalDocs from '../pages-v2/admin/InternalDocs';
import PublicDocs from '../pages-v2/admin/PublicDocs';
import CitizenChatbot from '../pages-v2/citizen/CitizenChatbot';


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
  return <Navigate to={ROLE_HOME[currentUser?.role] || '/submit'} replace />;
}
// Bản đồ số

export default function AppRoutesV2() {
  return (
    <Routes>
      <Route path="/" element={<RoleHome />} />
      <Route element={<AdminLayoutV2 />}>
        <Route path="/submit" element={<SubmitComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/complaint/:id" element={<CitizenComplaintDetail />} />
        <Route path="/admin/chatbot" element={<CitizenChatbot />} />
        <Route path="/chatbot" element={<CitizenChatbot />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/neighborhood" element={<DashboardNeighborhood />} />
        <Route path="/dashboard/large-screen" element={<DashboardLargeScreen />} />
        <Route path="/admin/complaints" element={<ComplaintList />} />
        <Route path="/admin/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/admin/extensions" element={<ExtensionList />} />
        <Route path="/admin/extensions/:id" element={<ExtensionDetail />} />
        <Route path="/admin/digital-map" element={<DigitalMap />} />
        <Route path="/admin/documents/internal" element={<InternalDocs />} />
        <Route path="/admin/documents/public" element={<PublicDocs />} />
        <Route path="/placeholder" element={<PlaceholderPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
