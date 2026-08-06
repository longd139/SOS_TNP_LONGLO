import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CitizenLayout from './citizen/CitizenLayout';
import { CitizenNotFound, ComplaintDetailPage, ComplaintPage, ContactPage, NewsDetailPage, NewsListPage, ProcedureDetailPage, ProcedureListPage } from './citizen/CitizenPages';
import CitizenHomePage from './citizen/pages/CitizenHomePage';
import CitizenLoginPage from './citizen/pages/CitizenLoginPage';
import { CitizenGuidePage, PublicServicesPage, ReceptionSchedulePage } from './citizen/pages/CitizenServicePages';
import DigitalLibraryPage from './citizen/pages/DigitalLibraryPage';

export default function CitizenApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CitizenLayout />}>
          <Route path="/" element={<CitizenHomePage />} />
          <Route path="/cong-dong" element={<CitizenHomePage />} />
          <Route path="/cong-dong/dang-nhap" element={<CitizenLoginPage />} />
          <Route path="/cong-dong/thu-tuc" element={<ProcedureListPage />} />
          <Route path="/cong-dong/thu-tuc/:id" element={<ProcedureDetailPage />} />
          <Route path="/cong-dong/tin-tuc" element={<NewsListPage />} />
          <Route path="/cong-dong/tin-tuc/:id" element={<NewsDetailPage />} />
          <Route path="/cong-dong/phan-anh" element={<ComplaintPage />} />
          <Route path="/cong-dong/phan-anh/:code" element={<ComplaintDetailPage />} />
          <Route path="/cong-dong/lien-he" element={<ContactPage />} />
          <Route path="/cong-dong/dich-vu-cong" element={<PublicServicesPage />} />
          <Route path="/cong-dong/lich-tiep-dan" element={<ReceptionSchedulePage />} />
          <Route path="/cong-dong/huong-dan" element={<CitizenGuidePage />} />
          <Route path="/cong-dong/thu-vien-so" element={<DigitalLibraryPage />} />
          <Route path="*" element={<CitizenNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
