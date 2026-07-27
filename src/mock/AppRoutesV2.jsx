// ============================================================
// APP ROUTES V2 — Prototype routes
// ============================================================
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayoutV2, CitizenLayout } from './layouts/Layouts';

// Citizen pages
import SubmitComplaint from '../pages-v2/citizen/SubmitComplaint';
import MyComplaints from '../pages-v2/citizen/MyComplaints';
import CitizenComplaintDetail from '../pages-v2/citizen/CitizenComplaintDetail';

// Admin pages
import ComplaintList from '../pages-v2/admin/ComplaintList';
import ComplaintDetail from '../pages-v2/admin/ComplaintDetail';
import ExtensionList from '../pages-v2/admin/ExtensionList';
import ExtensionDetail from '../pages-v2/admin/ExtensionDetail';

// Dashboard pages
import DashboardOverview from '../pages-v2/dashboard/DashboardOverview';
import DashboardNeighborhood from '../pages-v2/dashboard/DashboardNeighborhood';
import DashboardLargeScreen from '../pages-v2/dashboard/DashboardLargeScreen';

// Placeholder
import PlaceholderPage from '../pages-v2/PlaceholderPage';

// Bản đồ số
import DigitalMap from '../pages-v2/map/DigitalMap';

export default function AppRoutesV2() {
  return (
    <Routes>
      {/* Citizen routes */}
      <Route element={<CitizenLayout />}>
        <Route path="/" element={<SubmitComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/complaint/:id" element={<CitizenComplaintDetail />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminLayoutV2 />}>
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/neighborhood" element={<DashboardNeighborhood />} />
        <Route path="/dashboard/large-screen" element={<DashboardLargeScreen />} />
        <Route path="/admin/complaints" element={<ComplaintList />} />
        <Route path="/admin/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/admin/extensions" element={<ExtensionList />} />
        <Route path="/admin/extensions/:id" element={<ExtensionDetail />} />
        <Route path="/admin/digital-map" element={<DigitalMap />} />
        <Route path="/placeholder" element={<PlaceholderPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
