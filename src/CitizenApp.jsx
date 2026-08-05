import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CitizenLayout from './citizen/CitizenLayout';
import { CitizenNotFound, ComplaintDetailPage, ContactPage, NewsDetailPage, NewsListPage, ProcedureDetailPage, ProcedureListPage, SubmitComplaintPage, TrackComplaintPage } from './citizen/CitizenPages';
import CitizenHomePage from './citizen/pages/CitizenHomePage';
import CitizenLoginPage from './citizen/pages/CitizenLoginPage';
import { CitizenGuidePage, PublicServicesPage, ReceptionSchedulePage } from './citizen/pages/CitizenServicePages';
import DigitalLibraryPage from './citizen/pages/DigitalLibraryPage';

// Admin - chỉ cần DigitalMap
import { MockProvider } from './mock/MockContext';
import DigitalMap from './pages/DigitalMap/DigitalMap';

export default function CitizenApp() {
  return (
    <MockProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== CITIZEN ROUTES ========== */}
          <Route element={<CitizenLayout />}>
            <Route path="/" element={<CitizenHomePage />} />
            <Route path="/cong-dong" element={<CitizenHomePage />} />
            <Route path="/cong-dong/dang-nhap" element={<CitizenLoginPage />} />
            <Route path="/cong-dong/thu-tuc" element={<ProcedureListPage />} />
            <Route path="/cong-dong/thu-tuc/:id" element={<ProcedureDetailPage />} />
            <Route path="/cong-dong/tin-tuc" element={<NewsListPage />} />
            <Route path="/cong-dong/tin-tuc/:id" element={<NewsDetailPage />} />
            <Route path="/cong-dong/gui-phan-anh" element={<SubmitComplaintPage />} />
            <Route path="/cong-dong/tra-cuu" element={<TrackComplaintPage />} />
            <Route path="/cong-dong/tra-cuu/:code" element={<ComplaintDetailPage />} />
            <Route path="/cong-dong/lien-he" element={<ContactPage />} />
            <Route path="/cong-dong/dich-vu-cong" element={<PublicServicesPage />} />
            <Route path="/cong-dong/lich-tiep-dan" element={<ReceptionSchedulePage />} />
            <Route path="/cong-dong/huong-dan" element={<CitizenGuidePage />} />
            <Route path="/cong-dong/thu-vien-so" element={<DigitalLibraryPage />} />
            <Route path="/cong-dong/ban-do-so" element={<DigitalMap />} />
          </Route>

          {/* ========== 404 ========== */}
          <Route path="*" element={<CitizenNotFound />} />
        </Routes>
      </BrowserRouter>
    </MockProvider>
  );
}
